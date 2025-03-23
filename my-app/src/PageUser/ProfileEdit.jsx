import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || 1; // Ambil userId dari localStorage

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    address: "", // ✅ Tambahkan kembali address
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil data user saat komponen dimuat
  useEffect(() => {
    fetch(`http://localhost:5000/api/profile/id/${userId}`)
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
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/api/profile/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal menyimpan perubahan");
        }
        return response.json();
      })
      .then(() => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) {
    return <p className="loading-message">Memuat data...</p>;
  }

  return (
    <div className="profile-page">
      <HeaderAfter />
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
            <button className="logout-btn" onClick={togglePopup}>
              Keluar Akun
            </button>
          </div>

          <div className="profile-main">
            <h1 className="section-title">Edit Profil</h1>
            {error && <p className="error-message">Error: {error}</p>}
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
                  <label htmlFor="birthdate">Tanggal Lahir</label>
                  <input
                    id="birthdate"
                    type="date"
                    value={profileData.birthdate}
                    onChange={(e) =>
                      setProfileData({ ...profileData, birthdate: e.target.value })
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
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* ✅ Tambahkan kembali input alamat */}
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

              <button type="button" className="save-btn" onClick={handleSave}>
                Simpan
              </button>
            </form>
=
            {isSaved && <p className="save-message">Profil berhasil disimpan!</p>}
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

export default ProfileEdit;
