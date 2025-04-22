import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-background">
                <div className="footer-container">
                    <div className="footer-logo">
                        <img src="/assets/img/LogoKecil.png" alt="Logo Cerdas Hukum" />
                    </div>

                    <div className="footer-content">
                        <div className="customer-care">
                            <h3>Layanan Pelanggan</h3>
                            <p>Whatsapp: +62-851-6564-4356</p>
                            <p>Instagram: @cerdashukum</p>
                            <p>Email: cerdashukum@gmail.com</p>
                            <p><strong>Jam Operasional:</strong><br />Senin-Jumat: 10:00 - 21:00 WIB<br />Sabtu: 10:00 - 17:00 WIB</p>
                        </div>
                        <div className="account">
                            <h3>Akun Saya</h3>
                            <p><Link to="/">Profil</Link></p>
                            <p><Link to="/signup">Daftar</Link></p>
                            <p><Link to="/login">Masuk</Link></p>
                        </div>
                        <div className="social-media">
                            <h3>Ikuti Kami:</h3>
                            <div className="social-icons">
                                <a href="https://instagram.com/cerdashukum" target="_blank" rel="noopener noreferrer"><FaInstagram size={34} /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter size={34} /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube size={34} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>©CERDASHUKUM, 2025. SEMUA HAK DILINDUNGI</p>
            </div>
        </footer>
    );
};

export default Footer;
