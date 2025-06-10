import SidebarAdmin from "./SidebarAdmin";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <>
      <style>{`
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
          background-color: #1f2937;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          background-color: #111827;
          color: white;
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }

        .dashboard-content {
          margin-left: 240px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 24px;
          background-color: #1f2937;
          box-sizing: border-box;
          height: 100%;
          width: calc(100% - 240px);
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: relative;
            width: 100%;
            height: 60px;
            flex-direction: row;
            align-items: center;
            padding: 0 16px;
          }

          .dashboard-content {
            margin-left: 0;
            width: 100%;
            padding: 16px;
          }

          .admin-layout {
            flex-direction: column;
            height: auto;
          }
        }
      `}</style>

      <div className="admin-layout">
        <div className="sidebar">
          <SidebarAdmin activeTab="" onTabChange={() => {}} />
        </div>

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
