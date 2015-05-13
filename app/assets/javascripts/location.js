function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
  updateCenterLocation(position.coords.latitude, position.coords.longitude);
  createUser(position.coords);
  fetchUserChannels(position.coords.latitude, position.coords.longitude);
}