// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/negate-regex.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the negateRegex function', function () {
  it('should export without error', function () {
    const before = ''
    const after = ''
    exported = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['negateRegex'], before, after)
  })

  it('should negate simple regexes', function () {
    chai.expect(exported.negateRegex(/^test$/)).to.deep.equal(/^(?!(?:^test$)$).*$/)
    chai.expect(exported.negateRegex(/test/ig)).to.deep.equal(/^(?!(?:test)$).*$/ig)
  })

  it('the regexes should work correctly', function () {
    const re = /^test$/
    const negated = exported.negateRegex(re)
    let testString = 'test'
    chai.expect(re.test(testString), 'first start Regex mismatch').to.equal(true)
    chai.expect(negated.test(testString), 'first negation failed').to.equal(false)

    testString = 'test2'
    chai.expect(re.test(testString), 'second start Regex mismatch').to.equal(false)
    chai.expect(negated.test(testString), 'second negation failed').to.equal(true)
  })

  it('should respond to non-regex input with undefined', function () {
    let re = '/^test$/'
    let negated = exported.negateRegex(re)
    chai.expect(negated).to.be.undefined()

    re = {}
    negated = exported.negateRegex(re)
    chai.expect(negated).to.be.undefined()

    re = ['an array']
    negated = exported.negateRegex(re)
    chai.expect(negated).to.be.undefined()
  })
})
