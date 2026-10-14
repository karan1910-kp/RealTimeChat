import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? XCircle
      : AlertCircle;

  return (
    <div className={`toast toast-${type}`} role="status">
      <Icon size={23} className="toast-icon" />

      <div className="toast-content">
        <strong>
          {type === "success"
            ? "Success"
            : type === "error"
            ? "Something went wrong"
            : "Notice"}
        </strong>

        <p>{message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;