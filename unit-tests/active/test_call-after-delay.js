/* global describe, it */
'use script'

const chai = require('chai')
const sinon = require('sinon')
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/call-after-delay.js')

let result

describe('the callAfterDelay wrapper', function () {
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
    const before = 'function theWrapper(window, b) {\n\n'
    const after = 'return callAfterDelay(b)\n}'
    result = stringFunctions.exportNamedElements(code, ['theWrapper'], before, after)
  })

  it('should call a test function after 2 seconds', function () {
    let testStub = sinon.stub()
    result.theWrapper(window, testStub)
    sinon.assert.notCalled(testStub)
    this.clock.tick(2000)
    sinon.assert.calledOnce(testStub)
  })
})
