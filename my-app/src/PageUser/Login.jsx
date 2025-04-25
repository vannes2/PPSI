import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS_User/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const showPopupAlert = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.user && result.user.role) {
          showPopupAlert("Login berhasil", "success");

          localStorage.setItem("user", JSON.stringify(result.user));

          setTimeout(() => {
            const userRole = result.user.role?.toLowerCase().trim();

            if (userRole === "admin") {
              navigate("/HomeAdmin");
            } else if (userRole === "user") {
              navigate("/HomeAfter");
            } else if (userRole === "pengacara") {
              navigate("/HomeLawyer");
            } else {
              showPopupAlert("Role tidak dikenal", "error");
            }
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
    }
  };

  return (
    <div className="Login-page">
      <Header />
      <br />
      <br />
      <br />
      <br />
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
              <input
                type="password"
                placeholder="Input your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgotpass" className="login-admin">
                Lupa Password anda? Klik di sini
              </Link>
              <button type="submit" className="btn">
                MASUK
              </button>
            </form>
          </div>

          <div className="divider"></div>

          <div className="signup">
            <h2 className="subtext">
              &quot;Mari kita mulai perjuangan bersama advokat&quot;
            </h2>
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
