/* global describe, it */
'use strict'

var chai = require('chai');
var like = require('chai-like');

var numberStringPlugin = {
  match: function(object) {
    return !isNaN(Number(object));
  },
  assert: function(object, expected) {
    return object === Number(expected);
  }
};
like.extend(numberStringPlugin);

chai.use(like);
chai.should()


describe('the example from the docs', function () {
 it ('should pass', function () {
    var object = {
      number: 123
    };
    object.should.like({
      number: '123'
    });
    object.should.not.like({
      number: 'not a number'
    });
 })
})
