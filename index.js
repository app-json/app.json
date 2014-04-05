var fs = require("fs")
var schema = require('./schema')
var revalidator = require('revalidator')

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
    // Can't stringify `this`, so rebuild self
    var out = {}
    for (key in this) {
      if (this.hasOwnProperty(key)) {
        out[key] = this[key]
      }
    }
    return JSON.stringify(out, null, 2)
  }

  return Manifest

})()
