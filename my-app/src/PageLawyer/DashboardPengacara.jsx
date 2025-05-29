import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend,
} from 'recharts';
import HeaderLawyer from "../components/HeaderLawyer";
import Footer from "../components/Footer";
import '../CSS_Lawyer/DashboardPengacara.css'; // Pastikan path ini benar

// --- Helper untuk Export Excel ---
const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, "laporan_pengacara.xlsx");
};

// --- Custom Hook untuk Fetching Data ---
const useLawyerDashboardData = (lawyerId) => {
  const [data, setData] = useState({
    summary: null,
    grafik: [],
    transaksi: [],
    monthlyCounts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lawyerId) {
      setLoading(false);
      setError("ID pengacara tidak ditemukan atau tidak valid. Silakan login kembali.");
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, grafikRes, transaksiRes, monthlyCountsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}`),
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}/grafik`),
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}/transaksi`),
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}/monthly-counts`)
        ]);

        setData({
          summary: summaryRes.data,
          grafik: grafikRes.data,
          transaksi: transaksiRes.data,
          monthlyCounts: monthlyCountsRes.data,
        });
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Gagal mengambil data dashboard: ${err.response.data.message}`);
        } else {
          setError('Terjadi kesalahan saat mengambil data dashboard. Mohon coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lawyerId]);

  return { data, loading, error };
};

// --- Komponen DashboardPengacara ---
const DashboardPengacara = () => {
  const [lawyerId, setLawyerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "pengacara" && storedUser.id) {
      setLawyerId(storedUser.id);
    } else {
      setLawyerId(null);
    }
  }, []);

  const { data, loading, error } = useLawyerDashboardData(lawyerId);
  const { summary, grafik, transaksi, monthlyCounts } = data;

  const filteredTransaksi = useMemo(() => {
    let currentTransaksi = transaksi;

    if (filterStatus === 'transferred') {
      currentTransaksi = currentTransaksi.filter(trx => trx.is_transferred === 1);
    } else if (filterStatus === 'pending') {
      currentTransaksi = currentTransaksi.filter(trx => trx.is_transferred === 0);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentTransaksi = currentTransaksi.filter(trx =>
        trx.nama_user && trx.nama_user.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentTransaksi;
  }, [transaksi, filterStatus, searchTerm]);

  const totalHonor = useMemo(() => {
    return filteredTransaksi.reduce((acc, trx) => acc + Number(trx.biaya_pengacara || 0), 0);
  }, [filteredTransaksi]);

  const totalHonorSudahTransfer = useMemo(() => {
    return filteredTransaksi
      .filter(trx => trx.is_transferred === 1)
      .reduce((acc, trx) => acc + Number(trx.biaya_pengacara || 0), 0);
  }, [filteredTransaksi]);

  const totalHonorBelumTransfer = useMemo(() => {
    return filteredTransaksi
      .filter(trx => trx.is_transferred === 0)
      .reduce((acc, trx) => acc + Number(trx.biaya_pengacara || 0), 0);
  }, [filteredTransaksi]);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  };

  const pieChartData = useMemo(() => {
    if (!summary) return [];
    return [
      { name: 'Kasus Selesai', value: summary.total_kasus_selesai },
      { name: 'Konsultasi Selesai', value: summary.total_konsultasi_selesai },
    ].filter(item => item.value > 0);
  }, [summary]);

  const COLORS = ['#0088FE', '#00C49F'];

  if (loading) {
    return (
      <div className="dashboard-container loading-state">
        <HeaderLawyer />
        <br /><br /><br /><br />
        <p>Memuat data dashboard, mohon tunggu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error-state">
        <HeaderLawyer />
        <br /><br /><br /><br />
        <h2>Terjadi Kesalahan</h2>
        <p className="text-red-500">{error}</p>
        <p>Mohon pastikan server backend Anda berjalan dengan baik dan koneksi internet stabil.</p>
      </div>
    );
  }

  return (
    <div>
      <HeaderLawyer />
      <div className="dashboard-container">
        <br /><br /><br /><br />
        <h2 className="dashboard-title">Dashboard Pengacara</h2>

        {/* --- PENGUMUMAN BARU --- */}
        <div className="announcement-box">
          <strong>Pemberitahuan Penting:</strong> Honor dari sesi konsultasi atau kasus yang telah diselesaikan akan ditransfer ke rekening Anda dalam waktu 7 hari kerja setelah penyelesaian.
        </div>
        {/* --- AKHIR PENGUMUMAN BARU --- */}

        {/* Ringkasan */}
        {summary ? (
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Pendapatan Total</h3>
              <p className="text-green">
                {formatCurrency(summary.total_pendapatan_semua)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Sisa Belum Ditransfer</h3>
              <p className="text-yellow">
                {formatCurrency(summary.sisa_belum_ditransfer)}
              </p>
            </div>
            <div className="summary-card">
              <h3>Total Kasus Selesai</h3>
              <p className="text-blue">{summary.total_kasus_selesai} kasus</p>
            </div>
            <div className="summary-card">
              <h3>Total Konsultasi Selesai</h3>
              <p className="text-purple">{summary.total_konsultasi_selesai} sesi</p>
            </div>
          </div>
        ) : (
          <p className="empty-state-message">Ringkasan data belum tersedia.</p>
        )}

        {/* Grafik Pendapatan Bulanan */}
        <div className="chart-section">
          <h3 className="chart-title">Grafik Pendapatan Bulanan</h3>
          {grafik.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={grafik}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="bulan" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-state-message">Belum ada data pendapatan bulanan untuk ditampilkan.</p>
          )}
        </div>

        {/* --- KONTainer Baru untuk Grafik Berdampingan --- */}
        <div className="side-by-side-charts">
          {/* Pie Chart (Proporsi Kasus vs. Konsultasi Selesai) */}
          <div className="chart-section chart-half">
            <h3 className="chart-title">Proporsi Kasus vs. Konsultasi Selesai</h3>
            {pieChartData.length > 0 && (pieChartData[0].value > 0 || pieChartData[1].value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {
                      pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} ${name.includes('Kasus') ? 'kasus' : 'sesi'}`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state-message">Belum ada data kasus atau konsultasi selesai untuk grafik proporsi.</p>
            )}
          </div>

          {/* Bar Chart (Jumlah Kasus dan Konsultasi Selesai per Bulan) */}
          <div className="chart-section chart-half">
            <h3 className="chart-title">Jumlah Kasus dan Konsultasi Selesai Bulanan</h3>
            {monthlyCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_kasus_bulanan" fill="#8884d8" name="Kasus Selesai" />
                  <Bar dataKey="total_konsultasi_bulanan" fill="#82ca9d" name="Konsultasi Selesai" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state-message">Belum ada data kasus atau konsultasi yang selesai setiap bulannya.</p>
            )}
          </div>
        </div>
        {/* --- AKHIR KONTainer Baru untuk Grafik Berdampingan --- */}

        {/* Tabel Transaksi */}
        <div className="table-section">
          <div className="table-header">
            <h3>Detail Transaksi Honor</h3>
            <button
              onClick={() => exportToExcel(filteredTransaksi)}
              className="export-button"
              disabled={filteredTransaksi.length === 0}
            >
              Export ke Excel
            </button>
          </div>

          <div className="filter-controls">
            <input
              type="text"
              placeholder="Cari nama klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Semua Status</option>
              <option value="transferred">Sudah Transfer</option>
              <option value="pending">Belum Transfer</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Nama Klien</th>
                  <th>Honor (Rp)</th>
                  <th>Status Transfer</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransaksi.length > 0 ? (
                  filteredTransaksi.map((trx, index) => (
                    <tr key={index}>
                      <td>{trx.jenis}</td>
                      <td>{trx.nama_user || 'Tidak diketahui'}</td>
                      <td>{formatCurrency(trx.biaya_pengacara)}</td>
                      <td className={trx.is_transferred === 1 ? "status-success" : "status-pending"}>
                        {trx.is_transferred === 1 ? "Sudah Transfer" : "Belum Transfer"}
                      </td>
                      <td>
                        {trx.tanggal ? new Date(trx.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                      Tidak ada transaksi yang cocok dengan kriteria pencarian/filter.
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredTransaksi.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Honor (Tampilan):</td>
                    <td colSpan="3" style={{ fontWeight: 'bold' }}>
                      {formatCurrency(totalHonor)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {filteredTransaksi.length > 0 && (
            <div className="total-status-section">
              <p><strong>Total Honor Sudah Ditransfer (Tampilan):</strong> {formatCurrency(totalHonorSudahTransfer)}</p>
              <p><strong>Total Honor Belum Ditransfer (Tampilan):</strong> {formatCurrency(totalHonorBelumTransfer)}</p>
              <p className="note-text">Catatan: Total di atas adalah berdasarkan transaksi yang saat ini ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default DashboardPengacara;