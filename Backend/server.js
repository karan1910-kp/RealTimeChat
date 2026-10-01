require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const messageModel = require("./src/module/message.module");
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.set("io", io);

const onlineUsers = {};

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.log("No userId provided");
        return;
    }

    socket.join(String(userId));

    onlineUsers[String(userId)] = socket.id;

    console.log("User connected:", userId);
    console.log("Socket ID:", socket.id);

    console.log(
        "ONLINE USERS:",
        Object.keys(onlineUsers)
    );

    io.emit(
        "onlineUsers",
        Object.keys(onlineUsers)
    );


    // Send Message
socket.on("sendMessage", async (data) => {

    try {

        const newMessage =
            await messageModel.create({

                sender: userId,

                receiver: data.receiver,

                message: data.message || "",

                messageType:
                    data.messageType || "text",

                fileUrl:
                    data.fileUrl || null,

                fileName:
                    data.fileName || null,

                fileType:
                    data.fileType || null,
                replyTo: data.replyTo || null
            });


            await newMessage.populate(
    "replyTo",
    "sender message messageType fileName fileUrl"
);

        const messageData = {

            _id: newMessage._id,

            sender: userId,

            receiver: data.receiver,

            message: newMessage.message,

            messageType:
                newMessage.messageType,

            fileUrl:
                newMessage.fileUrl,

            fileName:
                newMessage.fileName,

            fileType:
                newMessage.fileType,

            replyTo: newMessage.replyTo,

            seen:
                newMessage.seen,

            createdAt:
                newMessage.createdAt
        };


        const receiverSocketId =
            onlineUsers[
                String(data.receiver)
            ];


        if (receiverSocketId) {

            io.to(receiverSocketId).emit(
                "receiveMessage",
                messageData
            );
        }


        socket.emit(
            "messageSent",
            messageData
        );


    } catch (error) {

        console.log(
            "Send Message Error:",
            error.message
        );
    }
});

    //Typing
    socket.on("typing", (receiverId) => {

    const receiverSocketId = onlineUsers[String(receiverId)];

    if (receiverSocketId) {

        io.to(receiverSocketId).emit("userTyping", {
            userId: String(userId)
        });

    }

});
 //Stop Typing 

socket.on("stopTyping", (receiverId) => {

    const receiverSocketId = onlineUsers[String(receiverId)];

    if (receiverSocketId) {

        io.to(receiverSocketId).emit("userStoppedTyping", {
            userId: String(userId)
        });

    }

});


    // Disconnect
    socket.on("disconnect", () => {

        delete onlineUsers[String(userId)];

        console.log(
            "User disconnected:",
            userId
        );

        console.log(
            "ONLINE USERS:",
            Object.keys(onlineUsers)
        );

        io.emit(
            "onlineUsers",
            Object.keys(onlineUsers)
        );

    });

});


server.listen(3000, () => {

    console.log(
        "Your Server is Running...."
    );

});