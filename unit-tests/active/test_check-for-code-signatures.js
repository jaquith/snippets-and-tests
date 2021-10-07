// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/check-for-code-signatures.js')

// to share among tests
let exported

describe('the check-for-code-signatures', function () {
  it('should export without error', function () {
    const before = ''
    const after = ''
    exported = stringFunctions.exportNamedElements(code, ['checkForCodeSignatures'], before, after)
    chai.expect(exported).to.be.an('object').with.key('checkForCodeSignatures')
  })

  it('should work on a simple negative case', function () {
    const output = exported.checkForCodeSignatures(['Test'], ' test adkjadljaoiadja')
    chai.expect(output).to.equal(0)
  })

  it('should work on a simple positive case', function () {
    const output = exported.checkForCodeSignatures(['Test', 'test'], ' test adkjadljaoiadja')
    chai.expect(output).to.equal(1)
  })

  it('should work on another simple positive case', function () {
    const output = exported.checkForCodeSignatures(['test', 'Test'], ' test adkjadljaoiadja')
    chai.expect(output).to.equal(1)
  })

  it('should work on a simple positive case', function () {
    const output = exported.checkForCodeSignatures(['Test'], ' Test adkjadljaoiadja')
    chai.expect(output).to.equal(1)
  })

  it('should match the very beginning too', function () {
    const output = exported.checkForCodeSignatures(['Test'], 'Test adkjadljaoiadja')
    chai.expect(output).to.equal(1)
  })

  it('should not match unless a non-alphabetical character precedes', function () {
    const output = exported.checkForCodeSignatures(['Test'], ' myNegativeTest adkjadljaoiadja')
    chai.expect(output).to.equal(0)
  })

  it('should not match unless a non-alphabetical character precedes', function () {
    const output = exported.checkForCodeSignatures(['OptanonConsent'], '{function readCookie(){var cookies=document.cookie;var cookieArray=cookies.split("; ");var valueToSend="1000";for(var i=0;i<cookieArray.length;i++){var tempArray=[];if(cookieArray[i].split("=")[0]===\'OptanonConsent\')')
    chai.expect(output).to.equal(1)
  })

  it('should work on cookie checks', function () {
    const output = exported.checkForCodeSignatures(['OptanonConsent'], ' mafdjklafd adlfjk adfjkad fajdkf a cp.OptanonConsent adflkjadflkjadf')
    chai.expect(output).to.equal(1)
  })
})
