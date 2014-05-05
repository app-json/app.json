var assert = require("assert")
var util = require("util")
var addons = require("../lib/addons")

describe('addons.getPlan()', function(){
  this.timeout(3000)

  it('accepts an addon:plan string', function(done){
    addons.getPlan('mongohq:ssd_1g_elastic', function(err, plan) {
      assert.equal(plan.name, 'mongohq:ssd_1g_elastic')
      assert.equal(plan.description, 'MongoHQ 1 GB SSD')
      done()
    })
  })

  it('accepts an addon string with no plan', function(done){
    addons.getPlan('mongohq', function(err, plan) {
      assert.equal(plan.name, 'mongohq:sandbox')
      done()
    })
  })

  it('returns a pretty price', function(done){
    addons.getPlan('mongohq', function(err, plan) {
      assert.equal(plan.prettyPrice, 'Free')
      done()
    })
  })

  it('returns a logo URL when given an addon:plan slug', function(done){
    addons.getPlan('mongohq:sandbox', function(err, plan) {
      assert.equal(plan.logo, 'https://addons.heroku.com/addons/mongohq/icons/original.png')
      done()
    })
  })

  it('returns a logo URL given a plan-free slug', function(done){
    addons.getPlan('mongohq', function(err, plan) {
      assert.equal(plan.logo, 'https://addons.heroku.com/addons/mongohq/icons/original.png')
      done()
    })
  })

})

describe('addons.getPrices()', function(){
  this.timeout(3000)

  it('accepts an array and returns an object', function(done){
    addons.getPrices(['mongohq:ssd_1g_elastic'], function(err, prices) {
      assert(typeof(prices) === "object")
      assert(!util.isArray(prices))
      assert(util.isArray(prices.plans))
      done()
    })
  })

  it('returns an array of plans in the prices object', function(done){
    addons.getPrices(['mongohq:ssd_1g_elastic'], function(err, prices) {
      assert(util.isArray(prices.plans))
      done()
    })
  })

  it('handles addon:plan formatted slugs', function(done){
    addons.getPrices(['mongohq:ssd_1g_elastic'], function(err, prices) {
      assert.equal(prices.plans[0].name, 'mongohq:ssd_1g_elastic')
      assert.equal(prices.plans[0].price.cents, 1800)
      assert.equal(prices.plans[0].price.unit, 'month')
      done()
    })
  })

  it('finds the default plan, if unspecified', function(done){
    addons.getPrices(['mongohq'], function(err, prices) {
      assert.equal(prices.plans[0].name, 'mongohq:sandbox')
      assert.equal(prices.plans[0].price.cents, 0)
      assert.equal(prices.plans[0].price.unit, 'month')
      done()
    })
  })

  it('returns a totalPrice in the prices object', function(done){
    addons.getPrices(['mongohq:ssd_1g_elastic', 'memcachedcloud:100'], function(err, prices) {
      assert.equal(prices.plans[0].name, 'mongohq:ssd_1g_elastic')
      assert.equal(prices.plans[0].price.cents, 1800)
      assert.equal(prices.plans[1].price.cents, 1400)
      assert.equal(prices.totalPriceInCents, 3200)
      done()
    })
  })

  it('returns a human-friendly dollar amount total', function(done){
    addons.getPrices(['mongohq:ssd_1g_elastic', 'memcachedcloud:100'], function(err, prices) {
      assert.equal(prices.totalPriceInCents, 3200)
      assert.equal(prices.totalPrice, '$32/mo')
      done()
    })
  })

  it('returns free if total is zero', function(done){
    addons.getPrices(['heroku-postgresql'], function(err, prices) {
      assert.equal(prices.totalPriceInCents, 0)
      assert.equal(prices.totalPrice, 'Free')
      done()
    })
  })

  it('accepts an emtpy array', function(done){
    addons.getPrices([], function(err, prices) {
      assert(util.isArray(prices.plans))
      assert.equal(prices.totalPriceInCents, 0)
      assert.equal(prices.totalPrice, 'Free')
      done()
    })
  })

  it('propagates errors for nonexistent addons', function(done){
    addons.getPrices(['nonexistent-addon'], function(err, prices) {
      assert(err)
      done()
    })
  })

  it('propagates errors for nonexistent plans',function(done){
    addons.getPrices(['mongohq:bad-plan'], function(err, res) {
      assert(err)
      assert.equal(err.id, "not_found")
      done()
    })
  })

  it('handles a long list of addons',function(done){
    var slugs = [
      'mongohq:sandbox',
      'redistogo',
      'goinstant',
      'rollbar',
      'usersnap',
      'bonsai:staging'
    ]

    addons.getPrices(slugs, function(err, prices) {
      assert(!err)
      assert(prices.plans)
      assert(prices.totalPrice)
      assert.equal(typeof(prices.totalPriceInCents), 'number')
      done()
    })
  })

  it("returns a mocked response for a null slugs array", function(done) {
    addons.getPrices(null, function(err, prices) {
      assert(prices)
      assert.equal(prices.totalPrice, "Free")
      assert.equal(prices.totalPriceInCents, 0)
      assert(util.isArray(prices.plans))
      assert.equal(prices.plans.length, 0)
      done()
    })
  })

  it("returns a mocked response for an empty slugs array", function(done) {
    addons.getPrices([], function(err, prices) {
      assert(prices)
      assert.equal(prices.totalPrice, "Free")
      assert.equal(prices.totalPriceInCents, 0)
      assert(util.isArray(prices.plans))
      assert.equal(prices.plans.length, 0)
      done()
    })
  })

})
