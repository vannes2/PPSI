import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Pengacara</h2>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pendapatan Total</h3>
          <p className="text-green-600 text-xl font-bold mt-2">Rp {summary.total_pendapatan_semua.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Sisa Belum Ditransfer</h3>
          <p className="text-yellow-600 text-xl font-bold mt-2">Rp {summary.sisa_belum_ditransfer.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Kasus Selesai</h3>
          <p className="text-blue-600 text-xl font-bold mt-2">{summary.total_kasus_selesai} kasus</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Konsultasi Selesai</h3>
          <p className="text-purple-600 text-xl font-bold mt-2">{summary.total_konsultasi_selesai} sesi</p>
        </div>
      </div>

      {/* Grafik Pendapatan */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Grafik Pendapatan Bulanan</h3>
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
      <div className="bg-white p-6 rounded-2xl shadow mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Detail Transaksi Honor</h3>
          <button
            onClick={() => exportToExcel(detailTransaksi)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export ke Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Jenis</th>
                <th className="p-2">ID</th>
                <th className="p-2">Honor (Rp)</th>
                <th className="p-2">Status Transfer</th>
                <th className="p-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {detailTransaksi.map((trx, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{trx.jenis}</td>
                  <td className="p-2">{trx.id}</td>
                  <td className="p-2">Rp {trx.biaya_pengacara.toLocaleString()}</td>
                  <td className="p-2">{trx.is_transferred === 1 ? "Sudah Transfer" : "Belum Transfer"}</td>
                  <td className="p-2">{new Date(trx.tanggal).toLocaleDateString()}</td>
                </tr>
              ))}
              {detailTransaksi.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">Belum ada transaksi.</td>
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
