// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/get-duration-nights.js')

// to share among tests
let exported

describe('the getDurationNights helper function', function () {

  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['getDurationNights'])
    chai.expect(exported).to.be.an('object').with.key('getDurationNights')
  })

  it('should work in a simple case', function () {
    let output = exported.getDurationNights('2022-12-11', '2022-12-14')
    chai.expect(output).to.equal('3')
  })

  it('should work in another simple case', function () {
    let output = exported.getDurationNights('2022-01-01', '2022-02-01')
    chai.expect(output).to.equal('31')
  })

  it('should work in a longer case', function () {
    let output = exported.getDurationNights('2022-02-11', '2022-03-14')
    chai.expect(output).to.equal('31')
  })

  it('should still work if you omit preceding zeros in months and days', function () {
    let output = exported.getDurationNights('2022-2-11', '2022-03-14')
    chai.expect(output).to.be.equal('31')
  })

  it('should return 0 as a string if an argument is missing or somehow invalid', function () {

    let output = exported.getDurationNights('2022-02-11')
    chai.expect(output).to.equal('0')

    output = exported.getDurationNights('2022-02-11', '')
    chai.expect(output).to.equal('0')

    output = exported.getDurationNights('', '2022-03-14')
    chai.expect(output).to.equal('0')

  })
})