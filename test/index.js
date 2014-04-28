var fs = require("fs")
var assert = require("assert")
var util = require("util")
var cheerio = require('cheerio')
var marked = require('marked')
var App = require("..")
var app
var payload

describe("App", function() {

  beforeEach(function() {
    app = null
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/app.json"))
  })

  describe("App.new", function() {

    it("accepts a filename", function() {
      app = App.new(__dirname + "/fixtures/app.json")
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
          App.new(__dirname + "/fixtures/malformed-app.json")
        },
        /malformed JSON/i
      )
    })

    it("throws a semi-helpful error when given a malformed JSON string", function() {

      assert.throws(
        function() {
          App.new(fs.readFileSync(__dirname + "/fixtures/malformed-app.json").toString())
        },
        /malformed JSON/i
      )
    })

  })

  describe("validation", function() {

    it("returns an empty array for .errors if app is valid", function() {
      app = App.new(payload)
      assert(app.valid)
      assert(util.isArray(app.errors))
      assert.equal(app.errors.length, 0)
    })

    it("requires name", function() {
      delete payload.name
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'name')
    })

    // it("does not allow empty-string name", function() {
    //   payload.name = "null"
    //   app = App.new(payload)
    //   assert(!app.valid)
    //   assert.equal(app.errors.length, 1)
    //   assert.equal(app.errors[0].property, 'name')
    //   assert.equal(app.errors[0].message, 'is required')
    // })

    it("validates website url", function() {
      payload.website = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

    it("validates repository url", function() {
      payload.repository = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'repository')
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

    it("validates logo url", function() {
      payload.logo = "not-a-url.com"
      app = App.new(payload)
      assert(!app.valid)
      assert.equal(app.errors.length, 1)
      assert.equal(app.errors[0].property, 'logo')
      assert.equal(app.errors[0].message, 'is not a valid url')
    })

  })

  describe(".toJSON()", function() {

    it("render pretty JSON", function() {
      app = App.new(payload)
      assert(app.valid)
      var output = app.toJSON()
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

      var output = app.toJSON()
      var app2 = App.new(output)
      assert.equal(typeof(output), 'string')
      assert(app2.valid)
      assert(!app2.funky)
      assert(!app2.junk)
    })


  })

  describe(".getAddonPrices()", function() {

    it("fetches a remote list of addons and their total price", function(done) {
      payload.addons = [
        "openredis",
        "mongolab:shared-single-small"
      ]
      app = App.new(payload)
      assert(app.valid)
      app.getAddonPrices(function(err, prices) {
        assert(prices)
        assert(prices.totalPrice)
        assert(prices.totalPriceInCents)
        done()
      })
    })

    it("attaches a prices property to the app object", function(done) {
      payload.addons = [
        "openredis",
        "mongolab:shared-single-small"
      ]
      app = App.new(payload)
      assert(app.valid)
      app.getAddonPrices(function(err, prices) {
        assert(app.prices)
        done()
      })
    })

    it("returns a mocked response for apps that don't have addons", function(done) {
      delete payload.addons
      app = App.new(payload)
      assert(app.valid)
      app.getAddonPrices(function(err, prices) {
        assert(prices)
        assert.equal(prices.totalPrice, "Free")
        assert.equal(prices.totalPriceInCents, 0)
        assert(util.isArray(prices.plans))
        assert.equal(prices.plans.length, 0)
        done()
      })
    })

  })

  describe("App.fetch()", function() {

    it("downloads remote manifests with github shorthand", function(done) {
      App.fetch('zeke/harp-slideshow-template', function(err, remoteApp) {
        assert(remoteApp.valid)
        assert.equal(remoteApp.name, "Harp Slideshow")
        done()
      })
    })

    it("downloads remote manifests with fully-qualified github URLs", function(done) {
      App.fetch('https://github.com/heroku-examples/geosockets.git', function(err, remoteApp) {
        if (err) console.error(err)
        assert(remoteApp.valid)
        assert.equal(remoteApp.name, "Geosockets")
        done()
      })
    })
  })

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

  describe("App.templates", function() {

    it("is an object", function() {
      assert(App.templates)
      assert.equal(typeof(App.templates), "object")
    })

    describe("app", function() {

      it("exists", function() {
        assert(App.templates.app)
      })

      it("renders app name in an H2 tag", function() {
        $ = cheerio.load(App.templates.app.render(App.example))
        assert.equal($('h2').text(), App.example.name);
      })

    })

    describe("build", function() {

      it("exists", function() {
        assert(App.templates.build)
      })

    })

    describe("schema", function() {

      it("exists", function() {
        assert(App.templates.schema)
      })

      it("produces github-formatted markdown intead of HTML", function() {
        $ = cheerio.load(marked(App.templates.schema.render(App.schema)))
        assert.equal($('h2').first().text(), "Example app.json")
        assert.equal($('h2').last().text(), "The Schema")
      })
    })

  })
})
