import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TambahPengacara.css";

const TambahPengacara = () => {
  const [pengacaras, setPengacaras] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const fetchPengacaras = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pengacara");
      setPengacaras(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengacara:", error);
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/lawyers/registrations");

      const registrationsWithDeadline = response.data.map(reg => {
        const registrationDate = new Date(reg.createdAt || new Date());
        const deadlineDate = new Date(registrationDate);
        deadlineDate.setDate(deadlineDate.getDate() + 7);

        return {
          ...reg,
          deadline: deadlineDate,
          isExpired: new Date() > deadlineDate
        };
      });

      setRegistrations(registrationsWithDeadline);

      const expiredRegistrations = registrationsWithDeadline.filter(reg => reg.isExpired);
      for (const reg of expiredRegistrations) {
        await autoReject(reg.id);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  }, []);

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

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateRemainingDays = (deadline) => {
    if (!deadline) return "-";
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? `${diffDays} hari lagi` : "Kadaluarsa";
  };

  const autoReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lawyers/reject/${id}`);
      console.log(`Pendaftaran ID ${id} sudah auto-reject (kadaluarsa).`);
    } catch (error) {
      console.error(`Gagal auto-reject ID ${id}:`, error);
    }
  };

  useEffect(() => {
    fetchPengacaras();
    fetchRegistrations();

    const interval = setInterval(() => {
      fetchRegistrations();
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchPengacaras, fetchRegistrations]);

  return (
    <div style={{ display: "flex" }}>
      <SidebarAdmin />
      <div style={{ flex: 1, padding: "20px" }} className="Main-Content">
        <h2>Daftar Pendaftaran Pengacara (Belum Disetujui)</h2>
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "40px" }}>
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
              <th>Batas Waktu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan="17" style={{ textAlign: "center" }}>
                  Tidak ada pendaftaran.
                </td>
              </tr>
            ) : (
              registrations.map((lawyer) => (
                <tr key={lawyer.id} style={{ backgroundColor: lawyer.isExpired ? '#ffebee' : 'inherit' }}>
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
                  <td><a href={`http://localhost:5000/uploads/${lawyer.upload_ktp}`} target="_blank" rel="noopener noreferrer">Lihat</a></td>
                  <td><a href={`http://localhost:5000/uploads/${lawyer.upload_foto}`} target="_blank" rel="noopener noreferrer">Lihat</a></td>
                  <td><a href={`http://localhost:5000/uploads/${lawyer.upload_kartu_advokat}`} target="_blank" rel="noopener noreferrer">Lihat</a></td>
                  <td><a href={`http://localhost:5000/uploads/${lawyer.upload_pkpa}`} target="_blank" rel="noopener noreferrer">Lihat</a></td>
                  <td>
                    {lawyer.isExpired ? (
                      "Kadaluarsa"
                    ) : (
                      <>
                        {formatDate(lawyer.deadline)} <br />
                        <small>({calculateRemainingDays(lawyer.deadline)})</small>
                      </>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleApprove(lawyer.id)} 
                      style={{ marginLeft: "8px", backgroundColor: "#27AE60" , color: "white" }}
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

        <h2>Daftar Pengacara (Sudah Disetujui)</h2>
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
                <tr key={pengacara._id}>
                  <td>{pengacara.nama}</td>
                  <td>{pengacara.email}</td>
                  <td>{pengacara.spesialisasi}</td>
                  <td>{pengacara.no_hp}</td>
                  <td>{pengacara.alamat}</td>
                  <td>
                    <button className="view">Lihat</button>
                    <button className="Edit">Edit</button>
                    <button className="delete">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TambahPengacara;
