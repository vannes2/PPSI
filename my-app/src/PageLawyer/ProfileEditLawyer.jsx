import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import "../CSS_Lawyer/ProfilLawyer.css"; // Kita pakai CSS yang sama, biar konsisten styling.

const ProfileEditLawyer = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    nama: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    email: "",
    no_hp: "",
    nomor_induk_advokat: "",
    universitas: "",
    pendidikan: "",
    spesialisasi: "",
    pengalaman: "",
    username: "",
  });
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

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/api/lawyer/profile/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal memperbarui profil");
      }
      alert("Profil berhasil diperbarui!");
      navigate("/ProfileLawyer");
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    });
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
        <form className="profile-page-profile-container" onSubmit={handleSubmit}>
          <div className="profile-page-profile-main">
            <h1 className="profile-page-section-title">Edit Profil Pengacara</h1>
            <div className="profile-page-profile-info">
              {[
                { label: "Nama", name: "nama" },
                { label: "Tanggal Lahir", name: "tanggal_lahir", type: "date" },
                { label: "Jenis Kelamin", name: "jenis_kelamin" },
                { label: "Alamat", name: "alamat" },
                { label: "Email", name: "email" },
                { label: "No HP", name: "no_hp" },
                { label: "Nomor Induk Advokat", name: "nomor_induk_advokat" },
                { label: "Universitas", name: "universitas" },
                { label: "Pendidikan", name: "pendidikan" },
                { label: "Spesialisasi", name: "spesialisasi" },
                { label: "Pengalaman", name: "pengalaman" },
                { label: "Username", name: "username" },
              ].map((field, index) => (
                <div className="profile-page-form-group" key={index}>
                  <label>{field.label}</label>
                  <input
                    type={field.type || "text"}
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
      <Footer />
    </div>
  );
};

export default ProfileEditLawyer;
