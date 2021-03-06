/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const removeFunction = stringFunctions.getVanillaJsFile('code/remove-empty-undefined-null.js')

let exported

describe('the remove empty/undefined/null value solution', function () {
  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(removeFunction, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
  })

  it('should remove empty, null, and undefined values but leave others alone', function () {
    chai.expect(exported.theExtension({
      test1: 'a string',
      test2: true,
      test3: undefined,
      test4: 17.5,
      test5: '',
      test6: null,
      test7: 'Null',
      test8: 'null'
    })).to.deep.equal({
      test1: 'a string',
      test2: true,
      test4: 17.5
    })
  })
})
