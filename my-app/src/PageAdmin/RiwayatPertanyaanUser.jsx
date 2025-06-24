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
            const res = await axios.get("https://ppsi-production.up.railway.app/api/log-pertanyaan");
            // Mengurutkan data dari yang terbaru
            const sortedData = res.data.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
            setLogData(sortedData);
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
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date)) return "-";
        // Format yang lebih mudah dibaca
        return date.toLocaleString("id-ID", {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    // Komponen untuk menampilkan confidence bar
    const ConfidenceVisual = ({ score }) => {
        if (score === null || score === undefined) return "-";

        const percentage = Math.round(score * 100);
        let confidenceClass = 'low';
        if (percentage >= 80) {
            confidenceClass = 'high';
        } else if (percentage >= 50) {
            confidenceClass = 'medium';
        }

        return (
            <div className="confidence-bar-wrapper">
                <div 
                    className={`confidence-bar ${confidenceClass}`}
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="confidence-text">{percentage}%</span>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="riwayat-pertanyaan-container">
                    <h2>Riwayat Pertanyaan Pengguna</h2>  
                {loading && <p>Memuat data riwayat...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && (
                    <div className="table-wrapper">
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
                                            <td data-label="ID">{log.id}</td>
                                            <td data-label="User ID">{log.user_id ?? "-"}</td>
                                            <td data-label="Pertanyaan" className="pertanyaan-cell" title={log.pertanyaan}>
                                                {log.pertanyaan}
                                            </td>
                                            <td data-label="Intent">
                                                {log.intent_didapat ? (
                                                    <span className="intent-badge">{log.intent_didapat}</span>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td data-label="Confidence">
                                                <ConfidenceVisual score={log.confidence_score} />
                                            </td>
                                            <td data-label="Waktu">{formatDate(log.waktu)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                                            Tidak ada data riwayat pertanyaan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default RiwayatPertanyaanUser;