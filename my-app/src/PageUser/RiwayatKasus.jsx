import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS_User/RiwayatKasus.css";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";

const RiwayatKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [konsultasiList, setKonsultasiList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  /* -------------------------------------------------------------------------- */
  /*                                DATA FETCHING                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (user && user.id) {
      /* --- Riwayat Kasus --- */
      fetch(`http://localhost:5000/api/kasus/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Data Riwayat Kasus:", data); // 👈 Cek di console
          setKasusList(data);
        })
        .catch((err) => console.error("Gagal mengambil data kasus:", err));

      /* --- Riwayat Konsultasi --- */
      fetch(`http://localhost:5000/api/konsultasi_session/riwayat/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Data Riwayat Konsultasi:", data); // 👈 Cek di console
          setKonsultasiList(data);
        })
        .catch((err) => console.error("Gagal mengambil data konsultasi:", err));
    }
  }, [user]);

  /* -------------------------------------------------------------------------- */
  /*                                UTILITAS UI                                 */
  /* -------------------------------------------------------------------------- */
  const getFotoPengacaraUrl = (foto) =>
    foto && foto !== "default-profile.png"
      ? `http://localhost:5000/uploads/${foto}`
      : null;

  const isFotoDefault = (foto) => !foto || foto === "default-profile.png";

  /** Menghasilkan elemen badge status */
  const renderStatusKasus = (kasus) => {
    /* Belum ada pengacara? */
    if (isFotoDefault(kasus.foto_pengacara) || !kasus.nama_pengacara) {
      return (
        <span className="status-badge status-belum-diambil-pengacara">
          Belum diambil Advokat
        </span>
      );
    }

    /* Status normal */
    const statusClass = (kasus.status || "default").toLowerCase();
    return (
      <span className={`status-badge status-${statusClass}`}>
        {kasus.status || "Tidak Diketahui"}
      </span>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <HeaderAfter />
      <div className="riwayat-container">
        <div className="riwayat-dua-kolom">
          {/* =======================  RIWAYAT KONSULTASI  ======================= */}
          <section className="riwayat-section">
            <h2 className="riwayat-title center-text">Riwayat Konsultasi</h2>

            <div className="card-list">
              {konsultasiList.length === 0 ? (
                <p>Belum ada riwayat konsultasi.</p>
              ) : (
                konsultasiList.map((session) => (
                  <div key={session.id} className="riwayat-card">
                    {/* FOTO PENGACARA */}
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

                    {/* KONTEN */}
                    <div className="riwayat-card-content">
                      <p>
                        <strong>Nama Pengacara:</strong>
                        <span>
                          {session.nama_pengacara || "Belum diambil Advokat"}
                        </span>
                      </p>
                      <p>
                        <strong>Harga Konsultasi:</strong>
                        <span>
                          Rp {session.harga_konsultasi?.toLocaleString("id-ID")}
                        </span>
                      </p>
                      <p>
                        <strong>Waktu Mulai:</strong>
                        <span>{new Date(session.start_time).toLocaleString()}</span>
                      </p>
                      <p>
                        <strong>Durasi (menit):</strong>
                        <span>{session.duration}</span>
                      </p>
                      <p>
                        <strong>Status:</strong>
                        {renderStatusKasus(session)}
                      </p>

                      {/* TOMBOL */}
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

          {/* =========================  RIWAYAT KASUS  ========================== */}
          <section className="riwayat-section">
            <h2 className="riwayat-title center-text">Riwayat Kasus</h2>

            <div className="card-list">
              {kasusList.length === 0 ? (
                <p>Belum ada kasus.</p>
              ) : (
                kasusList.map((kasus) => (
                  <div key={kasus.id} className="riwayat-card">
                    {/* FOTO PENGACARA */}
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

                    {/* KONTEN */}
                    <div className="riwayat-card-content">
                      <p>
                        <strong>Nama Pengacara:</strong>
                        <span>{kasus.nama_pengacara || "Belum diambil Advokat"}</span>
                      </p>
                      <p>
                        <strong>Biaya:</strong>
                        <span>
                          Rp {kasus.biaya_min?.toLocaleString("id-ID")} - Rp {kasus.biaya_max?.toLocaleString("id-ID")}
                        </span>
                      </p>
                      <p>
                        <strong>Jenis Pengerjaan:</strong>
                        <span>{kasus.jenis_pengerjaan}</span>
                      </p>
                      <p>
                        <strong>Area Praktik:</strong>
                        <span>{kasus.area_praktik}</span>
                      </p>
                      <p>
                        <strong>Estimasi Selesai:</strong>
                        <span>{new Date(kasus.estimasi_selesai).toLocaleDateString()}</span>
                      </p>
                      <p>
                        <strong>Status:</strong>
                        {renderStatusKasus(kasus)}
                      </p>

                      {/* TOMBOL */}
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

        {/* FOOTER */}
        <div style={{ marginTop: "60px" }} />
        <div className="footer-separator" />
        <Footer />
      </div>
    </>
  );
};

export default RiwayatKasus;
