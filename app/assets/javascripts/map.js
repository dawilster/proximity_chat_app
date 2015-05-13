var map = null;

$(document).ready(function () {
  google.maps.event.addDomListener(window, 'load', initialize);
});

function initialize() {
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(-33, 151)
  }

  this.map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);
}

function addAvatar(lat, lng){
  var image = 'assets/avatar.png';
  var myLatLng = new google.maps.LatLng(lat, lng);
  var beachMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image
  });
}

function updateCenterLocation(lat, lng){
  map.setCenter({lat: lat, lng: lng});
  map.setZoom(17);
}