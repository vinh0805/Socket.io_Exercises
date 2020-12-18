var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

io.on("connection", function(socket){

  console.log("Someone connected:" + socket.id);

  socket.on("CLIENT-SEND-COLOR", function(data){
    console.log(socket.id + " has click " + data + " button.");
    io.sockets.emit("SERVER-SEND-COLOR", data);
  })
});


app.get("/", function(req, res){
  res.render("home");
});
