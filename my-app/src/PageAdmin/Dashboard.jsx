import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../CSS_Admin/Dashboard.css';
import AdminLayout from "../components/AdminLayout";

const API_BASE_URL = 'http://localhost:5000';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [recentData, setRecentData] = useState({
    cases: [],
    consultations: [],
    lawyers: [],
    users: [],
  });
  const [financialData, setFinancialData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoints = {
          users: `${API_BASE_URL}/api/auth/users`,
          lawyers: `${API_BASE_URL}/api/pengacara`,
          cases: `${API_BASE_URL}/api/kasus`,
          consultations: `${API_BASE_URL}/api/konsultasi_session`,
          financial: `${API_BASE_URL}/api/transaksi-keuangan/total`,
        };

        const requests = Object.values(endpoints).map(url =>
          axios.get(url, { signal: controller.signal }).catch(() => ({ data: null }))
        );

        const [usersRes, lawyersRes, casesRes, consultationsRes, financialRes] = await Promise.all(requests);

        const users = usersRes.data || [];
        const lawyers = lawyersRes.data || [];
        const cases = casesRes.data || [];
        const consultations = consultationsRes.data || [];
        const financial = financialRes.data || { total_kotor: 0, pendapatan_bersih: 0, total_pengeluaran: 0 };

        setStats({
          totalUsers: users.length,
          totalLawyers: lawyers.length,
          totalCases: cases.length,
          totalConsultations: consultations.length,
          totalRevenue: financial.total_kotor || 0,
          pendingCases: cases.filter(c => c.status?.toLowerCase() === 'menunggu').length,
          activeConsultations: consultations.filter(c => c.status?.toLowerCase() === 'aktif').length,
        });

        setRecentData({
          cases: [...cases].slice(-5).reverse(),
          consultations: [...consultations].slice(-5).reverse(),
          lawyers: [...lawyers].slice(-5).reverse(),
          users: [...users].slice(-5).reverse(),
        });

        setFinancialData(financial);

      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Gagal memuat data dashboard. Pastikan server berjalan dan coba lagi.");
          console.error("Dashboard fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Semua statistik disimpan di sini, 6 item
  const statItems = [
    { title: "Total Pengguna", value: stats.totalUsers, icon: "👥" },
    { title: "Total Pengacara", value: stats.totalLawyers, icon: "👨‍⚖️" },
    { title: "Total Kasus", value: stats.totalCases, icon: "📋" },
    { title: "Total Konsultasi", value: stats.totalConsultations, icon: "💬" },
    { title: "Pendapatan Total", value: `Rp ${stats.totalRevenue?.toLocaleString('id-ID') || 0}`, icon: "💰" },
    { title: "Kasus Menunggu", value: stats.pendingCases, icon: "⏳" },
  ];

  const tableSections = [
    {
      title: "Kasus Terbaru",
      data: recentData.cases,
      columns: ["ID Kasus", "Nama Kasus", "Status", "Tanggal Dibuat"],
      renderRow: (k) => [
        `#${k.id}`,
        k.nama || "Tanpa Nama",
        <span className={`status-badge ${k.status?.toLowerCase()}`}>{k.status || 'N/A'}</span>,
        formatDate(k.created_at)
      ],
      path: "/admin/kasus"
    },
    {
      title: "Konsultasi Terbaru",
      data: recentData.consultations,
      columns: ["ID", "Pengguna", "Pengacara", "Status", "Tanggal"],
      renderRow: (k) => [
        `#${k.id}`,
        k.nama_user || `User #${k.user_id || 'N/A'}`,
        k.nama_pengacara || `Pengacara #${k.pengacara_id || 'N/A'}`,
        <span className={`status-badge ${k.status?.toLowerCase()}`}>{k.status || 'N/A'}</span>,
        formatDate(k.start_time)
      ],
      path: "/admin/konsultasi"
    },
    {
      title: "Pengacara Terbaru",
      data: recentData.lawyers,
      columns: ["ID", "Nama", "Spesialisasi", "Pengalaman", "Status"],
      renderRow: (p) => [
        `#${p.id}`,
        p.nama || "Tanpa Nama",
        p.spesialisasi || '-',
        p.pengalaman ? `${p.pengalaman} tahun` : '-',
        <span className={`status-badge ${p.status?.toLowerCase() || 'active'}`}>{p.status || 'Aktif'}</span>
      ],
      path: "/admin/pengacara"
    },
    {
      title: "Pengguna Terbaru",
      data: recentData.users,
      columns: ["ID", "Nama", "Email", "Telepon"],
      renderRow: (u) => [
        `#${u.id}`,
        u.name || u.nama || '-',
        u.email || '-',
        u.phone || u.no_hp || '-'
      ],
      path: "/admin/pengguna"
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner"><p>Memuat data dashboard...</p></div>
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
          <p>Ringkasan aktivitas dan statistik platform Cerdas Hukum.</p>
        </div>

        <section className="dashboard-section">
          <h2>Statistik Platform</h2>
          <div className="stats-grid-wrapper">
            <div className="stats-grid">
              {statItems.slice(0, 3).map((item, idx) => (
                <div className="stat-card" key={idx}>
                  <span className="stat-icon">{item.icon}</span>
                  <div className="stat-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.value ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="stats-grid">
              {statItems.slice(3, 6).map((item, idx) => (
                <div className="stat-card" key={idx + 3}>
                  <span className="stat-icon">{item.icon}</span>
                  <div className="stat-card-content">
                    <h3>{item.title}</h3>
                    <p>{item.value ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {tableSections.map((section, idx) => (
          <section className="dashboard-section" key={idx}>
            <div className="section-header">
              <h2>{section.title}</h2>
              <button className="button button-primary" onClick={() => navigate(section.path)}>
                Lihat Semua
              </button>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>{section.columns.map((col, i) => <th key={i}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {section.data.length > 0 ? (
                    section.data.map((item, i) => (
                      <tr key={item.id || i} onClick={() => navigate(`${section.path}/${item.id}`)}>
                        {section.renderRow(item).map((cell, j) => <td key={j}>{cell}</td>)}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={section.columns.length} className="no-data">
                        Tidak ada data terbaru
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </main>
    </AdminLayout>
  );
}

export default Dashboard;
