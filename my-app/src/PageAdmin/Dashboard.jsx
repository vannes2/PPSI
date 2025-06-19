// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS_Admin/Dashboard.css";
import AdminLayout from "../components/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from "recharts";

const API_BASE_URL = "http://localhost:5000";

/* ---------- Tooltip kustom (tanpa background, teks putih) ---------- */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">value : {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  /* --------------------- STATE --------------------- */
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

  /* interaksi chart */
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [activePieIndex, setActivePieIndex] = useState(null);

  const navigate = useNavigate();

  /* ------------------- FETCH -------------------- */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoints = {
          users: `${API_BASE_URL}/api/simple-users`,
          lawyers: `${API_BASE_URL}/api/pengacara`,
          cases: `${API_BASE_URL}/api/kasus`,
          consultations: `${API_BASE_URL}/api/konsultasi`,
          financial: `${API_BASE_URL}/api/transaksi-keuangan/total`,
        };

        const requests = Object.values(endpoints).map((url) => axios.get(url, { signal: controller.signal }).catch(() => ({ data: null })));

        const [usersRes, lawyersRes, casesRes, consultationsRes, financialRes] = await Promise.all(requests);

        const users = usersRes.data || [];
        const lawyers = lawyersRes.data || [];
        const cases = casesRes.data || [];
        const financial = financialRes.data || {
          total_kotor: 0,
          pendapatan_bersih: 0,
          total_pengeluaran: 0,
        };
        const consultationList = consultationsRes.data ? consultationsRes.data.data : [];
        const totalConsultations = consultationsRes.data ? consultationsRes.data.total : 0;

        setStats({
          totalUsers: users.length,
          totalLawyers: lawyers.length,
          totalCases: cases.length,
          totalConsultations,
          totalRevenue: financial.total_kotor,
          pendingCases: cases.filter((c) => c.status?.toLowerCase() === "menunggu").length,
          activeConsultations: consultationList.filter((c) => c.status?.toLowerCase() === "aktif").length,
        });

        setRecentData({
          cases: cases.slice(-5).reverse(),
          consultations: consultationList.slice(-5).reverse(),
          lawyers: lawyers.slice(-5).reverse(),
          users: users.slice(-5).reverse(),
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

  /* ------------------- UTIL ------------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
  };

  /* ------------------- DATA DISPLAY ------------------- */
  const statItems = [
    { title: "Total Pengguna", value: stats.totalUsers, icon: "👥" },
    { title: "Total Pengacara", value: stats.totalLawyers, icon: "👨‍⚖️" },
    { title: "Total Kasus", value: stats.totalCases, icon: "📋" },
    { title: "Total Konsultasi", value: stats.totalConsultations, icon: "💬" },
    {
      title: "Pendapatan Total",
      value: `Rp ${stats.totalRevenue?.toLocaleString("id-ID") || 0}`,
      icon: "💰",
    },
    { title: "Kasus Menunggu", value: stats.pendingCases, icon: "⏳" },
  ];

  /* ------------------- TABEL CONFIG ------------------- */
  const tableSections = [
    {
      title: "Kasus Terbaru",
      data: recentData.cases,
      columns: ["ID Kasus", "Nama Kasus", "Status", "Tanggal"],
      renderRow: (k) => [`#${k.id}`, k.nama || "Tanpa Nama", <span className={`status-badge ${k.status?.toLowerCase()}`}>{k.status || "N/A"}</span>, formatDate(k.created_at)],
      path: "/admin/kasus",
    },
    {
      title: "Konsultasi Terbaru",
      data: recentData.consultations,
      columns: ["ID", "Pengguna", "Pengacara", "Status", "Tanggal"],
      renderRow: (k) => [
        `#${k.id}`,
        k.nama_user || `User #${k.user_id || "N/A"}`,
        k.nama_pengacara || `Pengacara #${k.pengacara_id || "N/A"}`,
        <span className={`status-badge ${k.status?.toLowerCase()}`}>{k.status || "N/A"}</span>,
        formatDate(k.start_time),
      ],
      path: "/TransaksiKeuangan",
    },
    {
      title: "Pengacara Terbaru",
      data: recentData.lawyers,
      columns: ["ID", "Nama", "Spesialisasi", "Status"],
      renderRow: (p) => [`#${p.id}`, p.nama || "Tanpa Nama", p.spesialisasi || "-", <span className={`status-badge ${p.status?.toLowerCase() || "aktif"}`}>{p.status || "Aktif"}</span>],
      path: "/HomeAdmin",
    },
    {
      title: "Pengguna Terbaru",
      data: recentData.users,
      columns: ["ID", "Nama", "Email", "Telepon"],
      renderRow: (u) => [`#${u.id}`, u.name || u.nama || "-", u.email || "-", u.phone || u.no_hp || "-"],
      path: "/UserManagement",
    },
  ];

  /* ------------------- RENDER TABEL ------------------- */
  const renderTableSection = (section, key) => (
    <section className="dashboard-section" key={key}>
      <div className="section-header">
        <h2>{section.title}</h2>
        <button className="button" onClick={() => navigate(section.path)}>
          Lihat Semua
        </button>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {section.columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.data.length > 0 ? (
              section.data.map((item, i) => (
                <tr key={item.id || i} onClick={() => navigate(`${section.path}/${item.id}`)}>
                  {section.renderRow(item).map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
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
  );

  /* ------------------- CUSTOM BAR ------------------- */
  const renderCustomBar = (props) => {
    const { x, y, width, height, index, fill } = props;
    const isHovered = index === hoveredBarIndex;
    const isSelected = index === selectedBarIndex;

    const extraHeight = isSelected ? 20 : isHovered ? 10 : 0;
    const barHeight = height + extraHeight;
    const barY = y - extraHeight;

    const handleClick = () => {
      setSelectedBarIndex((prev) => (prev === index ? null : index));
    };

    return (
      <g onClick={handleClick}>
        <rect
          x={x}
          y={barY}
          width={width}
          height={barHeight}
          rx={6}
          ry={6}
          fill={fill}
          stroke={isSelected ? "#ff4d4d" : "none"}
          strokeWidth={isSelected ? 3 : 0}
          style={{
            filter: isSelected ? "drop-shadow(0 0 6px #ff4d4d)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease-out",
          }}
        />
      </g>
    );
  };

  /* ------------------- PIE COLORS ------------------- */
  const pieColors = ["#e74c3c", "#2ecc71"];

  /* ------------------- RENDER ------------------- */
  return (
    <AdminLayout>
      <main className="main-content dashboard-page">
        {loading ? (
          <div className="loading-spinner">
            <p>Memuat data dashboard...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="button button-primary">
              Coba Lagi
            </button>
          </div>
        ) : (
          <>
            {/* ---------- HEADER ---------- */}
            <div className="dashboard-header">
              <h1>Dashboard Admin</h1>
              <p>Ringkasan aktivitas dan statistik platform Cerdas Hukum.</p>
            </div>

            {/* ---------- STATISTIK & CHART ---------- */}
            <section className="dashboard-section">
              <h2>Statistik Platform</h2>
              <div className="charts-grid" style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {/* ---------- BAR CHART ---------- */}
                <div className="chart-card" style={{ flex: "1 1 500px" }}>
                  <h3>Perbandingan Total</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        { name: "Pengguna", value: stats.totalUsers },
                        { name: "Pengacara", value: stats.totalLawyers },
                        { name: "Kasus", value: stats.totalCases },
                        { name: "Konsultasi", value: stats.totalConsultations },
                      ]}
                    >
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                      <Bar dataKey="value" barSize={100} shape={renderCustomBar} radius={[6, 6, 0, 0]} onMouseOver={(_, i) => setHoveredBarIndex(i)} onMouseOut={() => setHoveredBarIndex(null)}>
                        {[stats.totalUsers, stats.totalLawyers, stats.totalCases, stats.totalConsultations].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#e74c3c" : "#27ae60"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ---------- PIE CHART ---------- */}
                <div className="chart-card" style={{ position: "relative", flex: "1 1 500px" }}>
                  <h3>Distribusi Status Kasus</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart width={320} height={320}>
                      <Pie
                        data={[
                          { name: "Menunggu", value: stats.pendingCases },
                          { name: "Selesai", value: stats.totalCases - stats.pendingCases },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95} // naik dari 80
                        innerRadius={60} // naik dari 50
                        label
                        activeIndex={activePieIndex}
                        activeShape={(props) => <Sector {...props} outerRadius={props.outerRadius + 6} />}
                        onMouseEnter={(_, i) => setActivePieIndex(i)}
                        onMouseLeave={() => setActivePieIndex(null)}
                      >
                        {pieColors.map((c, i) => (
                          <Cell key={i} fill={c} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* angka total di tengah */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "var(--color-text-primary)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Total Kasus</div>
                    <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{stats.totalCases}</div>
                  </div>
                </div>
              </div>

              {/* ---------- STAT CARDS ---------- */}
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
                  {statItems.slice(3).map((item, idx) => (
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

            {/* ---------- DATA KEUANGAN ---------- */}
            <section className="dashboard-section">
              <h2>Data Keuangan</h2>
              <div className="financial-summary">
                <div className="financial-card">
                  <h3>Pendapatan Kotor</h3>
                  <p>Rp {financialData.total_kotor?.toLocaleString("id-ID") || 0}</p>
                </div>
                <div className="financial-card">
                  <h3>Pendapatan Bersih</h3>
                  <p>Rp {financialData.pendapatan_bersih?.toLocaleString("id-ID") || 0}</p>
                </div>
                <div className="financial-card">
                  <h3>Total Pengeluaran</h3>
                  <p>Rp {financialData.total_pengeluaran?.toLocaleString("id-ID") || 0}</p>
                </div>
              </div>
            </section>

            {/* ---------- TABEL ---------- */}
            <div className="section-pair">
              {tableSections[0] && renderTableSection(tableSections[0], 0)}
              {tableSections[1] && renderTableSection(tableSections[1], 1)}
            </div>
            <div className="section-pair">
              {tableSections[2] && renderTableSection(tableSections[2], 2)}
              {tableSections[3] && renderTableSection(tableSections[3], 3)}
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
}

export default Dashboard;
