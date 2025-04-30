import { FaGavel, FaHome, FaFileAlt, FaUserCircle, FaUser } from "react-icons/fa"; // Tambah ikon profil dan user
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ activeTab, onTabChange }) => {
  return (
    <aside className="dashboard-sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li className={activeTab === "dashboard" ? "nav-active" : ""}>
          <Link to="/" onClick={() => onTabChange("dashboard")}>
            <FaHome className="icon-spacing" /> Dashboard
          </Link>
        </li>
          <li className={activeTab === "user" ? "nav-active" : ""}>
            <Link to="/UserManagement" onClick={() => onTabChange("user")}>
              <FaUser className="icon-spacing" /> User Management
            </Link>
          </li>
        <li className={activeTab === "pengacara" ? "nav-active" : ""}>
          <Link to="/HomeAdmin" onClick={() => onTabChange("pengacara")}>
            <FaGavel className="icon-spacing" /> Pengacara
          </Link>
        </li>
        <li className={activeTab === "tambahArtikel" ? "nav-active" : ""}>
          <Link to="/TambahArtikel" onClick={() => onTabChange("tambahArtikel")}>
            <FaFileAlt className="icon-spacing" /> Tambah Artikel
          </Link>
        </li>
      </ul>

      {/* Tambahkan Profil Admin di bagian bawah */}
      <div style={{ marginTop: "auto" }}>
        <ul>
          <li className={activeTab === "profilAdmin" ? "nav-active" : ""}>
            <Link to="/ProfilAdmin" onClick={() => onTabChange("profilAdmin")}>
              <FaUserCircle className="icon-spacing" /> Profil Admin
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

SidebarAdmin.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default SidebarAdmin;
