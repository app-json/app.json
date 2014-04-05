var assert = require("assert")
var fs = require("fs")
var Manifest = require("..")
var manifest
var payload

describe("manifest(payload)", function() {

  beforeEach(function() {
    manifest = null
    payload = JSON.parse(fs.readFileSync(__dirname + "/fixtures/app.json"))
  })

  it ("accepts a filename", function() {
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

  it("provides a toJSON() method with pretty output", function() {
    manifest = new Manifest(payload)
    assert(manifest.valid)
    var output = manifest.toJSON()
    var manifest2 = new Manifest(output)
    assert.equal(typeof(output), 'string')
    assert(manifest2.valid)
    assert.equal(manifest.name, manifest2.name)
  })

})
