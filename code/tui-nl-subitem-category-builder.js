// construct values based on a match table

var cats = b['basket.items.subItems.productType'] || b['transactions.items.subItems.productType']
var subCats = b['basket.items.subItems.productSubType'] || b['transactions.items.subItems.productSubType']

b.subItemCategories = []

var totalPriceInsurance = 0
var totalPriceLuggage = 0

// get the price and quantity for a specific subitem index and return the product or 0
function getTotalPrice(index) {
  var prices = b['basket.items.subItems.price.currentPrice'] || b['transactions.items.subItems.price.currentPrice'] || []
  if (Number(prices[index]) > 0) {
    return Number(prices[index])
  }
  return 0
}

if (Array.isArray(cats) && Array.isArray(subCats) && cats.length === subCats.length) {
  for (var i = 0, catVal, subCatVal, parts; i < cats.length; i++) {
    catVal = cats[i]
    subCatVal = subCats[i]
    parts = []
    // always the first category
    parts.push('ancillary')
    if (catVal === 'FLIGHT' && subCatVal === 'BAG') {
      parts.push('luggage')
      parts.push('flight_luggage-regular')
      totalPriceLuggage += getTotalPrice(i)
    } else if (catVal === 'FLIGHT' && subCatVal === '{{??}}') {
      parts.push('fly deluxe')
    } else if (catVal === 'FLIGHT' && subCatVal === 'INS') {
      parts.push('insurance')
      totalPriceInsurance += getTotalPrice(i)
    } else if (catVal === 'FLIGHT' && subCatVal === 'SEATTYPE') {
      parts.push('seattype')
    } else if (catVal === 'FLIGHT') {
      parts.push(subCatVal.toLowerCase())
    }
    b.subItemCategories.push(parts.join('/'))
  }
}

b.totalPriceInsurance = String(totalPriceInsurance)
b.totalPriceLuggage = String(totalPriceLuggage)