var fs = require("fs")
var ini = require("ini")
var url = require("url")
var git = module.exports = {}

git.parseHerokuAppNames = function(callback) {

  if (!fs.existsSync(process.cwd() + "/.git/config"))
    return callback(null, [])

  var config = ini.parse(fs.readFileSync(process.cwd() + "/.git/config").toString())

  var names = Object.keys(config)
    .filter(function(key) {
      return config[key].url && config[key].url.match(/heroku\.com/)
    })
    .map(function(key) {
      return config[key].url.match(/git@heroku\.com:(.*)\.git/)[1]
    })

  return callback(null, names)
}
