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
      navigate("/HomeAfterLogin");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="Login-page">
      {/* header */}
      <Header />

      <div className="container">
        <div className="main">
          {/* Login Section */}
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
              <Link to="/Loginadmin" className="login-admin">
                Login sebagai Admin
              </Link>
              <button type="submit" className="btn">
                MASUK
              </button>
            </form>
          </div>
          <div className="divider"></div> {/* Divider line */}
          {/* Signup Section */}
          <div className="signup">
            <h2 className="subtext">&quot;Mari kita mulai perjalanan kulit anda&quot;</h2>
            <h2>Buat Akun Anda</h2>
            <Link to="/signup" className="btn">
                MENDAFTAR
            </Link>
            </div>
        </div>
      </div>

      <div className="footer-separator"></div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
