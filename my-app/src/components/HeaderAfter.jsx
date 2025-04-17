import { Link } from "react-router-dom";
import "./Header.css"; // File CSS untuk Header

const HeaderAfter = () => {
  return (
    <header>
        <div className="logo">
          <img src="assets/img/LogoKecil.png" style={{ width: '100px', height: '100px' }} alt="Cerdas Hukum" />
        </div>
        <nav>
          <ul>
            <li><Link to="/HomeAfter">BERANDA</Link></li>
            <li><Link to="/AboutUsAfter">TENTANG KAMI</Link></li>
            <li><Link to="/Konsultasi">KONSULTASI</Link></li>
            <li><Link to="/Konsultasi">RIWAYAT</Link></li>
            <li><Link to="/Artikel">ARTIKEL</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/ProfileView"><button>Profil</button></Link>
        </div>
    </header>
  );
};

export default HeaderAfter;