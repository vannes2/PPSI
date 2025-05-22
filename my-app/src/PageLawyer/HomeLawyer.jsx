import { useState, useEffect } from "react";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import SnackbarNotification from "../components/SnackbarNotification"; // sesuaikan path-nya
import "../CSS_Lawyer/HomeLawyer.css";
import { Link } from "react-router-dom";

const HomeLawyer = () => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setShowNotification(true);
    const timer = setTimeout(() => setShowNotification(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="HomeLawyer">
      <HeaderLawyer />

      {/* Hero Section */}
      <section className="hero-lawyer">
        <br /><br /><br /><br /><br /><br /><br />
        <div className="hero-content">
          <h1>Selamat Datang, Pengacara Profesional</h1>
          <p>
            Gabung bersama platform kami untuk membantu masyarakat mendapatkan
            konsultasi hukum yang mudah dan cepat.
          </p>

          <Link to="/KonsultasiLawyer">
            <button className="cta-button">Mulai Konsultasi</button>
          </Link>

          <Link to="/DaftarKasusLawyer">
            <button className="secondary-button">Lihat Kasus Pengguna</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-lawyer">
        <h2>Mengapa Bergabung dengan Kami?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Perluas Jangkauan</h3>
            <p>Temui klien dari berbagai daerah tanpa batasan geografis.</p>
          </div>
          <div className="feature-item">
            <h3>Kelola Jadwal Mudah</h3>
            <p>Atur waktu konsultasi Anda secara fleksibel langsung dari dashboard.</p>
          </div>
          <div className="feature-item">
            <h3>Bangun Reputasi</h3>
            <p>Dapatkan ulasan positif dan tingkatkan kredibilitas profesional Anda.</p>
          </div>
        </div>
      </section>

      {/* Snackbar Notification */}
      <SnackbarNotification
        message="Harap lengkapi nomor rekening bank Anda di halaman profil."
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default HomeLawyer;
