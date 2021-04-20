// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/tui-nl-helper-functions.js')


// declared outside of the tests so it can be shared among them
let exported
let undefinedVar

describe('the TUI NL helper functions', function () {
  describe('the utag.ext.mergeArrays function for TUI NL/BE', function () {
    it('should export without error', function () {
      const before = 'var utag = {}\n\nfunction mergeArrays (arr1, arr2) {\n'
      const after = '\nreturn utag.ext.mergeArrays(arr1, arr2)\n}'
      exported = stringFunctions.exportNamedElements(snippet, ['mergeArrays'], before, after)
    })
  
    it('should work correctly in a simple case', function () {
      let result = exported.mergeArrays(["test1"], ["test2", "test3"])
      chai.expect(result).to.be.an('array').deep.equal(["test1", "test2", "test3"])
    })
  
    it('should leave the original arrays unchanged', function () {
      let first = ["test1"]
      let second = ["test2", "test3"]
      let result = exported.mergeArrays(first, second)
      chai.expect(result).to.be.an('array').deep.equal(["test1", "test2", "test3"])
      chai.expect(first).to.be.an('array').deep.equal(["test1"])
      chai.expect(second).to.be.an('array').deep.equal(["test2", "test3"])
    })
  
    it('should work correctly in a simple case with empty entries', function () {
      let result = exported.mergeArrays(["test1"], ["", "test2"])
      chai.expect(result).to.be.an('array').deep.equal(["test1", "", "test2"])
    })
  
    it('should work correctly in a simple case with undefined entries', function () {
      let result = exported.mergeArrays(["test1"], [undefined, "test2"])
      chai.expect(result).to.be.an('array').deep.equal(["test1", undefined, "test2"])
    })
  
    it('should return undefined if either, or both, of the arrays is undefined', function () {
      let undefinedVar
      let result 
      
      result = exported.mergeArrays(["test1"], undefinedVar)
      chai.expect(result).to.be.undefined()
  
      result = exported.mergeArrays(undefinedVar, ["test1"])
      chai.expect(result).to.be.undefined()
  
      result = exported.mergeArrays(undefinedVar, undefinedVar)
      chai.expect(result).to.be.undefined()
    })
  
  })

  describe('the utag.ext.pushIfDefined function for TUI NL/BE', function () {
    it('should export without error', function () {
      const before = 'var utag = {}\n\nfunction pushIfDefined (arr, el) {\n'
      const after = '\nreturn utag.ext.pushIfDefined(arr, el)\n}'
      exported = stringFunctions.exportNamedElements(snippet, ['pushIfDefined'], before, after)
    })
  
    it('should work correctly in a simple case', function () {
      let result = exported.pushIfDefined(["test1"], "test2")
      chai.expect(result).to.be.an('array').deep.equal(["test1", "test2"])
    })
  
    it('should leave the original inputs unchanged', function () {
      let arr = ["test1"]
      let el = "test2"
      let result = exported.pushIfDefined(arr, el)

      chai.expect(result).to.be.an('array').deep.equal(["test1", "test2"])
      chai.expect(arr).to.deep.equal(["test1"])
      chai.expect(el).to.deep.equal("test2")
    })
  
    it('should work correctly in a simple case with empty string element', function () {
      let result = exported.pushIfDefined(["test1"], "")
      chai.expect(result).to.be.an('array').deep.equal(["test1", ""])
    })

    it('shouldn\'t matter if the array contains undefined elements', function () {
      let result = exported.pushIfDefined([undefinedVar], "")
      chai.expect(result).to.be.an('array').deep.equal([null, ""])

      result = exported.pushIfDefined([undefinedVar], "")
      chai.expect(result).to.be.an('array').deep.equal([null, ""])
    })
  
    it('should return the original array input if either the array or element is undefined', function () {
      let result = exported.pushIfDefined([undefinedVar], "")
      chai.expect(result).to.be.an('array').deep.equal([null, ""])

      result = exported.pushIfDefined(undefinedVar, "")
      chai.expect(result).to.be.undefined()

      result = exported.pushIfDefined(["test1"], undefinedVar)
      chai.expect(result).to.deep.equal(["test1"])
    })
  
  })

  describe('the utag.ext.getWeekNumber function for TUI BE', function () {
    it('should export without error', function () {
      const before = 'var utag = {}\n\nfunction getWeekNumber (date) {\n'
      const after = '\nreturn utag.ext.getWeekNumber(date)\n}'
      exported = stringFunctions.exportNamedElements(snippet, ['getWeekNumber'], before, after)
    })
  
    it('should work correctly in a simple case', function () {
      // ref: https://www.epochconverter.com/weeks/2021
      let result = exported.getWeekNumber('2021-10-11')
      chai.expect(result).to.deep.equal("2021-41")
    })

    it('should work correctly in several more cases, past and future', function () {
      // ref: https://www.epochconverter.com/weeks/2021
      let result = exported.getWeekNumber('2021-08-11')
      chai.expect(result).to.deep.equal("2021-32")

      result = exported.getWeekNumber('2021-07-11')
      chai.expect(result).to.deep.equal("2021-27")

      result = exported.getWeekNumber('2021-06-11')
      chai.expect(result).to.deep.equal("2021-23")

      result = exported.getWeekNumber('2021-05-11')
      chai.expect(result).to.deep.equal("2021-19")

      result = exported.getWeekNumber('2021-04-11')
      chai.expect(result).to.deep.equal("2021-14")

      
      // https://www.epochconverter.com/weeks/2016
      result = exported.getWeekNumber('2016-04-11')
      chai.expect(result).to.deep.equal("2016-15")

      result = exported.getWeekNumber('2016-03-11')
      chai.expect(result).to.deep.equal("2016-10")

      result = exported.getWeekNumber('2016-02-11')
      chai.expect(result).to.deep.equal("2016-06")

      result = exported.getWeekNumber('2016-01-11')
      chai.expect(result).to.deep.equal("2016-02")

      result = exported.getWeekNumber('2012-1-1')
      chai.expect(result).to.deep.equal('2011-52')

      result = exported.getWeekNumber('2012-1-1')
      chai.expect(result).to.deep.equal('2011-52')

      // this is a weird one, but it really is part of the last week of the previous year
      result = exported.getWeekNumber('2016-01-02')
      chai.expect(result).to.deep.equal("2015-53")
    })



    it('should not matter if leading zeros are omitted in date parts', function () {
      chai.expect(exported.getWeekNumber('2016-1-8')).to.deep.equal(exported.getWeekNumber('2016-01-08'))
      chai.expect(exported.getWeekNumber('2016-4-01')).to.deep.equal(exported.getWeekNumber('2016-04-01'))
    })

    it('should also work if you use a date directly', function () {
      let result = exported.getWeekNumber(new Date(2021, 7, 11))
      chai.expect(result).to.deep.equal(exported.getWeekNumber('2021-08-11'))
    })


    it('should return unexpected output unchanged', function () {
      const errorOutput = 'no date'
      chai.expect(exported.getWeekNumber('2016-1')).to.equal(errorOutput)

      chai.expect(exported.getWeekNumber('')).to.equal(errorOutput)

      chai.expect(exported.getWeekNumber({test: 1})).to.equal(errorOutput)
    })
  
  })
})



