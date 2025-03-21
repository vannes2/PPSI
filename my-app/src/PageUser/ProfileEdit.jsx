import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; // Import ikon user dari Lucide
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState({
    name: "Ayyunie",
    email: "Ayyunie99@gmail.com",
    phone: "081971876762",
    dob: "1999-09-09",
    gender: "Perempuan",
    address: "Jl. Mawar No. 10, Jakarta",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Notifikasi hilang setelah 2 detik
  };

  return (
    <div className="profile-page">
      <HeaderAfter />
      <div className="container">
        <div className="profile-container">
          {/* Sidebar Profil */}
          <div className="profile-sidebar">
            <div className="profile-picture">
              <img
                src="/assets/images/emptyprofile.png"
                alt="Profile"
                onError={(e) => (e.target.style.display = "none")}
              />
              <User size={80} color="#666" strokeWidth={1.5} />
            </div>
            <p className="profile-balance"></p>
            <button className="logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          {/* Bagian Informasi Profil */}
          <div className="profile-main">
            <h1 className="section-title">Profil Edit</h1>
            <form>
              <div className="profile-info">
                <div className="form-group">
                  <label htmlFor="name">Nama</label>
                  <input
                    id="name"
                    type="text"
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
                  <input
                    id="gender"
                    type="text"
                    value={profileData.gender}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Alamat</label>
                  <input
                    id="address"
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({ ...profileData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Tombol Simpan */}
              <button type="button" className="save-btn" onClick={handleSave}>
                Simpan
              </button>
            </form>

            {/* Notifikasi Simpan */}
            {isSaved && <p className="save-message">Profil berhasil disimpan!</p>}
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

export default ProfileEdit;
