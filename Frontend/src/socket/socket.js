import { io } from "socket.io-client";

const connectSocket = (userId) => {

    const socket = io("http://localhost:3000", {
        query: {
            userId: userId
        }
    });

    socket.on("connect", () => {
        console.log("Socket connected!");
        console.log("Socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};

export  {connectSocket};