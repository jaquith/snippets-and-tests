'use strict'

const fse = require('fs-extra')
const _eval = require('eval')
const path = require('path')

const getVanillaJsFile = function (relativePathToRepoRoot) {
  return fse.readFileSync(path.join(__dirname, '../../', relativePathToRepoRoot), 'utf-8')
}

const runStringFunctions = (jsString, exportsArray, beforeExpression, afterExpression) => {
  beforeExpression = beforeExpression || ''
  afterExpression = afterExpression || ''
  if (typeof exportsArray === 'string') {
    exportsArray = [exportsArray]
  }
  exportsArray = exportsArray || []
  exportsArray.forEach((element) => {
    afterExpression = '\n\nexports.' + element + ' = ' + element + '\n\n' + afterExpression
  })
  const evalString = `${beforeExpression}${jsString}${afterExpression}`
  return _eval(evalString)
}

exports.runStringFunctions = runStringFunctions
exports.getVanillaJsFile = getVanillaJsFile
