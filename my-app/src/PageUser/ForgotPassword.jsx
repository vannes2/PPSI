import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS_User/ForgotPassword.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", success: false });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setPopup({ show: false, message: "", success: false });

    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setPopup({ show: true, message: data.message, success: res.ok });

      if (res.ok) {
        setTimeout(() => navigate("/verify-otp", { state: { email } }), 1500);
      }
    } catch (error) {
      setPopup({ show: true, message: "Terjadi kesalahan saat menghubungi server", success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <Header/>
      <div className="forgot-card">
        <br/>
        <br/>
        <br/>
        <br/>
        <h2>Lupa Password</h2>
        <p>Masukkan email yang terdaftar. Kami akan mengirimkan kode OTP untuk reset password Anda.</p>

        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-email"
        />

        <button onClick={handleSubmit} disabled={loading} className="btn-kirim">
          {loading ? <div className="spinner"></div> : "Kirim OTP"}
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

export default ForgotPassword;
