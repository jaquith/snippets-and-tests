if (typeof b === 'object' && utag && typeof utag.data === 'object') {
  var keys = Object.keys(b)
  var values = Object.values(b)
  keys.forEach((key, index) => {
    var value = values[index]
    utag.data[key] = value
  })
}