import SidebarAdmin from "./SidebarAdmin";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <div className="dashboard-wrapper" style={{ display: "flex", minHeight: "100vh" }}>
      <SidebarAdmin activeTab="" onTabChange={() => {}} />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
