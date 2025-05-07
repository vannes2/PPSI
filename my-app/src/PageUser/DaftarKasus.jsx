import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAfter from '../components/HeaderAfter';
import Footer from '../components/Footer';
import '../CSS_User/DaftarKasus.css';

const DaftarKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [tab, setTab] = useState("Menunggu");
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetch(`http://localhost:5000/api/kasus/riwayat/${parsed.id}`)
        .then((res) => res.json())
        .then((data) => {
          setKasusList(data);
          const filtered = data.filter((k) => k.status === tab);
          if (filtered.length === 0) {
            setShowModal(true);
          } else {
            setShowModal(false);
          }
        })
        .catch((err) => console.error('Gagal memuat data kasus:', err));
    }
  }, [tab]);

  const filteredKasus = kasusList.filter((k) => k.status === tab);

  return (
    <div>
      <HeaderAfter />
      <br /><br /><br /><br />

      <main className="daftar-kasus-wrapper">
        <div className="title-container">
          <h2 className="title">Riwayat Kasus</h2>
          <button className="btn-ajukan-header" onClick={() => navigate('/AjukanKasus')}>
            + Ajukan Kasus
          </button>
        </div>
        <div className="garis-bawah-title"></div>

        <div className="tab-container">
          {["Menunggu", "Diproses", "Selesai"].map((status) => (
            <div
              key={status}
              className={`tab ${tab === status ? "active" : ""}`}
              onClick={() => setTab(status)}
            >
              {status}
            </div>
          ))}
        </div>

        <div className="konten-kasus-layout">
          <div className="tabel-kasus-wrapper">
            {filteredKasus.length === 0 ? (
              <div className="empty-state">
                <img src="/assets/empty-box.png" alt="Empty" className="empty-icon" />
                <p className="empty-title">Tidak ada Project</p>
                <p className="empty-desc">Daftar project akan ditampilkan jika telah menambah project</p>
                <button className="ajukan-btn-static" onClick={() => navigate('/AjukanKasus')}>
                  Ajukan Kasus
                </button>
              </div>
            ) : (
              <table className="tabel-kasus">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Area Praktik</th>
                    <th>Pengerjaan</th>
                    <th>Status</th>
                    <th>Estimasi</th>
                    <th>Biaya</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKasus.map((kasus, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{kasus.area_praktik}</td>
                      <td>{kasus.jenis_pengerjaan}</td>
                      <td>{kasus.status}</td>
                      <td>{kasus.estimasi_selesai}</td>
                      <td>
                        Rp{Number(kasus.biaya_min).toLocaleString()} - Rp{Number(kasus.biaya_max).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showModal && (
            <div className="informasi-kasus-samping">
              <h3>Ajukan Kasus Anda dengan Mudah</h3>
              <ul>
                <li><strong>1. Kirim Detail Kasus Anda:</strong> Sampaikan masalah hukum secara jelas.</li>
                <li><strong>2. Terima Penawaran:</strong> Advokat akan merespons dan menawarkan strategi hukum.</li>
                <li><strong>3. Pilih Advokat:</strong> Bandingkan dan pilih yang terbaik untuk Anda.</li>
                <li><strong>4. Mulai Kolaborasi:</strong> Jalin kerja sama dengan pengacara pilihan Anda.</li>
              </ul>
            </div>
          )}
        </div>
      </main>

      <div className="footer-separator" />
      <Footer />
    </div>
  );
};

export default DaftarKasus;
