var jsonlint = require("jsonlint")
var assert = require("assert")
var fs = require("fs")
var Manifest = require("..")
var manifest
var payload

describe("manifest(payload)", function() {

  beforeEach(function() {
    manifest = null
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/heroku.json"))
  })

  it ("accepts a filename", function() {
    manifest = new Manifest(__dirname + "/fixtures/heroku.json")
    assert(manifest.isValid())
  })

  it("accepts a JSON string", function() {
    manifest = new Manifest(JSON.stringify(payload))
    assert(manifest.isValid())
  })

  it("accepts a JavaScript object", function() {
    manifest = new Manifest(payload)
    assert(manifest.isValid())
  })

  it("preserves the payload as a nested object", function() {
    manifest = new Manifest(payload)
    assert(manifest.payload)
    assert(manifest.payload.name)
  })

  it("requires name", function() {
    delete payload.name
    manifest = new Manifest(payload)
    assert(!manifest.isValid())
    assert.equal(manifest.errors.length, 1)
    assert.equal(manifest.errors[0].property, 'name')
  })

  it("requires urls.website be a valid URL, if specified", function() {
    payload.urls.website = "not-a-url.com"
    manifest = new Manifest(payload)
    assert(!manifest.isValid())
    assert.equal(manifest.errors.length, 1)
    assert.equal(manifest.errors[0].message, 'urls.website is not a valid URL')
  })

  it("requires urls.source be a valid URL, if specified", function() {
    payload.urls.source = "bad-source.com"
    manifest = new Manifest(payload)
    assert(!manifest.isValid())
    assert.equal(manifest.errors.length, 1)
    assert.equal(manifest.errors[0].message, 'urls.source is not a valid URL')
  })

})
