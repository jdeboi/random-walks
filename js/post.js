
// testing
function setStartLabelAddress() {
  // console.log(JSON.parse(json.responseText))
  // endLocation = JSON.parse(json.responseText).features[0];
  // var label = endLocation.properties.label;
  // document.getElementById('smallEndAddress').innerHTML = label;
  let addr = document.getElementById('startStartAddress').value;
  let url="/geocode?addr=";
  url += encodeURI(addr);
  var small = document.getElementById('smallStartAddress');
  fetch(url)
  .then((response) => {
    if (response.status !== 200) {
      smallStart.innerHTML = "failed to get address";
    }
    response.json().then(function(data) {
      if (emptyObj(data)) small.innerHTML = "";
      else small.innerHTML = data.label;
    })
    .catch((error) => {
      small.innerHTML = "no address found";
    });
  })
  .catch((error) => {
    smallStart.innerHTML = "failed to get address";
  });
}

function setStartLabelAddress() {
  // console.log(JSON.parse(json.responseText))
  // endLocation = JSON.parse(json.responseText).features[0];
  // var label = endLocation.properties.label;
  // document.getElementById('smallEndAddress').innerHTML = label;
  let addr = document.getElementById('startEndAddress').value;
  let url="/geocode?addr=";
  url += encodeURI(addr);
  var smallEnd = document.getElementById('smallEndAddress');
  fetch(url)
  .then((response) => {
    if (response.status !== 200) {
      smallEnd.innerHTML = "failed to get address";
    }
    response.json().then(function(data) {
      if (emptyObj(data)) smallEnd.innerHTML = "";
      else smallEnd.innerHTML = data.label;
    })
    .catch((error) => {
      smallEnd.innerHTML = "no address found";
    });
  })
  .catch((error) => {
    smallEnd.innerHTML = "failed to get address";
  });
}

function submitAddressFromGoogle(address) {
  var place = address.address_components;
  addr = place[0].short_name + " " + place[1].short_name+ ", " +place[3].short_name+ ", " +place[5].short_name;
  // submitAddress(addr);
}

function submitForm() {
  let addrStart = document.getElementById('autocompleteStart').value;
  let addrEnd = document.getElementById('autocompleteEnd').value;
  console.log("submitting", addrStart, addrEnd);
  submitAddress(addrStart, addrEnd);
}


function submitAddress(addrStart, addrEnd) {
  let url="/post"
  // let miles = document.getElementById('controlSelect').value;
  let miles = 1;
  let smallStart = document.getElementById('smallStartAddress');
  let smallEnd = document.getElementById('smallEndAddress');
  // console.log(addr, miles)
  fetch(url, {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      posted: {
        addrStart: addrStart,
        addrEnd: addrEnd,
        miles: miles
      }
    })})
    .then((response) => {
      if (response.status !== 200) {
        smallStart.innerHTML = "failed to get address";
        smallEnd.innerHTML = "failed to get address";
        return false;
      }
      response.json().then(function(data) {
        if (emptyObj(data)) {
          smallStart.innerHTML = "";
          smallEnd.innerHTML = "";
          return false;
        }
        else {
          // small.innerHTML = data.status;
          window.location.href="/thanks";
        }
      })
      .catch((error) => {
        console.log(error);
        smallStart.innerHTML = "no address found";
        smallEnd.innerHTML = "no address found";
        return false;
      });
    })
    .catch((error) => {
      console.log(error);
      smallStart.innerHTML = "failed to get address";
      smallEnd.innerHTML = "failed to get address";
      return false;
    });
  }

  function emptyObj(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  function postJSON(url, json, success, fail) {
    // construct an HTTP request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // send the collected data as JSON
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = function (oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(xhr.responseText);
        } else {
          fail(xhr.statusText);
        }
      }
    };
  }
