import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Payment.css";

const Payment = () => {
  const { pengacaraId: paramPengacaraId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Ambil pengacaraId dari param URL atau dari state (fallback)
  const pengacaraId = state?.pengacaraId || paramPengacaraId;

  const [advokat, setAdvokat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(30); // durasi default 30 menit

  useEffect(() => {
    if (!pengacaraId) {
      setError("Pengacara ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const getAdvokat = async () => {
      try {
        // Lebih baik ada endpoint spesifik di backend: /api/profilpengacara/:id
        const res = await fetch(`http://localhost:5000/api/profilpengacara/${pengacaraId}`);
        if (!res.ok) throw new Error("Gagal mengambil data advokat");
        const data = await res.json();
        setAdvokat(data);
      } catch (err) {
        console.error("Gagal fetch advokat:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data advokat");
      } finally {
        setLoading(false);
      }
    };

    getAdvokat();
  }, [pengacaraId]);

  const handleIncreaseDuration = () => {
    setDuration((prev) => prev + 30);
  };

  const handleDecreaseDuration = () => {
    setDuration((prev) => (prev > 30 ? prev - 30 : 30));
  };

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!advokat || !user) return;

    const unitPrice = 50000;
    const totalPrice = (duration / 30) * unitPrice;

    try {
      const response = await fetch("http://localhost:5000/api/payment/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pengacara_id: advokat.id,
          user_id: user.id,
          durasi_konsultasi: duration,
          total_harga: totalPrice,
        }),
      });

      const data = await response.json();
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: () => {
            alert("✅ Pembayaran sukses!");
            navigate(`/chat/pengacara/${advokat.id}`, { state: { durasi: duration } });
          },
          onPending: () => alert("⏳ Menunggu pembayaran..."),
          onError: () => alert("❌ Pembayaran gagal."),
          onClose: () => alert("⚠️ Transaksi dibatalkan."),
        });
      } else {
        alert("Gagal memproses transaksi.");
      }
    } catch (error) {
      console.error("Error saat proses payment:", error);
      alert("Terjadi kesalahan pada proses pembayaran.");
    }
  };

  return (
    <div>
      <HeaderAfter />
      <br /><br /><br />
      <div className="payment-page">
        {loading ? (
          <p>Memuat data advokat...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : advokat ? (
          <div className="payment-card">
            <div className="payment-photo">
              {advokat.upload_foto ? (
                <img
                  src={`http://localhost:5000/uploads/${advokat.upload_foto}`}
                  alt={advokat.nama}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-avatar.png";
                  }}
                />
              ) : (
                <div className="photo-placeholder">Tidak ada foto</div>
              )}
            </div>

            <div className="payment-info">
              <h2>Informasi Advokat</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Nama</td>
                    <td>{advokat.nama}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{advokat.email}</td>
                  </tr>
                  <tr>
                    <td>Spesialisasi</td>
                    <td>{advokat.spesialisasi}</td>
                  </tr>
                  <tr>
                    <td>Pendidikan</td>
                    <td>{advokat.pendidikan}</td>
                  </tr>
                  <tr>
                    <td>Pengalaman</td>
                    <td>{advokat.pengalaman ?? 0} tahun</td>
                  </tr>
                  <tr>
                    <td>Durasi Konsultasi</td>
                    <td>
                      <button onClick={handleDecreaseDuration} disabled={duration <= 30}>-</button>
                      <span style={{ margin: "0 10px" }}>{duration} menit</span>
                      <button onClick={handleIncreaseDuration}>+</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Biaya Konsultasi</td>
                    <td>Rp {(duration / 30 * 50000).toLocaleString("id-ID")}</td>
                  </tr>
                </tbody>
              </table>

              <div className="payment-button">
                <button onClick={handlePayment} className="btn-bayar">
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Advokat tidak ditemukan.</p>
        )}
      </div>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Payment;
