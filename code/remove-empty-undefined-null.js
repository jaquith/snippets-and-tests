// remove null, empty, undefined
var keys = Object.keys(b);
for (var i = 0, key; i < keys.length; i++) {
  key = keys[i];
  if (b[key] === null || typeof b[key] === "undefined" || b[key] === "" || (typeof b[key] === 'string' && b[key].toLowerCase() === 'null')) {
    delete b[key];
  }
}