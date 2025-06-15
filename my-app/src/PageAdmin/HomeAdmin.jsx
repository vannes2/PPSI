import { useState, useEffect, useRef } from "react";
import { FaTrash, FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS_Admin/HomeAdmin.css"; 
import AdminLayout from "../components/AdminLayout";

// Komponen Ikon SVG
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#a3b1c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5.5 0-9.9-3.6-11-8 1.06-3.67 4.5-7 11-7a10.94 10.94 0 0 1 5.94 1.94" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const HomeAdmin = () => {
  const [activeTab] = useState("pengacara");
  const [pengacara, setPengacara] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState({});
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

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredPengacara = pengacara.filter((lawyer) =>
    lawyer.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {activeTab === "pengacara" && (
        <div className="home-admin-container">
          <div className="detail-data">
            <h2>Daftar Pengacara</h2>
            <p><strong>Tabel:</strong> pengacara</p>
            <p><strong>Jumlah Data:</strong> {filteredPengacara.length}</p>
          </div>

          <div className="header-controls">
            <input
              className="search-input"
              type="text"
              placeholder="Cari pengacara berdasarkan nama..."
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
                    <th>No Induk Advokat</th>
                    <th>Universitas</th>
                    <th>Pendidikan</th>
                    <th>Spesialisasi</th>
                    <th>Pengalaman (Tahun)</th>
                    <th>Upload KTP</th>
                    <th>Foto</th>
                    <th>Kartu Advokat</th>
                    <th>PKPA</th>
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
                        <td>{lawyer.nama}</td>
                        <td>{lawyer.ktp}</td>
                        <td>{new Date(lawyer.tanggal_lahir).toLocaleDateString('id-ID')}</td>
                        <td>{lawyer.jenis_kelamin}</td>
                        <td>{lawyer.alamat}</td>
                        <td>{lawyer.email}</td>
                        <td>{lawyer.no_hp}</td>
                        <td>{lawyer.nomor_induk_advokat}</td>
                        <td>{lawyer.universitas}</td>
                        <td>{lawyer.pendidikan}</td>
                        <td>{lawyer.spesialisasi}</td>
                        <td>{lawyer.pengalaman}</td>
                        <td>{lawyer.upload_ktp}</td>
                        <td>
                          {lawyer.upload_foto ? (
                            <img
                              src={`http://localhost:5000/uploads/${lawyer.upload_foto}`}
                              alt="foto"
                              width="40"
                              style={{ borderRadius: "4px", verticalAlign: "middle" }}
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>{lawyer.upload_kartu_advokat}</td>
                        <td>{lawyer.upload_pkpa}</td>
                        <td>{lawyer.username}</td>
                        <td style={{ display: "flex", alignItems: "center", gap: "8px" }} >
                          <span style={{ userSelect: "none" }}>
                            {showPasswords[lawyer.id] ? lawyer.password : "••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(lawyer.id)}
                            title={showPasswords[lawyer.id] ? "Sembunyikan" : "Tampilkan"}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                          >
                            {showPasswords[lawyer.id] ? <EyeSlashIcon /> : <EyeIcon />}
                          </button>
                        </td>
                        <td>{new Date(lawyer.tanggal_daftar).toLocaleDateString('id-ID')}</td>
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
                      <td colSpan="21" style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "40px" }} >
                        🔍 Data pengacara tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default HomeAdmin;