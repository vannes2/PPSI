import React, { useEffect, useState } from 'react';
import HeaderLawyer from '../components/HeaderLawyer';
import Footer from '../components/Footer';
import axios from 'axios';
import '../CSS_Lawyer/DaftarKasusLawyer.css';

const DaftarKasusLawyer = () => {
  const [kasusList, setKasusList] = useState([]);

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

  return (
    <div className="DaftarKasusLawyer">
      <HeaderLawyer />
      <div className="container-kasus">
        <h2>Semua Kasus Pengguna</h2>
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
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {kasusList.map((kasus) => (
              <tr key={kasus.id}>
                <td>{kasus.nama}</td>
                <td>{kasus.email}</td>
                <td>{kasus.no_hp}</td>
                <td>{kasus.area_praktik}</td>
                <td>{kasus.jenis_pengerjaan}</td>
                <td>Rp{kasus.biaya_min} - Rp{kasus.biaya_max}</td>
                <td>{kasus.estimasi_selesai}</td>
                <td>{kasus.status}</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => alert(kasus.deskripsi)}
                  >
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default DaftarKasusLawyer;
