import React from "react";
import { FaGavel, FaHome, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
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
    </aside>
  );
};

export default SidebarAdmin;
