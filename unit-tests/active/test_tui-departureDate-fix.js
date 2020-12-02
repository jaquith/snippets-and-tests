/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/tui-departureDate-fix.js')

let result

describe('the lowercase querystring keys extension', function () {
  it('should export without error', function () {
    result = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
  })

  it('should correctly parse full dates', function () {
    chai.expect(result.theExtension({
      'departureDate' : "12/10/2021",
      "testValue" : "123"
    })).to.deep.equal({
      'departureDate' : "12/10/2021",
      'departureDate YYYYMMDD' : "20211012",
      "testValue" : "123"
    })
  })

  it('should correctly parse partial dates', function () {
    chai.expect(result.theExtension({
      'departureDate' : "/04/2021",
      "testValue" : "123"
    })).to.deep.equal({
      'departureDate' : "/04/2021",
      'departureDate YYYYMMDD' : "202104",
      "testValue" : "123"
    })
  })

  it('should correctly fail on missing dates', function () {
    chai.expect(result.theExtension({
      "testValue" : "123"
    })).to.deep.equal({
      'departureDate YYYYMMDD' : "none",
      "testValue" : "123"
    })

    it('should correctly fail on misformatted dates', function () {
      chai.expect(result.theExtension({
        'departureDate' : "0104/2021",
        "testValue" : "123"
      })).to.deep.equal({
        'departureDate' : "/04/2021",
        'departureDate YYYYMMDD' : "none",
        "testValue" : "123"
      })
    })
  })
})
