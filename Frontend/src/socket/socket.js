import { io } from "socket.io-client";

const connectSocket = (userId) => {

    const socket = io("http://localhost:3000", {
        query: {
            userId: userId
        }
    });

    socket.on("connect", () => {});

    socket.on("disconnect", () => {});

    return socket;
};

export  {connectSocket};