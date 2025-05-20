import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setMenuOpen(false);

  return (
    <header className="header-lawyer">
      <div className="header-left">
        <div className="logo">
          <img src="/assets/img/LogoBesar.png" alt="Cerdas Hukum" />
        </div>

        {/* Hamburger hanya muncul di mobile */}
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleDrawer}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Navigasi: drawer (mobile), inline nav (desktop) */}
      <nav className={`drawer ${menuOpen ? "active" : ""}`}>
        <ul onClick={closeDrawer}>
          <li><Link to="/HomeLawyer">BERANDA</Link></li>
          <li><Link to="/KonsultasiLawyer">KONSULTASI</Link></li>
          <li><Link to="/Riwayat">RIWAYAT</Link></li>
          <li><Link to="/ArtikelLawyer">DOKUMEN</Link></li>
          <li><Link to="/AboutLawyer">TENTANG KAMI</Link></li>

          {/* Tombol profil di mobile */}
          <li className="drawer-profile-btn">
            <Link to="/ProfileLawyer">
              <button>Profil</button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Tombol profil di desktop */}
      <div className="auth-buttons">
        <Link to="/ProfileLawyer">
          <button>Profil</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
