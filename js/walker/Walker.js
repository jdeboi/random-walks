
// long, lat
class Walker {
  constructor() {
    this.start;
    this.end;
    this.steps;
    this.stepSizeMeters;// = 200; // meters?
    this.coordinates;
    this.directionAngle = Math.random()*360;
    // this.miles = 1;
    this.distanceMeters;

    let d = new Date();
    // year, month, day, hours, minutes, seconds, milliseconds)
    this.startTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  init(start, distanceMeters, stepSizeMeters) {
    this.start = start;
    this.steps = [start];
    this.coordinates = [start];
    this.distanceMeters = distanceMeters;
    this.stepSizeMeters = stepSizeMeters;
  }

  takeSteps() {
    let numSteps = Math.floor(this.distanceMeters/this.stepSizeMeters); //?
    for (let i = 0; i < numSteps; i++) {
      this.takeStep();
    }
    this.eraseStepsLoop();
    // this.setDirections(walker.getStepsString());
  }

  takeStep() {
    this.setDirectionAngle();
    let metersX = this.stepSizeMeters*Math.cos(deg2rad(this.directionAngle));
    let metersY = this.stepSizeMeters*Math.sin(deg2rad(this.directionAngle));
    // let currentStep = this.coordinates[this.coordinates.length-1];
    let currentStep = this.steps[this.steps.length-1];
    let newCoord = getNewCoord(currentStep, metersX, metersY);
    this.steps.push(newCoord);
  }

  eraseStepsLoop() {
    this.steps = eraseLoop(this.steps);
  }

  setDirectionAngle() {
    let possibleDirections = [-45, - 30, 0, 30, 45];
    let r = Math.floor(Math.random()*possibleDirections.length);
    let nextAngle = possibleDirections[r];
    this.directionAngle += nextAngle;
  }

  ///////////////////////////////////////////////////////////////
  initDestination(start, end) {
    this.start = start;
    this.end = end;
    this.steps = [];
    this.coordinates = [];
  }

  getDestinationSteps(numSteps) {
    this.steps = [];
    let start = createVector(this.start[0], this.start[1]);
    let end = createVector(this.end[0], this.end[1]);
    let prevPos = createVector(start.x, start.y);

    let d = dist(end.x, end.y, start.x, start.y);
    let stepSize = d / numSteps;
    let ang = atan2(end.y - start.y, start.x - end.x);

    let noiseScale = numSteps/4;
    let amp = d/2;

    for(let i = 0; i < numSteps; i++) {

      let per = map(i, 0, numSteps-1, 0, 1);
      let pernext = map(i+1, 0, numSteps-1, 0, 1);

      let pos = p5.Vector.lerp(start, end, per);
      // let posnext = p5.Vector.lerp(start, end, pernext);

      let n = map(noise(i/noiseScale), 0, 1, -amp, amp);
      // add a sine wave because why not?
      n+= amp/4*Math.sin(i/numSteps*2*Math.PI*random(0, 4));
      n+= amp/8*Math.cos(i/numSteps*2*Math.PI*random(0, 2));

      // fade in and out
      if (i < 6) n = n*map(i, 0, 6, 0, 1);
      else if (i >= numSteps-6) n = n * map(i, numSteps-6, numSteps-1, 1, 0);

      let lon = pos.x + n*Math.sin(ang);
      let lat = pos.y + n*Math.cos(ang);

      this.steps.push([lon, lat]);

      prevPos.x = lon;
      prevPos.y = lat;
    }
    this.steps.push(this.end);
    return this.steps;
  }

  stepsInBox(num, wMeters, hMeters) {
    let maxPoint = getNewCoord(this.steps[0], wMeters/2, hMeters/2);
    let minPoint = getNewCoord(this.steps[0], -wMeters/2, -hMeters/2);

    for (let i = 0; i < num; i++) {
      this.stepInBox(minPoint, maxPoint);
    }
    // this.eraseStepsLoop();
  }


  stepInBox(minPoint, maxPoint) {
    // this.stepSize = Math.random()*500 + 300;
    // this.stepSize = Math.random()*200 + 100;
    this.setDirectionConstrained(minPoint, maxPoint);

    let metersX = this.stepSizeMeters*Math.cos(deg2rad(this.directionAngle));
    let metersY = this.stepSizeMeters*Math.sin(deg2rad(this.directionAngle));
    // let currentStep = this.coordinates[this.coordinates.length-1];
    let currentStep = this.steps[this.steps.length-1];
    let newCoord = getNewCoord(currentStep, metersX, metersY);
    this.steps.push(newCoord);
  
  }

  addRoute(route) {
    this.coordinates = this.coordinates.concat(route);
    // this.coordinates = eraseLoop(this.coordinates);
  }

 
  setDirectionConstrained(minPoint, maxPoint) {
    let stepS = this.stepSizeMeters;
    let stepInDegrees = degreesPerMeter(this.steps[0][1]).map(function(x) { return x * stepS;});
    let currentStep = this.steps[this.steps.length-1];
    let lon = currentStep[0];
    let lat = currentStep[1];
    if (lon + stepInDegrees[0] > maxPoint[0]) {
      // console.log("LEFT", this.steps.length);
      // go left and down
      if (lat + stepInDegrees > maxPoint[1]) this.directionAngle = 225;
      // go left and up
      else if (lat - stepInDegrees < minPoint[1]) this.directionAngle = 135;
      // go left
      else this.directionAngle = 180;//random(120, 240);
    }
    else if (lon - stepInDegrees[0] < minPoint[0]) {
      // console.log("RIGHT", this.steps.length);
      // go right and down
      if (lat + stepInDegrees > maxPoint[1]) this.directionAngle = 315;
      // go right and up
      else if (lat - stepInDegrees < minPoint[1]) this.directionAngle = 45;
      // go right
      else this.directionAngle = 0// random(-45, 45);
    }
    else if (lat + stepInDegrees[1] > maxPoint[1]) {
      // go down
      // console.log("DOWN", this.steps.length);
      this.directionAngle = 270; //random(225, 315);
    }
    else if (lat - stepInDegrees[1] < minPoint[1]) {
      // go up
      // console.log("UP", this.steps.length);
      this.directionAngle = 90; //random(45, 135);
    }
    else {
      let possibleDirections = [-45, - 30, 0, 30, 45];
      // let nextAngle = random(possibleDirections);
      // this.directionAngle += nextAngle;
      // let possibleDirections = [-90, 0, 90];
      let r = Math.floor(Math.random()*possibleDirections.length);
      let nextAngle = possibleDirections[r];
      this.directionAngle += nextAngle;
    }
  }



  setDirectionAngleOG() {
    // let r = Math.random();
    // if (r < 0.33) this.directionAngle += 90;
    // else if (r < 0.66) this.directionAngle -= 90;

    let r = Math.random();
    this.directionAngle
    if (r > 0.5) this.directionAngle += Math.random() * 180 - 90;

    // let r = Math.random();
    // if (r < 0.65) {
    //   return;
    // }
    // else {
    //   let possibleDirections = [-90, 90];
    //   let nextAngle = possibleDirections[Math.floor(Math.random()*2)];
    //   this.directionAngle += nextAngle;
    // }
  }

  getLastCoordinate() {
    return this.coordinates[this.coordinates.length-1];
  }

  getLatestStepString() {
    let currentStep = this.coordinates[this.coordinates.length-1];
    let newCoord = this.steps[this.steps.length-1];
    return this.getCoordinateString([currentStep, newCoord]);
  }

  getBounding() {
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (var i = 0; i < this.steps.length; i++) {
      let s = this.steps[i];
      if (s[0] < minLon) minLon = s[0];
      else if (s[0] > maxLon) maxLon = s[0];
      if (s[1] < minLat) minLat = s[1];
      else if (s[1] > maxLat) maxLat = s[1];
    }
    return {"minLon": minLon, "minLat": minLat, "maxLon": maxLon, "maxLat": maxLat};
    //[(maxLon + minLon)/2, (maxLat + minLat)/2];
  }

  getAverage() {
    let sum = [0, 0];
    for (var i = 0; i < this.steps.length; i++) {
      sum[0] += this.steps[i][0];
      sum[1] += this.steps[i][1];
    }
    sum[0] = sum[0] / this.steps.length;
    sum[1] = sum[1] / this.steps.length;
    return sum;
  }

  getStepsString() {
    return this.getCoordinateString(this.steps);
  }

  getCoordinateString(coords) {
    let coordString = "";
    for (let i = 0; i < coords.length - 1; i++) {
      coordString += coords[i][0] + "," +  coords[i][1] + ";"
    }
    let e = coords.length - 1;
    coordString += coords[e][0] + "," +  coords[e][1]
    return coordString;
  }

  getCoordinatesJson() {
    console.log(JSON.stringify(this.coordinates));
  }

  getStepsArray() {
    return this.steps;
  }

  getCoordinatesArray() {
    return this.coordinates;
  }

  setDirections(coords) {
    let that = this;
    let mode = 'walking';
    let url = 'https://api.mapbox.com/directions/v5/mapbox/' + mode + '/' + coords + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
    // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    let req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload = function() {
      let data = req.response.routes[0];
      let route = data.geometry.coordinates;
      this.coordinates = route;
      that.addRoute(route);
      updateLine("route", that.getCoordinatesArray());
      updateLine("steps", that.getStepsArray());
      addNumberedPoints(that.getStepsArray());
    };
    req.send();
  }


}
