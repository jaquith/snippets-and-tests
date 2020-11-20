/**
 * Convert shop_order_product_ strings into arrays to make them easier to use.
 *
 * Turns
{
  "shop_order_id": "1800009336",
  "shop_name": "Mein Schiff ® Shop",
  "shop_order_total": 11.7,
  "shop_order_tax": 1.6138,
  "shop_order_shipping": 5.0862,
  "shop_order_product_1_name": "Testartikel Streichpreise",
  "shop_order_product_1_price": "5.0000",
  "shop_order_product_1_quantity": "1.0000",
  "shop_order_product_2_name": "Testartikel Streichpreise 2",
  "shop_order_product_2_price": "7.0000",
  "shop_order_product_2_quantity": "2.0000"
}
 *
 * into
 *
{
  "shop_order_id": "1800009336",
  "shop_name": "Mein Schiff ® Shop",
  "shop_order_total": 11.7,
  "shop_order_tax": 1.6138,
  "shop_order_shipping": 5.0862,
  "shop_order_product_name": [
    "Testartikel Streichpreise",
    "Testartikel Streichpreise 2"
  ],
  "shop_order_product_price": [
    "5.0000",
    "7.0000"
  ],
  "shop_order_product_quantity": [
    "1.0000",
    "2.0000"
  ]
}
*/

b = buildProductArrays(b)

function buildProductArrays (b) {
  if (typeof b !== 'object') return b

  var re = /^shop_order_product_([0-9]+)_(.+)$/
  var allVariables = Object.keys(b)
  var topIndexSeen = 0
  var i, j, varName, match, index, name, varNameArray

  const allMatches = {}
  for (i = 0; i < allVariables.length; i++) {
    varName = allVariables[i]
    if (typeof b[varName] !== 'string') continue
    match = varName.match(re)
    allMatches[varName] = match
    if (match && match[1] && match[2]) {
      index = Number(match[1]) - 1
      name = match[2]
      topIndexSeen = topIndexSeen > index ? topIndexSeen : index
      varNameArray = 'shop_order_product_' + name
      b[varNameArray] = b[varNameArray] || []
      b[varNameArray][index] = b[varName] || ''
      // fill in any missing variables
      for (j = 0; j < b[varNameArray].length; j++) {
        b[varNameArray][j] = b[varNameArray][j] || ''
      }
      // we don't need the string anymore, now that it's been added to the array
      delete b[varName]
    }
  }

  // refresh list after adding the new arrays (and removing the strings)
  allVariables = Object.keys(b)

  // ensure that all the arrays have the same max length (add empty entries to the end if needed)
  let isProductArray
  for (i = 0; i < allVariables.length; i++) {
    re = /^shop_order_product_(.+)$/
    varName = allVariables[i]
    // make sure it's an array
    if (typeof b[varName] !== 'object' || typeof b[varName].push !== 'function') continue
    isProductArray = re.test(varName)
    if (isProductArray) {
      for (j = 0; j <= topIndexSeen; j++) {
        b[varName][j] = b[varName][j] || ''
      }
    }
  }
  return b
}
