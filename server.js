var express = require("express");
var fs = require("fs");
const waterdata = require("./100066nachdatum2.json")
var timer = setInterval(toggleSomething, 1000);
//console.log(waterdata)
// fs.readFile("100066nachdatum.json",(err,data)=>{
//     if(err){
//         console.error(err)
//     }
//  let d = JSON.parse(data);
//  console.log(d)

// } )
var socket = require("socket.io");
var app = express();

var server = app.listen(3000);
var io = socket(server);
io.sockets.on("connection", (socket)=>{
  socket.on("altePartikelSta",(data)=>{
    console.log(data)
    io.sockets.emit("checkScreen",data)
  })
  toggleSomething()

  
});
function newConnection(socket) {
  console.log("hallo", socket.id);
//   socket.on("Taste", tastefunc);
toggleSomething()
//oldparticlesSta()  

oldparticlesBir()
}
app.use("/birs", express.static(__dirname + "/birs"));
app.use("/alban", express.static(__dirname + "/alban"));

console.log("server is running");

io.sockets.on("altePartikelSta", (d) => {
  console.log(d);
})

function randRange(data) {
    var newTime = data[Math.floor(data.length * Math.random())];
    return newTime;
}

function toggleSomething() {
  var timeArray = new Array(1000, 500, 2000, 3500, 5500);

  // do stuff, happens to use jQuery here (nothing else does)
 
  io.sockets.emit(
    "newdatapoint",
    waterdata[Math.floor(Math.random() * waterdata.length)].fields
  );
  clearInterval(timer);
  timer = setInterval(toggleSomething, randRange(timeArray));
}

function oldparticlesSta(){
 
}
function oldparticlesBir(){
  io.sockets.on("altePartikelBir", (d) => {
      console.log(d);
  })
}
