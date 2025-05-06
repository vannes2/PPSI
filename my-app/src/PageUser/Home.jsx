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

      {/* Section Info Fitur */}
      <section className="features-lawyer-home">
        <h2>Konsultasikan Permasalah Hukum Anda Bersama Kami!</h2>
        <div className="features-grid-home">
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-comments icon-feature"></i>
            <h3>Konsultasi Hukum</h3>
            <p>Klik untuk mulai sekarang dan selesaikan masalah hukum Anda bersama kami!</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-user-check icon-feature"></i>
            <h3>Ajukan Kasus Anda</h3>
            <p>Dapatkan pendampingan hukum profesional dari pengacara berpengalaman.</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-balance-scale icon-feature"></i>
            <h3>Legal Connect</h3>
            <p>Cari & Pilih layanan advokat terbaik yang sesuai dengan kebutuhan Anda.</p>
          </Link>
        </div>
      </section>

      {/* Ikon Pilih Topik Hukum */}
      <section className="topik-hukum">
        <h2>Pilih topik hukum yang diperlukan!</h2>
        <div className="topik-icons">
          <Link to="/Login" state={{ jenis_hukum: "Hukum Pidana" }}>
            <div className="topik-icon">
              <img
                className="topik-icons"
                alt="hukumpidana"
                src="assets/img/iconsHukumPidana.png"
              />
              <p>Hukum Pidana</p>
            </div>
          </Link>
          <Link to="/login" state={{ jenis_hukum: "HAKI" }}>
            <div className="topik-icon">
              <img
                className="topik-icons"
                alt="Haki"
                src="assets/img/iconsHAKI.png"
              />
              <p>HAKI</p>
            </div>
          </Link>
          <Link to="/login" state={{ jenis_hukum: "KDRT" }}>
          <div className="topik-icon">
              <img
                className="topik-icons"
                alt="hukumpidana"
                src="assets/img/iconsKDRT.png"
              />
              <p>Hukum KDRT</p>
            </div>
          </Link>
          <Link to="/login" state={{ jenis_hukum: "Perceraian" }}>
            <div className="topik-icon">
            <img
                className="topik-icons"
                alt="Perceraian"
                src="assets/img/iconsPerceraian.png"
              />
              <p>Perceraian</p>
            </div>
          </Link>
          <Link to="/login" state={{ jenis_hukum: "Pinjaman Online" }}>
            <div className="topik-icon">
            <img
                className="topik-icons"
                alt="Perdata"
                src="assets/img/iconsHukumPerdata.png"
              />
              <p>Hukum Perdata</p>
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
      <Footer />
    </div>
  );
};
export default Home;
