import { useEffect, useState } from "react";
import "../CSS_User/RiwayatKasus.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const RiwayatKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [konsultasiList, setKonsultasiList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      // Fetch riwayat kasus dengan foto pengacara
      fetch(`http://localhost:5000/api/kasus/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => setKasusList(data))
        .catch((err) => console.error("Gagal mengambil data kasus:", err));

      // Fetch riwayat konsultasi session dengan foto pengacara
      fetch(`http://localhost:5000/api/konsultasi_session/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => setKonsultasiList(data))
        .catch((err) => console.error("Gagal mengambil data konsultasi:", err));
    }
  }, [user]);

  // Fungsi untuk membangun URL foto pengacara atau fallback default
  const getFotoPengacaraUrl = (foto) =>
    foto
      ? `http://localhost:5000/uploads/${foto}`
      : "http://localhost:5000/assets/default-lawyer.png";

  return (
    <div className="riwayat-container">
      <HeaderAfter />

      {/* Riwayat Konsultasi */}
      <h2 className="riwayat-title">Riwayat Konsultasi</h2>
      <div className="card-list">
        {konsultasiList.length === 0 ? (
          <p>Belum ada riwayat konsultasi.</p>
        ) : (
          konsultasiList.map((session) => (
            <div key={session.id} className="riwayat-card">
              <div className="riwayat-card-image">
                <img
                  src={getFotoPengacaraUrl(session.foto_pengacara)}
                  alt="Foto Pengacara"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:5000/assets/default-lawyer.png";
                  }}
                />
              </div>
              <div className="riwayat-card-content">
                <p>
                  <strong>Nama Pengacara:</strong> {session.nama_pengacara || "-"}
                </p>
                <p>
                  <strong>Waktu Mulai:</strong> {new Date(session.start_time).toLocaleString()}
                </p>
                <p>
                  <strong>Durasi (menit):</strong> {session.duration}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${session.status.toLowerCase()}`}>
                    {session.status}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <br />
      <br />
      <br />

      {/* Riwayat Kasus */}
      <h2 className="riwayat-title">Riwayat Kasus</h2>
      <div className="card-list">
        {kasusList.length === 0 ? (
          <p>Belum ada kasus.</p>
        ) : (
          kasusList.map((kasus, index) => (
            <div key={index} className="riwayat-card">
              <div className="riwayat-card-image">
                <img
                  src={getFotoPengacaraUrl(kasus.foto_pengacara)}
                  alt="Foto Pengacara"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "http://localhost:5000/assets/default-lawyer.png";
                  }}
                />
              </div>
              <div className="riwayat-card-content">
                <p>
                  <strong>Nama Pengacara:</strong> {kasus.nama_pengacara || "-"}
                </p>
                <p>
                  <strong>Jenis Pengerjaan:</strong> {kasus.jenis_pengerjaan}
                </p>
                <p>
                  <strong>Area Praktik:</strong> {kasus.area_praktik}
                </p>
                <p>
                  <strong>Estimasi Selesai:</strong>{" "}
                  {new Date(kasus.estimasi_selesai).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${kasus.status.toLowerCase()}`}>
                    {kasus.status}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <br />
      <br />
      <br />
      <br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default RiwayatKasus;
