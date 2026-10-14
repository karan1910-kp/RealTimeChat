import { useEffect, useState } from "react";
import {
    X,
    Camera,
    UserRound,
    Mail,
    ShieldCheck,
    Save,
    LoaderCircle,
    ImagePlus,
} from "lucide-react";
import "./EditProfileModel.css";

function EditProfileModal({ isOpen, onClose, user, onSave }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load the latest saved user details whenever the modal opens.
    useEffect(() => {
        if (!isOpen || !user) return;

        setName(user.name || "");
        setEmail(user.email || "");
        setProfilePicture(null);
        setPreview(user.profilePicture || null);
        setError("");
    }, [user, isOpen]);

    // Revoke local preview URLs so repeated image changes do not leak memory.
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // Allow Escape to close the modal when a save is not in progress.
    useEffect(() => {
        if (!isOpen || loading) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") handleClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // handleClose is intentionally kept local to this component.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, loading]);

    const handleClose = () => {
        if (loading) return;
        setProfilePicture(null);
        setPreview(user?.profilePicture || null);
        setError("");
        onClose();
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Your profile photo must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setProfilePicture(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setError("Please enter your name.");
            return;
        }

        if (!trimmedEmail) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await onSave(trimmedName, trimmedEmail, profilePicture);

            // Restore the saved image preview and close on success.
            setProfilePicture(null);
            setPreview(user?.profilePicture || null);
            onClose();
        } catch (saveError) {
            setError(
                saveError.response?.data?.message ||
                saveError.message ||
                "We couldn't update your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const initials = name.trim().charAt(0).toUpperCase() || "U";

    return (
        <div
            className="edit-profile-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    handleClose();
                }
            }}
        >
            <section
                className="edit-profile-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-title"
                aria-describedby="edit-profile-description"
            >
                <div className="edit-profile-topline" aria-hidden="true" />

                <header className="edit-profile-header">
                    <div>
                        <span className="edit-profile-kicker">
                            <span className="edit-profile-status-dot" />
                            ACCOUNT SETTINGS
                        </span>
                        <h2 id="edit-profile-title">
                            Edit <span>profile</span>
                        </h2>
                        <p id="edit-profile-description">
                            Keep your details up to date.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="edit-profile-close"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close edit profile"
                    >
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="edit-profile-photo-section">
                        <div className="edit-profile-avatar-wrap">
                            <div className="edit-profile-avatar-ring">
                                <div className="edit-profile-avatar">
                                    {preview ? (
                                        <img src={preview} alt="Profile preview" />
                                    ) : (
                                        <span>{initials}</span>
                                    )}
                                </div>
                            </div>

                            <label
                                className={`edit-profile-photo-button ${loading ? "is-disabled" : ""}`}
                                aria-label="Change profile photo"
                                title="Change profile photo"
                            >
                                <Camera size={17} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                    aria-label="Upload a profile photo"
                                />
                            </label>
                        </div>

                        <div className="edit-profile-photo-copy">
                            <strong>Profile photo</strong>
                            <span>JPG, PNG or WebP · up to 5 MB</span>
                        </div>

                        <label className={`edit-profile-upload ${loading ? "is-disabled" : ""}`}>
                            <ImagePlus size={16} />
                            <span>Change</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                aria-label="Choose a new profile photo"
                            />
                        </label>
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="edit-profile-name">Full name</label>
                        <div className="edit-profile-input-wrap">
                            <UserRound size={18} aria-hidden="true" />
                            <input
                                id="edit-profile-name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                                maxLength={100}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="edit-profile-email">Email address</label>
                        <div className="edit-profile-input-wrap">
                            <Mail size={18} aria-hidden="true" />
                            <input
                                id="edit-profile-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                maxLength={254}
                                required
                                disabled={loading}
                            />
                        </div>
                        <span className="edit-profile-field-hint">
                            Use an email address you can access.
                        </span>
                    </div>

                    {error && (
                        <div className="edit-profile-error" role="alert">
                            <span className="edit-profile-error-mark">!</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="edit-profile-security-note">
                        <ShieldCheck size={18} aria-hidden="true" />
                        <span>Your profile details are handled securely.</span>
                    </div>

                    <footer className="edit-profile-actions">
                        <button
                            type="button"
                            className="edit-profile-cancel"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-profile-save"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={17} className="edit-profile-spinner" />
                                    <span>Saving changes...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={17} />
                                    <span>Save changes</span>
                                </>
                            )}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}

export default EditProfileModal;
