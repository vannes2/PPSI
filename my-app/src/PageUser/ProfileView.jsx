import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // Import ikon user dari Lucide
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileView = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/ProfileEdit");
  };

  // Contoh data profil (bisa diganti dengan data dari API)
  const profileData = {
    name: "Ayyunie",
    email: "Ayyunie99@gmail.com",
    phone: "081971876762",
    dob: "1999-09-09",
    gender: "Perempuan",
    balance: "3,500 AYUNE COINS",
    address: "Jl. Mawar No. 10, Jakarta",
  };

  return (
    <div className="profile-page">
      <HeaderAfter />
      <div className="container">
        <div className="profile-container">
          {/* Sidebar Profile */}
          <div className="profile-sidebar">
            <div className="profile-picture">
              <img
                src="/assets/images/emptyprofile.png"
                alt="Profile"
                onError={(e) => (e.target.style.display = "none")}
              />
              <User size={80} color="#666" strokeWidth={1.5} />
            </div>
            <p className="profile-balance">{profileData.balance}</p>

            {/* Tombol Edit Profil */}
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profil
            </button>

            {/* Tombol Keluar Akun */}
            <button className="logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          {/* Profile Main */}
          <div className="profile-main">
            <h1 className="section-title">Informasi Profil</h1>
            <div className="profile-info">
              <div className="form-group">
                <label>Nama</label>
                <p>{profileData.name}</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <p>{profileData.email}</p>
              </div>

              <div className="form-group">
                <label>Nomor Telepon</label>
                <p>{profileData.phone}</p>
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <p>{profileData.dob}</p>
              </div>

              <div className="form-group">
                <label>Jenis Kelamin</label>
                <p>{profileData.gender}</p>
              </div>

              <div className="form-group">
                <label>Alamat:</label>
                <p>{profileData.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Konfirmasi Logout */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">Anda Yakin Ingin Keluar?</div>
            <div className="popup-button-container">
              <button className="popup-button btn-cancel" onClick={togglePopup}>
                Batal
              </button>
              <button className="popup-button btn-exit" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfileView;
