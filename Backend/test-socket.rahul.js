const { io } = require("socket.io-client");

const userId = "6a8d4dcaca8c12802ab87425";

const socket = io("http://localhost:3000", {
    query: {
        userId: userId
    }
});

socket.on("connect", () => {
    console.log("Rahul connected:", socket.id);
});

socket.on("receiveMessage", (data) => {
    console.log("Rahul received:", data);
});