var socket = io("http://localhost:3001");

socket.on("LOGIN-FAILED", function(){
    alert("Cannot login (this name is used by another people)");
})

socket.on("LOGIN-SUCCESSFULLY", function(data){
    $("currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
});

socket.on("USERS-LIST", function(data){
    $("#boxContent").html("");
    data.forEach(function(i){
        $("#boxContent").append("<div class='user'>" + i + "</div>");
    });
});

socket.on("TYPING-NOTIFICATION", function(data){
    $("#typingNotification").html(data + " is typing...");
});
socket.on("STOP-TYPING-NOTIFICATION", function(){
    $("#typingNotification").html("");
});

socket.on("SERVER-SEND-MESSAGE", function(data){
    $("#listMessages").append("<div class='messages'>" + data.name + ": " + data.content +"</div>");
});

$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();

    // Login
    $("#btnRegister").click(function(){
        socket.emit("CLIENT-SEND-USERNAME", $("#txtUserName").val());
    });

    // Logout
    $("#btnLogout").click(function(){
        socket.emit("LOGOUT");
        $("#chatForm").hide(1000);    
        $("#loginForm").show(500);
    });

    // Typing
    $("#txtMessage").focusin(function(){
        socket.emit("TYPING");
    });
    $("#txtMessage").focusout(function(){
        socket.emit("STOP-TYPING");
    });
    
    // Send messages
    $("#btnSendMessage").click(function(){
        socket.emit("USER-SEND-MESSAGE", $("#txtMessage").val());
        $("#txtMessage").val("");
    });
});

