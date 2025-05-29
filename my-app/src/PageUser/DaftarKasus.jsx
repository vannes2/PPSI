import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAfter from '../components/HeaderAfter'; // Pastikan path ini benar
import Footer from '../components/Footer';         // Pastikan path ini benar
import '../CSS_User/DaftarKasus.css'; // Pastikan path ini benar

const DaftarKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [tab, setTab] = useState("Menunggu");
  const [showModal, setShowModal] = useState(false); // Untuk informasi sampingan
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // Fetch data based on user ID
      fetch(`http://localhost:5000/api/kasus/riwayat/${parsed.id}`)
        .then((res) => {
          if (!res.ok) {
            // Handle HTTP errors
            if (res.status === 404) {
              console.log('No cases found for this user.');
              return []; // Return empty array if no cases
            }
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setKasusList(data);
          // Determine if modal should be shown
          const filtered = data.filter((k) => k.status === tab);
          if (filtered.length === 0) {
            setShowModal(true);
          } else {
            setShowModal(false);
          }
        })
        .catch((err) => {
          console.error('Gagal memuat data kasus:', err);
          setKasusList([]); // Set to empty on error
          setShowModal(true); // Show modal on error/empty
        });
    } else {
      // If no user in localStorage, maybe redirect to login or show a message
      console.log('User not logged in. Redirecting or showing login prompt.');
      // navigate('/login'); // Example: redirect to login
      setShowModal(true); // Show info if no user
    }
  }, [tab]); // Re-fetch when tab changes

  // Filter cases based on the active tab
  const filteredKasus = kasusList.filter((k) => k.status === tab);

  return (
    <div className="daftar-kasus-page">
      <HeaderAfter />
      {/* Spacer for header fixed position */}
      {/* Ini berfungsi sebagai padding atas agar konten tidak tertutup oleh header */}
      <div style={{ paddingTop: '100px' }}></div> 

      <main className="daftar-kasus-wrapper">
        <h1 className="title">Daftar Kasus</h1>

        <div className="tombol-ajukan-center">
          <button className="btn-ajukan-header" onClick={() => navigate('/AjukanKasus')}>
            + Ajukan Kasus
          </button>
        </div>

        <div className="garis-bawah-title"></div>
        <div className="title-container">
          <h2 className="title">Riwayat Kasus</h2>
        </div>

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
          {/* Kondisional rendering untuk empty state */}
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
            <>
              {/* --- Opsi 1: Tampilan Tabel Tradisional (Dengan Scroll Horizontal) --- */}
              {/* Class 'desktop-table-scrollable' akan digunakan oleh CSS untuk menyembunyikan/menampilkan */}
              <div className="tabel-kasus-wrapper desktop-table-scrollable">
                <table className="tabel-kasus">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Area Praktik</th>
                      <th>Pengerjaan</th>
                      <th>Status</th>
                      <th>Estimasi</th>
                      <th>Biaya</th>
                      <th>Nama Pengacara</th>
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
                        <td>{kasus.nama_pengacara || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- Opsi 2: Tampilan Card/Daftar untuk Mobile (Lebih User-Friendly) --- */}
              {/* Class 'mobile-list-cards' akan digunakan oleh CSS untuk menyembunyikan/menampilkan */}
              <div className="card-list-wrapper mobile-list-cards">
                {filteredKasus.map((kasus, index) => (
                  <div key={index} className="kasus-card">
                    <div className="card-item">
                      <span className="card-label">No:</span>
                      <span className="card-value">{index + 1}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Area Praktik:</span>
                      <span className="card-value">{kasus.area_praktik}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Pengerjaan:</span>
                      <span className="card-value">{kasus.jenis_pengerjaan}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Status:</span>
                      <span className="card-value status">{kasus.status}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Estimasi:</span>
                      <span className="card-value">{kasus.estimasi_selesai}</span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Biaya:</span>
                      <span className="card-value">
                        Rp{Number(kasus.biaya_min).toLocaleString()} - Rp{Number(kasus.biaya_max).toLocaleString()}
                      </span>
                    </div>
                    <div className="card-item">
                      <span className="card-label">Nama Pengacara:</span>
                      <span className="card-value">{kasus.nama_pengacara || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {showModal && ( // Hanya tampilkan modal informasi sampingan jika showModal true
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

      {/* Separator untuk footer, berguna jika konten pendek */}
      <div className="footer-separator" />
      <Footer />
    </div>
  );
};

export default DaftarKasus;