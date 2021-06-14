// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/copy-b-to-utag-data.js')

// to share among tests
let exported

describe('the copy-to-utag-data extension', function () {
  it('should export without error', function () {
    const before = 'function theExtension (b, utag) {\n'
    const after = '\nreturn [b, utag && utag.data]\n}'
    exported = stringFunctions.exportNamedElements(code, ['theExtension'], before, after)
    chai.expect(exported).to.be.an('object').with.key('theExtension')
  })

  it('should work in a simple case without side-effects', function () {
    const b = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    const utag = {
      data: { 'cp.testCookie': 'testValue' }
    }
    const output = exported.theExtension(b, utag)
    const expectedB = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    const expectedUtagData = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2',
      'cp.testCookie': 'testValue'
    }
    chai.expect(output).to.deep.equal([expectedB, expectedUtagData])
  })

  it('should not do anything if b is undefined', function () {
    let b
    const utag = {
      data: { 'cp.testCookie': 'testValue' }
    }
    const output = exported.theExtension(b, utag)
    let expectedB
    const expectedUtagData = {
      'cp.testCookie': 'testValue'
    }
    chai.expect(output).to.deep.equal([expectedB, expectedUtagData])
  })

  it('should not do anything if utag is undefined', function () {
    const b = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    let utag
    const output = exported.theExtension(b, utag)
    const expectedB = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    let expectedUtagData
    chai.expect(output).to.deep.equal([expectedB, expectedUtagData])
  })

  it('should not do anything if utag.data is undefined', function () {
    const b = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    const utag = {}
    const output = exported.theExtension(b, utag)
    const expectedB = {
      shouldCopy: 'to utag.data 1',
      shouldAlsoCopy: 'to utag.data 2'
    }
    let expectedUtagData
    chai.expect(output).to.deep.equal([expectedB, expectedUtagData])
  })
})
