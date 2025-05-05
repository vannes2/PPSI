import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const [pengacara, setPengacara] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/pengacara")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPengacara(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-before-page">
      {/* Navbar */}
      <Header />
      <br />
      <br />
      <br />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>
            Segera daftarkan diri Anda dan selesaikan masalah hukum Anda bersama
            Advokat terpercaya dari Kami
          </p>
          <div className="buttons">
            <Link to="/Login">
              <button>Masuk</button>
            </Link>
            <Link to="/signup">
              <button>Daftar</button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/img/themis.png" alt="Ilustrasi Header" />
        </div>
      </section>

      {/* Ikon Pilih Topik Hukum */}
      <section className="topik-hukum">
        <h2>Pilih topik hukum yang diperlukan!</h2>
        <div className="topik-icons">
          <Link to="/Konsultasi" state={{ jenis_hukum: "Ekonomi Gini" }}>
            <div className="topik-icon">
              <i className="fas fa-coins" style={{ fontSize: "40px" }}></i>
              <p>Ekonomi Gini</p>
            </div>
          </Link>
          <Link to="/Konsultasi" state={{ jenis_hukum: "HAKI" }}>
            <div className="topik-icon">
              <i className="fas fa-file-alt" style={{ fontSize: "40px" }}></i>
              <p>HAKI</p>
            </div>
          </Link>
          <Link to="/Konsultasi" state={{ jenis_hukum: "KDRT" }}>
            <div className="topik-icon">
              <i className="fas fa-handcuffs" style={{ fontSize: "40px" }}></i>
              <p>KDRT</p>
            </div>
          </Link>
          <Link to="/Konsultasi" state={{ jenis_hukum: "Perceraian" }}>
            <div className="topik-icon">
              <i className="fas fa-gavel" style={{ fontSize: "40px" }}></i>
              <p>Perceraian</p>
            </div>
          </Link>
          <Link to="/Konsultasi" state={{ jenis_hukum: "Pinjaman Online" }}>
            <div className="topik-icon">
              <i className="fas fa-dollar-sign" style={{ fontSize: "40px" }}></i>
              <p>Pinjaman Online</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Produk Section */}
      <section className="products">
        <div className="product-section">
          <h2 className="product-title">Advokat Yang Tersedia</h2>
          <div className="auth-buttons">
            <Link to="/Login" className="btn-right">
              <button>Selengkapnya &gt;</button>
            </Link>
          </div>
        </div>
        <div className="product-list">
          {error ? (
            <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
          ) : pengacara.length > 0 ? (
            pengacara.slice(0, 4).map((advokat, index) => (
              <div key={advokat.id || index} className="product-item">
                <img
                  src={`/assets/images/advokat${index + 1}.png`}
                  alt="Advokat"
                />
                <p>
                  <strong>{advokat.nama}</strong>
                  <br />
                  {advokat.spesialisasi}
                  <br />
                  Pengalaman: {advokat.pengalaman} tahun
                </p>

                <Link to="/Login">
                  <button className="btn-konsultasi">Klik Konsultasi</button>
                </Link>
              </div>
            ))
          ) : (
            <p>Belum ada advokat terdaftar</p>
          )}
        </div>
      </section>

      <div className="footer-separator"></div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
