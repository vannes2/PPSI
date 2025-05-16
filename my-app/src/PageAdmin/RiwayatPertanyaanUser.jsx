import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../CSS_Admin/RiwayatPertanyaanUser.css";

const RiwayatPertanyaanUser = () => {
  const [logData, setLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/log-pertanyaan");
      setLogData(res.data);
    } catch (err) {
      console.error("Gagal memuat log pertanyaan:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    return date.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="log-container" style={{ display: "flex" }}>
        <main style={{ flex: 1, padding: "20px" }}>
          <h2>Riwayat Pertanyaan Pengguna</h2>

          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <table className="log-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Pertanyaan</th>
                  <th>Intent</th>
                  <th>Confidence</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {logData.length > 0 ? (
                  logData.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.user_id ?? "-"}</td>
                      <td>{log.pertanyaan}</td>
                      <td>{log.intent_didapat || "-"}</td>
                      <td>{log.confidence_score ?? "-"}</td>
                      <td>{formatDate(log.waktu)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Tidak ada data riwayat pertanyaan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </AdminLayout>
  );
};

export default RiwayatPertanyaanUser;
