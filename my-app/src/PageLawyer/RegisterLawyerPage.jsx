import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAfter from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../CSS_Lawyer/RegisterLawyerPage.css";

const RegisterLawyerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data yang dikirim:", formData);
    // Kirim data ke backend di sini
  };

  return (
    <>
      <HeaderAfter />

      <div className="register-lawyer-page">
        <h2 className="title">Pendaftaran Advokat</h2>
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
                <select name="jenisKelamin" onChange={handleChange} required>
                  <option value="">Pilih</option>
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
                <label>Tahun Lulus</label>
                <input type="number" name="tahunLulus" onChange={handleChange} required />
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

            {/* Akun */}
            <div className="container-form-row">
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
                <input type="password" name="konfirmasiPassword" onChange={handleChange} required />
              </div>
            </div>

            {/* Checkbox */}
            <div className="checkbox-group">
              <input type="checkbox" id="syarat" required />
              <label htmlFor="syarat">Saya menyetujui syarat dan ketentuan</label>
            </div>
            {/* Informasi tambahan */}
            <p className="info-pendaftaran">
            Setelah Anda menekan tombol daftar, data akan diproses maksimal selama 3 hari kerja.
            Notifikasi akan dikirimkan melalui email apabila akun Anda berhasil diproses.
            </p>
            {/* Submit */}
            <button type="submit" className="submit-btn">Daftar</button>
          </div>
        </form>
      </div>

      <div className="footer-separator"></div>
    {/* Footer */}
    <Footer />
    </>
  );
};

export default RegisterLawyerPage;
