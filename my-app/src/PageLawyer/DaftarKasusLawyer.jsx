import { useEffect, useState } from "react";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SnackbarNotification from "../components/SnackbarNotification";
import "../CSS_Lawyer/DaftarKasusLawyer.css"; // Kita akan gunakan CSS baru

const DaftarKasusLawyer = () => {
    // --- State Management ---
    const [kasusList, setKasusList] = useState([]);
    const [tab, setTab] = useState("Belum Diambil");
    const [toast, setToast] = useState(null);
    const [logAktivitas, setLogAktivitas] = useState([]);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showBuktiModal, setShowBuktiModal] = useState(false);
    const [buktiPreview, setBuktiPreview] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(true);
    // State baru untuk UI interaktif
    const [selectedKasus, setSelectedKasus] = useState(null); 

    const lawyer = JSON.parse(localStorage.getItem("user"));

    // --- Data Fetching & Side Effects ---
    useEffect(() => {
        if (!lawyer || lawyer.role !== "pengacara") {
            showToast("Data pengacara tidak valid. Harap login ulang.", true);
            setLoading(false);
            return;
        }
        fetchSemuaKasus();
        checkBankAccount();
    }, []);

    const fetchSemuaKasus = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/kasus");
            const allKasus = response.data;
            setKasusList(allKasus);
            
            // Otomatis pilih kasus pertama di tab default saat data pertama kali dimuat
            const defaultFiltered = allKasus.filter(k => k.lawyer_id === null);
            if (defaultFiltered.length > 0) {
                setSelectedKasus(defaultFiltered[0]);
            } else if (allKasus.length > 0) {
                // Jika tab default kosong, pilih kasus pertama dari daftar keseluruhan
                const myCases = allKasus.filter(k => k.lawyer_id === lawyer.id);
                if (myCases.length > 0) {
                    setSelectedKasus(myCases[0]);
                    setTab("Kasus Saya");
                }
            }
        } catch (error) {
            console.error("Gagal mengambil semua data kasus:", error);
            showToast("Gagal memuat data kasus dari server.", true);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Fungsi Handler (Semua fitur lama Anda tetap ada) ---
    const checkBankAccount = async () => { try { if (!lawyer?.id) return; const res = await axios.get(`http://localhost:5000/api/pengacara/check-bank/${lawyer.id}`); const { bank_name, account_name, account_number } = res.data; if (!bank_name || !account_name || !account_number) setShowNotification(true); else setShowNotification(false); } catch (error) { console.error("Gagal cek data rekening bank:", error); setShowNotification(true); } };
    const showToast = (message, isError = false) => { setToast({ message, isError }); setTimeout(() => setToast(null), 3000); };
    const handleAmbilKasus = async (kasusId) => { try { const response = await axios.put(`http://localhost:5000/api/kasus/ambil/${kasusId}`, { lawyer_id: lawyer.id }); showToast(response.data.message); await fetchSemuaKasus(); setTab('Menunggu'); } catch (error) { showToast(error.response?.data?.message || "Terjadi kesalahan.", true); } };
    const handleUpdateStatus = async (id, newStatus, userId) => { try { await axios.put(`http://localhost:5000/api/kasus/update-status/${id}`, { status: newStatus }); await axios.post("http://localhost:5000/api/kasus/log-aktivitas", { id_pengguna: userId, aktivitas: `Status kasus ID ${id} diubah menjadi '${newStatus}'` }); showToast("Status berhasil diperbarui"); await fetchSemuaKasus(); } catch (error) { showToast("Gagal memperbarui status kasus.", true); } };
    const fetchLogAktivitas = async (userId) => { try { const response = await axios.get(`http://localhost:5000/api/kasus/log-aktivitas/${userId}`); setLogAktivitas(response.data); setShowLogModal(true); } catch (error) { console.error("Gagal mengambil log:", error); } };
    const handlePreviewBukti = (filename) => { setBuktiPreview(filename); setShowBuktiModal(true); };
    const handleNot = (deskripsi) => { alert(`Catatan dari Klien:\n\n${deskripsi}`); };
    const handleExportPDF = () => { if (!selectedKasus) { showToast("Pilih satu kasus terlebih dahulu.", true); return; } const doc = new jsPDF(); doc.text(`Detail Kasus ID: ${selectedKasus.id}`, 14, 16); doc.autoTable({ head: [['Properti', 'Detail']], body: [ ['Nama Klien', selectedKasus.nama], ['Area Praktik', selectedKasus.area_praktik], ['Jenis Pengerjaan', selectedKasus.jenis_pengerjaan], ['Status', selectedKasus.status], ['Estimasi Biaya', `Rp${Number(selectedKasus.biaya_min).toLocaleString()} - Rp${Number(selectedKasus.biaya_max).toLocaleString()}`], ['Estimasi Selesai', new Date(selectedKasus.estimasi_selesai).toLocaleDateString("id-ID")] ], startY: 20 }); doc.save(`Detail_Kasus_${selectedKasus.id}.pdf`); };

    const filteredKasus = kasusList.filter((k) => {
        if (tab === "Belum Diambil") return k.lawyer_id === null;
        if (tab === "Kasus Saya") return k.lawyer_id === lawyer.id;
        return k.lawyer_id === lawyer.id && k.status === tab;
    });

    return (
        <div className="DaftarKasusLawyer">
            <HeaderLawyer />
            <main className="container-kasus-baru">
                <div className="kasus-layout">
                    {/* KOLOM KIRI: DAFTAR KASUS */}
                    <div className="kasus-list-panel">
                        <div className="kasus-list-header">
                            <h3>Daftar Kasus</h3>
                            <div className="tab-kasus">
                                {["Belum Diambil", "Kasus Saya", "Diproses", "Selesai"].map((status) => (
                                    <button key={status} className={`tab-btn ${tab === status ? "active" : ""}`} onClick={() => setTab(status)}>
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="kasus-list">
                            {loading ? <p className="no-kasus-info">Memuat...</p> : filteredKasus.length > 0 ? (
                                filteredKasus.map((kasus) => (
                                    <div key={kasus.id} className={`kasus-list-item ${selectedKasus?.id === kasus.id ? 'active' : ''}`} onClick={() => setSelectedKasus(kasus)}>
                                        <div className="item-header">
                                            <span className="item-client-name">{kasus.nama}</span>
                                            <span className={`item-status status-${kasus.status?.toLowerCase() || 'default'}`}>{kasus.status || 'Belum Diambil'}</span>
                                        </div>
                                        <p className="item-case-type">{kasus.area_praktik} - {kasus.jenis_pengerjaan}</p>
                                        <small className="item-date">Diajukan pada: {new Date(kasus.created_at).toLocaleDateString("id-ID")}</small>
                                    </div>
                                ))
                            ) : (
                                <p className="no-kasus-info">Tidak ada kasus pada tab "{tab}".</p>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN: DETAIL KASUS */}
                    <div className="kasus-detail-panel">
                        {selectedKasus ? (
                            <>
                                <div className="detail-header">
                                    <div>
                                        <h2>Detail Kasus #{selectedKasus.id}</h2>
                                        <p>Klien: <strong>{selectedKasus.nama}</strong></p>
                                    </div>
                                    <button className="export-btn" onClick={handleExportPDF}>Export PDF</button>
                                </div>
                                <div className="detail-grid">
                                    <div className="detail-item"><span>Area Praktik</span><strong>{selectedKasus.area_praktik}</strong></div>
                                    <div className="detail-item"><span>Jenis Pengerjaan</span><strong>{selectedKasus.jenis_pengerjaan}</strong></div>
                                    <div className="detail-item"><span>Estimasi Biaya</span><strong>Rp{Number(selectedKasus.biaya_min).toLocaleString()} - Rp{Number(selectedKasus.biaya_max).toLocaleString()}</strong></div>
                                    <div className="detail-item"><span>Estimasi Selesai</span><strong>{new Date(selectedKasus.estimasi_selesai).toLocaleDateString("id-ID")}</strong></div>
                                </div>
                                <div className="detail-description">
                                    <h4>Deskripsi & Catatan Kasus</h4>
                                    <p>{selectedKasus.deskripsi}</p>
                                </div>
                                <div className="detail-actions">
                                    {tab === "Belum Diambil" && (
                                        <button className="action-btn primary" onClick={() => handleAmbilKasus(selectedKasus.id)}>Ambil Kasus Ini</button>
                                    )}
                                    {tab !== "Belum Diambil" && selectedKasus.status !== "Selesai" && (
                                        <button className="action-btn primary" onClick={() => handleUpdateStatus(selectedKasus.id, selectedKasus.status === "Menunggu" ? "Diproses" : "Selesai", selectedKasus.user_id)}>
                                            Ubah Status ke: {selectedKasus.status === "Menunggu" ? "Diproses" : "Selesai"}
                                        </button>
                                    )}
                                    <button className="action-btn secondary" onClick={() => fetchLogAktivitas(selectedKasus.user_id)}>Riwayat</button>
                                    {selectedKasus.bukti && (
                                        <button className="action-btn secondary" onClick={() => handlePreviewBukti(selectedKasus.bukti)}>Bukti</button>
                                    )}
                                    <button className="action-btn secondary" onClick={() => handleNot(selectedKasus.deskripsi)}>Not</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-selection">
                                <p>Pilih sebuah kasus dari daftar di sebelah kiri untuk melihat detail lengkapnya.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MODAL, TOAST, & SNACKBAR (TIDAK ADA PERUBAHAN) --- */}
            {toast && <div className={`toast ${toast.isError ? "error" : "success"}`}>{toast.message}</div>}
            {showLogModal && ( <div className="modal-overlay" onClick={() => setShowLogModal(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}><h3>Riwayat Aktivitas</h3><ul className="log-list">{logAktivitas.map((log, idx) => (<li key={idx}>{log.aktivitas}<br/><small>{new Date(log.waktu).toLocaleString("id-ID")}</small></li>))}</ul><button className="btn-close-modal" onClick={() => setShowLogModal(false)}>Tutup</button></div></div> )}
            {showBuktiModal && ( <div className="modal-overlay" onClick={() => setShowBuktiModal(false)}><div className="modal-content" style={{ width: "90%", maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}><h3 style={{ textAlign: "center" }}>Pratinjau Bukti</h3>{buktiPreview.endsWith(".pdf") ? (<iframe src={`http://localhost:5000/uploads/${buktiPreview}`} title="PDF Preview" width="100%" height="500px"></iframe>) : (<img src={`http://localhost:5000/uploads/${buktiPreview}`} alt="Bukti" style={{ maxWidth: "100%", maxHeight: "500px", display: "block", margin: "auto" }}/>)}<button className="btn-close-modal" onClick={() => setShowBuktiModal(false)}>Tutup</button></div></div> )}
            <SnackbarNotification message="Harap lengkapi nomor rekening bank Anda di halaman profil untuk dapat mengambil kasus." show={showNotification} onClose={() => setShowNotification(false)} />
            
            <Footer />
        </div>
    );
};

export default DaftarKasusLawyer;