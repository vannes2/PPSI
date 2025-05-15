import { useState, useEffect } from 'react';
import '../CSS_User/AjukanKasus.css';
import HeaderAfter from '../components/HeaderAfter';
import Footer from '../components/Footer';

const AjukanKasus = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    nama: '',
    email: '',
    noHp: '',
    areaPraktik: '',
    jenisPengerjaan: '',
    biayaMin: '',
    biayaMax: '',
    estimasiSelesai: '',
    lokasi: '',
    deskripsi: ''
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setFormData(prev => ({
        ...prev,
        user_id: user.id,
        nama: user.nama || '',
        email: user.email || '',
        noHp: user.no_hp || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (file) data.append('bukti', file);

    try {
      const response = await fetch('http://localhost:5000/api/ajukan-kasus', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('Pengajuan kasus Anda telah dikirim!');
        setFormData({
          user_id: formData.user_id,
          nama: '',
          email: '',
          noHp: '',
          areaPraktik: '',
          jenisPengerjaan: '',
          biayaMin: '',
          biayaMax: '',
          estimasiSelesai: '',
          lokasi: '',
          deskripsi: ''
        });
        setFile(null);
      } else {
        alert('Gagal mengirim pengajuan.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengirim data.');
    }
  };

  return (
    <div>
      <HeaderAfter />
      <div className="page-wrapper">
        <div className="ajukan-kasus-container">
          <h2>Ajukan Kasus</h2>
          <p>Dapatkan pendampingan hukum dari profesional.</p>

          <form onSubmit={handleSubmit} className="ajukan-kasus-form" encType="multipart/form-data">

            <div className="form-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Alamat Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nomor HP</label>
                <input type="tel" name="noHp" value={formData.noHp} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Area Praktik</label>
                <select name="areaPraktik" value={formData.areaPraktik} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  <option value="Perdata">Perdata</option>
                  <option value="Pidana">Pidana</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Tenaga Kerja">Tenaga Kerja</option>
                  <option value="Perusahaan">Perusahaan</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pengerjaan Hukum</label>
                <select name="jenisPengerjaan" value={formData.jenisPengerjaan} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  <option value="Pendampingan">Pendampingan</option>
                  <option value="Konsultasi">Konsultasi</option>
                  <option value="Pembuatan Dokumen">Pembuatan Dokumen</option>
                  <option value="Negosiasi">Negosiasi</option>
                  <option value="Litigasi">Litigasi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estimasi Penyelesaian</label>
                <input type="date" name="estimasiSelesai" value={formData.estimasiSelesai} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Biaya Minimal</label>
                <input type="number" name="biayaMin" placeholder="Rp.0" min="500000" value={formData.biayaMin} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Biaya Maksimal</label>
                <input type="number" name="biayaMax" placeholder="Rp.0" min="500000" value={formData.biayaMax} onChange={handleChange} required />
              </div>
            </div>

            <small className="green-text">ⓘ Minimal perkiraan biaya adalah Rp500.000</small>

            <div className="form-group full">
              <label>Lokasi</label>
              <input type="text" name="lokasi" placeholder="ex: Jakarta" value={formData.lokasi} onChange={handleChange} required />
            </div>

            <div className="form-group full">
              <label>Deskripsi Kasus</label>
              <textarea name="deskripsi" placeholder="Deskripsikan permasalahan hukum Anda..." value={formData.deskripsi} onChange={handleChange} required />
            </div>

            <div className="form-group full">
              <label>Upload Bukti (opsional)</label>
              <input type="file" name="bukti" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
            </div>

            <div className="form-group full">
              <button type="submit" className="btn-kirim">Kirim Pengajuan</button>
            </div>
          </form>
        </div>
      </div>
      <div className="footer-separator" />
      <Footer />
    </div>
  );
};

export default AjukanKasus;
