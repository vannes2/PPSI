import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS_User/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showPopupAlert = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPopupMessage("");
    setPopupType("success");
    setShowPopup(false);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.user && result.user.role) {
          showPopupAlert("Login berhasil", "success");
          // Simpan data user lengkap (termasuk photo_url)
          localStorage.setItem("user", JSON.stringify(result.user));

          setTimeout(() => {
            const userRole = result.user.role.toLowerCase().trim();
            if (userRole === "admin") navigate("/HomeAdmin");
            else if (userRole === "user") navigate("/HomeAfter");
            else if (userRole === "pengacara") navigate("/HomeLawyer");
            else showPopupAlert("Role tidak dikenal", "error");
          }, 2000);
        } else {
          showPopupAlert("Login gagal: data user tidak valid.", "error");
        }
      } else {
        showPopupAlert(result.message || "Login gagal, silakan cek data Anda.", "error");
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      showPopupAlert("Gagal terhubung ke server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Login-page">
      <Header />
      <br /><br /><br /><br />
      <div className="container">
        <div className="main">
          <div className="login">
            <h2>Selamat Datang Kembali</h2>
            <form onSubmit={handleSubmit}>
              <p>E-mail</p>
              <input
                type="email"
                placeholder="Input your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p>Kata sandi</p>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Input your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#B31312"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.5 0-9.9-3.6-11-8 1.06-3.67 4.5-7 11-7a10.94 10.94 0 0 1 5.94 1.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#B31312"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <Link to="/forgot-password" className="login-admin">
                Lupa Password anda? Klik di sini
              </Link>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? "Memproses..." : "MASUK"}
              </button>
            </form>
          </div>

          <div className="divider"></div>

          <div className="signup">
            <h2 className="subtext">Mari kita mulai perjuangan bersama advokat</h2>
            <h2>Buat Akun Anda</h2>
            <Link to="/signup" className="btn">
              MENDAFTAR
            </Link>
            <Link to="/RegisterLawyerPage" className="btn">
              PENDAFTARAN LAWYER
            </Link>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className={`popup-icon ${popupType === "error" ? "error" : ""}`}>
              {popupType === "error" ? "✖" : "✔"}
            </div>
            <p className="popup-message">{popupMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="popup-overlay">
          <div className="popup-content loading">
            <div className="spinner"></div>
            <p>Memverifikasi akun...</p>
          </div>
        </div>
      )}

      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Login;
