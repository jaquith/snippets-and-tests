// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai')) // appease the linter
const stringFunctions = require('../helpers/stringFunctions.js')
const snippet = stringFunctions.getVanillaJsFile('code/adobe-linkTrackEvents-addEvent-extension.js')
const sinon = require('sinon')

// declared outside of the tests so it can be shared among them
let exported


describe('the Adobe u.addEvent extension for TUI', function () {
  it('should export without error', function () {
    const before = 'function theExtension (u, b) {\n'
    const after = '\nreturn {u: u, b: b}\n}'
    exported = stringFunctions.exportNamedElements(snippet, ['theExtension'], before, after)
  })

  it('should run correctly with a simple case with one event', function () {
    let addEventStub = sinon.spy()

    const u = {
      data: {
      },
      addEvent: addEventStub
    }
    const b = {
      'linkTrackVars': 'eVar48,prop48',
      'linkTrackEvents': 'event500'
    }

    let response = exported.theExtension(u, b)
    
    chai.expect(response).to.deep.equal({
      u: {
        addEvent: addEventStub,
        data: {}
      },
      b: {
        'linkTrackVars': 'eVar48,prop48',
        'linkTrackEvents': 'event500'
      }
    })
    sinon.assert.calledOnce(addEventStub);
    sinon.assert.calledWith(addEventStub, 'event500');
  })

  it('should run correctly with a simple case with two events', function () {
    let addEventStub = sinon.spy()

    const u = {
      data: {
      },
      addEvent: addEventStub
    }
    const b = {
      'linkTrackVars': 'eVar48,prop48',
      'linkTrackEvents': 'event500,event501'
    }

    let response = exported.theExtension(u, b)
    
    chai.expect(response).to.deep.equal({
      u: {
        addEvent: addEventStub,
        data: {}
      },
      b: {
        'linkTrackVars': 'eVar48,prop48',
        'linkTrackEvents': 'event500,event501'
      }
    })
    sinon.assert.calledTwice(addEventStub);
    sinon.assert.calledWith(addEventStub, 'event500');
    sinon.assert.calledWith(addEventStub, 'event501');
  })

  it('should run correctly with a simple positive case with two events and extra whitespace', function () {
    let addEventStub = sinon.spy()

    const u = {
      data: {
      },
      addEvent: addEventStub
    }
    const b = {
      'linkTrackVars': 'eVar48,prop48',
      'linkTrackEvents': ' event500  , event501 '
    }

    let response = exported.theExtension(u, b)
    
    chai.expect(response).to.deep.equal({
      u: {
        addEvent: addEventStub,
        data: {}
      },
      b: {
        'linkTrackVars': 'eVar48,prop48',
        'linkTrackEvents': ' event500  , event501 '
      }
    })
    sinon.assert.calledTwice(addEventStub);
    sinon.assert.calledWith(addEventStub, 'event500');
    sinon.assert.calledWith(addEventStub, 'event501');
  })


  it('should not do anything when the variable is missing', function () {
    let addEventStub = sinon.spy()

    const u = {
      data: {
      },
      addEvent: addEventStub
    }
    const b = {
      'linkTrackVars': 'eVar48,prop48',
    }

    let response = exported.theExtension(u, b)
    
    chai.expect(response).to.deep.equal({
      u: {
        addEvent: addEventStub,
        data: {}
      },
      b: {
        'linkTrackVars': 'eVar48,prop48',
      }
    })
    sinon.assert.notCalled(addEventStub);
  })

  it('should not do anything when the variable is the default value', function () {
    let addEventStub = sinon.spy()

    const u = {
      data: {
      },
      addEvent: addEventStub
    }
    const b = {
      'linkTrackVars': 'None',
      'linkTrackEvents': 'None'
    }

    let response = exported.theExtension(u, b)
    
    chai.expect(response).to.deep.equal({
      u: {
        addEvent: addEventStub,
        data: {}
      },
      b: {
        'linkTrackVars': 'None',
        'linkTrackEvents': 'None'
      }
    })
    sinon.assert.notCalled(addEventStub);
  })

})
