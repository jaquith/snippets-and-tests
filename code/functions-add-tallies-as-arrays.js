// converts tallies to parallel arrays
const addTallies = function (objectThatNeedsTallyInfo, visitor) {
  objectThatNeedsTallyInfo = objectThatNeedsTallyInfo || {}
  let tallies = Object.keys(visitor.metric_sets)

  let excludeList = [      
    "Lifetime devices used",
    "Lifetime browser types used",
    "Lifetime operating systems used",
    "Lifetime platforms used",
    "Lifetime browser versions used"
]

  tallies.forEach(tallyName => {
      if (excludeList.indexOf(tallyName) !== -1) return 
      let tally = visitor.metric_sets[tallyName]
      let keys = Object.keys(tally)
      let values = Object.values(tally)
      // replace spaces and hyphens with underscores
      let cleanTallyName = tallyName.toLowerCase().replace(/\s+/g, '_') 
      cleanTallyName = cleanTallyName.replace(/-/g, '_') // 
      let blacklistRegex = /[^0-9A-Z_$\[\]\.]/gi
      cleanTallyName = cleanTallyName.replace(blacklistRegex, '')
      cleanTallyName = cleanTallyName.replace(/_+/g, '_')
      objectThatNeedsTallyInfo[`tally_${cleanTallyName}_keys`] = keys
      objectThatNeedsTallyInfo[`tally_${cleanTallyName}_values`] = values
  })
  return objectThatNeedsTallyInfo
}