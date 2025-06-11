import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  const [pengacaras, setPengacaras] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  // Ambil data pengacara yang sudah disetujui
  const fetchPengacaras = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pengacara");
      setPengacaras(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengacara:", error);
    }
  }, []);

  // Ambil data pendaftaran pengacara yang belum disetujui
  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/lawyers/registrations");

      const now = new Date();

      // Hitung deadline dan status expired tiap pendaftar
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

  // Setujui pendaftaran
  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/lawyers/approve/${id}`);
      alert("Pendaftaran berhasil disetujui!");
      fetchRegistrations();
      fetchPengacaras();
    } catch (error) {
      console.error("Approval error:", error);
      alert("Terjadi kesalahan saat menyetujui pendaftaran.");
    }
  };

  // Tolak pendaftaran
  const handleReject = async (id) => {
    const confirmReject = window.confirm("Yakin ingin menolak dan menghapus pendaftaran ini?");
    if (!confirmReject) return;

    try {
      await axios.delete(`http://localhost:5000/api/lawyers/reject/${id}`);
      alert("Pendaftaran telah ditolak dan dihapus.");
      fetchRegistrations();
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Terjadi kesalahan saat menolak pendaftaran.");
    }
  };

  // Format tanggal ke dd/mm/yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hitung sisa waktu (menit dan detik)
  const calculateRemainingTime = (remainingMs) => {
    if (remainingMs <= 0) return "Kadaluarsa";

    const diffMinutes = Math.floor(remainingMs / (1000 * 60));
    const diffSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    return `${diffMinutes} menit ${diffSeconds} detik lagi`;
  };

  useEffect(() => {
    fetchPengacaras();
    fetchRegistrations();

    // Refresh setiap 1 detik agar timer berjalan
    const interval = setInterval(() => {
      fetchRegistrations();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchPengacaras, fetchRegistrations]);

  // Warna background baris berdasarkan waktu tersisa
  const getRowBackgroundColor = (reg) => {
    if (reg.isExpired) return "#ffebee"; // merah muda (expired)
    if (reg.remainingMs <= 3 * 60 * 1000) return "#fff9c4"; // kuning muda (<= 3 menit)
    return "inherit"; // default
  };

  return (
     <AdminLayout>
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, padding: "20px" }} className="Main-Content">
        <h2>Daftar Pendaftaran Pengacara (Belum Disetujui)</h2>
        <div className="table-container">
          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}
          >
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>No. HP</th>
                <th>Alamat</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Spesialisasi</th>
                <th>Universitas</th>
                <th>Pendidikan</th>
                <th>Pengalaman</th>
                <th>Nomor Induk Advokat</th>
                <th>KTP</th>
                <th>Foto</th>
                <th>Kartu Advokat</th>
                <th>PKPA</th>
                <th>LinkedIn</th>
                <th>Instagram</th>
                <th>Twitter / X</th>
                <th>Resume / CV</th>
                <th>Batas Waktu</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="21" style={{ textAlign: "center" }}>
                    Tidak ada pendaftaran.
                  </td>
                </tr>
              ) : (
                registrations.map((lawyer) => (
                  <tr key={lawyer.id} style={{ backgroundColor: getRowBackgroundColor(lawyer) }}>
                    <td>{lawyer.nama}</td>
                    <td>{lawyer.email}</td>
                    <td>{lawyer.no_hp}</td>
                    <td>{lawyer.alamat}</td>
                    <td>{formatDate(lawyer.tanggal_lahir)}</td>
                    <td>{lawyer.jenis_kelamin}</td>
                    <td>{lawyer.spesialisasi}</td>
                    <td>{lawyer.universitas}</td>
                    <td>{lawyer.pendidikan}</td>
                    <td>{lawyer.pengalaman} tahun</td>
                    <td>{lawyer.nomor_induk_advokat}</td>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${lawyer.upload_ktp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </a>
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${lawyer.upload_foto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </a>
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${lawyer.upload_kartu_advokat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </a>
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5000/uploads/${lawyer.upload_pkpa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat
                      </a>
                    </td>

                    <td>
                      {lawyer.linkedin ? (
                        <a href={lawyer.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {lawyer.instagram ? (
                        <a href={lawyer.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {lawyer.twitter ? (
                        <a href={lawyer.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {lawyer.resume_cv ? (
                        <a
                          href={`http://localhost:5000/uploads/${lawyer.resume_cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat Resume
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {lawyer.isExpired ? (
                        "Kadaluarsa"
                      ) : (
                        <>
                          {formatDate(lawyer.deadline)} <br />
                          <small>({calculateRemainingTime(lawyer.remainingMs)})</small>
                        </>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleApprove(lawyer.id)}
                        style={{ marginLeft: "8px", backgroundColor: "#27AE60", color: "white" }}
                        disabled={lawyer.isExpired}
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(lawyer.id)}
                        style={{ marginLeft: "8px", backgroundColor: "red", color: "white" }}
                      >
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <h2>Daftar Pengacara (Sudah Disetujui)</h2>
        <div className="table-container">
          <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Tidak ada data pengacara.
                  </td>
                </tr>
              ) : (
                pengacaras.map((pengacara) => (
                  <tr key={pengacara.id}>
                    <td>{pengacara.nama}</td>
                    <td>{pengacara.email}</td>
                    <td>{pengacara.spesialisasi}</td>
                    <td>{pengacara.no_hp}</td>
                    <td>{pengacara.alamat}</td>
                    <td>
                      <button className="view">Lihat</button>
                      <button className="edit">Edit</button>
                      <button className="delete">Hapus</button>
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
