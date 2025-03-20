import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <img src="/assets/img/LogoKecil.png" alt="Logo Ayune" />
                </div>
                <div className="footer-content">
                    <div className="customer-care">
                        <h3>Layanan Pelanggan</h3>
                        <p>Whatsapp: +62-851-6564-4356</p>
                        <p>Instagram: @ayunneconsultation</p>
                        <p>Email: ayunneconsultation@gmail.com</p>
                        <p><strong>Jam Operasional:</strong><br />Senin-Jumat: 10:00 - 21:00 WIB<br />Sabtu: 10:00 - 17:00 WIB</p>
                    </div>
                    <div className="account">
                        <h3>Akun Saya</h3>
                        <p><Link to="/">Profil</Link></p>
                        <p><Link to="/signup">Daftar</Link></p>
                        <p><Link to="/Login">Masuk</Link></p>
                    </div>
                    <div className="social-media">
                        <h3>Ikuti Kami:</h3>
                        <div className="social-icons">
                            <a href="#"><img src="/assets/images/instagram.png" alt="Instagram" /></a>
                            <a href="#"><img src="/assets/images/twt.png" alt="Twitter" /></a>
                            <a href="#"><img src="/assets/images/yt.png" alt="YouTube" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>©AYUNNE, 2024. SEMUA HAK DILINDUNGI</p>
            </div>
        </footer>
    );
};

export default Footer;
