// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/lowercase-querystring-keys.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the lowercase querystring keys extension', function () {
  it('should export without error', function () {
    const before = 'function theExtension (b) {\n'
    const after = '\nreturn b\n}'
    exported = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['theExtension'], before, after)
  })

  it('should lowercase the keys of querystring parameters and leave other values intact', function () {
    chai.expect(exported.theExtension({
      test1: 'a string',
      test2: true,
      'qp.tesT2': 'another_teSt',
      'qp.TestIng': 'testinG',
      'cp.TestCookie': 'TestCookie',
      'qp.TestQP': '1234',
      'qp.alreadylower': '5678',
      'qp.UTM_Source': 'Email'
    })).to.deep.equal({
      test1: 'a string',
      test2: true,
      'qp.test2': 'another_teSt',
      'qp.testing': 'testinG',
      'cp.TestCookie': 'TestCookie',
      'qp.alreadylower': '5678',
      'qp.testqp': '1234',
      'qp.utm_source': 'Email'
    })
  })
})
