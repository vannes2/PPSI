import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/ProfilAdmin.css";

const ProfilAdmin = () => {
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState("profilAdmin");
  const [loginTime, setLoginTime] = useState("");
  const [lastLogoutTime, setLastLogoutTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/profile");
        setAdminData(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          gender: response.data.gender || "",
          birthdate: response.data.birthdate || ""
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();

    const login = new Date().toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    setLoginTime(login);

    const savedLogout = localStorage.getItem("lastLogoutTime");
    if (savedLogout) setLastLogoutTime(savedLogout);
  }, []);

  const handleLogout = () => {
    const logoutTime = new Date().toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    localStorage.setItem("lastLogoutTime", logoutTime);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!password) {
      alert("⚠️ Mohon masukkan password untuk konfirmasi perubahan");
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/admin/profile/update", {
        ...formData,
        password: password
      });

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("foto", selectedFile);

        await axios.put("http://localhost:5000/api/admin/profile/upload-foto", fileData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      alert("✅ Profil berhasil diperbarui");
      setIsEditing(false);
      setPassword("");
      window.location.reload();
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert("❌ Gagal memperbarui profil: " + (error.response?.data?.message || ""));
    }
  };

  if (!adminData) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-wrapper flex">
      <SidebarAdmin activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="admin-page">
        <div className="profil-admin-container">
          <h1>Profil Admin</h1>

          {/* Foto */}
          <div className="admin-photo">
            <img
              src={
                adminData.upload_foto
                  ? `http://localhost:5000/uploads/${adminData.upload_foto}`
                  : "/assets/images/admin-avatar.png"
              }
              alt="Foto Admin"
              className="admin-profile-photo"
            />
            {isEditing && (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}
          </div>

          {/* Detail Profil */}
          <section className="admin-details">
            <div className="admin-info">
              <label>Nama</label>
              {isEditing ? (
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              ) : (
                <p>{adminData.name}</p>
              )}

              <label>Email</label>
              {isEditing ? (
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              ) : (
                <p>{adminData.email}</p>
              )}

              <label>Nomor HP</label>
              {isEditing ? (
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                <p>{adminData.phone || "-"}</p>
              )}

              <label>Jenis Kelamin</label>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Pilih</option>
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              ) : (
                <p>{adminData.gender || "-"}</p>
              )}

              <label>Tanggal Lahir</label>
              {isEditing ? (
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
              ) : (
                <p>{adminData.birthdate || "-"}</p>
              )}

              {isEditing && (
                <>
                  <label>Password (untuk konfirmasi)</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password akun"
                  />
                </>
              )}

              <p><strong>Login Aktif Sejak:</strong> <span className="login-time">{loginTime}</span></p>
              {lastLogoutTime && (
                <p><strong>Terakhir Logout:</strong> <span className="logout-time">{lastLogoutTime}</span></p>
              )}
            </div>
          </section>

          {/* Tombol Aksi */}
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>Simpan Perubahan</button>
                <button className="btn btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setPassword("");
                }}>Batal</button>
              </>
            ) : (
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>Edit Profil</button>
            )}
            <button className="btn btn-delete" onClick={handleLogout}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilAdmin;
