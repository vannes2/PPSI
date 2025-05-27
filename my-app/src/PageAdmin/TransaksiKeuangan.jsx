import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TransaksiKeuangan.css";

const TransaksiKeuangan = () => {
  const [data, setData] = useState({});
  const [kasus, setKasus] = useState([]);
  const [konsultasi, setKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transaksiKeuangan");
  const [updating, setUpdating] = useState(false); // untuk disable button saat update

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resKeuangan, resKasus, resKonsultasi] = await Promise.all([
        axios.get("http://localhost:5000/api/transaksi-keuangan/total"),
        axios.get("http://localhost:5000/api/transaksi/ajukan-kasus"),
        axios.get("http://localhost:5000/api/transaksi/konsultasi-session"),
      ]);

      setData(resKeuangan.data);
      setKasus(resKasus.data);
      setKonsultasi(resKonsultasi.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data transaksi keuangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const format = (num) => `Rp${Number(num || 0).toLocaleString("id-ID")}`;
  const formatTanggal = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleMarkTransfer = async (type, id) => {
    if (!window.confirm("Tandai pembayaran ini sudah ditransfer ke pengacara?")) return;

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/transaksi/transfer/${type}/${id}`);
      // refresh data setelah update
      await fetchData();
    } catch (err) {
      alert("Gagal memperbarui status transfer");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="admin-layout-wrapper">
      <SidebarAdmin activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="transaksi-container">
        <h2>Ringkasan Transaksi Keuangan</h2>

        {loading ? (
          <p>Memuat data...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            {/* === TOTAL === */}
            <section className="keuangan-summary">
              <h3>📊 Total Keseluruhan</h3>
              <div className="summary-row">
                <div className="summary-box box-kotor">
                  <h4>Total Kotor</h4>
                  <p>{format(data.total_kotor)}</p>
                </div>
                <div className="summary-box box-bersih">
                  <h4>Total Bersih</h4>
                  <p>{format(data.pendapatan_bersih)}</p>
                </div>
                <div className="summary-box box-pengeluaran">
                  <h4>Total Pengeluaran</h4>
                  <p>{format(data.total_pengeluaran)}</p>
                </div>
              </div>
            </section>

            {/* === AJUKAN KASUS === */}
            <section className="keuangan-summary">
              <h3>🧾 Pendapatan dari Ajukan Kasus</h3>
              <div className="summary-row">
                <div className="summary-box box-kotor">
                  <h4>Pendapatan Kotor</h4>
                  <p>{format(data.total_kasus_kotor)}</p>
                </div>
                <div className="summary-box box-bersih">
                  <h4>Pendapatan Bersih</h4>
                  <p>{format(data.pendapatan_bersih_kasus)}</p>
                </div>
                <div className="summary-box box-pengeluaran">
                  <h4>Pengeluaran</h4>
                  <p>{format(data.pengeluaran_kasus)}</p>
                </div>
              </div>
              {/* Tabel Kasus */}
              <div className="transaksi-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nama Klien</th>
                      <th>Biaya</th>
                      <th>Pengacara</th>
                      <th>Nama Rekening</th>
                      <th>No Rekening</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kasus.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nama}</td>
                        <td>{format(row.biaya_min)}</td>
                        <td>{row.nama_pengacara || "-"}</td>
                        <td>{row.nama_rekening || "-"}</td>
                        <td>{row.no_rekening || "-"}</td>
                        <td>{row.status}</td>
                        <td>{formatTanggal(row.created_at)}</td>
                        <td>
                          {row.is_transferred ? (
                            <span style={{ color: "green", fontWeight: "600" }}>Sudah Transfer</span>
                          ) : (
                            <button
                              disabled={updating}
                              onClick={() => handleMarkTransfer("kasus", row.id)}
                            >
                              Tandai Sudah Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* === KONSULTASI === */}
            <section className="keuangan-summary">
              <h3>💬 Pendapatan dari Konsultasi</h3>
              <div className="summary-row">
                <div className="summary-box box-kotor">
                  <h4>Pendapatan Kotor</h4>
                  <p>{format(data.total_konsultasi_kotor)}</p>
                </div>
                <div className="summary-box box-bersih">
                  <h4>Pendapatan Bersih</h4>
                  <p>{format(data.pendapatan_bersih_konsultasi)}</p>
                </div>
                <div className="summary-box box-pengeluaran">
                  <h4>Pengeluaran</h4>
                  <p>{format(data.pengeluaran_konsultasi)}</p>
                </div>
              </div>

              {/* Tabel Konsultasi */}
              <div className="transaksi-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nama User</th>
                      <th>Nama Pengacara</th>
                      <th>Waktu Mulai</th>
                      <th>Durasi (menit)</th>
                      <th>Biaya</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {konsultasi.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nama_user || "-"}</td>
                        <td>{row.nama_pengacara || "-"}</td>
                        <td>{new Date(row.start_time).toLocaleString("id-ID")}</td>
                        <td>{row.duration}</td>
                        <td>{format(row.biaya)}</td>
                        <td>{row.status}</td>
                        <td>
                          {row.is_transferred ? (
                            <span style={{ color: "green", fontWeight: "600" }}>Sudah Transfer</span>
                          ) : (
                            <button
                              disabled={updating}
                              onClick={() => handleMarkTransfer("konsultasi", row.id)}
                            >
                              Tandai Sudah Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default TransaksiKeuangan;
