// lowercase query parameters for consistency
var keys = Object.keys(b);
var re = /^qp\.(.*)/;
var match, udoString;
for (i = 0; i < keys.length; i++) {
  match = keys[i].match(re);
  if (match !== null) {
    // lowercase the keys, not the values
    udoString = "qp." + match[1];
    b[udoString.toLowerCase()] = b[udoString]
    delete b[udoString];
  }
}