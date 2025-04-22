import { useState, useEffect, useRef } from "react";
import { FaTrash, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS_Admin/HomeAdmin.css";
import SidebarAdmin from "../components/SidebarAdmin";

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
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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

  const filteredPengacara = pengacara.filter((lawyer) =>
    lawyer.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper flex">
      {/* Sidebar dipisah jadi komponen tersendiri */}
      <SidebarAdmin
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNavigate={navigate}
      />
      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === "pengacara" && (
          <div>
            <h2>Daftar Pengacara</h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari pengacara..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Toolbar: Tambah dan Refresh */}
            <div className="toolbar">
              <button className="btn-primary" onClick={handleAddClick}>
                <FaPlus /> Tambah
              </button>
              <button className="btn-refresh" onClick={fetchPengacara}>
                Refresh
              </button>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <div ref={tableRef} className="table-scroll">
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
                          <td>{lawyer.nama ?? "-"}</td>
                          <td>{lawyer.email ?? "-"}</td>
                          <td>{lawyer.spesialisasi ?? "-"}</td>
                          <td>{lawyer.pengalaman ? `${lawyer.pengalaman} tahun` : "-"}</td>
                          <td>{lawyer.pendidikan ?? "-"}</td>
                          <td>
                            {lawyer.tanggal_daftar !== "0000-00-00"
                              ? new Date(lawyer.tanggal_daftar).toLocaleDateString("id-ID")
                              : "-"}
                          </td>
                          <td>
                            <div className="table-actions">
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
