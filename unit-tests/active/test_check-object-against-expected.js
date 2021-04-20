// Declare global variables for Standard JS (linter)
/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('chai-like'))
chai.use(require('dirty-chai')) // appease the linter
chai.use(require('deep-equal-in-any-order'))

const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/check-object-against-expected.js')

// to share among tests
let exported

function getError (output) {
  if (typeof output === 'object') {
    return '\n' + JSON.stringify(output, null, 2)
  }
}

describe('the checkObjectAgainstExpected helper function', function () {

  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['checkObjectAgainstExpected'])
    chai.expect(exported).to.be.an('object').with.key('checkObjectAgainstExpected')
  })

  it('should work in a simple case WITHOUT violations', function () {

    const actual = {
      test1: {
        test2: 'testVal1'
      },
      test3: {
        test4: 'testVal2'
      },
      test5: 'testVal3'
    }

    const expected = {
      test1: {
        test2: 'testVal1'
      },
      test3: {
        test4: 'testVal2'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.equal(true)
  })

  it('should work in a simple case WITH violations', function () {
    const actual = {
      test1: {
        test2: {
          test5: 'testVal1'
        }
      },
      test3: {},
      test5: 'testVal3'
    }
    const expected = {
      test1: {
        test2: {
          test5: 'testVal7'
        }
      },
      test3: {
        test4: 'testVal2'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {
        'test3.test4': {
          actual: undefined,
          expected: 'testVal2'
        }
      },
      unexpected: {},
      incorrect: {
        'test1.test2.test5': {
          actual: 'testVal1',
          expected: 'testVal7'
        }
      }
    })
  })

  it('should work in a simple case with empty strings WITHOUT violations', function () {
    const actual = {
      test3: {
        test4: ''
      },
      test5: 'testVal3'
    }
    const expected = {
      test1: {
        test2: ''
      },
      test3: {
        test4: ''
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.equal(true)
  })

  it('should work in a simple case with empty strings WITH "unexpected" violations', function () {
    const actual = {
      test3: {
        test4: 'not allowed',
        test5: 'allowed'
      },
      test5: 'testVal3'
    }
    const expected = {
      test1: {
        test2: ''
      },
      test3: {
        test4: ''
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      unexpected: {
        'test3.test4': {
          actual: 'not allowed',
        }
      },
      incorrect: {}
    })
  })

  it('should work in a simple case with empty strings WITH "incorrect" violations', function () {
    const actual = {
      test3: {
        test4: 'incorrect'
      },
      test5: 'testVal3'
    }
    const expected = {
      test1: {
        test2: ''
      },
      test3: {
        test4: 'correct'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      unexpected: {},
      incorrect: {
        'test3.test4': {
          actual: 'incorrect',
          expected: 'correct'
        }
      }
    })
  })

  it('should work in a simple case with empty strings WITH "missing" violations', function () {
    const actual = {
      test3: {
        test4: ''
      },
      test5: 'testVal3'
    }
    const expected = {
      test1: {
        test2: ''
      },
      test3: {
        test4: 'correct'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {
        'test3.test4': {
          actual: '',
          expected: 'correct'
        }
      },
      unexpected: {},
      incorrect: {}
    })
  })

  it('should support regular expressions in the values - no match', function () {
    const actual = {
      test1: {
        test2: 'this is not an acceptable value'
      }
    }
    const expected = {
      test1: {
        test2: /test/
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      unexpected: {},
      incorrect: {
        'test1.test2': {
          actual: 'this is not an acceptable value',
          expected: 'match with regular expression - /test/'
        }
      }
    })
  })

  it('should support regular expressions in the values - missing', function () {
    const actual = {
      test1: {
        test3: 'this is an irrelevant value'
      }
    }
    const expected = {
      test1: {
        test2: /test/
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {
        'test1.test2': {
          actual: undefined,
          expected: 'match with regular expression - /test/'
        }
      },
      unexpected: {},
      incorrect: {}
    })
  })

  it('should support regular expressions in the values - match', function () {

    const actual = {
      test1: {
        test2: 'this is an acceptable value because it has "test" in it'
      }
    }

    const expected = {
      test1: {
        test2: /test/
      }
    }

    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).equal(true)
  })

  it('should support regular expressions without flags in the keys for exclusions', function () {
    const actual = {
      test1: {
        test3: undefined, // fine, undefined is considered excluded
        test2: '', // fine, empty strings are also considered excluded
        test3: 'not allowed', // this parameter is not allowed
        test4: 'also not allowed'
      },
      test4: {
        test5: 'totally fine'
      }
    }
    const expected = {
      test1: {
        '/^test/': '' // don't allow any populated parameters that start with 'test'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      unexpected: {
        'test1.test3': {
          actual: 'not allowed'
        },
        'test1.test4': {
          actual: 'also not allowed'
        }
      },
      incorrect: {}
    })
  })

  it('should support regular expressions with flags in the keys for exclusions', function () {
    const actual = {
      test1: {
        test3: undefined, // fine, undefined is considered excluded
        test2: '', // fine, empty strings are also considered excluded
        TEST3: 'not allowed',
        test4: 'also not allowed' 
      },
      test4: {
        test5: 'totally fine'
      }
    }
    const expected = {
      test1: {
        '/^test/i': '' // don't allow any populated parameters that start with 'test'
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      unexpected: {
        'test1.TEST3': {
          actual: 'not allowed',
        },
        'test1.test4': {
          actual: 'also not allowed',
        }
      },
      incorrect: {}
    })
  })
  
  it('should support regular expressions with length checks - pass', function () {
    const actual = {
      test1: {
        test2: 'totally fine'
      }
    }
    const expected = {
      test1: {
        test2: /^[a-zA-Z0-9-.,;_&:\s]{1,300}$/
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.equal(true)
  })

  it('should support regular expressions with length checks - fail (value)', function () {
    const actual = {
      test1: {
        test2: 'totally fine?'
      }
    }
    const expected = {
      test1: {
        test2: /^[a-zA-Z0-9-.,;_&:\s]{1,300}$/
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      incorrect: {
        'test1.test2' : {
          actual: 'totally fine?',
          expected: 'match with regular expression - /^[a-zA-Z0-9-.,;_&:\\s]{1,300}$/'
        }
      },
      unexpected: {}
    })
  })

  it('should support regular expressions with length checks - fail (length)', function () {
    const actual = {
      test1: {
        test2: '1234567890 ' // too long
      }
    }
    const expected = {
      test1: {
        test2: /^[a-zA-Z0-9-.,;_&:\s]{1,10}$/
      }
    }
    const output = exported.checkObjectAgainstExpected(actual, expected)
    chai.expect(output, getError(output)).to.deep.equalInAnyOrder({
      missing: {},
      incorrect: {
        'test1.test2' : {
          actual: '1234567890 ',
          expected: 'match with regular expression - /^[a-zA-Z0-9-.,;_&:\\s]{1,10}$/'
        }
      },
      unexpected: {}
    })
  })
})
