import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  const navigate = useNavigate();
  const [pengacara, setPengacara] = useState({
    nama: "",
    ktp: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    email: "",
    no_hp: "",
    nomor_induk_advokat: "",
    universitas: "",
    pendidikan: "",
    spesialisasi: "",
    pengalaman: "",
    upload_ktp: "",
    upload_foto: "",
    upload_kartu_advokat: "",
    upload_pkpa: "",
    username: "",
    password: "",
    tanggal_daftar: "",
  });

  const [dataPengacara, setDataPengacara] = useState([]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setPengacara({
      ...pengacara,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in pengacara) {
        formData.append(key, pengacara[key]);
      }

      await axios.post("http://localhost:5000/api/pengacara", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data pengacara berhasil ditambahkan!");
      fetchPengacara();
      setPengacara({}); // reset form
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      alert("Terjadi kesalahan saat menambahkan data");
    }
  };

  const fetchPengacara = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pengacara");
      setDataPengacara(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchPengacara();
  }, []);

  return (
    <div className="admin-container flex">
      <SidebarAdmin />
      <main className="admin-content">
        <h2 className="admin-title">Tambah Pengacara</h2>

        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          {[
            { label: "Nama", name: "nama" },
            { label: "Nomor KTP", name: "ktp" },
            { label: "Tanggal Lahir", name: "tanggal_lahir", type: "date" },
            { label: "Jenis Kelamin", name: "jenis_kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
            { label: "Alamat", name: "alamat" },
            { label: "Email", name: "email", type: "email" },
            { label: "No HP", name: "no_hp" },
            { label: "Nomor Induk Advokat", name: "nomor_induk_advokat" },
            { label: "Universitas", name: "universitas" },
            { label: "Pendidikan", name: "pendidikan" },
            { label: "Spesialisasi", name: "spesialisasi" },
            { label: "Pengalaman", name: "pengalaman" },
            { label: "Username", name: "username" },
            { label: "Password", name: "password", type: "password" },
            { label: "Tanggal Daftar", name: "tanggal_daftar", type: "date" },
            { label: "Upload KTP", name: "upload_ktp", type: "file" },
            { label: "Upload Foto", name: "upload_foto", type: "file" },
            { label: "Upload Kartu Advokat", name: "upload_kartu_advokat", type: "file" },
            { label: "Upload Sertifikat PKPA", name: "upload_pkpa", type: "file" },
          ].map(({ label, name, type = "text", options }) =>
            type === "select" ? (
              <select key={name} name={name} onChange={handleChange} className="admin-input" required>
                <option value="">{label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={name}
                type={type}
                name={name}
                value={type !== "file" ? pengacara[name] || "" : undefined}
                onChange={handleChange}
                className="admin-input"
                placeholder={type !== "file" ? label : undefined}
                required={type !== "file" || name.includes("upload")}
              />
            )
          )}

          <button type="submit" className="admin-submit-button">
            Simpan Data
          </button>
        </form>

        {/* Tabel Data Pengacara */}
        <h3 className="admin-title">Daftar Pengacara</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>KTP</th>
                <th>Tgl Lahir</th>
                <th>JK</th>
                <th>Alamat</th>
                <th>Nomor Induk</th>
                <th>Univ</th>
                <th>Pendidikan</th>
                <th>Spesialisasi</th>
                <th>Pengalaman</th>
                <th>Username</th>
                <th>Tgl Daftar</th>
              </tr>
            </thead>
            <tbody>
              {dataPengacara.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.email}</td>
                  <td>{item.no_hp}</td>
                  <td>{item.ktp}</td>
                  <td>{item.tanggal_lahir}</td>
                  <td>{item.jenis_kelamin}</td>
                  <td>{item.alamat}</td>
                  <td>{item.nomor_induk_advokat}</td>
                  <td>{item.universitas}</td>
                  <td>{item.pendidikan}</td>
                  <td>{item.spesialisasi}</td>
                  <td>{item.pengalaman}</td>
                  <td>{item.username}</td>
                  <td>{item.tanggal_daftar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TambahPengacara;
