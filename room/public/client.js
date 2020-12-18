var socket = io("http://localhost:3002");

socket.on("SERVER-ROOMS-LIST", function(data){
    $("#roomList").html("");
    for(let [key, value] of data){
        $("#roomList").append("<h4 class='room'>" + key + "</h4>");
    }
});

socket.on("SERVER-ROOM-SOCKET", function(data){
    $("#currentRoom").html(data);
});

socket.on("SERVER-CHAT", function(data){
    $("#right").append("<div>" + data + "</div>");
});

$(document).ready(function(){
    $("#btnCreateRoom").click(function(){
        socket.emit("CLIENT-CREATE-ROOM", $("#txtRoom").val());
    });
    $("#btnChat").click(function(){
        socket.emit("CLIENT-CHAT", $("#txtMessage").val());
    });
});

