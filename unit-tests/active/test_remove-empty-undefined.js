/* global describe, it */
'use script'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const removeFunction = stringFunctions.getVanillaJsFile('code/remove-empty-undefined-null.js')

let result

describe('the remove empty/undefined/null value solution', function () {
  it('should run without error', function () {
    result = stringFunctions.exportNamedElements(removeFunction, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
  })

  it('should remove empty, null, and undefined values but leave others alone', function () {
    chai.expect(result.theExtension({
      'test1' : 'a string',
      'test2' : true,
      'test3' : undefined,
      'test4' : 17.5,
      'test5' : '',
      'test6' : null,
      'test7' : 'Null',
      'test8' : 'null'
    })).to.deep.equal({
      'test1' : 'a string',
      'test2' : true,
      'test4' : 17.5
    })
  })

})
