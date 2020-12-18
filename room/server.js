var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3002);

io.on("connection", function(socket){
    roomList = [];
    console.log("Someone connected: " + socket.id);
    console.log(socket.adapter.rooms);

    socket.on("CLIENT-CREATE-ROOM", function(data){
        socket.join(data);
        socket.roomName = data;
        console.log(socket.adapter.rooms);
        for(r of socket.adapter.rooms){
            roomList.push(r);
        }
        io.sockets.emit("SERVER-ROOMS-LIST", roomList);
        socket.emit("SERVER-ROOM-SOCKET", data);
    });

    socket.on("CLIENT-CHAT", function(data){
        io.sockets.in(socket.roomName).emit("SERVER-CHAT", data);
    });
});

app.get("/", function(req, res){
    res.render("home");
});