var assert = require("assert")
var fs = require("fs")
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

  })

  describe("validation", function() {

    it("returns null for .errors if app is valid", function() {
      app = App.new(payload)
      assert(app.valid)
      assert.equal(app.errors, null)
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

  describe(".getAddonsPrices()", function() {

    it("fetches a remote list of addons and their total price", function(done) {
      payload.addons = [
        "openredis",
        "mongolab:shared-single-small"
      ]
      app = App.new(payload)
      assert(app.valid)
      app.getAddonsPrices(function(err, addons) {
        assert(addons)
        assert(addons.totalPrice)
        assert(addons.totalPriceInCents)
        done()
      })
    })

    it("returns a mocked response for apps that don't have addons", function(done) {
      delete payload.addons
      app = App.new(payload)
      assert(app.valid)
      app.getAddonsPrices(function(err, addons) {
        assert(addons)
        assert.equal(addons.totalPrice, "Free")
        assert.equal(addons.totalPriceInCents, 0)
        assert(util.isArray(addons.plans))
        assert.equal(addons.plans.length, 0)
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

    it("exposes a decorator object for template-friendly rendering", function() {
      assert(App.schema.decorator)
      assert(App.schema.decorator[0].name)
      assert(App.schema.decorator[0].description)
      assert(App.schema.decorator[0].requiredOrOptional)
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
        assert.equal($('h1').text(), "app.json Schema");
      })
    })

  })
})
