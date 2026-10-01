import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

function DeleteAccountModal({
    isOpen,
    onClose,
    onVerifyPassword,
    onConfirmDelete
}) {

    const [password, setPassword] = useState("");
    const [step, setStep] = useState("password");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleContinue = async () => {

        if (!password.trim()) {
            setError("Please enter your password");
            return;
        }

        setError("");
        setLoading(true);

        try {

            await onVerifyPassword(password);

            setStep("confirm");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Incorrect password"
            );

        } finally {

            setLoading(false);

        }
    };

    const handleClose = () => {

        setPassword("");
        setError("");
        setStep("password");

        onClose();
    };

const handleFinalDelete = async () => {

    setLoading(true);
    setError("");

    try {

        await onConfirmDelete(password);

    } catch (error) {

        setError(
            error.response?.data?.message ||
            "Unable to delete account"
        );

    } finally {

        setLoading(false);

    }
};

    return (
        <div className="
            fixed inset-0
            z-50
            flex items-center justify-center
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

                {/* HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-10 h-10
                            rounded-full
                            bg-red-100
                            text-red-600
                            flex
                            items-center
                            justify-center
                        ">
                            <AlertTriangle size={20} />
                        </div>

                        <h2 className="
                            text-lg
                            font-semibold
                            text-slate-900
                        ">
                            Delete Account
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            text-slate-400
                            hover:text-slate-700
                            cursor-pointer
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* PASSWORD STEP */}

                {step === "password" && (
                    <>
                        <p className="
                            text-sm
                            text-slate-500
                            mb-5
                        ">
                            For your security, enter your password
                            before deleting your account.
                        </p>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            mb-2
                        ">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter your password"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-3
                                text-sm
                                outline-none
                                focus:border-red-400
                                focus:ring-2
                                focus:ring-red-100
                            "
                        />

                        {error && (
                            <p className="
                                mt-2
                                text-sm
                                text-red-500
                            ">
                                {error}
                            </p>
                        )}

                        <div className="
                            flex
                            justify-end
                            gap-3
                            mt-6
                        ">

                            <button
                                type="button"
                                onClick={handleClose}
                                className="
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                    cursor-pointer
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={loading}
                                className="
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-red-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                {loading
                                    ? "Checking..."
                                    : "Continue"
                                }
                            </button>

                        </div>
                    </>
                )}


                {/* FINAL CONFIRMATION */}

                {step === "confirm" && (
                    <>
                        <div className="
                            rounded-xl
                            bg-red-50
                            border
                            border-red-100
                            p-4
                            mb-5
                        ">

                            <p className="
                                text-sm
                                font-medium
                                text-red-700
                            ">
                                Your password is correct.
                            </p>

                            <p className="
                                text-sm
                                text-red-600
                                mt-1
                            ">
                                Your account and all associated
                                messages will be permanently deleted.
                                This action cannot be undone.
                            </p>

                        </div>

                        {error && (
                            <p className="
                                mb-3
                                text-sm
                                text-red-500
                            ">
                                {error}
                            </p>
                        )}

                        <div className="
                            flex
                            justify-end
                            gap-3
                        ">

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    text-sm
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                    cursor-pointer
                                "
                            >
                                No, Keep Account
                            </button>

                            <button
                                type="button"
                                onClick={handleFinalDelete}
                                disabled={loading}
                                className="
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-red-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                {loading
                                    ? "Deleting..."
                                    : "Yes, Delete Account"
                                }
                            </button>

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default DeleteAccountModal;