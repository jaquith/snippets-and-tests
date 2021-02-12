/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const populateUdo = stringFunctions.getVanillaJsFile('code/tui-populate-udo.js')

let exported

describe('the TUI populate UDO extension (Ensighten spoofs)', function (){
  describe('the Bootstrapper.Cookies.get spoof function in the TUI populate UDO legacy functions', function () {
    it('should export without error', function () {
      exported = stringFunctions.exportNamedElements(populateUdo, ['cookieGetSpoof'], 'function cookieGetSpoof (b, cookieName) {\nvar window = {}\n', '\nreturn Bootstrapper.Cookies.get(cookieName)\n}')
    })
  
    it('should correctly pull cookies from the b object', function () {
      let b = {
        'cp._ga': '12345678'
      }
      chai.expect(exported.cookieGetSpoof(b, '_ga')).to.equal('12345678')
    })
  })

  describe('the Bootstrapper.getQueryParam spoof function in the TUI populate UDO legacy functions', function () {
    it('should export without error', function () {
      exported = stringFunctions.exportNamedElements(populateUdo, ['getQueryParam'], 'function getQueryParam (b, queryParamName) {\nvar window = {}\n', '\nreturn Bootstrapper.getQueryParam(queryParamName)\n}')
    })
  
    it('should correctly pull query parameters from the b object', function () {
      let b = {
        'qp.test': '12345678'
      }
      chai.expect(exported.getQueryParam(b, 'test')).to.equal('12345678')
    })
  })
})


