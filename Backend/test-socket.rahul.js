const { io } = require("socket.io-client");

const userId = "6a8d4dcaca8c12802ab87425";

const socket = io("http://localhost:3000", {
    query: {
        userId: userId
    }
});

socket.on("connect", () => {});

socket.on("receiveMessage", (data) => {});