//https://gps-coordinates.org/distance-between-coordinates.php
function distanceInMetersBetweenCoordinates(longlat0, longlat1) {
  let lat1 = longlat0[1];
  let lon1 = longlat0[0];
  let lat2 = longlat1[1];
  let lon2 = longlat1[0];
  var p = 0.017453292519943295;    // Math.PI / 180
  var a = 0.5 - Math.cos((lat2 - lat1) * p)/2 +
  Math.cos(lat1 * p) * Math.cos(lat2 * p) *
  (1 - Math.cos((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a))*1000; // 2 * R; R = 6371 km
}

// https://stackoverflow.com/questions/639695/how-to-convert-latitude-or-longitude-to-meters
// https://en.wikipedia.org/wiki/Haversine_formula
function metersBetweenCoordinates(longlat0, longlat1){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = longlat1[1] * Math.PI / 180 - longlat0[1] * Math.PI / 180;
  var dLon = longlat1[0] * Math.PI / 180 - longlat0[0] * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(longlat0[1] * Math.PI / 180) * Math.cos(longlat1[1] * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}

//https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
function metersPerDegree(lat) {
  let r_earth = 6378; // km
  return (2*Math.PI/360) * r_earth * Math.cos(lat) * 1000;
}

// returns the degrees of lat and long per meter
function degreesPerMeter(lat) {
  let r_earth = 6378; // km
  let newCoord = [];
  newCoord[0]  = (1 / r_earth) * (180 / Math.PI);
  newCoord[1] =  (1 / r_earth) * (180 / Math.PI) / Math.cos(lat * Math.PI/180);
  return newCoord;
}

function lerpCoords(longlat0, longlat1, per) {
  let newCoord = [];
  if (per > 1) per = 1;
  var dLat = (longlat1[1] - longlat0[1]) * per;
  var dLon = (longlat1[0] - longlat0[0]) * per;
  newCoord[0] = longlat0[0] + dLon;
  newCoord[1] = longlat0[1] + dLat;
  return newCoord;
}

// returns the new coordinate after traveling XY meters
function getNewCoord(longlat, metersX, metersY) {
  let r_earth = 6378; // km
  let newCoord = [];
  newCoord[0] = longlat[0] + (metersX/1000 / r_earth) * (180 / Math.PI) / Math.cos(longlat[1] * Math.PI/180);
  
  // lat <----------->, changes with y
  newCoord[1] = longlat[1] + (metersY/1000 / r_earth) * (180 / Math.PI);
  return newCoord;
}

function deg2rad(degrees)
{
  return degrees * (Math.PI/180);
}

function getCoordFromPoint(start, zoom, x, y) {
    var meters = zoomLevelToDis(zoom, start[1]);
    var metersX = x * meters;
    var metersY = y * meters;
    var c = getNewCoord(start, metersX, metersY)
    return c;
}

function zoomLevelToDis(zoom, lat) {
  lat = Math.abs(lat);
  var z = 0;
  if (lat < 10) z = 0;
  else if (lat < 30) z = 1;
  else if (lat < 50) z = 2;
  else if (lat < 70) z = 3;
  else z = 4;

  var mapz = [
    [78271.484, 73551.136, 59959.436, 39135.742, 13591.701],

    [39135.742, 36775.568,29979.718, 19567.871, 6795.850],

    [19567.871, 18387.784, 14989.859, 9783.936, 3397.925],
    [9783.936, 9193.892, 7494.929, 4891.968, 1698.963],

    [4891.968, 4596.946, 3747.465, 2445.98, 849.481],

    [2445.984, 2298.473, 1873.732, 1222.992, 424.741],

    [1222.992, 1149.237, 936.866, 611.496, 212.370],

    [611.496, 574.618, 468.433, 305.748, 106.185],

    [305.748, 287.309, 234.217, 152.874, 53.093],

    [152.874, 143.655, 117.108, 76.437, 26.546],

    [76.437, 71.827, 58.554, 38.218, 13.273],

    [38.218, 35.914, 29.277, 19.109, 6.637],

    [19.109, 17.957, 14.639,	9.555, 3.318],

    [9.555, 8.978, 7.319, 4.777, 1.659],

    [4.77, 4.489, 3.660, 2.389, 0.830],

    [2.389, 2.245, 1.830, 1.194, 0.415],
    [1.194, 1.122, 0.915, 0.597, 0.207],

    [0.597, 0.561, 0.457, 0.299, 0.104],

    [0.299, 0.281 , 0.229, 0.149, 0.052],

    [0.149, 0.140, 0.114, 0.075, 0.026],

    [0.075, 0.070, 0.057, 0.037, 0.013],

    [0.037, 0.035, 0.029, 0.019, 0.006],

    [0.019, 0.018, 0.014, 0.009, 0.003]
  ];
  return mapz[zoom][z];
}
