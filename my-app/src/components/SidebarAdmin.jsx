import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineNewspaper,
  HiOutlineCurrencyDollar,
  HiOutlineQuestionMarkCircle,
  HiOutlineClock,
  HiOutlineArchiveBox,
  HiOutlineClipboardDocumentCheck,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ activeTab, onTabChange }) => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    upload_foto: "",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openPengacaraSubmenu, setOpenPengacaraSubmenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/profile");
        setAdmin(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data admin:", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleClickAndClose = (tab) => {
    onTabChange(tab);
    if (isMobile) setIsCollapsed(true); // auto close drawer setelah klik link di mobile
  };

  return (
    <>
      {isMobile && !isCollapsed && <div className="overlay" onClick={toggleSidebar}></div>}

      <aside className={`dashboard-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>

        {!isCollapsed && (
          <div className="profil-admin-card">
            <Link
              to="/ProfilAdmin"
              onClick={() => handleClickAndClose("profilAdmin")}
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
        )}

        <ul>
          <li className={activeTab === "dashboard" ? "nav-active" : ""}>
            <Link to="/" onClick={() => handleClickAndClose("dashboard")}>
              <HiOutlineHome className="icon-spacing" />
              {!isCollapsed && "Dashboard"}
            </Link>
          </li>
          <li className={activeTab === "user" ? "nav-active" : ""}>
            <Link to="/UserManagement" onClick={() => handleClickAndClose("user")}>
              <HiOutlineUserGroup className="icon-spacing" />
              {!isCollapsed && "User Management"}
            </Link>
          </li>

          {/* PENGACARA SUBMENU */}
          <li className={`has-submenu ${["pengacara", "verifikasiPengacara"].includes(activeTab) ? "nav-active" : ""}`}>
            <div className="submenu-toggle" onClick={() => setOpenPengacaraSubmenu(!openPengacaraSubmenu)}>
              <HiOutlineClipboardDocumentCheck className="icon-spacing" />
              {!isCollapsed && (
                <>
                  <Link to="/HomeAdmin" onClick={() => handleClickAndClose("pengacara")} >Pengacara</Link>
                  <span className="submenu-arrow">{openPengacaraSubmenu ? "▾" : "▸"}</span>
                </>
              )}
            </div>
            {!isCollapsed && openPengacaraSubmenu && (
              <ul className="submenu-list">
                <li className={activeTab === "pengacara" ? "submenu-active" : ""}>
                  <Link to="/TambahPengacara" onClick={() => handleClickAndClose("pengacara")}>Daftar Pengacara</Link>
                </li>
                <li className={activeTab === "verifikasiPengacara" ? "submenu-active" : ""}>
                  <Link to="/Transaksi Pengacara" onClick={() => handleClickAndClose("transaksi Pengacara")}>Transaksi Pengacara</Link>
                </li>
              </ul>
            )}
          </li>

          <li className={activeTab === "tambahArtikel" ? "nav-active" : ""}>
            <Link to="/TambahArtikel" onClick={() => handleClickAndClose("tambahArtikel")}>
              <HiOutlineDocumentText className="icon-spacing" />
              {!isCollapsed && "Tambah Artikel"}
            </Link>
          </li>
          <li className={activeTab === "artikelBerita" ? "nav-active" : ""}>
            <Link to="/ArtikelBeritaAdmin" onClick={() => handleClickAndClose("artikelBerita")}>
              <HiOutlineNewspaper className="icon-spacing" />
              {!isCollapsed && "Artikel Berita"}
            </Link>
          </li>
          <li className={activeTab === "transaksi" ? "nav-active" : ""}>
            <Link to="/TransaksiKeuangan" onClick={() => handleClickAndClose("transaksi")}>
              <HiOutlineCurrencyDollar className="icon-spacing" />
              {!isCollapsed && "Transaksi Keuangan"}
            </Link>
          </li>
          <li className={activeTab === "faq" ? "nav-active" : ""}>
            <Link to="/faq" onClick={() => handleClickAndClose("faq")}>
              <HiOutlineQuestionMarkCircle className="icon-spacing" />
              {!isCollapsed && "FAQ Hukum"}
            </Link>
          </li>
          <li className={activeTab === "logPertanyaan" ? "nav-active" : ""}>
            <Link to="/log-pertanyaan" onClick={() => handleClickAndClose("logPertanyaan")}>
              <HiOutlineClock className="icon-spacing" />
              {!isCollapsed && "Riwayat Pertanyaan"}
            </Link>
          </li>
          <li className={activeTab === "riwayatKasus" ? "nav-active" : ""}>
            <Link to="/admin/kasus" onClick={() => handleClickAndClose("riwayatKasus")}>
              <HiOutlineArchiveBox className="icon-spacing" />
              {!isCollapsed && "Riwayat Kasus"}
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

SidebarAdmin.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default SidebarAdmin;
