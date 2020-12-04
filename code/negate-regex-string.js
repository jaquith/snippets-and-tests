function negateRegex (re) {
  if (typeof re !== 'object' || typeof re.exec !== 'function' || typeof re.test !== 'function') return
  var matchExpression = /\/(.*)\/(.*)/
  re = re.toString()
  var match = re.match(matchExpression)
  var beforeString = '^(?!(?:'
  var afterString = ')$).*$'
  var regexContents = ''
  var regexFlags = ''
  if (match !== null && match.length === 3) {
      regexContents = match[1]
      regexFlags = match[2]
      return new RegExp(beforeString + regexContents + afterString, regexFlags)
  }
}