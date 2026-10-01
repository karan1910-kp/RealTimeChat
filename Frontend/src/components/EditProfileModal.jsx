import { useEffect, useState } from "react";
import { X, Camera } from "lucide-react";

function EditProfileModal({
    isOpen,
    onClose,
    user,
    onSave
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] =
        useState(null);

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ===============================
    // Load Existing User Data
    // ===============================

    useEffect(() => {

        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");

            setPreview(
                user.profilePicture || null
            );
        }

    }, [user]);


    // ===============================
    // Close Modal
    // ===============================

    const handleClose = () => {

        setProfilePicture(null);
        setError("");
        onClose();

    };


    // ===============================
    // Select Image
    // ===============================

    const handleImageChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        // Check image

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select an image file"
            );
            return;
        }


        // Check size

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image must be smaller than 5 MB"
            );
            return;
        }


        setError("");
        setProfilePicture(file);


        // Create preview

        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };


    // ===============================
    // Save Profile
    // ===============================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (!email.trim()) {
            setError("Email is required");
            return;
        }


        try {

            setLoading(true);
            setError("");


            await onSave(
                name,
                email,
                profilePicture
            );


            handleClose();

        } catch (error) {

            console.log(
                "Update Profile Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update profile"
            );

        } finally {

            setLoading(false);

        }
    };


    if (!isOpen) {
        return null;
    }


    return (
        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
        ">

            <div className="
                w-full
                max-w-md
                rounded-2xl
                bg-white
                shadow-2xl
                p-6
            ">


                {/* ===============================
                    Header
                =============================== */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                        text-slate-800
                    ">
                        Edit Profile
                    </h2>


                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            text-slate-500
                            hover:text-slate-800
                        "
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* ===============================
                    Profile Picture
                =============================== */}

                <div className="
                    flex
                    justify-center
                    mb-6
                ">

                    <div className="
                        relative
                        w-28
                        h-28
                    ">

                        <div className="
                            w-28
                            h-28
                            rounded-full
                            overflow-hidden
                            bg-slate-200
                            flex
                            items-center
                            justify-center
                            border
                            border-slate-300
                        ">

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Profile"
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                    "
                                />

                            ) : (

                                <span className="
                                    text-3xl
                                    font-semibold
                                    text-slate-500
                                ">
                                    {name
                                        ? name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}
                                </span>

                            )}

                        </div>


                        {/* Camera Button */}

                        <label className="
                            absolute
                            bottom-0
                            right-0
                            w-9
                            h-9
                            rounded-full
                            bg-blue-600
                            text-white
                            flex
                            items-center
                            justify-center
                            cursor-pointer
                            hover:bg-blue-700
                        ">

                            <Camera size={18} />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </label>

                    </div>

                </div>


                {/* ===============================
                    Form
                =============================== */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >


                    {/* Name */}

                    <div>

                        <label className="
                            block
                            mb-1
                            text-sm
                            font-medium
                            text-slate-700
                        ">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                py-2.5
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* Email */}

                    <div>

                        <label className="
                            block
                            mb-1
                            text-sm
                            font-medium
                            text-slate-700
                        ">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                px-3
                                py-2.5
                                outline-none
                                focus:border-blue-500
                            "
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <p className="
                            text-sm
                            text-red-600
                        ">
                            {error}
                        </p>

                    )}


                    {/* Buttons */}

                    <div className="
                        flex
                        justify-end
                        gap-3
                        pt-3
                    ">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                border
                                border-slate-300
                                text-slate-700
                                hover:bg-slate-100
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-4
                                py-2
                                rounded-lg
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >

                            {loading
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditProfileModal;