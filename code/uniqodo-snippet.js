        // (CUSTOM) the UNIQODO library stops on the first undefined values, so we need to fill it in with empty strings
        var max = parseInt(u.data.pMax) || 5 // fall back to a default max of 5 in case of errors in mappings, etc.

        for (var i = 1; i <= max; i++) {
          u.data.p['p' + i] = u.data.p['p' + i] || ""
        }