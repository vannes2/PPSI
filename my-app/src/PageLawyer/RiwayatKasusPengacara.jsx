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
      fetch(`http://localhost:5000/api/kasus/riwayat/pengacara/${pengacaraId}`)
        .then((res) => res.json())
        .then((data) => setKasusList(data))
        .catch((err) => console.error("Gagal mengambil riwayat kasus pengacara:", err));

      fetch(`http://localhost:5000/api/konsultasi_session/riwayat/pengacara/${pengacaraId}`)
        .then((res) => res.json())
        .then((data) => setKonsultasiList(data))
        .catch((err) => console.error("Gagal mengambil riwayat konsultasi pengacara:", err));
    }
  }, [pengacaraId]);

  const getFotoUserUrl = (foto) =>
    foto && foto !== "default-profile.png"
      ? `http://localhost:5000/uploads/${foto}`
      : null;

  const renderStatus = (item) => {
    if (!item.nama_user)
      return <span className="status-belum-diambil">Belum diambil User</span>;

    const statusClass = `status-${(item.status || "unknown").toLowerCase()}`;
    return (
      <span className={statusClass}>
        {item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "Tidak Diketahui"}
      </span>
    );
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { dateStyle: "medium" });
  };

  return (
    <>
      <div className="riwayat-pengacara-page">
        <HeaderLawyer />
        <main className="riwayat-main-container">
          {/* Riwayat Konsultasi - Kiri */}
          <section className="riwayat-section riwayat-left">
            <h2 className="riwayat-heading">Riwayat Konsultasi</h2>
            {konsultasiList.length === 0 ? (
              <p className="empty-text">Belum ada riwayat konsultasi.</p>
            ) : (
              <div className="card-list">
                {konsultasiList.map((session) => (
                  <article key={session.id} className="card">
                    <div className="card-image-wrapper">
                      {getFotoUserUrl(session.foto_user) ? (
                        <img
                          src={getFotoUserUrl(session.foto_user)}
                          alt={`Foto ${session.nama_user}`}
                          className="card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="card-image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{session.nama_user || "User Tidak Diketahui"}</h3>
                      <dl className="card-details">
                        <div>
                          <dt>Biaya:</dt>
                          <dd>Rp {session.biaya?.toLocaleString("id-ID") || "-"}</dd>
                        </div>
                        <div>
                          <dt>Waktu Mulai:</dt>
                          <dd>{formatDateTime(session.start_time)}</dd>
                        </div>
                        <div>
                          <dt>Durasi (menit):</dt>
                          <dd>{session.duration || "-"}</dd>
                        </div>
                        <div>
                          <dt>Status:</dt>
                          <dd>{renderStatus(session)}</dd>
                        </div>
                      </dl>
                      <div className="card-actions">
                        <Link to={`/chat/user/${session.id_user}`} className="btn btn-secondary">
                          Riwayat Chat
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Garis vertikal pemisah */}
          <div className="vertical-separator" />

          {/* Riwayat Kasus - Kanan */}
          <section className="riwayat-section riwayat-right">
            <h2 className="riwayat-heading">Riwayat Kasus</h2>
            {kasusList.length === 0 ? (
              <p className="empty-text">Belum ada kasus.</p>
            ) : (
              <div className="card-list">
                {kasusList.map((kasus) => (
                  <article key={kasus.id} className="card">
                    <div className="card-image-wrapper">
                      {getFotoUserUrl(kasus.foto_user) ? (
                        <img
                          src={getFotoUserUrl(kasus.foto_user)}
                          alt={`Foto ${kasus.nama_user}`}
                          className="card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="card-image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{kasus.nama_user || "User Tidak Diketahui"}</h3>
                      <dl className="card-details">
                        <div>
                          <dt>Biaya Minimal:</dt>
                          <dd>Rp {kasus.biaya_min?.toLocaleString("id-ID") || "-"}</dd>
                        </div>
                        <div>
                          <dt>Biaya Maksimal:</dt>
                          <dd>Rp {kasus.biaya_max?.toLocaleString("id-ID") || "-"}</dd>
                        </div>
                        <div>
                          <dt>Jenis Pengerjaan:</dt>
                          <dd>{kasus.jenis_pengerjaan || "-"}</dd>
                        </div>
                        <div>
                          <dt>Area Praktik:</dt>
                          <dd>{kasus.area_praktik || "-"}</dd>
                        </div>
                        <div>
                          <dt>Estimasi Selesai:</dt>
                          <dd>{formatDate(kasus.estimasi_selesai)}</dd>
                        </div>
                        <div>
                          <dt>Status:</dt>
                          <dd>{renderStatus(kasus)}</dd>
                        </div>
                      </dl>
                      <div className="card-actions">
                        <Link to={`/DaftarKasus`} className="btn btn-secondary">
                          Riwayat Kasus
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
            <div className="footer-separator"></div>
      <Footer />
    </>
  );
};

export default RiwayatKasusPengacara;
