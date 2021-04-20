// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/filter-for-relevant-templates.js')


// declared outside of the tests so it can be shared among them
let exported
let undefinedVar


describe('the filter-for-relevant-templates function', function () {
  it('should export without error', function () {
    const before = ''
    const after = ''
    exported = stringFunctions.exportNamedElements(snippet, ['filterForRelevantTemplates'], before, after)
  })

  it('should work correctly in a simple case', function () {
    let result = exported.filterForRelevantTemplates(['profile.1', 'revision.1'])
    chai.expect(result).to.be.an('array').deep.equal(["revision.1"])
  })

})




