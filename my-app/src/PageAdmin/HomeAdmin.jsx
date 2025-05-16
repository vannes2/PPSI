import { useState, useEffect, useRef } from "react";
import { FaTrash, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS_Admin/HomeAdmin.css";
import AdminLayout from "../components/AdminLayout";


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
        <AdminLayout>
    <div className="dashboard-wrapper flex">
      <main className="dashboard-content">
        {activeTab === "pengacara" && (
          <div>
            <h2>Daftar Pengacara</h2>
            <p><strong>Tabel:</strong> pengacara</p>
            <p><strong>Jumlah Data:</strong> {filteredPengacara.length}</p>

            <input
              type="text"
              placeholder="Cari pengacara..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="toolbar">
              <button className="btn-primary" onClick={handleAddClick}>
                <FaPlus /> Tambah
              </button>
              <button className="btn-refresh" onClick={fetchPengacara}>
                Refresh
              </button>
            </div>

            <div className="table-wrapper">
              <div ref={tableRef} className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>KTP</th>
                      <th>Tanggal Lahir</th>
                      <th>Jenis Kelamin</th>
                      <th>Alamat</th>
                      <th>Email</th>
                      <th>No HP</th>
                      <th>Nomor Induk Advokat</th>
                      <th>Universitas</th>
                      <th>Pendidikan</th>
                      <th>Spesialisasi</th>
                      <th>Pengalaman</th>
                      <th>Upload KTP</th>
                      <th>Upload Foto</th>
                      <th>Upload Kartu Advokat</th>
                      <th>Upload PKPA</th>
                      <th>Username</th>
                      <th>Password</th>
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
                          <td>{lawyer.ktp ?? "-"}</td>
                          <td>{lawyer.tanggal_lahir ?? "-"}</td>
                          <td>{lawyer.jenis_kelamin ?? "-"}</td>
                          <td>{lawyer.alamat ?? "-"}</td>
                          <td>{lawyer.email ?? "-"}</td>
                          <td>{lawyer.no_hp ?? "-"}</td>
                          <td>{lawyer.nomor_induk_advokat ?? "-"}</td>
                          <td>{lawyer.universitas ?? "-"}</td>
                          <td>{lawyer.pendidikan ?? "-"}</td>
                          <td>{lawyer.spesialisasi ?? "-"}</td>
                          <td>{lawyer.pengalaman ? `${lawyer.pengalaman} tahun` : "-"}</td>
                          <td>{lawyer.upload_ktp ?? "-"}</td>
                          <td>{lawyer.upload_foto ?? "-"}</td>
                          <td>{lawyer.upload_kartu_advokat ?? "-"}</td>
                          <td>{lawyer.upload_pkpa ?? "-"}</td>
                          <td>{lawyer.username ?? "-"}</td>
                          <td>{lawyer.password ?? "-"}</td>
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
                        <td colSpan="21">Tidak ada data pengacara.</td>
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
    </AdminLayout>
  );
};

export default HomeAdmin;
