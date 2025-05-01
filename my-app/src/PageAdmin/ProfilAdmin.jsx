import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa"; // Icon for logout
import SidebarAdmin from "../components/SidebarAdmin"; // Import SidebarAdmin
import "../CSS_Admin/ProfilAdmin.css";

const ProfilAdmin = () => {
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState("profilAdmin"); // Default active tab
  const [loginTime, setLoginTime] = useState(""); // To store the active login time
  const [lastLogoutTime, setLastLogoutTime] = useState(""); // To store the last logout time
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/profile"); // Endpoint to get admin data
        setAdminData(response.data);
        console.log("Fetched admin data:", response.data);  // Debug log
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();

    // Set login time when the component mounts
    const currentLoginTime = new Date();
    const formattedTime = currentLoginTime.toLocaleString('id-ID', {
      weekday: 'long', // Full weekday name (e.g., Monday)
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLoginTime(formattedTime);

    // Get the last logout time from localStorage
    const savedLogoutTime = localStorage.getItem("lastLogoutTime");
    if (savedLogoutTime) {
      setLastLogoutTime(savedLogoutTime);
      console.log("Last logout time:", savedLogoutTime);  // Debug log
    }
  }, []);

  const handleLogout = () => {
    // Capture the current time as the last logout time
    const logoutTime = new Date();
    const formattedLogoutTime = logoutTime.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Store the last logout time in localStorage
    localStorage.setItem("lastLogoutTime", formattedLogoutTime);

    // Clear user data and redirect to login
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!adminData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-wrapper flex">
      <SidebarAdmin
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigate={navigate}
      />
      <main className="admin-page">
        <div className="profil-admin-container">
          <h1>Profil Admin</h1>
          <section className="admin-details">
            <div className="admin-info">
              <p><strong>Nama:</strong> {adminData.name}</p>
              <p><strong>Terdaftar Sejak:</strong> <span className="registered-date">{new Date(adminData.created_at).toLocaleDateString()}</span></p>
              <p><strong>Login Aktif Sejak:</strong> <span className="login-time">{loginTime}</span></p> {/* New login time */}
              {lastLogoutTime && (
                <p><strong>Terakhir Logout:</strong> <span className="logout-time">{lastLogoutTime}</span></p>
              )}
            </div>
          </section>

          <div className="logout-button">
            <button onClick={handleLogout}>
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilAdmin;
