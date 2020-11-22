# snippets-and-tests
This is a lightweight framework to help unit test vanilla JS by transforming them into a Nodejs export.

After cloning the repo, run `npm install` to install dependencies.

Then you can run the tests in the `unit-tests/active` folder with `npm test`.  

The helper functions and included examples should let you easily test your own vanilla JS snippets as well.


----

# Helpers

The `stringFunctions` helper module has two functions that you can use to test vanilla JS functions.

Require it like this:

````javascript
const stringFunctions = require('../helpers/stringFunctions.js')
````

## getVanillaJsFile

Gets a target file as text.

````javascript
const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')
````

## exportNamedElements

Exports functions and constants from a target text snippet.  Also supports optional 'before' and 'after' snippets to allow you provide a wrapper.

### Arguments

 - **jsToTest** (required) - the JS snippet you want to test as a string

 - **listOfExports** (required) - a list of the functions / variables you want to export from the snippet

 - **beforeExpression** (optional) - a string to add before `jsToTest` to provide a wrapper

 - **afterExpression** (optional) - a string to add after `jsToTest` (but before the export expressions) to provide a wrapper


### Simple example, exporting two named functions

````javascript
describe('math-functions.js', () => {
  it('should support addition and subtraction', () => {
    const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')
    // export the 'add' and 'subtract' functions from the file to test them
    const simpleFunctionExports = stringFunctions.exportNamedElements(mathFunctions, ['add', 'subtract'])
    // test the functions
    chai.expect(simpleFunctionExports.add(2, 7)).to.equal(9)
    chai.expect(simpleFunctionExports.subtract(2, 7)).to.equal(-5)
  })
})
````

### Example providing a wrapper for a TiQ extension that is just an expression (not a function)

In this case, we use the optional 'before' and 'after' expression arguments to `exportNamedElements` to provide a wrapper, since the code we want to test is just a expression, not a full function.

```javascript
// get the extension code as a string
const cleanTheObject = stringFunctions.getVanillaJsFile('code/remove-empty-undefined-null.js')

describe('the remove empty/undefined/null value extension', () => {
  it('should remove empty, null, and undefined values but leave others alone', () => {
    // the expression as a string
    const jsAsTextForTesting = cleanTheObject
    // export the wrapper functions
    const listOfExports = ['theExtension']

    // add a wrapper function around the whole expression to allow export and testing
    const beforeExpression = 'function theExtension (b) {\n'
    const afterExpression = '\nreturn b\n}'

    // export and test
    const result = stringFunctions.exportNamedElements(jsAsTextForTesting, listOfExports, beforeExpression, afterExpression)
    chai.expect(result.theExtension({
      'test1' : 'a string',
      'test2' : true,
      'test3' : undefined,
      'test4' : 17.5,
      'test5' : '',
      'test6' : null,
      'test7' : 'Null',
      'test8' : 'null'
    })).to.deep.equal({
      'test1' : 'a string',
      'test2' : true,
      'test4' : 17.5
    })
  })
````

----

# Illustration of wrapper function and exports

In the above example, the extension string by itself isn't standalone.

```javascript

// remove null, empty, undefined
var keys = Object.keys(b);
for (var i = 0, key; i < keys.length; i++) {
  key = keys[i];
  if (b[key] === null || typeof b[key] === "undefined" || b[key] === "" || (typeof b[key] === 'string' && b[key].toLowerCase() === 'null')) {
    delete b[key];
  }
}
````
After wrapping (the `beforeExpression` and `afterExpression`) and exports it becomes:

````javascript
function theExtension (b) {
  // remove null, empty, undefined
  var keys = Object.keys(b);
  for (var i = 0, key; i < keys.length; i++) {
    key = keys[i];
    if (b[key] === null || typeof b[key] === "undefined" || b[key] === "" || (typeof b[key] === 'string' && b[key].toLowerCase() === 'null')) {
      delete b[key];
    }
  }
  return b
}
exports.theExtension = theExtension
````
...which allows export and testing.