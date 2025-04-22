import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGavel, FaHome, FaFileAlt } from "react-icons/fa";
import "../CSS_Admin/Pengacara.css";


const TambahArtikel = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [filePdf, setFilePdf] = useState(null);
  const [activeTab, setActiveTab] = useState("tambahArtikel");
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
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "nav-active" : ""}>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                navigate("/HomeAdmin");
              }}
            >
              <FaHome /> Dashboard
            </button>
          </li>
          <li className={activeTab === "pengacara" ? "nav-active" : ""}>
            <button
              onClick={() => {
                setActiveTab("pengacara");
                navigate("/HomeAdmin");
              }}
            >
              <FaGavel /> Pengacara
            </button>
          </li>
          <li className={activeTab === "tambahArtikel" ? "nav-active" : ""}>
            <button
              onClick={() => {
                setActiveTab("tambahArtikel");
                navigate("/TambahArtikel");
              }}
            >
              <FaFileAlt /> Tambah Artikel
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h2>Tambah Artikel Baru</h2>
        <form
          onSubmit={handleSubmit}
          className="form-artikel"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="Judul Artikel"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="input"
            required
          />

          <input
            type="text"
            placeholder="Deskripsi Artikel"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="input"
            required
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFilePdf(e.target.files[0])}
            className="input"
            required
          />

          <div><br /></div>

          <button
            type="submit"
            className="btn-primary"
          >
            Simpan Artikel
          </button>
        </form>
      </main>
    </div>
  );
};

export default TambahArtikel;
