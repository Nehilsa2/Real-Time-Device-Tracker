
// app.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const geoip = require('geoip-lite'); 
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    try {
        // Read user data from JSON file
        const jsonData = fs.readFileSync('users.json'); // Replace 'users.json' with your file name
        const users = JSON.parse(jsonData);

        // Get location data for each user and emit to all clients
        users.forEach(user => {
            const ipAddress = user.ipAddress; 
            const geo = geoip.lookup(ipAddress);

            if (geo) {
                const { ll: [latitude, longitude] } = geo;
                io.emit('receive-location', {
                    id: user.userId, // Assuming your JSON has a userId field
                    latitude,
                    longitude
                });
            } else {
                console.log(`Unable to determine location for user ${user.userId} with IP ${ipAddress}`);
            }
        });

    } catch (error) {
        console.error('Error reading user data or fetching location:', error);
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});