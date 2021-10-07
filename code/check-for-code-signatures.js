const checkForCodeSignatures = function (signatures, string) {
  signatures = signatures || []
  let foundCmp = 0
  signatures.forEach((snippet) => {
    const reMid = new RegExp(`^.*[^A-Za-z]+${snippet}`)
    const reStart = new RegExp(`^${snippet}`)
    if (typeof snippet === 'string' && snippet !== '' && typeof string === 'string' && reMid.test(string) || reStart.test(string)) {
      foundCmp = 1
    }
  })
  return foundCmp
}