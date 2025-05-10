import React, { useEffect, useState } from 'react';
import HeaderLawyer from '../components/HeaderLawyer';
import Footer from '../components/Footer';
import axios from 'axios';
import '../CSS_Lawyer/DaftarKasusLawyer.css';

const DaftarKasusLawyer = () => {
  const [kasusList, setKasusList] = useState([]);
  const [tab, setTab] = useState('Menunggu');
  const [toast, setToast] = useState(null);

  useEffect(() => {
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/kasus/update-status/${id}`, { status: newStatus });
      showToast(res.data.message);
      fetchSemuaKasus();
    } catch (error) {
      console.error('Gagal memperbarui status:', error);
      showToast('Gagal memperbarui status kasus.', true);
    }
  };

  const filteredKasus = kasusList.filter((k) => k.status === tab);

  return (
    <div className="DaftarKasusLawyer">
      <HeaderLawyer />
      <div className="container-kasus">
        <h2>Semua Kasus Pengguna</h2>

        <div className="tab-kasus">
          {['Menunggu', 'Diproses', 'Selesai'].map((status) => (
            <button
              key={status}
              className={`tab-btn ${tab === status ? 'active' : ''}`}
              onClick={() => setTab(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <table className="kasus-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>No HP</th>
              <th>Area Praktik</th>
              <th>Jenis</th>
              <th>Biaya</th>
              <th>Estimasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKasus.map((kasus) => (
              <tr key={kasus.id}>
                <td>{kasus.nama}</td>
                <td>{kasus.email}</td>
                <td>{kasus.no_hp}</td>
                <td>{kasus.area_praktik}</td>
                <td>{kasus.jenis_pengerjaan}</td>
                <td>Rp{Number(kasus.biaya_min).toLocaleString()} - Rp{Number(kasus.biaya_max).toLocaleString()}</td>
                <td>{new Date(kasus.estimasi_selesai).toLocaleDateString('id-ID')}</td>
                <td>{kasus.status}</td>
                <td>
                  <button className="btn-detail" onClick={() => alert(kasus.deskripsi)}>Lihat</button>
                  {kasus.status !== 'Selesai' && (
                    <button
                      className="btn-update"
                      onClick={() =>
                        handleUpdateStatus(
                          kasus.id,
                          kasus.status === 'Menunggu' ? 'Diproses' : 'Selesai'
                        )
                      }
                    >
                      {kasus.status === 'Menunggu' ? 'Tandai Diproses' : 'Tandai Selesai'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {toast && (
          <div className={`toast ${toast.isError ? 'error' : 'success'}`}>
            {toast.message}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DaftarKasusLawyer;
