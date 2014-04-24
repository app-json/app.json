var nixt = require('nixt')
var App = require('..')

describe("CLI", function() {

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
        .run('./bin/apps schema')
        // .exist('/tmp/app/schema.json')
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
        .run('./bin/apps schema --markdown')
        .end(done)
    })

    it("respects the --html option", function(done) {
      nixt()
        .expect(function(result) {
          if (!result.stdout.match("<h3 id=\"env\">env</h3>")) {
            console.error(result.stdout)
            return new Error("Expected to find HTML in output")
          }
        })
        .run('./bin/apps schema --html')
        .end(done)
    })

  })

})
