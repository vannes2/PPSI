import SidebarAdmin from "./SidebarAdmin";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <SidebarAdmin activeTab="" onTabChange={() => {}} />
      </div>
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
