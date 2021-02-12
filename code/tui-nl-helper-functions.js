// Add some helper functions to allow the JS code in other extensions to be shorter and more readable.
utag.ext = utag.ext || {}

// Pushes all elements of the second array passed to the the first array, if both arrays are defined.
utag.ext.mergeArrays = function (arr1, arr2) {
  // Works in IE 9 and up: 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return
  // Don't change the original arrays (no side-effects).
  var arr3 = []
  Array.prototype.push.apply(arr3, arr1)
  Array.prototype.push.apply(arr3, arr2)
  return arr3
}

// If both inputs are defined, returns a new array, a deep copy of the 
// input array with the input element pushed in.
//
// Otherwise, returns your 'array' arguement untouched.
utag.ext.pushIfDefined = function (array, element) {
  if (typeof array === 'undefined' || !Array.isArray(array) || typeof element === 'undefined') return array
  var outputArray = JSON.parse(JSON.stringify(array))
  outputArray.push(element)
  return outputArray
}