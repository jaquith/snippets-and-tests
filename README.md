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

### Simple example, exporting two functions

````javascript
describe('', () => {

})
it('should support addition and subtraction', () => {
  const mathFunctions = stringFunctions.getVanillaJsFile('code/math-functions.js')
  // export the 'add' and 'subtract' functions from the file to test them
  const simpleFunctionExports = stringFunctions.exportNamedElements(mathFunctions, ['add', 'subtract'])
  // test the functions
  chai.expect(simpleFunctionExports.add(2, 7)).to.equal(9)
  chai.expect(simpleFunctionExports.subtract(2, 7)).to.equal(-5)
})
````

### Example providing a wrapper for a TiQ extension

In this case, we use the optional 'before' and 'after' expression arguments to `exportNamedElements` to provide a wrapper, since the code we want to test is just a expression, not a full function.

```javascript
// this would be in a separate file in reality, just shown as a constant for illustration
const cleanTheObject = `
// remove null, empty, undefined
var keys = Object.keys(b);
for (var i = 0, key; i < keys.length; i++) {
  key = keys[i];
  if (b[key] === null ||  typeof b[key] === "undefined" || b[key] === "" || (typeof b[key] === 'string' && b[key].toLowerCase() === 'null')) {
    delete b[key];
  }
}
`
describe('the remove empty/undefined/null value solution', () => {
  it('should remove empty, null, and undefined values but leave others alone', () => {
    const result = stringFunctions.exportNamedElements(cleanTheObject, ['theExtension'], 'function theExtension (b) {\n', '\nreturn b\n}')
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