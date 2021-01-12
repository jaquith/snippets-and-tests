// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/uniqodo-snippet.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the UNIQODO template snippet', function () {
  it('should export without error', function () {
    const before = 'function theExtension (u) {\n'
    const after = '\nreturn u\n}'
    exported = stringFunctions.exportNamedElements(snippet, ['theExtension'], before, after)
  })

  it('should fill in any missing p (custom) values, up to a configurable max set to 5', function () {
    let u = {
      data : {
        pMax: "5",
        p: {
          p1: 'test',
          p3: 'another test'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        pMax: "5",
        p: {
          p1: 'test',
          p2: '',
          p3: 'another test',
          p4: '',
          p5: ''
        }
      }
    })
  })

  it('should fill in any missing p (custom) values, up to a configurable max set to 20', function () {
    let u = {
      data : {
        pMax: "20",
        p: {
          p1: 'test',
          p3: 'another test',
          p19: 'TEST'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        pMax: "20",
        p: {
          p1: 'test',
          p2: '',
          p3: 'another test',
          p4: '',
          p5: '',
          p6: '',
          p7: '',
          p8: '',
          p9: '',
          p10: '',
          p11: '',
          p12: '',
          p13: '',
          p14: '',
          p15: '',
          p16: '',
          p17: '',
          p18: '',
          p19: 'TEST',
          p20: ''
        }
      }
    })

  })
  
  it('should fail gracefully if the mapping is not a number', function () {
    let u = {
      data : {
        pMax: "broken",
        p: {
          p1: 'test',
          p3: 'another test'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        pMax: "broken",
        p: {
          p1: 'test',
          p2: '',
          p3: 'another test',
          p4: '',
          p5: ''
        }
      }
    })
  })
})
