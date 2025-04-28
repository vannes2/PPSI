import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; 
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileLawyer = () => {
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

    fetch(`http://localhost:5000/api/lawyer/profile/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data profil");
        }
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

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/ProfileEditLawyer");
  };

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="error">Terjadi kesalahan: {error}</div>;
  }

  return (
    <div className="profile-page">
      <HeaderLawyer />
      <br /><br /><br/><br/><br/><br/>
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-picture">
              <img
                src="/assets/images/emptyprofile.png"
                alt="Profile"
                onError={(e) => (e.target.style.display = "none")}
              />
              <User size={80} color="#666" strokeWidth={1.5} />
            </div>
            <p className="profile-balance">
              {profileData.balance ? `${profileData.balance} AYUNE COINS` : "0 AYUNE COINS"}
            </p>

            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profil
            </button>

            <button className="logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          <div className="profile-main">
            <h1 className="section-title">Informasi Profil Pengacara</h1>
            <div className="profile-info">

              <div className="form-group">
                <label>Nama</label>
                <p>{profileData.nama}</p>
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <p>{profileData.tanggal_lahir}</p>
              </div>

              <div className="form-group">
                <label>Jenis Kelamin</label>
                <p>{profileData.jenis_kelamin}</p>
              </div>

              <div className="form-group">
                <label>Alamat</label>
                <p>{profileData.alamat}</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <p>{profileData.email}</p>
              </div>

              <div className="form-group">
                <label>No HP</label>
                <p>{profileData.no_hp}</p>
              </div>

              <div className="form-group">
                <label>Nomor Induk Advokat</label>
                <p>{profileData.nomor_induk_advokat}</p>
              </div>

              <div className="form-group">
                <label>Universitas</label>
                <p>{profileData.universitas}</p>
              </div>

              <div className="form-group">
                <label>Pendidikan</label>
                <p>{profileData.pendidikan}</p>
              </div>

              <div className="form-group">
                <label>Spesialisasi</label>
                <p>{profileData.spesialisasi}</p>
              </div>

              <div className="form-group">
                <label>Pengalaman</label>
                <p>{profileData.pengalaman} Tahun</p>
              </div>

              <div className="form-group">
                <label>Username</label>
                <p>{profileData.username}</p>
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

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ProfileLawyer;
