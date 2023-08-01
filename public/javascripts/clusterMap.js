const map = L.map('cluster-map').setView([36.7127281, -103.7060152], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
const markers = L.markerClusterGroup();
for (let campground of campgrounds) {
    const popupText="<a href=/campgrounds/"+campground._id+">"+campground.title+"</a><p>"+campground.location+"</p>";
    const marker = L.marker(campground.geometry.coordinates);
    markers.addLayer(marker);
    marker.bindPopup(popupText);
}

map.addLayer(markers);