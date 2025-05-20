import { useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/Pengacara.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !judul ||
      !deskripsi ||
      !jenis_hukum ||
      !filePdf ||
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
    formData.append("file", filePdf);  // upload file PDF
    formData.append("nomor", nomor);
    formData.append("tahun", tahun);
    formData.append("jenis_dokumen", jenis_dokumen);
    formData.append("tanggal_penetapan", tanggal_penetapan);
    formData.append("tempat_penetapan", tempat_penetapan);
    formData.append("status", status);

    try {
      await axios.post("http://localhost:5000/api/artikel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Artikel berhasil ditambahkan!");
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
    } catch (error) {
      console.error("Gagal menambahkan artikel:", error);
      alert("Terjadi kesalahan saat menambahkan artikel");
    }
  };

  return (
    <AdminLayout>
      <div className="tambah-artikel-page">
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
            onChange={(e) => setJenishukum(e.target.value)}
            className="admin-input"
            required
          >
            <option value="">Pilih Jenis Hukum</option>
            <option value="Pidana">Pidana</option>
            <option value="Perdata">Perdata</option>
            <option value="Internasional">Internasional</option>
            <option value="Ketenagakerjaan">Ketenagakerjaan</option>
            <option value="HAKI">HAKI</option>
            <option value="Keluarga">Keluarga</option>
            <option value="Administrasi Negara">Administrasi Negara</option>
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
            required
          />

          <button type="submit" className="admin-submit-button">
            Simpan Artikel
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TambahArtikel;
