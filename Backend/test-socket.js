const { io } = require("socket.io-client");

const userId = "6a88ee1409c5ac69cc70502a";

const socket = io("http://localhost:3000", {
    query: {
        userId: userId
    }
});

socket.on("connect", () => {

    console.log("Connected to server!");
    console.log("My socket ID:", socket.id);

    socket.emit("sendMessage", {
        receiver: "6a8d4dcaca8c12802ab87425",
        message: "Hello Shivam!"
    });

});

socket.on("receiveMessage", (data) => {
    console.log("New message received:", data);
});