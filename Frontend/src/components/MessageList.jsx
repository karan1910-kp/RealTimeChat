import formatTime from "../utils/formatTime";

import {
    Check,
    CheckCheck,
    FileText,
    Download,
    Reply
} from "lucide-react";

function MessageList({
    messages,
    user,
    selectedUser,
    isTyping,
    messagesEndRef,
    setReplyingTo,
    onDeleteMessage
}) {
    return (
        <div
            className="
                flex-1
                overflow-y-auto
                px-6
                py-6
                bg-pink-50
            "
        >
            {messages.map((msg, index) => {
                const isMyMessage =
                    String(msg.sender) ===
                    String(user._id);

                return (
                    <div
                        key={msg._id || index}
                        className={`
                            flex
                            mb-4
                            ${
                                isMyMessage
                                    ? "justify-end"
                                    : "justify-start"
                            }
                        `}
                    >
                        <div
                            className={`
                                max-w-[70%]
                                px-4
                                py-3
                                shadow-sm

                                ${
                                    isMyMessage
                                        ? `
                                            bg-pink-300
                                            text-slate-900
                                            rounded-2xl
                                            rounded-br-md
                                        `
                                        : `
                                            bg-sky-200
                                            text-slate-900
                                            rounded-2xl
                                            rounded-bl-md
                                        `
                                }
                            `}
                        >
                            {/* =========================
                                REPLIED MESSAGE
                            ========================== */}

                            {msg.replyTo && (
                                <div
                                    className="
                                        mb-2
                                        px-3
                                        py-2
                                        rounded-lg
                                        bg-white/60
                                        border-l-4
                                        border-pink-500
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            font-semibold
                                            text-pink-600
                                            mb-0.5
                                        "
                                    >
                                        {String(msg.replyTo.sender) ===
                                        String(user._id)
                                            ? "You"
                                            : selectedUser?.name || "User"}
                                    </p>

                                    {msg.replyTo.message ? (
                                        <p
                                            className="
                                                text-xs
                                                text-slate-600
                                                truncate
                                            "
                                        >
                                            {msg.replyTo.message}
                                        </p>
                                    ) : msg.replyTo.messageType === "image" ? (
                                        <p className="text-xs text-slate-600">
                                            🖼️ Image
                                        </p>
                                    ) : msg.replyTo.messageType === "file" ? (
                                        <p
                                            className="
                                                text-xs
                                                text-slate-600
                                                truncate
                                            "
                                        >
                                            📎{" "}
                                            {msg.replyTo.fileName || "File"}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-500">
                                            Attachment
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* =========================
                                TEXT MESSAGE
                            ========================== */}

                            {msg.messageType === "text" &&
                                msg.message && (
                                    <p
                                        className="
                                            text-sm
                                            font-medium
                                            leading-relaxed
                                            break-words
                                            whitespace-pre-wrap
                                        "
                                    >
                                        {msg.message}
                                    </p>
                                )}

                            {/* =========================
                                IMAGE MESSAGE
                            ========================== */}

                            {msg.messageType === "image" && (
                                <div>
                                    <img
                                        src={msg.fileUrl}
                                        alt={msg.fileName || "Image"}
                                        className="
                                            max-w-full
                                            max-h-80
                                            rounded-xl
                                            object-cover
                                            cursor-pointer
                                        "
                                        onClick={() =>
                                            window.open(
                                                msg.fileUrl,
                                                "_blank"
                                            )
                                        }
                                    />

                                    {msg.fileName && (
                                        <p
                                            className="
                                                text-xs
                                                mt-2
                                                opacity-70
                                            "
                                        >
                                            {msg.fileName}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* =========================
                                FILE MESSAGE
                            ========================== */}

                            {msg.messageType === "file" && (
                                <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        min-w-48
                                        hover:opacity-80
                                        transition
                                    "
                                >
                                    <div
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-white/70
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        "
                                    >
                                        <FileText size={21} />
                                    </div>

                                    <div
                                        className="
                                            flex-1
                                            min-w-0
                                        "
                                    >
                                        <p
                                            className="
                                                text-sm
                                                font-semibold
                                                truncate
                                            "
                                        >
                                            {msg.fileName}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                opacity-60
                                                mt-0.5
                                            "
                                        >
                                            Open file
                                        </p>
                                    </div>

                                    <Download
                                        size={18}
                                        className="shrink-0"
                                    />
                                </a>
                            )}

                            {/* =========================
                                TIME + SEEN
                            ========================== */}

                            <div
                                className={`
                                    flex
                                    items-center
                                    justify-end
                                    gap-1.5
                                    mt-1.5
                                    text-[10px]

                                    ${
                                        isMyMessage
                                            ? "text-pink-700"
                                            : "text-sky-700"
                                    }
                                `}
                            >
                                <span>
                                    {formatTime(msg.createdAt)}
                                </span>

                                {isMyMessage &&
                                    (msg.seen ? (
                                        <CheckCheck
                                            size={14}
                                            className="text-blue-600"
                                        />
                                    ) : (
                                        <Check size={14} />
                                    ))}
                            </div>

                            {/* =========================
                                REPLY + DELETE BUTTONS
                            ========================== */}

                            <div className="flex items-center gap-3 mt-1">
                                {/* Reply button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReplyingTo(msg)
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-[11px]
                                        text-slate-500
                                        hover:text-pink-600
                                        transition
                                        cursor-pointer
                                    "
                                >
                                    <Reply size={13} />
                                    Reply
                                </button>

                                {/* Delete button */}
                                {isMyMessage && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteMessage(
                                                msg._id
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            text-[11px]
                                            text-slate-500
                                            hover:text-red-500
                                            transition
                                            cursor-pointer
                                        "
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* =========================
                TYPING INDICATOR
            ========================== */}

            {isTyping && (
                <div
                    className="
                        flex
                        justify-start
                        mb-4
                    "
                >
                    <div
                        className="
                            bg-sky-200
                            rounded-2xl
                            rounded-bl-md
                            px-5
                            py-3
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-1
                            "
                        >
                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-sky-600
                                    animate-bounce
                                "
                            />

                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-sky-600
                                    animate-bounce
                                    [animation-delay:150ms]
                                "
                            />

                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-sky-600
                                    animate-bounce
                                    [animation-delay:300ms]
                                "
                            />
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
