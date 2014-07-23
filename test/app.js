"use strict"
var fs = require("fs")
var assert = require("assert")
var util = require("util")
var cheerio = require('cheerio')
var marked = require('marked')
var App = require("../lib/app")
var app
var payload

describe("App", function() {

  beforeEach(function() {
    app = null
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/valid/app.json"))
  })

  describe("App.new", function() {

    it("accepts a filename", function() {
      app = App.new(__dirname + "/fixtures/valid/app.json")
      assert(app.valid)
    })

    it("accepts a JSON string", function() {
      app = App.new(JSON.stringify(payload))
      assert(app.valid)
    })

    it("accepts a JavaScript object", function() {
      app = App.new(payload)
      assert(app.valid)
    })

    it("throws a semi-helpful error when given a filename with malformed JSON", function() {
      assert.throws(
        function() {
          App.new(__dirname + "/fixtures/malformed/app.json")
        },
        /malformed JSON/i
      )
    })

    it("throws a semi-helpful error when given a malformed JSON string", function() {

      assert.throws(
        function() {
          App.new(fs.readFileSync(__dirname + "/fixtures/malformed/app.json").toString())
        },
        /malformed JSON/i
      )
    })

  })

  describe(".errors", function() {

    it("returns an array", function() {
      payload.name = ""
      app = App.new(payload)
      assert(!app.valid)
      assert(util.isArray(app.errors))
    })

    it("doesn't allow a blank string for name", function() {
      payload.name = ""
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors[0].property, 'name')
      assert.equal(app.errors[0].message, "must not be empty")
    })

    it("requires name to be at least three characters", function() {
      payload.name = "Hi"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'name')
      assert.equal(app.errors[0].message, 'is too short (minimum is 3 characters)')
    })

    it("requires name to be fewer than 30 characters", function() {
      payload.name = "12345678901234567890123456789012"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'name')
      assert.equal(app.errors[0].message, 'is too long (maximum is 30 characters)')
    })

    it("requires description to be fewer than 140 characters", function() {
      payload.description = "123456789 123456789 123456789 123456789 123456789 "
      payload.description += "123456789 123456789 123456789 123456789 123456789 "
      payload.description += "123456789 123456789 123456789 123456789 123456789 "
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors[0].property, 'description')
      assert.equal(app.errors[0].message, 'is too long (maximum is 140 characters)')
    })

    it("validates website url format", function() {
      payload.website = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

    it("validates repository url format", function() {
      payload.repository = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'repository')
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

    it("validates logo url format", function() {
      payload.logo = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'logo')
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

    it("returns an empty array if app is valid", function() {
      app = App.new(payload)
      assert(app.valid)
      assert(util.isArray(app.errors))
      assert.equal(app.errors.length, 0)
    })

  })

  describe(".errorString", function() {

    it("returns a newline-delimited string of error messages", function() {
      payload.name = "no"
      payload.website = "not-a-url.com"
      app = App.new(payload)
      assert.equal(app.errors.length, 2)
      assert.equal(app.errorString, "- name is too short (minimum is 3 characters)\n- website is not a valid url")
    })

    it("returns an empty string if app is valid", function() {
      app = App.new(payload)
      assert(app.valid)
      assert.equal(app.errorString, "")
    })

  })

  describe(".toJSON", function() {

    it("returns a pretty JSON string", function() {
      app = App.new(payload)
      assert(app.valid)
      var output = app.toJSON
      var app2 = App.new(output)
      assert.equal(typeof(output), 'string')
      assert(app2.valid)
      assert.equal(app.name, app2.name)
    })

    it("ignores properties that are not in the schema", function() {
      payload.funky = true
      payload.junk = "stuff"

      app = App.new(payload)
      assert(app.valid)
      assert(app.funky)
      assert(app.junk)

      var output = app.toJSON
      var app2 = App.new(output)
      assert.equal(typeof(output), 'string')
      assert(app2.valid)
      assert(!app2.funky)
      assert(!app2.junk)
    })

  })

  // describe(".getAddonPrices()", function() {
  //
  //   it("fetches a remote list of addons and their total price", function(done) {
  //     payload.addons = [
  //       "openredis",
  //       "mongolab:shared-single-small"
  //     ]
  //     app = App.new(payload)
  //     assert(app.valid)
  //     app.getAddonPrices(function(err, prices) {
  //       assert(prices)
  //       assert(prices.totalPrice)
  //       assert(prices.totalPriceInCents)
  //       done()
  //     })
  //   })
  //
  //   it("attaches a prices property to the app object", function(done) {
  //     payload.addons = [
  //       "openredis",
  //       "mongolab:shared-single-small"
  //     ]
  //     app = App.new(payload)
  //     assert(app.valid)
  //     app.getAddonPrices(function(err, prices) {
  //       assert(app.prices)
  //       done()
  //     })
  //   })
  //
  //   it("returns a mocked response for apps that don't have addons", function(done) {
  //     delete payload.addons
  //     app = App.new(payload)
  //     assert(app.valid)
  //     app.getAddonPrices(function(err, prices) {
  //       assert(prices)
  //       assert.equal(prices.totalPrice, "Free")
  //       assert.equal(prices.totalPriceInCents, 0)
  //       assert(util.isArray(prices.plans))
  //       assert.equal(prices.plans.length, 0)
  //       done()
  //     })
  //   })
  //
  // })

  // describe("App.fetch()", function() {
  //
  //   it("downloads remote manifests with github shorthand", function(done) {
  //     App.fetch('zeke/slideshow', function(err, remoteApp) {
  //       assert(remoteApp.valid)
  //       assert.equal(remoteApp.name, "Harp Slideshow")
  //       done()
  //     })
  //   })
  //
  //   it("downloads remote manifests with fully-qualified github URLs", function(done) {
  //     App.fetch('https://github.com/heroku-examples/geosockets.git', function(err, remoteApp) {
  //       if (err) console.error(err)
  //       assert(remoteApp.valid)
  //       assert.equal(remoteApp.name, "Geosockets")
  //       done()
  //     })
  //   })
  //
  //   it("downloads remote manifests with bitbucket shorthand", function(done) {
  //     App.fetch('bitbucket:sikelianos/web-starter-kit', function(err, remoteApp) {
  //       assert(remoteApp.valid)
  //       assert.equal(remoteApp.name, "Google Web Starter Kit")
  //       done()
  //     })
  //   })
  //
  // })

  describe("App.schema", function() {

    it("exposes the schema as an object", function() {
      assert(App.schema)

    })

    it("contains a key-value properties object", function() {
      assert(App.schema.properties)
      assert(App.schema.properties.name)
      assert(App.schema.properties.description)
      assert(App.schema.properties.keywords)
    })


    it("exposes properties as an array for template-friendly rendering", function() {
      assert(App.schema.propertiesArray)
      assert(App.schema.propertiesArray[0].name)
      assert(App.schema.propertiesArray[0].description)
      assert(App.schema.propertiesArray[0].requiredOrOptional)
    })

    it("exposes an exampleJSON property for use in documentation", function() {
      assert(App.schema.exampleJSON)
      assert.equal(typeof(App.schema.exampleJSON), "string")
    })

  })

  describe("App.example", function() {

    it("builds an example app from properties in the schema", function() {
      assert(App.example)
    })

    it("is valid", function() {
      assert(App.example.valid)
    })

    it("has expected properties", function() {
      assert(App.example.name)
      assert(App.example.description)
      assert(App.example.keywords)
    })

  })

  // describe("App.templates", function() {
  //
  //   it("is an object", function() {
  //     assert(App.templates)
  //     assert.equal(typeof(App.templates), "object")
  //   })
  //
  //   describe("app", function() {
  //
  //     it("exists", function() {
  //       assert(App.templates.app)
  //     })
  //
  //     it("renders app name in an H2 tag", function() {
  //       var $ = cheerio.load(App.templates.app.render(App.example))
  //       assert.equal($('h2').text(), App.example.name);
  //     })
  //
  //   })
  //
  //   describe("build", function() {
  //
  //     it("exists", function() {
  //       assert(App.templates.build)
  //     })
  //
  //   })
  //
  //   describe("schema", function() {
  //
  //     it("exists", function() {
  //       assert(App.templates.schema)
  //     })
  //
  //     it("produces github-formatted markdown intead of HTML", function() {
  //       var $ = cheerio.load(marked(App.templates.schema.render(App.schema)))
  //       assert.equal($('h2').first().text(), "Example app.json")
  //       assert.equal($('h2').last().text(), "Schema Reference")
  //     })
  //   })
  //
  // })

})
