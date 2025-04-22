import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  const navigate = useNavigate();
  const [pengacara, setPengacara] = useState({
    nama: "",
    email: "",
    no_hp: "",
    spesialisasi: "",
    pengalaman: "",
    pendidikan: "",
    tanggal_daftar: "",
  });

  const handleChange = (e) => {
    setPengacara({ ...pengacara, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/pengacara", pengacara);
      alert("Data pengacara berhasil ditambahkan!");
      navigate("/HomeAdmin");
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      alert("Terjadi kesalahan saat menambahkan data");
    }
  };

  return (
    <div className="admin-container flex">
      {/* Sidebar diganti dengan komponen */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="admin-content">
        <h2 className="admin-title">Tambah Pengacara</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="nama"
            value={pengacara.nama}
            onChange={handleChange}
            className="admin-input"
            placeholder="Nama"
            required
          />
          <input
            type="email"
            name="email"
            value={pengacara.email}
            onChange={handleChange}
            className="admin-input"
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="no_hp"
            value={pengacara.no_hp}
            onChange={handleChange}
            className="admin-input"
            placeholder="No HP"
            required
          />
          <input
            type="text"
            name="spesialisasi"
            value={pengacara.spesialisasi}
            onChange={handleChange}
            className="admin-input"
            placeholder="Spesialisasi"
            required
          />
          <input
            type="text"
            name="pengalaman"
            value={pengacara.pengalaman}
            onChange={handleChange}
            className="admin-input"
            placeholder="Pengalaman (tahun)"
            required
          />
          <input
            type="text"
            name="pendidikan"
            value={pengacara.pendidikan}
            onChange={handleChange}
            className="admin-input"
            placeholder="Pendidikan"
            required
          />
          <input
            type="date"
            name="tanggal_daftar"
            value={
              pengacara.tanggal_daftar
                ? new Date(pengacara.tanggal_daftar).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="admin-input"
            required
          />
          <button type="submit" className="admin-submit-button">
            Simpan Data
          </button>
        </form>
      </main>
    </div>
  );
};

export default TambahPengacara;
