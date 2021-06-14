// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/get-import-spoof-string.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the getImportSpoofString function', function () {
  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['getImportSpoofString'])
  })

  it('should generate simple import spoofs correctly', function () {
    const columns = ['test1', 'test2', 'test3', 'test4', 'test5']
    const customerId = 'customerABC'
    const customerIdColumnName = 'test2'
    const obj = {
      test3: 'testVal1',
      test5: 'testVal2'
    }
    const expected = `"test1","test2","test3","test4","test5"
,"customerABC","testVal1",,"testVal2"`

    chai.expect(exported.getImportSpoofString(columns, customerId, customerIdColumnName, obj)).to.deep.equal(expected)
  })
})
