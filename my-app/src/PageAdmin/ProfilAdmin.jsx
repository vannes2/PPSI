import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa"; // Icon for logout
import SidebarAdmin from "../components/SidebarAdmin"; // Import SidebarAdmin
import "../CSS_Admin/ProfilAdmin.css";

const ProfilAdmin = () => {
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState("profilAdmin"); // Default active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/profile"); // Endpoint to get admin data
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page after logout
  };

  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-wrapper flex">
      {/* Sidebar Admin */}
      <SidebarAdmin
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="dashboard-content">
        <div className="profil-admin-page">
          <div className="profil-admin-container">
            <h1>Profil Admin</h1>
            <div className="admin-details">
              <div className="admin-info">
                {/* <p><strong>ID:</strong> {adminData.id}</p> */}
                <p><strong>Nama:</strong> {adminData.name}</p>
                {/* Removed the following fields */}
                {/* <p><strong>Email:</strong> {adminData.email}</p> */}
                {/* <p><strong>No. HP:</strong> {adminData.phone}</p> */}
                {/* <p><strong>Jenis Kelamin:</strong> {adminData.gender}</p> */}
                {/* <p><strong>Tanggal Lahir:</strong> {new Date(adminData.birthdate).toLocaleDateString()}</p> */}
                <p><strong>Terdaftar Sejak:</strong> {new Date(adminData.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="logout-button">
              <button onClick={handleLogout}>
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilAdmin;
