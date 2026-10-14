import {
    useEffect,
    useRef,
    useState
} from "react";

import { connectSocket } from "../socket/socket";


function useSocket(user, handlers = {}) {

    const [socket, setSocket] = useState(null);


    // Store latest handlers
    const handlersRef = useRef(handlers);


    // Update handlers whenever Chat.jsx gives us new functions
    useEffect(() => {

        handlersRef.current = handlers;

    }, [handlers]);


    // Connect socket
    useEffect(() => {

        if (!user) {

            setSocket(null);

            return;

        }


        // IMPORTANT:
        // MongoDB user ID is stored in "_id", not "id"

        const newSocket =
            connectSocket(user._id);


        setSocket(newSocket);


        // =====================================
        // RECEIVE MESSAGE
        // =====================================

        const receiveMessage = (data) => {

            if (
                handlersRef.current.receiveMessage
            ) {

                handlersRef.current.receiveMessage(
                    data
                );

            }

        };


        // =====================================
        // MESSAGE SENT
        // =====================================

        const messageSent = (data) => {

            if (
                handlersRef.current.messageSent
            ) {

                handlersRef.current.messageSent(
                    data
                );

            }

        };


        // =====================================
        // MESSAGES SEEN
        // =====================================

        const messagesSeen = (data) => {

            if (
                handlersRef.current.messagesSeen
            ) {

                handlersRef.current.messagesSeen(
                    data
                );

            }

        };


        // =====================================
        // ONLINE USERS
        // =====================================

        const onlineUsers = (data) => {

            if (
                handlersRef.current.onlineUsers
            ) {

                handlersRef.current.onlineUsers(
                    data
                );

            }

        };


        // =====================================
        // USER TYPING
        // =====================================

        const userTyping = (data) => {

            if (
                handlersRef.current.userTyping
            ) {

                handlersRef.current.userTyping(
                    data
                );

            }

        };


        // =====================================
        // USER STOPPED TYPING
        // =====================================

        const userStoppedTyping = (data) => {

            if (
                handlersRef.current.userStoppedTyping
            ) {

                handlersRef.current.userStoppedTyping(
                    data
                );

            }

        };


        // =====================================
        // CLEAR CHAT
        // =====================================

        const chatCleared = (data) => {

            if (
                handlersRef.current.chatCleared
            ) {

                handlersRef.current.chatCleared(
                    data
                );

            }

        };


        // =====================================
        // SINGLE MESSAGE DELETE
        // =====================================

        const messageDeleted = (data) => {

            if (
                handlersRef.current.messageDeleted
            ) {

                handlersRef.current.messageDeleted(
                    data
                );

            }

        };


        // =====================================
        // WEBRTC OFFER
        // =====================================

        const webrtcOffer = (data) => {

            if (
                handlersRef.current.webrtcOffer
            ) {

                handlersRef.current.webrtcOffer(
                    data
                );

            }

        };


        // =====================================
        // WEBRTC ANSWER
        // =====================================

        const webrtcAnswer = (data) => {

            if (
                handlersRef.current.webrtcAnswer
            ) {

                handlersRef.current.webrtcAnswer(
                    data
                );

            }

        };


        // =====================================
        // WEBRTC ICE CANDIDATE
        // =====================================

        const iceCandidate = (data) => {

            if (
                handlersRef.current.iceCandidate
            ) {

                handlersRef.current.iceCandidate(
                    data
                );

            }

        };


        // =====================================
        // INCOMING CALL
        // =====================================

        const incomingCall = (data) => {

            if (
                handlersRef.current.incomingCall
            ) {

                handlersRef.current.incomingCall(
                    data
                );

            }

        };
        //////////////////////////////////
        //Call rejected
        //////////////////////////////////
const callRejected = () => {

    if (handlersRef.current.callRejected) {

        handlersRef.current.callRejected();

    }

};
///////////////////////////////////////
///Call cancelled
///////////////////////////////////////

const callCancelled = (data) => {

    if (handlersRef.current.callCancelled) {

        handlersRef.current.callCancelled(data);

    }

};


const callEnded = () => {

    if (handlersRef.current.callEnded) {

        handlersRef.current.callEnded();

    }

};

const callAccepted = () => {

    if (
        handlersRef.current.callAccepted
    ) {

        handlersRef.current.callAccepted();

    }

};

// =========================
// USER OFFLINE
// =========================

const userOffline = (data) => {
    if (handlersRef.current.userOffline) {
        handlersRef.current.userOffline(data);
    } else {
        console.error("userOffline handler is missing in Chat.jsx");
    }
};

        // =====================================
        // ADD SOCKET LISTENERS
        // =====================================

        newSocket.on(
            "receiveMessage",
            receiveMessage
        );


        newSocket.on(
            "messageSent",
            messageSent
        );


        newSocket.on(
            "messagesSeen",
            messagesSeen
        );


        newSocket.on(
            "onlineUsers",
            onlineUsers
        );


        newSocket.on(
            "userTyping",
            userTyping
        );


        newSocket.on(
            "userStoppedTyping",
            userStoppedTyping
        );


        newSocket.on(
            "chatCleared",
            chatCleared
        );


        newSocket.on(
            "messageDeleted",
            messageDeleted
        );


        // =====================================
        // WEBRTC OFFER LISTENER
        // =====================================

        newSocket.on(
            "webrtcOffer",
            webrtcOffer
        );


        // =====================================
        // WEBRTC ANSWER LISTENER
        // =====================================

        newSocket.on(
            "webrtcAnswer",
            webrtcAnswer
        );


        // =====================================
        // WEBRTC ICE LISTENER
        // =====================================

        newSocket.on(
            "iceCandidate",
            iceCandidate
        );


        // =====================================
        // INCOMING CALL LISTENER
        // =====================================

        newSocket.on(
            "incomingCall",
            incomingCall
        );
        newSocket.on(
    "callRejected",
    callRejected
);

newSocket.on(
    "callCancelled",
    callCancelled
);

newSocket.on(
    "callEnded",
    callEnded
);

newSocket.on(
    "callAccepted",
    callAccepted
);
newSocket.on(
    "userOffline",
    userOffline
);
        // =====================================
        // CLEANUP
        // =====================================

        return () => {

            newSocket.off(
                "receiveMessage",
                receiveMessage
            );


            newSocket.off(
                "messageSent",
                messageSent
            );


            newSocket.off(
                "messagesSeen",
                messagesSeen
            );


            newSocket.off(
                "onlineUsers",
                onlineUsers
            );


            newSocket.off(
                "userTyping",
                userTyping
            );


            newSocket.off(
                "userStoppedTyping",
                userStoppedTyping
            );


            newSocket.off(
                "chatCleared",
                chatCleared
            );


            newSocket.off(
                "messageDeleted",
                messageDeleted
            );


            newSocket.off(
                "webrtcOffer",
                webrtcOffer
            );


            newSocket.off(
                "webrtcAnswer",
                webrtcAnswer
            );


            newSocket.off(
                "iceCandidate",
                iceCandidate
            );


            newSocket.off(
                "incomingCall",
                incomingCall
            );
            newSocket.off(
    "callRejected",
    callRejected
);
newSocket.off(
    "callCancelled",
    callCancelled
);
newSocket.off(
    "callEnded",
    callEnded
);
newSocket.off(
    "callAccepted",
    callAccepted
);
newSocket.off(
    "userOffline",
    userOffline
);
            newSocket.disconnect();


            setSocket(null);

        };

    }, [user]);


    return socket;

}


export default useSocket;