/* global describe, it */
'use script'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/lowercase-querystring-keys.js')

let result

describe('the lowercase querystring keys extension', () => {
  it('should run without error', () => {
    result = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
  })

  it('should lowecase the keys of querystring parameters and leave the values intact', () => {
    chai.expect(result.theExtension({
      'test1' : 'a string',
      'test2' : true,
      'qp.tesT2' : 'another_teSt',
      'qp.TestIng' : 'testinG',
      'cp.TestCookie' : 'TestCookie',
      'qp.TESTQP' : '1234'
    })).to.deep.equal({
      'test1' : 'a string',
      'test2' : true,
      'qp.test2' : 'another_teSt',
      'qp.testing' : 'testinG',
      'cp.TestCookie' : 'TestCookie',
      'qp.testqp' : '1234'
    })
  })

})
