const express = require("express");
const app = express();

//requiring http for server creation as socket works on http
const http = require("http");

//requiring socket.io
const socketio = require("socket.io");
const path = require("path");

//creating a server
const server = http.createServer(app);

const io = socketio(server);

//establishing a connection
io.on("connection", function(socket) {
    console.log("connected");

    socket.on("send-location", function(data) {
        io.emit("receive-location", {
            id: socket.id,
            ...data
        });
    });

    socket.on("user-disconnected",(id)=>{
        if(marker[id]){
            map.removelayer(markers[id]);
            delete markers[id];
        }
    })
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3001, function() {
    console.log("Server running on port 3001");
});
