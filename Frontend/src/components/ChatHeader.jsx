import { useState } from "react";
import {
    UserRound,
    ArrowLeft,
    Video,
    MoreVertical,
    Trash2,
    Circle,
} from "lucide-react";
import "./ChatHeader.css";

function ChatHeader({
    selectedUser,
    onBack,
    onClearChat,
    isOnline,
    onVideoCall,
}) {
    const [showMenu, setShowMenu] = useState(false);

    const handleBack = () => {
        setShowMenu(false);
        onBack?.();
    };

    const handleVideoCall = () => {
        if (selectedUser && onVideoCall) {
            onVideoCall();
        }
    };

    const handleClearChat = () => {
        setShowMenu(false);
        if (selectedUser && onClearChat) {
            onClearChat();
        }
    };

    return (
        <header className="chat-header-neon relative z-20 flex min-h-[82px] shrink-0 items-center justify-between gap-3 px-3 py-3 sm:px-5">
            {/* Back button and selected user */}
            <div className="relative z-[1] flex min-w-0 items-center gap-2.5 sm:gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    title="Back to user list"
                    aria-label="Back to user list"
                    className="chat-header-icon-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
                >
                    <ArrowLeft size={23} strokeWidth={2.2} />
                </button>

                <div className="chat-header-avatar-frame relative shrink-0">
                    <div className="chat-header-avatar flex h-12 w-12 items-center justify-center overflow-hidden rounded-full sm:h-[54px] sm:w-[54px]">
                        {selectedUser?.profilePicture ? (
                            <img
                                src={selectedUser.profilePicture}
                                alt={selectedUser.name || "User"}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserRound size={26} strokeWidth={1.8} />
                        )}
                    </div>
                    <span
                        className={`chat-header-presence absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 ${
                            isOnline ? "is-online" : "is-offline"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-bold tracking-tight text-white sm:text-lg">
                        {selectedUser?.name || "Select a user"}
                    </h2>
                    <div className="mt-1 flex items-center gap-2">
                        <Circle
                            size={8}
                            fill="currentColor"
                            className={isOnline ? "text-emerald-400" : "text-slate-500"}
                        />
                        <span
                            className={`text-xs font-medium ${
                                isOnline ? "text-emerald-300" : "text-slate-400"
                            }`}
                        >
                            {isOnline ? "Online" : "Offline"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="relative z-[1] flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    onClick={handleVideoCall}
                    disabled={!selectedUser}
                    title="Start video call"
                    aria-label="Start video call"
                    className="chat-header-video-btn flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                >
                    <Video size={22} strokeWidth={2.1} className="sm:h-6 sm:w-6" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowMenu((previous) => !previous)}
                        title="Chat options"
                        aria-label="Chat options"
                        aria-expanded={showMenu}
                        className="chat-header-icon-btn flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                    >
                        <MoreVertical size={23} />
                    </button>

                    {showMenu && (
                        <>
                            <button
                                type="button"
                                aria-label="Close chat options"
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="chat-header-menu absolute right-0 top-[calc(100%+10px)] z-20 w-48 overflow-hidden rounded-xl py-1">
                                <button
                                    type="button"
                                    disabled={!selectedUser}
                                    onClick={handleClearChat}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Trash2 size={17} className="text-rose-400" />
                                    Clear Chat
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default ChatHeader;
