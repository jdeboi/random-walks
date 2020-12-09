function getMaxDistanceIndex(directions, maxDis) {
    let dis = 0;
    let index = 0;
    for (var i = 0; i < directions.length - 1; i++) {
        dis += metersBetweenCoordinates(directions[i].coord, directions[i + 1].coord);
        if (dis > maxDis) {
            // if (DEV_MODE) console.log("breaking up", dis, i, directions.length - 1)
            break;
        }
        index++;
    }
    return index;
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
