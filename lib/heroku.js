"use strict"
var fs = require("fs")
var url = require("url")
var isURL = require("is-url")
var gh = require("github-url-to-object")
var bb = require("bitbucket-url-to-object")
var superagent = require("superagent")
var flatten = require("flatten")
var redact = require("redact-url")
var ini = require("ini")
var events = require("events")

var Heroku = module.exports = (function() {

  function Heroku(token) {
    this.token = token || Heroku.deriveToken()
    this.client = require("heroku-client").createClient({
      token: this.token
    })
  }

  Heroku.prototype = new events.EventEmitter

  Heroku.deriveToken = function() {
    // Look for HEROKU_API_KEY environment variable
    if (process.env.HEROKU_API_KEY) return process.env.HEROKU_API_KEY

    // Look in ~/.netrc
    var creds = require('netrc')()['api.heroku.com']
    if (creds && creds.password) return creds.password

    // Fail
    throw new Error("Heroku API key not found in environment or ~/.netrc file")
  }

  Heroku.prototype.clone = function(repo_url, app_name) {
    var _this = this
    var pollInterval
    var build

    // Normalize Github URLs into tarball URLs
    if (gh(repo_url)) repo_url = gh(repo_url).tarball_url

    // Normalize Bitbucket URLs into tarball URLs
    if (bb(repo_url)) repo_url = bb(repo_url).tarball_url

    if (!isURL(repo_url)) {
      this.emit("error", "repo_url must be a fully-qualified URL or shorthand string like 'github:user/repo' or 'bitbucket:user/repo#branch'")
      return
    }

    var payload = {
      source_blob: {
        url: repo_url
      }
    }

    if (app_name) payload.app = {name: app_name}

    this.emit("start", payload)

    var poll = function() {

      _this.client.get("/app-setups/" + build.id, function(err, b) {
        if (err) {
          if (err.body && err.body.message) err = err.body.message
          return _this.emit("error", err)
        }
        build = b

        switch (build.status) {
          case "pending":
            _this.emit("pending", build)
            break
          case "failed":
            clearInterval(pollInterval)
            if (!_this.done) _this.emit("error", build.failure_message)
            _this.done = true
            break
          case "succeeded":
            clearInterval(pollInterval)
            if (!_this.done) _this.emit("succeeded", build)
            _this.done = true
            break
        }

      })
    }

    this.client.post("/app-setups/", payload, function(err, b) {
      if (err) {
        if (err.body && err.body.message) err = err.body.message
        return _this.emit("error", err)
      }

      build = b
      _this.emit("create", build)
      pollInterval = setInterval(poll, 1000)
    })

  }


  Heroku.prototype.deriveAddonsAndEnv = function(app_name, cb) {
    var _this = this
    var res = {
      addons: [],
      env: {}
    }

    this.client.get("/apps/" + app_name + "/addons", function(err, addons) {
      if (err) return cb(err)

      var configVarsCreatedByAddons = flatten(addons.map(function(addon) {
        return addon.config_vars
      }))

      // Special case for Heroku Postgres
      configVarsCreatedByAddons.push("DATABASE_URL")

      res.addons = addons.map(function(addon) {
        return addon.plan.name
      })

      _this.client.get("/apps/" + app_name + "/config-vars", function(err, vars) {
        if (err) return cb(err)
        var key, value
        for (key in vars) {
          value = vars[key]
          if (configVarsCreatedByAddons.indexOf(key) === -1) {
            // Redact things with secret-sounding names
            if (key.match(/secret|pass|token|key|pwd/i)) value = "REDACTED"
            res.env[key] = redact(value)
          }
        }
        return cb(null, res)
      })
    })
  }

  Heroku.prototype.deriveAppNamesFromLocalGitConfig = function(cb) {

    if (!fs.existsSync(process.cwd() + "/.git/config"))
      return cb(null, [])

    var config = ini.parse(fs.readFileSync(process.cwd() + "/.git/config").toString())

    var names = Object.keys(config)
      .filter(function(key) {
        return config[key].url && config[key].url.match(/heroku\.com/)
      })
      .map(function(key) {
        return config[key].url.match(/git@heroku\.com:(.*)\.git/)[1]
      })

    return cb(null, names)
  }

  Heroku.new = function() {
    return new Heroku()
  }

  return Heroku

})()
