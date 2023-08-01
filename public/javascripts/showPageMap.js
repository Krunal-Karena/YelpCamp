const map = L.map('map').setView(crd, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        const marker = L.marker(crd).addTo(map);
        marker.bindPopup(popupText);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) { 
            this.closePopup();
        }); 