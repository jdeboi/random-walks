function random(start, end) {
    let range = end - start;
    let r = start + Math.random()*range;
    return r;
}

function map(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }