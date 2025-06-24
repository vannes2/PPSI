import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_Lawyer/ProfilLawyer.css";

const ProfileEditLawyer = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    nama: "", alamat: "", email: "", no_hp: "",
    universitas: "", pendidikan: "", spesialisasi: "",
    pengalaman: "", username: ""
  });

  const [uploadFoto, setUploadFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setErrorMessage("User tidak ditemukan.");
      setLoading(false);
      return;
    }

    fetch(`https://ppsi-production.up.railway.app/api/lawyer/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        if (data.upload_foto) {
          setPreviewFoto(`https://ppsi-production.up.railway.app/uploads/${data.upload_foto}`);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage("Gagal memuat data profil.");
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      formData.append(key, profileData[key]);
    });

    if (uploadFoto) {
      formData.append("upload_foto", uploadFoto);
    }

    try {
      const response = await fetch(`https://ppsi-production.up.railway.app/api/lawyer/profile/update/${userId}`, {
        method: "PUT",
        body: formData
      });

      if (!response.ok) throw new Error("Gagal memperbarui profil");

      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/ProfileLawyer");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat memperbarui profil");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="profile-page"><p className="loading">Memuat data...</p></div>;
  }

  return (
    <div className="profile-page">
      <HeaderLawyer />

      {successMessage && <div className="profile-page-toast success">{successMessage}</div>}
      {errorMessage && <div className="profile-page-toast error">{errorMessage}</div>}

      <div className="profile-page-container">
        <div className="profile-page-profile-sidebar">
          <div className="profile-page-profile-picture">
            {previewFoto ? (
              <img src={previewFoto} alt="Preview Foto" />
            ) : (
              <img src="/assets/images/emptyprofile.png" alt="Default Foto" />
            )}
          </div>

          <div className="profile-page-upload-container">
            <input
              type="file"
              accept="image/*"
              name="upload_foto"
              onChange={handleFotoChange}
            />
          </div>
        </div>
        <form className="profile-page-profile-container" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="profile-page-profile-main">
            <h1 className="profile-page-section-title">Edit Profil Pengacara</h1>
            <div className="profile-page-profile-info">
              {[
                { label: "Nama", name: "nama" },
                { label: "Alamat", name: "alamat" },
                { label: "Email", name: "email" },
                { label: "No HP", name: "no_hp" },
                { label: "Universitas", name: "universitas" },
                { label: "Pendidikan", name: "pendidikan" },
                { label: "Spesialisasi", name: "spesialisasi" },
                { label: "Pengalaman", name: "pengalaman" },
                { label: "Username", name: "username" }
              ].map((field, index) => (
                <div className="profile-page-form-group" key={index}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={profileData[field.name] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
              <button type="submit" className="profile-page-save-btn">
                Simpan Perubahan
              </button>
              <button
                type="button"
                className="profile-page-logout-btn"
                onClick={() => navigate("/ProfileLawyer")}
              >
                Batal
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default ProfileEditLawyer;
