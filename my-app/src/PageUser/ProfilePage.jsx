import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="profile-page">
      <HeaderAfter />
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-picture">
              <img src="/assets/images/emptyprofile.png" alt="Edit Profile" />
              <p className="edit-profile">Edit Profil</p>
            </div>
          </div>
          <div className="profile-main">
            <h1 className="section-title">Informasi Profil</h1>
            <form>
              <div className="form-group">
                <label htmlFor="name">Nama</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Masukan nama anda"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Masukan Email anda"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Nomor Telepon</label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Masukan Nomor Telepon Anda"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Tanggal Lahir</label>
                <input
                  id="dob"
                  type="date"
                  value={profileData.dob}
                  onChange={(e) =>
                    setProfileData({ ...profileData, dob: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Jenis Kelamin</label>
                <select
                  id="gender"
                  value={profileData.gender}
                  onChange={(e) =>
                    setProfileData({ ...profileData, gender: e.target.value })
                  }
                >
                  <option value="">Pilih gender...</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <button type="button" className="logout-btn" onClick={togglePopup}>
                Keluar Akun
              </button>
            </form>
          </div>
        </div>
      </div>

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

export default ProfilePage;
