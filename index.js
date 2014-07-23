"use strict";

var fs = require("fs")
var url = require("url")
var http = require("http")
var hogan = require("hogan.js")
var github = require("github-url-to-object")
var bitbucket = require("bitbucket-url-to-object")
var superagent = require("superagent")
var addons = require("./lib/addons")
var schema = require("./lib/schema")

var App = module.exports = require("./lib/app")

App.prototype.getAddonPrices = function(cb) {
  var _this = this
  App.addons.getPrices(this.addons, function(err, prices){
    if (err) return cb(err)
    _this.prices = prices
    cb(null, prices)
  })
}

App.fetch = function(repository, cb) {
  if (github(repository)) {
    repository = github(repository)
  } else if (bitbucket(repository)) {
    repository = bitbucket(repository)
  } else {
    return cb("A valid GitHub or Bitbucket URL is required: " + repository)
  }

  var fetcher_url = url.format({
    protocol: "https",
    hostname: "app-json-fetcher.herokuapp.com",
    query: {
      repository: repository.https_url
    }
  })

  superagent.get(fetcher_url, function(res){
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

App.addons = addons
