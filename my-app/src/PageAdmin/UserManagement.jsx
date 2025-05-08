import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/simple-users");
      setUsers(response.data);
      setUserCount(response.data.length);
    } catch (error) {
      setErrorMessage("Failed to load users. Please try again later.");
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/simple-users/${id}`);
      alert("User deleted successfully.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the user.");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      await axios.put(`http://localhost:5000/api/simple-users/${editingUser.id}`, {
        ...formData,
      });
      alert("User updated successfully.");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser = {
        ...formData,
        password: "123456", // Default password
        gender: "L",         // Default gender
        birthdate: "2000-01-01", // Default birthdate
      };

      await axios.post("http://localhost:5000/api/simple-users", newUser);
      alert("User added successfully.");
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarAdmin />
      <div style={{ flex: 1, padding: "20px" }} className="user-management-container">
        <h2>User Management</h2>
        <p>Total Users: {userCount}</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          <FaPlus /> Add User
        </button>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-users">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.gender || "-"}</td>
                  <td>{user.birthdate || "-"}</td>
                  <td>{user.address || "-"}</td>
                  <td>
                    <button className="view-btn"><FaEye /> View</button>
                    <button className="edit-btn" onClick={() => openEditModal(user)}><FaEdit /> Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}><FaTrash /> Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Modal Edit */}
        {editingUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleUpdate}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tambah */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New User</h3>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddUser}>Add</button>
                <button className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
