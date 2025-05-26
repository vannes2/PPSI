import { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS_Admin/TransaksiPengacara.css';
import AdminLayout from "../components/AdminLayout";

const TransaksiPengacara = () => {
  const [kasus, setKasus] = useState([]);
  const [konsultasi, setKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kasusRes, konsultasiRes] = await Promise.all([
          axios.get('http://localhost:5000/api/transaksi/ajukan-kasus'),
          axios.get('http://localhost:5000/api/transaksi/konsultasi-session')
        ]);
  
        setKasus(kasusRes.data.filter(item => item.status.toLowerCase() === 'selesai'));
        // Hapus filter status di konsultasi
        setKonsultasi(konsultasiRes.data); 
      } catch (err) {
        setError("Gagal mengambil data transaksi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const formatTanggal = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  return (
    <AdminLayout>
      <div className="transaksi-container">
        <h2>Transaksi Ajukan Kasus (Selesai)</h2>

        {loading ? (
          <p>Memuat data...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : kasus.length === 0 ? (
          <p>Tidak ada data kasus yang selesai.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nama Klien</th>
                  <th>Email</th>
                  <th>No HP</th>
                  <th>Area Praktik</th>
                  <th>Jenis Pengerjaan</th>
                  <th>Biaya</th>
                  <th>Pengacara</th>
                  <th>Nama Rekening</th>
                  <th>No Rekening</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {kasus.map(row => (
                  <tr key={row.id}>
                    <td>{row.nama}</td>
                    <td>{row.email}</td>
                    <td>{row.no_hp}</td>
                    <td>{row.area_praktik}</td>
                    <td>{row.jenis_pengerjaan}</td>
                    <td>Rp{row.biaya_min.toLocaleString()} - Rp{row.biaya_max.toLocaleString()}</td>
                    <td>{row.nama_pengacara || '-'}</td>
                    <td>{row.nama_rekening || '-'}</td>
                    <td>{row.no_rekening || '-'}</td>
                    <td>{row.status}</td>
                    <td>{formatTanggal(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}


<h2>Transaksi Konsultasi Session (Selesai)</h2>

{loading ? (
  <p>Memuat data...</p>
) : error ? (
  <p className="error-text">{error}</p>
) : konsultasi.length === 0 ? (
  <p>Tidak ada data konsultasi yang selesai.</p>
) : (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Nama User</th>
          <th>Nama Pengacara</th>
          <th>Waktu Mulai</th>
          <th>Durasi (menit)</th>
          <th>Biaya</th> {/* Kolom baru */}
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  {konsultasi.map(row => (
    <tr key={row.id}>
      <td>{row.nama_user || '-'}</td> {/* Tampilkan nama user */}
      <td>{row.nama_pengacara || '-'}</td>
      <td>{new Date(row.start_time).toLocaleString('id-ID')}</td>
      <td>{row.duration}</td>
      <td>Rp{row.biaya?.toLocaleString() || '0'}</td>
      <td>{row.status}</td>
    </tr>
  ))}
</tbody>

    </table>
  </div>
)}

      </div>
    </AdminLayout>
  );
};

export default TransaksiPengacara;
