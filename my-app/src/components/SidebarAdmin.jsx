import { useEffect, useState } from "react";
import {
    // ... (ikon yang sudah ada)
    HiBars3, HiChevronDoubleLeft, HiChevronDoubleRight, HiOutlineHome, 
    HiOutlineUserGroup, HiOutlineDocumentText, HiOutlineNewspaper, 
    HiOutlineCurrencyDollar, HiOutlineQuestionMarkCircle, HiOutlineClock, 
    HiOutlineArchiveBox, HiOutlineClipboardDocumentCheck,
    // --- TAMBAHKAN IKON BARU INI ---
    HiOutlineChatBubbleBottomCenterText 
} from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./SidebarAdmin.css";

const SidebarAdmin = () => {
    const [admin, setAdmin] = useState({ name: "", email: "", upload_foto: "" });
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 768);
    const [openSubmenu, setOpenSubmenu] = useState({});
    
    const location = useLocation();
    // Perbaikan kecil pada activeTab untuk menangani path admin
    const pathParts = location.pathname.split('/').filter(Boolean);
    const activeTab = pathParts.length > 1 ? pathParts[1] : pathParts[0] || 'dashboard';

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiOutlineHome, path: '/admin/dashboard' },
        { id: 'UserManagement', label: 'User Management', icon: HiOutlineUserGroup, path: '/UserManagement' },
        {
            id: 'pengacara', label: 'Pengacara', icon: HiOutlineClipboardDocumentCheck,
            submenu: [
                { id: 'HomeAdmin', label: 'Beranda Pengacara', path: '/HomeAdmin' },
                { id: 'TambahPengacara', label: 'Daftar Pengacara', path: '/TambahPengacara' },
                { id: 'Transaksi', label: 'Transaksi Pengacara', path: '/Transaksi' },
            ]
        },
        // --- TAMBAHKAN ITEM MENU BARU DI SINI ---
        { id: 'AdminReviewPage', label: 'Manajemen Ulasan', icon: HiOutlineChatBubbleBottomCenterText, path: '/AdminReviewPage' },
        // ---
        { id: 'TambahArtikel', label: 'Tambah Artikel', icon: HiOutlineDocumentText, path: '/TambahArtikel' },
        { id: 'ArtikelBeritaAdmin', label: 'Artikel Berita', icon: HiOutlineNewspaper, path: '/ArtikelBeritaAdmin' },
        { id: 'TransaksiKeuangan', label: 'Transaksi Keuangan', icon: HiOutlineCurrencyDollar, path: '/TransaksiKeuangan' },
        { id: 'faq', label: 'FAQ Hukum', icon: HiOutlineQuestionMarkCircle, path: '/faq' },
        { id: 'log-pertanyaan', label: 'Riwayat Pertanyaan', icon: HiOutlineClock, path: '/log-pertanyaan' },
        { id: 'kasus', label: 'Riwayat Kasus', icon: HiOutlineArchiveBox, path: '/admin/kasus' },
    ];

    useEffect(() => {
        const parentMenu = menuItems.find(item => item.submenu?.some(sub => sub.id === activeTab));
        if (parentMenu) {
            setOpenSubmenu({ [parentMenu.id]: true });
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setIsCollapsed(true);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const handleLinkClick = () => { if (window.innerWidth <= 768) setIsCollapsed(true); };
    const handleSubmenuToggle = (id) => setOpenSubmenu(prev => ({ ...prev, [id]: !prev[id] }));
    const isSubmenuActive = (item) => item.submenu?.some(sub => {
        const subPathId = sub.path.split('/').filter(Boolean).pop();
        return subPathId === activeTab;
    });

    return (
        <>
            <button className="mobile-hamburger" onClick={toggleSidebar}><HiBars3 /></button>
            {!isCollapsed && window.innerWidth <= 768 && <div className="overlay" onClick={toggleSidebar}></div>}

            <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <div className="sidebar-brand">
                    {!isCollapsed && (
                        <button className="sidebar-toggle" onClick={toggleSidebar}>
                            <HiChevronDoubleLeft />
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item-profile">
                            <Link to="/ProfilAdmin" className="profile-link" onClick={handleLinkClick}>
                                <img
                                    src={admin.upload_foto ? `http://localhost:5000/uploads/${admin.upload_foto}` : "/assets/images/admin-avatar.png"}
                                    alt="Admin Avatar"
                                    className="profile-avatar"
                                />
                                {!isCollapsed && (
                                    <div className="profile-info">
                                        <div className="profile-nama">{admin.name || "Admin"}</div>
                                        <div className="profile-email">{admin.email || "email@admin.com"}</div>
                                    </div>
                                )}
                            </Link>
                        </li>
                        <li className="nav-separator"></li>
                        {menuItems.map(item => (
                            <li key={item.id} className={`nav-item ${item.submenu ? 'has-submenu' : ''} ${isSubmenuActive(item) ? "nav-active" : ""} ${openSubmenu[item.id] ? 'submenu-open' : ''}`}>
                                {item.submenu ? (
                                    <>
                                        <button className="submenu-toggle" onClick={() => handleSubmenuToggle(item.id)}>
                                            <item.icon className="icon-spacing" />
                                            {!isCollapsed && <span>{item.label}</span>}
                                            {!isCollapsed && <span className={`submenu-arrow ${openSubmenu[item.id] ? "open" : ""}`}>›</span>}
                                        </button>
                                        {!isCollapsed && (
                                            <ul className="submenu-list">
                                                {item.submenu.map(subItem => {
                                                    const subItemId = subItem.path.split('/').filter(Boolean).pop();
                                                    return (
                                                        <li key={subItem.id} className={activeTab === subItemId ? "submenu-active" : ""}>
                                                            <Link to={subItem.path} onClick={handleLinkClick}>
                                                                {subItem.label}
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link to={item.path} className={`nav-link ${activeTab === item.id ? 'nav-active' : ''}`} onClick={handleLinkClick}>
                                        <item.icon className="icon-spacing" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {isCollapsed && (
                    <button className="sidebar-toggle-collapsed" onClick={toggleSidebar}>
                        <HiChevronDoubleRight />
                    </button>
                )}
            </aside>
        </>
    );
};

export default SidebarAdmin;