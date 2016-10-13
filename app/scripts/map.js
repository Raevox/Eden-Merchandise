global.GoogleMapsLoader = require('google-maps');

const GoogleMapsLoader = global.GoogleMapsLoader;

function renderMap() {
  const tiyCincy = {
    lat: 39.1053073,
    lng: -84.5121242
  };

  GoogleMapsLoader.load(google => {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: tiyCincy,
      zoom: 15,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      scrollwheel: false
    });

    new google.maps.Marker({
      position: tiyCincy,
      map
    });
  });
}

function initMap() {
  GoogleMapsLoader.KEY = 'AIzaSyBZjNKYJzp1VU407Gah8uOUVHZjC7jLX1U';
  renderMap();
}

$(document).ready(initMap);
