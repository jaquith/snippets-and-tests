const checkForCodeSignatures = function (signatures, string) {
  function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  signatures = signatures || []
  let foundCmp = 0
  signatures.forEach((snippet) => {
    const escapedSnippetForRegExp = escapeRegExp(snippet)
    // needs to be multiline to work correctly on the utag string
    const reMid = new RegExp(`^.*[^A-Za-z_0-9]+${escapedSnippetForRegExp}`, 'm')
    const reStart = new RegExp(`^${escapedSnippetForRegExp}`, 'm')
    if (typeof snippet === 'string' && snippet !== '' && typeof string === 'string' && reMid.test(string) || reStart.test(string)) {
      foundCmp = 1
    }
  })
  return foundCmp
}