import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/Pengacara.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const TambahArtikel = () => {
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

  const [artikelList, setArtikelList] = useState([]);
  const [editId, setEditId] = useState(null);

  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !judul ||
      !deskripsi ||
      !jenis_hukum ||
      (!filePdf && !editId) ||
      !nomor ||
      !tahun ||
      !jenis_dokumen ||
      !tanggal_penetapan ||
      !tempat_penetapan ||
      !status
    ) {
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
        alert("Artikel berhasil diperbarui");
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/artikel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Artikel berhasil ditambahkan!");
      }

      resetForm();
      fetchArtikelList();
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);
      alert("Terjadi kesalahan saat menyimpan artikel");
    }
  };

  const fetchArtikelList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/artikel");
      setArtikelList(res.data);
    } catch (err) {
      console.error("Gagal ambil data artikel:", err);
    }
  };

  const handleDeleteArtikel = async (id) => {
    if (!window.confirm("Apakah yakin ingin menghapus artikel ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/artikel/${id}`);
      alert("Artikel berhasil dihapus");
      fetchArtikelList();
    } catch (err) {
      console.error("Gagal menghapus artikel:", err);
      alert("Gagal menghapus artikel");
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
    setTanggalPenetapan(artikel.tanggal_penetapan.slice(0, 10));
    setTempatPenetapan(artikel.tempat_penetapan);
    setStatus(artikel.status);
    setFilePdf(null);
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

  useEffect(() => {
    fetchArtikelList();
  }, []);

  // Filtered & searched artikel list
  const filteredArtikel = artikelList.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis ? item.jenis_hukum === filterJenis : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchJenis && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="tambah-artikel-page">
        <h2 className="admin-title">{editId ? "Edit Artikel" : "Tambah Artikel Baru"}</h2>
        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Judul Artikel"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="admin-input"
            required
          />

          <select
            value={jenis_hukum}
            onChange={(e) => setJenishukum(e.target.value)}
            className="admin-input"
            required
          >
            <option value="">Pilih Jenis Hukum</option>
            <option value="Pidana">Hukum Pidana</option>
            <option value="Perdata">Hukum Perdata</option>
            <option value="Internasional">Hukum Internasional</option>
            <option value="Ketenagakerjaan">Hukum Ketenagakerjaan</option>
            <option value="HAKI">Hukum HAKI</option>
            <option value="Keluarga">Hukum Keluarga</option>
            <option value="Administrasi Negara">Hukum Administrasi Negara</option>
          </select>

          <input
            type="text"
            placeholder="Deskripsi Artikel"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="text"
            placeholder="Nomor Dokumen"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="number"
            placeholder="Tahun"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="text"
            placeholder="Jenis Dokumen"
            value={jenis_dokumen}
            onChange={(e) => setJenisDokumen(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="date"
            value={tanggal_penetapan}
            onChange={(e) => setTanggalPenetapan(e.target.value)}
            className="admin-input"
            required
          />

          <input
            type="text"
            placeholder="Tempat Penetapan"
            value={tempat_penetapan}
            onChange={(e) => setTempatPenetapan(e.target.value)}
            className="admin-input"
            required
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="admin-input"
            required
          >
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFilePdf(e.target.files[0])}
            className="admin-input"
          />

          <button type="submit" className="admin-submit-button">
            {editId ? "Perbarui Artikel" : "Simpan Artikel"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="admin-submit-button"
              style={{ background: "#888", marginLeft: "10px" }}
            >
              Batal Edit
            </button>
          )}
        </form>

        {/* FILTERS */}
        <div style={{ marginTop: "30px", marginBottom: "10px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 250px" }}
          />
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 200px" }}
          >
            <option value="">Semua Jenis Hukum</option>
            <option value="Pidana">Hukum Pidana</option>
            <option value="Perdata">Hukum Perdata</option>
            <option value="Internasional">Hukum Internasional</option>
            <option value="Ketenagakerjaan">Hukum Ketenagakerjaan</option>
            <option value="HAKI">Hukum HAKI</option>
            <option value="Keluarga">Hukum Keluarga</option>
            <option value="Administrasi Negara">Hukum Administrasi Negara</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "8px 12px", flex: "1 1 150px" }}
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setFilterJenis("");
              setFilterStatus("");
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
            Reset Filter
          </button>
        </div>

        <h3 className="admin-title">Daftar Artikel</h3>
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Jenis</th>
                  <th>Nomor</th>
                  <th>Tahun</th>
                  <th>Status</th>
                  <th>Cover</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtikel.length > 0 ? (
                  filteredArtikel.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.judul}</td>
                      <td>{item.jenis_hukum}</td>
                      <td>{item.nomor}</td>
                      <td>{item.tahun}</td>
                      <td>{item.status}</td>
                      <td>
                        {item.coverPath ? (
                          <img
                            src={`http://localhost:5000/${item.coverPath}`}
                            alt="cover"
                            width="50"
                            style={{ borderRadius: "4px" }}
                          />
                        ) : (
                          "Tidak Ada"
                        )}
                      </td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditArtikel(item)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteArtikel(item.id)}
                        >
                          <FaTrash /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      Tidak ada data yang sesuai filter.
                    </td>
                  </tr>
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
