import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import '../CSS_Lawyer/DashboardPengacara.css';

const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, "laporan_pengacara.xlsx");
};

const DashboardPengacara = () => {
  const [lawyerId, setLawyerId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [grafikData, setGrafikData] = useState([]);
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role === "pengacara" && storedUser.id) {
      setLawyerId(storedUser.id);
    } else {
      setError("ID pengacara tidak tersedia");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!lawyerId) return;

    const fetchAllData = async () => {
      try {
        const [summaryRes, grafikRes, transaksiRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}`),
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}/grafik`),
          axios.get(`http://localhost:5000/api/dashboard-pengacara/${lawyerId}/transaksi`)
        ]);

        setSummary(summaryRes.data);
        setGrafikData(grafikRes.data);
        setDetailTransaksi(transaksiRes.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError('Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [lawyerId]);

  if (loading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container text-red-500">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Pengacara</h2>

      {/* Ringkasan */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Pendapatan Total</h3>
          <p className="text-green">Rp {summary.total_pendapatan_semua.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Sisa Belum Ditransfer</h3>
          <p className="text-yellow">Rp {summary.sisa_belum_ditransfer.toLocaleString()}</p>
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

      {/* Grafik Pendapatan */}
      <div className="chart-section">
        <h3 className="chart-title">Grafik Pendapatan Bulanan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={grafikData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="bulan" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#4F46E5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabel Transaksi */}
      <div className="table-section">
        <div className="table-header">
          <h3>Detail Transaksi Honor</h3>
          <button
            onClick={() => exportToExcel(detailTransaksi)}
            className="export-button"
          >
            Export ke Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Jenis</th>
                <th>ID</th>
                <th>Honor (Rp)</th>
                <th>Status Transfer</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {detailTransaksi.map((trx, index) => (
                <tr key={index}>
                  <td>{trx.jenis}</td>
                  <td>{trx.id}</td>
                  <td>Rp {trx.biaya_pengacara.toLocaleString()}</td>
                  <td className={trx.is_transferred === 1 ? "status-success" : "status-pending"}>
                    {trx.is_transferred === 1 ? "Sudah Transfer" : "Belum Transfer"}
                  </td>
                  <td>{new Date(trx.tanggal).toLocaleDateString()}</td>
                </tr>
              ))}
              {detailTransaksi.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPengacara;
