import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  //const navigate = useNavigate();
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
      const response = await axios.get("http://localhost:5000/api/pendaftaran_pengacara");
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
          {["nama", "ktp", "tanggal_lahir", "jenis_kelamin", "alamat", "email", "no_hp", "nomor_induk_advokat", "universitas", "pendidikan", "spesialisasi", "pengalaman", "username", "password", "tanggal_daftar"].map((field) => {
            const label = field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            const type = field === "tanggal_lahir" || field === "tanggal_daftar" ? "date" : field === "email" ? "email" : field === "password" ? "password" : "text";
            return field === "jenis_kelamin" ? (
              <select key={field} name={field} onChange={handleChange} className="admin-input" required>
                <option value="">Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            ) : (
              <input
                key={field}
                type={type}
                name={field}
                value={pengacara[field] || ""}
                onChange={handleChange}
                className="admin-input"
                placeholder={label}
                required
              />
            );
          })}

          <div className="upload-section">
            <label className="upload-label">Upload KTP</label>
            <input type="file" name="upload_ktp" onChange={handleChange} className="admin-input" required />

            <label className="upload-label">Upload Pas Foto</label>
            <input type="file" name="upload_foto" onChange={handleChange} className="admin-input" required />

            <label className="upload-label">Upload Kartu Advokat</label>
            <input type="file" name="upload_kartu_advokat" onChange={handleChange} className="admin-input" required />

            <label className="upload-label">Upload Sertifikat PKPA</label>
            <input type="file" name="upload_pkpa" onChange={handleChange} className="admin-input" required />
          </div>

          <button type="submit" className="admin-submit-button">Simpan Data</button>
        </form>

        <h3 className="admin-title">Daftar Pengacara</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>No HP</th>
                <th>KTP</th>
                <th>Tgl Lahir</th>
                <th>JK</th>
                <th>Alamat</th>
                <th>Nomor Induk</th>
                <th>Universitas</th>
                <th>Pendidikan</th>
                <th>Spesialisasi</th>
                <th>Pengalaman</th>
                <th>Username</th>
                <th>Tgl Daftar</th>
                <th>KTP File</th>
                <th>Foto</th>
                <th>Kartu Advokat</th>
                <th>PKPA</th>
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
                  <td>{item.nomor_induk_advokat || "-"}</td>
                  <td>{item.universitas}</td>
                  <td>{item.pendidikan}</td>
                  <td>{item.spesialisasi || "-"}</td>
                  <td>{item.pengalaman}</td>
                  <td>{item.username}</td>
                  <td>{item.tanggal_daftar}</td>
                  <td>
                    {item.upload_ktp && (
                      <a href={`http://localhost:5000/uploads/${item.upload_ktp}`} target="_blank" rel="noreferrer">
                        Lihat KTP
                      </a>
                    )}
                  </td>
                  <td>
                    {item.upload_foto && (
                      <a href={`http://localhost:5000/uploads/${item.upload_foto}`} target="_blank" rel="noreferrer">
                        Lihat Foto
                      </a>
                    )}
                  </td>
                  <td>
                    {item.upload_kartu_advokat && (
                      <a href={`http://localhost:5000/uploads/${item.upload_kartu_advokat}`} target="_blank" rel="noreferrer">
                        Lihat Kartu
                      </a>
                    )}
                  </td>
                  <td>
                    {item.upload_pkpa && (
                      <a href={`http://localhost:5000/uploads/${item.upload_pkpa}`} target="_blank" rel="noreferrer">
                        Lihat PKPA
                      </a>
                    )}
                  </td>
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