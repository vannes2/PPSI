import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_Lawyer/ProfilLawyer.css";

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

  const togglePopup = () => setShowPopup(!showPopup);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/ProfileEditLawyer");
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    return date.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="profile-page"><p className="loading">Memuat data...</p></div>;
  }

  if (error) {
    return <div className="profile-page"><p className="error">Terjadi kesalahan: {error}</p></div>;
  }

  return (
    <div className="profile-page">
      <HeaderLawyer />
      <div className="profile-page-container">
        <div className="profile-page-profile-container">
          <div className="profile-page-profile-sidebar">
            <div className="profile-page-profile-picture">
              {profileData?.upload_foto ? (
                <img
                  src={`http://localhost:5000/uploads/${profileData.upload_foto}`}
                  alt="Pas Foto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/emptyprofile.png";
                  }}
                />
              ) : (
                <>
                  <img src="/assets/images/emptyprofile.png" alt="Pas Foto Default" />
                  <User size={80} color="#666" strokeWidth={1.5} />
                </>
              )}
            </div>

            <p className="profile-page-profile-balance">
              {profileData.balance ? `${profileData.balance} AYUNE COINS` : "0 AYUNE COINS"}
            </p>

            <button className="profile-page-edit-profile-btn" onClick={handleEditProfile}>
              Edit Profil
            </button>

            <button className="profile-page-logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          <div className="profile-page-profile-main">
            <h1 className="profile-page-section-title">Informasi Profil Pengacara</h1>
            <div className="profile-page-profile-info">
              {[
                { label: "Nama", value: profileData.nama },
                { label: "Tanggal Lahir", value: formatTanggal(profileData.tanggal_lahir) },
                { label: "Jenis Kelamin", value: profileData.jenis_kelamin },
                { label: "Alamat", value: profileData.alamat },
                { label: "Email", value: profileData.email },
                { label: "No HP", value: profileData.no_hp },
                { label: "Nomor Induk Advokat", value: profileData.nomor_induk_advokat },
                { label: "Universitas", value: profileData.universitas },
                { label: "Pendidikan", value: profileData.pendidikan },
                { label: "Spesialisasi", value: profileData.spesialisasi },
                { label: "Pengalaman", value: `${profileData.pengalaman} Tahun` },
                { label: "Username", value: profileData.username }
              ].map((item, index) => (
                <div className="profile-page-form-group" key={index}>
                  <label>{item.label}</label>
                  <p>{item.value || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="profile-page-popup-overlay">
          <div className="profile-page-popup-content">
            <div className="profile-page-popup-header">Anda Yakin Ingin Keluar?</div>
            <div className="profile-page-popup-button-container">
              <button className="profile-page-popup-button profile-page-btn-cancel" onClick={togglePopup}>
                Batal
              </button>
              <button className="profile-page-popup-button profile-page-btn-exit" onClick={handleLogout}>
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
