// Node:       look for environment variable or req['heroku-bouncer'].token
// CLI:        read from ~/.netrc
// Browser:    ???

var auth = module.exports = {}
var creds = require('netrc')()['api.heroku.com']

auth.token = (creds && creds.password) ? creds.password : null

auth.__defineGetter__("fail", function(){
  return new Error("No api.heroku.com entry found in ~/.netrc")
})
