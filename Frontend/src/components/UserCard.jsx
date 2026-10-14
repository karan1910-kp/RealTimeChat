import formatTime from "../utils/formatTime";
import { UserRound } from "lucide-react";
import "./UserList.css";

function UserCard({
    user,
    selectUser,
    unreadCount = 0,
    isOnline = false,
    lastMessage = null,
    isSelected = false,
}) {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectUser(user);
        }
    };

    const lastMessagePreview = lastMessage
        ? lastMessage.messageType === "image"
            ? "📷 Photo"
            : lastMessage.messageType === "file"
                ? `📎 ${lastMessage.fileName || "File"}`
                : lastMessage.message || "Message"
        : isOnline
            ? "Online"
            : "Offline";

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Open chat with ${user?.name || "Unknown User"}`}
            onClick={() => selectUser(user)}
            onKeyDown={handleKeyDown}
            className="user-card-neon group"
        >
            <div className="flex min-w-0 items-center gap-3">
                {/* AVATAR */}
                <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-400/10 text-indigo-200 ring-1 ring-white/10">
                        {user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name || "User"}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <UserRound size={22} aria-hidden="true" />
                        )}
                    </div>

                    {/* ONLINE STATUS */}
                    <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                            isOnline ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                        aria-label={isOnline ? "Online" : "Offline"}
                    />
                </div>

                {/* USER INFORMATION */}
                <div className="min-w-0 flex-1">
                    {/* USER NAME + TIME */}
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="min-w-0 truncate text-sm font-semibold tracking-wide text-slate-100 transition-colors group-hover:text-white">
                            {user?.name || "Unknown User"}
                        </h3>

                        {lastMessage?.createdAt && (
                            <small className="shrink-0 text-[10px] font-medium text-slate-500">
                                {formatTime(lastMessage.createdAt)}
                            </small>
                        )}
                    </div>

                    {/* LAST MESSAGE + UNREAD COUNT */}
                    <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-xs font-medium text-slate-400 transition-colors group-hover:text-slate-300">
                            {lastMessagePreview}
                        </p>

                        {unreadCount > 0 && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white shadow-md shadow-indigo-500/20">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCard;
