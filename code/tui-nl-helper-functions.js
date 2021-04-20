// Add some helper functions to allow the JS code in other extensions to be shorter and more readable.
utag.ext = utag.ext || {};

// Pushes all elements of the second array passed to the the first array, if both arrays are defined.
utag.ext.mergeArrays = function (arr1, arr2) {
  // Works in IE 9 and up: 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return;
  // Don't change the original arrays (no side-effects).
  var arr3 = [];
  Array.prototype.push.apply(arr3, arr1);
  Array.prototype.push.apply(arr3, arr2);
  return arr3;
};

// If both inputs are defined, returns a new array, a deep copy of the 
// input array with the input element pushed in.
//
// Otherwise, returns your 'array' arguement untouched.
utag.ext.pushIfDefined = function (array, element) {
  if (typeof array === 'undefined' || !Array.isArray(array) || typeof element === 'undefined') return array;
  var outputArray = JSON.parse(JSON.stringify(array));
  outputArray.push(element);
  return outputArray;
};

// modified from https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
/* For a given date string, get the ISO week number and year, like '2021-34'
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014-12-29 is Monday in week 01 of 2015
 *      2012-01-01 is Sunday in week 52 of 2011
 */
utag.ext.getWeekNumber = function (d) {
  // allow passing strings like "YYYY-MM-DD" in by converting them
  if (typeof d === "string" && d.split('-').length === 3) {
    var year = Number(d.split('-')[0]);
    var monthIndex = Number(d.split('-')[1]) - 1;
    var day = Number(d.split('-')[2]);
    d = new Date(year, monthIndex, day);
  }
  // Return 'no date' if the input is not a date or the right kind of string
  if (typeof d !== 'object' || typeof d.getDay !== 'function') return 'no date';
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  //return [d.getUTCFullYear(), weekNo];
  // Add leading zero if needed
  weekNo = weekNo > 9 ? '' + weekNo : '0' + weekNo;
  return d.getUTCFullYear() + '-' + weekNo;
};