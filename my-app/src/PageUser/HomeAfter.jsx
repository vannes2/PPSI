import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import { FaCommentDots, FaUserCheck, FaBalanceScale } from "react-icons/fa";

const HomeAfter = () => {
  const [pengacara, setPengacara] = useState([]);
  const [beritaTop, setBeritaTop] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const cardWidth = 270; // Lebar tiap kartu advokat
  const cardsPerSlide = 5;

  // Hitung total slide berdasar jumlah advokat dan cardsPerSlide
  const totalSlides = Math.ceil(pengacara.length / cardsPerSlide);

  // Ambil data advokat dan berita top saat mount
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

    fetch("http://localhost:5000/api/artikel-berita/top")
      .then((res) => res.json())
      .then((data) => setBeritaTop(data))
      .catch((err) => console.error("Gagal fetch top berita:", err));
  }, []);

  // Auto scroll slide setiap 4 detik
  useEffect(() => {
    if (totalSlides === 0) return; // Jika kosong, skip interval
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="home-before-page">
      <HeaderAfter />
      <br /><br /><br />

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

      {/* Advokat Carousel */}
      <section className="products" style={{ marginTop: "40px" }}>
        <div className="advokat-header">
          <h2 className="advokat-heading">Advokat Yang Tersedia</h2>
          <Link to="/konsultasi" className="btn-selengkapnya">Selengkapnya &gt;</Link>
        </div>

        <div
          className="product-scroll-wrapper"
          style={{
            overflow: "hidden",
            width: cardWidth * cardsPerSlide + 20 * (cardsPerSlide -1), // +gap antar kartu
            margin: "0 auto",
            
          }}
        >
          <div
            className="product-track"
            style={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentSlide * (cardWidth + 20) * cardsPerSlide}px)`,
              gap: "20px",
            }}
          >
            {error ? (
              <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
            ) : pengacara.length > 0 ? (
              pengacara.map((advokat, index) => (
                <div
                  key={advokat.id || index}
                  className="product-item"
                  style={{ minWidth: `${cardWidth}px` }}
                >
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
                        marginBottom: "10px",
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
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#999",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        Tidak ada foto
                      </span>
                    </div>
                  )}
                  <h3>{advokat.nama}</h3>
                  <p>
                    <strong>Spesialisasi:</strong> {advokat.spesialisasi || "-"}
                  </p>
                  <p>
                    <strong>Pengalaman:</strong> {advokat.pengalaman ?? 0} tahun
                  </p>
                  <p>
                    <strong>Harga Konsultasi:</strong>{" "}
                    Rp{advokat.harga_konsultasi?.toLocaleString() || "-"}
                  </p>
                  <Link to="/payment" state={{ pengacaraId: advokat.id }}>
                    <button className="btn-konsultasi">Klik Konsultasi</button>
                  </Link>
                </div>
              ))
            ) : (
              <p>Belum ada advokat terdaftar</p>
            )}
          </div>
        </div>
      </section>

      {/* Slideshow Berita */}
      <section className="slideshow-section" style={{ marginTop: "60px" }}>
        <div className="slideshow-header">
          <h2 className="slideshow-heading">Berita Hukum Pilihan</h2>
          <Link to="/ArtikelBerita" className="btn-selengkapnya">
            Selengkapnya &gt;
          </Link>
        </div>

        <div className="slideshow-wrapper">
          <div
            className="slideshow-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {beritaTop.map((item) => (
              <div className="slide" key={item.id}>
                <Link to={`/DetailBerita/${item.id}`}>
                  <img
                    src={`http://localhost:5000/uploads/${item.gambar}`}
                    alt={item.judul}
                    className="slide-img"
                  />
                  <div className="slide-caption">
                    <h3 className="slide-title">{item.judul}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="slideshow-dots">
          {beritaTop.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default HomeAfter;
