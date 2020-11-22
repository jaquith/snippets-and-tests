/* global describe, it */
'use script'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')

let result

describe('the eval solution', function () {
  it('should run without error', function () {
    result = stringFunctions.exportNamedElements(mathFunctions, ['add', 'subtract', 'testString'])
  })

  it('should allow a single function in a file to run', function () {
    chai.expect(result.add(2, 5)).to.equal(7)
  })

  it('should fetch strings also', function () {
    chai.expect(result.testString).to.equal('You found me!')
  })
})
