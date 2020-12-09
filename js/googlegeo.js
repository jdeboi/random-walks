var placeSearch, autocompleteStart, autocompleteEnd;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocompleteStart = new google.maps.places.Autocomplete(
    document.getElementById('autocompleteStart'), {types: ['geocode']}
  );

  autocompleteEnd = new google.maps.places.Autocomplete(
    document.getElementById('autocompleteEnd'), {types: ['geocode']}
  );

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocompleteStart.setFields(['address_component']);
  autocompleteEnd.setFields(['address_component']);

  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocompleteStart.addListener('place_changed', fillInAddressStart);
  autocompleteEnd.addListener('place_changed', fillInAddressEnd);
}

function fillInAddressStart() {
  // Get the place details from the autocomplete object.
  var place = autocompleteStart.getPlace();
  submitAddressFromGoogle(place);
}

function fillInAddressEnd() {
  // Get the place details from the autocomplete object.
  var place = autocompleteEnd.getPlace();
  submitAddressFromGoogle(place);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle(
        {center: geolocation, radius: position.coords.accuracy});
        autocompleteStart.setBounds(circle.getBounds());
      });
    }
  }
