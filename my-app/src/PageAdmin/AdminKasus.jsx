import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/AdminKasus.css";

const STATUS_OPTIONS = ["Semua", "Menunggu", "Diproses", "Selesai"];

const AdminKasus = () => {
  const [kasusList, setKasusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State filter dan pencarian
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchKasus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/kasus");
        if (!response.ok) throw new Error("Gagal mengambil data kasus");
        const data = await response.json();
        setKasusList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKasus();
  }, []);

  // Filter dan cari data kasus sesuai filter dan search
  const filteredKasus = kasusList.filter((kasus) => {
    const statusMatch = filterStatus === "Semua" || kasus.status === filterStatus;
    const searchMatch = kasus.nama.toLowerCase().includes(searchName.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Pisah kasus yang sudah diambil pengacara dan yang belum
  const kasusDiambil = filteredKasus.filter((k) => k.lawyer_id !== null);
  const kasusBelumDiambil = filteredKasus.filter((k) => k.lawyer_id === null);

  if (loading) return <p>Memuat data kasus...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <AdminLayout>
      <div className="admin-kasus-container">
        <h2>Daftar Semua Kasus</h2>

        {/* Filter Status */}
        <div className="filter-container">
          <label htmlFor="statusFilter">Filter Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Search */}
          <label htmlFor="searchName" style={{ marginLeft: 20 }}>
            Cari Nama Pengaju:
          </label>
          <input
            type="text"
            id="searchName"
            placeholder="Masukkan nama..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        {/* Tabel Kasus yang Sudah Diambil Pengacara */}
        <h3 style={{ marginTop: 30 }}>Kasus yang Sudah Diambil Pengacara</h3>
        {kasusDiambil.length === 0 ? (
          <p>Tidak ada kasus yang sudah diambil pengacara.</p>
        ) : (
          <table className="admin-kasus-table">
            <thead>
              <tr>
                <th>ID Kasus</th>
                <th>Nama Pengaju</th>
                <th>Email</th>
                <th>No HP</th>
                <th>Area Praktik</th>
                <th>Jenis Pengerjaan</th>
                <th>Biaya Min</th>
                <th>Biaya Max</th>
                <th>Estimasi Selesai</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Nama Pengacara</th>
                <th>Bukti</th>
                <th>Tanggal Pengajuan</th>
              </tr>
            </thead>
            <tbody>
              {kasusDiambil.map((kasus) => (
                <tr key={kasus.id}>
                  <td data-label="ID Kasus">{kasus.id}</td>
                  <td data-label="Nama Pengaju">{kasus.nama}</td>
                  <td data-label="Email">{kasus.email}</td>
                  <td data-label="No HP">{kasus.no_hp}</td>
                  <td data-label="Area Praktik">{kasus.area_praktik}</td>
                  <td data-label="Jenis Pengerjaan">{kasus.jenis_pengerjaan}</td>
                  <td data-label="Biaya Min">{kasus.biaya_min.toLocaleString("id-ID")}</td>
                  <td data-label="Biaya Max">{kasus.biaya_max.toLocaleString("id-ID")}</td>
                  <td data-label="Estimasi Selesai">{kasus.estimasi_selesai}</td>
                  <td data-label="Lokasi">{kasus.lokasi}</td>
                  <td data-label="Status">{kasus.status}</td>
                  <td data-label="Nama Pengacara">{kasus.nama_pengacara ?? "Unknown"}</td>
                  <td data-label="Bukti">
                    {kasus.bukti ? (
                      <a
                        href={`http://localhost:5000/uploads/${kasus.bukti}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Bukti
                      </a>
                    ) : (
                      "Tidak Ada"
                    )}
                  </td>
                  <td data-label="Tanggal Pengajuan">
                    {new Date(kasus.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Tabel Kasus yang Belum Diambil Pengacara */}
        <h3 style={{ marginTop: 40 }}>Kasus yang Belum Diambil Pengacara</h3>
        {kasusBelumDiambil.length === 0 ? (
          <p>Tidak ada kasus yang belum diambil pengacara.</p>
        ) : (
          <table className="admin-kasus-table">
            <thead>
              <tr>
                <th>No HP</th>
                <th>Area Praktik</th>
                <th>Jenis Pengerjaan</th>
                <th>Biaya Min</th>
                <th>Biaya Max</th>
                <th>Estimasi Selesai</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th>Bukti</th>
                <th>Tanggal Pengajuan</th>
              </tr>
            </thead>
            <tbody>
              {kasusBelumDiambil.map((kasus) => (
                <tr key={kasus.id}>
                  <td data-label="No HP">{kasus.no_hp}</td>
                  <td data-label="Area Praktik">{kasus.area_praktik}</td>
                  <td data-label="Jenis Pengerjaan">{kasus.jenis_pengerjaan}</td>
                  <td data-label="Biaya Min">{kasus.biaya_min.toLocaleString("id-ID")}</td>
                  <td data-label="Biaya Max">{kasus.biaya_max.toLocaleString("id-ID")}</td>
                  <td data-label="Estimasi Selesai">{kasus.estimasi_selesai}</td>
                  <td data-label="Lokasi">{kasus.lokasi}</td>
                  <td data-label="Status">{kasus.status}</td>
                  <td data-label="Bukti">
                    {kasus.bukti ? (
                      <a
                        href={`http://localhost:5000/uploads/${kasus.bukti}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Bukti
                      </a>
                    ) : (
                      "Tidak Ada"
                    )}
                  </td>
                  <td data-label="Tanggal Pengajuan">
                    {new Date(kasus.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminKasus;
