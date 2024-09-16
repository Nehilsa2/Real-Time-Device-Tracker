const socket = io();


//check if geolocation is available in the navigator or the brower supports the geoloaction or not
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        //take out the coordinates of the position
        const{latitude,longitude} = position.coords;

         //emmiting an event from the frontend

      socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error("error");
    },
    {
        enableHighAccuracy:true,
        timeout:5000,  //updating the location after every 5 secs
        maximumAge:0
    }
)
}

const map= L.map('map').setView([0, 0], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {}

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude} = data;
    map.setView([latitude,longitude],16);


    //check if the marker is already present and if marker is present just update the position of the marker 
    if(markers[id]){
        markers[id]= setLatLang([latitude,longitude]);
    }
    //if marker is not present add the marker
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})