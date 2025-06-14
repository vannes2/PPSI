import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSignOutAlt, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt, FaKey, FaUser
} from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
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
    name: "", email: "", phone: "", gender: "", birthdate: ""
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
          birthdate: response.data.birthdate?.substring(0, 10) || ""
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
    setLoginTime(new Date().toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }));

    const savedLogout = localStorage.getItem("lastLogoutTime");
    if (savedLogout) setLastLogoutTime(savedLogout);
  }, []);

  const handleLogout = () => {
    const logoutTime = new Date().toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    localStorage.setItem("lastLogoutTime", logoutTime);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!password) {
      alert("⚠️ Masukkan password untuk konfirmasi");
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
      alert("❌ Gagal memperbarui profil");
    }
  };

  if (!adminData) return <div className="loading">Loading...</div>;

  return (
    <AdminLayout>
      <div className="dashboard-wrapper flex">
        <main className="admin-profile-page">
          <div className="profile-card">
            <div className="profile-header" />

            <div className="profile-body">
              <div className="profile-photo">
                <img
                  src={
                    adminData.upload_foto
                      ? `http://localhost:5000/uploads/${adminData.upload_foto}`
                      : "/assets/images/admin-avatar.png"
                  }
                  alt="Foto Admin"
                />
                {isEditing && (
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                )}
              </div>

              <div className="profile-info">
                <h2>{adminData.name}</h2>
                <p><FaUser /> Administrator</p>
                <p><FaEnvelope /> {adminData.email}</p>
                <p><FaPhone /> {adminData.phone || "-"}</p>
                <p><FaVenusMars /> {adminData.gender || "-"}</p>
                <p><FaCalendarAlt /> {adminData.birthdate?.substring(0, 10) || "-"}</p>

                {isEditing && (
                  <div className="edit-fields">
                    <input type="text" name="name" placeholder="Nama" value={formData.name} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="No. HP" value={formData.phone} onChange={handleChange} />
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Pilih Gender</option>
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                    <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
                    <div className="password-confirm">
                      <FaKey />
                      <input type="password" name="password" placeholder="Konfirmasi Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-footer">
              <div className="login-info">
                <p><strong>Login Aktif Sejak:</strong> {loginTime}</p>
                {lastLogoutTime && <p><strong>Terakhir Logout:</strong> {lastLogoutTime}</p>}
              </div>

              <div className="button-group">
                {isEditing ? (
                  <>
                    <button className="btn save" onClick={handleSave}>Simpan</button>
                    <button className="btn cancel" onClick={() => { setIsEditing(false); setPassword(""); }}>Batal</button>
                  </>
                ) : (
                  <button className="btn edit" onClick={() => setIsEditing(true)}>Edit Profil</button>
                )}
                <button className="btn logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Log Out
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
};

export default ProfilAdmin;
