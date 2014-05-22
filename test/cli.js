"use strict"
var nixt = require('nixt')
var App = require('..')

describe("CLI", function() {

  describe("app", function() {

    it("outputs usage", function(done) {
      nixt()
        .run('./bin/cli')
        .stdout(/usage/i)
        .end(done)
    })

  })

  describe("app deploy <repo>", function() {

  })

  describe("app init", function() {

  })

  describe("app schema", function() {

    beforeEach(function(done){
      nixt()
        .run("rm -rf /tmp/app && mkdir /tmp/app")
        .exist("/tmp/app")
        .end(done)
    })

    it("outputs JSON by default", function(done) {
      nixt()
        .expect(function(result) {
          if (result.stdout !== JSON.stringify(App.schema.properties, null, 2)) {
            return new Error("JSON doesn't match schema", result)
          }
        })
        .run('./bin/cli schema')
        .end(done)
    })

    it("respects the --markdown option", function(done) {
      nixt()
        .expect(function(result) {
          if (!result.stdout.match("### addons")) {
            console.error(result.stdout)
            return new Error("Expected to find markdown in output")
          }
        })
        .run('./bin/cli schema --markdown')
        .end(done)
    })

    it("respects the --html option, and creates linkable headings", function(done) {
      nixt()
        .expect(function(result) {
          if (!result.stdout.match("<h3 id=\"env\">env</h3>")) {
            console.error(result.stdout)
            return new Error("Expected to find HTML in output")
          }
        })
        .run('./bin/cli schema --html')
        .end(done)
    })

  })

  describe("app validate", function() {

    describe("for a valid app.json", function() {
      it("prints a happy message to stdout", function(done) {
        nixt()
          .run('cd test/fixtures/valid; ../../../bin/cli validate')
          .stdout(/Your app\.json file is valid!/i)
          .end(done)
      })
    })

    describe("for a malformed app.json", function() {
      it("prints an error message to stderr", function(done) {
        nixt()
          .run('cd test/fixtures/malformed; ../../../bin/cli validate')
          .stderr(/Found an app\.json file, but it's invalid JSON./i)
          .end(done)
        })
    })

    describe("for an invalid app.json", function() {
      it("prints validation errors to stderr", function(done) {
        nixt()
          .run('cd test/fixtures/invalid; ../../../bin/cli validate')
          .stderr(/got some issues/i)
          .stderr(/name is too short/i)
          .stderr(/keywords must be of array type/i)
          .stderr(/website is not a valid url/i)
          .stderr(/repository is not a valid url/i)
          .end(done)
        })
    })

})

})
