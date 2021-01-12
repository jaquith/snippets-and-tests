/*
  Scope:       Adobe Analytics (Tag Scope)

  Description: Fire u.addEvent for each event listed in b.linkTrackEvents to avoid needing to do that manually in
               a second extension each time.
*/

if (typeof b.linkTrackEvents === 'string') {
    var events = b.linkTrackEvents.split(',')
    for (var i = 0, match; i < events.length; i++) {
        if (typeof events[i] === 'string' && events[i].trim() !== '' && events[i].trim() !== 'None') {
          u.addEvent(events[i].trim());
        }
    }
}
