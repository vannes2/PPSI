import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGavel, FaHome, FaFileAlt } from "react-icons/fa";
import "../CSS_Admin/Pengacara.css";

const TambahArtikel = () => {
  const [judul, setJudul] = useState("");
  const [filePdf, setFilePdf] = useState(null);
  const [activeTab, setActiveTab] = useState("tambahArtikel");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !filePdf) {
      return alert("Judul dan file PDF wajib diisi!");
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("file", filePdf); // 'file' sesuai dengan nama di multer (backend)

    try {
      await axios.post("http://localhost:5000/api/artikel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Artikel berhasil ditambahkan!");
      window.location.reload();
      navigate("/TambahArtikel"); // Ganti dengan route yang kamu gunakan untuk melihat artikel
    } catch (error) {
      console.error("Gagal menambahkan artikel:", error);
      alert("Terjadi kesalahan saat menambahkan artikel");
    }
  };

  return (
    <div className="admin-container flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "bg-gray-700" : ""}>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                navigate("/HomeAdmin");
              }}
            >
              <FaHome className="mr-2" /> Dashboard
            </button>
          </li>
          <li className={activeTab === "pengacara" ? "bg-gray-700" : ""}>
            <button
              onClick={() => {
                setActiveTab("pengacara");
                navigate("/HomeAdmin");
              }}
            >
              <FaGavel className="mr-2" /> Pengacara
            </button>
          </li>
          <li className={activeTab === "tambahArtikel" ? "bg-gray-700" : ""}>
            <button
              onClick={() => {
                setActiveTab("tambahArtikel");
                navigate("/TambahArtikel");
              }}
            >
              <FaFileAlt className="mr-2" /> Tambah Artikel
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">
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
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFilePdf(e.target.files[0])}
            className="input"
          />

          <div><br></br></div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
          >
            Simpan Artikel
          </button>
        </form>
      </main>
    </div>
  );
};

export default TambahArtikel;
