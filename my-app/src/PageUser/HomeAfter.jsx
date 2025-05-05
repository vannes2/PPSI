import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const HomeAfter = () => {
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
      <HeaderAfter />
      <br />
      <br />
      <br />
      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>
            Segera daftarkan diri Anda dan selesaikan masalah hukum Anda bersama
            Advokat terpercaya dari Kami
          </p>
          <div className="buttons">
            <Link to="/konsultasi">
              <button>Konsultasi</button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/img/themis.png" alt="Ilustrasi Header" />
        </div>
      </section>

      {/* Card Buttons for 3 Options */}
      <section className="features-lawyer-home">
        <h2>Mengapa Bergabung dengan Kami?</h2>
        <div className="features-grid-home">
          <div className="feature-item-home">
            <h3>Perluas Jangkauan</h3>
            <p>Temui klien dari berbagai daerah tanpa batasan geografis.</p>
          </div>
          <div className="feature-item-home">
            <h3>Kelola Jadwal Mudah</h3>
            <p>Atur waktu konsultasi Anda secara fleksibel langsung dari dashboard.</p>
          </div>
          <div className="feature-item-home">
            <h3>Bangun Reputasi</h3>
            <p>Dapatkan ulasan positif dan tingkatkan kredibilitas profesional Anda.</p>
          </div>
        </div>
      </section>

      {/* Ikon Pilih Topik Hukum */}
      <section className="topik-hukum">
        <h2>Pilih topik hukum yang diperlukan!</h2>
        <div className="topik-icons">
          <Link to="/Konsultasi" state={{ jenis_hukum: "Hukum Pidana" }}>
            <div className="topik-icon">
              <i className="fas fa-coins" style={{ fontSize: "40px" }}></i>
              <p>Hukum Pidana</p>
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
            <Link to="/konsultasi" className="btn-right">
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

                <Link to="/konsultasi">
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

export default HomeAfter;
