import React from "react";
import { useNavigate } from "react-router-dom";
import "./SnackbarNotification.css";

const SnackbarNotification = ({ message, show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleNavigate = () => {
    navigate("/register-bank");
    if (onClose) onClose();
  };

  return (
    <div
      className="snackbar-notification"
      role="alert"
      aria-live="assertive"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose();
        }
      }}
    >
      <span className="snackbar-icon" aria-hidden="true">⚠️</span>
      <span className="snackbar-message">{message}</span>
      <button
        className="snackbar-btn"
        onClick={handleNavigate}
        aria-label="Daftar Nomor Rekening Bank"
      >
        Daftar Rekening
      </button>
      <button
        className="snackbar-close-btn"
        onClick={onClose}
        aria-label="Tutup Notifikasi"
      >
        &times;
      </button>
    </div>
  );
};

export default SnackbarNotification;
