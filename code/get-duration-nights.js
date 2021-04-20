// expects values like YYYY-MM-DD
// returns the number of nights between the dates as a string, or '0'
function getDurationNights (departureDate, returnDate) {
  if (departureDate && returnDate)  {
    return String(parseInt((new Date(returnDate) -  new Date(departureDate)) / (1000 * 60 * 60 * 24), 10))
  }
  return '0'
}