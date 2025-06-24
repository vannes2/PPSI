import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
// Pastikan file CSS ini berisi kode dari jawaban saya sebelumnya
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  // =================================================================
  // TIDAK ADA PERUBAHAN PADA LOGIKA & STATE MANAGEMENT
  // =================================================================
  const [pengacaras, setPengacaras] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const fetchPengacaras = useCallback(async () => {
    try {
      const response = await axios.get("https://ppsi-production.up.railway.app/api/pengacara");
      setPengacaras(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengacara:", error);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await axios.get("https://ppsi-production.up.railway.app/api/lawyers/registrations");
      const now = new Date();
      const regs = response.data.map(reg => {
        const registrationDate = new Date(reg.tanggal_daftar);
        const deadlineDate = new Date(registrationDate);
        deadlineDate.setMinutes(deadlineDate.getMinutes() + 10);
        const diffMs = deadlineDate - now;
        const isExpired = diffMs <= 0;
        return {
          ...reg,
          deadline: deadlineDate,
          isExpired,
          remainingMs: diffMs > 0 ? diffMs : 0,
        };
      });
      setRegistrations(regs);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://ppsi-production.up.railway.app/api/lawyers/approve/${id}`);
      alert("Pendaftaran berhasil disetujui!");
      fetchRegistrations();
      fetchPengacaras();
    } catch (error) {
      console.error("Approval error:", error);
      alert("Terjadi kesalahan saat menyetujui pendaftaran.");
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm("Yakin ingin menolak dan menghapus pendaftaran ini?");
    if (!confirmReject) return;
    try {
      await axios.delete(`https://ppsi-production.up.railway.app/api/lawyers/reject/${id}`);
      alert("Pendaftaran telah ditolak dan dihapus.");
      fetchRegistrations();
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Terjadi kesalahan saat menolak pendaftaran.");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateRemainingTime = (remainingMs) => {
    if (remainingMs <= 0) return "Kadaluarsa";
    const diffMinutes = Math.floor(remainingMs / (1000 * 60));
    const diffSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
    return `${diffMinutes} menit ${diffSeconds} detik`;
  };

  useEffect(() => {
    fetchPengacaras();
    fetchRegistrations();
    const interval = setInterval(() => {
      fetchRegistrations();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchPengacaras, fetchRegistrations]);

  // [MODIFIKASI UI] Warna disesuaikan dengan tema gelap
  const getRowStyle = (reg) => {
    if (reg.isExpired) {
      // Warna merah transparan yang sesuai tema
      return { backgroundColor: "rgba(231, 76, 60, 0.2)" };
    }
    if (reg.remainingMs <= 3 * 60 * 1000) {
      // Warna kuning transparan yang sesuai tema
      return { backgroundColor: "rgba(241, 196, 15, 0.2)" };
    }
    return {}; // Default
  };

  // =================================================================
  // PERUBAHAN TOTAL PADA TAMPILAN JSX
  // =================================================================
  return (
    <AdminLayout>
      <div className="container">
        {/* === BAGIAN PENDAFTARAN BELUM DISETUJUI === */}
        <h2 className="section-title">Daftar Pendaftaran Pengacara (Belum Disetujui)</h2>
        <div className={`table-wrapper ${registrations.length === 0 ? "is-empty" : ""}`}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kontak</th>
                  <th>Spesialisasi</th>
                  <th>Pendidikan</th>
                  <th>Dokumen</th>
                  <th>Sosial Media</th>
                  <th>Batas Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="8">Tidak ada pendaftaran.</td>
                  </tr>
                ) : (
                  registrations.map((lawyer) => (
                    <tr key={lawyer.id} style={getRowStyle(lawyer)}>
                      <td className="primary-text">{lawyer.nama}</td>
                      <td>
                        {lawyer.email}
                        <br />
                        <small>{lawyer.no_hp}</small>
                      </td>
                      <td>{lawyer.spesialisasi}</td>
                      <td>
                        {lawyer.pendidikan}
                        <br />
                        <small>{lawyer.universitas}</small>
                      </td>
                      <td>
                        <a href={`https://ppsi-production.up.railway.app/uploads/${lawyer.upload_ktp}`} target="_blank" rel="noopener noreferrer">KTP</a> |{" "}
                        <a href={`https://ppsi-production.up.railway.app/uploads/${lawyer.upload_kartu_advokat}`} target="_blank" rel="noopener noreferrer">Kartu</a> |{" "}
                        <a href={`https://ppsi-production.up.railway.app/uploads/${lawyer.upload_pkpa}`} target="_blank" rel="noopener noreferrer">PKPA</a> |{" "}
                        <a href={`https://ppsi-production.up.railway.app/uploads/${lawyer.resume_cv}`} target="_blank" rel="noopener noreferrer">CV</a>
                      </td>
                      <td>
                        {lawyer.linkedin && <a href={lawyer.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        {lawyer.instagram && <> | <a href={lawyer.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></>}
                      </td>
                      <td>
                        {lawyer.isExpired ? (
                          <span style={{ color: "var(--color-danger)" }}>Kadaluarsa</span>
                        ) : (
                          <>
                            {formatDate(lawyer.deadline)} <br />
                            <small>({calculateRemainingTime(lawyer.remainingMs)})</small>
                          </>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => handleApprove(lawyer.id)}
                            className="view"
                            title="Setujui Pendaftaran"
                            disabled={lawyer.isExpired}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={() => handleReject(lawyer.id)}
                            className="delete"
                            title="Tolak Pendaftaran"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* === BAGIAN PENGACARA SUDAH DISETUJUI === */}
        <h2 className="section-title">Daftar Pengacara (Sudah Disetujui)</h2>
        <div className={`table-wrapper ${pengacaras.length === 0 ? "is-empty" : ""}`}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Spesialisasi</th>
                  <th>No. HP</th>
                  <th>Alamat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengacaras.length === 0 ? (
                  <tr>
                    <td colSpan="6">Tidak ada data pengacara.</td>
                  </tr>
                ) : (
                  pengacaras.map((pengacara) => (
                    <tr key={pengacara.id}>
                      <td className="primary-text">{pengacara.nama}</td>
                      <td>{pengacara.email}</td>
                      <td>{pengacara.spesialisasi}</td>
                      <td>{pengacara.no_hp}</td>
                      <td>{pengacara.alamat}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="view" title="Lihat Detail">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="edit" title="Edit Data">
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button className="delete" title="Hapus Data">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TambahPengacara;