// limit the mapped variables for consent events

// A list of the mappings that should be kept for consent events - anything else will be removed from the u.map object

var safeList = [
  's_account', 
  'eVar48', 
  'prop48', 
  'channel', 
  'campaign',
  'event', 
  'event107', 
  'event108', 
  'event109',
  'event8',
  'event25',
  'event26',
  'eVar210',
  'eVar211',
  'eVar212',
  'linkName'
]

var simpleResults = {}
var mappedKeys = Object.keys(u.map)
for (var i = 0, attr, mappedValues, newMappedValues; i < mappedKeys.length; i++) {
  mappedKey = mappedKeys[i]
  mappedValues = u.map[mappedKey].split(',')
  newMappedValues = []
  for (var j = 0, mappedValue, simplified; j < mappedValues.length; j++) {
    mappedValue = mappedValues[j]

    // treat VALUE_event8  as 'event8'
    simplified = getSimpleValue(mappedValue)
    simpleResults[mappedValue] = simplified

    if (safeList.indexOf(simplified) !== -1) {
      newMappedValues.push(mappedValue)
    }
    if (newMappedValues.length > 0) {
      u.map[mappedKey] = newMappedValues.join(',')
    } else {
      delete u.map[mappedKey]
    }
  }
}

function getSimpleValue (full) {
  var re = /^VALUE_(.*)$/
  var match = full.match(re)
  if (match && match[1]) {
    return match[1]
  }
  return full
}
