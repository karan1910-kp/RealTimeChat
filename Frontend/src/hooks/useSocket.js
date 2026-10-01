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


            newSocket.disconnect();


            setSocket(null);

        };

    }, [user]);


    return socket;

}


export default useSocket;