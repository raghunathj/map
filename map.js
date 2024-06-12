const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    maxZoom: 10,
    minZoom: 1,
    zoomControl: false,
    attributionControl: false,
    dragging: false,       
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false   
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
}).addTo(map);

const markersData = [
    { latLng: [40.7128, -74.006], info: 'United States', size: 500000, id: 'marker-0' },
    { latLng: [48.8566, 2.3522], info: 'Europe and Central Asia', size: 700000, id: 'marker-1' },
    { latLng: [35.6895, 139.6917], info: 'Asia Pacific', size: 600000, id: 'marker-2' },
    { latLng: [-23.5505, -46.6333], info: 'Latin America and the Caribbean', size: 400000, id: 'marker-3' },
    { latLng: [0, 25], info: 'Africa', size: 800000, id: 'marker-4' },
    { latLng: [25, 45], info: 'Middle East and North Africa', size: 450000, id: 'marker-5' }
];

const elements = [];

function handleMarkerInteraction(marker, labelMarker, line) {
    marker.on('mouseover', () => {
        elements.forEach(el => {
            if (el.marker !== marker) {
                el.marker.getElement().classList.add('fade');
                el.label.getElement().classList.add('fade');
                el.line.getElement().classList.add('fade');
            }
        });
    });

    marker.on('mouseout', () => {
        elements.forEach(el => {
            el.marker.getElement().classList.remove('fade');
            el.label.getElement().classList.remove('fade');
            el.line.getElement().classList.remove('fade');
        });
    });

    marker.on('click', () => {
        map.flyTo(marker.getLatLng(), 3, {
            animate: true,
            duration: 1
        });
        document.getElementById('sidebar').innerHTML = `<h3>${marker.options.info}</h3>`;
        document.getElementById('sidebar').style.display = 'block';
        elements.forEach(el => {
            if (el.marker !== marker) {
                el.marker.getElement().classList.add('fade');
                el.label.getElement().classList.add('fade');
                el.line.getElement().classList.add('fade');
            } else {
                el.marker.getElement().classList.remove('fade');
                el.label.getElement().classList.remove('fade');
                el.line.getElement().classList.remove('fade');
            }
        });
    });

    labelMarker.on('click', () => {
        marker.fire('click');
    });
}

markersData.forEach((markerData, index) => {
    const marker = L.circle(markerData.latLng, {
        color: 'green',
        fillColor: '#28a745',
        fillOpacity: 0.5,
        radius: markerData.size,
        info: markerData.info
    }).addTo(map);

    const labelLatLng = [markerData.latLng[0] - 10, markerData.latLng[1]];

    const markerLine = L.polyline([markerData.latLng, labelLatLng], {
        color: 'black',
        weight: 2,
        className: 'line'
    }).addTo(map);

    const markerLabel = L.divIcon({
        className: 'label',
        html: markerData.info,
        iconSize: [100, 40],
        iconAnchor: [50, 0]
    });

    const labelMarker = L.marker(labelLatLng, {
        icon: markerLabel
    }).addTo(map);

    handleMarkerInteraction(marker, labelMarker, markerLine);

    elements.push({ marker, label: labelMarker, line: markerLine });
});

function highlightMarker(index) {
    const markerData = markersData[index];
    const marker = elements[index].marker;
    marker.fire('click');
}
