var assert = require("assert")
var fs = require("fs")
var Manifest = require("..")
var manifest
var payload

describe("Manifest", function() {

  beforeEach(function() {
    manifest = null
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/app.json"))
  })

  describe("instantiation", function() {

    it("accepts a filename", function() {
      manifest = new Manifest(__dirname + "/fixtures/app.json")
      assert(manifest.valid)
    })

    it("accepts a JSON string", function() {
      manifest = new Manifest(JSON.stringify(payload))
      assert(manifest.valid)
    })

    it("accepts a JavaScript object", function() {
      manifest = new Manifest(payload)
      assert(manifest.valid)
    })

  })

  describe("validation", function() {

    it("returns null for .errors if manifest is valid", function() {
      manifest = new Manifest(payload)
      assert(manifest.valid)
      assert.equal(manifest.errors, null)
    })

    it("requires name", function() {
      delete payload.name
      manifest = new Manifest(payload)
      assert(!manifest.valid)
      assert.equal(manifest.errors.length, 1)
      assert.equal(manifest.errors[0].property, 'name')
    })

    it("does not allow empty-string name", function() {
      payload.name = ""
      manifest = new Manifest(payload)
      assert(!manifest.valid)
      assert.equal(manifest.errors.length, 1)
      assert.equal(manifest.errors[0].property, 'name')
      assert.equal(manifest.errors[0].message, 'is required')
    })

    it("validates website url", function() {
      payload.website = "not-a-url.com"
      manifest = new Manifest(payload)
      assert(!manifest.valid)
      assert.equal(manifest.errors.length, 1)
      assert.equal(manifest.errors[0].message, 'is not a valid url')
    })

    it("validates repository url", function() {
      payload.repository = "not-a-url.com"
      manifest = new Manifest(payload)
      assert(!manifest.valid)
      assert.equal(manifest.errors.length, 1)
      assert.equal(manifest.errors[0].property, 'repository')
      assert.equal(manifest.errors[0].message, 'is not a valid url')
    })

  })

  describe(".toJSON()", function() {

    it("render pretty JSON", function() {
      manifest = new Manifest(payload)
      assert(manifest.valid)
      var output = manifest.toJSON()
      var manifest2 = new Manifest(output)
      assert.equal(typeof(output), 'string')
      assert(manifest2.valid)
      assert.equal(manifest.name, manifest2.name)
    })

  })

  describe(".getAddonsPrices()", function() {

    it("fetches a remote list of addons and their total Price", function(done) {
      payload.addons = [
        "openredis",
        "mongolab:shared-single-small"
      ]
      manifest = new Manifest(payload)
      assert(manifest.valid)
      manifest.getAddonsPrices(function(err, addons) {
        assert(addons)
        assert(addons.totalPrice)
        assert(addons.totalPriceInCents)
        done()
      })
    })

  })


  describe("Manifest.fetch()", function() {

    it("Manifest.fetch() downloads remote manifests with github shorthand", function(done) {
      Manifest.fetch('zeke/harp-slideshow-template', function(err, remoteManifest) {
        assert(remoteManifest.valid)
        assert.equal(remoteManifest.name, "Harp Slideshow")
        done()
      })
    })

    it("Manifest.fetch() downloads remote manifests with fully qualified github URLs")

  })


})
