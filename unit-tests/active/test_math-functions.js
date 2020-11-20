/* global describe, it */
'use script'

const chai = require('chai')

const stringFunctions = require('../helpers/stringFunctions.js')

const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')

let result

describe('the eval solution', () => {
  it('should run without error', () => {
    result = stringFunctions.runStringFunctions(mathFunctions, ['add', 'subtract', 'testString'])
  })

  it('should allow a single function in a file to run', () => {
    chai.expect(result.add(2, 5)).to.equal(7)
  })

  it('should fetch strings also', () => {
    chai.expect(result.testString).to.equal('You found me!')
  })
})
