import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS_Lawyer/RiwayatKasusPengacara.css";
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";

const RiwayatKasusPengacara = () => {
  const [kasusList, setKasusList] = useState([]);
  const [konsultasiList, setKonsultasiList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const pengacaraId = user?.id;

  useEffect(() => {
    if (pengacaraId) {
      // Fetch riwayat kasus pengacara
      fetch(`http://localhost:5000/api/kasus/riwayat/pengacara/${pengacaraId}`)
        .then((res) => res.json())
        .then((data) => {
          setKasusList(data);
        })
        .catch((err) => console.error("Gagal mengambil riwayat kasus pengacara:", err));

      // Fetch riwayat konsultasi pengacara
      fetch(`http://localhost:5000/api/konsultasi_session/riwayat/pengacara/${pengacaraId}`)
        .then((res) => res.json())
        .then((data) => {
          setKonsultasiList(data);
        })
        .catch((err) => console.error("Gagal mengambil riwayat konsultasi pengacara:", err));
    }
  }, [pengacaraId]);

  const getFotoUserUrl = (foto) =>
    foto && foto !== "default-profile.png"
      ? `http://localhost:5000/uploads/${foto}`
      : null;

  const renderStatus = (item) => {
    if (!item.nama_user) return <span className="status-belum-diambil-user">Belum diambil User</span>;
    return (
      <span className={`status-${(item.status || "").toLowerCase() || "default"}`}>
        {item.status || "Tidak Diketahui"}
      </span>
    );
  };

  return (
    <div className="riwayat-pengacara-container">
      <HeaderLawyer />

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
                    {getFotoUserUrl(session.foto_user) ? (
                      <img src={getFotoUserUrl(session.foto_user)} alt="Foto User" />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>
                  <div className="riwayat-card-content">
                    <p><strong>Nama User:</strong> {session.nama_user || "Belum ada user"}</p>
                    <p><strong>Biaya:</strong> Rp {session.biaya?.toLocaleString("id-ID")}</p>
                    <p><strong>Waktu Mulai:</strong> {new Date(session.start_time).toLocaleString()}</p>
                    <p><strong>Durasi (menit):</strong> {session.duration}</p>
                    <p><strong>Status:</strong> {renderStatus(session)}</p>
                    <div className="btn-group">
                      {session.id_user ? (
                        <Link to={`/user/detail/${session.id_user}`}>
                          <button className="btn detail-btn">Detail</button>
                        </Link>
                      ) : (
                        <button className="btn detail-btn" disabled>Detail</button>
                      )}
                      <Link to={`/chat/user/${session.id_user}`}>
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
                    {getFotoUserUrl(kasus.foto_user) ? (
                      <img src={getFotoUserUrl(kasus.foto_user)} alt="Foto User" />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>
                  <div className="riwayat-card-content">
                    <p><strong>Nama User:</strong> {kasus.nama_user || "Belum ada user"}</p>
                    <p><strong>Biaya Minimal:</strong> Rp {kasus.biaya_min?.toLocaleString("id-ID")}</p>
                    <p><strong>Biaya Maksimal:</strong> Rp {kasus.biaya_max?.toLocaleString("id-ID")}</p>
                    <p><strong>Jenis Pengerjaan:</strong> {kasus.jenis_pengerjaan}</p>
                    <p><strong>Area Praktik:</strong> {kasus.area_praktik}</p>
                    <p><strong>Estimasi Selesai:</strong> {new Date(kasus.estimasi_selesai).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {renderStatus(kasus)}</p>
                    <div className="btn-group">
                      {kasus.id_user ? (
                        <Link to={`/user/detail/${kasus.id_user}`}>
                          <button className="btn detail-btn">Detail</button>
                        </Link>
                      ) : (
                        <button className="btn detail-btn" disabled>Detail</button>
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

      <br /><br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default RiwayatKasusPengacara;
