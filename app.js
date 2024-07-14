const express = require("express")
const app = express();

//requiring http for server creation as socket works on http
const http = require("http")

//requring socket.io
const socketio = require("socket.io") 
const path = require("path")

//creating a server
const server = http.createServer(app);

const io = socketio(server);

//establishing a connection
io.on("connection",function(socket){
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data});
    });
    console.log("connected")

    //handle the diconnection

    socket.on("disconnect" , ()=>{
        io.emit("user-disconnected",socket.id);
    })
})

app.set('views', path.join(__dirname, ' '))
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get("/",function(req,res){
    res.render("index");
}
)


app.listen(3000);