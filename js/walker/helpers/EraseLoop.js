function eraseLoop(coords) {
  let loopIndices = checkForIntersects(coords);
  if (loopIndices != null) {
    // if path intersect occurs, find the coordinates
    let startIndex = loopIndices[0];
    let endIndex = loopIndices[1]+1;
    let p0 = coords[loopIndices[0]];
    let p1 = coords[loopIndices[0]+1];
    let p2 = coords[loopIndices[1]];
    let p3 = coords[loopIndices[1]+1];
    let crossPoint = getIntersectionPoint(p0, p1, p2, p3);

    // create new steps array without loop
    let startSteps = coords.slice(0, startIndex);
    startSteps.push(crossPoint);
    let endSteps = coords.slice(endIndex);
    return startSteps.concat(endSteps);
  }
  return coords;
}


function checkForIntersects(coords) {
  for (let i = 0; i < coords.length- 2; i++) {
    let start = coords[i];
    let end = coords[i+1];

    let index = checkForIntersect(coords, i+2, start, end);
    if (index > -1) {
      let indices = [i, index];
      return indices;
    }
  }
  return null;
}

function getIntersectionPoint(p0, p1, p2, p3) {

  let s1_x = p1[0] - p0[0]
  let s1_y = p1[1] - p0[1]
  let s2_x = p3[0] - p2[0]
  let s2_y = p3[1] - p2[1]

  let s = (-s1_y * (p0[0] - p2[0]) + s1_x * (p0[1] - p2[1])) / (-s2_x * s1_y + s1_x * s2_y)
  let t = ( s2_x * (p0[1] - p2[1]) - s2_y * (p0[0] - p2[0])) / (-s2_x * s1_y + s1_x * s2_y)

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
  // intersection
  return [p0[0] + (t * s1_x),  p0[1] + (t * s1_y)];

  return null // no intersection
}

function checkForIntersect(coords, startInd, start, end) {
  let path = coords.slice(startInd);
  for (let i = 0; i < path.length-1; i++) {
    let x1 = path[i][0];
    let y1 = path[i][1];
    let x2 = path[i+1][0];
    let y2 = path[i+1][1];
    let x3 = start[0];
    let y3 = start[1];
    let x4 = end[0];
    let y4 = end[1];
    let inter = intersects(x1, y1, x2, y2, x3, y3, x4, y4);
    if (inter > 0) return i + startInd;
  }
  return -1;
}

// https://gist.github.com/lengstrom/8499382
function intersects(x1, y1, x2, y2, x3, y3, x4, y4){
  var a1, a2, b1, b2, c1, c2;
  var r1, r2 , r3, r4;
  var denom, offset, num;

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x + b1 y + c1 = 0".
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = (x2 * y1) - (x1 * y2);

  // Compute r3 and r4.
  r3 = ((a1 * x3) + (b1 * y3) + c1);
  r4 = ((a1 * x4) + (b1 * y4) + c1);

  // Check signs of r3 and r4. If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
    return 0; //return that they do not intersect
  }

  // Compute a2, b2, c2
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = (x4 * y3) - (x3 * y4);

  // Compute r1 and r2
  r1 = (a2 * x1) + (b2 * y1) + c2;
  r2 = (a2 * x2) + (b2 * y2) + c2;

  // Check signs of r1 and r2. If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
    return 0; //return that they do not intersect
  }

  //Line segments intersect: compute intersection point.
  denom = (a1 * b2) - (a2 * b1);

  if (denom === 0) {
    return 1; //collinear
  }

  // lines_intersect
  return 1; //lines intersect, return true
}

function sameSign(a,b){
  return Math.sign(a)==Math.sign(b);
}
