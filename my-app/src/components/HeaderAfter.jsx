import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react"; // pastikan sudah install lucide-react atau ganti icon dengan SVG lain
import "./Header.css";

const HeaderAfter = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Gagal parsing user dari localStorage:", err);
      }
    }
  }, []);

  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setMenuOpen(false);

  const defaultProfile = "/assets/images/emptyprofile.png";

  // Komponen helper untuk foto atau icon profil desktop
  const ProfilePhotoDesktop = () => {
    if (user?.photo_url) {
      return (
        <img
          src={user.photo_url}
          alt="Foto Profil"
          className="profile-photo-desktop"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfile;
          }}
        />
      );
    } else {
      return <User size={40} color="#B31312" className="profile-photo-desktop-icon" />;
    }
  };

  // Komponen helper untuk foto atau icon profil mobile
  const ProfilePhotoMobile = () => {
    if (user?.photo_url) {
      return (
        <img
          src={user.photo_url}
          alt="Foto Profil"
          className="profile-photo-mobile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfile;
          }}
        />
      );
    } else {
      return <User size={36} color="#B31312" className="profile-photo-mobile-icon" />;
    }
  };

  return (
    <header>
      <div className="header-left">
        <div className="logo">
          <img src="/assets/img/LogoBesar.png" alt="Cerdas Hukum" />
        </div>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleDrawer}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleDrawer();
          }}
          aria-label="Toggle menu"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <nav className={`drawer ${menuOpen ? "active" : ""}`}>
        <ul onClick={closeDrawer}>
          <li>
            <Link to="/HomeAfter">BERANDA</Link>
          </li>
          <li>
            <Link to="/AboutUsAfter">TENTANG KAMI</Link>
          </li>
          <li>
            <Link to="/chat/pengacara/1">KONSULTASI</Link>
          </li>
          <li>
            <Link to="/RiwayatKasus">RIWAYAT</Link>
          </li>
          <li>
            <Link to="/Artikel">DOKUMEN</Link>
          </li>

          <li className="drawer-profile-btn">
            
            <Link to="/ProfileView" onClick={closeDrawer} title="Profil">
              <ProfilePhotoMobile />
            </Link>
          </li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <Link to="/ProfileView" title="Profil">
          <ProfilePhotoDesktop />
        </Link>
      </div>
    </header>
  );
};

export default HeaderAfter;
