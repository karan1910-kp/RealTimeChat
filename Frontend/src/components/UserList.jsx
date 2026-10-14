import { Users } from "lucide-react";
import UserCard from "./UserCard";
import "./UserList.css";

function UserList({
    users = [],
    selectUser,
    unreadMessages = {},
    onlineUsers = [],
    lastMessages = {},
    selectedUser = null,
}) {
    return (
        <div className="user-list-panel flex h-full min-h-0 flex-col">
           {/* CONVERSATIONS HEADER */}

<div className="
    flex shrink-0 items-center justify-between gap-3
    border-b border-cyan-400/15
    px-4 py-4
">

    {/* LEFT: ICON + TITLE */}

    <div className="flex min-w-0 items-center gap-3">

        <div className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            border border-indigo-400/25
            bg-gradient-to-br from-indigo-500/20 to-cyan-500/10
            text-cyan-300
            shadow-lg shadow-cyan-500/5
        ">
            <Users size={20} aria-hidden="true" />
        </div>

        <div className="min-w-0">

            <h2 className="
                truncate
                text-sm font-bold tracking-wide
                text-white
            ">
                Conversations
            </h2>

            <p className="
                mt-1
                text-xs font-medium
                text-slate-400
            ">
                Your recent chats
            </p>

        </div>

    </div>


    {/* RIGHT: USER COUNT */}



</div>

            {/* USER LIST */}
            <div className="user-list-scroll min-h-0 flex-1 overflow-y-auto pb-3">
                {users.length > 0 ? (
                    users.map((item) => {
                        const userId = String(item._id);

                        return (
                            <UserCard
                                key={item._id}
                                user={item}
                                selectUser={selectUser}
                                unreadCount={unreadMessages[userId] || 0}
                                isOnline={onlineUsers.includes(userId)}
                                lastMessage={lastMessages[userId]}
                                isSelected={String(selectedUser?._id || "") === userId}
                            />
                        );
                    })
                ) : (
                    <div className="user-list-empty mx-3 mt-2 rounded-2xl px-4 py-8 text-center">
                        <Users size={25} className="mx-auto mb-3 text-slate-500" aria-hidden="true" />
                        <p className="text-sm font-medium text-slate-200">No users found</p>
                        <p className="mt-1 text-xs text-slate-500">Try another search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;
