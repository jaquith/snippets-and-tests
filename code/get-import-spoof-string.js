// get a single-row test import
const getImportSpoofString = function (columns, customerId, customerIdColumnName, obj) {
  let importString = ''

  // generate the header
  let header = ''
  columns.forEach(function (columnName, i, arr) {
    header += `"${columnName}"${i === arr.length - 1 ? '' : ','}`
  })
  header += '\n'
  importString += header

  obj = obj || {}

  // generate the test row
  let row = ''
  columns.forEach(function (columnName, i, arr) {
    let hasValue = typeof obj[columnName] !== 'undefined'
    if (columnName === customerIdColumnName) {
      row += `"${customerId}"${i === arr.length - 1 ? '' : ','}`
    } else if (hasValue) {
      row += `"${obj[columnName]}"${i === arr.length - 1 ? '' : ','}`
    } else {
      row += `${i === arr.length - 1 ? '' : ','}`
    }
  })
  importString += row

  return importString
}