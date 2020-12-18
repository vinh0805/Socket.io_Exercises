var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

var users = [];

server.listen(3001);

io.on("connection", function(socket){
    console.log("Someone connected: " + socket.id);

    socket.on("CLIENT-SEND-USERNAME", function(data){
        console.log(data);
        if (users.indexOf(data) >= 0) {
            // fail, someone used this name before
            socket.emit("LOGIN-FAILED");
        } else {
            // success, can use this name
            users.push(data);
            socket.userName = data;
            socket.emit("LOGIN-SUCCESSFULLY", data);
            io.sockets.emit("USERS-LIST", users);
        }
    });

    socket.on("TYPING", function(){
        socket.broadcast.emit("TYPING-NOTIFICATION", socket.userName);
    });

    socket.on("STOP-TYPING", function(){
        socket.broadcast.emit("STOP-TYPING-NOTIFICATION");
    });

    socket.on("USER-SEND-MESSAGE", function(data){
        io.sockets.emit("SERVER-SEND-MESSAGE", {name:socket.userName, content:data});
    });

    socket.on("LOGOUT", function(){
        users.splice(users.indexOf(socket.userName), 1);
        socket.broadcast.emit("USERS-LIST", users);
    });
});

app.get("/", function(req, res){
    res.render("home");
});