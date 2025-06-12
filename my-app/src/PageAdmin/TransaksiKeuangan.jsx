import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/TransaksiKeuangan.css";
// --- [PERUBAHAN GRAFIK MODERN] --- Import Doughnut dan Filler
import { Chart as ChartJS, LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

// --- [PERUBAHAN GRAFIK MODERN] ---
// 1. Plugin kustom untuk menampilkan teks di tengah Doughnut Chart
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
        if (chart.config.type !== 'doughnut') return;

        const ctx = chart.ctx;
        const { width, height } = chart;
        const centerX = width / 2;
        const centerY = height / 2;

        const dataPoints = chart.data.datasets[0].data;
        if (dataPoints.length === 0) return;

        // Ambil data pendapatan bersih (indeks 0)
        const netIncome = dataPoints[0] || 0;

        // Teks Atas (Label)
        ctx.font = "600 1rem 'Poppins', sans-serif";
        ctx.fillStyle = '#a3b1c2'; // var(--color-text-secondary)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Pendapatan Bersih', centerX, centerY - 20);
        
        // Teks Bawah (Nilai)
        ctx.font = "700 2.2rem 'Poppins', sans-serif";
        ctx.fillStyle = '#ecf0f1'; // var(--color-text-primary)
        ctx.fillText(`Rp${Number(netIncome).toLocaleString('id-ID')}`, centerX, centerY + 20);
    }
};

// 2. Registrasi ChartJS dengan semua elemen + plugin kustom
ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler, centerTextPlugin);

const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-card-content">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    </div>
);

const FilterControls = ({ searchValue, onSearchChange, sortField, onSortFieldChange, sortOrder, onSortOrderChange, onReset, sortOptions }) => (
    <div className="filter-controls">
        <input 
            type="text" 
            placeholder="Cari nama, pengacara, bank, atau no. rekening..." 
            value={searchValue} 
            onChange={onSearchChange} 
            className="filter-input" 
        />
        <div className="filter-group">
            <select value={sortField} onChange={onSortFieldChange} className="filter-select">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select value={sortOrder} onChange={onSortOrderChange} className="filter-select">
                <option value="desc">Terbaru / Terbesar</option>
                <option value="asc">Terlama / Terkecil</option>
            </select>
            <button onClick={onReset} className="btn-secondary">Reset</button>
        </div>
    </div>
);

const TransaksiKeuangan = () => {
    // State hooks (tidak ada perubahan)
    const [data, setData] = useState({});
    const [kasus, setKasus] = useState([]);
    const [konsultasi, setKonsultasi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);
    const [searchKasus, setSearchKasus] = useState("");
    const [sortKasusField, setSortKasusField] = useState("created_at");
    const [sortKasusOrder, setSortKasusOrder] = useState("desc");
    const [searchKonsultasi, setSearchKonsultasi] = useState("");
    const [sortKonsultasiField, setSortKonsultasiField] = useState("start_time");
    const [sortKonsultasiOrder, setSortKonsultasiOrder] = useState("desc");

    // Fungsi-fungsi (tidak ada perubahan)
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
            console.error("Error fetching data:", err);
            setError("Gagal mengambil data dari server. Silakan coba lagi nanti.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    const formatCurrency = (num) => `Rp${Number(num || 0).toLocaleString("id-ID")}`;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' });
    const sortData = (array, field, order, isDate = false) => {
        return [...array].sort((a, b) => {
            let valA = a?.[field]; let valB = b?.[field];
            if (isDate) { valA = new Date(valA); valB = new Date(valB); }
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
            if (valA < valB) return order === "asc" ? -1 : 1;
            if (valA > valB) return order === "asc" ? 1 : -1;
            return 0;
        });
    };
    const filteredKasus = useMemo(() => {
        let filtered = kasus.filter(item => {
            const searchTerm = searchKasus.toLowerCase();
            return item?.nama?.toLowerCase().includes(searchTerm) ||
                   item?.nama_pengacara?.toLowerCase().includes(searchTerm) ||
                   item?.nama_rekening?.toLowerCase().includes(searchTerm) ||
                   item?.no_rekening?.includes(searchTerm);
        });
        return sortData(filtered, sortKasusField, sortKasusOrder, sortKasusField === "created_at");
    }, [kasus, searchKasus, sortKasusField, sortKasusOrder]);
    const filteredKonsultasi = useMemo(() => {
        let filtered = konsultasi.filter(item => {
            const searchTerm = searchKonsultasi.toLowerCase();
            return item?.nama_user?.toLowerCase().includes(searchTerm) ||
                   item?.nama_pengacara?.toLowerCase().includes(searchTerm) ||
                   item?.nama_rekening?.toLowerCase().includes(searchTerm) ||
                   item?.no_rekening?.includes(searchTerm);
        });
        return sortData(filtered, sortKonsultasiField, sortKonsultasiOrder, sortKonsultasiField === "start_time");
    }, [konsultasi, searchKonsultasi, sortKonsultasiField, sortKonsultasiOrder]);
    const handleMarkTransfer = async (type, id) => {
        if (!window.confirm("Apakah Anda yakin ingin menandai pembayaran ini sudah ditransfer?")) return;
        setUpdating(id);
        const oldKasus = [...kasus];
        const oldKonsultasi = [...konsultasi];
        if (type === "kasus") {
            setKasus(prev => prev.map(item => item.id === id ? { ...item, is_transferred: true } : item));
        } else {
            setKonsultasi(prev => prev.map(item => item.id === id ? { ...item, is_transferred: true } : item));
        }
        try {
            await axios.put(`http://localhost:5000/api/transaksi/transfer/${type}/${id}`);
        } catch (err) {
            alert("Gagal memperbarui status transfer. Mengembalikan ke status semula.");
            console.error(err);
            if (type === 'kasus') setKasus(oldKasus);
            else setKonsultasi(oldKonsultasi);
        } finally {
            setUpdating(null);
        }
    };

    // --- [PERUBAHAN GRAFIK MODERN] ---
    // 3. Konfigurasi dan Data Grafik yang Diperbarui
    
    // Opsi untuk Line Chart
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: "bottom", labels: { color: "#a3b1c2", font: { size: 14 } } },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(44, 62, 80, 0.9)',
                titleColor: '#f39c12',
                bodyColor: '#ecf0f1',
                borderColor: '#3d566e',
                borderWidth: 1,
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                displayColors: true,
                boxPadding: 4,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: "#a3b1c2", callback: (value) => `Rp${(value/1000000)}jt` },
                grid: { color: "#3d566e", borderDash: [5, 5] } // Garis putus-putus
            },
            x: {
                ticks: { color: "#a3b1c2" },
                grid: { display: false }
            }
        }
    };

    // Opsi untuk Doughnut Chart
    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%', // Ini yang membuat lubang di tengah
        plugins: {
            legend: {
                display: false // Sembunyikan legenda karena info sudah cukup jelas
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label || ''}: ${formatCurrency(context.raw || 0)}`;
                    }
                }
            }
        }
    };
    
    // Data untuk Line Chart dengan gradient
    const lineChartData = useMemo(() => {
        const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
        const monthlyData = Array(12).fill(0).map(() => ({ revenue: 0, expense: 0 }));
        kasus.forEach(item => {
            const month = new Date(item.created_at).getMonth();
            monthlyData[month].revenue += Number(item.biaya_min || 0);
            monthlyData[month].expense += Number(item.biaya_pengacara || 0);
        });
        konsultasi.forEach(item => {
            const month = new Date(item.start_time).getMonth();
            monthlyData[month].revenue += Number(item.biaya || 0);
            monthlyData[month].expense += Number(item.biaya_pengacara || 0);
        });
        return {
            labels,
            datasets: [
                {
                    label: "Pendapatan",
                    data: monthlyData.map(d => d.revenue),
                    borderColor: "#27ae60",
                    borderWidth: 3,
                    fill: true,
                    // Fungsi untuk membuat background gradient
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(39, 174, 96, 0.4)');
                        gradient.addColorStop(1, 'rgba(39, 174, 96, 0)');
                        return gradient;
                    },
                    tension: 0.4,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#27ae60",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: "Pengeluaran",
                    data: monthlyData.map(d => d.expense),
                    borderColor: "#c0392b",
                    borderWidth: 3,
                    fill: true,
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, 'rgba(192, 57, 43, 0.4)');
                        gradient.addColorStop(1, 'rgba(192, 57, 43, 0)');
                        return gradient;
                    },
                    tension: 0.4,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#c0392b",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        };
    }, [kasus, konsultasi]);
    
    // Data untuk Doughnut Chart
    const doughnutChartData = {
        labels: ["Pendapatan Bersih", "Pengeluaran"],
        datasets: [{
            data: [data?.pendapatan_bersih || 0, data?.total_pengeluaran || 0],
            backgroundColor: ['#27ae60', '#c0392b'],
            borderColor: '#2c3e50',
            borderWidth: 8,
            hoverOffset: 20,
            hoverBorderColor: '#f39c12',
        }],
    };

    if (loading) return <AdminLayout><div className="loading-state">Memuat data keuangan...</div></AdminLayout>;
    if (error) return <AdminLayout><div className="error-state">{error}</div></AdminLayout>;
    
    return (
        <AdminLayout>
            <div className="transaksi-keuangan-page"> 
                <div className="page-header">
                    <h1>Analisis & Transaksi Keuangan</h1>
                    <p>Pantau semua aliran pendapatan dan pengeluaran dari platform Cerdas Hukum.</p>
                </div>

                <section className="stats-grid">
                    <StatCard title="Total Pendapatan Kotor" value={formatCurrency(data?.total_kotor)} icon="💰" />
                    <StatCard title="Pendapatan Bersih Platform" value={formatCurrency(data?.pendapatan_bersih)} icon="💵" />
                    <StatCard title="Total Pengeluaran (Untuk Pengacara)" value={formatCurrency(data?.total_pengeluaran)} icon="💸" />
                </section>
                
                <section className="section-pair">
                    <div className="dashboard-section chart-container">
                        <div className="section-header"><h2>Visualisasi Pendapatan vs Pengeluaran</h2></div>
                        <Line options={lineChartOptions} data={lineChartData} />
                    </div>
                    <div className="dashboard-section chart-container">
                        <div className="section-header"><h2>Komposisi Keuangan</h2></div>
                        {/* --- [PERUBAHAN GRAFIK MODERN] --- Gunakan Doughnut Chart */}
                        <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header"><h2>🧾 Transaksi Ajukan Kasus</h2></div>
                    <div className="stats-grid">
                        <StatCard title="Pendapatan Kotor Kasus" value={formatCurrency(data?.total_kasus_kotor)} icon="📈" />
                        <StatCard title="Pendapatan Bersih Kasus" value={formatCurrency(data?.pendapatan_bersih_kasus)} icon="✅" />
                        <StatCard title="Pengeluaran Kasus" value={formatCurrency(data?.pengeluaran_kasus)} icon="📉" />
                    </div>
                    <FilterControls
                        searchValue={searchKasus} onSearchChange={e => setSearchKasus(e.target.value)}
                        sortField={sortKasusField} onSortFieldChange={e => setSortKasusField(e.target.value)}
                        sortOrder={sortKasusOrder} onSortOrderChange={e => setSortKasusOrder(e.target.value)}
                        onReset={() => { setSearchKasus(""); setSortKasusField("created_at"); setSortKasusOrder("desc"); }}
                        sortOptions={[{ value: "created_at", label: "Waktu Transaksi" }, { value: "biaya_min", label: "Total Biaya" }]}
                    />
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nama Klien</th><th>Biaya</th><th>Biaya Pengacara</th>
                                    <th>Pengacara</th><th>Nama Rekening</th><th>No Rekening</th>
                                    <th>Status</th><th>Tanggal</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKasus.length > 0 ? filteredKasus.map(row => (
                                    <tr key={row.id}>
                                        <td data-label="Nama Klien">{row.nama || "-"}</td>
                                        <td data-label="Biaya">{formatCurrency(row.biaya_min)}</td>
                                        <td data-label="Biaya Pengacara">{formatCurrency(row.biaya_pengacara)}</td>
                                        <td data-label="Pengacara">{row.nama_pengacara || "-"}</td>
                                        <td data-label="Nama Rekening">{row.nama_rekening || "-"}</td>
                                        <td data-label="No Rekening">{row.no_rekening || "-"}</td>
                                        <td data-label="Status">{row.status || "-"}</td>
                                        <td data-label="Tanggal">{formatDate(row.created_at)}</td>
                                        <td data-label="Aksi">
                                            {row.is_transferred ? (
                                                <span className="status-badge selesai">Sudah Ditransfer</span>
                                            ) : (
                                                <button className="btn-action" disabled={updating === row.id} onClick={() => handleMarkTransfer("kasus", row.id)}>
                                                    {updating === row.id ? 'Memproses...' : 'Tandai Transfer'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="9" className="no-data">Tidak ada data transaksi ditemukan.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header"><h2>💬 Transaksi Konsultasi</h2></div>
                     <div className="stats-grid">
                        <StatCard title="Pendapatan Kotor Konsultasi" value={formatCurrency(data?.total_konsultasi_kotor)} icon="📈" />
                        <StatCard title="Pendapatan Bersih Konsultasi" value={formatCurrency(data?.pendapatan_bersih_konsultasi)} icon="✅" />
                        <StatCard title="Pengeluaran Konsultasi" value={formatCurrency(data?.pengeluaran_konsultasi)} icon="📉" />
                    </div>
                    <FilterControls
                        searchValue={searchKonsultasi} onSearchChange={e => setSearchKonsultasi(e.target.value)}
                        sortField={sortKonsultasiField} onSortFieldChange={e => setSortKonsultasiField(e.target.value)}
                        sortOrder={sortKonsultasiOrder} onSortOrderChange={e => setSortKonsultasiOrder(e.target.value)}
                        onReset={() => { setSearchKonsultasi(""); setSortKonsultasiField("start_time"); setSortKonsultasiOrder("desc"); }}
                        sortOptions={[{ value: "start_time", label: "Waktu Konsultasi" }, { value: "biaya", label: "Total Biaya" }]}
                    />
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nama User</th><th>Nama Pengacara</th><th>Waktu Mulai</th>
                                    <th>Durasi (menit)</th><th>Biaya</th><th>Biaya Pengacara</th>
                                    <th>Nama Rekening</th><th>No Rekening</th><th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKonsultasi.length > 0 ? filteredKonsultasi.map(row => (
                                    <tr key={row.id}>
                                        <td data-label="Nama User">{row.nama_user || "-"}</td>
                                        <td data-label="Nama Pengacara">{row.nama_pengacara || "-"}</td>
                                        <td data-label="Waktu Mulai">{formatDateTime(row.start_time)}</td>
                                        <td data-label="Durasi (menit)">{row.duration}</td>
                                        <td data-label="Biaya">{formatCurrency(row.biaya)}</td>
                                        <td data-label="Biaya Pengacara">{formatCurrency(row.biaya_pengacara)}</td>
                                        <td data-label="Nama Rekening">{row.nama_rekening || "-"}</td>
                                        <td data-label="No Rekening">{row.no_rekening || "-"}</td>
                                        <td data-label="Status">{row.status || "-"}</td>
                                        <td data-label="Aksi">
                                            {row.is_transferred ? (
                                                <span className="status-badge selesai">Sudah Ditransfer</span>
                                            ) : (
                                                <button className="btn-action" disabled={updating === row.id} onClick={() => handleMarkTransfer("konsultasi", row.id)}>
                                                    {updating === row.id ? 'Memproses...' : 'Tandai Transfer'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan="10" className="no-data">Tidak ada data transaksi ditemukan.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
};

export default TransaksiKeuangan;