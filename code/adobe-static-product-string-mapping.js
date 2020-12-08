// CUSTOM to use the TUI legacy product string for the moment
// allows mappings to 'STATIC_PRODUCT_STRING' to override the dynamically generated product string, if the mapped attribute is a non-empty string
var mappedKeys = Object.keys(u.map)
for (var m = 0, attr; m < mappedKeys.length; m++) {
  attr = mappedKeys[m]
  if (u.map[attr].indexOf("STATIC_PRODUCT_STRING") !== -1 && typeof b[attr] === 'string' && b[attr] !== "") {
    u.o.products = b[attr]
  }
}