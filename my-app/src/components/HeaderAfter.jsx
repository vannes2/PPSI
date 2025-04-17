import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const HeaderAfter = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setMenuOpen(false);

  return (
    <header>
      <div className="header-left">
        <div className="logo">
          <img src="/assets/img/LogoKecil.png" alt="Cerdas Hukum" />
        </div>

        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleDrawer}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <nav className={`drawer ${menuOpen ? "active" : ""}`}>
        <ul onClick={closeDrawer}>
          <li><Link to="/HomeAfter">BERANDA</Link></li>
          <li><Link to="/AboutUsAfter">TENTANG KAMI</Link></li>
          <li><Link to="/Konsultasi">KONSULTASI</Link></li>
          <li><Link to="/Konsultasi">RIWAYAT</Link></li>
          <li><Link to="/Artikel">ARTIKEL</Link></li>
          <li className="drawer-profile-btn">
            <Link to="/ProfileView"><button>Profil</button></Link>
          </li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <Link to="/ProfileView"><button>Profil</button></Link>
      </div>
    </header>
  );
};

export default HeaderAfter;
