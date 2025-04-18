import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../CSS_User/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
        alert("Login berhasil");

        // Simpan user ke local storage
        localStorage.setItem("user", JSON.stringify(result.user));

        // Redirect sesuai role
        if (result.user.role === "admin") {
          navigate("/HomeAdmin");
        } else if (result.user.role === "user") {
          navigate("/HomeAfter");
        } else {
          alert("Role tidak dikenal");
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Gagal terhubung ke server");
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
          </div>
        </div>
      </div>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Login;
