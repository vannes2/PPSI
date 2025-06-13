import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SidebarAdmin from "./SidebarAdmin";

const AdminLayout = ({ children }) => {
    // State untuk mengontrol sidebar ada di layout utama
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                setIsCollapsed(true);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <>
            {/* SEMUA CSS DITEMPATKAN DI SINI */}
            <style>{`
                /* ===================================================================
                   CSS GABUNGAN UNTUK ADMIN LAYOUT & SIDEBAR
                   =================================================================== */

                /* --- Variabel Global --- */
                :root {
                    --font-family-sans: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                    --color-background-dark: #1f2b38;
                    --sidebar-width: 260px;
                    --sidebar-width-collapsed: 80px;
                    --sidebar-bg: #111827;
                    --sidebar-link-color: #a3b1c2;
                    --sidebar-link-hover-bg: #1f2b38;
                    --sidebar-link-active-bg: #2c3e50;
                    --sidebar-link-active-border: #f39c12;
                    --color-border: #3d566e;
                    --color-accent-1: #f39c12;
                    --transition-smooth: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }

                /* --- Global Reset & Body Styles --- */
                *, *::before, *::after {
                    box-sizing: border-box;
                }

                body, html, #root {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    font-family: var(--font-family-sans); 
                    background-color: var(--color-background-dark);
                    overflow-x: hidden;
                }

                /* --- Struktur Layout Utama --- */
                .admin-layout-container {
                    display: flex;
                    position: relative;
                    min-height: 100vh;
                }

                .main-content-area {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    background-color: var(--color-background-dark);
                    margin-left: var(--sidebar-width);
                    transition: margin-left 0.3s ease-in-out;
                }

                .admin-layout-container.sidebar-collapsed .main-content-area {
                    margin-left: var(--sidebar-width-collapsed);
                }
                
                /* --- Container Utama Sidebar --- */
                .sidebar {
                    width: var(--sidebar-width);
                    height: 100vh;
                    background-color: var(--sidebar-bg);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    transition: width 0.3s ease-in-out;
                    z-index: 1010;
                    border-right: 1px solid var(--color-border);
                }
                .sidebar.collapsed {
                    width: var(--sidebar-width-collapsed);
                }

                /* --- Tombol Toggle Desktop (Panah) --- */
                .sidebar-toggle {
                    position: absolute;
                    top: 20px;
                    right: -15px;
                    background-color: var(--sidebar-bg);
                    border: 2px solid var(--color-border);
                    color: var(--sidebar-link-color);
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--transition-smooth);
                    z-index: 10;
                    opacity: 1;
                    transform: rotate(0deg);
                }
                .sidebar.collapsed .sidebar-toggle {
                    transform: rotate(180deg);
                }

                /* --- Header & Profil --- */
                .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--color-border); }
                .sidebar.collapsed .sidebar-header { padding: 1.5rem 0; }
                .profil-link { display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit; }
                .sidebar.collapsed .profil-link { justify-content: center; }
                .profil-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-accent-1); }
                .profil-info { max-width: 140px; }
                .profil-nama { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .profil-email { font-size: 0.8rem; color: var(--sidebar-link-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .sidebar.collapsed .profil-info { display: none; }

                /* --- Navigasi --- */
                .sidebar-nav { flex-grow: 1; overflow-y: auto; overflow-x: hidden; padding: 1rem 0; }
                .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }

                .sidebar-nav li a, .submenu-toggle { display: flex; align-items: center; padding: 0.9rem 1.5rem; color: var(--sidebar-link-color); text-decoration: none; transition: background-color 0.2s ease, color 0.2s ease; white-space: nowrap; font-weight: 500; }
                .sidebar.collapsed .sidebar-nav li a, .sidebar.collapsed .submenu-toggle { justify-content: center; padding: 1rem 0; }
                .sidebar-nav li a:hover, .submenu-toggle:hover { background-color: var(--sidebar-link-hover-bg); color: white; }
                .sidebar-nav li.nav-active > a, .sidebar-nav li.nav-active > .submenu-toggle { background-color: var(--sidebar-link-active-bg); color: white; position: relative; }
                
                .sidebar-nav li.nav-active > a::before, .sidebar-nav li.nav-active > .submenu-toggle::before { content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 4px; background-color: var(--sidebar-link-active-border); }

                .icon-spacing { font-size: 1.5rem; margin-right: 1rem; flex-shrink: 0; }
                .sidebar.collapsed .icon-spacing { margin-right: 0; font-size: 1.8rem; }
                .sidebar.collapsed .submenu-list, .sidebar.collapsed .submenu-arrow, .sidebar.collapsed .parent-link { display: none; }

                /* --- Submenu --- */
                .submenu-toggle { width: 100%; background: none; border: none; cursor: pointer; font-size: inherit; font-family: inherit; justify-content: space-between; }
                .submenu-arrow { font-size: 0.8rem; transition: transform 0.2s ease; margin-left: auto; }
                .submenu-arrow.open { transform: rotate(90deg); }
                .submenu-list { background-color: rgba(0,0,0,0.2); padding-left: 2rem; }
                .submenu-list li a { padding: 0.7rem 0.7rem 0.7rem 2.5rem; font-size: 0.9rem; }
                .submenu-list li.submenu-active a { color: var(--color-accent-1); font-weight: 600; }

                /* --- Mobile & Overlay --- */
                .mobile-hamburger { display: none; }
                .overlay { display: none; }

                @media (max-width: 768px) {
                    .main-content-area {
                        margin-left: 0;
                        padding: 1rem;
                        padding-top: 70px;
                    }
                    .sidebar { position: fixed; transform: translateX(-100%); }
                    .sidebar:not(.collapsed) { transform: translateX(0); box-shadow: 10px 0 20px rgba(0,0,0,0.2); }
                    .sidebar-toggle { display: none; }
                    .mobile-hamburger { display: block; position: fixed; top: 15px; left: 15px; z-index: 1020; background-color: #1f2b38; color: white; border: 1px solid var(--color-border); border-radius: 8px; padding: 0.5rem; cursor: pointer; }
                    .mobile-hamburger svg { width: 24px; height: 24px; }
                    .overlay { display: block; position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 1009; }
                }

            `}</style>

            <div className={`admin-layout-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                <SidebarAdmin isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <main className="main-content-area">
                    {children}
                </main>
            </div>
        </>
    );
};

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminLayout;