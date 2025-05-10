import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS_User/ResetPassword.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", success: false });
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setPopup({ show: true, message: "Semua field harus diisi", success: false });
      return;
    }

    setLoading(true);
    setPopup({ show: false, message: "", success: false });

    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, password, confirmPassword }),
      });

      const data = await res.json();
      setPopup({ show: true, message: data.message, success: res.ok });

      if (res.ok) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setPopup({ show: true, message: "Terjadi kesalahan saat koneksi ke server", success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <Header/>
      <div className="reset-card">
        <h2>Reset Password</h2>
        <p>Silakan buat password baru Anda</p>

        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-reset"
        />
        <input
          type="password"
          placeholder="Konfirmasi password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-reset"
        />

        <button onClick={handleReset} disabled={loading} className="btn-reset">
          {loading ? <div className="spinner"></div> : "Reset Password"}
        </button>

        {popup.show && (
          <div className={`popup ${popup.success ? "popup-success" : "popup-error"}`}>
            {popup.message}
          </div>
        )}
      </div>

      <div className="footer-separator" />
      <Footer />
    </div>
  );
};

export default ResetPassword;
