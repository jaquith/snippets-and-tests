// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const lowercaseQuerystringKeys = stringFunctions.getVanillaJsFile('code/adobe-static-product-string-mapping.js')

// declared outside of the tests so it can be shared among them
let exported

describe('the addStaticProductString functionality (template edit)', function () {
  it('should export without error', function () {
    const before = 'function addStaticProductString (b, u) {\n'
    const after = '\nreturn u\n}'
    exported = stringFunctions.exportNamedElements(lowercaseQuerystringKeys, ['addStaticProductString'], before, after)
  })

  it('should work correctly when the mapped attribute is populated and there are NO other mappings for that attribute', function () {
    const u = { map: {}, o: {} }
    const b = {
      staticAdobeProductString: ';H002964;;;;eVar153=Beach'
    }
    u.map = {
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      staticAdobeProductString: 'STATIC_PRODUCT_STRING',
      somethingElse: 'should leave alone'
    }
    chai.expect(exported.addStaticProductString(b, u)).to.deep.equal({
      map: {
        adobeChannel: 'channel',
        adobeCampaign: 'campaign',
        staticAdobeProductString: 'STATIC_PRODUCT_STRING',
        somethingElse: 'should leave alone'
      },
      o: {
        products: ';H002964;;;;eVar153=Beach'
      }
    })
  })

  // just in case, but not immediately needed
  it('should work correctly when the mapped attribute is populated and there are other mappings for the same attribute', function () {
    const u = { map: {}, o: {} }
    const b = {
      staticAdobeProductString: ';H002964;;;;eVar153=Beach'
    }
    u.map = {
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      staticAdobeProductString: 'eVar15,STATIC_PRODUCT_STRING,event7',
      somethingElse: 'should leave alone'
    }
    chai.expect(exported.addStaticProductString(b, u)).to.deep.equal({
      map: {
        adobeChannel: 'channel',
        adobeCampaign: 'campaign',
        staticAdobeProductString: 'eVar15,STATIC_PRODUCT_STRING,event7',
        somethingElse: 'should leave alone'
      },
      o: {
        products: ';H002964;;;;eVar153=Beach'
      }
    })
  })

  it('should work correctly with the mapped attribute is not filled', function () {
    const u = { map: {}, o: {} }
    const b = {}
    u.map = {
      adobeChannel: 'channel',
      adobeCampaign: 'campaign',
      staticAdobeProductString: 'STATIC_PRODUCT_STRING',
      somethingElse: 'should leave alone'
    }
    chai.expect(exported.addStaticProductString(b, u)).to.deep.equal({
      map: {
        adobeChannel: 'channel',
        adobeCampaign: 'campaign',
        staticAdobeProductString: 'STATIC_PRODUCT_STRING',
        somethingElse: 'should leave alone'
      },
      o: {}
    })
  })
})
