"use strict"
var async = require('async')
var superagent = require('superagent')
var addons = module.exports = {}

addons.getPrices = function(slugs, cb) {

  // Assemble an empty API response
  if (!slugs || slugs === []) {
    return cb(null, {
      plans: [],
      totalPrice: "Free",
      totalPriceInCents: 0
    })
  }

  async.map(slugs, addons.getPlan, function(err, plans) {
    if (err) return cb(err)
    var prices = {}
    prices.totalPriceInCents = plans.reduce(function(sum, plan) {
      return plan.price.cents + sum
    }, 0)
    prices.totalPrice = formatPrice(prices.totalPriceInCents)
    prices.plans = plans
    cb(null, prices)
  })
}

addons.getPlan = function(slug, cb) {

  if (slug.match(/:/)) {
    // format is 'addon:plan'
    var addon = slug.split(":")[0]
    var plan = slug.split(":")[1]

    superagent
      .get('https://api.heroku.com/addon-services/'+addon+'/plans/'+plan)
      .set('Accept', 'application/vnd.heroku+json; version=3')
      .end(function(err, res){
        if (err) return cb(err)
        if (res.statusCode == 404) return cb(res.body)
        var plan = res.body
        plan.prettyPrice = formatPrice(plan.price.cents)
        plan.logo = "https://addons.heroku.com/addons/" + addon + "/icons/original.png"
        cb(null, plan)
      })

  } else {
    // plan not specified; find the default plan
    superagent
      .get('https://api.heroku.com/addon-services/'+slug+'/plans')
      .set('Accept', 'application/vnd.heroku+json; version=3')
      .end(function(err, res){
        if (err) return cb(err)
        if (res.statusCode == 404) return cb(res.body)
        var plan = res.body.filter(function(plan) { return plan.default })[0]
        plan.prettyPrice = formatPrice(plan.price.cents)
        plan.logo = "https://addons.heroku.com/addons/" + slug + "/icons/original.png"
        cb(null, plan)
      })
  }

}

function formatPrice(price) {
  return (price == 0) ? "Free" : "$" + price/100 + "/mo"
}
