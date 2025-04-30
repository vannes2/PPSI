import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin"; // Import Sidebar
import "../CSS_Admin/UserManagement.css"; // Make sure to link the CSS

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
        setUserCount(response.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      alert("User deleted successfully.");
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the user.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Admin */}
      <SidebarAdmin />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }} className="user-management-container">
        <h2>User Management</h2>
        <p>Total Users: {userCount}</p>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Address</th> {/* Added Address Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.address || "-"}</td> {/* Display Address */}
                  <td>
                    <button className="view-btn">
                      <FaEye /> View
                    </button>
                    <button className="edit-btn">
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
