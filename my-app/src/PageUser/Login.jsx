import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS_User/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const showPopupAlert = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
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
        showPopupAlert("Login berhasil");

        localStorage.setItem("user", JSON.stringify(result.user));

        setTimeout(() => {
          setShowPopup(false);
          if (result.user.role === "admin") {
            navigate("/HomeAdmin");
          } else if (result.user.role === "user") {
            navigate("/HomeAfter");
          } else {
            showPopupAlert("Role tidak dikenal");
          }
        }, 2000);
      } else {
        showPopupAlert(result.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      showPopupAlert("Gagal terhubung ke server");
    }
  };

  return (
    <div className="Login-page">
      <Header />
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
            <h2 className="subtext">&quot;Mari kita mulai perjuangan bersama advokat&quot;</h2>
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

      <div className="footer-separator"></div>
      <Footer />

      {showPopup && (
      <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-icon">✔</div>
            <p className="popup-message">{popupMessage}</p>
          </div>
        </div>
)}
    </div>
  );
};

export default Login;