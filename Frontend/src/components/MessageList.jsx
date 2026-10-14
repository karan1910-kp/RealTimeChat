import {
    Check,
    CheckCheck,
    FileText,
    Download,
    Reply,
} from "lucide-react";
import formatTime from "../utils/formatTime";
import "./MessageList.css";

function MessageList({
    messages,
    user,
    selectedUser,
    isTyping,
    messagesEndRef,
    setReplyingTo,
    onDeleteMessage,
}) {
    return (
        <div
            className="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6 bg-[#080D12] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {messages.map((msg, index) => {
                const isMyMessage = String(msg.sender) === String(user?._id);
                const isTextMessage = msg.messageType === "text" && Boolean(msg.message);

                return (
                    <div
                        key={msg._id || index}
                        className={`mb-4 flex ${
                            isMyMessage ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`
                                relative min-w-0 max-w-[85%] break-words px-4 py-3 shadow-sm
                                sm:max-w-[70%]
                                ${isMyMessage
                                    ? "rounded-2xl rounded-br-md bg-[#0964a0] text-white"
                                    : "rounded-2xl rounded-bl-md bg-[#202B38] text-white"
                                }
                                ${isTextMessage ? "message-bubble--animated-border" : ""}
                            `}
                        >
                            {/* Replied message preview */}
                            {msg.replyTo && (
                                <div className="mb-2 rounded-lg border-l-4 border-white/50 bg-black/20 px-3 py-2">
                                    <p className="mb-0.5 text-[11px] font-semibold text-white">
                                        {String(msg.replyTo.sender) === String(user?._id)
                                            ? "You"
                                            : selectedUser?.name || "User"}
                                    </p>

                                    {msg.replyTo.message ? (
                                        <p className="truncate text-xs text-slate-200">
                                            {msg.replyTo.message}
                                        </p>
                                    ) : msg.replyTo.messageType === "image" ? (
                                        <p className="text-xs text-slate-200">🖼️ Image</p>
                                    ) : msg.replyTo.messageType === "file" ? (
                                        <p className="truncate text-xs text-slate-200">
                                            📎 {msg.replyTo.fileName || "File"}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-slate-300">Attachment</p>
                                    )}
                                </div>
                            )}

                            {/* Text message */}
                            {msg.messageType === "text" && msg.message && (
                                <p className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">
                                    {msg.message}
                                </p>
                            )}

                            {/* Image message: no animated border */}
                            {msg.messageType === "image" && (
                                <div>
                                    <img
                                        src={msg.fileUrl}
                                        alt={msg.fileName || "Image attachment"}
                                        loading="lazy"
                                        className="max-h-80 max-w-full cursor-pointer rounded-xl object-cover"
                                        onClick={() => {
                                            if (msg.fileUrl) {
                                                window.open(
                                                    msg.fileUrl,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }
                                        }}
                                    />

                                    {msg.fileName && (
                                        <p className="mt-2 break-words text-xs text-white/80">
                                            {msg.fileName}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* File message: no animated border */}
                            {msg.messageType === "file" && (
                                <a
                                    href={msg.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/20">
                                        <FileText size={21} aria-hidden="true" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="break-words text-sm font-semibold">
                                            {msg.fileName || "File"}
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/70">
                                            Open file
                                        </p>
                                    </div>

                                    <Download size={18} className="shrink-0" aria-hidden="true" />
                                </a>
                            )}

                            {/* Timestamp and delivery/read status */}
                            <div
                                className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${
                                    isMyMessage ? "text-white/80" : "text-slate-400"
                                }`}
                            >
                                <span>{formatTime(msg.createdAt)}</span>

                                {isMyMessage && (
                                    msg.seen ? (
                                        <CheckCheck
                                            size={14}
                                            className="text-white"
                                            aria-label="Seen"
                                        />
                                    ) : (
                                        <Check size={14} aria-label="Sent" />
                                    )
                                )}
                            </div>

                            {/* Message actions */}
                            <div className="mt-1 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReplyingTo(msg)}
                                    className="flex cursor-pointer items-center gap-1 text-[11px] text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                    aria-label="Reply to message"
                                >
                                    <Reply size={13} aria-hidden="true" />
                                    Reply
                                </button>

                                {isMyMessage && (
                                    <button
                                        type="button"
                                        onClick={() => onDeleteMessage?.(msg._id)}
                                        className="flex cursor-pointer items-center gap-1 text-[11px] text-white/70 transition hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
                                        aria-label="Delete message"
                                    >
                                        <span aria-hidden="true">🗑️</span>
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Typing indicator */}
            {isTyping && (
                <div className="mb-4 flex justify-start" aria-label="User is typing">
                    <div className="rounded-2xl rounded-bl-md bg-[#202B38] px-5 py-3 shadow-sm">
                        <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#36D879]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#36D879] [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#36D879] [animation-delay:300ms]" />
                        </div>
                    </div>
                </div>
            )}

            {/* Auto-scroll reference */}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
