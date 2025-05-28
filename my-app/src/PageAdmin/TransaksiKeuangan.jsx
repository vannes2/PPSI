import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TransaksiKeuangan.css";
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TransaksiKeuangan = () => {
  const [data, setData] = useState({});
  const [kasus, setKasus] = useState([]);
  const [konsultasi, setKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transaksiKeuangan");
  const [updating, setUpdating] = useState(false);

  // State filter & search kasus
  const [searchKasus, setSearchKasus] = useState("");
  const [sortKasusField, setSortKasusField] = useState("created_at");
  const [sortKasusOrder, setSortKasusOrder] = useState("desc");

  // State filter & search konsultasi
  const [searchKonsultasi, setSearchKonsultasi] = useState("");
  const [sortKonsultasiField, setSortKonsultasiField] = useState("start_time");
  const [sortKonsultasiOrder, setSortKonsultasiOrder] = useState("desc");

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

  // Fungsi sorting generic
  const sortData = (array, field, order, isDate = false) => {
    return [...array].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (isDate) {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filter + search + sort Kasus
  const filteredKasus = useMemo(() => {
    let filtered = kasus.filter((item) => item.nama?.toLowerCase().includes(searchKasus.toLowerCase()) || item.nama_pengacara?.toLowerCase().includes(searchKasus.toLowerCase()));
    filtered = sortData(filtered, sortKasusField, sortKasusOrder, sortKasusField === "created_at");
    return filtered;
  }, [kasus, searchKasus, sortKasusField, sortKasusOrder]);

  // Filter + search + sort Konsultasi
  const filteredKonsultasi = useMemo(() => {
    let filtered = konsultasi.filter((item) => item.nama_user?.toLowerCase().includes(searchKonsultasi.toLowerCase()) || item.nama_pengacara?.toLowerCase().includes(searchKonsultasi.toLowerCase()));
    filtered = sortData(filtered, sortKonsultasiField, sortKonsultasiOrder, sortKonsultasiField === "start_time");
    return filtered;
  }, [konsultasi, searchKonsultasi, sortKonsultasiField, sortKonsultasiOrder]);

  const handleMarkTransfer = async (type, id) => {
    if (!window.confirm("Tandai pembayaran ini sudah ditransfer ke pengacara?")) return;

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/transaksi/transfer/${type}/${id}`);
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
            {/* TOTAL */}
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

            <div className="chart-flex-wrapper">
              <div className="chart-box">
                <h4 style={{ marginBottom: "12px" }}>📈 Grafik Pendapatan & Pengeluaran</h4>
                <Line
                  data={{
                    labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                    datasets: [
                      {
                        label: "Pendapatan",
                        data: [2500000, 2800000, 3000000, 3300000, 3600000, 3900000, 4100000, 4200000, 4400000, 4600000, 4800000, 5000000],
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                        tension: 0.3,
                        pointRadius: 3,
                      },
                      {
                        label: "Pengeluaran",
                        data: [1800000, 2000000, 2200000, 2400000, 2600000, 2800000, 3000000, 3200000, 3400000, 3600000, 3800000, 4000000],
                        borderColor: "#F44336",
                        backgroundColor: "rgba(244, 67, 54, 0.2)",
                        tension: 0.3,
                        pointRadius: 3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `Rp${context.raw.toLocaleString("id-ID")}`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `Rp${value.toLocaleString("id-ID")}`,
                        },
                      },
                    },
                  }}
                />
              </div>

              <div className="chart-box">
                <h4 style={{ marginBottom: "12px" }}>📊 Komposisi Transaksi Keuangan</h4>
                <Pie
                  data={{
                    labels: ["Total Kotor", "Pendapatan Bersih", "Total Pengeluaran"],
                    datasets: [
                      {
                        label: "Jumlah (Rp)",
                        data: [data.total_kotor || 0, data.pendapatan_bersih || 0, data.total_pengeluaran || 0],
                        backgroundColor: ["#42A5F5", "#66BB6A", "#EF5350"],
                        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw || 0;
                            return `${context.label}: Rp${value.toLocaleString("id-ID")}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* AJUKAN KASUS */}
            <section className="keuangan-summary">
              <h3>🧾 Pendapatan dari Ajukan Kasus</h3>

              {/* Search & Filter Kasus */}
              <div className="filter-container filter-center">
                <input type="text" placeholder="Cari nama klien atau pengacara..." value={searchKasus} onChange={(e) => setSearchKasus(e.target.value)} />
                <select value={sortKasusField} onChange={(e) => setSortKasusField(e.target.value)}>
                  <option value="created_at">Waktu</option>
                  <option value="biaya_min">Biaya</option>
                </select>
                <select value={sortKasusOrder} onChange={(e) => setSortKasusOrder(e.target.value)}>
                  <option value="desc">Terbaru ke Terlama / Terbesar ke Terkecil</option>
                  <option value="asc">Terlama ke Terbaru / Terkecil ke Terbesar</option>
                </select>
                <button
                  onClick={() => {
                    setSearchKasus("");
                    setSortKasusField("created_at");
                    setSortKasusOrder("desc");
                  }}
                >
                  Reset Filter
                </button>
              </div>

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
              <br></br>

              {/* Tabel Kasus */}
              <div className="transaksi-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nama Klien</th>
                      <th>Biaya</th>
                      <th>Biaya Pengacara</th>
                      <th>Pengacara</th>
                      <th>Nama Rekening</th>
                      <th>No Rekening</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKasus.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nama}</td>
                        <td>{format(row.biaya_min)}</td>
                        <td>{format(row.biaya_pengacara)}</td>
                        <td>{row.nama_pengacara || "-"}</td>
                        <td>{row.nama_rekening || "-"}</td>
                        <td>{row.no_rekening || "-"}</td>
                        <td>{row.status}</td>
                        <td>{formatTanggal(row.created_at)}</td>
                        <td>
                          {row.is_transferred ? (
                            <span style={{ color: "green", fontWeight: "600" }}>Sudah Transfer</span>
                          ) : (
                            <button disabled={updating} onClick={() => handleMarkTransfer("kasus", row.id)}>
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

            {/* KONSULTASI */}
            <section className="keuangan-summary">
              <h3>💬 Pendapatan dari Konsultasi</h3>

              {/* Search & Filter Konsultasi */}
              <div className="filter-container filter-center">
                <input type="text" placeholder="Cari nama user atau pengacara..." value={searchKonsultasi} onChange={(e) => setSearchKonsultasi(e.target.value)} />
                <select value={sortKonsultasiField} onChange={(e) => setSortKonsultasiField(e.target.value)}>
                  <option value="start_time">Waktu</option>
                  <option value="biaya">Biaya</option>
                </select>
                <select value={sortKonsultasiOrder} onChange={(e) => setSortKonsultasiOrder(e.target.value)}>
                  <option value="desc">Terbaru ke Terlama / Terbesar ke Terkecil</option>
                  <option value="asc">Terlama ke Terbaru / Terkecil ke Terbesar</option>
                </select>
                <button
                  onClick={() => {
                    setSearchKonsultasi("");
                    setSortKonsultasiField("start_time");
                    setSortKonsultasiOrder("desc");
                  }}
                >
                  Reset Filter
                </button>
              </div>

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
                <br></br>
                <table>
                  <thead>
                    <tr>
                      <th>Nama User</th>
                      <th>Nama Pengacara</th>
                      <th>Waktu Mulai</th>
                      <th>Durasi (menit)</th>
                      <th>Biaya</th>
                      <th>Biaya Pengacara</th>
                      <th>Nama Rekening</th>
                      <th>No Rekening</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredKonsultasi.map((row) => (
                      <tr key={row.id}>
                        <td>{row.nama_user || "-"}</td>
                        <td>{row.nama_pengacara || "-"}</td>
                        <td>{new Date(row.start_time).toLocaleString("id-ID")}</td>
                        <td>{row.duration}</td>
                        <td>{format(row.biaya)}</td>
                        <td>{format(row.biaya_pengacara)}</td>
                        <td>{row.nama_rekening || "-"}</td>
                        <td>{row.no_rekening || "-"}</td>
                        <td>{row.status}</td>
                        <td>
                          {row.is_transferred ? (
                            <span style={{ color: "green", fontWeight: "600" }}>Sudah Transfer</span>
                          ) : (
                            <button disabled={updating} onClick={() => handleMarkTransfer("konsultasi", row.id)}>
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
