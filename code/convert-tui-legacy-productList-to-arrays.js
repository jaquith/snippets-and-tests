if (typeof b.legacy_productList === "object" && b.legacy_productList.length) {
  for (var i = 0, flat, keys; i < b.legacy_productList.length; i++) {
    flat = teal.flattenObject(b.legacy_productList[i])
    keys = Object.keys(flat)
    for (var j = 0; j < keys.length; j++) {
      b['legacy_productList.' + keys[j]] = b['legacy_productList.' + keys[j]] || []
      b['legacy_productList.' + keys[j]][i] = flat[keys[j]]
    }
  }
}