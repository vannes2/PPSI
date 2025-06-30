import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import "./Header.css";

const HeaderAfter = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const defaultProfile = "/assets/images/emptyprofile.png";

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("User tidak ditemukan.");
      return;
    }

    fetch(`https://ppsi-production.up.railway.app/api/profile/id/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil data profil");
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [userId]);

  // Komponen helper untuk foto atau icon profil desktop
  const ProfilePhotoDesktop = () => {
    if (profileData?.photo_url) {
      return (
        <img
          src={`https://ppsi-production.up.railway.app${profileData.photo_url}`}
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
    if (profileData?.photo_url) {
      return (
        <img
          src={`https://ppsi-production.up.railway.app${profileData.photo_url}`}
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

  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const closeDrawer = () => setMenuOpen(false);

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
          <li><Link to="/HomeAfter">BERANDA</Link></li>
          <li><Link to="/AboutUsAfter">TENTANG KAMI</Link></li>
          <li><Link to="/chat/pengacara/1">KONSULTASI</Link></li>
          <li><Link to="/RiwayatKasus">RIWAYAT</Link></li>
          <li><Link to="/Artikel">DOKUMEN</Link></li>
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
