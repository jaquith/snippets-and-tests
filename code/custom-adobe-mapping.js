// fire tag-scoped to allow '*any*' as a value map for event triggers (which usually require an exact match)
for (var mapped in u.map) {
  if (!u.map.hasOwnProperty(mapped)) continue;
  var parts = mapped.split(':')
  if (parts.length !== 2) continue;
  var attr = parts[0]
  var triggerValue = parts[1]
  if (triggerValue !== "*any*" || typeof b[attr] === "undefined" || b[attr] === "") continue;
  var newKey = attr + ':' + b[attr]
  var newValue = u.map[mapped] + ',VALUE_' + u.map[mapped]
  u.map[newKey] = newValue
  delete u.map[mapped]
}