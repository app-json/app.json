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
    manifest = Manifest(__dirname + "/fixtures/heroku.json")
    assert(manifest.isValid())
  })

  it("accepts a JSON string", function() {
    manifest = Manifest(JSON.stringify(payload))
    assert(manifest.isValid())
  })

  it("accepts a JavaScript object", function() {
    manifest = Manifest(payload)
    assert(manifest.isValid())
  })

  // it("requires name", function() {
  //   delete payload.name
  //   manifest = Manifest(payload)
  //   assert(!manifest.isValid())
  //   assert.equal(manifest.errors.length, 1)
  //   assert.equal(manifest.errors[0].attr, 'name')
  // })
  //
  // it("requires description", function() {
  //   delete payload.description
  //   manifest = Manifest(payload)
  //   assert(!manifest.isValid())
  //   assert.equal(manifest.errors.length, 1)
  //   assert.equal(manifest.errors[0].attr, 'description')
  // })
  //
  // it("requires urls.source be a valid URL, if specified", function() {
  //   payload.urls.source = "not-a-url"
  //   manifest = Manifest(payload)
  //   assert(!manifest.isValid())
  //   assert.equal(manifest.errors.length, 1)
  //   assert.equal(manifest.errors[0].attr, 'urls')
  //   assert.equal(manifest.errors[0].message, 'source must be a valid URL')
  // })

})
