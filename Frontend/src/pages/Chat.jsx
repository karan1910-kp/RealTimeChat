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
    Camera,
    LogOut,
    Trash2,
    ArrowLeft,
    Mail,
    Pencil
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { clearChat } from "../services/message.service";

import UserList from "../components/UserList";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import useSocket from "../hooks/useSocket";

import DeleteAccountModal from "../components/deleteAccountModal";
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

    const navigate = useNavigate();


    // =========================================
    // STATES
    // =========================================

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

            } catch (error) {

                console.log(
                    "Get Messages Error:",
                    error.response?.data?.message ||
                    error.message
                );

            }

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

            } catch (error) {

                console.log(
                    "Mark Seen Error:",
                    error.response?.data?.message ||
                    error.message
                );

            }

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

            console.log(
                "MESSAGE SENT DATA:",
                data
            );


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
                handleMessageDeleted

        }
    );


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


            } catch (error) {

                console.log(
                    "Get Users Error:",
                    error.response?.data?.message ||
                    error.message
                );

            }

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


                } catch (error) {

                    console.log(
                        "Unread Messages Error:",
                        error.response?.data?.message ||
                        error.message
                    );

                }

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

        setMessages([]);

        setReplyingTo(null);

        setMessage("");

        setIsTyping(false);

        clearTimeout(
            typingTimeoutRef.current
        );

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

                console.log(
                    "Verify Password Error:",
                    error
                );

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

                console.log(
                    "Delete Account Error:",
                    error
                );

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

                console.log(
                    "Update Profile Error:",
                    error
                );

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

            console.log(
                "Clear Chat Error:",
                error
            );


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

                console.log(
                    "Delete Message Error:",
                    error
                );


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

        <div className="
            h-screen
            bg-slate-100
            p-4
        ">

            <div
                className="
                    flex
                    h-full
                    max-w-7xl
                    mx-auto
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-xl
                    border
                    border-slate-200
                "
            >


                {/* =================================
                    SIDEBAR
                ================================== */}

                <div
                    className="
                        w-80
                        shrink-0
                        border-r
                        border-slate-200
                        bg-white
                        flex
                        flex-col
                    "
                >


                    {/* SIDEBAR HEADER */}

                    <div
                        className="
                            px-5
                            py-5
                            border-b
                            border-slate-200
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-full
                                        bg-indigo-600
                                        flex
                                        items-center
                                        justify-center
                                        text-white
                                    "
                                >

                                    <MessageCircle
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <h1
                                        className="
                                            text-lg
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Messages
                                    </h1>


                                    <p
                                        className="
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        Real-time chat
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* SEARCH */}

                        <div
                            className="
                                relative
                            "
                        >

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-3
                                    text-sm
                                    outline-none
                                    focus:border-indigo-400
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            />

                        </div>

                    </div>


                    {/* USER LIST */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                        "
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
                        />

                    </div>

                </div>


                {/* =================================
                    RIGHT SIDE
                ================================== */}

                <div
                    className="
                        flex-1
                        min-w-0
                        flex
                        flex-col
                        bg-slate-50
                    "
                >


                    {/* =================================
                        NO USER SELECTED
                    ================================== */}

                {!selectedUser ? (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">

        {/* Decorative background circles */}
        <div className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
            bg-indigo-200/40
            rounded-full
            blur-3xl
        " />

        <div className="
            absolute
            -bottom-32
            -left-24
            w-80
            h-80
            bg-purple-200/40
            rounded-full
            blur-3xl
        " />

        {/* Profile Content */}
        <div className="
            relative
            h-full
            flex
            items-center
            justify-center
            p-8
        ">

            <div className="
                w-full
                max-w-2xl
                bg-white/90
                backdrop-blur-xl
                rounded-3xl
                border
                border-white
                shadow-2xl
                overflow-hidden
            ">

                {/* ================================= */}
                {/* PROFILE HEADER */}
                {/* ================================= */}

                <div className="
                    relative
                    h-36
                    bg-gradient-to-r
                    from-indigo-600
                    via-purple-600
                    to-fuchsia-500
                ">

                    {/* Decorative circles */}

                    <div className="
                        absolute
                        -top-12
                        -right-12
                        w-40
                        h-40
                        rounded-full
                        bg-white/10
                    " />

                    <div className="
                        absolute
                        -bottom-16
                        -left-10
                        w-44
                        h-44
                        rounded-full
                        bg-white/10
                    " />

                    <div className="
                        absolute
                        top-5
                        left-6
                        text-white
                    ">
                        <p className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.2em]
                            text-white/70
                        ">
                            Your Profile
                        </p>

                        <h2 className="
                            mt-1
                            text-2xl
                            font-bold
                        ">
                            Account Overview
                        </h2>
                    </div>

                </div>


                {/* ================================= */}
                {/* PROFILE BODY */}
                {/* ================================= */}

                <div className="px-8 pb-8">

                    {/* Profile Image */}

                    <div className="
                        relative
                        -mt-16
                        flex
                        justify-center
                    ">

                        <div className="
                            relative
                            w-32
                            h-32
                            rounded-full
                            bg-white
                            p-1.5
                            shadow-xl
                        ">

                            <div className="
                                w-full
                                h-full
                                rounded-full
                                overflow-hidden
                                bg-gradient-to-br
                                from-indigo-100
                                to-purple-100
                                flex
                                items-center
                                justify-center
                            ">

                                {user?.profilePicture ? (

                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <UserRound
                                        size={52}
                                        className="
                                            text-indigo-500
                                        "
                                    />

                                )}

                            </div>


                            {/* Online indicator */}

                            <span className="
                                absolute
                                right-2
                                bottom-2
                                w-6
                                h-6
                                rounded-full
                                bg-emerald-500
                                border-4
                                border-white
                                shadow
                            " />

                        </div>

                    </div>


                    {/* Name */}

                    <div className="
                        text-center
                        mt-4
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                            text-slate-900
                        ">
                            {user?.name}
                        </h1>

                        <div className="
                            mt-2
                            flex
                            items-center
                            justify-center
                            gap-2
                        ">

                            <span className="
                                w-2
                                h-2
                                rounded-full
                                bg-emerald-500
                            " />

                            <span className="
                                text-sm
                                text-slate-500
                            ">
                                Active now
                            </span>

                        </div>

                    </div>


                    {/* Email */}

                    <div className="
                        mt-6
                        flex
                        items-center
                        justify-center
                        gap-3
                        px-5
                        py-3
                        rounded-2xl
                        bg-indigo-50
                        border
                        border-indigo-100
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-xl
                            bg-indigo-100
                            flex
                            items-center
                            justify-center
                            text-indigo-600
                        ">
                            <Mail size={18} />
                        </div>

                        <div className="text-left">

                            <p className="
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-wider
                                text-indigo-400
                            ">
                                Email Address
                            </p>

                            <p className="
                                text-sm
                                font-medium
                                text-slate-700
                            ">
                                {user?.email}
                            </p>

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* ACTION BUTTONS */}
                    {/* ================================= */}

                    <div className="
                        grid
                        grid-cols-2
                        gap-4
                        mt-6
                    ">

                        {/* Logout */}

                        <button
                            type="button"
                            onClick={logout}
                            className="
                                h-12
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-slate-700
                                font-semibold
                                flex
                                items-center
                                justify-center
                                gap-2
                                hover:bg-slate-50
                                hover:border-slate-300
                                hover:shadow-sm
                                transition-all
                                duration-200
                                cursor-pointer
                            "
                        >

                            <LogOut size={18} />

                            Logout

                        </button>


                        {/* Delete */}

                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="
                                h-12
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                text-red-600
                                font-semibold
                                flex
                                items-center
                                justify-center
                                gap-2
                                hover:bg-red-100
                                hover:border-red-300
                                hover:shadow-sm
                                transition-all
                                duration-200
                                cursor-pointer
                            "
                        >

                            <Trash2 size={18} />

                            Delete Account

                        </button>

                    </div>


                    {/* Edit Profile */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowEditProfileModal(true)
                        }
                        className="
                            w-full
                            h-13
                            mt-4
                            rounded-xl
                            bg-gradient-to-r
                            from-indigo-600
                            via-purple-600
                            to-fuchsia-500
                            text-white
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            shadow-lg
                            shadow-indigo-200
                            hover:shadow-xl
                            hover:shadow-purple-200
                            hover:scale-[1.01]
                            active:scale-[0.99]
                            transition-all
                            duration-200
                            cursor-pointer
                        "
                    >

                        <Pencil size={18} />

                        Edit Profile

                    </button>


                    {/* Footer text */}

                    <p className="
                        text-center
                        text-xs
                        text-slate-400
                        mt-5
                    ">
                        Manage your profile and account settings
                    </p>

                </div>

            </div>

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
                                isOnline={
                                    onlineUsers.includes(
                                        String(
                                            selectedUser._id
                                        )
                                    )
                                }
                            />


                            {/* MESSAGES */}

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

            </div>

        </div>
    );
}


export default Chat;