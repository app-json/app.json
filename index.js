'use strict'
var fs = require("fs")
var http = require("http")
var hogan = require("hogan.js")
var superagent = require("superagent")
var revalidator = require("revalidator")
var parseGithubURL = require("github-url-to-object")
var addons = require("./lib/addons")
var schema = require("./lib/schema")

var App = module.exports = (function() {

  function App(raw) {
    var key

    if (typeof(raw) === 'string') {

      // Filename?
      if (raw.match(/\.json$/i)) {
        raw = fs.readFileSync(raw)
      }

      try {
        raw = JSON.parse(raw)
      } catch(err) {
        throw new Error("Malformed JSON")
      }
    }

    for (key in raw) {
      if (raw.hasOwnProperty(key)) {
        this[key] = raw[key]
      }
    }

    this.__defineGetter__("valid", function(){
      return this.validate().valid
    })

    this.__defineGetter__("errors", function(){
      return this.validate().errors
    })

    return this
  }

  App.prototype.validate = function() {
    return revalidator.validate(this, schema)
  }

  App.prototype.toJSON = function() {
    var key
    var out = {}
    var validProps = Object.keys(schema.properties)
    for (key in this) {
      if (this.hasOwnProperty(key) && validProps.indexOf(key) > -1) {
        out[key] = this[key]
      }
    }
    return JSON.stringify(out, null, 2)
  }

  App.prototype.getAddonPrices = function(cb) {
    var _this = this
    App.addons.getPrices(this.addons, function(err, prices){
      if (err) return cb(err)
      _this.prices = prices
      cb(null, prices)
    })
  }

  App.new = function(raw) {
    return new App(raw)
  }

  App.fetch = function(url, cb) {
    if (!parseGithubURL(url))
      return cb("Not a valid github URL: " + url)

    var user = parseGithubURL(url).user
    var repo = parseGithubURL(url).repo
    var proxy_url = "https://github-raw-cors-proxy.herokuapp.com/" + user + "/" + repo + "/blob/master/app.json"

    superagent.get(proxy_url, function(res){
      cb(null, App.new(res.body))
    })
  }

  // Hogan Templates FTW
  App.templates = {}
  if (module.parent) {
    App.templates.app = hogan.compile(fs.readFileSync(__dirname + '/templates/app.mustache.html').toString())
    App.templates.build = hogan.compile(fs.readFileSync(__dirname + '/templates/build.mustache.html').toString())
    App.templates.schema = hogan.compile(fs.readFileSync(__dirname + '/templates/schema.mustache.html').toString())
  } else {
    App.templates.app = require('./templates/app.mustache.html')
    App.templates.build = require('./templates/build.mustache.html')
    App.templates.schema = require('./templates/schema.mustache.html')
  }

  App.example = new App(schema.example)
  App.addons = addons
  App.schema = schema

  return App

})()
