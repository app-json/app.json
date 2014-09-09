"use strict"
var assert = require("assert")
var util = require("util")
var addons = require("../lib/addons")

describe('addons.getPlan()', function(){
  this.timeout(3000)

  describe("with an addon:plan argument", function() {

    it('accepts an addon:plan string', function(done){
      addons.getPlan('mongohq:ssd_1g_elastic', function(err, plan) {
        assert.equal(plan.name, 'mongohq:ssd_1g_elastic')
        assert.equal(plan.description, 'MongoHQ 1 GB SSD')
        done()
      })
    })
  })


  describe("without a plan", function() {

    var plan = null

    before(function(done) {
      addons.getPlan('mongohq', function(err, p) {
        plan = p
        done()
      })
    })

    it('figures out the default plan', function(){
      assert.equal(plan.name, 'mongohq:sandbox')
    })

    it('returns a pretty price', function(){
      assert.equal(plan.prettyPrice, 'Free')
    })

    it('returns a logo URL when given an addon:plan slug', function(){
      assert.equal(plan.logo, 'https://addons.heroku.com/addons/mongohq/icons/original.png')
    })

    it('returns a logo URL given a plan-free slug', function(){
      assert.equal(plan.logo, 'https://addons.heroku.com/addons/mongohq/icons/original.png')
    })

  })

})

describe('addons.getPrices()', function(){
  this.timeout(3000)

  describe("mongohq:ssd_1g_elastic", function() {

    var prices = null

    before(function(done) {
      addons.getPrices(['mongohq:ssd_1g_elastic'], function(err, p) {
        prices = p
        done()
      })
    })

    it('accepts an array and returns an object', function(){
      assert(typeof(prices) === "object")
      assert(!util.isArray(prices))
      assert(util.isArray(prices.plans))
    })

    it('returns an array of plans in the prices object', function(){
      assert(util.isArray(prices.plans))
    })

    it('handles addon:plan formatted slugs', function(){
      assert.equal(prices.plans[0].name, 'mongohq:ssd_1g_elastic')
      assert.equal(prices.plans[0].price.cents, 1800)
      assert.equal(prices.plans[0].price.unit, 'month')
    })


    it('returns a totalPrice in the prices object', function(){
      assert.equal(prices.plans[0].price.cents, 1800)
      assert.equal(prices.totalPriceInCents, 1800)
    })

    it('returns a human-friendly dollar amount total', function(){
      assert.equal(prices.totalPrice, '$18/mo')
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
