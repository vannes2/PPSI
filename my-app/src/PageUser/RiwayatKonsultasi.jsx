import React, { useEffect, useState } from "react";
import "../CSS_User/Riwayat.css";

const Riwayat = () => {
  const [riwayatKonsultasi, setRiwayatKonsultasi] = useState([]);
  const [riwayatKasus, setRiwayatKasus] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      // Ambil dari konsultasi_session
      fetch(`http://localhost:5000/api/riwayat/konsultasi/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setRiwayatKonsultasi(data || []);
        })
        .catch(err => console.error("Gagal fetch konsultasi:", err));

      // Ambil dari riwayat_konsultasi_kasus
      fetch(`http://localhost:5000/api/riwayat/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setRiwayatKasus(data.riwayatKasus || []);
        })
        .catch(err => console.error("Gagal fetch kasus:", err));
    }
  }, [user?.id]);

  return (
    <div className="riwayat-container">
      <h2>Riwayat Konsultasi</h2>
      {riwayatKonsultasi.length > 0 ? (
        riwayatKonsultasi.map((item, idx) => (
          <div className="riwayat-card" key={idx}>
            <img
              src={`http://localhost:5000/uploads/${item.upload_foto}`}
              alt={item.nama_pengacara}
              className="riwayat-foto"
            />
            <div>
              <p><strong>Nama Pengacara:</strong> {item.nama_pengacara}</p>
              <p><strong>Tanggal:</strong> {new Date(item.start_time).toLocaleString()}</p>
              <p><strong>Durasi:</strong> {item.duration} menit</p>
              <p><strong>Status:</strong> {item.status}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Belum ada riwayat konsultasi.</p>
      )}

      <h2>Riwayat Kasus</h2>
      {riwayatKasus.length > 0 ? (
        riwayatKasus.map((item, idx) => (
          <div className="riwayat-card" key={idx}>
            <img
              src={`http://localhost:5000/uploads/${item.upload_foto}`}
              alt={item.nama_pengacara}
              className="riwayat-foto"
            />
            <div>
              <p><strong>Nama Pengacara:</strong> {item.nama_pengacara}</p>
              <p><strong>Jenis Pengerjaan:</strong> {item.jenis_pengerjaan}</p>
              <p><strong>Area Praktik:</strong> {item.area_praktik}</p>
              <p><strong>Estimasi Selesai:</strong> {item.estimasi_selesai}</p>
              <p><strong>Status:</strong> {item.status}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Belum ada riwayat kasus.</p>
      )}
    </div>
  );
};

export default Riwayat;
