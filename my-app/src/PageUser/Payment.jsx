import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

    // Hitung harga total berdasarkan durasi
    const unitPrice = 50000;
    const totalPrice = (duration / 30) * unitPrice;

    const response = await fetch("http://localhost:5000/api/payment/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pengacara_id: advokat.id,
        user_id: user.id,
        durasi_konsultasi: duration,  // kirim durasi ke backend
        total_harga: totalPrice,      // kirim total harga ke backend (optional)
      }),
    });

    const data = await response.json();
    if (data.token) {
      window.snap.pay(data.token, {
        onSuccess: () => {
          alert("✅ Pembayaran sukses!");
          // Kirim juga durasi ke halaman chat agar session sesuai
          navigate(`/chat/pengacara/${advokat.id}`, { state: { durasi: duration } });
        },
        onPending: () => alert("⏳ Menunggu pembayaran..."),
        onError: () => alert("❌ Pembayaran gagal."),
        onClose: () => alert("⚠️ Transaksi dibatalkan."),
      });
    } else {
      alert("Gagal memproses transaksi.");
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
                    e.target.src = "/images/default-avatar.png"; // fallback lokal jika gambar rusak
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