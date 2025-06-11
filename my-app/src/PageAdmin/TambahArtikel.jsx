import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/Pengacara.css";
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const TambahArtikel = () => {
  // State untuk form fields
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [jenis_hukum, setJenishukum] = useState("");
  const [filePdf, setFilePdf] = useState(null);
  const [nomor, setNomor] = useState("");
  const [tahun, setTahun] = useState("");
  const [jenis_dokumen, setJenisDokumen] = useState("");
  const [tanggal_penetapan, setTanggalPenetapan] = useState("");
  const [tempat_penetapan, setTempatPenetapan] = useState("");
  const [status, setStatus] = useState("Aktif");

  // State untuk manajemen data dan UI
  const [artikelList, setArtikelList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // State baru untuk kontrol modal
  const [showModal, setShowModal] = useState(false);

  const jenisHukumOptions = ["Pidana", "Perdata", "Internasional", "Ketenagakerjaan", "HAKI", "Keluarga", "Administrasi Negara"];

  useEffect(() => {
    fetchArtikelList();
  }, []);

  const fetchArtikelList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artikel");
      setArtikelList(res.data);
    } catch (err) {
      console.error("Gagal ambil data artikel:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !deskripsi || !jenis_hukum || (!filePdf && !editId) || !nomor || !tahun || !jenis_dokumen || !tanggal_penetapan || !tempat_penetapan || !status) {
      return alert("Semua field wajib diisi!");
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("jenis_hukum", jenis_hukum);
    if (filePdf) formData.append("file", filePdf);
    formData.append("nomor", nomor);
    formData.append("tahun", tahun);
    formData.append("jenis_dokumen", jenis_dokumen);
    formData.append("tanggal_penetapan", tanggal_penetapan);
    formData.append("tempat_penetapan", tempat_penetapan);
    formData.append("status", status);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/artikel/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Dokumen berhasil diperbarui");
      } else {
        await axios.post("http://localhost:5000/api/artikel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Dokumen berhasil ditambahkan!");
      }
      resetForm();
      fetchArtikelList();
      setShowModal(false); 
    } catch (error) {
      console.error("Gagal menyimpan dokumen:", error);
      alert("Terjadi kesalahan saat menyimpan dokumen");
    }
  };

  const handleDeleteArtikel = async (id) => {
    if (!window.confirm("Apakah yakin ingin menghapus dokumen ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/artikel/${id}`);
      alert("Dokumen berhasil dihapus");
      fetchArtikelList();
    } catch (err) {
      console.error("Gagal menghapus dokumen:", err);
      alert("Gagal menghapus dokumen");
    }
  };

  const handleEditArtikel = (artikel) => {
    setEditId(artikel.id);
    setJudul(artikel.judul);
    setDeskripsi(artikel.deskripsi);
    setJenishukum(artikel.jenis_hukum);
    setNomor(artikel.nomor);
    setTahun(artikel.tahun);
    setJenisDokumen(artikel.jenis_dokumen);
    setTanggalPenetapan(new Date(artikel.tanggal_penetapan).toISOString().slice(0, 10));
    setTempatPenetapan(artikel.tempat_penetapan);
    setStatus(artikel.status);
    setFilePdf(null);
    setShowModal(true); 
  };
  
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setEditId(null);
    setJudul("");
    setDeskripsi("");
    setJenishukum("");
    setFilePdf(null);
    setNomor("");
    setTahun("");
    setJenisDokumen("");
    setTanggalPenetapan("");
    setTempatPenetapan("");
    setStatus("Aktif");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterJenis("");
    setFilterStatus("");
  };

  const filteredArtikel = artikelList.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis ? item.jenis_hukum === filterJenis : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchJenis && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="admin-content-container">
        
        {/* BAGIAN HEADER YANG BENAR */}
        <div className="page-header">
          <h1 className="page-title">Manajemen Dokumen Hukum</h1>
          <button onClick={openAddModal} className="btn btn-primary-action">
            Tambah Dokumen Baru
          </button>
        </div>

        {/* Modal untuk Form Tambah/Edit */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">{editId ? "Edit Dokumen Hukum" : "Tambah Dokumen Hukum Baru"}</h2>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-grid">
                  <input type="text" placeholder="Judul Dokumen" value={judul} onChange={(e) => setJudul(e.target.value)} className="admin-input" required />
                  <input type="text" placeholder="Nomor Dokumen" value={nomor} onChange={(e) => setNomor(e.target.value)} className="admin-input" required />
                  <textarea placeholder="Deskripsi Singkat" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="admin-input" required style={{gridColumn: "span 2", height: "80px"}} />
                  <select value={jenis_hukum} onChange={(e) => setJenishukum(e.target.value)} className="admin-input" required>
                    <option value="">Pilih Jenis Hukum</option>
                    {jenisHukumOptions.map(opt => <option key={opt} value={opt}>Hukum {opt}</option>)}
                  </select>
                  <input type="number" placeholder="Tahun Penetapan" value={tahun} onChange={(e) => setTahun(e.target.value)} className="admin-input" required />
                  <input type="text" placeholder="Jenis Dokumen (e.g., UU, PP, Perpres)" value={jenis_dokumen} onChange={(e) => setJenisDokumen(e.target.value)} className="admin-input" required />
                  <input type="text" placeholder="Tempat Penetapan" value={tempat_penetapan} onChange={(e) => setTempatPenetapan(e.target.value)} className="admin-input" required />
                  <div className="input-with-label">
                    <label htmlFor="tanggal_penetapan">Tanggal Penetapan</label>
                    <input id="tanggal_penetapan" type="date" value={tanggal_penetapan} onChange={(e) => setTanggalPenetapan(e.target.value)} className="admin-input" required />
                  </div>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input" required>
                    <option value="Aktif">Status: Aktif</option>
                    <option value="Tidak Aktif">Status: Tidak Aktif</option>
                  </select>
                  <div className="input-with-label" style={{gridColumn: "span 2"}}>
                    <label htmlFor="file_pdf">{editId ? "Ganti File PDF (Opsional)" : "Upload File PDF (Wajib)"}</label>
                    <input id="file_pdf" type="file" accept="application/pdf" onChange={(e) => setFilePdf(e.target.files[0])} className="admin-input" />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary-action">{editId ? "Perbarui Dokumen" : "Simpan Dokumen"}</button>
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-secondary-action">Tutup</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* KARTU KONTEN UTAMA YANG BENAR */}
        <div className="content-card">
          <div className="filter-bar">
            <input type="text" placeholder="Cari berdasarkan judul..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="filter-input"/>
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="filter-select">
              <option value="">Semua Jenis Hukum</option>
              {jenisHukumOptions.map(opt => <option key={opt} value={opt}>Hukum {opt}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
            <button onClick={resetFilters} className="btn btn-reset-action">
              <FaTimes /> Reset
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Jenis</th>
                  <th>Nomor</th>
                  <th>Tahun</th>
                  <th>Status</th>
                  <th>File</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtikel.length > 0 ? (
                  filteredArtikel.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td className="td-judul">{item.judul}</td>
                      <td>{item.jenis_hukum}</td>
                      <td>{item.nomor}</td>
                      <td>{item.tahun}</td>
                      <td>
                        <span className={`status-badge status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span>
                      </td>
                      <td>
                        <a href={`http://localhost:5000/uploads/${item.file_path}`} target="_blank" rel="noreferrer" className="table-link">Lihat</a>
                      </td>
                      <td className="table-actions">
                        <button className="btn-icon" onClick={() => handleEditArtikel(item)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon" onClick={() => handleDeleteArtikel(item.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="no-data">Tidak ada data ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TambahArtikel;