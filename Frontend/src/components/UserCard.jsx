import formatTime from "../utils/formatTime";

import {
    UserRound
} from "lucide-react";


function UserCard({
    user,
    selectUser,
    unreadCount,
    isOnline,
    lastMessage
}) {

    return (

        <div
            onClick={() => selectUser(user)}
            className="
                group
                mx-2
                mb-2
                p-3
                rounded-2xl
                cursor-pointer
                border
                border-transparent
                hover:border-slate-200
                hover:bg-slate-50
                hover:shadow-sm
                transition-all
                duration-200
            "
        >

            <div className="
                flex
                items-center
                gap-3
            ">


                {/* =========================
                    AVATAR
                ========================== */}

                <div className="
                    relative
                    shrink-0
                ">

                    <div className="
                        w-11
                        h-11
                        rounded-full
                        bg-indigo-100
                        flex
                        items-center
                        justify-center
                        text-indigo-600
                        font-semibold
                        overflow-hidden
                    ">

                        {user?.profilePicture ? (

                            <img
                                src={
                                    user.profilePicture
                                }
                                alt={
                                    user.name
                                }
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                            />

                        ) : (

                            <UserRound
                                size={21}
                            />

                        )}

                    </div>


                    {/* =========================
                        ONLINE DOT
                    ========================== */}

                    <span
                        className={`
                            absolute
                            right-0
                            bottom-0
                            w-3
                            h-3
                            rounded-full
                            border-2
                            border-white

                            ${
                                isOnline
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                            }
                        `}
                    />

                </div>


                {/* =========================
                    USER INFORMATION
                ========================== */}

                <div className="
                    flex-1
                    min-w-0
                ">


                    {/* =========================
                        NAME + TIME
                    ========================== */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    ">

                        <h3 className="
                            font-semibold
                            text-sm
                            text-slate-800
                            truncate
                        ">

                            {user.name}

                        </h3>


                        {lastMessage && (

                            <small className="
                                shrink-0
                                text-[11px]
                                text-slate-400
                            ">

                                {formatTime(
                                    lastMessage.createdAt
                                )}

                            </small>

                        )}

                    </div>


                    {/* =========================
                        LAST MESSAGE
                    ========================== */}

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        mt-1
                    ">

                        <p className="
                            text-xs
                            text-slate-500
                            truncate
                        ">

                            {lastMessage
                                ? lastMessage.message
                                : isOnline
                                    ? "Online"
                                    : "Offline"
                            }

                        </p>


                        {/* =========================
                            UNREAD COUNT
                        ========================== */}

                        {unreadCount > 0 && (

                            <span className="
                                shrink-0
                                min-w-5
                                h-5
                                px-1.5
                                rounded-full
                                bg-indigo-600
                                text-white
                                text-[10px]
                                font-bold
                                flex
                                items-center
                                justify-center
                            ">

                                {unreadCount}

                            </span>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default UserCard;