import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import { FaCommentDots, FaUserCheck, FaBalanceScale } from "react-icons/fa";

const HomeAfter = () => {
  const [pengacara, setPengacara] = useState([]);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const cardWidth = 270; // width termasuk margin/gap
  const cardsPerSlide = 4;
  const slideInterval = 5000;

  useEffect(() => {
    fetch("http://localhost:5000/api/profilpengacara")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil data");
        return res.json();
      })
      .then((data) => setPengacara(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll saat tidak berinteraksi
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInteracting && scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft + cardWidth * cardsPerSlide >= maxScroll) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth * cardsPerSlide, behavior: "smooth" });
        }
      }
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isInteracting, pengacara]);

  // Tambah event listener untuk mendeteksi interaksi
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleEnter = () => setIsInteracting(true);
    const handleLeave = () => setIsInteracting(false);

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("mouseleave", handleLeave);
    container.addEventListener("touchstart", handleEnter);
    container.addEventListener("touchend", handleLeave);

    return () => {
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
      container.removeEventListener("touchstart", handleEnter);
      container.removeEventListener("touchend", handleLeave);
    };
  }, []);

  return (
    <div className="home-before-page">
      <HeaderAfter />
      <br />
      <br />
      <br />

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>Daftarkan diri Anda dan konsultasikan masalah hukum Anda bersama Advokat terpercaya.</p>
          <div className="buttons">
            <Link to="/konsultasi"><button>Konsultasi</button></Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/img/themis.png" alt="Ilustrasi Header" />
        </div>
      </section>

      {/* Fitur */}
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
          <Link to="/ArtikelBerita" className="feature-item-home">
            <FaBalanceScale className="icon-feature" />
            <h3>Berita & Artikel Hukum</h3>
            <p>Baca informasi dan edukasi hukum terkini secara lengkap dan terpercaya.</p>
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
            <Link to="/konsultasi" className="btn-right"><button>Selengkapnya &gt;</button></Link>
          </div>
        </div>

        <div className="product-scroll-wrapper" ref={scrollRef}>
          {error ? (
            <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
          ) : pengacara.length > 0 ? (
            pengacara.map((advokat, index) => (
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
                  <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px"
                  }}>
                    <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>Tidak ada foto</span>
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
