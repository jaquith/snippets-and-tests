function cleanUpDataLayer(flat) {
    var allKeys = Object.keys(flat)
    var isArray = function (key) {
        return typeof flat[key] === 'object' && typeof flat[key].length === 'number' && flat[key].length > 0
    }
    allKeys.forEach(function (key) {
        if (/^user\.profile\.profileInfo\..*/.test(key) && isArray(key)) {
            flat[key] = flat[key][0]
        }
    })
    return flat
}