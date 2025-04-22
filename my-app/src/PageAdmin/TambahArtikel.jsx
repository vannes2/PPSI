import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/Pengacara.css";

const TambahArtikel = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [filePdf, setFilePdf] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !deskripsi || !filePdf) {
      return alert("Judul, deskripsi, dan file PDF wajib diisi!");
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("deskripsi", deskripsi);
    formData.append("file", filePdf);

    try {
      await axios.post("http://localhost:5000/api/artikel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    <div className="admin-container flex">
      {/* Sidebar diganti komponen */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="admin-content">
        <h2 className="admin-title">Tambah Artikel Baru</h2>

        <form
          onSubmit={handleSubmit}
          className="admin-form"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Judul Artikel"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="admin-input"
            required
          />

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
