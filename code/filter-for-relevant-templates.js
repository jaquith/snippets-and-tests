// we only want to use the relevant one - revision if it exists, otherwise profile
const filterForRelevantTemplates = function (arrayOfKeys) {
  let relevantTemplates = {}
  arrayOfKeys = arrayOfKeys || []
  // fullName is like profile.3 or revision.loader
  arrayOfKeys.forEach((fullName) => {
    let type = fullName.split('.')[0]
    let template = fullName.split('.')[1]
    if (type === 'revision' || (type === 'profile' && relevantTemplates[template] !== 'revision')) {
      relevantTemplates[template] = type
    }
  })

  let outputArray = []

  // rebuild the array of strings again
  let templateNames = Object.keys(relevantTemplates)
  let templateTypes = Object.values(relevantTemplates)

  for (let i = 0; i < templateNames.length; i++) {
    let rejoinedString = `${templateTypes[i]}.${templateNames[i]}`
    outputArray.push(rejoinedString)
  }

  return outputArray
}