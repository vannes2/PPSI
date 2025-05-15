import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS_User/ResetPassword.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle password baru
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle konfirmasi password
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

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-reset"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Sembunyikan password baru" : "Tampilkan password baru"}
            title={showPassword ? "Sembunyikan password baru" : "Tampilkan password baru"}
          >
                    {showPassword ? ( 
              // eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#B31312" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.5 0-9.9-3.6-11-8 1.06-3.67 4.5-7 11-7a10.94 10.94 0 0 1 5.94 1.94"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              // eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#B31312" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        <div className="password-wrapper" style={{ marginTop: "15px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-reset"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
            title={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
          >
            {showPassword ? ( 
              // eye-off SVG
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#B31312" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.5 0-9.9-3.6-11-8 1.06-3.67 4.5-7 11-7a10.94 10.94 0 0 1 5.94 1.94"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              // eye SVG
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#B31312" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>

        <button onClick={handleReset} disabled={loading} className="btn-reset" style={{ marginTop: "20px" }}>
          {loading ? <div className="spinner"></div> : "Reset Password"}
        </button>

        {popup.show && (
          <div className={`popup ${popup.success ? "popup-success" : "popup-error"}`} style={{ marginTop: "15px" }}>
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
