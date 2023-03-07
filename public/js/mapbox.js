const locationsData = JSON.parse(document.getElementById('map').dataset.location);


const map = L.map('map', {
  center: [31.111745, -118.113491],
  zoom: 16,
  minZoom: 3,
  worldCopyJump: true
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markerArray = [];
locationsData.forEach((loc) => {
  const reversedArr = [...loc.coordinates].reverse();

  const myIcon = L.icon({
    iconUrl: './../img/pin.png',
    iconSize: [30, 35],
    iconAnchor: [15, 35]
  });

  L.marker(reversedArr, { icon: myIcon }).addTo(map).bindPopup(`<p >Day ${loc.day}: ${loc.description}</p>`, {
    autoClose: false,
    className: 'mapPopup'
  });
  markerArray.push(reversedArr);
});
const bounds = L.latLngBounds(markerArray);
map.fitBounds(bounds);
