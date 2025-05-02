import { useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/Pengacara.css";

const TambahArtikel = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [jenis_hukum, setJenishukum] = useState(""); // Ensure this is correct
  const [filePdf, setFilePdf] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !deskripsi || !filePdf || !jenis_hukum) {
      return alert("Judul, deskripsi, jenis hukum, dan file PDF wajib diisi!");
    }

    // Create FormData object and append fields
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("jenis_hukum", jenis_hukum);
    formData.append("file", filePdf);
    

    try {
      await axios.post("http://localhost:5000/api/artikel", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure it's set to multipart/form-data
        },
      });

      alert("Artikel berhasil ditambahkan!");
      setJudul("");
      setDeskripsi("");
      setFilePdf(null);
    } catch (error) {
      console.error("Gagal menambahkan artikel:", error);
      alert("Terjadi kesalahan saat menambahkan artikel");
    }
  };

  return (
    <div className="Tambah-Artikel">
      <SidebarAdmin />

      <main className="admin-content">
        <h2 className="admin-title">Tambah Artikel Baru</h2>

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
            onChange={(e) => setJenishukum(e.target.value)} // Update the dropdown value correctly
            className="admin-input"
            required
          >
            <option value="">Pilih Jenis Hukum</option>
            <option value="KDRT">PDF Hukum KDRT</option>
            <option value="perceraian">PDF Hukum Perceraian</option>
            <option value="pelanggaran_HAM">PDF Hukum Pelanggaran HAM</option>
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
            type="file"
            accept="application/pdf"
            onChange={(e) => setFilePdf(e.target.files[0])}
            className="admin-input"
            required
          />

          <button type="submit" className="admin-submit-button">
            Simpan Artikel
          </button>
        </form>
      </main>
    </div>
  );
};

export default TambahArtikel;
