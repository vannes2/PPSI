import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS_User/VerifyOtp.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", success: false });

  const { state } = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      setPopup({ show: true, message: "OTP tidak boleh kosong", success: false });
      return;
    }

    setLoading(true);
    setPopup({ show: false, message: "", success: false });

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, otp }),
      });

      const data = await res.json();
      setPopup({ show: true, message: data.message, success: res.ok });

      if (res.ok) {
        setTimeout(() => navigate("/reset-password", { state: { email: state.email } }), 1500);
      }
    } catch (err) {
      setPopup({ show: true, message: "Terjadi kesalahan saat koneksi ke server", success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <Header />
      <div className="otp-card">
        <h2>Verifikasi OTP</h2>
        <p>Silakan masukkan kode OTP yang dikirim ke email Anda</p>

        <input
          type="text"
          placeholder="Masukkan OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input-otp"
        />

        <button onClick={handleVerify} disabled={loading} className="btn-verify">
          {loading ? <div className="spinner" /> : "Verifikasi"}
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

export default VerifyOtp;
