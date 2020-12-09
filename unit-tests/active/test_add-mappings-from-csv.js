/* global describe, it, before, after */
'use strict'

const chai = require('chai')
const sinon = require('sinon')
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/add-mappings-from-csv.js')

let exported

describe('the addMappingsWithAutomator function', function () {
  before(function () {
    this.jsdom = require('jsdom-global')()
    // console.log(window)
    this.clock = sinon.useFakeTimers()
  })

  after(function () {
    this.jsdom()
    this.clock.restore()
  })

  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['addMappingsWithAutomator'])
    chai.expect(exported).to.be.an('object').with.key('addMappingsWithAutomator')
  })

  it('should call the automator.addMappings function with a correctly filtered and formed set of arguments', function () {
    const csv = 'creditNoteCode,eVar49\ncreditNoteCode,prop49\n,\nLock Your Price Available,eVar209'
    const utui = {}
    utui.automator = {}
    utui.automator.addMapping = sinon.stub()
    exported.addMappingsWithAutomator(6, csv, utui.automator)
    sinon.assert.calledOnceWithExactly(utui.automator.addMapping, 6, [
      {
        key: 'legacy_creditNoteCode',
        type: 'js',
        variable: 'eVar49, prop49'
      },
      {
        key: 'legacy_Lock_Your_Price_Available',
        type: 'js',
        variable: 'eVar209'
      }
    ])
  })
})
