/**
 * B"H
 */

//B"H
function csvToJson(csv) {
    var json = {}
    csv
    .split("\n")
    .filter(w=>w)
    .forEach(w=> {
        var spl = w.split(",")
        json[spl[1]] = spl[0]
        console.log(w, spl)
    })
    return json
}

