
let walker = new Walker();
let allCoordinates = [];
let instructions = [];
let isMobile = false;


function startWalk() {
    if (!center) {
        alert('please make sure to set a starting point first');
    }
    else {
        getRandomWalk(getCenterArray())
            .then((response) => {
                let directions = JSON.parse(response.responseText);
                let route = directions.routes[0];
                if (wayOff(getCenterArray(), route.geometry.coordinates[1])) {
                    alert("sorry, no roads nearby");
                }
                else {
                    console.log(directions);
                    setDirections(route);
                    addRouteToMap();
                    htmlInstructions();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

}

async function getRandomWalk(start) {
    let steps = generateRandomWalk(start);
    // console.log(steps);
    let response = await loadDirections(steps);
    return response;
    // checkDirections(directions);
    // limitPath();
    // instructions = setInstructions();

}

function generateRandomWalk(start) {
    let meters = getDistanceMeters();
    // .5 km => 20meter steps
    // 3 mile => 200 meter step
    // 10 mile => 666 meter step
    let stepSizeMeters = Math.ceil(meters / 24);
    stepSizeMeters = stepSizeMeters < 200 ? 200 : stepSizeMeters;
    walker.init(getCenterArray(), meters, stepSizeMeters);
    walker.takeSteps();
    return walker.steps;
}




// function limitPath() {
//     let maxDis = getDistanceMeters();
//     let dis = 0;
//     let index = 0;

//     for (let i = 0; i < allCoordinates.length - 1; i++) {
//         dis += metersBetweenCoordinates(allCoordinates[i], allCoordinates[i + 1]);
//         if (dis > maxDis) {
//             console.log("breaking up", dis, i)
//             break;
//         }
//         index++;
//     }
//     allCoordinates.splice(index + 1, allCoordinates.length);
// }

function checkDirections(directions) {
    let maxIndex = getMaxDistanceIndex(directions, getDistanceMeters());

    // let maxIns = directions[maxIndex].step;
    // instructions = instructions.filter(function (value, index, arr) {
    //     return value.step <= maxIns;
    // });

    // directions.splice(maxIndex + 1, directions.length);
    // console.log(maxIndex, directions[maxIndex]);
    let coordinates = directions.map(x => x.coord);
    return coordinates;
}



function addRouteToMap() {
    updateLine(myMap, "route", allCoordinates);
    addMarkers(allCoordinates[0], allCoordinates[allCoordinates.length - 1]);
}

function unitsInMetric() {
    return document.getElementById("unitSystem").value === "km";
}

function getDistanceMeters() {
    let distance = +document.getElementById("distanceSelect").value;
    let meters;
    if (unitsInMetric()) {
        meters = distance * 1000;
    } else {
        meters = distance * 1609.34;
    }
    return meters;
}


function setDirections(route) {
    // var coordinates = [];
    allCoordinates = [];
    instructions = [];
    // console.log("REZ", JSON.parse(responses[0].responseText))

    distance = 0;
    duration = 0;




    // setTripDetails(route.distance, route.duration);

    // coordinates = coordinates.concat(route.geometry.coordinates);
    // setInstructions(route);
    // return coordinates;

    let legs = route.legs;

    // console.log("legs", legs)
    for (var i = 0; i < legs.length; i++) {
        let steps = legs[i].steps;
        // console.log("steps", steps);
        for (var j = 0; j < steps.length; j++) {
            let coords = steps[j].geometry.coordinates;
            let ins = steps[j].maneuver;
            let dis = steps[j].distance;
            let dur = steps[j].duration;
            distance += dis;
            if (distance < getDistanceMeters()) {
                allCoordinates = allCoordinates.concat(coords);
                instructions.push({ ins: ins, dis: dis, dur: dur });
            }
            else
                break;
        }
    }
}

function wayOff(start, coord) {
    let dis = distanceInMetersBetweenCoordinates(start, coord);
    return dis > 1000;
    // return false;
}

function setTripDetails(distance, duration) {
    distance = distance * 0.000621371;
    distance = Math.floor(distance * 10) / 10;
    duration = getDuration(duration, 2);
    document.getElementById("duration").innerText = duration;
    document.getElementById("distance").innerText = ` (${distance} miles)`;
}

// function setInstructions(route) {

//     let legs = route.legs;

//     // console.log("legs", legs)
//     for (var i = 0; i < legs.length; i++) {
//         let steps = legs[i].steps;
//         // console.log("steps", steps);
//         for (var j = 0; j < steps.length; j++) {
//             //   let coords = legs[i].steps[j].geometry.coordinates;
//             let ins = steps[j].maneuver;
//             // if (ins.indexOf("You have arrived") < 0)
//             instructions.push({ ins: ins, dis: steps[j].distance, dur: steps[j].duration, step: j });
//             //   for (var k = 0; k < coords.length; k++) {
//             //     directions.push({coord: coords[k], step: j, leg:i});
//             //   }
//         }
//         // var s = steps[i].geometry.coordinates;
//         // coordinates.push(s[0]);//s.length-1])

//     }

// }

function htmlInstructions() {
    var instructionsDiv;
    if (window.innerWidth < 500 || isMobile)
        instructionsDiv = document.getElementById("instructionsModal");
    else
        instructionsDiv = document.getElementById("instructions");
    instructionsDiv.innerHTML = "";
    // console.log("ins nums", instructions.length)
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



