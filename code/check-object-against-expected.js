function checkObjectAgainstExpected (actual, expected) {

  const output = {
    missing: {},
    unexpected: {},
    incorrect: {}
  }

  const maxRecursions = 10

  function log (message) {
    // console.log(message)
  }

  function theLoop (expected, actual, parentString, recursions) {
    recursions = recursions || 0

    const expectedKeys = Object.keys(expected)
    const expectedValues = Object.values(expected)

    const actualKeys = Object.keys(actual)
    const actualValues = Object.values(actual)

    expectedValues.forEach((expectedValue, i) => {
      parentString = parentString || ''
      const key = expectedKeys[i]
      const newParentString = parentString ? parentString + '.' : ''
      const fullKey = newParentString + key
      const actualValue = actual[key]
      const actualValueIsEmpty = typeof actualValue === 'undefined' || (typeof actualValue === 'string' && actualValue === '')

      // anything 'expected' to be an empty string should either be an empty string OR be missing
      if (expectedValue === '') {
        // regex keys are supported for exclusions, detect those cases and add any matching populated keys to the 'unexpected' output
        const keyIsRegexExclusion = !!(key && typeof key.match === 'function' && key.match(/\/(.+)\/(.*)/))
        log(key + ' regex exclusion recognition: ' + keyIsRegexExclusion)
        if (keyIsRegexExclusion) {
          let match = key.match(/\/(.+)\/(.*)/)
          let body = match && match[1]
          let flags = match && match[2]
          const re =  new RegExp(body, flags)
          actualKeys.forEach((key, i) => {
            const actualValue = actualValues[i]
            const revisedFullKey = newParentString + key
            const actualValueIsEmpty = typeof actualValue === 'undefined' || (typeof actualValue === 'string' && actualValue === '')
            log(revisedFullKey + ' is unexpected based on match with ' + re )
            if (re.test(key) && !actualValueIsEmpty) {
              output.unexpected[revisedFullKey] = {
                actual: actualValue
              }
            }
          })
        } else if (!actualValueIsEmpty) {
        // if we find an unexpected key
          log(fullKey + ' is unexpected')
          output.unexpected[fullKey] = {
            actual: actualValue
          }
        }
      // if the expected value is a regular expression, test the actual value against it
      } else if (typeof expectedValue.test === 'function') {
        if (expectedValue.test(actualValue) !== true) {
          if (typeof actualValue === 'undefined') {
            log(fullKey + ' is missing')
            output.missing[fullKey] = {
              actual: actualValue,
              expected: 'match with regular expression - ' + String(expectedValue)
            }
          } else {
            log(fullKey + ' is incorrect (' + actualValue + ' does not equal expected ' + expectedValue + ')')
            output.incorrect[fullKey] = {
              actual: actualValue,
              expected: 'match with regular expression - ' + String(expectedValue)
            }
          }
        }
      // if the value is an object, we need to check each key
      } else if (typeof expectedValue === 'object') {
        // iterate through the keys and values
        if (Object.keys(expectedValue).length > 0 && recursions < maxRecursions) {
          return theLoop(expectedValue, actualValue || {}, fullKey, recursions + 1)
        }
      // otherwise, check for strict equality
      } else if (actualValue !== expectedValue) {
        if (actualValueIsEmpty) {
          log(fullKey + ' is missing')
          output.missing[fullKey] = {
            actual: actualValue,
            expected: expectedValue
          }
        } else {
          log(fullKey + ' is incorrect (' + actualValue + ' does not equal expected ' + expectedValue + ')')
          output.incorrect[fullKey] = {
            actual: actualValue,
            expected: expectedValue
          }
        }
      }
    })
  }

  theLoop(expected, actual)
  const issueCount = (Object.keys(output.missing).length + Object.keys(output.unexpected).length + Object.keys(output.incorrect).length)
  if (issueCount === 0) {
    return true
  }
  return output
}