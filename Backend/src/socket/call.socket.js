const onlineUsers = new Map();

const callSocket = (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        // =====================================
        // VALIDATE USER
        // =====================================

        if (!userId) {
            return;
        }

        const currentUserId = String(userId);

        // =====================================
        // JOIN USER ROOM
        // =====================================

        socket.join(currentUserId);

        // Store the user's current socket ID
        onlineUsers.set(currentUserId, socket.id);

        // =====================================
        // CALL USER
        // =====================================

        socket.on("callUser", (data = {}) => {
            const receiverId = String(data.receiverId || "");

            if (!receiverId) {
                return;
            }

            // Find the receiver's active socket
            const receiverSocketId = onlineUsers.get(receiverId);

            const receiverSocket = receiverSocketId
                ? io.sockets.sockets.get(receiverSocketId)
                : null;

            // Receiver is offline or socket is disconnected
            if (!receiverSocket || !receiverSocket.connected) {
                socket.emit("userOffline", {
                    receiverId,
                    message: "User is offline"
                });

                return;
            }

            // Receiver is online: deliver the incoming call
            io.to(receiverId).emit("incomingCall", {
                callerId: currentUserId,
                callerSocketId: socket.id
            });
        });

        // =====================================
        // ACCEPT CALL
        // =====================================

        socket.on("acceptCall", (data = {}) => {
            const callerSocketId = data.callerSocketId;

            if (!callerSocketId) {
                return;
            }

            io.to(callerSocketId).emit("callAccepted");
        });

        // =====================================
        // WEBRTC OFFER
        // =====================================

        socket.on("webrtcOffer", (data = {}) => {
            const receiverId = String(data.receiverId || "");

            if (!receiverId) {
                return;
            }

            // Do not send an offer to an offline user
            const receiverSocketId = onlineUsers.get(receiverId);

            const receiverSocket = receiverSocketId
                ? io.sockets.sockets.get(receiverSocketId)
                : null;

            if (!receiverSocket || !receiverSocket.connected) {
                socket.emit("userOffline", {
                    receiverId,
                    message: "User is offline"
                });

                return;
            }

            io.to(receiverId).emit("webrtcOffer", {
                callerId: currentUserId,
                callerSocketId: socket.id,
                offer: data.offer
            });
        });

        // =====================================
        // WEBRTC ANSWER
        // =====================================

        socket.on("webrtcAnswer", (data = {}) => {
            const callerSocketId = data.callerSocketId;

            if (!callerSocketId) {
                return;
            }

            io.to(callerSocketId).emit("webrtcAnswer", {
                answer: data.answer
            });
        });

        // =====================================
        // ICE CANDIDATE
        // =====================================

        socket.on("iceCandidate", (data = {}) => {
            const receiverId = String(data.receiverId || "");

            if (!receiverId) {
                return;
            }

            io.to(receiverId).emit("iceCandidate", {
                candidate: data.candidate
            });
        });

        // =====================================
        // REJECT CALL
        // =====================================

        socket.on("rejectCall", (data = {}) => {
            const callerSocketId = data.callerSocketId;

            if (!callerSocketId) {
                return;
            }

            io.to(callerSocketId).emit("callRejected");
        });

        // =====================================
        // CANCEL CALL
        // =====================================

        socket.on("cancelCall", (data = {}) => {
            const receiverId = String(data.receiverId || "");

            if (!receiverId) {
                return;
            }

            io.to(receiverId).emit("callCancelled", {
                callerId: currentUserId
            });
        });

        // =====================================
        // END CALL
        // =====================================

        socket.on("endCall", (data = {}) => {
            const receiverId = String(data.receiverId || "");

            if (!receiverId) {
                return;
            }

            io.to(receiverId).emit("callEnded");
        });

        // =====================================
        // HANDLE DISCONNECT
        // =====================================

        socket.on("disconnect", () => {
            const connectedSocketId = onlineUsers.get(currentUserId);

            // Avoid removing a newer connection for the same user
            if (connectedSocketId === socket.id) {
                onlineUsers.delete(currentUserId);
            }
        });
    });
};

module.exports = callSocket;