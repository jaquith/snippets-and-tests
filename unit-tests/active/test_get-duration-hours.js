// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/get-duration-hours.js')

// to share among tests
let exported

describe('the getDurationHours helper function', function () {

  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['getDurationHours'])
    chai.expect(exported).to.be.an('object').with.key('getDurationHours')
  })

  it('should work in a simple case', function () {
    let output = exported.getDurationHours('2022-12-11', '05:01', '2022-12-11', '07:00')
    chai.expect(output).to.equal('01:59')
  })

  it('should work in another simple case', function () {
    let output = exported.getDurationHours('2022-12-11', '10:55', '2022-12-11', '17:05')
    chai.expect(output).to.equal('06:10')
  })

  it('should work in yet another simple case', function () {
    let output = exported.getDurationHours('2022-12-11', '10:55', '2022-12-11', '16:56')
    chai.expect(output).to.equal('06:01')
  })

  it('should work if the range spans multiple days - more complex case', function () {
    let output = exported.getDurationHours('2022-02-11', '23:00', '2022-02-12', '03:31')
    chai.expect(output).to.equal('04:31')
  })

  it('should work if the range spans multiple days - much more complex case', function () {
    let output = exported.getDurationHours('2022-02-11', '23:00', '2022-02-13', '03:31')
    chai.expect(output).to.equal('28:31')
  })

  it('should return 0 as a string if an argument is missing or empty/undefined', function () {
    let output = exported.getDurationHours('2022-02-11')
    chai.expect(output).to.equal('0')

    output = exported.getDurationHours('2022-02-11', '', '', '')
    chai.expect(output).to.equal('0')

    output = exported.getDurationHours('', '2022-03-14', undefined, '')
    chai.expect(output).to.equal('0')
  })
})