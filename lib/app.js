"use strict";

var fs = require("fs")
var url = require("url")
var revalidator = require("revalidator")
var isURL = require("is-url")
var schema = require("./schema")

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
      return revalidator.validate(this, schema).valid
    })

    this.__defineGetter__("errors", function(){
      return revalidator.validate(this, schema).errors
    })

    this.__defineGetter__("errorString", function(){
      return this.errors.map(function(error) {
        return ["-", error.property, error.message].join(" ")
      }).join("\n")
    })

    this.__defineGetter__("toJSON", function(){
      var key
      var out = {}
      var validProps = Object.keys(schema.properties)
      for (key in this) {
        if (this.hasOwnProperty(key) && validProps.indexOf(key) > -1) {
          out[key] = this[key]
        }
      }
      return JSON.stringify(out, null, 2)
    })

    return this
  }

  App.new = function(raw) {
    return new App(raw)
  }

  App.example = new App(schema.example)
  App.schema = schema

  return App

})()
