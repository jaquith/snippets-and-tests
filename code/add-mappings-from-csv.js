function getSanitizedVariableName (oldName) {
  // sanitation regex, only allow letters, numbers, underscores, dollar signs,
  // array brackets, periods (same as TiQ Data Layer interface), remove others
  var blacklist = /[^0-9A-Z_$\[\]\.]/gi;
  var spacesAndHyphens = /[\s-]+/g;
  // replace groups of spaces and hyphens with underscores
  newName = oldName.replace(spacesAndHyphens, '_');
  // sanitize name
  newName = newName.replace(blacklist, '');
  return newName
}

function addMappingsWithAutomator (tagId, csv, automator) {
  var mappings = []
  var split = csv.split('\n').filter((el) => {
    return typeof el === 'string' && el !== ',' && el.indexOf(',') !== -1
  })

  var dedupeMap = {}
  split.forEach((row) => {
    let resplit = row.split(',')
    if (resplit.length !== 2) return;
    dedupeMap[getSanitizedVariableName(resplit[0])] = dedupeMap[getSanitizedVariableName(resplit[0])] || []
    dedupeMap[getSanitizedVariableName(resplit[0])].push(resplit[1])
  })

  for (key in dedupeMap) {
    if (dedupeMap.hasOwnProperty(key)) {
      mappings.push({
        key: 'legacy_' + key,
        type: 'js',
        variable: dedupeMap[key].join(', ')
      })
    }
  }

  console.log('Adding ' + mappings.length +' mappings')
  return automator.addMapping(tagId, mappings)
}

