import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../CSS_Admin/Dashboard.css';
import AdminLayout from "../components/AdminLayout";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalCases: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    pendingCases: 0,
    activeConsultations: 0
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [recentLawyers, setRecentLawyers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [financialData, setFinancialData] = useState({
    total_kotor: 0,
    pendapatan_bersih: 0,
    total_pengeluaran: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil semua data secara paralel dengan penanganan error individual
        // URL disesuaikan dengan prefix '/api/' agar sesuai dengan struktur backend Anda
        const [
          usersRes,
          lawyersRes,
          casesRes,
          consultationsRes, // Catatan: Anda perlu memastikan endpoint ini ada di backend Anda
          financialRes,
        ] = await Promise.all([
          // Mengambil data pengguna dari /api/auth/users
          axios.get('http://localhost:5000/api/auth/users').catch(err => {
            console.error("Error mengambil data pengguna:", err);
            return { data: [] }; // Kembalikan array kosong jika terjadi error
          }),
          // Mengambil data pengacara dari /api/pengacara
          axios.get('http://localhost:5000/api/pengacara').catch(err => {
            console.error("Error mengambil data pengacara:", err);
            return { data: [] };
          }),
          // Mengambil data kasus dari /api/kasus
          axios.get('http://localhost:5000/api/kasus').catch(err => {
            console.error("Error mengambil data kasus:", err);
            return { data: [] };
          }),
          // Mengambil data sesi konsultasi dari /api/konsultasi_session
          // *** PENTING: Pastikan Anda telah membuat endpoint ini di backend Anda ***
          axios.get('http://localhost:5000/api/konsultasi_session').catch(err => {
            console.error("Error mengambil data konsultasi:", err);
            return { data: [] };
          }),
          // Mengambil data total keuangan dari /api/transaksi-keuangan/total
          axios.get('http://localhost:5000/api/transaksi-keuangan/total').catch(err => {
            console.error("Error mengambil data keuangan:", err);
            return { data: { total_kotor: 0, pendapatan_bersih: 0, total_pengeluaran: 0 } };
          }),
        ]);

        // Destrukturisasi data dengan nilai default (array kosong/objek default)
        const users = usersRes.data || [];
        const lawyers = lawyersRes.data || [];
        const cases = casesRes.data || [];
        const consultations = consultationsRes.data || [];
        const financial = financialRes.data || { total_kotor: 0, pendapatan_bersih: 0, total_pengeluaran: 0 };

        // Menghitung statistik
        const pendingCases = cases.filter(c => c.status === 'Menunggu').length;
        const activeConsultations = consultations.filter(c => c.status === 'aktif').length;
        const totalRevenue = financial.total_kotor || 0; // Menggunakan data keuangan untuk total pendapatan

        setStats({
          totalUsers: users.length,
          totalLawyers: lawyers.length,
          totalCases: cases.length,
          totalConsultations: consultations.length,
          totalRevenue,
          pendingCases,
          activeConsultations
        });

        // Menetapkan data terbaru (5 item terakhir)
        setRecentCases(cases.slice(0, 5));
        setRecentConsultations(consultations.slice(0, 5));
        setRecentLawyers(lawyers.slice(0, 5));
        setRecentUsers(users.slice(0, 5));
        setFinancialData(financial);

      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        setError("Gagal memuat data dashboard. Pastikan server berjalan dan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi pembantu untuk memformat tanggal secara konsisten
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      // Pastikan tanggal valid sebelum diformat
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('id-ID'); // Format tanggal untuk lokal Indonesia
    } catch (e) {
      console.error("Error memformat tanggal:", dateString, e);
      return '-';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">
          <p>Memuat data dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="button button-primary">
            Coba Lagi
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard Admin</h1>
          <p>Ringkasan aktivitas dan statistik platform</p>
        </div>

        {/* Statistik Utama */}
        <section className="dashboard-section">
          <h2>Statistik Platform</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Pengguna</h3>
              <p>{stats.totalUsers}</p>
              <span className="stat-icon">👥</span>
            </div>
            <div className="stat-card">
              <h3>Total Pengacara</h3>
              <p>{stats.totalLawyers}</p>
              <span className="stat-icon">👨‍⚖️</span>
            </div>
            <div className="stat-card">
              <h3>Total Kasus</h3>
              <p>{stats.totalCases}</p>
              <span className="stat-icon">📋</span>
            </div>
            <div className="stat-card">
              <h3>Total Konsultasi</h3>
              <p>{stats.totalConsultations}</p>
              <span className="stat-icon">💬</span>
            </div>
            <div className="stat-card">
              <h3>Pendapatan Total</h3>
              <p>Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
              <span className="stat-icon">💰</span>
            </div>
            <div className="stat-card">
              <h3>Kasus Menunggu</h3>
              <p>{stats.pendingCases}</p>
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-card">
              <h3>Konsultasi Aktif</h3>
              <p>{stats.activeConsultations}</p>
              <span className="stat-icon">📞</span>
            </div>
          </div>
        </section>

        {/* Data Keuangan */}
        <section className="dashboard-section">
          <h2>Data Keuangan</h2>
          <div className="financial-summary">
            <div className="financial-card">
              <h3>Pendapatan Kotor</h3>
              <p>Rp {financialData.total_kotor?.toLocaleString('id-ID') || 0}</p>
            </div>
            <div className="financial-card">
              <h3>Pendapatan Bersih</h3>
              <p>Rp {financialData.pendapatan_bersih?.toLocaleString('id-ID') || 0}</p>
            </div>
            <div className="financial-card">
              <h3>Total Pengeluaran</h3>
              <p>Rp {financialData.total_pengeluaran?.toLocaleString('id-ID') || 0}</p>
            </div>
          </div>
        </section>

        {/* Kasus Terbaru */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Kasus Terbaru</h2>
            <button
              className="button button-primary"
              onClick={() => navigate('/admin/kasus')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Kasus</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.length > 0 ? (
                  recentCases.map((kasus) => (
                    <tr key={kasus.id} onClick={() => navigate(`/admin/kasus/${kasus.id}`)}>
                      <td>#{kasus.id}</td>
                      <td>{kasus.nama || 'Tanpa Nama'}</td>
                      <td>
                        <span className={`status-badge ${kasus.status?.toLowerCase() || 'unknown'}`}>
                          {kasus.status || 'Unknown'}
                        </span>
                      </td>
                      <td>{formatDate(kasus.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">Tidak ada data kasus terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Konsultasi Terbaru */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Konsultasi Terbaru</h2>
            <button
              className="button button-primary"
              onClick={() => navigate('/admin/konsultasi')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pengguna</th>
                  <th>Pengacara</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentConsultations.length > 0 ? (
                  recentConsultations.map((konsultasi) => (
                    <tr key={konsultasi.id} onClick={() => navigate(`/admin/konsultasi/${konsultasi.id}`)}>
                      <td>#{konsultasi.id}</td>
                      <td>User #{konsultasi.user_id || 'N/A'}</td>
                      <td>Pengacara #{konsultasi.pengacara_id || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${konsultasi.status?.toLowerCase() || 'unknown'}`}>
                          {konsultasi.status || 'Unknown'}
                        </span>
                      </td>
                      <td>{formatDate(konsultasi.start_time)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">Tidak ada data konsultasi terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pengacara Terbaru */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Pengacara Terbaru</h2>
            <button
              className="button button-primary"
              onClick={() => navigate('/admin/pengacara')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Spesialisasi</th>
                  <th>Pengalaman</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLawyers.length > 0 ? (
                  recentLawyers.map((pengacara) => (
                    <tr key={pengacara.id} onClick={() => navigate(`/admin/pengacara/${pengacara.id}`)}>
                      <td>#{pengacara.id}</td>
                      <td>{pengacara.nama || 'Tanpa Nama'}</td>
                      <td>{pengacara.spesialisasi || '-'}</td>
                      <td>{pengacara.pengalaman ? `${pengacara.pengalaman} tahun` : '-'}</td>
                      <td>
                        {/* Asumsi semua pengacara terbaru yang terdaftar adalah aktif atau Anda memiliki bidang status lain */}
                        <span className="status-badge active">Aktif</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">Tidak ada data pengacara terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pengguna Terbaru */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Pengguna Terbaru</h2>
            <button
              className="button button-primary"
              onClick={() => navigate('/admin/pengguna')}
            >
              Lihat Semua
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Telepon</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user.id} onClick={() => navigate(`/admin/pengguna/${user.id}`)}>
                      <td>#{user.id}</td>
                      <td>{user.name || user.nama || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.phone || user.no_hp || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">Tidak ada data pengguna terbaru</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

export default Dashboard;