var chai = require('chai');
var like = require('chai-like');

var regexPlugin = {
  match: function(object, expected) {
    return typeof object === 'string' && expected instanceof RegExp;
  },
  assert: function(object, expected) {
    return expected.test(object);
  }
};

like.extend(regexPlugin);

chai.use(like);

describe('the regex example from the docs', function () {
  it ('should pass', function () {
    var object = {
      text: 'the quick brown fox jumps over the lazy dog'
    };
    object.should.like({
      text: /.* jumps over .*/
    });
    object.should.not.like({
      text: /\d/
    });
  })
})

