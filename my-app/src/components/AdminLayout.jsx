import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SidebarAdmin from "./SidebarAdmin";

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 240px;
          --sidebar-width-collapsed: 72px;
          --bg-dark: #1f2b38;
          --bg-card: #2c3e50;
          --text-light: #ecf0f1;
          --accent: #f39c12;
          --transition-speed: 0.3s;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html, #root {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg-dark);
          color: var(--text-light);
          height: 100%;
        }

        .admin-layout-container {
          display: flex;
          width: 100%;
          height: 100vh;
        }

        .sidebar {
          width: var(--sidebar-width);
          transition: width var(--transition-speed);
          flex-shrink: 0;
          background-color: #111827;
          border-right: 1px solid #3a4a63;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
        }

        .sidebar.collapsed {
          width: var(--sidebar-width-collapsed);
        }

        .main-content-area {
          margin-left: var(--sidebar-width);
          padding: 2rem;
          transition: margin-left var(--transition-speed);
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background-color: var(--bg-dark);
        }

        .admin-layout-container.sidebar-collapsed .main-content-area {
          margin-left: var(--sidebar-width-collapsed);
        }

        @media (max-width: 768px) {
          .sidebar {
            position: absolute;
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-content-area {
            margin-left: 0 !important;
            padding: 1rem;
          }
        }
      `}</style>

      <div
        className={`admin-layout-container ${
          isCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
          <SidebarAdmin isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        </div>
        <main className="main-content-area">{children}</main>
      </div>
    </>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
