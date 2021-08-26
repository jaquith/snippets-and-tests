/* global describe, it */
'use strict'

const chai = require('chai')
const stringFunctions = require('../helpers/stringFunctions.js')
const code = stringFunctions.getVanillaJsFile('code/functions-add-tallies-as-arrays.js')

let exported


let exampleVisitorProfile = {
  "transactionId": "583531ec-0b67-4309-8a9d-e673aa0f6346",
  "live": false,
  "visitor": {
    "metrics": {
      "Total direct visits": 1,
      "Lifetime visit count": 1,
      "Lifetime event count": 9,
      "Total time spent on site in minutes": 0,
      "Average visit duration in minutes": 0,
      "Weeks since first visit": 1,
      "Average visits per week": 1,
      "Flip Flop": 1
    },
    "dates": {
      "last_visit_start_ts": 1629477648000,
      "audience_hse_hbbtv_101_count_ts": 1629477648940,
      "audience_hse_hbbtv_103_count_ts": 1629477654509,
      "audience_hse_hbbtv_102_count_ts": 1629477741394,
      "First visit": 1629477648000,
      "Last visit": 1629477648000
    },
    "properties": {
      "profile": "hbbtv",
      "account": "hse",
      "Lifetime devices used (favorite)": "other",
      "Lifetime browser types used (favorite)": "other",
      "Lifetime operating systems used (favorite)": "other",
      "Lifetime platforms used (favorite)": "browser",
      "Lifetime browser versions used (favorite)": "other",
      "Channels Watched - Lifetime (favorite)": "hse24extra",
      "Titles Watched - Lifetime (favorite)": "Maloo Fashion Pieces",
      "Channels Watched - Last 30 days (favorite)": "hse24",
      "Titles Watched - Last 30 days (favorite)": "La Luna Design in Silber",
      "Last Querying Profile": "sandbox",
      "Last Querying Visitor ID": "cookie_test38826961203350630_spoof",
      "Last-Seen Visitor ID": "test95602537859266110_c1",
      "Last Querying Trace ID": "bArJsPPA"
    },
    "sequences": {
      "Last 30 days": [
        {
          "timestamp": 1629244800000,
          "snapshot": {
            "Titles Watched - This Event": {
              "Maloo Fashion Pieces": 1
            },
            "Channels Watched - This Event": {
              "hse24extra": 1
            },
            "imported_DATETIME_formatted": 1629244800000,
            "imported_DATETIME": "2021-08-18 00:00:00"
          }
        },
        {
          "timestamp": 1629244800000,
          "snapshot": {
            "Titles Watched - This Event": {
              "L．Credi Munich Taschen & Accessoires": 1
            },
            "Channels Watched - This Event": {
              "hse24trend": 1
            },
            "imported_DATETIME_formatted": 1629244800000,
            "imported_DATETIME": "2021-08-18 00:00:00"
          }
        },
        {
          "timestamp": 1628985600000,
          "snapshot": {
            "Titles Watched - This Event": {
              "La Luna Design in Silber": 1
            },
            "Channels Watched - This Event": {
              "hse24": 1
            },
            "imported_DATETIME_formatted": 1628985600000,
            "imported_DATETIME": "2021-08-15 00:00:00"
          }
        },
        {
          "timestamp": 1628553600000,
          "snapshot": {
            "Titles Watched - This Event": {
              "La Luna Design in Silber": 1
            },
            "Channels Watched - This Event": {
              "hse24": 1
            },
            "imported_DATETIME_formatted": 1628553600000,
            "imported_DATETIME": "2021-08-10 00:00:00"
          }
        },
        {
          "timestamp": 1626998400000,
          "snapshot": {
            "Titles Watched - This Event": {
              "La Luna Design in Silber": 1
            },
            "Channels Watched - This Event": {
              "hse24": 1
            },
            "imported_DATETIME_formatted": 1626998400000,
            "imported_DATETIME": "2021-07-23 00:00:00"
          }
        }
      ]
    },
    "audiences": [
      "Sandbox query request - flip",
      "All IP Addresses (Visitor Profiles)"
    ],
    "badges": [
      "Unbadged"
    ],
    "metric_sets": {
      "Lifetime devices used": {
        "other": 1
      },
      "Lifetime browser types used": {
        "other": 1
      },
      "Lifetime operating systems used": {
        "other": 1
      },
      "Lifetime platforms used": {
        "browser": 1
      },
      "Lifetime browser versions used": {
        "other": 1
      },
      "Channels Watched - Lifetime": {
        "hse24extra": 4,
        "hse24trend": 1,
        "hse24": 3
      },
      "Titles Watched - Lifetime": {
        "Maloo Fashion Pieces": 4,
        "L.Credi Munich Taschen & Accessoires": 1,
        "La Luna Design in Silber": 3
      },
      "Channels Watched - Last 30 days": {
        "hse24extra": 1,
        "hse24": 3,
        "hse24trend": 1
      },
      "Titles Watched - Last 30 days": {
        "La Luna Design in Silber": 3,
        "L.Credi Munich Taschen & Accessoires": 1,
        "Maloo Fashion Pieces": 1
      }
    },
    "last_visit_id": "db29fdb12286a42f73490515ed00e3f9d0217af426c7a1f4acd503c84ad63ad6"
  }
}

let exampleVisitorProfileNoTallies = {
  "transactionId": "583531ec-0b67-4309-8a9d-e673aa0f6346",
  "live": false,
  "visitor": {
    "metrics": {
      "Total direct visits": 1,
      "Lifetime visit count": 1,
      "Lifetime event count": 9,
      "Total time spent on site in minutes": 0,
      "Average visit duration in minutes": 0,
      "Weeks since first visit": 1,
      "Average visits per week": 1,
      "Flip Flop": 1
    },
    "dates": {
      "last_visit_start_ts": 1629477648000,
      "audience_hse_hbbtv_101_count_ts": 1629477648940,
      "audience_hse_hbbtv_103_count_ts": 1629477654509,
      "audience_hse_hbbtv_102_count_ts": 1629477741394,
      "First visit": 1629477648000,
      "Last visit": 1629477648000
    },
    "properties": {
      "profile": "hbbtv",
      "account": "hse",
      "Lifetime devices used (favorite)": "other",
      "Lifetime browser types used (favorite)": "other",
      "Lifetime operating systems used (favorite)": "other",
      "Lifetime platforms used (favorite)": "browser",
      "Lifetime browser versions used (favorite)": "other",
      "Channels Watched - Lifetime (favorite)": "hse24extra",
      "Titles Watched - Lifetime (favorite)": "Maloo Fashion Pieces",
      "Channels Watched - Last 30 days (favorite)": "hse24",
      "Titles Watched - Last 30 days (favorite)": "La Luna Design in Silber",
      "Last Querying Profile": "sandbox",
      "Last Querying Visitor ID": "cookie_test38826961203350630_spoof",
      "Last-Seen Visitor ID": "test95602537859266110_c1",
      "Last Querying Trace ID": "bArJsPPA"
    },
    "audiences": [
      "Sandbox query request - flip",
      "All IP Addresses (Visitor Profiles)"
    ],
    "badges": [
      "Unbadged"
    ],
    "last_visit_id": "db29fdb12286a42f73490515ed00e3f9d0217af426c7a1f4acd503c84ad63ad6"
  }
}

describe('the addTallies function, testing for use in Tealium Functions', function () {
  it('should export without error', function () {
    exported = stringFunctions.exportNamedElements(code, ['addTalliesToEventPayload'])
  })

  it('should work correctly with tallies', function () {
    let result = exported.addTalliesToEventPayload({'test_existing_key' : true}, exampleVisitorProfile.visitor)
    chai.expect(result).to.deep.equal({
      test_existing_key: true,
      tally_channels_watched_lifetime_keys: [
        "hse24extra",
        "hse24trend",
        "hse24"
      ],
      tally_channels_watched_lifetime_values: [
        4,
        1,
        3
      ],
      tally_titles_watched_lifetime_keys: [
        "Maloo Fashion Pieces",
        "L.Credi Munich Taschen & Accessoires",
        "La Luna Design in Silber",
      ],
      tally_titles_watched_lifetime_values: [
        4,
        1,
        3
      ],
      tally_channels_watched_last_30_days_keys: [
        "hse24extra",
        "hse24",
        "hse24trend"
      ],
      tally_channels_watched_last_30_days_values: [
        1,
        3,
        1
      ],
      tally_titles_watched_last_30_days_keys: [
        "La Luna Design in Silber",
        "L.Credi Munich Taschen & Accessoires",
        "Maloo Fashion Pieces",
      ],
      tally_titles_watched_last_30_days_values: [
        3,
        1,
        1
      ],
    })
  })

  it('should work correctly without tallies', function () {
    let result = exported.addTalliesToEventPayload({'test_existing_key' : true}, exampleVisitorProfileNoTallies.visitor)
    chai.expect(result).to.deep.equal({
      test_existing_key: true
    })
  })

})
