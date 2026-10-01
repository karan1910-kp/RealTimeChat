import {
    UserRound,
    Circle,
    ArrowLeft
} from "lucide-react";


function ChatHeader({
    selectedUser,
    isOnline,
    onClearChat,
    onBack
}) {

    return (

        <div className="
            h-[76px]
            px-5
            bg-white
            border-b
            border-slate-200
            flex
            items-center
            justify-between
        ">


            {/* =================================
                LEFT SIDE
            ================================== */}

            {selectedUser ? (

                <div className="
                    flex
                    items-center
                    gap-3
                ">


                    {/* =========================
                        BACK BUTTON
                    ========================== */}

                    <button
                        type="button"
                        onClick={onBack}
                        title="Back to profile"
                        className="
                            w-9
                            h-9
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-slate-600
                            hover:bg-slate-100
                            hover:text-slate-900
                            transition-all
                            duration-200
                            cursor-pointer
                        "
                    >

                        <ArrowLeft
                            size={20}
                        />

                    </button>


                    {/* =========================
                        SELECTED USER AVATAR
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
                            text-indigo-600
                            flex
                            items-center
                            justify-center
                            overflow-hidden
                        ">

                            {selectedUser.profilePicture ? (

                                <img
                                    src={
                                        selectedUser.profilePicture
                                    }
                                    alt={
                                        selectedUser.name
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
                        NAME + STATUS
                    ========================== */}

                    <div>

                        <h2 className="
                            text-base
                            font-semibold
                            text-slate-900
                        ">

                            {selectedUser.name}

                        </h2>


                        <div className="
                            flex
                            items-center
                            gap-1.5
                            mt-0.5
                        ">

                            <Circle
                                size={7}
                                fill="currentColor"
                                className={
                                    isOnline
                                        ? "text-emerald-500"
                                        : "text-slate-400"
                                }
                            />


                            <span className="
                                text-xs
                                text-slate-500
                            ">

                                {isOnline
                                    ? "Online"
                                    : "Offline"
                                }

                            </span>

                        </div>

                    </div>

                </div>

            ) : (

                /* =================================
                    NO USER SELECTED
                ================================== */

                <div>

                    <h2 className="
                        text-lg
                        font-semibold
                        text-slate-800
                    ">

                        Select a conversation

                    </h2>


                    <p className="
                        text-xs
                        text-slate-400
                        mt-1
                    ">

                        Choose someone to start chatting

                    </p>

                </div>

            )}


            {/* =================================
                CLEAR CHAT
            ================================== */}

            <button
                type="button"
                onClick={onClearChat}
                disabled={!selectedUser}
                className="
                    px-3
                    py-2
                    rounded-xl
                    text-sm
                    font-medium
                    text-red-500
                    border
                    border-red-100
                    hover:bg-red-50
                    hover:border-red-200
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    transition-all
                    duration-200
                    cursor-pointer
                "
            >

                Clear Chat

            </button>

        </div>
    );
}


export default ChatHeader;