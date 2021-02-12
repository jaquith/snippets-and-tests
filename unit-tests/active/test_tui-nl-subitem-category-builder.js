// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/tui-nl-subitem-category-builder.js')


// declared outside of the tests so it can be shared among them
let exported


describe('the subItem category builder extension for TUI NL', function () {
  it('should export without error', function () {
    const before = 'function theExtension (b) {\n'
    const after = '\nreturn b\n}'
    exported = stringFunctions.exportNamedElements(snippet, ['theExtension'], before, after)
  })

  it('should work correctly in a simple case', function () {
    let b = {
      "basket.items.subItems.productType": [
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT"
      ],
      "basket.items.subItems.productSubType": [
        "SEATTYPE",
        "BAG",
        "INS",
        "INS",
        "XSPC"
      ],
      "basket.items.subItems.price.currentPrice": [
        "192", 
        "96", 
        "192", 
        "67", 
        "59"
      ]
    }
    let result = exported.theExtension(b)
    chai.expect(result).to.deep.equal({
      "basket.items.subItems.productType": [
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT"
      ],
      "basket.items.subItems.productSubType": [
        "SEATTYPE",
        "BAG",
        "INS",
        "INS",
        "XSPC"
      ],
      "basket.items.subItems.price.currentPrice": [
        "SEATTYPE",
        "BAG",
        "INS",
        "INS",
        "XSPC"
      ],
      "subItemCategories": [
        "ancillary/seattype",
        "ancillary/luggage/flight_luggage-regular",
        "ancillary/insurance",
        "ancillary/insurance",
        "ancillary/xspc"
      ],
      "basket.items.subItems.price.currentPrice": [
        "192", 
        "96", 
        "192", 
        "67", 
        "59"
      ],
      totalPriceInsurance: "259",
      totalPriceLuggage: "96"
    })
  })


  it('should fail gracefully if price is missing', function () {
    let b = {
      "basket.items.subItems.productType": [
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT"
      ],
      "basket.items.subItems.productSubType": [
        "SEATTYPE",
        "BAG",
        "INS",
        "INS",
        "XSPC"
      ]
    }
    let result = exported.theExtension(b)
    chai.expect(result).to.deep.equal({
      "basket.items.subItems.productType": [
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT",
        "FLIGHT"
      ],
      "basket.items.subItems.productSubType": [
        "SEATTYPE",
        "BAG",
        "INS",
        "INS",
        "XSPC"
      ],
      "subItemCategories": [
        "ancillary/seattype",
        "ancillary/luggage/flight_luggage-regular",
        "ancillary/insurance",
        "ancillary/insurance",
        "ancillary/xspc"
      ],
      totalPriceInsurance: "0",
      totalPriceLuggage: "0"
    })
  })


})




