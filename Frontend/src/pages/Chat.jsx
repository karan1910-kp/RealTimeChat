import {
    useContext,
    useRef,
    useEffect,
    useLayoutEffect,
    useState,
    useCallback
} from "react";


    import {
    Search,
    MessageCircle,
    UserRound,
    House,
    UsersRound,
    Camera,
    LogOut,
    Trash2,
    ArrowLeft,
    Mail,
    Pencil,
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    ShieldCheck,
    LockKeyhole,
    ContactRound
} from "lucide-react";

import { useNavigate} from "react-router-dom";
import { clearChat } from "../services/message.service";

import useWebRTC from "../hooks/useWebRTC";
import UserList from "../components/UserList";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import useSocket from "../hooks/useSocket";
import DeleteAccountModal from "../components/deleteAccountModal";
import "./ChatProfile.css";
import EditProfileModal from "../components/EditProfileModal";

import {
    getUsers,
    updateProfile
} from "../services/user.service";

import {
    getConversations,
    getMessages,
    markMessagesAsSeen,
    getUnreadMessages,
    deleteMessage
} from "../services/message.service";

import { AuthContext } from "../context/ContextAuth";

import {
    deleteAccount,
    verifyPassword
} from "../services/auth.service";


function Chat() {

    const {
        user,
        token,
        setUser,
        logoutUser
    } = useContext(AuthContext);

    const {
    createConnection,
    peerConnectionRef,
    getLocalStream,
    localStreamRef,
    toggleMicrophone,
    toggleCamera
} = useWebRTC();
    const navigate = useNavigate();


    // =========================================
    // STATES
    // =========================================

    const [mobileChatOpen, setMobileChatOpen] = useState(false);

    const [mobileTab, setMobileTab] = useState("home");

    const [users, setUsers] = useState([]);

    const [lastMessages, setLastMessages] = useState({});

    const [selectedUser, setSelectedUser] = useState(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const [unreadMessages, setUnreadMessages] = useState({});

    const [message, setMessage] = useState("");

    const [replyingTo, setReplyingTo] = useState(null);

    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState([]);

    const [search, setSearch] = useState("");

    const [remoteStream, setRemoteStream] = useState(null);

    const [incomingCall, setIncomingCall] =useState(null);

    const [isCalling, setIsCalling] =useState(false);

    const [isCallActive, setIsCallActive] =useState(false);

    const [showVideoCall, setShowVideoCall] = useState(false);

    const [callStatusMessage, setCallStatusMessage] = useState("");

    const [isReceiverOffline, setIsReceiverOffline] = useState(false);

    const [callDuration, setCallDuration] = useState(0);

    const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

    const [isCameraOn, setIsCameraOn] = useState(true);



    useEffect(() => {}, [
    isCalling,
    isCallActive
]);

useEffect(() => {
    if (!isCallActive) {
        return;
    }

    const timer = setInterval(() => {
        setCallDuration((previousDuration) => previousDuration + 1);
    }, 1000);

    return () => clearInterval(timer);
}, [isCallActive]);

const formatCallDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
};

    // =========================================
    // PROFILE MODALS
    // =========================================

    const [
        showDeleteAccountModal,
        setShowDeleteAccountModal
    ] = useState(false);

    const [
        showEditProfileModal,
        setShowEditProfileModal
    ] = useState(false);


    // =========================================
    // REFS
    // =========================================

    const messagesEndRef = useRef(null);

    const typingTimeoutRef = useRef(null);

    const localVideoRef = useRef(null);

    const remoteVideoRef = useRef(null);

    const socketRef = useRef(null);

    const callTimeoutRef = useRef(null);

    const callStatusTimeoutRef = useRef(null);

    const iceCandidatesQueueRef = useRef([]);
    // =========================================
// WEBRTC - LOCAL CAMERA
// =========================================

// =========================================
// CLEAR CALL TIMEOUT
// =========================================

const clearCallTimeout = () => {
    if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
    }
};
const startCamera = async () => {

    try {

        const stream =
            await getLocalStream();

        if (localVideoRef.current) {

            localVideoRef.current.srcObject =
                stream;

        }

    } catch (error) {}

};
// =========================================
// WEBRTC - START CALL
// =========================================

const startCall = () => {

    try {
        // Prevent multiple calls
        if (isCalling || isCallActive) {
            return;
        }

        if (!selectedUser) {

            alert("Please select a user");

            return;
        }

        const socket =
            socketRef.current;

        if (!socket) {

            alert("Socket is not connected");

            return;
        }
        clearCallTimeout();
        setCallDuration(0);
        setIsReceiverOffline(false);
        setCallStatusMessage("");
        setIsCalling(true);
        setShowVideoCall(true);

        // Send call notification
        socket.emit(
            "callUser",
            {
                receiverId:
                    String(
                        selectedUser._id
                    )
            }
        );
        // =========================================
        // 30-SECOND NO-ANSWER TIMEOUT
        // =========================================

        callTimeoutRef.current = setTimeout(() => {
            // Notify receiver to close the incoming-call popup.
            socket.emit("cancelCall", {
                receiverId: String(selectedUser._id)
            });

            // Close caller's call UI and clean up resources.
            cleanupCall();

            // Display the timeout message after cleanup.
            setCallStatusMessage("No answer. Please try again.");
        }, 30000);
    } catch (error) {}

};

/////////////////////////////////////////////
// HANDLE REMOTE STREAM
/////////////////////////////////////////////

const handleRemoteStream = useCallback(
    (event) => {
        const stream =
            event.streams[0];

        if (!stream) {
            return;
        }

        // Store stream in React state
        setRemoteStream(stream);
    },
    []
);

useEffect(() => {

    if (
        remoteVideoRef.current &&
        remoteStream
    ) {
        remoteVideoRef.current.srcObject =
            remoteStream;
    }

}, [remoteStream]);
// =========================================
// WEBRTC - PROCESS QUEUED ICE
// =========================================

const processICECandidates =
    useCallback(
        async (peerConnection) => {

            const candidates =
                iceCandidatesQueueRef.current;

            for (
                const candidate
                of candidates
            ) {

                try {
                    await peerConnection.addIceCandidate(
                        candidate
                    );
                } catch (error) {}

            }

            iceCandidatesQueueRef.current = [];

        },
        []
    );
// =========================================
// WEBRTC - RECEIVE OFFER
// =========================================

const handleWebRTCOffer = useCallback(
    async (data) => {

        try {
            const socket =
                socketRef.current;

            if (!socket) {
                return;
            }

            // Create peer connection
            const peerConnection =
                await createConnection();

            // Show local camera
            if (localVideoRef.current) {

                localVideoRef.current.srcObject =
                    localStreamRef.current;

            }
            setCallDuration(0);
            setIsCallActive(true);
            // Remote stream
            peerConnection.ontrack =
                handleRemoteStream;

            // ICE Candidate
            peerConnection.onicecandidate =
                (event) => {

                    if (!event.candidate) {
                        return;
                    }

                    socket.emit(
                        "iceCandidate",
                        {
                            receiverId:
                                String(
                                    data.callerId
                                ),

                            candidate:
                                event.candidate
                        }
                    );

                };

            // Set caller offer
            await peerConnection.setRemoteDescription(
    new RTCSessionDescription(
        data.offer
    )
);

            // Process ICE candidates
            await processICECandidates(
                peerConnection
            );

            // Create answer
            const answer =
                await peerConnection.createAnswer();

            // Set local description
            await peerConnection.setLocalDescription(
                answer
            );

            // Send answer
            socket.emit(
                "webrtcAnswer",
                {
                    callerSocketId:
                        data.callerSocketId,

                    answer:
                        answer
                }
            );

            setIsCallActive(true);
        } catch (error) {}

    },
    [
        createConnection,
        handleRemoteStream,
        processICECandidates
    ]
);
// =========================================
// WEBRTC - RECEIVE ANSWER
// =========================================

const handleWebRTCAnswer = useCallback(
    async (data) => {

        try {
            const peerConnection =
                peerConnectionRef.current;


            if (!peerConnection) {
                return;
            }


            await peerConnection.setRemoteDescription(
    new RTCSessionDescription(
        data.answer
    )
);

            // Call has been accepted
            setIsCalling(false);
            setIsCallActive(true);
            await processICECandidates(
                peerConnection
            );
        } catch (error) {}

    },
    [
    peerConnectionRef,
    processICECandidates
]
);
// =========================================
// WEBRTC - RECEIVE ICE CANDIDATE
// =========================================

const handleICECandidate = useCallback(
    async (data) => {

        try {
            const peerConnection =
                peerConnectionRef.current;

            if (!peerConnection) {
                return;
            }

            const candidate =
                new RTCIceCandidate(
                    data.candidate
                );

            // Remote description is not ready yet
            if (
                !peerConnection.remoteDescription
            ) {
                iceCandidatesQueueRef.current.push(
                    candidate
                );

                return;
            }

            await peerConnection.addIceCandidate(
                candidate
            );
        } catch (error) {}

    },
    []
);
/////////////////////////////////////////
//Offiline user for videocall
/////////////////////////////////////////
const handleUserOffline = useCallback((data) => {
    setIsReceiverOffline(true);
    setIsCalling(true);
    setShowVideoCall(true);
}, []);
// =========================================
// MICROPHONE - MUTE / UNMUTE
// =========================================

const handleToggleMicrophone = () => {
    const microphoneEnabled = toggleMicrophone();

    if (microphoneEnabled === null) {
        return;
    }

    setIsMicrophoneOn(microphoneEnabled);
};

const handleToggleCamera = () => {
    const cameraEnabled = toggleCamera();

    if (cameraEnabled !== null) {
        setIsCameraOn(cameraEnabled);
    }
};

// =========================================
// CLEANUP CALL
// =========================================

const cleanupCall = useCallback(() => {
    // Stop camera and microphone
    if (localStreamRef.current) {

        localStreamRef.current
            .getTracks()
            .forEach((track) => {

                track.stop();

            });

        localStreamRef.current = null;
    }

    // Close WebRTC connection
    if (peerConnectionRef.current) {

        peerConnectionRef.current.close();

        peerConnectionRef.current = null;
    }

    // Remove local video
    if (localVideoRef.current) {

        localVideoRef.current.srcObject =
            null;
    }

    // Remove remote video
    if (remoteVideoRef.current) {

        remoteVideoRef.current.srcObject =
            null;
    }

    // Clear remote stream
    setRemoteStream(null);

    // Clear call states
    // Clear call states
    setIsCalling(false);
    setIsCallActive(false);
    setIncomingCall(null);

    setCallDuration(0);  // Reset timer
    setIsMicrophoneOn(true);
    setIsCameraOn(true);
    setShowVideoCall(false);
    setIsReceiverOffline(false);
    setCallStatusMessage("");
    // Clear ICE queue
    iceCandidatesQueueRef.current = [];
}, []);
    // =========================================
    // AUTO SCROLL
    // =========================================

    useLayoutEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "auto"
        });

    }, [messages, isTyping]);


    // =========================================
    // LOAD MESSAGES
    // =========================================

    const loadMessages = useCallback(
        async (userId) => {

            try {

                const response =
                    await getMessages(
                        token,
                        userId
                    );

                setMessages(
                    response.messages
                );

            } catch (error) {}

        },
        [token]
    );


    // =========================================
    // MARK SEEN
    // =========================================

    const markSeen = useCallback(
        async (userId) => {

            try {

                await markMessagesAsSeen(
                    token,
                    userId
                );

            } catch (error) {}

        },
        [token]
    );


    // =========================================
    // RECEIVE MESSAGE
    // =========================================

    const receiveMessage = useCallback(
        (data) => {

            const senderId =
                String(data.sender);

            const isCurrentChat =
                selectedUser &&
                String(selectedUser._id) ===
                senderId;


            // UPDATE LAST MESSAGE

            setLastMessages(
                (previous) => ({

                    ...previous,

                    [senderId]: {

                        message:
                            data.message,

                        messageType:
                            data.messageType,

                        fileName:
                            data.fileName,

                        createdAt:
                            data.createdAt

                    }

                })
            );


            // MOVE USER TO TOP

            setUsers(
                (previousUsers) => {

                    const sender =
                        previousUsers.find(
                            (item) =>
                                String(item._id) ===
                                senderId
                        );

                    if (!sender) {
                        return previousUsers;
                    }

                    return [

                        sender,

                        ...previousUsers.filter(
                            (item) =>
                                String(item._id) !==
                                senderId
                        )

                    ];

                }
            );


            // CURRENT CHAT

            if (isCurrentChat) {

                setMessages(
                    (previousMessages) => [

                        ...previousMessages,

                        {
                            ...data,
                            sender:
                                data.sender ||
                                data.userId
                        }

                    ]
                );

                markSeen(senderId);

            } else {

                // UNREAD MESSAGE

                setUnreadMessages(
                    (previous) => ({

                        ...previous,

                        [senderId]:
                            (previous[senderId] || 0) +
                            1

                    })
                );

            }

        },
        [
            selectedUser,
            markSeen
        ]
    );


    // =========================================
    // MESSAGES SEEN
    // =========================================

    const messagesSeen = useCallback(
        (data) => {

            setMessages(
                (previousMessages) =>

                    previousMessages.map(
                        (msg) => {

                            if (

                                String(msg.sender) ===
                                String(user._id)

                                &&

                                String(msg.receiver) ===
                                String(data.userId)

                            ) {

                                return {
                                    ...msg,
                                    seen: true
                                };

                            }

                            return msg;

                        }
                    )

            );

        },
        [user]
    );


    // =========================================
    // MESSAGE SENT
    // =========================================

    const messageSent = useCallback(
        (data) => {
            const receiverId =
                String(data.receiver);


            // UPDATE LAST MESSAGE

            setLastMessages(
                (previous) => ({

                    ...previous,

                    [receiverId]: {

                        message:
                            data.message,

                        messageType:
                            data.messageType,

                        fileName:
                            data.fileName,

                        createdAt:
                            data.createdAt

                    }

                })
            );


            // MOVE USER TO TOP

            setUsers(
                (previousUsers) => {

                    const receiver =
                        previousUsers.find(
                            (item) =>
                                String(item._id) ===
                                receiverId
                        );

                    if (!receiver) {
                        return previousUsers;
                    }

                    return [

                        receiver,

                        ...previousUsers.filter(
                            (item) =>
                                String(item._id) !==
                                receiverId
                        )

                    ];

                }
            );


            // ADD SERVER MESSAGE

            setMessages(
                (previousMessages) => [

                    ...previousMessages,

                    data

                ]
            );
        },
        []
    );


    // =========================================
    // ONLINE USERS
    // =========================================

    const onlineUsersList = useCallback(
        (users) => {

            setOnlineUsers(
                users.map(
                    (id) => String(id)
                )
            );

        },
        []
    );


    // =========================================
    // TYPING
    // =========================================

    const userTyping = useCallback(
        (data) => {

            if (

                selectedUser &&

                String(selectedUser._id) ===
                String(data.userId)

            ) {

                setIsTyping(true);

            }

        },
        [selectedUser]
    );


    // =========================================
    // STOP TYPING
    // =========================================

    const userStoppedTyping =
        useCallback(
            (data) => {

                if (

                    selectedUser &&

                    String(selectedUser._id) ===
                    String(data.userId)

                ) {

                    setIsTyping(false);

                }

            },
            [selectedUser]
        );


    // =========================================
    // CLEAR CHAT SOCKET
    // =========================================

    const handleChatCleared = useCallback(
        (data) => {

            if (
                !selectedUser ||
                String(data.userId) !==
                String(selectedUser._id)
            ) {
                return;
            }

            setMessages([]);

            setReplyingTo(null);

            setMessage("");

            setLastMessages((previous) => ({
                ...previous,
                [String(selectedUser._id)]: null
            }));

            setUnreadMessages((previous) => ({
                ...previous,
                [String(selectedUser._id)]: 0
            }));

        },
        [selectedUser]
    );


    // =========================================
    // MESSAGE DELETED SOCKET
    // =========================================

    const handleMessageDeleted = useCallback(
        (data) => {

            setMessages((previousMessages) =>
                previousMessages.filter(
                    (msg) =>
                        String(msg._id) !==
                        String(data.messageId)
                )
            );

        },
        []
    );

    // =========================================
// INCOMING CALL
// =========================================

const handleIncomingCall = useCallback(
    (data) => {
        setIncomingCall(data);
    },
    []
);
// =========================================
// CALL REJECTED
// =========================================

const handleCallRejected = useCallback(() => {
    // Stop the 30-second timeout.
    clearCallTimeout();

    // Stop any previous call-status timer, if present.
    if (callStatusTimeoutRef.current) {
        clearTimeout(callStatusTimeoutRef.current);
    }

    // Show the rejection message.
    setCallStatusMessage(
        `${selectedUser?.name || "User"} cancelled the call.`
    );

    // Keep the current call UI visible for 2 seconds.
    // Then close it and clean up the call.
    callStatusTimeoutRef.current = setTimeout(() => {
        cleanupCall();
        setCallStatusMessage("");
        callStatusTimeoutRef.current = null;
    }, 2000);
}, [cleanupCall, selectedUser]);

// =========================================
// CALL CANCELLED
// =========================================

const handleCallCancelled = useCallback(
    (data) => {
        // Close the incoming-call popup.
        setIncomingCall(null);

        // Close the call screen and clean up resources.
        cleanupCall();
    },
    [cleanupCall]
);
// =========================================
// CALL ENDED
// =========================================

const handleCallEnded = useCallback(
    () => {
        cleanupCall();
    },
    [cleanupCall]
);
// =========================================
// ACCEPT CALL
// =========================================

const handleAcceptCall = async () => {

    try {
        if (!incomingCall) {
            return;
        }

        const socket =
            socketRef.current;

        if (!socket) {
            return;
        }

        // Tell caller that the call was accepted
        socket.emit(
            "acceptCall",
            {
                callerSocketId:
                    incomingCall.callerSocketId
            }
        );

        // Close incoming call popup
        setIncomingCall(null);
        setShowVideoCall(true);
    } catch (error) {}

};

// =========================================
// CALL ACCEPTED BY RECEIVER
// =========================================

const handleCallAccepted = useCallback(
    async () => {

        try {
            clearCallTimeout();
            setCallStatusMessage("");

            const socket =
                socketRef.current;

            if (!socket) {
                return;
            }

            if (!selectedUser) {
                return;
            }

            // Create peer connection
            const peerConnection =
                await createConnection();

            // Show local camera
            if (localVideoRef.current) {

                localVideoRef.current.srcObject =
                    localStreamRef.current;

            }

            // Receive remote stream
            peerConnection.ontrack =
                handleRemoteStream;

            // ICE Candidate
            peerConnection.onicecandidate =
                (event) => {

                    if (!event.candidate) {
                        return;
                    }

                    socket.emit(
                        "iceCandidate",
                        {
                            receiverId:
                                String(
                                    selectedUser._id
                                ),

                            candidate:
                                event.candidate
                        }
                    );

                };

            // Create offer
            const offer =
                await peerConnection.createOffer();

            // Set local description
            await peerConnection.setLocalDescription(
                offer
            );

            // Send offer to receiver
            socket.emit(
                "webrtcOffer",
                {
                    receiverId:
                        String(
                            selectedUser._id
                        ),

                    offer:
                        offer
                }
            );

            // Remove Calling popup
            setIsCalling(false);
        } catch (error) {}

    },
    [
        createConnection,
        handleRemoteStream,
        selectedUser
    ]
);

    // =========================================
    // SOCKET
    // =========================================

    const socket = useSocket(
        user,
        {

            receiveMessage,

            messageSent,

            messagesSeen,

            onlineUsers:
            onlineUsersList,

            userTyping,

            userStoppedTyping,

            chatCleared:
                handleChatCleared,

            messageDeleted:
            handleMessageDeleted,

            webrtcOffer:
            handleWebRTCOffer,

            webrtcAnswer:
            handleWebRTCAnswer,

            iceCandidate:
            handleICECandidate,

            incomingCall:
            handleIncomingCall,

            callRejected:
            handleCallRejected,

            callCancelled:
            handleCallCancelled,

            userOffline: handleUserOffline,

            callEnded:
            handleCallEnded,

            callAccepted:
            handleCallAccepted


        }
    );
        socketRef.current = socket;

    // =========================================
    // LOAD USERS
    // =========================================

    useEffect(() => {

        if (!token) {
            return;
        }

        const loadUsers = async () => {

            try {

                const usersResponse =
                    await getUsers(token);

                const conversationsResponse =
                    await getConversations(
                        token
                    );

                const allUsers =
                    usersResponse.users;

                const conversations =
                    conversationsResponse
                        .conversations;

                const lastMessageData = {};


                conversations.forEach(
                    (conversation) => {

                        lastMessageData[
                            String(
                                conversation._id
                            )
                        ] = {

                            message:
                                conversation.message,

                            messageType:
                                conversation.messageType,

                            fileName:
                                conversation.fileName,

                            createdAt:
                                conversation.createdAt

                        };

                    }
                );


                setLastMessages(
                    lastMessageData
                );


                const conversationUserIds =
                    conversations.map(
                        (conversation) =>
                            String(
                                conversation._id
                            )
                    );


                const sortedUsers =
                    [...allUsers].sort(
                        (a, b) => {

                            const aIndex =
                                conversationUserIds
                                    .indexOf(
                                        String(
                                            a._id
                                        )
                                    );


                            const bIndex =
                                conversationUserIds
                                    .indexOf(
                                        String(
                                            b._id
                                        )
                                    );


                            if (
                                aIndex !== -1 &&
                                bIndex !== -1
                            ) {

                                return (
                                    aIndex -
                                    bIndex
                                );

                            }


                            if (
                                aIndex !== -1
                            ) {

                                return -1;

                            }


                            if (
                                bIndex !== -1
                            ) {

                                return 1;

                            }


                            return 0;

                        }
                    );


                setUsers(
                    sortedUsers
                );


            } catch (error) {}

        };


        loadUsers();

    }, [token]);


    // =========================================
    // UNREAD
    // =========================================

    useEffect(() => {

        if (!token) {
            return;
        }

        const loadUnreadMessages =
            async () => {

                try {

                    const response =
                        await getUnreadMessages(
                            token
                        );

                    const unreadData = {};


                    response.unreadMessages.forEach(
                        (item) => {

                            unreadData[
                                String(item._id)
                            ] = item.count;

                        }
                    );


                    setUnreadMessages(
                        unreadData
                    );


                } catch (error) {}

            };


        loadUnreadMessages();

    }, [token]);


    // =========================================
    // SEND MESSAGE
    // =========================================

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }


        if (!selectedUser) {

            alert(
                "Please select a user"
            );

            return;

        }


        if (!socket) {

            alert(
                "Socket is not connected"
            );

            return;

        }


        const messageData = {

            receiver:
                selectedUser._id,

            message:
                message.trim(),

            messageType:
                "text",

            replyTo:
                replyingTo
                    ? replyingTo._id
                    : null

        };


        socket.emit(
            "sendMessage",
            messageData
        );


        setMessage("");

        setReplyingTo(null);


        clearTimeout(
            typingTimeoutRef.current
        );


        socket.emit(
            "stopTyping",
            selectedUser._id
        );


        setIsTyping(false);

    };


    // =========================================
    // SELECT USER
    // =========================================

    const selectUser = async (selected) => {

        setSelectedUser(
            selected
        );
        setMobileChatOpen(true);

        setMobileTab("chat");

        setMessages([]);

        setIsTyping(false);

        clearTimeout(
            typingTimeoutRef.current
        );

        setUnreadMessages(
            (previous) => ({

                ...previous,

                [String(selected._id)]:
                    0

            })
        );


        await loadMessages(
            selected._id
        );


        await markSeen(
            selected._id
        );

    };


    // =========================================
    // BACK TO MY PROFILE
    // =========================================

    const handleBackToProfile = () => {
    setSelectedUser(null);
    setMobileChatOpen(false);
    setMobileTab("users");

    setMessages([]);
    setReplyingTo(null);
    setMessage("");
    setIsTyping(false);

    clearTimeout(typingTimeoutRef.current);
};


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        if (socket) {
            socket.disconnect();
        }

        logoutUser();

        navigate("/");

    };


    // =========================================
    // DELETE ACCOUNT
    // =========================================

    const handleDeleteAccount = () => {

        setShowDeleteAccountModal(true);

    };


    // =========================================
    // VERIFY PASSWORD
    // =========================================

    const handleVerifyPassword =
        async (password) => {

            try {

                await verifyPassword(
                    token,
                    password
                );

            } catch (error) {
                throw error;
            }

        };


    // =========================================
    // CONFIRM DELETE ACCOUNT
    // =========================================

    const handleConfirmDeleteAccount =
        async (password) => {

            try {

                await deleteAccount(
                    token,
                    password
                );


                if (socket) {
                    socket.disconnect();
                }


                logoutUser();

                navigate("/");

            } catch (error) {
                throw error;
            }

        };


    // =========================================
    // UPDATE PROFILE
    // =========================================

    const handleUpdateProfile =
        async (
            name,
            email,
            profilePicture
        ) => {

            try {

                const response =
                    await updateProfile(
                        token,
                        name,
                        email,
                        profilePicture
                    );


                setUser(
                    response.user
                );


                return response;

            } catch (error) {
                throw error;
            }

        };


    // =========================================
    // CLEAR CHAT
    // =========================================

    const handleClearChat = async () => {

        if (!selectedUser) {
            return;
        }


        const confirmed =
            window.confirm(
                `Clear all messages with ${selectedUser.name}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await clearChat(
                selectedUser._id,
                token
            );


            setMessages([]);

            setReplyingTo(null);

            setMessage("");


            setLastMessages((previous) => ({
                ...previous,
                [String(selectedUser._id)]: null
            }));


            setUnreadMessages((previous) => ({
                ...previous,
                [String(selectedUser._id)]: 0
            }));


        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to clear chat"
            );
        }

    };


    // =========================================
    // DELETE SINGLE MESSAGE
    // =========================================

    const handleDeleteMessage =
        async (messageId) => {

            const confirmed =
                window.confirm(
                    "Delete this message?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteMessage(
                    messageId,
                    token
                );

            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    "Unable to delete message"
                );
            }

        };


    // =========================================
    // SEARCH USERS
    // =========================================

    const filteredUsers =
        users.filter((item) => {

            const name =
                item.name?.toLowerCase() ||
                "";

            const email =
                item.email?.toLowerCase() ||
                "";

            const searchText =
                search.toLowerCase();


            return (
                name.includes(searchText) ||
                email.includes(searchText)
            );

        });






    // =========================================
    // UI
    // =========================================

    return (
        <div className="h-dvh w-full overflow-hidden bg-slate-950 p-0">

            <div
                className="
                flex
                h-full
                min-h-0
                min-w-0
                w-full
                overflow-hidden
                rounded-none
                bg-slate-950
                shadow-xl
                border-0
                sm:border
                sm:border-slate-800
            "
            >


                            {/* =================================
                                SIDEBAR
                            ================================== */}
            <div
                className={`
                ${mobileTab === "users" && !selectedUser ? "flex" : "hidden"}
                sm:flex
                flex-col
                h-full
                min-h-0
                w-full
                sm:w-80
                shrink-0
                border-r
                border-slate-800
                bg-slate-950
            `}
            >

            {/* SIDEBAR HEADER — NEON GLASS DESIGN */}

            <div className="
                shrink-0
                border-b border-cyan-400/20
                bg-slate-950/95
                px-4 py-5
                sm:px-5
            ">

                {/* LOGO + BRANDING */}

                <div className="mb-5 flex items-center gap-3">

                    <div className="
                        grid h-12 w-12 shrink-0
                        place-items-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-cyan-400
                        via-blue-500
                        to-purple-500
                        p-[1.5px]
                        shadow-lg
                        shadow-cyan-500/20
                    ">

                        <span className="home-brand-icon"><MessageCircle size={26} /><i /><i /><i /></span>

                    </div>

                    <div className="min-w-0">

                        <h1 className="
                            text-xl
                            font-extrabold
                            tracking-tight
                            text-white
                        ">
                            ̷V̷̷I̷̷b̷̷e̷̷M̷a̷̷t̷̷c̷̷h̷
                        </h1>

                        <p className="
                            mt-1
                            flex items-center gap-2
                            text-xs
                            font-medium
                            tracking-wide
                            text-slate-400
                        ">
                            <span className="
                                h-2 w-2
                                rounded-full
                                bg-emerald-400
                                shadow-[0_0_8px_rgba(52,211,153,0.7)]
                            " />

                            Messages
                        </p>

                    </div>

                </div>


                {/* SEARCH USERS */}

                <label className="
                    flex items-center gap-3
                    rounded-xl
                    border border-cyan-400/30
                    bg-gradient-to-r
                    from-slate-900
                    via-slate-900
                    to-indigo-950/60
                    px-3.5
                    transition-all duration-300
                    focus-within:border-cyan-300
                    focus-within:shadow-[0_0_18px_rgba(34,211,238,0.12)]
                ">

                    <Search
                        size={19}
                        className="shrink-0 text-cyan-300"
                    />

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search users"
                        className="
                            h-11 min-w-0 flex-1
                            bg-transparent
                            text-sm text-white
                            outline-none
                            placeholder:text-slate-500
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            className="
                                text-slate-400
                                transition
                                hover:text-white
                            "
                        >
                            ✕
                        </button>
                    )}

                </label>

            </div>
                                {/* USER LIST */}

                                <div
                                    className="flex-1 min-h-0 overflow-y-auto pb-20 text-lg font-bold text-white"
                                >

                                    <UserList
                                        users={filteredUsers}
                                        selectUser={selectUser}
                                        unreadMessages={
                                            unreadMessages
                                        }
                                        onlineUsers={
                                            onlineUsers
                                        }
                                        lastMessages={
                                            lastMessages
                                        }
                                        selectedUser={selectedUser}
                                    />

                                </div>

                            </div>


                            {/* =================================
                                RIGHT SIDE
                            ================================== */}

            <div
               className={`
                ${
                    selectedUser
                        ? mobileChatOpen ? "flex" : "hidden"
                        : mobileTab === "home" ? "flex" : "hidden"
                }
                sm:flex flex-1 min-w-0 h-full min-h-0 overflow-hidden flex-col bg-slate-950
            `}
            >


                                {/* =================================
                                    NO USER SELECTED
                                ================================== */}

                            {!selectedUser ? (

                <div className="profile-page-bg relative min-h-0 flex-1 overflow-y-auto">
                    {/* Soft ambient colour behind the profile panel */}
                    <div className="profile-orb profile-orb-cyan" aria-hidden="true" />
                    <div className="profile-orb profile-orb-purple" aria-hidden="true" />

                    <div className="profile-page-content relative mx-auto w-full max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
                        <section className="profile-panel overflow-hidden rounded-[28px]">
                            {/* Gradient banner */}
                            <div className="profile-banner relative min-h-[156px] overflow-hidden px-5 py-6 sm:px-8 sm:py-7 lg:min-h-[170px]">
                                <div className="profile-banner-orb profile-banner-orb-one" aria-hidden="true" />
                                <div className="profile-banner-orb profile-banner-orb-two" aria-hidden="true" />
                                <div className="relative z-10 max-w-xl">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-100/80">Your profile</p>
                                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">̶W̶̶E̶̶L̶̶C̶̶O̶̶M̶̶E̶</h2>

                                </div>
                            </div>

                            <div className="profile-panel-body px-4 pb-5 sm:px-6 sm:pb-7 lg:px-8 lg:pb-8">
                                {/* Avatar and identity */}
                                <div className="profile-identity relative -mt-14 flex flex-col items-center text-center sm:-mt-16">
                                    <div className="profile-avatar-ring">
                                        <div className="profile-avatar-inner">
                                            {user?.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user?.name || "Your profile photo"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserRound size={54} className="text-cyan-200" aria-hidden="true" />
                                            )}
                                        </div>
                                        <span className="profile-online-dot" title="Your account is active" aria-label="Active account" />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfileModal(true)}
                                        className="profile-change-photo mt-3 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold sm:absolute sm:left-[calc(50%+82px)] sm:top-8 sm:mt-0"
                                        title="Open profile editor to change your photo"
                                    >
                                        <Camera size={15} aria-hidden="true" />
                                        Change Photo
                                    </button>

                                    <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                        {user?.name || "Your name"}
                                    </h1>
                                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-300">
                                        <span className="profile-live-dot" aria-hidden="true" />
                                        Active now
                                    </p>
                                </div>

                                {/* About/status summary */}
                                <div className="profile-about-card mt-6 flex items-start gap-3 rounded-2xl px-4 py-4 sm:px-5">
                                    <div className="profile-detail-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                        <MessageCircle size={19} aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">About</p>
                                        <p className="mt-1 break-words text-sm leading-relaxed text-slate-100">
                                            {user?.about || "🌟 𝙷𝚎𝚕𝚕𝚘 𝚄𝚜𝚎𝚛 ! 𝙹𝚞𝚜𝚝 𝚑𝚎𝚛𝚎 𝚏𝚘𝚛 𝚐𝚘𝚘𝚍 𝚟𝚒𝚋𝚎𝚜 ✨ 𝚊𝚗𝚍 𝚐𝚛𝚎𝚊𝚝 𝚌𝚑𝚊𝚝𝚜 💬"}
                                        </p>
                                    </div>

                                </div>

                                {/* Account detail cards */}
                                <div className="profile-details-section mt-5 rounded-2xl p-4 sm:p-5 lg:p-6">
                                    <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
                                        <div className="profile-detail-icon flex h-10 w-10 items-center justify-center rounded-xl">
                                            <ContactRound size={20} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-white">Profile Details</h3>
                                            <p className="mt-0.5 text-xs text-slate-400">Your Account Information</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                                        <div className="profile-info-tile flex min-w-0 items-start gap-3 rounded-xl p-3.5">
                                            <div className="profile-detail-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                                <UserRound size={19} aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-400">Full Name</p>
                                                <p className="mt-1 break-words text-sm font-semibold text-white">{user?.name || "Not provided"}</p>
                                            </div>

                                        </div>

                                        <div className="profile-info-tile flex min-w-0 items-start gap-3 rounded-xl p-3.5">
                                            <div className="profile-detail-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                                <Mail size={19} aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-400">Email Address</p>
                                                <p className="mt-1 break-all text-sm font-semibold text-white">{user?.email || "Not provided"}</p>
                                            </div>

                                        </div>

                                        <div className="profile-info-tilfe flex min-w-0 items-start gap-3 rounded-xl p-3.5">
                                            <div className="profile-detail-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                                <span className="profile-live-dot" aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-400">Status</p>
                                                <p className="mt-1 text-sm font-semibold text-emerald-300">Online in this session</p>
                                            </div>
                                        </div>

                                        <div className="profile-info-tile flex min-w-0 items-start gap-3 rounded-xl p-3.5">
                                            <div className="profile-detail-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                                <ShieldCheck size={19} aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-slate-400">Account</p>
                                                <p className="mt-1 text-sm font-semibold text-white">Your 😊 Profile</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Existing working account actions */}
                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfileModal(true)}
                                        className="profile-primary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                                    >
                                        <Pencil size={17} aria-hidden="true" />
                                        Update Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="profile-secondary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-100"
                                    >
                                        <LogOut size={17} aria-hidden="true" />
                                        Logout
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="profile-danger-action inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                                    >
                                        <Trash2 size={17} aria-hidden="true" />
                                        Delete Account
                                    </button>
                                </div>

                                {/* Security note */}
                                <div className="profile-security-note mt-5 flex items-start gap-3 rounded-2xl px-4 py-4 sm:px-5">
                                    <div className="profile-detail-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                        <LockKeyhole size={19} aria-hidden="true" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-white">Account Security</h3>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">Keep your password private and use a strong, unique password to help protect your account.</p>
                                    </div>
                                </div>


                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                                    /* =================================
                                        CHAT SELECTED
                                    ================================== */

                                    <>

                                        {/* CHAT HEADER */}

                                        <ChatHeader
                                            user={user}
                                            selectedUser={
                                                selectedUser
                                            }
                                            onBack={
                                                handleBackToProfile
                                            }
                                            onClearChat={
                                                handleClearChat
                                            }
                                            onVideoCall={startCall}
                                            isOnline={
                    selectedUser
                        ? onlineUsers.includes(
                            String(selectedUser._id)
                        )
                        : false
                    }
                            />


                                        <MessageList
                                            messages={
                                                messages
                                            }
                                            user={
                                                user
                                            }
                                            selectedUser={
                                                selectedUser
                                            }
                                            isTyping={
                                                isTyping
                                            }
                                            messagesEndRef={
                                                messagesEndRef
                                            }
                                            setReplyingTo={
                                                setReplyingTo
                                            }
                                            onDeleteMessage={
                                                handleDeleteMessage
                                            }
                                        />


                                        {/* INPUT */}

                                        <MessageInput
                                            selectedUser={
                                                selectedUser
                                            }
                                            message={
                                                message
                                            }
                                            setMessage={
                                                setMessage
                                            }
                                            socket={
                                                socket
                                            }
                                            sendMessage={
                                                sendMessage
                                            }
                                            typingTimeoutRef={
                                                typingTimeoutRef
                                            }
                                            token={
                                                token
                                            }
                                            replyingTo={
                                                replyingTo
                                            }
                                            setReplyingTo={
                                                setReplyingTo
                                            }
                                        />

                                                        </>

                                )}

            {/* =========================================
                FULL-SCREEN VIDEO CALL
            ========================================= */}

            {showVideoCall && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white">

                    {/* TOP BAR — CALLER NAME AND TIMER */}
                    <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-6 py-5">

                        <div>
                            <h2 className="text-lg font-semibold">
                                {selectedUser?.name || "Video Call"}
                            </h2>

                        <p className={`text-sm ${
                callStatusMessage || isReceiverOffline
                    ? "font-semibold text-red-400"
                    : "text-slate-300"
            }`}>
                {callStatusMessage
                    ? callStatusMessage
                    : isReceiverOffline
                        ? `${selectedUser?.name || "User"} is offline`
                        : isCallActive
                            ? "Connected"
                            : "Connecting..."}
            </p>
                        </div>

                        {isCallActive && (
                            <div className="rounded-full bg-black/40 px-4 py-2 text-sm font-semibold">
                                {formatCallDuration(callDuration)}
                            </div>
                        )}
                    </div>

                    {/* REMOTE VIDEO — FULL SCREEN */}
                    <div className="relative flex-1 overflow-hidden bg-slate-950">

                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="h-full w-full object-cover"
                        />

                        {!remoteStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-800 text-3xl font-bold">
                        {selectedUser?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <p className={`text-lg ${
                        isReceiverOffline ? "font-semibold text-red-400" : "text-slate-400"
                    }`}>
                        {isReceiverOffline
                            ? `${selectedUser?.name || "User"} is offline`
                            : `Waiting for ${selectedUser?.name || "user"}'s video...`}
                    </p>

                </div>
            )}

                        {/* LOCAL VIDEO — FLOATING CORNER */}
                        <div className="absolute right-5 top-24 h-36 w-28 overflow-hidden rounded-2xl border border-white/30 bg-slate-800 shadow-xl sm:h-48 sm:w-36">

                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                            />

                            {!isCameraOn && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-sm">
                                    Camera off
                                </div>
                            )}

                            <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs">
                                You
                            </span>
                        </div>
                    </div>

                    {/* CALL CONTROLS */}
                    {/* CALL CONTROLS */}
            <div
                className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    z-20
                    flex
                    items-center
                    justify-center
                    gap-4
                    bg-gradient-to-t
                    from-black/80
                    to-transparent
                    px-4
                    pb-8
                    pt-16
                    sm:gap-5
                    sm:pb-10
                "
            >


                        {/* MICROPHONE */}
                        <button
                            type="button"
                            onClick={handleToggleMicrophone}
                            aria-label={isMicrophoneOn ? "Mute microphone" : "Unmute microphone"}
                            className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                                isMicrophoneOn
                                    ? "bg-slate-700 hover:bg-slate-600"
                                    : "bg-red-600 hover:bg-red-500"
                            }`}
                        >
                            {isMicrophoneOn ? <Mic size={23} /> : <MicOff size={23} />}
                        </button>

                        {/* CAMERA */}
                        <button
                            type="button"
                            onClick={handleToggleCamera}
                            aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
                            className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                                isCameraOn
                                    ? "bg-slate-700 hover:bg-slate-600"
                                    : "bg-red-600 hover:bg-red-500"
                            }`}
                        >
                            {isCameraOn ? <Video size={23} /> : <VideoOff size={23} />}
                        </button>

                        {/* END CALL */}
                        <button
                            type="button"
                            onClick={() => {
                                const socket = socketRef.current;

                                if (socket && selectedUser) {
                                    socket.emit("endCall", {
                                        receiverId: String(selectedUser._id)
                                    });
                                }

                                setShowVideoCall(false);
                                cleanupCall();
                            }}
                            aria-label="End call"
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-500"
                        >
                            <PhoneOff size={27} />
                        </button>
                    </div>
                </div>
            )}

                    {incomingCall && (
                        <div className="
                            fixed inset-0 z-50
                            flex items-center justify-center
                            bg-black/50 backdrop-blur-sm
                        ">
                            <div className="
                                w-80 rounded-2xl bg-white
                                p-6 shadow-2xl text-center
                            ">

                                <div className="
                                    mx-auto mb-4 flex h-16 w-16
                                    items-center justify-center
                                    rounded-full bg-emerald-100
                                ">
                                    <Camera
                                        size={30}
                                        className="text-emerald-600"
                                    />
                                </div>

                                <h2 className="
                                    text-xl font-bold text-slate-800
                                ">
                                    Incoming Call
                                </h2>

                                <p className="
                                    mt-2 text-sm text-slate-500
                                ">
                                    Someone is calling you...
                                </p>

                                <div className="
                                    mt-6 flex gap-3
                                ">

                                    <button
                                        type="button"
                                    onClick={() => {
                                        const socket =
                                            socketRef.current;

                                        if (socket && incomingCall) {

                                            socket.emit(
                                                "rejectCall",
                                                {
                                                    callerSocketId:
                                                        incomingCall.callerSocketId
                                                }
                                            );

                                        }

                                        setIncomingCall(null);
                                    }}
                                        className="
                                            flex-1 rounded-xl
                                            bg-red-500 px-4 py-3
                                            font-semibold text-white
                                            hover:bg-red-600
                                        "
                                    >
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAcceptCall}
                                        className="
                                            flex-1 rounded-xl
                                            bg-emerald-500 px-4 py-3
                                            font-semibold text-white
                                            hover:bg-emerald-600
                                        "
                                    >
                                        Accept
                                    </button>

                                </div>

                            </div>
                        </div>
                    )}



                    {isCalling && (
                <div className="
                    fixed inset-0 z-50
                    flex items-center justify-center
                    bg-black/50 backdrop-blur-sm
                ">

                    <div className="
                        w-80 rounded-2xl
                        bg-white
                        p-6
                        shadow-2xl
                        text-center
                    ">

                        <div className="
                            mx-auto mb-4
                            flex h-16 w-16
                            items-center justify-center
                            rounded-full
                            bg-indigo-100
                        ">

                            <Camera
                                size={30}
                                className="text-indigo-600"
                            />

                        </div>

                    <h2 className={`
                text-xl
                font-bold
                ${
                    callStatusMessage
                        ? "text-red-600"
                        : "text-slate-800"
                }
            `}>
                {callStatusMessage
                    ? "Call Cancelled"
                    : isReceiverOffline
                        ? "User Offline"
                        : "Calling..."}
            </h2>

                    <p className={`mt-2 text-sm ${
                callStatusMessage || isReceiverOffline
                    ? "text-red-500"
                    : "text-slate-500"
            }`}>
                {callStatusMessage
                    ? callStatusMessage
                    : isReceiverOffline
                        ? `${selectedUser?.name || "User"} is offline`
                        : `Calling ${selectedUser?.name || "user"}...`}
            </p>

            {callStatusMessage && (
                <div className="fixed right-5 top-5 z-[9999] rounded-xl bg-red-600 px-6 py-4 text-white shadow-2xl">
                    <p className="font-semibold">
                        ❌ {callStatusMessage}
                    </p>
                </div>
            )}

                        <button
                            type="button"
                        onClick={() => {
                            const socket =
                                socketRef.current;

                            if (
                                socket &&
                                selectedUser
                            ) {

                                socket.emit(
                                    "cancelCall",
                                    {
                                        receiverId:
                                            String(
                                                selectedUser._id
                                            )
                                    }
                                );

                            }

                            clearCallTimeout();

                            setIsCalling(false);
                            setCallStatusMessage("");

                            // Close the full-screen call UI and release WebRTC resources.
                            cleanupCall();
                        }}
                            className="
                                mt-6
                                w-full
                                rounded-xl
                                bg-red-500
                                px-4
                                py-3
                                font-semibold
                                text-white
                                hover:bg-red-600
                            "
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            )}

                                {/* =================================
                                    EDIT PROFILE MODAL
                                ================================== */}

                                <EditProfileModal
                                    isOpen={
                                        showEditProfileModal
                                    }
                                    onClose={() =>
                                        setShowEditProfileModal(
                                            false
                                        )
                                    }
                                    user={
                                        user
                                    }
                                    onSave={
                                        handleUpdateProfile
                                    }
                                />


                                {/* =================================
                                    DELETE ACCOUNT MODAL
                                ================================== */}

                                <DeleteAccountModal
                                    isOpen={
                                        showDeleteAccountModal
                                    }
                                    onClose={() =>
                                        setShowDeleteAccountModal(
                                            false
                                        )
                                    }
                                    onVerifyPassword={
                                        handleVerifyPassword
                                    }
                                    onConfirmDelete={
                                        handleConfirmDeleteAccount
                                    }
                                />

                            </div>

            {/* MOBILE BOTTOM NAVIGATION */}
            {!selectedUser && (
                <nav className="sm:hidden fixed inset-x-0 bottom-0 z-[9999] flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950">

                    {/* HOME */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedUser(null);
                            setMobileChatOpen(false);
                            setMobileTab("home");
                            setMessages([]);
                        }}
                        className={`flex flex-col items-center justify-center gap-1 ${
                            mobileTab === "home"
                                ? "text-indigo-400"
                                : "text-slate-400"
                        }`}
                        aria-label="Home"
                    >
                        <House size={22} />
                        <span className="text-xs">Home</span>
                    </button>

                    {/* USERS */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedUser(null);
                            setMobileChatOpen(false);
                            setMobileTab("users");
                            setMessages([]);
                        }}
                        className={`flex flex-col items-center justify-center gap-1 ${
                            mobileTab === "users"
                                ? "text-indigo-400"
                                : "text-slate-400"
                        }`}
                        aria-label="Users"
                    >
                        <UsersRound size={22} />
                        <span className="text-xs">Users</span>
                    </button>

                </nav>
            )}


                        </div>
        </div>
    );

}
export default Chat;
