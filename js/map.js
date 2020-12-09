const key = keys.mapbox;
const DEV_MODE = false;
let myMap, navMap;
let zoom = 12;
let center = {lng: 0, lat: 0};

var markerClick, markerStart, markerEnd;

initMap();

function initMap() {
    initCenter()
        .then((center) => setCenter(center.lng, center.lat))
        .then(addMap)
        .then(addGeocoder)
        .catch((error) => {
            alert("Sorry, there was an error: " + error);
            console.log(error);
        })
}

////////////////////////////////////////////////////////////////////////////////////
// ADD MAP
////////////////////////////////////////////////////////////////////////////////////

function addMap() {
    initMarkers();
    return new Promise((resolve, reject) => {
        mapboxgl.accessToken = key;
        myMap = new mapboxgl.Map({
            container: 'map',
            style: "mapbox://styles/jdeboi/ck7f9ph6i0sr61irv7crq6sno",
            center: getCenterArray(), // starting position
            zoom: zoom
        });
        // myMap.dragRotate.disable();
        // myMap.touchZoomRotate.disableRotation();
        myMap.on('load', () => {
            addLine(myMap, "route", "#ff3700", 8);
            resolve("loaded");
        })

        myMap.on('error', () => {
            reject('error loading map');
        })

        myMap.on('click', function (e) {
            setCenter(e.lngLat.wrap().lng, e.lngLat.wrap().lat);
            setClickMarker();
            setInputCoords();
            
            myMap.flyTo({
                center: getCenterArray(),
                zoom: zoom,
                essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        });
    });
}

function initMarkers() {
    var elClick = document.createElement('div');
    elClick.className = 'markerClick';
    var elStart = document.createElement('div');
    elStart.className = 'markerStart';
    var elEnd = document.createElement('div');
    elEnd.className = 'markerEnd';
    
    markerClick = new mapboxgl.Marker(elClick);
    markerStart = new mapboxgl.Marker(elStart);
    markerEnd = new mapboxgl.Marker(elEnd);
}


function updateMarkers(start, end) {
    markerStart.setLngLat(start);
    markerEnd.setLngLat(end);
    markerStart.addTo(myMap);
    markerEnd.addTo(myMap);
}


function setClickMarker() {
    markerClick.setLngLat(getCenterArray());
    markerClick.addTo(myMap);
}

function setInputCoords() {
    // input bar goes to center coordinates

}

function addGeocoder() {
    // if (isMobile) {
    let geocoder = new MapboxGeocoder({
        accessToken: key,
        // flyTo: {
        //     zoom: zoomMain
        // },
        mapboxgl: mapboxgl
    });
    geocoder.on('result', (result) => {
        setCenter(result.result.center[0], result.result.center[1]);
        myMap.flyTo({
            center: getCenterArray(),
            zoom: zoom,
            essential: true
        })
    })
    document.getElementById('geocoder').appendChild(geocoder.onAdd(myMap));
    document.getElementById('inputBar').style.visibility = "visible";
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
            let center = getNolaCenter();
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
        return { lng: position.coords.longitude, lat: position.coords.latitude };
    }
    catch (error) {
        console.log(error);
        return getNolaCenter();
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