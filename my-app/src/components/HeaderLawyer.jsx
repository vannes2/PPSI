import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import "./Header.css";

const HeaderLawyer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const defaultProfile = "/assets/images/emptyprofile.png";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        fetch(`http://localhost:5000/api/pengacara/${parsedUser.id}`)
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
          })
          .catch((err) => {
            console.error("Gagal fetch data pengacara:", err);
          });
      } catch (err) {
        console.error("Gagal parsing user dari localStorage:", err);
      }
    }
  }, []);

  const toggleDrawer = () => setMenuOpen((prev) => !prev);
  const closeDrawer = () => setMenuOpen(false);

  const ProfilePhoto = ({ size = 40, className = "" }) => {
    if (user?.upload_foto) {
      return (
        <img
          src={`http://localhost:5000/uploads/${user.upload_foto}`}
          alt={`${user.nama || "Profil"} Foto`}
          width={size}
          height={size}
          className={className}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfile;
          }}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      );
    }
    // Jika tidak ada foto, tampilkan icon User
    return <User size={size} color="#B31312" className={className} />;
  };

  return (
    <header className="header-lawyer">
      <div className="header-left">
        <div className="logo">
          <img src="/assets/img/LogoBesar.png" alt="Cerdas Hukum" />
        </div>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleDrawer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleDrawer();
            }
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
            <Link to="/HomeLawyer">BERANDA</Link>
          </li>
          <li>
            <Link to="/KonsultasiLawyer">KONSULTASI</Link>
          </li>
          <li>
            <Link to="/RiwayatKasusPengacara">RIWAYAT</Link>
          </li>
          <li>
            <Link to="/ArtikelLawyer">DOKUMEN</Link>
          </li>
          <li>
            <Link to="/AboutLawyer">TENTANG KAMI</Link>
          </li>

          <li className="drawer-profile-btn">
            <Link to="/ProfileLawyer" onClick={closeDrawer} title="Profil">
              <ProfilePhoto size={36} className="profile-photo-mobile" />
            </Link>
          </li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <Link to="/ProfileLawyer" title="Profil">
          <ProfilePhoto size={40} className="profile-photo-desktop" />
        </Link>
      </div>
    </header>
  );
};

export default HeaderLawyer;
