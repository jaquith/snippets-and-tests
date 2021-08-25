    // Augment an object with tallies as parallel arrays of numbers/strings, to send via Collect
    const addTalliesToEventPayload = function (eventPayload, visitor) {
      eventPayload = eventPayload || {}
      let tallies = Object.keys(visitor.metric_sets)

      let excludeList = [      
          "Lifetime devices used",
          "Lifetime browser types used",
          "Lifetime operating systems used",
          "Lifetime platforms used",
          "Lifetime browser versions used"
      ]
      
      /**
       * Removes disallowed characters and whitespace (according to CDH/TiQ logic) 
       * to turn them into acceptable event attributes.
       * 
       * Turns "Channels Watched - Last 30 days" into "channels_watched_last_30_days
       * 
       * @param {*} tallyName 
       * @returns the tallyName, but cleaned and normalized
       */
      function getCleanName (tallyName) {
          // replace any hyphens with whitespace
          let cleanTallyName = tallyName.replace(/-/g, ' ')
          // replace any expanses of whitespace with a single underscore
          cleanTallyName = cleanTallyName.toLowerCase().replace(/\s+/g, '_') 
          // remove everything except the english alphabet, numbers, underscores, dollar signs, periods and square brackets
          const blacklistRegex = /[^0-9A-Z_$\[\]\.]/gi
          cleanTallyName = cleanTallyName.replace(blacklistRegex, '')
          return cleanTallyName
      }

      // go through the tallies and convert them to event attributes for the Collect request reply
      tallies.forEach(tallyName => {
          // skip explicitly excluded tallies
          if (excludeList.indexOf(tallyName) !== -1) return 

          let tally = visitor.metric_sets[tallyName]
          let keys = Object.keys(tally)
          let values = Object.values(tally)

          // replace spaces and hyphens with underscores
          let cleanTallyName = getCleanName(tallyName)

          eventPayload[`tally_${cleanTallyName}_keys`] = keys
          eventPayload[`tally_${cleanTallyName}_values`] = values
      })

      return eventPayload
  }