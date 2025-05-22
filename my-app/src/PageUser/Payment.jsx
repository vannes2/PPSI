import { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Payment.css";

const Payment = () => {
  const { state } = useLocation();
  const [advokat, setAdvokat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(30); // durasi dalam menit, default 30 menit
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.pengacaraId) return;

    const getAdvokat = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profilpengacara");
        const data = await res.json();
        const found = data.find((p) => p.id === state.pengacaraId);
        if (found) setAdvokat(found);
        else setError("Advokat tidak ditemukan.");
      } catch (err) {
        console.error("Gagal fetch advokat:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAdvokat();
  }, [state?.pengacaraId]);

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
    } catch (err) {
      alert("Terjadi kesalahan saat memproses pembayaran.");
      console.error(err);
    }
  };

  return (
    <div className="payment-page-wrapper">
      <HeaderAfter />
      <br /><br /><br /><br />

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
              <ul>
                <li>
                  <span className="label">Nama:</span> {advokat.nama}
                </li>
                <li>
                  <span className="label">Email:</span> {advokat.email}
                </li>
                <li>
                  <span className="label">Spesialisasi:</span> {advokat.spesialisasi}
                </li>
                <li>
                  <span className="label">Pendidikan:</span> {advokat.pendidikan}
                </li>
                <li>
                  <span className="label">Pengalaman:</span> {advokat.pengalaman ?? 0} tahun
                </li>
              </ul>

              <div className="duration-control">
                <button onClick={handleDecreaseDuration} disabled={duration <= 30}>−</button>
                <span>{duration} menit</span>
                <button onClick={handleIncreaseDuration}>+</button>
              </div>

              <div style={{ fontWeight: "700", marginBottom: "24px", color: "#1b4332", textAlign: "center" }}>
                Biaya Konsultasi: Rp {(duration / 30 * 50000).toLocaleString("id-ID")}
              </div>

              <div className="payment-button-group">
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
      <br /><br /><br />
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Payment;
