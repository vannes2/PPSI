import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; 
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  const userId = 1; // Gantilah dengan ID user yang sesuai (bisa dari localStorage atau context)

  // Ambil data user dari backend saat komponen dimuat
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
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [userId]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
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
        setTimeout(() => setIsSaved(false), 2000); // Notifikasi hilang setelah 2 detik
      })
      .catch((error) => {
        setError(error.message);
      });
  };

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
                  <input id="gender" type="text" value={profileData.gender} readOnly />
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

              <button type="button" className="save-btn" onClick={handleSave}>
                Simpan
              </button>
            </form>

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
