import React from "react";
import "./SnackbarNotification.css";

const SnackbarNotification = ({ message, show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="snackbar-notification"
      role="alert"
      aria-live="assertive"
      onClick={onClose}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      <span className="snackbar-icon" aria-hidden="true">⚠️</span>
      <span className="snackbar-message">{message}</span>
    </div>
  );
};

export default SnackbarNotification;
