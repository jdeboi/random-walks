
function makeRequest(url, method) {
    // XHR requests
    // https://gomakethings.com/promise-based-xhr/

    // Create the XHR request
    var request = new XMLHttpRequest();

    // Return it as a Promise
    return new Promise(function (resolve, reject) {

        // Setup our listener to process compeleted requests
        request.onreadystatechange = function () {

            // Only run if the request is complete
            if (request.readyState !== 4) return;

            // Process the response
            if (request.status >= 200 && request.status < 300) {
                // If successful
                resolve(request);
            } else {
                // If failed
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            }

        };
        // Setup our HTTP request
        request.open(method || 'GET', url, true);

        // Send the request
        request.send();

    });
};


function loadDirections(steps) {
    let coordString = getCoordString(steps);
    let mode = 'walking';
    let url = 'https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coordString;
    url += '?steps=true';
    url += '&geometries=geojson';
    url += '&continue_straight=true';
    url += '&access_token=' + keys.mapbox;
    return makeRequest(url);
}


function getCoordString(coords) {
    let coordString = "";
    for (let i = 0; i < coords.length - 1; i++) {
        coordString += coords[i][0] + "," + coords[i][1] + ";"
    }
    let e = coords.length - 1;
    coordString += coords[e][0] + "," + coords[e][1]
    return coordString;
}



function addLine(map, id, color, sw) {
    map.addLayer({
        "id": id,
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": sw
        }
    });
}

function updateLine(map, id, coords) {
    if (DEV_MODE) console.log("coords", coords[0], coords[1])
    var geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: coords
        }
    };
    map.getSource(id).setData(geojson);
}
