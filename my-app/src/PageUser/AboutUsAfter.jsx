import { useEffect } from "react";
import Footer from "../components/Footer";
import HeaderAfter from "../components/HeaderAfter";
import '../CSS_User/AboutUs.css';

const AboutUsAfter = () => {
  // Scroll ke atas saat halaman dimuat
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-container">
      <HeaderAfter />
      <br /><br /><br /><br /><br />

      <main>
        <section>
          <div className="about-us">
            <h1>Tentang Kami</h1>
          </div>
          <div className="content-aboutus">
            <p>
              Cerdas Hukum adalah platform yang memberikan akses mudah bagi masyarakat untuk memahami hukum dan mendapatkan konsultasi gratis dari para ahli. 
              Dengan tujuan meningkatkan kesadaran dan literasi hukum, Cerdas Hukum menyediakan berbagai layanan, seperti artikel edukatif, tanya jawab hukum,
              serta konsultasi langsung dengan pengacara profesional.
            </p>
          </div>
          <div className="content-welcome">
            <p>Selamat datang di Cerdas Hukum, tempat di mana perjuangan dimulai!</p>
          </div>
        </section>
      </main>

      <br /><br /><br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default AboutUsAfter;
