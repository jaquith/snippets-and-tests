// expects date values like YYYY-MM-DD and time values like HH:MM
// returns values like HH:MM
function getDurationHours (startDate, startTime, endDate, endTime) {
  if (startDate && startTime && endDate && endTime)  {
    var endDateFull = new Date(endDate + 'T' + endTime + ':00Z')
    var startDateFull = new Date((startDate + 'T' + startTime + ':00Z'))
    // return [startDateFull, endDateFull, endDateFull - startDateFull]
    var diffMinutes = ((endDateFull -  startDateFull) / (1000 * 60))
    var hours = getString(Math.floor(diffMinutes / 60))
    var minutes = getString(diffMinutes % 60)
    return hours + ':' + minutes
  }
  return '0'

  function getString (num) {
    var stringVersion = String(num)
    if (stringVersion.length === 1) {
      stringVersion = '0' + stringVersion
    }
    return stringVersion
  }
}