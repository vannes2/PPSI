import { useEffect, useState } from "react";
import "../CSS_User/RiwayatKasus.css";

const RiwayatKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5000/api/kasus/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => setKasusList(data))
        .catch((err) => console.error("Gagal mengambil data kasus:", err));
    }
  }, []);

  return (
    <div className="riwayat-container">
      <h2 className="riwayat-title">Riwayat Kasus</h2>

      <div className="card-list">
        {kasusList.length === 0 ? (
          <p>Belum ada kasus.</p>
        ) : (
          kasusList.map((kasus, index) => (
            <div key={index} className="riwayat-card">
              <div className="riwayat-card-image">
                <img
                  src={
                    kasus.foto_pengacara
                      ? `/uploads/${kasus.foto_pengacara}`
                      : "/assets/default-lawyer.png"
                  }
                  alt="Foto Pengacara"
                />
              </div>
              <div className="riwayat-card-content">
                <p><strong>Nama Pengacara:</strong> {kasus.nama_pengacara || "-"}</p>
                <p><strong>Jenis Pengerjaan:</strong> {kasus.jenis_pengerjaan}</p>
                <p><strong>Area Praktik:</strong> {kasus.area_praktik}</p>
                <p><strong>Estimasi Selesai:</strong> {new Date(kasus.estimasi_selesai).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className={`status-${kasus.status.toLowerCase()}`}>{kasus.status}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiwayatKasus;
