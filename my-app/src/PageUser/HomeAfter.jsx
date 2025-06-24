import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/Home.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import {
  FaCommentDots,
  FaUserCheck,
  FaBalanceScale,
  FaBriefcase,
  FaGraduationCap,
  FaMoneyBillWave,
  FaTags,
} from "react-icons/fa";

const HomeAfter = () => {
  const [pengacara, setPengacara] = useState([]);
  const [beritaTop, setBeritaTop] = useState([]);
  const [, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollRef = useRef(null);
  const cardWidth = 270;
  const cardGap = 20;
  const visibleCards = 5;
  const totalScrollWidth = cardWidth * visibleCards + cardGap * (visibleCards - 1);

  const autoScrollTimeout = useRef(null);
  const autoScrollInterval = useRef(null);
  const lastInteractionTime = useRef(Date.now());

  // ✅ Fetch pengacara + rating
  useEffect(() => {
    const fetchPengacaraWithRating = async () => {
      try {
        const res = await fetch("https://ppsi-production.up.railway.app/api/profilpengacara");
        if (!res.ok) throw new Error("Gagal ambil data");
        const data = await res.json();

        const dataDenganRating = await Promise.all(
          data.map(async (pengacara) => {
            try {
              const ratingRes = await fetch(
                `https://ppsi-production.up.railway.app/api/reviews/rating/${pengacara.id}`
              );
              const ratingData = await ratingRes.json();
              return {
                ...pengacara,
                rating: ratingData.average_rating || 0,
              };
            } catch (error) {
              console.error("Gagal ambil rating:", error);
              return { ...pengacara, rating: 0 };
            }
          })
        );

        setPengacara(dataDenganRating);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPengacaraWithRating();

    fetch("https://ppsi-production.up.railway.app/api/artikel-berita/top")
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
      <HeaderAfter />
      <br /><br /><br />

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
          <center><h2>Membantu Korban Mendapatkan Bantuan Pendampingan dengan Lembaga Bantuan Hukum (LBH) </h2></center>
          <Link to="/FormKonsultasiFree" className="feature-item-home">
             <FaUserCheck className="icon-feature" />
            <h3>Formulir Konsultasi Gratis</h3>
            <p>Membantu Korban Mendapatkan Bantuan Pendampingan dengan Lembaga Bantuan Hukum (LBH) <spam>Lembaga Bantuan Hukum (LBH) adalah garda terdepan dalam memberikan akses keadilan bagi masyarakat yang tidak mampu dan termarjinalkan. Mendampingi korban untuk mendapatkan bantuan dari LBH adalah tindakan mulia yang memastikan hak-hak hukum mereka terlindungi. Proses ini memerlukan pemahaman tentang cara kerja LBH dan persiapan yang matang.</spam></p>
          </Link>
        </div>
      </section>

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

      <section className="products" style={{ marginTop: "40px" }}>
        <div className="advokat-header">
          <h2 className="advokat-heading">Advokat Yang Tersedia</h2>
          <Link to="/konsultasi" className="btn-selengkapnya">Selengkapnya &gt;</Link>
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
          {pengacara.length > 0 ? pengacara.map((advokat, index) => (
            <div key={advokat.id || index} className="product-item" style={{ minWidth: `${cardWidth}px` }}>
              <div className="foto-advokat-container">
                {advokat.upload_foto ? (
                  <img
                    src={`https://ppsi-production.up.railway.app/uploads/${advokat.upload_foto}`}
                    alt={advokat.nama}
                    className="foto-advokat"
                  />
                ) : (
                  <div
                    style={{
                      width: "160px",
                      height: "200px",
                      borderRadius: "12px",
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>
                      Tidak ada foto
                    </span>
                  </div>
                )}
                <span className="online-indicator" title="Online" />
              </div>

              <h3>{advokat.nama}</h3>

              <div className="info-bar-horizontal">
                <div className="info-bar">
                  <FaTags className="info-icon" />
                  <span>{advokat.spesialisasi || "-"}</span>
                </div>
                <div className="info-bar">
                  <FaBriefcase className="info-icon" />
                  <span>{advokat.pengalaman ?? 0} tahun</span>
                </div>
              </div>

              <div className="info-bar-horizontal">
                <div className="info-bar">
                  <FaMoneyBillWave className="info-icon" />
                  <span>{advokat.harga_konsultasi != null ? `${advokat.harga_konsultasi.toLocaleString("id-ID")}` : "-"}</span>
                </div>
                <div className="info-bar">
                  <FaGraduationCap className="info-icon" />
                  <span>{advokat.pendidikan || "-"}</span>
                </div>
              </div>

              {/* ⭐ RATING STARS */}
              <div className="rating-stars">
                {(() => {
                  const rating = Number(advokat.rating) || 0;
                  const fullStars = Math.floor(rating);
                  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                  return (
                    <>
                      {[...Array(fullStars)].map((_, i) => (
                        <span key={`full-${i}`} className="star full">★</span>
                      ))}
                      {hasHalfStar && <span className="star half">⯪</span>}
                      {[...Array(emptyStars)].map((_, i) => (
                        <span key={`empty-${i}`} className="star empty">★</span>
                      ))}
                    </>
                  );
                })()}
                <span className="rating-number">
                  ({isNaN(Number(advokat.rating)) ? "0.0" : Number(advokat.rating).toFixed(1)})
                </span>
              </div>

              <Link to="/payment" state={{ pengacaraId: advokat.id }}>
                <button className="btn-konsultasi">Klik Konsultasi</button>
              </Link>
            </div>
          )) : <p>Belum ada advokat terdaftar</p>}
        </div>
      </section>

      <section className="slideshow-section" style={{ marginTop: "60px" }}>
        <div className="slideshow-header">
          <h2 className="slideshow-heading">Berita Hukum Pilihan</h2>
          <Link to="/ArtikelBerita" className="btn-selengkapnya">Selengkapnya &gt;</Link>
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
                <Link to={`/DetailBerita/${item.id}`}>
                  <img src={`https://ppsi-production.up.railway.app/uploads/${item.gambar}`} alt={item.judul} className="slide-img" />
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
