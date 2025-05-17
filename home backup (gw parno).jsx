import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const [pengacara, setPengacara] = useState([]);
  const [beritaTop, setBeritaTop] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === beritaTop.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [beritaTop]);

  return (
    <div className="home-before-page">
      <Header />
      <br /><br /><br />

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>Segera daftarkan diri Anda dan selesaikan masalah hukum Anda bersama Advokat terpercaya dari Kami</p>
          <div className="buttons">
            <Link to="/Login"><button>Masuk</button></Link>
            <Link to="/signup"><button>Daftar</button></Link>
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
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-comments icon-feature"></i>
            <h3>Konsultasi Hukum</h3>
            <p>Selesaikan masalah hukum Anda bersama advokat terbaik.</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-user-check icon-feature"></i>
            <h3>Ajukan Kasus</h3>
            <p>Dapatkan pendampingan hukum dari profesional.</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <i className="fas fa-balance-scale icon-feature"></i>
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
            <Link to="/Login" state={{ jenis_hukum: topik }} key={topik}>
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

      {/* Advokat */}
<section className="products">
  <div className="advokat-header">
    <h2 className="advokat-heading">Advokat Yang Tersedia</h2>
    <Link to="/Login" className="btn-selengkapnya">Selengkapnya &gt;</Link>
  </div>

  <div className="product-scroll-wrapper">
    {error ? (
      <p style={{ color: "red" }}>Gagal mengambil data: {error}</p>
    ) : pengacara.length > 0 ? (
      pengacara.slice(0, 8).map((advokat, index) => (
        <div key={advokat.id || index} className="product-item">
          <div className="advokat-foto-container">
            <img
              src={
                advokat.upload_foto
                  ? `http://localhost:5000/uploads/${advokat.upload_foto}`
                  : "/assets/img/default-profile.png"
              }
              alt={advokat.nama}
              className="foto-advokat"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/img/default-profile.png";
              }}
            />
          </div>
          <h3 className="advokat-nama">{advokat.nama}</h3>
          <p><strong>Spesialisasi:</strong> {advokat.spesialisasi || "-"}</p>
          <p><strong>Pengalaman:</strong> {advokat.pengalaman ?? 0} tahun</p>
          <p><strong>Harga Konsultasi:</strong> Rp{advokat.harga_konsultasi?.toLocaleString() || "-"}</p>
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

      {/* Slideshow Berita */}
      <section className="slideshow-section">
        <div className="slideshow-header">
          <h2 className="slideshow-heading">Berita Hukum Pilihan</h2>
          <Link to="/Login" className="btn-selengkapnya">Selengkapnya &gt;</Link>
        </div>

        <div className="slideshow-wrapper">
          <div
            className="slideshow-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {beritaTop.map((item) => (
              <div className="slide" key={item.id}>
                <Link to="/Login">
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

export default Home;
