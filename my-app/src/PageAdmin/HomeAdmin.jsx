import { useState, useEffect, useRef } from "react";
import { FaGavel, FaHome, FaTrash, FaPlus, FaEye, FaEdit, FaFileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS_Admin/Pengacara.css";

const HomeAdmin = () => {
  const [activeTab, setActiveTab] = useState("pengacara");
  const [pengacara, setPengacara] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const tableRef = useRef(null);
  const navigate = useNavigate();

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

  const handleEditClick = (id) => {
    navigate(`/EditPengacara/${id}`);
  };

  const handleViewClick = (id) => {
    navigate(`/ViewPengacara/${id}`);
  };

  const handleAddClick = () => {
    navigate("/TambahPengacara");
  };

  const handleAddArtikelClick = () => {
    navigate("/TambahArtikel");
  };

  const filteredPengacara = pengacara.filter((lawyer) =>
    lawyer.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "bg-gray-700" : ""}>
            <button onClick={() => { setActiveTab("dashboard"); navigate("/"); }}>
              <FaHome className="mr-2" /> Dashboard
            </button>
          </li>
          <li className={activeTab === "pengacara" ? "bg-gray-700" : ""}>
            <button onClick={() => setActiveTab("pengacara")}>
              <FaGavel className="mr-2" /> Pengacara
            </button>
          </li>
          <li className={activeTab === "tambahArtikel" ? "bg-gray-700" : ""}>
            <button onClick={handleAddArtikelClick}>
              <FaFileAlt className="mr-2" /> Tambah Artikel
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
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

            {/* Tombol Tambah & Refresh */}
            <div className="mb-4 flex items-center gap-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 shadow-md hover:bg-blue-600 transition"
                onClick={handleAddClick}
              >
                <FaPlus /> Tambah
              </button>

              <button
                onClick={fetchPengacara}
                className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-800 transition"
                style={{ marginLeft: "16px" }}
              >
                Refresh
              </button>
            </div>

            {/* Table */}
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
                              <button className="btn-view" onClick={() => handleViewClick(lawyer.id)}>
                                <FaEye /> View
                              </button>
                              <button className="btn-edit" onClick={() => handleEditClick(lawyer.id)}>
                                <FaEdit /> Edit
                              </button>
                              <button className="btn-delete" onClick={() => handleDelete(lawyer.id)}>
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
      </main>
    </div>
  );
};

export default HomeAdmin;
