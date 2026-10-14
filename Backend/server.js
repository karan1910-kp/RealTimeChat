require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const chatSocket =require("./src/socket/chat.socket");
const callSocket =require("./src/socket/call.socket");


connectToDB();


const server =
    http.createServer(app);


const io = new Server(server, {

    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

});


app.set("io", io);


// Start Chat Socket and call socket
chatSocket(io);
callSocket(io);


server.listen(3000, () => {});