// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/custom-adobe-mapping.js')

// declared outside of the tests so it can be shared among them
let result
const u = { map: {} }
let b = {}

describe('the augmentMap function', function () {
  it('should export without error', function () {
    const before = 'function augmentMap (b, u) {\n'
    const after = '\nreturn u.map\n}'
    result = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['augmentMap'], before, after)
  })

  it('should work correctly when the mapping is filled', function () {
    b = {
      numberOfPax: '4'
    }
    u.map = {
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      'numberOfPax:*any*': 'event8',
      'somethingElse:value': 'should leave alone'
    }
    chai.expect(result.augmentMap(b, u)).to.deep.equal({
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      'numberOfPax:4': 'event8,VALUE_event8',
      'somethingElse:value': 'should leave alone'
    })
  })

  it('should work correctly with the mapping is not filled', function () {
    b = {}
    u.map = {
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      'numberOfPax:*any*': 'event8',
      'somethingElse:value': 'should leave alone'
    }
    chai.expect(result.augmentMap(b, u)).to.deep.equal({
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      'numberOfPax:*any*': 'event8',
      'somethingElse:value': 'should leave alone'
    })
  })
})
