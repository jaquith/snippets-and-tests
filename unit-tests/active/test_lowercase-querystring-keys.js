/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/lowercase-querystring-keys.js')

let result

describe('the lowercase querystring keys extension', function () {
  it('should export without error', function () {
    result = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
  })

  it('should lowecase the keys of querystring parameters and leave other values intact', function () {
    chai.expect(result.theExtension({
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
