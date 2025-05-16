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
          <li><Link to="/HomeAfter">BERANDA</Link></li>
          <li><Link to="/AboutUsAfter">TENTANG KAMI</Link></li>
          <li><Link to="/chat/pengacara/1">KONSULTASI</Link></li>
          <li><Link to="/RiwayatChatPage">RIWAYAT</Link></li>
          <li><Link to="/Artikel">DOKUMEN</Link></li>

          {/* Tombol profil di mobile */}
          <li className="drawer-profile-btn">
            <Link to="/ProfileView">
              <button>Profil</button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Tombol profil di desktop */}
      <div className="auth-buttons">
        <Link to="/ProfileView">
          <button>Profil</button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderAfter;
