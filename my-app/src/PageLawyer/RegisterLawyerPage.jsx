import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAfter from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../CSS_Lawyer/RegisterLawyerPage.css";

const RegisterLawyerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.konfirmasi_password) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        if (key !== "konfirmasi_password") {
          dataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch("http://localhost:5000/api/lawyers/register", {
        method: "POST",
        body: dataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Pendaftaran gagal.");
      }

      alert("Pendaftaran berhasil! Silakan cek email untuk informasi selanjutnya.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  return (
    <>
      <HeaderAfter />
      <div className="register-lawyer-page">
        <br /><br /><br /><br /><br />
        <h2 className="title">Pendaftaran Advokat</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="form-register-lawyer" onSubmit={handleSubmit}>
          <div className="container-form">

            {/* Row 1 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input name="nama" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nomor KTP</label>
                <input name="ktp" onChange={handleChange} required />
              </div>
            </div>

            {/* Row 2 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input type="date" name="tanggalLahir" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select name="jenisKelamin" onChange={handleChange} required defaultValue="">
                  <option value="" disabled>Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Alamat Domisili</label>
                <input name="alamat" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} required />
              </div>
            </div>

            {/* Row 4 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>No HP / WhatsApp</label>
                <input name="telepon" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nomor Induk Advokat</label>
                <input name="nomorIndukAdvokat" onChange={handleChange} required />
              </div>
            </div>

            {/* Row 5 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Asal Universitas</label>
                <input name="universitas" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Pendidikan</label>
                <input name="pendidikan" onChange={handleChange} required />
              </div>
            </div>

            {/* Row 6 */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Spesialisasi</label>
                <select
                  name="spesialisasi"
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Pilih Spesialisasi
                  </option>
                  <option value="Hukum perdata">Hukum perdata</option>
                  <option value="Hukum pidana">Hukum pidana</option>
                  <option value="Hukum bisnis dan perusahaan">Hukum bisnis dan perusahaan</option>
                  <option value="Hukum keluarga">Hukum keluarga</option>
                  <option value="Hukum Haki">Hukum Haki</option>
                  <option value="Hukum ketenagakerjaan">Hukum ketenagakerjaan</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pengalaman (dalam tahun)</label>
                <input type="number" name="pengalaman" onChange={handleChange} required />
              </div>
            </div>

            {/* File Uploads */}
            <div className="container-form-row">
              <div className="form-group">
                <label>Upload KTP</label>
                <input type="file" name="uploadKTP" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Upload Pas Foto</label>
                <input type="file" name="uploadFoto" onChange={handleChange} required />
              </div>
            </div>

            <div className="container-form-row">
              <div className="form-group">
                <label>Upload Kartu Advokat</label>
                <input type="file" name="uploadKartuAdvokat" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Upload Sertifikat PKPA</label>
                <input type="file" name="uploadPKPA" onChange={handleChange} required />
              </div>
            </div>

            {/* Sosial Media dan Dokumen Tambahan */}
            <div className="container-form-row">
              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  placeholder="https://instagram.com/username"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="container-form-row">
              <div className="form-group">
                <label>Twitter / X</label>
                <input
                  type="url"
                  name="twitter"
                  placeholder="https://twitter.com/username"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Upload Resume / CV</label>
                <input type="file" name="resumeCV" onChange={handleChange} />
              </div>
            </div>

            <div className="container-form-row">
              <div className="form-group">
                <label>Upload Portofolio</label>
                <input type="file" name="portofolio" onChange={handleChange} />
              </div>
            </div>

            {/* Akun */}
            <div className="akun-row">
              <div className="form-group">
                <label>Username</label>
                <input name="username" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password</label>
                <input type="password" name="konfirmasi_password" onChange={handleChange} required />
              </div>
            </div>

            {/* Checkbox */}
            <div className="checkbox-group">
              <input type="checkbox" id="syarat" required />
              <label htmlFor="syarat">Saya menyetujui syarat dan ketentuan</label>
            </div>

            <p className="info-pendaftaran">
              Setelah Anda menekan tombol daftar, data akan diproses maksimal selama 3 hari kerja. Notifikasi akan dikirimkan melalui email apabila akun Anda berhasil diproses.
            </p>

            <button type="submit" className="submit-btn">
              Daftar
            </button>
          </div>
        </form>
      </div>

      <div className="footer-separator"></div>
      <Footer />
    </>
  );
};

export default RegisterLawyerPage;
