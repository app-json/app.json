// var jsonlint = require("jsonlint")
var isUrl = require("is-url")
var modella = require('modella')
var validators = require('modella-validators')
var fs = require("fs")

// var Manifest = modella('Manifest')
// Manifest
//   .use(validators)
//   .attr('name', {required: true, type: 'string'})
//   .attr('description', {required: true, type: 'string'})
//   .attr('keywords', {type: 'array'})
//   .attr('urls', {type: 'object'})
//   .attr('env', {type: 'object'})
//   .attr('scripts', {type: 'object'})
//   .validate(function(manifest) {
//     if(manifest.has('urls'))  {
//       var source = manifest.urls().source
//       if (source && !isUrl(source))
//         manifest.error('urls', "source must be a valid URL")
//     }
//   })

// var EnvVar = modella('EnvVar')
// EnvVar
//   .use(validators)
//   .attr('description', {type: 'string'})
//   .attr('default', {})
//   .attr('generator', {type: 'string'})
//   .validate(function(envVar) {
//     if(envVar.generator && envVar.generator !== "secret")  {
//       manifest.error('generator', "'secret' is the only supported generator. :|")
//     }
//   })

// module.exports = function(payload) {
//
//   // filename
//   if (typeof(payload) === 'string' && payload.match(/\.json$/i))
//     return new Manifest(JSON.parse(fs.readFileSync(payload)))
//
//   // JSON string
//   if (typeof(payload) === 'string')
//     return new Manifest(JSON.parse(payload))
//
//   // JavaScript object
//   if (payload && typeof(payload) === 'object')
//     return new Manifest(payload)
//
// }

var manifest = {}

manifest.isValid = function() {
  return true
}

manifest.validate = function() {

  // manifest.errors = {}


  // manifest.errors =

}

module.exports = function(payload) {

  if (typeof(payload) === 'string' && payload.match(/\.json$/i)) {
    manifest.payload = JSON.parse(fs.readFileSync(payload))
  } else if (typeof(payload) === 'string') {
    manifest.payload = JSON.parse(payload)
  } else if (payload && typeof(payload) === 'object') {
    manifest.payload = payload
  }

  return manifest;

}
