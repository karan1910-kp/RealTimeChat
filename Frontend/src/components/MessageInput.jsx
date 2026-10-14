import {
    useRef,
    useState
} from "react";

import {
    Send,
    Smile,
    Paperclip,
    X,
    FileText,
    Image as ImageIcon
} from "lucide-react";

import { uploadFile } from "../services/message.service";
import "./MessageInput.css";

function MessageInput({
    selectedUser,
    message,
    setMessage,
    socket,
    sendMessage,
    typingTimeoutRef,
    token,
    replyingTo,
    setReplyingTo
}) {

    const [
        showEmojiPicker,
        setShowEmojiPicker
    ] = useState(false);

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);

    const [
        uploading,
        setUploading
    ] = useState(false);


    const fileInputRef = useRef(null);


    const emojis = [
        "😀",
        "😃",
        "😄",
        "😁",
        "😂",
        "🤣",
        "😊",
        "😍",
        "🥰",
        "😎",
        "😉",
        "😘",
        "😭",
        "😢",
        "😡",
        "😱",
        "👍",
        "👎",
        "❤️",
        "🔥",
        "🎉",
        "🙏",
        "👋",
        "💯",
        "🥳",
        "👏",
        "🙌",
        "🤝",
        "💔",
        "✨",
        "❤️‍🔥",
        "😂"
    ];


    if (!selectedUser) {
        return null;
    }


    const handleEmojiClick = (emoji) => {

        setMessage(
            message + emoji
        );

        setShowEmojiPicker(false);
    };


    const handleFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedFile(file);

        e.target.value = "";
    };


    const removeSelectedFile = () => {

        setSelectedFile(null);
    };


    const handleSendFile = async () => {

        if (!selectedFile || !socket) {
            return;
        }


        try {

            setUploading(true);


            const response =
                await uploadFile(
                    selectedFile,
                    token
                );


            socket.emit(
                "sendMessage",
                {
                    receiver:
                        selectedUser._id,

                    message: "",

                    messageType:
                        selectedFile.type.startsWith(
                            "image/"
                        )
                            ? "image"
                            : "file",

                    fileUrl:
                        response.fileUrl,

                    fileName:
                        response.fileName,

                    fileType:
                        response.fileType
                }
            );


            setSelectedFile(null);


        } catch (error) {
            alert(
                error.response?.data?.message ||
                "File upload failed"
            );
        } finally {

            setUploading(false);
        }
    };


    const handleSend = () => {

        if (selectedFile) {

            handleSendFile();

            return;
        }

        sendMessage();
    };


    return (

        <div
            className="
                shrink-0
                border-t border-slate-800
                bg-slate-900
                px-5 py-4
            "
        >

            {/* FILE PREVIEW */}

            {selectedFile && (

                <div
                    className="
                        mb-3
                        flex
                        items-center
                        justify-between
                        gap-3
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        px-3
                        py-2
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            min-w-0
                        "
                    >

                        {selectedFile.type.startsWith(
                            "image/"
                        ) ? (
                            <ImageIcon
                                size={20}
                                className="
                                    text-pink-500
                                    shrink-0
                                "
                            />
                        ) : (
                            <FileText
                                size={20}
                                className="
                                    text-pink-500
                                    shrink-0
                                "
                            />
                        )}

                        <div className="min-w-0">

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-100
                                    truncate
                                "
                            >
                                {selectedFile.name}
                            </p>

                            <p
                                className="
                                    text-xs
                                    text-slate-400
                                "
                            >
                                {(
                                    selectedFile.size /
                                    1024 /
                                    1024
                                ).toFixed(2)}{" "}
                                MB
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            removeSelectedFile
                        }
                        className="
                            w-8
                            h-8
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:text-red-500
                            hover:bg-slate-700
                            transition
                            cursor-pointer
                        "
                    >

                        <X size={18} />

                    </button>

                </div>
            )}


            {/* EMOJI PICKER */}

            {showEmojiPicker && (

                <div
                    className="
                        mb-3
                        w-72
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-2xl
                        shadow-xl
                        p-3
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-8
                            gap-1
                        "
                    >

                        {emojis.map(
                            (emoji, index) => (

                                <button
                                    key={`${emoji}-${index}`}
                                    type="button"
                                    onClick={() =>
                                        handleEmojiClick(
                                            emoji
                                        )
                                    }
                                    className="
                                        text-xl
                                        w-8
                                        h-8
                                        rounded-lg
                                        flex
                                        items-center
                                        justify-center
                                        text-slate-100
                                        hover:bg-slate-700
                                        hover:scale-110
                                        transition
                                        cursor-pointer
                                    "
                                >
                                    {emoji}
                                </button>

                            )
                        )}

                    </div>

                </div>
            )}

{/*Replying Feature*/}
{replyingTo && (
    <div
        className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
        "
    >
        <div className="min-w-0">
            <p className="
                text-xs
                font-semibold
                text-pink-400
            ">
                Replying to message
            </p>

            <p className="
                text-sm
                text-slate-200
                truncate
            ">
                {replyingTo.message ||
                    replyingTo.fileName ||
                    "Attachment"}
            </p>
        </div>

        <button
            type="button"
            onClick={() => setReplyingTo(null)}
            className="
                text-slate-400
                hover:text-red-500
                cursor-pointer
            "
        >
            ✕
        </button>
    </div>
)}



            {/* MESSAGE INPUT */}

            <div
                className="
                    message-input-neon
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    px-3
                    py-2
                    transition-all
                    duration-200
                "
            >

                {/* ATTACH FILE */}

                <button
                    type="button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    className="
                        shrink-0
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        text-slate-400
                        hover:text-indigo-300
                        hover:bg-slate-700
                        transition
                        cursor-pointer
                    "
                    title="Attach file"
                >

                    <Paperclip size={19} />

                </button>


                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                />


                {/* MESSAGE INPUT */}

                <input
                    type="text"
                    placeholder={
                        selectedFile
                            ? "Press send to attach file..."
                            : "Type a message..."
                    }
                    value={message}
                    disabled={Boolean(selectedFile)}
                    onChange={(e) => {

                        const value =
                            e.target.value;

                        setMessage(value);


                        if (
                            !selectedUser ||
                            !socket
                        ) {
                            return;
                        }


                        if (value.trim()) {

                            socket.emit(
                                "typing",
                                selectedUser._id
                            );


                            clearTimeout(
                                typingTimeoutRef.current
                            );


                            typingTimeoutRef.current =
                                setTimeout(() => {

                                    socket.emit(
                                        "stopTyping",
                                        selectedUser._id
                                    );

                                }, 1000);

                        } else {

                            clearTimeout(
                                typingTimeoutRef.current
                            );


                            socket.emit(
                                "stopTyping",
                                selectedUser._id
                            );
                        }

                    }}
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter" &&
                            !e.shiftKey
                        ) {

                            e.preventDefault();

                            handleSend();
                        }

                    }}
                    className="
                        flex-1
                        min-w-0
                        bg-transparent
                        outline-none
                        border-none
                        text-sm
                        text-white
                        placeholder:text-slate-400
                        py-2
                        disabled:opacity-60
                    "
                />


                {/* EMOJI */}

                <button
                    type="button"
                    onClick={() =>
                        setShowEmojiPicker(
                            !showEmojiPicker
                        )
                    }
                    className={`
                        shrink-0
                        w-9
                        h-9
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        transition
                        cursor-pointer

                        ${
                            showEmojiPicker
                                ? "text-indigo-300 bg-slate-700"
                                : "text-slate-400 hover:text-indigo-300 hover:bg-slate-700"
                        }
                    `}
                    title="Emoji"
                >

                    <Smile size={19} />

                </button>


                {/* SEND */}

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={
                        uploading ||
                        (
                            !message.trim() &&
                            !selectedFile
                        )
                    }
                    className="
                        shrink-0
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        bg-indigo-600
                        hover:bg-indigo-500
                        text-white
                        shadow-sm
                        hover:shadow-md
                        disabled:bg-slate-600
                        disabled:cursor-not-allowed
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                    title={
                        uploading
                            ? "Uploading..."
                            : "Send"
                    }
                >

                    {uploading ? (

                        <span
                            className="
                                w-4
                                h-4
                                border-2
                                border-white
                                border-t-transparent
                                rounded-full
                                animate-spin
                            "
                        />

                    ) : (

                        <Send size={18} />

                    )}

                </button>

            </div>

        </div>
    );
}

export default MessageInput;