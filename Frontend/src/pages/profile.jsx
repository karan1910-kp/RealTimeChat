import {
    useContext,
    useState
} from "react";

import {
    ArrowLeft,
    Camera,
    LogOut,
    Trash2,
    UserRound
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    AuthContext
} from "../context/ContextAuth";

import EditProfileModal from "../components/EditProfileModal";

import DeleteAccountModal from "../components/deleteAccountModal";

import {
    updateProfile
} from "../services/user.service";

import {
    deleteAccount,
    verifyPassword
} from "../services/auth.service";


function Profile() {

    const navigate = useNavigate();


    // ===============================
    // AUTH CONTEXT
    // ===============================

    const {
        user,
        token,
        setUser,
        logoutUser
    } = useContext(AuthContext);


    // ===============================
    // EDIT PROFILE MODAL
    // ===============================

    const [
        showEditProfileModal,
        setShowEditProfileModal
    ] = useState(false);


    // ===============================
    // DELETE ACCOUNT MODAL
    // ===============================

    const [
        showDeleteAccountModal,
        setShowDeleteAccountModal
    ] = useState(false);


    // ===============================
    // UPDATE PROFILE
    // ===============================

    const handleUpdateProfile = async (
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


            // Update user in AuthContext

            setUser(response.user);


            return response;

        } catch (error) {
            throw error;
        }
    };


    // ===============================
    // OPEN DELETE ACCOUNT MODAL
    // ===============================

    const handleDeleteAccount = () => {

        setShowDeleteAccountModal(true);

    };


    // ===============================
    // VERIFY PASSWORD
    // ===============================

    const handleVerifyPassword = async (
        password
    ) => {

        try {

            await verifyPassword(
                token,
                password
            );

        } catch (error) {
            throw error;
        }
    };


    // ===============================
    // CONFIRM DELETE ACCOUNT
    // ===============================

    const handleConfirmDeleteAccount = async (
        password
    ) => {

        try {

            await deleteAccount(
                token,
                password
            );


            // Clear authentication

            logoutUser();


            // Go to login page

            navigate("/");

        } catch (error) {
            throw error;
        }
    };


    // ===============================
    // LOGOUT
    // ===============================

    const handleLogout = () => {

        logoutUser();

        navigate("/");

    };


    // ===============================
    // USER NOT AVAILABLE
    // ===============================

    if (!user) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
            ">

                <p className="
                    text-slate-500
                ">
                    Loading profile...
                </p>

            </div>

        );
    }


    return (

        <div className="
            min-h-screen
            bg-slate-50
            flex
            flex-col
        ">


            {/* ===============================
                TOP HEADER
            =============================== */}

            <header className="
                h-[76px]
                px-5
                bg-white
                border-b
                border-slate-200
                flex
                items-center
            ">

                <button
                    type="button"
                    onClick={() => navigate("/chat")}
                    className="
                        flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-xl
                        text-slate-600
                        hover:bg-slate-100
                        hover:text-slate-900
                        transition-all
                        duration-200
                        cursor-pointer
                    "
                >

                    <ArrowLeft size={19} />

                    <span className="
                        text-sm
                        font-medium
                    ">
                        Back to Chat
                    </span>

                </button>


                <h1 className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    text-lg
                    font-semibold
                    text-slate-800
                ">
                    My Profile
                </h1>

            </header>


            {/* ===============================
                PROFILE CONTENT
            =============================== */}

            <main className="
                flex-1
                flex
                items-start
                justify-center
                px-4
                py-10
            ">

                <div className="
                    w-full
                    max-w-lg
                    bg-white
                    rounded-2xl
                    border
                    border-slate-200
                    shadow-sm
                    p-8
                ">


                    {/* ===============================
                        PROFILE PICTURE
                    =============================== */}

                    <div className="
                        flex
                        justify-center
                        mb-6
                    ">

                        <div className="
                            relative
                            w-32
                            h-32
                        ">

                            <div className="
                                w-32
                                h-32
                                rounded-full
                                overflow-hidden
                                bg-indigo-100
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                                border
                                border-slate-200
                            ">

                                {user.profilePicture ? (

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
                                        size={48}
                                    />

                                )}

                            </div>


                            {/* ===============================
                                CAMERA ICON
                            =============================== */}

                            <div className="
                                absolute
                                bottom-1
                                right-1
                                w-9
                                h-9
                                rounded-full
                                bg-indigo-600
                                text-white
                                flex
                                items-center
                                justify-center
                                border-4
                                border-white
                            ">

                                <Camera size={16} />

                            </div>

                        </div>

                    </div>


                    {/* ===============================
                        USER INFORMATION
                    =============================== */}

                    <div className="
                        text-center
                    ">

                        <h2 className="
                            text-2xl
                            font-bold
                            text-slate-900
                        ">

                            {user.name}

                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-500
                        ">

                            {user.email}

                        </p>

                    </div>


                    {/* ===============================
                        PROFILE DETAILS
                    =============================== */}

                    <div className="
                        mt-8
                        border-t
                        border-slate-200
                        pt-6
                    ">


                        {/* NAME */}

                        <div className="
                            mb-5
                        ">

                            <p className="
                                text-xs
                                font-medium
                                text-slate-400
                                uppercase
                                tracking-wide
                            ">
                                Name
                            </p>

                            <p className="
                                mt-1
                                text-base
                                font-medium
                                text-slate-800
                            ">
                                {user.name}
                            </p>

                        </div>


                        {/* EMAIL */}

                        <div>

                            <p className="
                                text-xs
                                font-medium
                                text-slate-400
                                uppercase
                                tracking-wide
                            ">
                                Email
                            </p>

                            <p className="
                                mt-1
                                text-base
                                font-medium
                                text-slate-800
                                break-all
                            ">
                                {user.email}
                            </p>

                        </div>

                    </div>


                    {/* ===============================
                        EDIT PROFILE BUTTON
                    =============================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowEditProfileModal(
                                true
                            )
                        }
                        className="
                            w-full
                            mt-8
                            px-4
                            py-3
                            rounded-xl
                            bg-indigo-600
                            text-white
                            font-medium
                            hover:bg-indigo-700
                            active:bg-indigo-800
                            transition-all
                            duration-200
                            cursor-pointer
                        "
                    >

                        Edit Profile

                    </button>


                    {/* ===============================
                        DELETE ACCOUNT BUTTON
                    =============================== */}

                    <button
                        type="button"
                        onClick={
                            handleDeleteAccount
                        }
                        className="
                            w-full
                            mt-3
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-red-200
                            text-red-600
                            font-medium
                            hover:bg-red-50
                            hover:border-red-300
                            transition-all
                            duration-200
                            cursor-pointer
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        <Trash2 size={17} />

                        Delete Account

                    </button>


                    {/* ===============================
                        LOGOUT BUTTON
                    =============================== */}

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        className="
                            w-full
                            mt-3
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-slate-200
                            text-slate-600
                            font-medium
                            hover:bg-slate-50
                            hover:text-slate-900
                            transition-all
                            duration-200
                            cursor-pointer
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </div>

            </main>


            {/* ===============================
                EDIT PROFILE MODAL
            =============================== */}

            <EditProfileModal
                isOpen={
                    showEditProfileModal
                }

                onClose={() =>
                    setShowEditProfileModal(
                        false
                    )
                }

                user={user}

                onSave={
                    handleUpdateProfile
                }
            />


            {/* ===============================
                DELETE ACCOUNT MODAL
            =============================== */}

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
    );
}


export default Profile;