/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')

let exported

describe('the eval solution itself, when exporting simple functions', function () {
  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(mathFunctions, ['add', 'subtract'])
  })

  it('should allow a single function in a file to run', function () {
    chai.expect(exported.add(2, 5)).to.equal(7)
  })
})
