
// https://www.mapbox.com/studio/account/tokens/
const key = keys.mapbox;
const DEV_MODE = false;
let myMap, navMap;
const zoomMain = 14;
const zoomMini = 11.7;
let isDrawing = false;
var center;

let startAddress, endAddress, distance, duration, instructions;
// Create an instance of MapboxGL
// const mappa = new Mappa('MapboxGL', key);
// const mappaMini = new Mappa('MapboxGL', key);

// let canvas;

var markerStart, markerEnd;

initMaps();

if (DEV_MODE) {
    showMaps();
}

function initMaps() {
    initCenter()
        .then(addMaps)
        .then(addGeocoder)
        .then(() => {
            isDrawing = true;
            if (clickedSketch) {
                showMaps();
            }
        })
        .catch((error) => {
            alert("Sorry, there was an error: " + error);
            console.log(error);
        })
}

function getCenter() {
    return center;
}

function getCenterArray() {
    return [center.lng, center.lat];
}

function setCenter(lng, lat) {
    center.lng = lng;
    center.lat = lat;
}

function addMaps(c) {
    var elStart = document.createElement('div');
    elStart.className = 'markerStart';
    var elEnd = document.createElement('div');
    elEnd.className = 'markerEnd';
    markerStart = new mapboxgl.Marker(elStart);
    markerEnd = new mapboxgl.Marker(elEnd);
    return Promise.all([addMainMap(c), addNavMap(c)]);
}

function addMainMap(center) {
    return new Promise((resolve, reject) => {
        mapboxgl.accessToken = key;
        myMap = new mapboxgl.Map({
            container: 'map',
            style: "mapbox://styles/jdeboi/ck7f9ph6i0sr61irv7crq6sno",
            center: center, // starting position
            zoom: zoomMain
        });
        myMap.dragRotate.disable();
        myMap.touchZoomRotate.disableRotation();
        myMap.on('load', () => {
            addLine(myMap, "route", "#fff", 8);
            resolve("loaded");
        })


    });
}


function addNavMap(center) {
    return new Promise((resolve, reject) => {

        mapboxgl.accessToken = key;
        navMap = new mapboxgl.Map({
            container: 'navMap',
            style: 'mapbox://styles/jdeboi/ck6ygg96d16gg1im66n6i13ob',
            center: [center.lng, center.lat],
            zoom: zoomMini
        });



        // disable map rotation using right click + drag
        navMap.dragRotate.disable();
        navMap.touchZoomRotate.disableRotation();

        navMap.on('click', function (e) {
            isDrawing = false;
            if (DEV_MODE) console.log("moving map");
            setCenter(e.lngLat.wrap().lng, e.lngLat.wrap().lat);
            console.log("ONE", e.lngLat.wrap().lng, e.lngLat.wrap().lat);
            console.log("TWO", getCenterArray())
            console.log("SHYYY", center)
            navMap.flyTo({
                center: getCenterArray(),
                zoom: zoomMini,
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });

            myMap.flyTo({
                center: getCenterArray(),
                zoom: zoomMain,
                essential: true
            });

            myMap.once('moveend', () => {
                if (DEV_MODE) console.log("done moving big map");
                isDrawing = true;
            })
        });

        navMap.on('load', () => {
            addLine(navMap, "route", "#fff", 4);
            resolve("loaded");
        });
    });

}

function addGeocoder() {
    // if (isMobile) {
    let geocoder = new MapboxGeocoder({
        accessToken: key,
        flyTo: {
            zoom: zoomMain
        },
        mapboxgl: mapboxgl
    });
    geocoder.on('result', (result) => {
        setCenter(result.result.center[0], result.result.center[1]);
        myMap.flyTo({
            center: getCenterArray(),
            zoom: zoomMain,
            essential: true
        })
    })
    document.getElementById('geocoder').appendChild(geocoder.onAdd(myMap));
    // } else {
    //     let geocoder = new MapboxGeocoder({
    //         accessToken: key,
    //         flyTo: {
    //             zoom: zoomMini
    //         },
    //         mapboxgl: mapboxgl
    //     });
    //     geocoder.on('result', (result) => {
    //         // console.log("RESULT", result.result.center);
    //         setCenter(result.result.center[0], result.result.center[1]);
    //         myMap.flyTo({
    //             center: getCenterArray(),
    //             zoom: zoomMain,
    //             essential: true
    //         })
    //     })
    //     navMap.addControl(geocoder);
    // }
}


////////////////////////////////////////////////////////////////////////////////////
// LOAD MAP CENTER
////////////////////////////////////////////////////////////////////////////////////

// try to get browser gps
// otherwise, return NOLA coords
async function initCenter() {
    // Will resolve after 5s
    let t = DEV_MODE ? 100 : 5000;
    let promiseTimeout = new Promise((resolve, reject) => {
        let wait = setTimeout(() => {
            clearTimeout(wait);
            center = getNolaCenter();
            resolve(center);
        }, t)
    })
    return Promise.race([
        promiseTimeout,
        setBrowserCenter()
    ]);
}

async function setBrowserCenter() {
    try {
        let position = await getPosition();
        if (DEV_MODE) console.log("POS", position);
        center = { lng: position.coords.longitude, lat: position.coords.latitude };
        return center;
    }
    catch (error) {
        console.log(error);
        center = getNolaCenter();
        return center;
    }
}

function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

function getNolaCenter() {
    let homeLat = 29.9307079;
    let homeLon = -90.105797;
    return { lng: homeLon, lat: homeLat };
}

///
// path to coords


function setCoordinates(path) {
    var coords = [];
    let start = getCenterArray();
    var p0 = path.segments[0];
    let d0x = p0._point._x - window.innerWidth / 2;
    let d0y = window.innerHeight / 2 - p0._point._y;
    for (var i = 0; i < path.segments.length; i++) {
        var p = path.segments[i];
        var dx = p._point._x - path.segments[0]._point._x;
        var dy = -(p._point._y - path.segments[0]._point._y);
        var point = getCoordFromPoint(start, zoomMain, dx + d0x, dy + d0y);
        coords.push(point);
    }

    var numPoints = path.segments.length;
    if (numPoints > 24 * 5) numPoints = 24 * 5;

    var promises = [];
    for (var i = 0; i < numPoints; i += 24) {
        var points = coords.slice(i, i + 24);
        promises.push(loadDirections(points))
    }
    // console.log(promises);
    Promise.all(promises)
        .then(function (responses) {
            // console.log(JSON.parse(responses[0].responseText).routes[0].geometry.coordinates)
            var coordinates = [];
            instructions = [];
            console.log("REZ", JSON.parse(responses[0].responseText))

            ////////////////// start & end addresses
            // startAddress = JSON.parse(responses[0].responseText).routes[0].legs[0].steps[0].name;
            // if (startAddress == "") startAddress = JSON.parse(responses[0].responseText).routes[0].legs[0].steps[0].geometry[0].coordinates;
            // document.getElementById("startAddress").innerText = "start: " + startAddress;
            // let legL = JSON.parse(responses[responses.length - 1].responseText).routes[0].legs.length;
            // let lastLeg = JSON.parse(responses[responses.length - 1].responseText).routes[0].legs[legL - 1];
            // endAddress = lastLeg.steps[lastLeg.steps.length - 1].name;
            // if (endAddress == "") endAddress = lastLeg.steps[lastLeg.steps.length - 1].geometry[0].coordinates;
            // document.getElementById("endAddress").innerText = "end: " + endAddress;

            distance = 0;
            duration = 0;

            console.log("num api calls", responses.length)
            for (var j = 0; j < responses.length; j++) {
                var directions = JSON.parse(responses[j].responseText);
                var route = directions.routes[0];

                distance += route.distance * 0.000621371;
                duration += route.duration;

                coordinates = coordinates.concat(route.geometry.coordinates);
                setInstructions(route)
            }
            // document.getElementById("instructions").html(directions)
            distance = Math.floor(distance * 10) / 10;
            document.getElementById("duration").innerText = getDuration(duration, 2);
            document.getElementById("distance").innerText = ` (${distance} miles)`;

            updateLine(myMap, "route", coordinates);
            updateLine(navMap, "route", coordinates);
            addMarkers(coordinates[0], coordinates[coordinates.length - 1]);
            document.getElementById("directionsButton").style.display = "block";
            document.getElementById("directionsButtonContainerMobile").style.display = "block";
            // console.log("ok", duration, startAddress, endAddress)
        })
}



function setInstructions(route) {
    if (true) {
        // directions = JSON.parse(response.responseText).routes[0].geometry.coordinates;
        // console.log("parsing dir", JSON.parse(response.responseText));

        let legs = route.legs;

        // console.log("legs", legs)
        for (var i = 0; i < legs.length; i++) {
            let steps = legs[i].steps;
            // console.log("steps", steps);
            for (var j = 0; j < steps.length; j++) {
                //   let coords = legs[i].steps[j].geometry.coordinates;
                let ins = steps[j].maneuver;
                // if (ins.indexOf("You have arrived") < 0)
                instructions.push({ ins: ins, dis: steps[j].distance, dur: steps[j].duration, step: j });
                //   for (var k = 0; k < coords.length; k++) {
                //     directions.push({coord: coords[k], step: j, leg:i});
                //   }
            }
            // var s = steps[i].geometry.coordinates;
            // coordinates.push(s[0]);//s.length-1])

        }
    }
    // instructions.push({ins: {instruction: "You have arrived."}});
    // return directions;
    console.log(instructions[0]);
    htmlInstructions();
}

function addMarkers(start, end) {
    markerStart.setLngLat(start);
    markerEnd.setLngLat(end);

    console.log("START", start, end)

    // Ensure it's added to the map. This is safe to call if it's already added.
    markerStart.addTo(myMap);
    markerEnd.addTo(myMap);
}

function htmlInstructions() {
    var instructionsDiv;
    if (window.innerWidth < 500 || isMobile)
        instructionsDiv = document.getElementById("instructionsModal");
    else
        instructionsDiv = document.getElementById("instructions");
    instructionsDiv.innerHTML = "";
    console.log("ins nums", instructions.length)
    for (const instruction of instructions) {
        const newDiv = document.createElement("div");
        if (instruction.ins.type !== "arrive") {
            const newSpan0 = document.createElement("span");
            newSpan0.className = "deets";
            const newSpan1 = document.createElement("span");
            let dis = Math.floor(instruction.dis * 0.000621371 * 100) / 100 + " miles";
            let dur = getDuration(instruction.dur, 2);
            let txt = `${dis} (${dur}): `; //
            newSpan0.textContent = txt;
            newSpan1.textContent = instruction.ins.instruction;
            newDiv.appendChild(newSpan0);
            newDiv.appendChild(newSpan1);
            instructionsDiv.appendChild(newDiv);
        }

    }
    const newDiv = document.createElement("div");
    newDiv.textContent = "You have arrived!";
    instructionsDiv.appendChild(newDiv);
}


function getDuration(seconds, dec) {
    let mins = +seconds / 60;
    let hours = mins / 60;
    let days = hours / 24;
    //println(days, hours, mins);
    if (seconds < 60) {
        seconds = Math.floor(seconds);
        return seconds + "s";
    }
    if (mins < 60) {
        mins = Math.floor(mins);
        return mins + " min";
    }
    if (days < 1) {
        let m = mins % 60;
        let h = Math.floor(hours);
        return h + " hours " + Math.floor(m) + " min"
    }
    return days.toFixed(dec) + " days";
}


///////////////////////////////////////////////////////////////////
// directions

// XHR requests
// https://gomakethings.com/promise-based-xhr/
function makeRequest(url, method) {

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

function loadDirections(coords) {
    let coordString = getCoordString(coords);
    let mode = 'walking';
    let url = 'https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coordString;
    url += '?steps=true';
    url += '&geometries=geojson';
    url += '&continue_straight=true';
    url += '&access_token=' + mapboxgl.accessToken;
    return makeRequest(url)
}

function getCoordString(coords) {
    let coordString = "";
    for (var c = 0; c < coords.length; c++) {
        coordString += coords[c][0] + "," + coords[c][1];
        if (c != coords.length - 1) {
            coordString += ";"
        }
    }
    return coordString;
}

function addLine(map, id, color, sw) {
    map.addLayer({
        "id": id,
        "type": "line",
        "source": {
            "type": "geojson",
            "lineMetrics": true,
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
            "line-width": sw,
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                'blue',
                0.1,
                'royalblue',
                0.3,
                'cyan',
                0.5,
                'lime',
                0.7,
                'yellow',
                1,
                'red'
            ]
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

