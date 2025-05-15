import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Profil.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Tambah state untuk file foto dan preview
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
        setProfileData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address || "",
        });
        if (data.photo_url) {
          setPhotoPreview(`http://localhost:5000${data.photo_url}`);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Handler untuk input file foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Submit form dengan FormData untuk upload foto sekaligus data
  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phone", profileData.phone);
    formData.append("address", profileData.address);
    if (photoFile) {
      formData.append("photo", photoFile); // field 'photo' harus sama dengan multer di backend
    }

    fetch(`http://localhost:5000/api/profile/update/${userId}`, {
      method: "PUT",
      body: formData,
      // Jangan set Content-Type, biarkan browser atur multipart/form-data otomatis
    })
      .then((response) => {
        if (!response.ok) throw new Error("Gagal menyimpan perubahan");
        return response.json();
      })
      .then(() => {
        setSuccessMessage("Profil berhasil disimpan!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/ProfileView");
        }, 2000);
      })
      .catch(() => {
        setError("Gagal menyimpan perubahan");
        setTimeout(() => setError(null), 3000);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return <p className="loading-message">Memuat data...</p>;

  return (
    <div className="profile-page">
      <HeaderAfter />
      <br /><br /><br /><br />
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <div className="profile-picture">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview Foto" />
              ) : (
                <>
                  <img
                    src="/assets/images/emptyprofile.png"
                    alt="Profile"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <User size={80} color="#666" strokeWidth={1.5} />
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ marginBottom: "10px" }}
            />
            <button className="logout-btn" onClick={handleLogout}>Keluar Akun</button>
          </div>

          <div className="profile-main">
            <h1 className="section-title">Edit Profil</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="save-message">{successMessage}</p>}

            <form onSubmit={handleSave}>
              <div className="profile-info">
                <div className="form-group">
                  <label htmlFor="name">Nama</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Nomor Telepon</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={profileData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Alamat</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={profileData.address}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="save-btn">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ProfileEdit;
