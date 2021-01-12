// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/uniqodo-snippet-new.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the new UNIQODO template snippet', function () {
  it('should export without error', function () {
    const before = 'function theExtension (u) {\n'
    const after = '\nreturn u\n}'
    exported = stringFunctions.exportNamedElements(snippet, ['theExtension'], before, after)
  })

  it('should fill in any missing p (custom) values', function () {
    let u = {
      data : {
        p: {
          p1: 'test',
          p13: 'another test'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        p: {
          p1: 'test',
          p2: '',
          p3: '',
          p4: '',
          p5: '',
          p6: '',
          p7: '',
          p8: '',
          p9: '',
          p10: '',
          p11: '',
          p12: '',
          p13: 'another test'
        }
      }
    })
  })

  it('should fill in any missing p (custom) values', function () {
    let u = {
      data : {
        p: {
          p13: 'another test',
          pOther: 'leave intact'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        p: {
          p1: '',
          p2: '',
          p3: '',
          p4: '',
          p5: '',
          p6: '',
          p7: '',
          p8: '',
          p9: '',
          p10: '',
          p11: '',
          p12: '',
          p13: 'another test',
          pOther: 'leave intact'
        }
      }
    })
  })

  it('should not add any index p values if none are mapped', function () {
    let u = {
      data : {
        p: {} // this is the template default
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        p: {}
      }
    })
  })

  it('should not add any index p values if nothing is mapped', function () {
    let u = {
      data : {
        p: {
          pOther: 'leave intact'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        p: {
          pOther: 'leave intact'
        }
      }
    })
  })

  it('should fill in any missing p (custom) values between 1 and the max index mapped', function () {
    let u = {
      data : {
        p: {
          p1: 'test',
          p3: 'another test',
          p19: 'TEST'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
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
          p19: 'TEST'
        }
      }
    })

  })
  
  it('should fail gracefully if the mapping is not a number', function () {
    let u = {
      data : {
        p: {
          p1: 'test',
          p3: 'another test'
        }
      }
    }
    chai.expect(exported.theExtension(u)).to.deep.equal({
      data : {
        p: {
          p1: 'test',
          p2: '',
          p3: 'another test',
        }
      }
    })
  })
})
