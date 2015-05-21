var map = null;
var activeUuids = [];

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

function addAvatar(id, name, lat, lng){
  if(activeUuids.indexOf(id.toString()) == -1){
    activeUuids.push(id.toString());
    var image = 'assets/avatar.png';
    var myLatLng = new google.maps.LatLng(lat, lng);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        title: name
    });

    var infowindow = new google.maps.InfoWindow({
        content: name
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }
}

function updateCenterLocation(lat, lng){
  map.setCenter({lat: lat, lng: lng});
  map.setZoom(20);
}