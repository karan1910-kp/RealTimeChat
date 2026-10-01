import {
    Users
} from "lucide-react";

import UserCard from "./UserCard";


function UserList({
    users,
    selectUser,
    unreadMessages,
    onlineUsers,
    lastMessages
}) {

    return (

        <div className="
            flex
            flex-col
            h-full
        ">

            {/* =========================
                USERS HEADER
            ========================== */}

            <div className="
                px-4
                py-4
                flex
                items-center
                justify-between
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <div className="
                        w-9
                        h-9
                        rounded-xl
                        bg-indigo-100
                        text-indigo-600
                        flex
                        items-center
                        justify-center
                    ">

                        <Users size={19} />

                    </div>


                    <div>

                        <h2 className="
                            text-lg
                            font-bold
                            text-slate-900
                        ">
                            Messages
                        </h2>

                        <p className="
                            text-xs
                            text-slate-400
                        ">
                            {users.length} users
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                USER LIST
            ========================== */}

            <div className="
                flex-1
                overflow-y-auto
                px-1
                pb-3
            ">

                {users.map((item) => (

                    <UserCard
                        key={item._id}
                        user={item}
                        selectUser={selectUser}
                        unreadCount={
                            unreadMessages[
                                String(item._id)
                            ] || 0
                        }
                        isOnline={
                            onlineUsers.includes(
                                String(item._id)
                            )
                        }
                        lastMessage={
                            lastMessages[
                                String(item._id)
                            ]
                        }
                    />

                ))}

            </div>

        </div>
    );
}


export default UserList;