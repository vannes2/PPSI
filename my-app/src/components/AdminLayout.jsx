import SidebarAdmin from "./SidebarAdmin";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <>
      <style>{`
        /* Reset margin, padding, box-sizing */
        *, *::before, *::after {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          font-family: Arial, sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
          background-color: #1f2937;
        }

        /* Sidebar default lebar 240px */
        .sidebar {
          width: 240px;
          min-width: 240px;
          background-color: #111827;
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }

        /* Konten utama fleksibel */
        .dashboard-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 0;
          background-color: #1f2937;
        }

        .dashboard-inner {
          flex: 1;
          padding: 24px;
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          max-width: 100%;
          overflow-y: auto;
        }

        /* Responsive untuk layar kecil */
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
          }
          .sidebar {
            width: 100%;
            min-width: 100%;
            height: 60px;
            flex-direction: row;
            align-items: center;
            padding: 0 16px;
          }
          .dashboard-content {
            flex-grow: unset;
            height: auto;
          }
          .dashboard-inner {
            padding: 16px;
          }
        }
      `}</style>

      <div className="admin-layout">
        {/* Sidebar with className so styling applies */}
        <div className="sidebar">
          <SidebarAdmin activeTab="" onTabChange={() => {}} />
        </div>

        {/* Konten Utama */}
        <div className="dashboard-content">
          <div className="dashboard-inner">{children}</div>
        </div>
      </div>
    </>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
