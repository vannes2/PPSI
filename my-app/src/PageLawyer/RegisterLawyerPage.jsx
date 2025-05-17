import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAfter from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../CSS_Lawyer/RegisterLawyerPage.css";

const RegisterLawyerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.konfirmasi_password) {
    setErrorMessage("Password dan konfirmasi password tidak sama.");
    setShowErrorPopup(true);
    setTimeout(() => setShowErrorPopup(false), 3000);
    return;
  }

  // Tampilkan loading setelah 1 detik, lalu baru lanjut submit
  setIsLoading(true);

  setTimeout(async () => {
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
        const cleanMessage = result.message?.toLowerCase().includes("email")
          ? "Email sudah digunakan"
          : result.message || "Pendaftaran gagal";
        throw new Error(cleanMessage);
      }

      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(err.message);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsLoading(false);
    }
    }, 1000); // <== Delay semua proses request 1 detik agar spinner muncul dulu
  };

  return (
    <>
      <HeaderAfter />
      <div className="register-lawyer-page">
        <br /><br /><br /><br /><br />
        <h2 className="title">Pendaftaran Advokat</h2>

        <form className="form-register-lawyer" onSubmit={handleSubmit}>
          <div className="container-form">

            {/* === FORM === */}
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

            <div className="container-form-row">
              <div className="form-group">
                <label>LinkedIn</label>
                <input type="url" name="linkedin" onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input type="url" name="instagram" onChange={handleChange} />
              </div>
            </div>

            <div className="container-form-row">
              <div className="form-group">
                <label>Twitter / X</label>
                <input type="url" name="twitter" onChange={handleChange} />
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

            <div className="checkbox-group">
              <input type="checkbox" id="syarat" required />
              <label htmlFor="syarat">Saya menyetujui syarat dan ketentuan</label>
            </div>

            <p className="info-pendaftaran">
              Setelah Anda menekan tombol daftar, data akan diproses maksimal selama 3 hari kerja. Notifikasi akan dikirimkan melalui email apabila akun Anda berhasil diproses.
            </p>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </div>
        </form>
      </div>

      {/* Popup Success */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="checkmark">✔</div>
            <p>Pendaftaran berhasil</p>
          </div>
        </div>
      )}

      {/* Popup Error */}
      {showErrorPopup && (
        <div className="popup-overlay">
          <div className="popup-content error">
            <div className="error-icon">✖</div>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="popup-overlay">
          <div className="popup-content loading">
            <div className="spinner"></div>
            <p>Memproses pendaftaran...</p>
          </div>
        </div>
      )}

      <div className="footer-separator"></div>
      <Footer />
    </>
  );
};

export default RegisterLawyerPage;
