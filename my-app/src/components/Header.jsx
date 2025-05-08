import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Tetap pakai file Header.css yang sudah kamu buat

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setMenuOpen(false);

  return (
    <header>
      <div className="header-left">
        <div className="logo">
          <img src="/assets/img/LogoBesar.png" alt="Cerdas Hukum" />
        </div>

        {/* Hamburger menu */}
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleDrawer}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {/* Drawer menu */}
      <nav className={`drawer ${menuOpen ? "active" : ""}`}>
        <ul onClick={closeDrawer}>
          <li><Link to="/">BERANDA</Link></li>
          <li><Link to="/AboutUs">TENTANG KAMI</Link></li>
          <li><Link to="/Login">KONSULTASI</Link></li>
          <li className="drawer-profile-btn">
            <Link to="/Login"><button>Masuk</button></Link>
          </li>
        </ul>
      </nav>

      {/* Tombol login versi desktop */}
      <div className="auth-buttons">
        <Link to="/Login"><button>Masuk</button></Link>
      </div>
    </header>
  );
};

export default Header;
