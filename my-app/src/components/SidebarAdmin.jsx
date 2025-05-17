import {
  FaGavel,
  FaHome,
  FaFileAlt,
  FaUser,
  FaNewspaper,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaHistory,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ activeTab, onTabChange }) => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    upload_foto: ""
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/profile");
        setAdmin(res.data); // name, email, upload_foto
      } catch (err) {
        console.error("❌ Gagal mengambil data admin:", err);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <aside className="dashboard-sidebar">
      {/* Profil Admin Dinamis */}
      <div className="profil-admin-card">
        <Link
          to="/ProfilAdmin"
          onClick={() => onTabChange("profilAdmin")}
          className="profil-link"
        >
          <img
            src={
              admin.upload_foto
                ? `http://localhost:5000/uploads/${admin.upload_foto}`
                : "/assets/images/admin-avatar.png"
            }
            alt="Admin Avatar"
            className="profil-avatar"
          />
          <div className="profil-info">
            <div className="profil-nama">{admin.name || "Loading..."}</div>
            <div className="profil-email">{admin.email || "..."}</div>
          </div>
        </Link>
      </div>

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
        <li className={activeTab === "artikelBerita" ? "nav-active" : ""}>
          <Link to="/ArtikelBeritaAdmin" onClick={() => onTabChange("artikelBerita")}>
            <FaNewspaper className="icon-spacing" /> Artikel Berita
          </Link>
        </li>
        <li className={activeTab === "transaksi" ? "nav-active" : ""}>
          <Link to="/TransaksiKeuangan" onClick={() => onTabChange("transaksi")}>
            <FaMoneyBillWave className="icon-spacing" /> Transaksi Keuangan
          </Link>
        </li>
        <li className={activeTab === "faq" ? "nav-active" : ""}>
          <Link to="/faq" onClick={() => onTabChange("faq")}>
            <FaQuestionCircle className="icon-spacing" /> FAQ Hukum
          </Link>
        </li>
        <li className={activeTab === "logPertanyaan" ? "nav-active" : ""}>
          <Link to="/log-pertanyaan" onClick={() => onTabChange("logPertanyaan")}>
            <FaHistory className="icon-spacing" /> Riwayat Pertanyaan
          </Link>
        </li>
      </ul>
    </aside>
  );
};

SidebarAdmin.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default SidebarAdmin;
