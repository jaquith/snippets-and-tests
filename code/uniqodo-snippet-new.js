        // (CUSTOM) the UNIQODO library stops on the first undefined values, so we need to fill it in with empty strings
        var max = (function findMaxCustomIndex () {
          var highestSeen = 0
          var keys = Object.keys(u.data.p || {})
          for (var i = 0, key, match; i < keys.length; i++) {
            key = keys[i]
            match = key.match(/^p([0-9]+)$/)
            if (match && match[1]) {
              if (parseInt(match[1]) > highestSeen) {
                highestSeen = parseInt(match[1])
              }
            }
          }
          return highestSeen
        }())
        for (var i = 1; i <= max; i++) {
          u.data.p['p' + i] = u.data.p['p' + i] || ""
        }