import { useEffect, useState } from "react";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import SnackbarNotification from "../components/SnackbarNotification"; // sesuaikan path-nya
import "../CSS_Lawyer/HomeLawyer.css";
import { Link } from "react-router-dom";

const HomeLawyer = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    // Ambil data user dari localStorage
    const lawyer = JSON.parse(localStorage.getItem("user"));
    if (!lawyer || !lawyer.id) {
      // Jika data lawyer tidak ada, langsung tampilkan notifikasi
      setShowNotification(true);
      setLoadingCheck(false);
      return;
    }

    // Cek data rekening bank di backend
    fetch(`http://localhost:5000/api/pengacara/check-bank/${lawyer.id}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          // Jika data rekening tidak lengkap maka tampilkan notifikasi
          if (
            !data.bank_name ||
            !data.account_number ||
            !data.account_name
          ) {
            setShowNotification(true);
          } else {
            setShowNotification(false);
          }
        } catch (err) {
          console.error("Response bukan JSON valid:", text);
          setShowNotification(true);
        }
      })
      .catch((err) => {
        console.error("Gagal cek data rekening bank:", err);
        setShowNotification(true);
      })
      .finally(() => setLoadingCheck(false));
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
      {!loadingCheck && (
        <SnackbarNotification
          message="Harap lengkapi nomor rekening bank Anda di halaman profil."
          show={showNotification}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default HomeLawyer;
