import { useEffect, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin";
import "../CSS_Admin/TransaksiKeuangan.css";

const TransaksiKeuangan = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transaksiKeuangan");

  useEffect(() => {
    axios.get("http://localhost:5000/api/transaksi-keuangan/total")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error(err);
        setError("Gagal mengambil data keuangan");
      })
      .finally(() => setLoading(false));
  }, []);

  const format = (num) => `Rp${Number(num || 0).toLocaleString("id-ID")}`;

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
            {/* === AJUKAN KASUS === */}
            <section className="keuangan-summary">
              <h3>🧾 Pendapatan dari Ajukan Kasus</h3>
              <div className="summary-row">
                <div className="summary-box box-kotor">
                  <h4>Pendapatan Kotor</h4>
                  <p>{format(data.total_kasus_kotor)}</p>
                </div>
                <div className="summary-box box-bersih">
                  <h4>Pendapatan Bersih (20%)</h4>
                  <p>{format(data.pendapatan_bersih_kasus)}</p>
                </div>
                <div className="summary-box box-pengeluaran">
                  <h4>Pengeluaran (80%)</h4>
                  <p>{format(data.pengeluaran_kasus)}</p>
                </div>
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
                  <h4>Pendapatan Bersih (20%)</h4>
                  <p>{format(data.pendapatan_bersih_konsultasi)}</p>
                </div>
                <div className="summary-box box-pengeluaran">
                  <h4>Pengeluaran (80%)</h4>
                  <p>{format(data.pengeluaran_konsultasi)}</p>
                </div>
              </div>
            </section>

            {/* === TOTAL === */}
            <section className="keuangan-summary">
              <h3>📊 Total Keseluruhan</h3>
              <div className="summary-row">
                <div className="summary-box box-total">
                  <h4>Total Kotor</h4>
                  <p>{format(data.total_kotor)}</p>
                </div>
                <div className="summary-box box-total">
                  <h4>Total Bersih (20%)</h4>
                  <p>{format(data.pendapatan_bersih)}</p>
                </div>
                <div className="summary-box box-total">
                  <h4>Total Pengeluaran (80%)</h4>
                  <p>{format(data.total_pengeluaran)}</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default TransaksiKeuangan;
