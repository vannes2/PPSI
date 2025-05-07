import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import { FaCommentDots, FaUserCheck, FaBalanceScale } from "react-icons/fa";

const HomeAfter = () => {
  const [pengacara, setPengacara] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profilpengacara") // ✅ gunakan endpoint yang benar
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>Daftarkan diri Anda dan konsultasikan masalah hukum Anda bersama Advokat terpercaya.</p>
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

      {/* Fitur Section */}
      <section className="features-lawyer-home">
        <h2>Konsultasikan Permasalah Hukum Anda Bersama Kami!</h2>
        <div className="features-grid-home">
          <Link to="/konsultasi" className="feature-item-home">
            <FaCommentDots className="icon-feature" />
            <h3>Konsultasi Hukum</h3>
            <p>Selesaikan masalah hukum Anda bersama advokat terbaik.</p>
          </Link>
          <Link to="/DaftarKasus" className="feature-item-home">
            <FaUserCheck className="icon-feature" />
            <h3>Ajukan Kasus</h3>
            <p>Dapatkan pendampingan hukum dari profesional.</p>
          </Link>
          <Link to="/konsultasi" className="feature-item-home">
            <FaBalanceScale className="icon-feature" />
            <h3>Legal Connect</h3>
            <p>Pilih layanan hukum sesuai kebutuhan Anda.</p>
          </Link>
        </div>
      </section>

      {/* Topik Hukum */}
      <section className="topik-hukum">
        <h2>Pilih topik hukum yang diperlukan!</h2>
        <div className="topik-icons">
          {["Hukum Pidana", "HAKI", "KDRT", "Perceraian", "Hukum Perdata"].map((topik) => (
            <Link to="/Konsultasi" state={{ jenis_hukum: topik }} key={topik}>
              <div className="topik-icon">
                <img
                  className="topik-icons"
                  src={`/assets/img/icons${topik.replace(/\s/g, "")}.png`}
                  alt={topik}
                />
                <p>{topik}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Advokat Section */}
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
                {advokat.upload_foto ? (
                  <img
                    src={`http://localhost:5000/uploads/${advokat.upload_foto}`}
                    alt={advokat.nama}
                    className="foto-advokat"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "10px"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "10px"
                    }}
                  >
                    <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
                      Tidak ada foto
                    </span>
                  </div>
                )}

                <h3>{advokat.nama}</h3>
                <p><strong>Spesialisasi:</strong> {advokat.spesialisasi || "-"}</p>
                <p><strong>Pengalaman:</strong> {advokat.pengalaman ?? 0} tahun</p>
                <p><strong>Harga Konsultasi:</strong> Rp{advokat.harga_konsultasi?.toLocaleString() || "-"}</p>
                <Link to="/konsultasi" state={{ pengacaraId: advokat.id }}>
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
