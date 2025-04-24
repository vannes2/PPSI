import { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setPengacara({
      ...pengacara,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      const formData = new FormData();
      for (const key in pengacara) {
        if (pengacara[key]) {
          formData.append(key, pengacara[key]);
        }
      }

      await axios.post("http://localhost:5000/api/pengacara", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Data pengacara berhasil ditambahkan!");
      fetchPengacara();
      // Reset form
      setPengacara({
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
    } catch (error) {
      console.error("Gagal menambahkan data:", error);
      setErrorMessage("Terjadi kesalahan saat menambahkan data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPengacara = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pendaftaran_pengacara");
      setDataPengacara(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setErrorMessage("Gagal mengambil data pengacara");
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

        {successMessage && (
          <div className="alert-success">
            <i className="alert-icon">✓</i>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert-error">
            <i className="alert-icon">⚠</i>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
          {/* Personal Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="admin-label">Nama Lengkap*</label>
              <input
                type="text"
                name="nama"
                value={pengacara.nama}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Nomor KTP*</label>
              <input
                type="text"
                name="ktp"
                value={pengacara.ktp}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Tanggal Lahir*</label>
              <input
                type="date"
                name="tanggal_lahir"
                value={pengacara.tanggal_lahir}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="admin-label">Jenis Kelamin*</label>
              <select
                name="jenis_kelamin"
                value={pengacara.jenis_kelamin}
                onChange={handleChange}
                className="admin-input"
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="admin-label">Email*</label>
              <input
                type="email"
                name="email"
                value={pengacara.email}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Nomor HP*</label>
              <input
                type="text"
                name="no_hp"
                value={pengacara.no_hp}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="admin-label">Alamat*</label>
              <input
                type="text"
                name="alamat"
                value={pengacara.alamat}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Username*</label>
              <input
                type="text"
                name="username"
                value={pengacara.username}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Password*</label>
              <input
                type="password"
                name="password"
                value={pengacara.password}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="admin-label">Nomor Induk Advokat*</label>
              <input
                type="text"
                name="nomor_induk_advokat"
                value={pengacara.nomor_induk_advokat}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Universitas*</label>
              <input
                type="text"
                name="universitas"
                value={pengacara.universitas}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Pendidikan*</label>
              <input
                type="text"
                name="pendidikan"
                value={pengacara.pendidikan}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="admin-label">Spesialisasi</label>
              <input
                type="text"
                name="spesialisasi"
                value={pengacara.spesialisasi}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Pengalaman</label>
              <input
                type="text"
                name="pengalaman"
                value={pengacara.pengalaman}
                onChange={handleChange}
                className="admin-input"
              />
            </div>
            
            <div className="form-group">
              <label className="admin-label">Tanggal Daftar*</label>
              <input
                type="date"
                name="tanggal_daftar"
                value={pengacara.tanggal_daftar}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="upload-section">
            <div className="upload-group">
              <label className="admin-label">Upload KTP*</label>
              <input 
                type="file" 
                name="upload_ktp" 
                onChange={handleChange} 
                className="admin-input" 
                required 
              />
              {pengacara.upload_ktp && (
                <div className="file-preview">{pengacara.upload_ktp.name}</div>
              )}
            </div>
            
            <div className="upload-group">
              <label className="admin-label">Upload Foto*</label>
              <input 
                type="file" 
                name="upload_foto" 
                onChange={handleChange} 
                className="admin-input" 
                required 
              />
              {pengacara.upload_foto && (
                <div className="file-preview">{pengacara.upload_foto.name}</div>
              )}
            </div>
            
            <div className="upload-group">
              <label className="admin-label">Upload Kartu Advokat*</label>
              <input 
                type="file" 
                name="upload_kartu_advokat" 
                onChange={handleChange} 
                className="admin-input" 
                required 
              />
              {pengacara.upload_kartu_advokat && (
                <div className="file-preview">{pengacara.upload_kartu_advokat.name}</div>
              )}
            </div>
            
            <div className="upload-group">
              <label className="admin-label">Upload Sertifikat PKPA*</label>
              <input 
                type="file" 
                name="upload_pkpa" 
                onChange={handleChange} 
                className="admin-input" 
                required 
              />
              {pengacara.upload_pkpa && (
                <div className="file-preview">{pengacara.upload_pkpa.name}</div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
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
                <th>Tanggal Lahir</th>
                <th>JK</th>
                <th>Alamat</th>
                <th>Nomor Induk</th>
                <th>Universitas</th>
                <th>Pendidikan</th>
                <th>Spesialisasi</th>
                <th>Pengalaman</th>
                <th>Username</th>
                <th>Tanggal Daftar</th>
                <th>Dokumen</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPengacara.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{item.email}</td>
                  <td>{item.no_hp}</td>
                  <td>{item.ktp}</td>
                  <td>{new Date(item.tanggal_lahir).toLocaleDateString()}</td>
                  <td>{item.jenis_kelamin}</td>
                  <td>{item.alamat}</td>
                  <td>{item.nomor_induk_advokat || "-"}</td>
                  <td>{item.universitas}</td>
                  <td>{item.pendidikan}</td>
                  <td>{item.spesialisasi || "-"}</td>
                  <td>{item.pengalaman}</td>
                  <td>{item.username}</td>
                  <td>{new Date(item.tanggal_daftar).toLocaleDateString()}</td>
                  <td>
                    <div className="flex-center gap-4">
                      {item.upload_ktp && (
                        <a 
                          href={`http://localhost:5000/uploads/${item.upload_ktp}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="doc-link"
                        >
                          KTP
                        </a>
                      )}
                      {item.upload_foto && (
                        <a 
                          href={`http://localhost:5000/uploads/${item.upload_foto}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="doc-link"
                        >
                          Foto
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex-center gap-4">
                      <button className="action-btn edit-btn">
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="action-btn delete-btn">
                        <i className="fas fa-trash"></i> Hapus
                      </button>
                    </div>
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