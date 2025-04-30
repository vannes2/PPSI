import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin"; // Import Sidebar
import "../CSS_Admin/UserManagement.css"; // Pastikan link ke CSS

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); // Menyimpan pesan error

  // Fetch data pengguna
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users"); // Menyesuaikan endpoint backend
      setUsers(response.data);
      setUserCount(response.data.length);
    } catch (error) {
      setErrorMessage("Failed to load users. Please try again later.");
      console.error("Error fetching users:", error);
    }
  }, []); // Hanya sekali dijalankan ketika komponen pertama kali mount

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Menghapus pengguna
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`); // Menghapus user berdasarkan ID
      alert("User deleted successfully.");
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Mengupdate state setelah penghapusan dengan cara yang benar
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

        {/* Menampilkan pesan error jika ada */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Address</th> {/* Kolom Address */}
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
                  <td>{user.address || "-"}</td> {/* Menampilkan Address */}
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
