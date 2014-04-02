var fs = require("fs")
var isUrl = require("is-url")
var steeltoe = require("steeltoe")

var blank = function(thing) {
  return thing && thing !== ""
}

var Manifest = module.exports = (function() {

  function Manifest(payload) {
    if (typeof(payload) === 'string' && payload.match(/\.json$/i)) {
      this.payload = JSON.parse(fs.readFileSync(payload))
    } else if (typeof(payload) === 'string') {
      this.payload = JSON.parse(payload)
    } else if (payload && typeof(payload) === 'object') {
      this.payload = payload
    }
  }

  Manifest.prototype.isValid = function() {
    this.validate()
    return this.errors.length === 0
  }

  Manifest.prototype.validate = function() {
    this.errors = []
    var p = this.payload

    if (!p.name || p.name === "") {
      this.errors.push({
        property: "name",
        message: "name is required"
      })
    }

    if (p.urls.website && !isUrl(p.urls.website)) {
      this.errors.push({
        property: "urls.website",
        message: "urls.website is not a valid URL"
      })
    }

    if (p.urls.source && !isUrl(p.urls.source)) {
      this.errors.push({
        property: "urls.source",
        message: "urls.source is not a valid URL"
      })
    }
    return this
  }

  return Manifest

})()
