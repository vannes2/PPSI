import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAfter from '../components/HeaderAfter';
import Footer from '../components/Footer';
import '../CSS_User/DaftarKasus.css';
// --- TAMBAHAN ---: Impor komponen pop-up ulasan
import UserReviewForm from '../components/UserReviewForm'; // Pastikan path ini benar

const DaftarKasus = () => {
    const [kasusList, setKasusList] = useState([]);
    const [tab, setTab] = useState("Selesai"); // --- DISESUAIKAN ---: Default ke tab 'Selesai' agar lebih relevan
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // --- TAMBAHAN ---: State untuk mengontrol modal ulasan
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedKasus, setSelectedKasus] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            fetch(`http://localhost:5000/api/kasus/riwayat/${parsed.id}`)
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 404) return [];
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    setKasusList(data);
                })
                .catch((err) => {
                    console.error('Gagal memuat data kasus:', err);
                    setKasusList([]);
                });
        } else {
            console.log('User not logged in.');
            // navigate('/login'); // Sebaiknya diarahkan ke login jika user tidak ditemukan
        }
    }, []); // --- DISESUAIKAN ---: Hapus [tab] agar data hanya di-fetch sekali untuk efisiensi

    // --- TAMBAHAN ---: Fungsi-fungsi untuk menangani modal ulasan
    const handleOpenReviewModal = (kasus) => {
        setSelectedKasus(kasus);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedKasus(null);
    };

    const handleReviewSuccess = (kasusId) => {
        alert(`Terima kasih! Ulasan Anda untuk kasus ID ${kasusId} telah berhasil dikirim.`);
        // Tidak ada lagi logika untuk menyembunyikan tombol, sesuai permintaan
    };

    const filteredKasus = kasusList.filter((k) => k.status === tab);

    return (
        <div className="daftar-kasus-page">
            <HeaderAfter />
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
                        <div key={status} className={`tab ${tab === status ? "active" : ""}`} onClick={() => setTab(status)}>
                            {status}
                        </div>
                    ))}
                </div>

                <div className="konten-kasus-layout">
                    {filteredKasus.length === 0 ? (
                        <div className="empty-state">
                            <img src="/assets/empty-box.png" alt="Empty" className="empty-icon" />
                            <p className="empty-title">Tidak ada Kasus</p>
                            <p className="empty-desc">Daftar kasus dengan status '{tab}' akan muncul di sini.</p>
                        </div>
                    ) : (
                        <>
                            {/* --- Tampilan Tabel Desktop --- */}
                            <div className="tabel-kasus-wrapper desktop-table-scrollable">
                                <table className="tabel-kasus">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Area Praktik</th>
                                            <th>Pengerjaan</th>
                                            <th>Status</th>
                                            <th>Estimasi Selesai</th>
                                            <th>Biaya</th>
                                            <th>Nama Pengacara</th>
                                            {/* --- TAMBAHAN ---: Kolom untuk tombol aksi */}
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredKasus.map((kasus, index) => (
                                            <tr key={kasus.id}>
                                                <td>{index + 1}</td>
                                                <td>{kasus.area_praktik}</td>
                                                <td>{kasus.jenis_pengerjaan}</td>
                                                <td><span className={`status-badge status-${kasus.status.toLowerCase()}`}>{kasus.status}</span></td>
                                                <td>{new Date(kasus.estimasi_selesai).toLocaleDateString('id-ID')}</td>
                                                <td>Rp{Number(kasus.biaya_min).toLocaleString()} - Rp{Number(kasus.biaya_max).toLocaleString()}</td>
                                                <td>{kasus.nama_pengacara || '-'}</td>
                                                {/* --- TAMBAHAN ---: Logika untuk tombol "Beri Ulasan" */}
                                                <td>
                                                    {kasus.status === 'Selesai' && kasus.lawyer_id && (
                                                        <button className="btn-ulasan" onClick={() => handleOpenReviewModal(kasus)}>
                                                            Beri Ulasan
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Tampilan Card Mobile --- */}
                            <div className="card-list-wrapper mobile-list-cards">
                                {filteredKasus.map((kasus) => (
                                    <div key={kasus.id} className="kasus-card">
                                        <div className="card-item"><span className="card-label">Area Praktik:</span><span className="card-value">{kasus.area_praktik}</span></div>
                                        <div className="card-item"><span className="card-label">Pengerjaan:</span><span className="card-value">{kasus.jenis_pengerjaan}</span></div>
                                        <div className="card-item"><span className="card-label">Status:</span><span className="card-value"><span className={`status-badge status-${kasus.status.toLowerCase()}`}>{kasus.status}</span></span></div>
                                        <div className="card-item"><span className="card-label">Pengacara:</span><span className="card-value">{kasus.nama_pengacara || '-'}</span></div>
                                        {/* --- TAMBAHAN ---: Tombol "Beri Ulasan" untuk tampilan mobile */}
                                        <div className="card-action">
                                            {kasus.status === 'Selesai' && kasus.lawyer_id && (
                                                <button className="btn-ulasan" onClick={() => handleOpenReviewModal(kasus)}>
                                                    Beri Ulasan
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            <div className="footer-separator" />
            <Footer />

            {/* --- TAMBAHAN ---: Render Pop-up Ulasan jika isReviewModalOpen true */}
            {isReviewModalOpen && selectedKasus && (
                <UserReviewForm
                    userId={user.id}
                    lawyer={{ id: selectedKasus.lawyer_id, nama: selectedKasus.nama_pengacara }}
                    interaction={{ id: selectedKasus.id }}
                    interactionType="kasus"
                    onClose={handleCloseReviewModal}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default DaftarKasus;