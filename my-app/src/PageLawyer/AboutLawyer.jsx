import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_User/AboutUs.css';

const AboutLawyer = () => {
  return (
    <div className="about-page-container">
      {/* header */}
      <HeaderLawyer />

      <br></br><br/><br/><br/><br/>
      <main>
        <section>
          <div className="about-us">
            <h1>Tentang Kami</h1>
          </div>
          <div className="content-aboutus">
            <p>
            Cerdas Hukum adalah nama yang dirancang untuk merepresentasikan gabungan antara intelektualitas (cerdas) dan sistem hukum yang kuat dan terpercaya (hukum). Nama ini mencerminkan tujuan utama aplikasi, yaitu menghadirkan solusi digital yang pintar, akurat, dan terintegrasi dalam membantu pengguna menjelajahi dan memahami aspek hukum secara mudah.
            Dengan mengintegrasikan teknologi seperti machine learning, pengolahan data hukum, dan otomatisasi keputusan, Cerdas Hukum bertujuan menjadi asisten hukum digital yang tidak hanya cepat, tapi juga dapat diandalkan—baik untuk masyarakat umum, praktisi hukum, maupun pembuat kebijakan.
            Nama ini menyiratkan komitmen kuat terhadap inovasi, keterjangkauan, serta penyederhanaan akses terhadap informasi hukum yang kompleks, menjadikan hukum lebih ramah, jelas, dan cerdas untuk semua kalangan.
            </p>
          </div>
          <div className="content-welcome">
            <p>Selamat datang di Cerdas Hukum, tempat di mana perjuangan dimulai!</p>
          </div>
        </section>
      </main>

      <div className="footer-separator"></div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutLawyer;
