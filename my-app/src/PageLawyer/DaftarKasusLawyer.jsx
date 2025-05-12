import React, { useEffect, useState } from 'react';
import HeaderLawyer from '../components/HeaderLawyer';
import Footer from '../components/Footer';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../CSS_Lawyer/DaftarKasusLawyer.css';

const DaftarKasusLawyer = () => {
  const [kasusList, setKasusList] = useState([]);
  const [tab, setTab] = useState('Belum Diambil');
  const [toast, setToast] = useState(null);
  const [logAktivitas, setLogAktivitas] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showBuktiModal, setShowBuktiModal] = useState(false);
  const [buktiPreview, setBuktiPreview] = useState(null);

  const lawyer = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!lawyer || lawyer.role !== 'pengacara') {
      setToast({ message: "Data pengacara tidak ditemukan. Harap login ulang.", isError: true });
      return;
    }
    fetchSemuaKasus();
  }, []);

  const fetchSemuaKasus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kasus');
      setKasusList(response.data);
    } catch (error) {
      console.error('Gagal mengambil semua data kasus:', error);
    }
  };

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAmbilKasus = async (kasusId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/kasus/ambil/${kasusId}`, { lawyer_id: lawyer.id });
      showToast(response.data.message);
      fetchSemuaKasus();
    } catch (error) {
      console.error('Gagal mengambil kasus:', error);
      showToast(error.response?.data?.message || 'Terjadi kesalahan.', true);
    }
  };

  const handleUpdateStatus = async (id, newStatus, userId) => {
    try {
      await axios.put(`http://localhost:5000/api/kasus/update-status/${id}`, { status: newStatus });
      await axios.post('http://localhost:5000/api/kasus/log-aktivitas', {
        id_pengguna: userId,
        aktivitas: `Status kasus ID ${id} diubah menjadi '${newStatus}'`
      });
      showToast('Status berhasil diperbarui');
      fetchSemuaKasus();
    } catch (error) {
      console.error('Gagal memperbarui status:', error);
      showToast('Gagal memperbarui status kasus.', true);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Daftar Kasus (${tab})`, 14, 16);
    const data = filteredKasus.map((k, i) => [
      i + 1,
      k.nama,
      k.alamat || '-',
      k.area_praktik,
      k.jenis_pengerjaan,
      `Rp${Number(k.biaya_min).toLocaleString()} - Rp${Number(k.biaya_max).toLocaleString()}`,
      new Date(k.estimasi_selesai).toLocaleDateString('id-ID'),
      k.status
    ]);

    doc.autoTable({
      head: [['No', 'Nama', 'Alamat', 'Area', 'Jenis', 'Biaya', 'Estimasi', 'Status']],
      body: data,
      startY: 20
    });

    doc.save(`Daftar_Kasus_${tab}.pdf`);
  };

  const fetchLogAktivitas = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/kasus/log-aktivitas/${userId}`);
      setLogAktivitas(response.data);
      setShowLogModal(true);
    } catch (error) {
      console.error('Gagal mengambil log aktivitas:', error);
    }
  };

  const handlePreviewBukti = (filename) => {
    setBuktiPreview(filename);
    setShowBuktiModal(true);
  };

  const handleNot = (deskripsi) => {
    alert(`Catatan: ${deskripsi}`);
  };

  const filteredKasus = kasusList.filter((k) => {
    if (tab === 'Belum Diambil') return k.lawyer_id === null;
    return k.lawyer_id === lawyer.id && k.status === tab;
  });

  return (
    <div className="DaftarKasusLawyer">
      <HeaderLawyer />
      <div className="container-kasus">
        <h2>Semua Kasus Pengguna</h2>

        <div className="tab-kasus">
          {['Belum Diambil', 'Menunggu', 'Diproses', 'Selesai'].map((status) => (
            <button
              key={status}
              className={`tab-btn ${tab === status ? 'active' : ''}`}
              onClick={() => setTab(status)}
            >
              {status}
            </button>
          ))}
          <button className="btn-update" onClick={handleExportPDF}>Export PDF</button>
        </div>

        <div className="table-wrapper">
          <table className="kasus-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Area Praktik</th>
                <th>Jenis</th>
                <th>Biaya</th>
                <th>Estimasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKasus.map((kasus) => (
                <tr key={kasus.id}>
                  <td>{kasus.nama}</td>
                  <td>{kasus.alamat || '-'}</td>
                  <td>{kasus.area_praktik}</td>
                  <td>{kasus.jenis_pengerjaan}</td>
                  <td>
                    Rp{Number(kasus.biaya_min).toLocaleString()} - Rp{Number(kasus.biaya_max).toLocaleString()}
                  </td>
                  <td>{new Date(kasus.estimasi_selesai).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn-riwayat" onClick={() => handleNot(kasus.deskripsi)}>Not</button>
                      {tab !== 'Belum Diambil' ? (
                        <>
                          <span
                            className={`badge-status ${kasus.status === 'Menunggu' ? 'waiting' : kasus.status === 'Diproses' ? 'processing' : 'done'}`}
                            onClick={() => fetchLogAktivitas(kasus.user_id)}
                          >
                            <span className="dot-status"></span> Riwayat
                          </span>
                          {kasus.bukti && (
                            <button className="btn-riwayat" onClick={() => handlePreviewBukti(kasus.bukti)}>Bukti</button>
                          )}
                          {kasus.status !== 'Selesai' && (
                            <button
                              className="btn-update"
                              onClick={() => handleUpdateStatus(
                                kasus.id,
                                kasus.status === 'Menunggu' ? 'Diproses' : 'Selesai',
                                kasus.user_id
                              )}
                            >
                              {kasus.status === 'Menunggu' ? 'Diproses' : 'Selesai'}
                            </button>
                          )}
                        </>
                      ) : (
                        <button className="btn-update" onClick={() => handleAmbilKasus(kasus.id)}>Ambil Kasus</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {toast && (
          <div className={`toast ${toast.isError ? 'error' : 'success'}`}>{toast.message}</div>
        )}

        {showLogModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Riwayat Aktivitas</h3>
              <ul className="log-list">
                {logAktivitas.map((log, idx) => (
                  <li key={idx}>
                    {log.aktivitas}<br />
                    <small>{new Date(log.waktu).toLocaleString('id-ID')}</small>
                  </li>
                ))}
              </ul>
              <button className="btn-close-modal" onClick={() => setShowLogModal(false)}>Tutup</button>
            </div>
          </div>
        )}

        {showBuktiModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ width: '90%', maxWidth: '700px' }}>
              <h3 style={{ textAlign: 'center' }}>Bukti Upload</h3>
              {buktiPreview.endsWith('.pdf') ? (
                <iframe
                  src={`http://localhost:5000/uploads/${buktiPreview}`}
                  title="PDF Preview"
                  width="100%"
                  height="500px"
                ></iframe>
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${buktiPreview}`}
                  alt="Bukti"
                  style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', margin: 'auto' }}
                />
              )}
              <button className="btn-close-modal" onClick={() => setShowBuktiModal(false)}>Tutup</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DaftarKasusLawyer;
