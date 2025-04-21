import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_Lawyer/HomeLawyer.css';
import { Link } from 'react-router-dom';

const HomeLawyer = () => {
  return (
    <div className="HomeLawyer">
      {/* Header */}
      <HeaderLawyer />

      {/* Hero Section */}
      <section className="hero-lawyer">
        <div className="hero-content">
          <h1>Selamat Datang, Pengacara Profesional</h1>
          <p>Gabung bersama platform kami untuk membantu masyarakat mendapatkan konsultasi hukum yang mudah dan cepat.</p>
        <Link to="/KonsultasiLawyer">
            <button className="cta-button">Mulai Konsultasi</button>
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

      {/* Footer */}
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default HomeLawyer;
