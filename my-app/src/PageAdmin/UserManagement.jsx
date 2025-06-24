import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
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

  // Search dan filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterAddress, setFilterAddress] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("https://ppsi-production.up.railway.app/api/simple-users");
      setUsers(response.data);
      setUserCount(response.data.length);
      setErrorMessage("");
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
      await axios.delete(`https://ppsi-production.up.railway.app/api/simple-users/${id}`);
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
      await axios.put(`https://ppsi-production.up.railway.app/api/simple-users/${editingUser.id}`, {
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
        password: "123456",
        gender: "L",
        birthdate: "2000-01-01",
      };

      await axios.post("https://ppsi-production.up.railway.app/api/simple-users", newUser);
      alert("User added successfully.");
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((user) => {
    // Search by name or email (case insensitive)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    // Filter by gender (if selected)
    const matchesGender = filterGender ? user.gender === filterGender : true;

    // Filter by address (if selected)
    const matchesAddress = filterAddress
      ? (user.address || "").toLowerCase().includes(filterAddress.toLowerCase())
      : true;

    return matchesSearch && matchesGender && matchesAddress;
  });

  return (
    <AdminLayout>
      <div className="user-management-container">
        <h2>User Management</h2>
        <p>Total Users: {userCount}</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
          <FaPlus style={{ marginRight: "6px" }} /> Add User
        </button>

        {/* Search dan Filter */}
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", flex: "1 1 250px" }}
          />

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            style={{ padding: "8px", flex: "1 1 150px" }}
          >
            <option value="">All Genders</option>
            <option value="L">Male (L)</option>
            <option value="P">Female (P)</option>
          </select>

          <input
            type="text"
            placeholder="Filter by address..."
            value={filterAddress}
            onChange={(e) => setFilterAddress(e.target.value)}
            style={{ padding: "8px", flex: "1 1 200px" }}
          />

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setFilterGender("");
              setFilterAddress("");
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>

        <div className="table-wrapper">
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-users">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.gender || "-"}</td>
                    <td>{user.birthdate || "-"}</td>
                    <td>{user.address || "-"}</td>
                    <td>
                      <button className="view-btn">
                        <FaEye />
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(user)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Edit */}
        {editingUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Edit User</h3>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleUpdate}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Add */}
        {isAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add New User</h3>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddUser}>
                  Add
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
