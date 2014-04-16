var fs = require("fs")
var schema = require('./schema')
var request = require('superagent')
var revalidator = require('revalidator')
var parseGithubURL = require("github-url-to-object")

var http = require('http')

var Manifest = module.exports = (function() {

  function Manifest(raw) {

    // If raw is a filename open it and parse it
    // If raw is a JSON string, parse it
    // If raw is already an object, we're good
    if (typeof(raw) === 'string' && raw.match(/\.json$/i)) {
      raw = JSON.parse(fs.readFileSync(raw))
    } else if (typeof(raw) === 'string') {
      raw = JSON.parse(raw)
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
      var e = this.validate().errors
      if (e.length === 0) return null
      return e
    })

    return this
  }

  Manifest.prototype.validate = function() {
    return revalidator.validate(this, schema)
  }

  Manifest.prototype.toJSON = function() {
    var out = {}
    var validProps = Object.keys(schema.properties)
    for (key in this) {
      if (this.hasOwnProperty(key) && validProps.indexOf(key) > -1) {
        out[key] = this[key]
      }
    }
    return JSON.stringify(out, null, 2)
  }

  Manifest.prototype.getAddonsPrices = function(cb) {
    var url = "https://concoction.herokuapp.com/?slugs=" + this.addons.join(",")
    request.get(url, function(res){
      cb(null, res.body)
    })
  }

  Manifest.fetch = function(url, cb) {
    if (!parseGithubURL(url)) {
      return cb("not a validate github url: " + url)
    }

    var user = parseGithubURL(url).user
    var repo = parseGithubURL(url).repo
    var proxy_url = "http://github-raw-cors-proxy.herokuapp.com/" + user + "/" + repo + "/blob/master/app.json"

    request.get(proxy_url, function(res){
      cb(null, new Manifest(res.body))
    })

  }

  Manifest.example = {}
  Object.keys(schema.properties).map(function(key){
    Manifest.example[key] = schema.properties[key].example
  })
  Manifest.example = new Manifest(Manifest.example)

  return Manifest

})()
