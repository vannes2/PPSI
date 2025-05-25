import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/RiwayatKasus.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const RiwayatKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [konsultasiList, setKonsultasiList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:5000/api/kasus/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Kasus list:", data);
          setKasusList(data);
        })
        .catch((err) => console.error("Gagal mengambil data kasus:", err));

      fetch(`http://localhost:5000/api/konsultasi_session/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Konsultasi list:", data);
          setKonsultasiList(data);
        })
        .catch((err) => console.error("Gagal mengambil data konsultasi:", err));
    }
  }, [user]);

  const getFotoPengacaraUrl = (foto) =>
    foto && foto !== "default-profile.png"
      ? `http://localhost:5000/uploads/${foto}`
      : null;

  const isFotoDefault = (foto) => {
    return !foto || foto === "default-profile.png";
  };

  const renderStatusKasus = (kasus) => {
    if (isFotoDefault(kasus.foto_pengacara) || !kasus.nama_pengacara) {
      return (
        <span className="status-belum-diambil-pengacara">
          Belum diambil Advokat
        </span>
      );
    }
    return (
      <span className={`status-${kasus.status?.toLowerCase?.() || "default"}`}>
        {kasus.status || "Tidak Diketahui"}
      </span>
    );
  };

  return (
    <div className="riwayat-container">
      <HeaderAfter />

      <div className="riwayat-dua-kolom">
        {/* Riwayat Konsultasi */}
        <section className="riwayat-section">
          <h2 className="riwayat-title center-text">Riwayat Konsultasi</h2>
          <div className="card-list">
            {konsultasiList.length === 0 ? (
              <p>Belum ada riwayat konsultasi.</p>
            ) : (
              konsultasiList.map((session) => (
                <div key={session.id} className="riwayat-card">
                  <div className="riwayat-card-image">
                    {getFotoPengacaraUrl(session.foto_pengacara) ? (
                      <img
                        src={getFotoPengacaraUrl(session.foto_pengacara)}
                        alt="Foto Pengacara"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>
                  <div className="riwayat-card-content">
                    <p>
                      <strong>Nama Pengacara:</strong>{" "}
                      {session.nama_pengacara || "Belum diambil Advokat"}
                    </p>
                    <p>
                      <strong>Harga Konsultasi:</strong> Rp{" "}
                      {session.harga_konsultasi?.toLocaleString("id-ID")}
                    </p>
                    <p>
                      <strong>Waktu Mulai:</strong>{" "}
                      {new Date(session.start_time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Durasi (menit):</strong> {session.duration}
                    </p>
                    <p>
                      <strong>Status:</strong> {renderStatusKasus(session)}
                    </p>
                    <div className="btn-group">
                      {session.id_pengacara ? (
                        <Link to={`/pengacara/detail/${session.id_pengacara}`}>
                          <button className="btn detail-btn">Detail</button>
                        </Link>
                      ) : (
                        <button className="btn detail-btn" disabled>
                          Detail
                        </button>
                      )}
                      <Link to={`/chat/pengacara/${session.id_pengacara}`}>
                        <button className="btn history-btn">Riwayat</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Garis vertikal */}
        <div className="vertical-separator"></div>

        {/* Riwayat Kasus */}
        <section className="riwayat-section">
          <h2 className="riwayat-title center-text">Riwayat Kasus</h2>
          <div className="card-list">
            {kasusList.length === 0 ? (
              <p>Belum ada kasus.</p>
            ) : (
              kasusList.map((kasus) => (
                <div key={kasus.id} className="riwayat-card">
                  <div className="riwayat-card-image">
                    {getFotoPengacaraUrl(kasus.foto_pengacara) ? (
                      <img
                        src={getFotoPengacaraUrl(kasus.foto_pengacara)}
                        alt="Foto Pengacara"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>
                  <div className="riwayat-card-content">
                    <p>
                      <strong>Nama Pengacara:</strong>{" "}
                      {kasus.nama_pengacara || "Belum diambil Advokat"}
                    </p>
                    <p>
                      <strong>Harga Konsultasi:</strong> Rp{" "}
                      {kasus.harga_konsultasi?.toLocaleString("id-ID")}
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
                      <strong>Status:</strong> {renderStatusKasus(kasus)}
                    </p>
                    <div className="btn-group">
                      {kasus.id_pengacara ? (
                        <Link to={`/pengacara/detail/${kasus.id_pengacara}`}>
                          <button className="btn detail-btn">Detail</button>
                        </Link>
                      ) : (
                        <button className="btn detail-btn" disabled>
                          Detail
                        </button>
                      )}
                      <Link to={`/DaftarKasus`}>
                        <button className="btn history-btn">Riwayat</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
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
