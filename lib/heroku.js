"use strict"
var fs = require("fs")
var url = require("url")
var gh = require("github-url-to-object")
var superagent = require("superagent")
var flatten = require("flatten")
var redact = require("redact-url")
var ini = require("ini")

var Heroku = module.exports = {}

Heroku.clone = function(repo_url, cb) {

  // MAKE THIS AN EVENT EMITTER!

  if (!gh(repo_url)) return cb(new Error("repo_url is required and must be a GitHub URL."))
  this.client.post("/app-setups/", {source_blob:{url:gh(repo_url).tarball_url}}, function(err, body) {
    return (err) ? cb(err) : cb(null, body)
  })
}

Heroku.getBuildStatus = function(build_id, cb) {
  if (!build_id) return cb(new Error("build_id required"))
  this.client.get("/app-setups/"+build_id, function(err, build) {
    return (err) ? cb(err) : cb(null, build)
  })
}

Heroku.deriveAddonsAndEnv = function(app_name, cb) {
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

    res.addons = addons.map(function(addon) { return addon.plan.name })

    Heroku.client.get("/apps/" + app_name + "/config-vars", function(err, vars) {
      if (err) return cb(err)
      var key, value
      for (key in vars) {
        value = vars[key]
        if (configVarsCreatedByAddons.indexOf(key) === -1) {
          // Redact things with secret-sounding names
          if (key.match(/secret|pass|token|key/i)) value = "REDACTED"
          res.env[key] = redact(value)
        }
      }
      return cb(null, res)
    })
  })
}

Heroku.deriveAppNamesFromLocalGitConfig = function(cb) {

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

Heroku.__defineGetter__("token", function(){
  // Look for user-specified override
  if (this.tokenOverride) return this.tokenOverride

  // Look for environment variable
  if (process.env.HEROKU_API_KEY) return process.env.HEROKU_API_KEY

  // Look in ~/.netrc
  var creds = require('netrc')()['api.heroku.com']
  if (creds && creds.password) return creds.password

  // Fail
  throw new Error("Heroku API key not found in environment or ~/.netrc file")
})

Heroku.__defineSetter__("token", function(token) {
  this.tokenOverride = token
})

Heroku.client = require("heroku-client").createClient({token: Heroku.token})
