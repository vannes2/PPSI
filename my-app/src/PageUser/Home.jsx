import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaCommentDots,
  FaUserCheck,
  FaBalanceScale,
  FaBriefcase,
  FaMoneyBillWave,
  FaGraduationCap,
  FaTags,
} from "react-icons/fa";

const Home = () => {
  const [pengacara, setPengacara] = useState([]);
  const [beritaTop, setBeritaTop] = useState([]);
  const [, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollRef = useRef(null);
  const cardWidth = 270;
  const cardGap = 20;
  const visibleCards = 5;
  const totalScrollWidth =
    cardWidth * visibleCards + cardGap * (visibleCards - 1);

  const autoScrollTimeout = useRef(null);
  const autoScrollInterval = useRef(null);
  const lastInteractionTime = useRef(Date.now());

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
    if (beritaTop.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beritaTop.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [beritaTop]);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      recordInteraction();
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    const recordInteraction = () => {
      lastInteractionTime.current = Date.now();
      stopAutoScroll();
      if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
      autoScrollTimeout.current = setTimeout(() => {
        startAutoScroll();
      }, 2000);
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollInterval.current = setInterval(() => {
        const now = Date.now();
        const slider = scrollRef.current;
        if (!slider) return;

        if (now - lastInteractionTime.current > 2000) {
          const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
          const isAtEnd = Math.abs(slider.scrollLeft - maxScrollLeft) < 5;

          if (isAtEnd) {
            slider.scrollTo({ left: 0, behavior: "auto" });
          } else {
            slider.scrollBy({ left: totalScrollWidth, behavior: "smooth" });
          }
        }
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("touchstart", recordInteraction);
    slider.addEventListener("wheel", recordInteraction);
    slider.addEventListener("scroll", recordInteraction);

    startAutoScroll();

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("touchstart", recordInteraction);
      slider.removeEventListener("wheel", recordInteraction);
      slider.removeEventListener("scroll", recordInteraction);
    };
  }, []);

  return (
    <div className="home-before-page">
      <Header />
      <br />
      <br />
      <br />

      <section className="hero">
        <div className="hero-text">
          <h1 id="top-hero">Selesaikan Masalah Hukum Anda Bersama Kami</h1>
          <p>
            Daftarkan diri Anda dan konsultasikan masalah hukum Anda bersama
            Advokat terpercaya.
          </p>
          <div className="buttons">
            <Link to="/Login">
              <button>Konsultasi</button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/img/themis.png" alt="Ilustrasi Header" />
        </div>
      </section>

      <section className="features-lawyer-home">
        <h2>Konsultasikan Permasalah Hukum Anda Bersama Kami!</h2>
        <div className="features-grid-home">
          <Link to="/Login" className="feature-item-home">
            <FaCommentDots className="icon-feature" />
            <h3>Konsultasi Hukum</h3>
            <p>Selesaikan masalah hukum Anda bersama advokat terbaik.</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <FaUserCheck className="icon-feature" />
            <h3>Ajukan Kasus</h3>
            <p>Dapatkan pendampingan hukum dari profesional.</p>
          </Link>
          <Link to="/Login" className="feature-item-home">
            <FaBalanceScale className="icon-feature" />
            <h3>Berita & Artikel Hukum</h3>
            <p>
              Baca informasi dan edukasi hukum terkini secara lengkap dan
              terpercaya.
            </p>
          </Link>
        </div>
      </section>

      <section className="topik-hukum">
        <h2>Pilih topik hukum yang diperlukan!</h2>
        <div className="topik-icons">
          {["Hukum Pidana", "HAKI", "KDRT", "Perceraian", "Hukum Perdata"].map(
            (topik) => (
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
            )
          )}
        </div>
      </section>

      <section className="products" style={{ marginTop: "40px" }}>
        <div className="advokat-header">
          <h2 className="advokat-heading">Advokat Yang Tersedia</h2>
          <Link to="/Login" className="btn-selengkapnya">
            Selengkapnya &gt;
          </Link>
        </div>

        <div
          className="product-scroll-wrapper"
          ref={scrollRef}
          style={{
            width: `${cardWidth * visibleCards + cardGap * (visibleCards - 1)}px`,
            overflowX: "auto",
            margin: "0 auto",
            display: "flex",
            gap: `${cardGap}px`,
            padding: "10px",
            userSelect: "none",
            cursor: "grab",
          }}
        >
          {pengacara.length > 0 ? (
            pengacara.map((advokat, index) => (
              <div
                key={advokat.id || index}
                className="product-item"
                style={{ minWidth: `${cardWidth}px` }}
              >
                <div className="foto-advokat-container">
                  {advokat.upload_foto ? (
                    <img
                      src={`http://localhost:5000/uploads/${advokat.upload_foto}`}
                      alt={advokat.nama}
                      className="foto-advokat"
                    />
                  ) : (
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        backgroundColor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
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
                  <span className="online-indicator" title="Online" />
                </div>

                <h3>{advokat.nama}</h3>

                <div className="info-bar-horizontal">
                  <div className="info-bar info-box-border"> {/* Applied new class */}
                    <FaTags className="info-icon" />
                    <span>{advokat.spesialisasi || "-"}</span>
                  </div>
                  <div className="info-bar info-box-border"> {/* Applied new class */}
                    <FaBriefcase className="info-icon" />
                    <span>{advokat.pengalaman ?? 0} tahun</span>
                  </div>
                </div>

                <div className="info-bar-horizontal">
                  <div className="info-bar info-box-border"> {/* Applied new class */}
                    <FaMoneyBillWave className="info-icon" />
                    <span>
                      {advokat.harga_konsultasi != null
                        ? `${advokat.harga_konsultasi.toLocaleString("id-ID")}`
                        : "-"}
                    </span>
                  </div>

                  {/* ✅ Tambahan bagian pendidikan */}
                  <div className="info-bar info-box-border"> {/* Applied new class */}
                    <FaGraduationCap className="info-icon" />
                    <span>{advokat.pendidikan || "-"}</span>
                  </div>
                </div>

                <Link to="/Login" state={{ pengacaraId: advokat.id }}>
                  <button className="btn-konsultasi">Klik Konsultasi</button>
                </Link>
              </div>
            ))
          ) : (
            <p>Belum ada advokat terdaftar</p>
          )}
        </div>
      </section>

      <section className="slideshow-section" style={{ marginTop: "60px" }}>
        <div className="slideshow-header">
          <h2 className="slideshow-heading">Berita Hukum Pilihan</h2>
          <Link to="/Login" className="btn-selengkapnya">
            Selengkapnya &gt;
          </Link>
        </div>

        <div className="slideshow-wrapper">
          <div
            className="slideshow-track"
            style={{
              display: "flex",
              transition: "transform 0.5s ease-in-out",
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
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