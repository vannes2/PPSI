import Footer from "../components/Footer";
import '../CSS_User/AboutUs.css';
import HeaderAfter from "../components/HeaderAfter";

const AboutUsAfter = () => {
  return (
    <div className="about-page-container">
      {/* header */}
      <HeaderAfter />
      <br></br><br/><br/><br/><br/>
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
      <br/><br/><br/><br/><br/>

      <div className="footer-separator"></div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsAfter;
