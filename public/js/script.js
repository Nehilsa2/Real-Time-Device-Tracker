
// script.js (client-side)
const socket = io();
const map = L.map('map').setView([0, 0], 2); // Initial zoom level set to 2

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Object to store user markers
const markers = {};

socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        // Update marker position if it already exists
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker if it doesn't exist
        markers[id] = L.marker([latitude, longitude]).addTo(map);

        // Add a popup with the user ID that opens on click
        markers[id].bindPopup(`User ID: ${id}`).openPopup();
    }

    // Optionally, you can show the ID as a tooltip that displays on hover
    markers[id].bindTooltip(`User ID: ${id}`, { permanent: true, direction: "right" });
});
