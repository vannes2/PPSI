import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileView = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("User tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/profile/id/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil data profil");
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/ProfileEdit");
  };

  if (loading) return <div className="loading">Memuat data...</div>;
  if (error) return <div className="error">Terjadi kesalahan: {error}</div>;

  return (
    <div className="profile-page">
      <HeaderAfter />
      <br /><br /><br /><br /><br /><br />
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-picture">
              {profileData.photo_url ? (
                <img
                  src={`http://localhost:5000${profileData.photo_url}`}
                  alt="Foto Profil"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <>
                  <img
                    src="/assets/images/emptyprofile.png"
                    alt="Default Profile"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <User size={80} color="#666" strokeWidth={1.5} />
                </>
              )}
            </div>
            <p className="profile-balance">
              {profileData.balance ? profileData.balance : "Profil"}
            </p>

            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profil
            </button>

            <button className="logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          <div className="profile-main">
            <h1 className="section-title">Informasi Profil</h1>
            <div className="profile-info-grid">
              <div className="profile-field">
                <span className="profile-label">Nama</span>
                <span className="profile-value">{profileData.name}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profileData.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Nomor Telepon</span>
                <span className="profile-value">{profileData.phone}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Tanggal Lahir</span>
                <span className="profile-value">{profileData.birthdate}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Jenis Kelamin</span>
                <span className="profile-value">{profileData.gender}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Alamat</span>
                <span className="profile-value">{profileData.address || "Belum diisi"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">Anda Yakin Ingin Keluar?</div>
            <div className="popup-button-container">
              <button className="popup-button btn-cancel" onClick={togglePopup}>Batal</button>
              <button className="popup-button btn-exit" onClick={handleLogout}>Keluar</button>
            </div>
          </div>
        </div>
      )}

      <br /><br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ProfileView;
