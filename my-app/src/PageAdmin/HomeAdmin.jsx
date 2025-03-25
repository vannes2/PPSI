import { useState, useEffect, useRef } from "react";
import { FaGavel, FaHome, FaTrash, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import axios from "axios";
import "../CSS_Admin/HomeAdmin.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pengacara");
  const [pengacara, setPengacara] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPengacara, setSelectedPengacara] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchPengacara();
  }, []);

  const fetchPengacara = () => {
    axios
      .get("http://localhost:5000/api/pengacara")
      .then((response) => {
        setPengacara(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      axios
        .delete(`http://localhost:5000/api/pengacara/${id}`)
        .then(() => {
          alert("Data berhasil dihapus");
          fetchPengacara();
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          alert("Terjadi kesalahan saat menghapus data");
        });
    }
  };

  const handleEditClick = (pengacara) => {
    setSelectedPengacara(pengacara);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    setSelectedPengacara({
      ...selectedPengacara,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedPengacara.nama || !selectedPengacara.email) {
      alert("Nama dan Email harus diisi!");
      return;
    }

    axios
      .put(`http://localhost:5000/api/pengacara/${selectedPengacara.id}`, selectedPengacara)
      .then(() => {
        alert("Data berhasil diperbarui");
        fetchPengacara();
        setEditModalOpen(false);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        alert("Terjadi kesalahan saat memperbarui data");
      });
  };

  const filteredPengacara = pengacara.filter((lawyer) =>
    lawyer.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container flex">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "bg-gray-700" : ""}>
            <button onClick={() => setActiveTab("dashboard")}>
              <FaHome className="mr-2" /> Dashboard
            </button>
          </li>
          <li className={activeTab === "pengacara" ? "bg-gray-700" : ""}>
            <button onClick={() => setActiveTab("pengacara")}>
              <FaGavel className="mr-2" /> Pengacara
            </button>
          </li>
        </ul>
      </aside>

      <main className="content">
        {activeTab === "pengacara" && (
          <div>
            <h2>Daftar Pengacara</h2>
            <input
              type="text"
              placeholder="Cari pengacara..."
              className="border p-2 w-full mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="mb-4">
              <button className="bg-blue-500 text-white p-2 rounded">
                <FaPlus /> Tambah
              </button>
              <button
                onClick={fetchPengacara}
                className="bg-black text-white p-2 rounded ml-2"
              >
                Refresh Data
              </button>
            </div>

            <div className="table-container">
              <div ref={tableRef} className="overflow-y-auto max-h-[500px]">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Email</th>
                      <th>Spesialisasi</th>
                      <th>Pengalaman</th>
                      <th>Pendidikan</th>
                      <th>Tanggal Daftar</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPengacara.length > 0 ? (
                      filteredPengacara.map((lawyer) => (
                        <tr key={lawyer.id}>
                          <td>{lawyer.id}</td>
                          <td>{lawyer.nama}</td>
                          <td>{lawyer.email ?? "-"}</td>
                          <td>{lawyer.spesialisasi ?? "-"}</td>
                          <td>{lawyer.pengalaman ?? "-"}</td>
                          <td>{lawyer.pendidikan ?? "-"}</td>
                          <td>
                            {lawyer.tanggal_daftar !== "0000-00-00"
                              ? new Date(lawyer.tanggal_daftar).toLocaleDateString("id-ID")
                              : "-"}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-view">
                                <FaEye /> View
                              </button>
                              <button
                                className="btn-edit"
                                onClick={() => handleEditClick(lawyer)}
                              >
                                <FaEdit /> Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(lawyer.id)}
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">Tidak ada data pengacara.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {editModalOpen && selectedPengacara && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Pengacara</h2>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  name="nama"
                  placeholder="Nama"
                  value={selectedPengacara.nama}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={selectedPengacara.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="spesialisasi"
                  placeholder="Spesialisasi"
                  value={selectedPengacara.spesialisasi || ""}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="pengalaman"
                  placeholder="Pengalaman"
                  value={selectedPengacara.pengalaman || ""}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="pendidikan"
                  placeholder="Pendidikan"
                  value={selectedPengacara.pendidikan || ""}
                  onChange={handleInputChange}
                />
                <button type="submit" className="btn-save">Simpan</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditModalOpen(false)}
                >
                  Batal
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
