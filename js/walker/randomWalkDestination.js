// change remotes
// git remote rm heroku
// heroku git:remote -a newname

var w = 1100;
var h = 850;
var centerDisX = .001;

var DIRECTIONS_ON = true;
var SAVING_ON = false;
var PRINTING_ON = false;
var BREAKING_UP = false;
var DELETE_ON = false;

var docsURL = "https://random-walk-map.herokuapp.com/";

let cnv;
let locked = false;
let _id = "";
let startIcon;

let walker;
let buffer;
let miles = 1;
var allCoordinates = [];
var allSteps = [];
var instructions = [];
var bounding = [];
var center = [];
var numInstruction = 0;
// right, top, left, bottom
var mapBumper = [20, 20, 20, 20];
let startAddress, endAddress;
let distance, duration;

let numWalks = 2;
let stepsPerWalk = 20;
let font, impactFont;

let globalR;

var hues = [20, 50, 130]

var fakeCoordinates = [[-90.10376,29.930731],[-90.103821,29.931313],[-90.10392,29.932281],[-90.10392,29.932281],[-90.103485,29.932316],[-90.103485,29.932316],[-90.103485,29.932316],[-90.103485,29.932316],[-90.102768,29.932371],[-90.102768,29.932371],[-90.102554,29.932388],[-90.102654,29.93334],[-90.102722,29.934034],[-90.102722,29.934034],[-90.102722,29.934034],[-90.102722,29.934034],[-90.102753,29.934313],[-90.102753,29.934313],[-90.101593,29.934401],[-90.100494,29.934483],[-90.100494,29.934483],[-90.100533,29.934898],[-90.100533,29.934898],[-90.100533,29.934898],[-90.100533,29.934898],[-90.100586,29.935438],[-90.100685,29.936399],[-90.100685,29.936399],[-90.099937,29.936459],[-90.099937,29.936459],[-90.099937,29.936459],[-90.099937,29.936459],[-90.099556,29.936489],[-90.099556,29.936489],[-90.099648,29.937447],[-90.099739,29.9384],[-90.099739,29.9384],[-90.10041,29.938353],[-90.10041,29.938353],[-90.10041,29.938353],[-90.10041,29.938353],[-90.100876,29.938318],[-90.101982,29.938227],[-90.101982,29.938227],[-90.102074,29.939194],[-90.102127,29.939659],[-90.102127,29.939659],[-90.102127,29.939659],[-90.102127,29.939659],[-90.10218,29.940182],[-90.102219,29.940502],[-90.102318,29.941427],[-90.102318,29.941427],[-90.101738,29.941473],[-90.101738,29.941473],[-90.101738,29.941473],[-90.101738,29.941473],[-90.101212,29.941513],[-90.101212,29.941513],[-90.101311,29.942404],[-90.101402,29.943295],[-90.101402,29.943295],[-90.101654,29.943275],[-90.101654,29.943275],[-90.101654,29.943275]];

var fakeInstructions = ["Head north on Jena Street","Turn right onto Loyola Avenue","Head east on Loyola Avenue","Turn left onto Napoleon Avenue","Head north on Napoleon Avenue","Turn right onto La Salle Street","Turn left onto Milan Street","Head north on Milan Street","Turn right onto South Robertson Street","Head east on South Robertson Street","Turn left onto Marengo Street","Turn left onto Clara Street","Head west on Clara Street","Turn right onto General Pershing Street","Head north on General Pershing Street","Turn right onto South Derbigny Street","Head east on South Derbigny Street","Turn left onto Milan Street","Turn left onto South Prieur Street"];

var fakePoints = [{"x":316,"y":320},{"x":314,"y":304},{"x":314,"y":304},{"x":312,"y":278},{"x":312,"y":278},{"x":312,"y":278},{"x":312,"y":278},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":292,"y":280},{"x":286,"y":280},{"x":286,"y":280},{"x":286,"y":280},{"x":286,"y":280},{"x":283,"y":255},{"x":283,"y":255},{"x":281,"y":229},{"x":281,"y":229},{"x":281,"y":229},{"x":281,"y":229},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":287,"y":228},{"x":307,"y":227},{"x":307,"y":227},{"x":307,"y":227},{"x":307,"y":227},{"x":305,"y":201},{"x":305,"y":201},{"x":305,"y":201},{"x":305,"y":201},{"x":279,"y":203},{"x":279,"y":203},{"x":279,"y":203},{"x":279,"y":203},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":278,"y":184},{"x":277,"y":177},{"x":277,"y":177},{"x":275,"y":151},{"x":275,"y":151},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":274,"y":136},{"x":273,"y":126},{"x":273,"y":126},{"x":270,"y":100},{"x":270,"y":100},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":269,"y":88},{"x":268,"y":73},{"x":268,"y":73},{"x":268,"y":73},{"x":268,"y":73},{"x":267,"y":67},{"x":267,"y":67},{"x":273,"y":65},{"x":273,"y":65},{"x":279,"y":64},{"x":279,"y":64},{"x":285,"y":63},{"x":285,"y":63},{"x":293,"y":62},{"x":293,"y":62},{"x":293,"y":62},{"x":293,"y":62},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":44},{"x":291,"y":37},{"x":291,"y":37},{"x":289,"y":13},{"x":289,"y":13},{"x":289,"y":13},{"x":289,"y":13},{"x":315,"y":11},{"x":315,"y":11},{"x":321,"y":11},{"x":321,"y":11},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":334,"y":9},{"x":347,"y":8},{"x":347,"y":8},{"x":347,"y":8},{"x":347,"y":8},{"x":345,"y":-16},{"x":345,"y":-16},{"x":344,"y":-27},{"x":344,"y":-27},{"x":344,"y":-27},{"x":344,"y":-27},{"x":344,"y":-27}]

//////////////////////////////
// mapbox
var key = keys.mapbox;
var img;
var twirl;
var compass;
var mappa = new Mappa('Mapbox', key);

var options = {
  lat: 0,
  lng: 0,
  // right, top, left, bottom
  width: w - mapBumper[0]- mapBumper[2],
  height: h - mapBumper[1]- mapBumper[3],
  scale: 1,
  pitch: 0,
  logo: false,
  zoom: 14,
  username: 'jdeboi', // don't include for mapbox styles
  style: 'ck6ygg96d16gg1im66n6i13ob'
}
var myMap;
var iconNames = [];
var icons = [];
var iconsLoaded = false;

//////////////////////////////

function preload() {
  font = loadFont("../fonts/Product Sans Regular.ttf");
  impactFont = loadFont("../fonts/Impact Label.ttf");
}

function setup() {

  cnv = createCanvas(w, h);
  buffer = createGraphics(options.width, options.height);
  if (DELETE_ON) setInterval(getDocs, 3000);
  else getDocs();

  walker = new Walker();

  endIcon = loadImage("/images/markers/map-pin-white.svg");
  compass = loadImage("/images/compass2.png");
  twirl = loadImage("/images/maze3.jpg");
  if (!DIRECTIONS_ON) startAddress = "2019 Jena Street, New Orleans, LA";
  initMap([fakeCoordinates[0][0], fakeCoordinates[0][1]], 1)

  // loadJSONPromise("/iconNames").then(docs => {
  //   iconNames = docs.files;
  // })
  // .then(loadIcons)
  // .then(() => {
  //   iconsLoaded = true;
  // })
  // .catch(error => {
  //   console.log(error);
  // })

  loadImagePromise("images/icons/embassy.svg").then((img) => {
    // console.log(path)
    icons.push(img);
  });

  noLoop();

  globalR = random(PI*2);
}

function draw() {
  clear();
  // blendMode(BLEND);
  noFill();
  stroke(0);
  strokeWeight(3);
  // rect(0, 0, width, height);
  // blendMode(LIGHTEST);
  fill(0);
  noStroke();
  textFont(font, 26);


  // let title = "RANDOM WALK MAP";
  // text(title, width/2-textWidth(title)/2, 40);

  translate(mapBumper[0], mapBumper[1]);


  if (!DIRECTIONS_ON) {
    if (img) image(img, 0, 0);
    blendMode(BLEND);
    drawMap(fakeCoordinates);
  }
  image(buffer, 0, 0);
  // filter(INVERT);
}

function getDocs() {
  if (!locked) {
    numInstruction = 1;
    locked = true;
    loadJSONPromise(docsURL+"alldestinations")
    .then((docs) => getStartEnd(docs)) //1
    .then((points) => loadAllPaths(points))
    // .then((start) => loadMultipleMapboxCalls(start))
    // .then(limitPath)
    .then(setCenter)
    .then((center) => initMap(center))
    .then(drawMap) //5
    .then(saveMap)
    .then(printMap)//5
    .then(deleteDoc)//6
    .then(reset)//7
    .then(finish)//8
    .catch((error) => {
      console.log(error);
      locked = false;
    });
  }
  else console.log("---LOCKED----")
}

function loadIcons() {
  let promises = [];
  for (var i = 0; i < iconNames.length/2; i+=5) {
    let path = "/images/icons/" + iconNames[i];
    let prom = loadImagePromise(path).then((img) => {
      // console.log(path)
      icons.push(img);
    });
    promises.push(prom);
  }
  return Promise.all(promises);
}



function loadAllPaths(points) {
  let start = points.start;
  let end = points.end;
  // console.log("STARTEND", start, end);
  if (DIRECTIONS_ON) {
    let paths = [];
    for (var i = 0; i < numWalks; i++) {
      paths.push(i);
    }

    return paths.reduce( async (previousPromise, nextPath) => {
      await previousPromise;
      return loadSinglePath(start, end, nextPath);
    }, Promise.resolve());
  }
  return true;
}

function loadSinglePath(start, end, id) {
  console.log(`----------PATH ${id}----------`);
  walker.initDestination(start, end);
  allSteps = walker.getDestinationSteps(24);//2
  return loadDirections(allSteps)
  .then((response) => setDirections(response))//4
  .then((directions) => checkDirections(directions))
  .then((coordinates) => {
    allCoordinates = coordinates;
  });
}

function getLimitBounding() {
  let maxDis = 3000;
  let dis = 0;
  let index = 0;

  for (let i = 0; i < allCoordinates.length-1; i++) {
    dis += metersBetweenCoordinates(allCoordinates[i], allCoordinates[i+1]);
    if (dis > maxDis) {
      break;
    }
    index++;
  }
  return allCoordinates.slice(0, index+1);
}

function limitPath() {
  let maxDis = numWalks*2000;
  let dis = 0;
  let index = 0;

  for (let i = 0; i < allCoordinates.length-1; i++) {
    dis += metersBetweenCoordinates(allCoordinates[i], allCoordinates[i+1]);
    if (dis > maxDis) {
      console.log("breaking up", dis, i)
      break;
    }
    index++;
  }
  allCoordinates.splice(index+1, allCoordinates.length);
  return true;
}

//////////////////////////////
// directions
function loadJSONPromise(url) {
  return new Promise(function(resolve, reject) {
    loadJSON(url, (json) => resolve(json), (error) => reject(error));
  })
}

function getStartEnd(docs) {
  if (docs.length > 0){
    console.log("-----NEW DOC-------");
    console.log((numInstruction++) + " loading document");
    var doc = docs[0];
    _id = doc._id;

    var start = [doc.startLon, doc.startLat];
    var end = [doc.endLon, doc.endLat];
    startAddress = doc.startAddress;
    endAddress = doc.endAddress;

    miles = doc.miles;
    return {start: start, end:end};
  }
  return Promise.reject("no docs");
}

function loadDirections(steps) {
  let coordString = getCoordString(steps);
  console.log((numInstruction++) + " get directions")
  let mode = 'walking';
  let url = 'https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coordString;
  url += '?steps=true';
  url += '&geometries=geojson';
  url += '&continue_straight=true';
  url += '&access_token=' + keys.mapbox;
  return makeRequest(url);
}

function generateRandomWalk(start, miles) {
  console.log((numInstruction++) + " random walk generation");
  walker.takeSteps();
  return walker.steps;
}

function generateConstrainedRandomWalk(start) {
  console.log((numInstruction++) + " constrained random walk generation");
  let newOrleansWMeters = 6900;
  let hMeters = newOrleansWMeters * options.height/options.width;
  walker.stepsInBox(stepsPerWalk*numWalks, newOrleansWMeters, hMeters);
  return walker.steps;
}

function setDirections(response) {
  console.log((numInstruction++) + " set instructions")
  let directions = [];
  instructions = [];
  if (DIRECTIONS_ON) {
    // directions = JSON.parse(response.responseText).routes[0].geometry.coordinates;
    // console.log("parsing dir", JSON.parse(response.responseText));

    let route = JSON.parse(response.responseText).routes[0];
    let legs = route.legs;
    distance = Math.floor(route.distance*0.000621371*10)/10;
    console.log("ROUTE", route.distance, distance)
    duration = getDuration(route.duration, 2);
    // console.log("legs", route)

    for (var i = 0; i < legs.length; i++) {
      let steps = legs[i].steps;
      // console.log("steps", steps);
      for (var j = 0; j < steps.length; j++) {
        let coords = legs[i].steps[j].geometry.coordinates;
        let ins = steps[j].maneuver.instruction;
        if (ins.indexOf("You have arrived") < 0) instructions.push({ins:ins, step: j});
        for (var k = 0; k < coords.length; k++) {
          directions.push({coord: coords[k], step: j, leg:i});
        }
      }
      // var s = steps[i].geometry.coordinates;
      // coordinates.push(s[0]);//s.length-1])

    }
  }
  return directions;
}

function checkDirections(directions) {
  console.log((numInstruction++) + " check directions")
  if (DIRECTIONS_ON) {
    let maxDis = miles*2000;
    let dis = 0;
    let index = 0;
    if (BREAKING_UP) {
      for (var i = 0; i < directions.length-1; i++) {
        dis += metersBetweenCoordinates(directions[i].coord, directions[i+1].coord);
        if (dis > maxDis) {
          console.log("breaking up", dis, i, directions.length-1)
          break;
        }
        index++;
      }
    }
    else {
      index = directions.length-1;
    }
    let maxIns = directions[index].step;
    instructions =  instructions.filter(function(value, index, arr){
      return value.step <= maxIns;
    });
    directions.splice(index+1, directions.length);
    let coordinates = directions.map(x => x.coord);
    return coordinates;
  }
  return fakeCoordinates;
}

function setCenter() {
  if (DIRECTIONS_ON) {
    console.log((numInstruction++) + " set center")
    bounding = getBounding(allCoordinates);
    // bounding = getBounding(getLimitBounding());
    center = [];
    center[0] = (bounding.minLon + bounding.maxLon)/2;
    center[1] = (bounding.minLat + bounding.maxLat)/2;

    // options.zoom = 13;

    // if (BOUNDING_ON) options.zoom = 13;
    // else {
    options.zoom = boundingToZoom(options.width, bounding.minLon, bounding.minLat, bounding.maxLon, bounding.maxLat)-.4;
    // options.zoom = 14.74;
    console.log("zoom", options.zoom);
    // console.log("center", center);
    // }
  }
  else {
    center = fakeCoordinates[0];
    options.zoom = 13.4;
  }
  return center;
}

function initMap(start) {
  if (numInstruction > 0) console.log((numInstruction++) + " initializing map")
  // console.log("init map");
  options.lat = start[1];
  options.lng = start[0];
  // let zooms = [14, 13, 12];
  // options.zoom = zooms[miles-1];
  myMap = mappa.staticMap(options);
  return loadImagePromise(myMap.imgUrl).then((loadimg) => {
    img = loadimg;
    redraw();
    return true;
  });
}



function loadImagePromise(path) {
  return new Promise(function(resolve, reject) {
    loadImage(path, (img) => resolve(img), (error) => reject(error));
  })
}

function saveMap() {
  console.log((numInstruction++) + " saving map")
  if (SAVING_ON) saveCanvas(_id + '.png')
  // saveCanvas(cnv, _id, 'jpg');
}

//////////////////////////////
// wrapping up ...
function printMap() {
  if (PRINTING_ON) {
    console.log((numInstruction++) + " printing")
    let url = "/print?id=" + _id;
    return fetch(url, {method: 'POST'})
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject("200 error on printing");
      }
      response.json().then(function(data) {
        if (data.status == "success") return true;
        return Promise.reject("server error on printing");
      })
      .catch((error) => {
        return Promise.reject("print error " + error);
      });
    })
    .catch((error) => {
      return Promise.reject("print2 error " + error);
    });
  }
  return;

}

function deleteDoc() {
  if (DELETE_ON) {
    let url = docsURL + "delete?id=" + _id;
    console.log((numInstruction++) + " deleting doc")
    return fetch(url, {method: 'POST'})
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject("failed deleting");
      }
      response.json().then(function(data) {
        if (data.status == "success") {
          // console.log("DELETED", data);
          return true;
        }
        console.log("deleting issues", data);
        return Promise.reject("failed deleting");
      })
      .catch((error) => {
        return Promise.reject("deleting error " + error);
      });
    })
    .catch((error) => {
      return Promise.reject("delete error " + error);
    });
  }
  return null;
}

function finish() {
  console.log((numInstruction++) + " finishing loop")
  return null;
}

function reset() {
  console.log((numInstruction++) + " resetting")
  locked = false;
}

//////////////////////////////
// helpers

function timeToCheck(delayT) {
  if (millis() - lastChecked > delayT) {
    lastChecked = millis();
    return true;
  }
  return false;
}

function makeRequest (url, method) {
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

function zeroFill( number, width ){
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}


//////////////////////////////////
// map display

function drawMap() {
  let buffer2 = createGraphics(buffer.width, buffer.height);
  let buffer3 = createGraphics(buffer.width, buffer.height);

  if (DIRECTIONS_ON) console.log((numInstruction++) + " drawing map")

  buffer.push();
  buffer.clear();

  // buffer.background(255);
  // displayOutline(10, 10, 3);



  // tint(255, 100);
  buffer2.clear();
  for (let i = 0; i < allCoordinates.length-1; i++) {
    const pos1 = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0]);
    const pos2 = myMap.latLngToPixel(allCoordinates[i+1][1], allCoordinates[i+1][0]);
    buffer2.strokeWeight(map(i, 0, allCoordinates.length-1, 15, 8));
    buffer2.fill(255, 10);
    buffer2.noStroke();
    let sz = random(50, 160);
    buffer2.rectMode(CENTER);
    buffer2.ellipse(random(pos1.x, pos2.x),random(pos1.y, pos2.y), sz);
  }
  // img.mask(buffer2);


  // buffer.tint(255);
  // buffer.background(0);
  // buffer.blendMode(LIGHTEST);
  // buffer.image(twirl, 0, 0, buffer.width, buffer.height);



  // displayRandomWalkName();

  buffer.tint(255, 80);
  buffer.image(img, 0, 0);

  // buffer.tint(155);

  // buffer.blendMode(BLEND);

  // displayIcons();
  buffer.tint(255);
  // displayTitle(options.width/2, 0);

  buffer.blendMode(BLEND);
  if (DIRECTIONS_ON) {
    // displayBounding();
    // displayBoundingWalker();
    displayPath();
    // for (let j = 0; j < allCoordinates.length; j++) {
    //   let coordinates = allCoordinates[j]
    //   displayPath(j, coordinates);
    //   let end = myMap.latLngToPixel(coordinates[coordinates.length-1][1], coordinates[coordinates.length-1][0]);
    //   displayIcon(endIcon, end.x+2, end.y+2, .5);
    //
    //   if (BOUNDING_ON && j < allCoordinates.length-1) {
    //     displayLink(j, j+1);
    //   }
    // }
    let start = myMap.latLngToPixel(allCoordinates[0][1], allCoordinates[0][0]);
    displayStartEllipse(start.x, start.y, 16);
    let end = myMap.latLngToPixel(allCoordinates[allCoordinates.length-1][1], allCoordinates[allCoordinates.length-1][0]);
    displayEndIcon(end.x, end.y);
  }
  else displayFakePath(0);

  // for(let i = 0; i < 30; i++) {
  //   displayIcon(endIcon, random(buffer.width), random(buffer.height), random(.2, .7));
  // }

  // displaySteps();



  // buffer.strokeWeight(4);
  // buffer.noFill();
  // buffer.stroke(0);
  // buffer.rect(2, 2, buffer.width-4, buffer.height-4);

  buffer.pop();

  displayRim();
  displayTopTitle();

  displayKey();
  if (DIRECTIONS_ON) redraw();
}

function displayRim() {
  let spacing = buffer.height/9;
  console.log(buffer.height);
  let w = 8;
  let index = 0;
  buffer.strokeWeight(2);
  buffer.stroke(0);
  for (let y = 0; y < buffer.height; y+= spacing) {
    if (index %2 == 0) {
      buffer.fill(0);
    }
    else {
      buffer.fill(255);
    }
    buffer.rectMode(CORNER);
    buffer.rect(1, y, w, spacing);
    buffer.rect(buffer.width-w-1, y, w, spacing);

    index++;
  }
  index = 0;
  spacing = buffer.width/11;
  for (let x = 0; x < buffer.width; x+= spacing) {
    if (index %2 == 0) {
      buffer.fill(0);
    }
    else {
      buffer.fill(255);
    }
    buffer.rectMode(CORNER);
    buffer.rect(x, 0, spacing, w);
    buffer.rect(x, buffer.height-w, spacing, w);

    index++;
  }

}

function displayTopTitle() {
  buffer.noStroke();
  buffer.fill(0);
  buffer.push();
  let space = 45;
  // buffer.rect(0, 0, space, space);

  buffer.translate(space, space);
  buffer.noStroke();
  buffer.textFont(impactFont, space);
  buffer.fill(255);
  buffer.rect(0, 0, buffer.textWidth("RANDOM WALK MAP"), space);
  buffer.fill(0);
  buffer.text("RANDOM WALK MAP", 0, space*.8);

  let fsz = 30;
  buffer.textFont(impactFont, fsz);
  buffer.translate(0, 70);
  // buffer.stroke(0);
  // buffer.strokeWeight(1);
  // buffer.text("Total Distance:", 0,  fsz*.8);

  let bamt = 5;
  buffer.fill(0);
  buffer.rect(0, -bamt, buffer.textWidth(duration), fsz+bamt*2);
  buffer.fill(255);
  buffer.text(duration, 0, fsz*.8)

  buffer.translate(0,50);
  buffer.fill(0);
  let txt = `${distance} miles`;

  buffer.rect(0, -bamt, buffer.textWidth(txt), fsz+bamt*2);
  buffer.fill(255);
  buffer.text(txt, 0, fsz*.8)



  buffer.pop();
}

function displayKey() {
  let spacing = 50;
  let w = compass.width*.18;
  let h = compass.height*.18;
  buffer.push();
  buffer.translate(buffer.width - w - spacing, buffer.height-h-spacing)
  buffer.image(compass, 0, 0, w, h);
  buffer.pop();
}

function displayPopUp(txt, x, y, isLeft, isBottom) {
  buffer.push();
  // if (isLeft) {
  //   xVal = 200*(isLeft==true?1:-1);
  //   yVal = y-50;
  // }

  // let xVal = 200*(isLeft==true?1:-1);
  let xVal = x;
  let yVal = 200*(isBottom==true?1:-1);
  let xBox = x + xVal;
  let yBox = y+yVal;

  buffer.strokeWeight(2);
  buffer.stroke(0);
  buffer.fill(255);
  buffer.rect(xBox, yBox, 50, 50);
  buffer.noStroke();
  buffer.fill(0);
  buffer.text(txt, xBox, yBox)

  buffer.stroke(0);
  buffer.line(xBox, yBox, x, y);
  buffer.pop();
}

function displayIcons() {
  if (iconsLoaded) {
    console.log("displaying icons");

    for (let i = 0; i < 50; i++) {
      buffer.push();
      let x = random(buffer.width);
      let y = random(buffer.height);
      let yoff = map(x, 0, buffer.width, 0, 1);
      let xoff = map(y, 0, buffer.height, 0, 1);
      buffer.translate(x, y);
      let r = map(noise(xoff, yoff), 0, 1, 0, 2*PI);
      buffer.rotate(globalR);
      let sz = random(.3, .8);
      // if (random(1) < .8)
      // else sz = random(1.5, 3);
      displayIcon(icons[i%icons.length],0, 0, sz);
      buffer.pop();
      // buffer.image(icons[i], random(buffer.width), random(buffer.height));
      yoff += .001;
    }
  }
}
function displaySteps() {
  console.log("displaying steps")
  let index = 0;
  for (let i = 0; i < allSteps.length-1; i++) {
    buffer.stroke(255, 0, 0);
    let step = allSteps[i];
    let nextStep = allSteps[i+1];
    const pos1 = myMap.latLngToPixel(step[1], step[0]);
    const pos2 = myMap.latLngToPixel(nextStep[1], nextStep[0]);
    buffer.line(pos1.x, pos1.y, pos2.x, pos2.y);
  }
}

function displayOutline(x, y, thick) {
  buffer.stroke(0);
  buffer.noFill();
  buffer.strokeWeight(thick);
  buffer.rect(x, y, buffer.width-x*2, buffer.height-y*2);
}

function displayTitle(x, y) {
  buffer.push();
  buffer.translate(x, y);

  buffer.fill(0, 0, 255);
  buffer.noStroke();
  buffer.textFont(font, 26);
  let title = "RANDOM WALK MAP";
  buffer.text(title, -textWidth(title)/2, 20);

  buffer.pop();
}

function displayInstructions(instructions, sz) {
  // console.log(JSON.stringify(pixels))
  buffer.textSize(sz);
  buffer.fill(0);
  buffer.noStroke();
  for (let i = 0; i < instructions.length; i++) {
    buffer.text((i+1) + ". " +  instructions[i], options.width + 50, 20*i+50);
  }
}
function displayFakePath(id) {
  for (let i = 0; i < fakePoints.length-1; i++) {
    let pos1 = fakePoints[i];
    let pos2 = fakePoints[i+1];
    let offSetX = 0;
    let offSetY = 0;
    let sz = map(id, 0, fakePoints.length-1, 20, 5);
    // buffer.line(pos1.x+offSetX, pos1.y+offSetY, pos2.x+offSetX, pos2.y+offSetY);
    displaySegement(pos1, pos2, id, sz);
  }
}

function displayPath() {


  let index = 0;
  for (let i = 0; i < allCoordinates.length-1; i++) {
    const pos1 = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0]);
    const pos2 = myMap.latLngToPixel(allCoordinates[i+1][1], allCoordinates[i+1][0]);
    // buffer.strokeWeight(map(i, 0, allCoordinates.length-1, 10, 5));
    buffer.strokeWeight(7);
    buffer.stroke(0);
    buffer.line(pos1.x, pos1.y, pos2.x, pos2.y);
    //   if (i% 10 == 0) {
    //     index++;
    //     displayPopUp("WUT goes hurr", random(pos1.x, pos2.x), random(pos1.y, pos2.y), index%2 ==0, index%4 > 2);
    //   }
    //   // if (id == 0) buffer.line(pos1.x+offSetX, pos1.y+offSetY, pos2.x+offSetX, pos2.y+offSetY);
    //   // else {
    //   //     // sz = 8;
    //   //   let sz = map(i, 0, coordinates.length-1, 20, 5);
    //   //   displaySegement(pos1, pos2, id, sz);
    //   // }
  }
  buffer.colorMode(RGB, 255);
  displayMarkers();
}

function displayMarkers() {
  let arrowSpacing = 93;
  let disTraveled = arrowSpacing;
  let totalDis = 0;
  let prevDis = -50;
  let index = 0;
  for (let i = 0; i < allCoordinates.length-1; i++) {
    // buffer.colorMode(HSB, numWalks);
    // buffer.colorMode(RGB, 255);
    // buffer.stroke(id, numWalks, numWalks);

    // for (let i = 0; i < 5; i++) {

    // }

    const pos1 = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0]);
    const pos2 = myMap.latLngToPixel(allCoordinates[i+1][1], allCoordinates[i+1][0]);
    totalDis += dist(pos1.x, pos1.y, pos2.x, pos2.y);
    while (disTraveled < totalDis) {
      let vec1 = createVector(pos1.x, pos1.y);
      let vec2 = createVector(pos2.x, pos2.y);
      let per = map(disTraveled,prevDis, totalDis, 0, 1);
      if (per < .25) per = .25;
      let pos = p5.Vector.lerp(vec1, vec2, per);

      buffer.fill(0);
      buffer.noStroke();
      let r = atan2(vec2.x-vec1.x, vec1.y-vec2.y);
      buffer.push();
      buffer.translate( pos.x, pos.y);
      let txt = "a whole lot of stuff goes here";
      // buffer.textFont(font, 14);
      // buffer.text(txt,-buffer.textWidth(txt)/2, 10);
      // displayLabel(txt);
      buffer.rotate(r); //-PI/2
      // buffer.textFont(font, 40);
      // buffer.text(">",-buffer.textWidth("x")/2, 10);

      let amt = 3;
      // buffer.strokeWeight(4);
      // buffer.stroke(0);
      // buffer.line(0, 0,amt, amt*2);
      //   buffer.stroke(255, 0, 0);
      // buffer.line(0, 0, -amt, amt*2);



      // buffer.stroke(255);
      // buffer.strokeWeight(1);
      buffer.noStroke();
      buffer.fill(255);
      buffer.triangle(0, -amt/2, amt, amt*2, -amt, amt*2);

      buffer.pop();


      // buffer.ellipse(pos.x, pos.y, 20)
      disTraveled += arrowSpacing;
    }
    prevDis = totalDis;

  }
}

function displaySegement(pos1, pos2, id, sz) {
  let dis = dist(pos1.x, pos1.y, pos2.x, pos2.y);
  buffer.colorMode(HSB, numWalks);

  if (dis > 0) {
    let index = 0;
    for (let j = 0; j < dis; j += sz/2) {
      index++;
      let v1 = createVector(pos1.x, pos1.y, 0);
      let v2 = createVector(pos2.x, pos2.y, 0);
      let pos = p5.Vector.lerp(v1, v2, map(j, 0, dis, 0, 1));
      // buffer.stroke(0);
      buffer.strokeWeight(3);
      // buffer.noStroke();
      // buffer.fill(id, numWalks, numWalks, numWalks/2);
      buffer.stroke(0);
      buffer.noFill();
      // buffer.rect(pos.x, pos.y, sz, sz);

      if (id == 1) buffer.ellipse(pos.x, pos.y, sz)
      else if (id == 2) {
        if (index%2 == 0) {
          let posNext = p5.Vector.lerp(v1, v2, map(j+1, 0, dis, 0, 1));
          buffer.line(pos.x, pos.y, posNext.x, posNext.y);
        }


      }
      // else if (id == 2){
      //   buffer.fill(0);
      //   buffer.noStroke();
      //   buffer.textFont(font, sz);
      //   buffer.text("x", pos.x, pos.y-sz);
      // }
      // else if (id == 3) {
      //   buffer.triangle(pos.x - sz/2, pos.y-sz, pos.x+sz/2, pos.y-sz, pos.x, pos.y);
      // }
      // else {
      //   buffer.fill(0);
      //   buffer.noStroke();
      //   buffer.textFont(font, sz);
      //   buffer.text("-", pos.x, pos.y-sz);
      // }
    }
  }
}

function displayIcon(icon, x, y, factor) {
  // buffer.tint(random(255), random(255), random(255));
  let w = endIcon.width*factor;
  let hH = endIcon.height*factor;
  buffer.image(endIcon, x-w/2, y-hH, w, hH);
  w = icon.width*factor*.7;
  let h = icon.height*factor*.7;
  buffer.image(icon, x-w/2, y-hH*.6-h/2, w, h);
  // buffer.image(icon, x-w/2, y-hH, w, hH);
}

function displayStartEllipse(x, y, w=14) {
  buffer.stroke(0);
  buffer.strokeWeight(4);
  // buffer.fill(67, 133, 245);
  buffer.fill(255);
  buffer.ellipse(x, y, w);

  buffer.fill(0);
  buffer.noStroke();
  buffer.textFont(font, 12);
  displayAddress(startAddress, x+15, y);
  // if (x + buffer.textWidth(address) < buffer.width-50) displayAddress(x+18, y);
  // else displayAddress(x-buffer.textWidth(address)-18, y);
}

function displayEndIcon(x, y) {
  buffer.push();
  buffer.translate(x, y);
  // buffer.rotate(globalR);
  displayIcon(icons[0], 0, 0, .5);
  buffer.translate(15, 0);
  displayLabel(endAddress);
  buffer.pop();
}

function displayAddress(txt, x, y) {
  buffer.push();
  buffer.translate(x, y);
  // buffer.rotate(globalR);
  displayLabel(txt);
  buffer.pop();
}
function displayLabel(txt) {
  buffer.push();
    buffer.noStroke();
  // buffer.translate(x, y);
  // buffer.stroke(0);
  buffer.textFont(impactFont, 20);
  buffer.strokeWeight(1);
  buffer.fill(0);
  buffer.rect(5, -15, buffer.textWidth(txt), 28);
  buffer.fill(0);
buffer.fill(255);
  buffer.text(txt, 5, 5);
  buffer.pop();
}

function displayBounding() {
  let p1 = myMap.latLngToPixel(bounding.minLat, bounding.minLon);
  let p2 = myMap.latLngToPixel(bounding.maxLat, bounding.minLon);
  let p3 = myMap.latLngToPixel(bounding.maxLat, bounding.maxLon);
  let p4 = myMap.latLngToPixel(bounding.minLat, bounding.maxLon);
  buffer.stroke(255, 255, 0);
  buffer.line(p1.x, p1.y, p2.x, p2.y);
  buffer.line(p2.x, p2.y, p3.x, p3.y);
  buffer.line(p3.x, p3.y, p4.x, p4.y);
  buffer.line(p4.x, p4.y, p1.x, p1.y);

  let p = myMap.latLngToPixel(center[1], center[0]);
  buffer.fill(0, 255, 0);
  buffer.ellipse(p.x, p.y, 30, 30);
}

function displayBoundingWalker() {
  let wMeters = 6900; //new orleans diameter/2
  let hMeters = wMeters * options.height/options.width;
  // x = lon = w, y = lat
  let maxPoint = getNewCoord(allSteps[0], wMeters/2, hMeters/2);
  let minPoint = getNewCoord(allSteps[0], -wMeters/2, -hMeters/2);

  let p1 = myMap.latLngToPixel(minPoint[1], minPoint[0]);
  let p2 = myMap.latLngToPixel(maxPoint[1], minPoint[0]);
  let p3 = myMap.latLngToPixel(maxPoint[1], maxPoint[0]);
  let p4 = myMap.latLngToPixel(minPoint[1], maxPoint[0]);
  buffer.stroke(255, 0, 255);
  buffer.line(p1.x, p1.y, p2.x, p2.y);
  buffer.line(p2.x, p2.y, p3.x, p3.y);
  buffer.line(p3.x, p3.y, p4.x, p4.y);
  buffer.line(p4.x, p4.y, p1.x, p1.y);
}
function displayRandomWalkName() {
  let r = random(2*PI);
  let str = "RANDOM WALK MAP";
  let str2 = "";
  for (let j = 0; j < str.length; j++) {
    if (random(1) < .5) str2 += str.charAt(j).toUpperCase();
    else str2 += str.charAt(j).toLowerCase();
  }

  buffer.push();
  let txtsz = 180;
  buffer.textFont(font, txtsz);

  buffer.translate(buffer.width/2, buffer.height/2);
  // buffer.rotate(globalR);
  buffer.translate(-buffer.textWidth("RANDOM")/2, -txtsz*1.5);

  // buffer.fill(0, 50);
  buffer.fill(0);
  buffer.noStroke();


  buffer.text(str2,0, 0, buffer.textWidth("RANDOM")+50, txtsz*4);
  buffer.pop();
}

function displayRandomWalkName2() {
  let r = random(2*PI);
  let num =15;
  for (let i =0; i < num; i++) {
    let sz = 8;
    // if (random(1) < .5) random(8, 30);
    // else sz = random(30, 100);
    sz = random(20, 100);
    let f = color(random(0, 100), 50);
    buffer.push();
    buffer.translate(random(0, buffer.width), map(i, 0, num, 0, buffer.height));
    buffer.translate(buffer.textWidth(startAddress)/2, 0);
    buffer.rotate(r);
    // if (sz < 20) {
    buffer.fill(0, 30);
    buffer.noStroke();
    // }
    // else {
    //   buffer.noFill();
    //   buffer.stroke(f);
    // }

    buffer.textFont(font, sz);
    let str = "RANDOM WALK MAP";
    let str2 = "";
    for (let j = 0; j < str.length; j++) {
      if (random(1) < .5) str2 += str.charAt(j).toUpperCase();
      else str2 += str.charAt(j).toLowerCase();
    }
    buffer.text(str2,0, 0);
    buffer.pop();
  }
}


//////////////////////////////////
// mapbox
function addLine(id, coords) {
  let data = getGeoJson(coords);
  map.addSource(id, { type: 'geojson', data: data });
  map.addLayer({
    "id": id,
    "type": "line",
    "source": id,
    "paint": {
      "line-color": "yellow",
      "line-opacity": 0.75,
      "line-width": 5
    }
  });
}

function updateLine(id, coords) {
  var geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  };
  myMap.getSource(id).setData(geojson);
}

function getGeoJson(coords) {
  let geojson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": coords
        }
      }
    ]
  }
  return geojson;
}

function getBounding(coords) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (var i = 0; i < coords.length; i++) {

    let s = coords[i];
    if (s[0] < minLon) minLon = s[0];
    else if (s[0] > maxLon) maxLon = s[0];
    if (s[1] < minLat) minLat = s[1];
    else if (s[1] > maxLat) maxLat = s[1];
  }
  return {"minLon": minLon, "minLat": minLat, "maxLon": maxLon, "maxLat": maxLat};
  //[(maxLon + minLon)/2, (maxLat + minLat)/2];
}

function getDuration(seconds, dec) {
  let mins = seconds/60;
  let hours = mins/60;
  let days = hours/24;
  //println(days, hours, mins);
  if (seconds < 60) {
    seconds = round(seconds, dec);
    return seconds + " s";
  }
  if (mins < 60) {
    mins= floor(mins);
    return mins+" min";
  }
  if (days < 1) {
    let m = mins%60;
    let h = floor(hours);
    return h + " hours " + floor(m) + " min"
  }
  return round(days, dec) + " days";
}



function getCoordString(coords) {
  let coordString = "";
  for (let i = 0; i < coords.length - 1; i++) {
    coordString += coords[i][0] + "," +  coords[i][1] + ";"
  }
  let e = coords.length - 1;
  coordString += coords[e][0] + "," +  coords[e][1]
  return coordString;
}
