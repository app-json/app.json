"use strict"
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
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/valid/app.json"))
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
      App.fetch('zeke/slideshow', function(err, remoteApp) {
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

    it("downloads remote manifests with bitbucket shorthand", function(done) {
      App.fetch('bitbucket:sikelianos/web-starter-kit', function(err, remoteApp) {
        assert(remoteApp.valid)
        assert.equal(remoteApp.name, "Google Web Starter Kit")
        done()
      })
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
        var $ = cheerio.load(App.templates.app.render(App.example))
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
        var $ = cheerio.load(marked(App.templates.schema.render(App.schema)))
        assert.equal($('h2').first().text(), "Example app.json")
        assert.equal($('h2').last().text(), "Schema Reference")
      })
    })

  })
})
