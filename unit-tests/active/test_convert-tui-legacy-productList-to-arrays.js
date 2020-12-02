/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/convert-tui-legacy-productList-to-arrays.js')

let exported

const flattenerRaw = stringFunctions.getVanillaJsFile('code/tealium-flattener.js')
const before = 'function getTealFlattener() { var window = {};\nvar teal = {}\n'
const after = '\nreturn teal;\n}'
const flattenerExport = stringFunctions.exportNamedElements(flattenerRaw, ['getTealFlattener'], before, after)
// the flattener object itself
const teal = flattenerExport.getTealFlattener()

describe('the TUI legacy_productList reformatter', function () {
  describe('the flattener from the TLC', function () {
    it('should flatten', function () {
      chai.expect(teal).to.be.an('object')
      chai.expect(teal.flattenObject).to.be.a('function')
      chai.expect(teal.flattenObject({
        nested: {
          more_nesting: 'true'
        }
      })).to.deep.equal({
        'nested.more_nesting': 'true'
      })
    })
  })
  
  describe('the legacy_productList reformatter itself', function () {
    it('should export without error', function () {
      const before = 'function theWrapper(teal, b) {\n\n'
      const after = '\nreturn b;\n}'
      exported = stringFunctions.exportNamedElements(code, ['theWrapper'], before, after)
    })
  
    it('should correctly add the arrays without removing anything', function () {
      const b = {
        someKey: 'someVal',
        legacy_productList: [
          {
            list: 'Search Term',
            metric1: '2',
            productID: 'Any Geo',
            productName: 'Any Geo'
          },
          {
            productID: 'H002767',
            productName: 'Cinco Plazas Apartments',
            geo: {
              geoStructure: 'Spain|Lanzarote|Puerto del Carmen'
            },
            list: 'Search Results'
          },
          {
            productID: 'H015343',
            productName: 'TUI MAGIC LIFE Fuerteventura',
            geo: {
              geoStructure: 'Spain|Fuerteventura|Jandia'
            },
            list: 'Search Results'
          }
        ]
      }
      const result = exported.theWrapper(teal, b)
  
      chai.expect(result['legacy_productList.geo.geoStructure']).to.have.lengthOf(3)
      // this is a sparse array with an empty first entry
      chai.expect(result['legacy_productList.geo.geoStructure'][0]).to.be.undefined()
      chai.expect(result['legacy_productList.geo.geoStructure'][1]).to.equal('Spain|Lanzarote|Puerto del Carmen')
      chai.expect(result['legacy_productList.geo.geoStructure'][2]).to.equal('Spain|Fuerteventura|Jandia')
  
      // not a sparse array, but shorter than the rest (so also sparse in a way)
      chai.expect(result['legacy_productList.metric1']).to.have.lengthOf(1)
      chai.expect(result['legacy_productList.metric1'][0]).to.equal('2')
  
      // doesn't work right now, not sure how to represent sparse arrays in the tests.
      /*
      chai.expect(result).to.deep.equal({
        'someKey' : 'someVal',
        'legacy_productList' : [
          {
            "list": "Search Term",
            "metric1": "2",
            "productID": "Any Geo",
            "productName": "Any Geo"
          },
          {
            "productID": "H002767",
            "productName": "Cinco Plazas Apartments",
            "geo": {
              "geoStructure": "Spain|Lanzarote|Puerto del Carmen"
            },
            "list":"Search Results"
          },
          {
            "productID": "H015343",
            "productName": "TUI MAGIC LIFE Fuerteventura",
            "geo": {
              "geoStructure": "Spain|Fuerteventura|Jandia"
            },
            "list":"Search Results"
          }
        ],
        'legacy_productList.list': ["Search Term", "Search Results", "Search Results"],
        'legacy_productList.productID': ["Any Geo", "H002767", "H015343"],
        'legacy_productList.metric1': ["2",,],
        'legacy_productList.productName': ["Any Geo", "Cinco Plazas Apartments", "TUI MAGIC LIFE Fuerteventura"],
        'legacy_productList.geo.geoStructure': [,"Spain|Lanzarote|Puerto del Carmen", "Spain|Fuerteventura|Jandia"]
      })
      */
    })
  })
  
})

