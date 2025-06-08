import SidebarAdmin from "./SidebarAdmin";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <div
      className="admin-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sidebar */}
      <SidebarAdmin activeTab="" onTabChange={() => {}} />

      {/* Konten Utama */}
      <div
        // className="dashboard-content"
        // style={{
        //   flexGrow: 1,
        //   display: "flex",
        //   flexDirection: "column",
        //   overflowY: "auto", // Scroll vertikal tetap aktif
        //   backgroundColor: "#1f2937",
        // }}
      >
        <div
          className="dashboard-inner"
          style={{
            flex: 1,
            padding: "24px",
            boxSizing: "border-box",
            height: "100%",
            width: "100%",
            maxWidth: "100%",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;