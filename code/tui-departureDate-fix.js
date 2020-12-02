b["departureDate YYYYMMDD"] = (function() {
  try {
    var returnVal = 'none';
    // function for returning Departure Date, used in Adobe Departure Date (evar14). Copied from Tag "WA - SiteCat Page Code" on 28/09/17
    if (typeof b.departureDate === 'string') {
      var splitDate = b.departureDate.split('/')
      var year = splitDate[2] && splitDate[2].length === 4 && splitDate[2]
      var month = splitDate[1] && splitDate[1].length === 2 && splitDate[1]
      var day = splitDate[0] && splitDate[0].length === 2 && splitDate[0]
      if (year && month && day) {
        return year + month + day
      }
      // sometimes the day isn't selected (like cruises)
      if (year && month) {
        return year + month
      }
    }
    return returnVal
  } catch (err) {
    return returnVal;
  }
})()