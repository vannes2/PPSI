import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Payment.css";

import { Mail, BookText, GraduationCap, Briefcase } from "lucide-react";

const Payment = () => {
  const { state } = useLocation();
  const [advokat, setAdvokat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(30);
  const [maxDuration, setMaxDuration] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.pengacaraId) return;

    const getAdvokat = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profilpengacara");
        const data = await res.json();
        const found = data.find((p) => p.id === state.pengacaraId);
        if (found) {
          setAdvokat(found);
          setMaxDuration(found.pengalaman * 60);
        } else {
          setError("Advokat tidak ditemukan.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAdvokat();
  }, [state?.pengacaraId]);

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
    <div className="payment-wrapper">
      <HeaderAfter />
      <main className="payment-content">
        <div className="payment-card">
          <h2 className="payment-title">Detail Pembayaran Konsultasi</h2>

          {loading ? (
            <p>Memuat data advokat...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            advokat && (
              <div className="payment-grid">
                <div className="photo-section">
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
                  <h3 className="photo-name">{advokat.nama}</h3>
                </div>

                <div className="info-section">
                  <div className="info-grid">
                    <div className="info-row icon-row">
                      <Mail className="info-icon" />
                      <span>{advokat.email}</span>
                    </div>
                    <div className="info-row icon-row">
                      <BookText className="info-icon" />
                      <span>{advokat.spesialisasi}</span>
                    </div>
                    <div className="info-row icon-row">
                      <GraduationCap className="info-icon" />
                      <span>{advokat.pendidikan}</span>
                    </div>
                    <div className="info-row icon-row">
                      <Briefcase className="info-icon" />
                      <span>{advokat.pengalaman} tahun</span>
                    </div>

                    <div className="info-row full-width">
                      <span>Durasi Konsultasi:</span>
                      <span className="durasi-kontrol">
                        <button
                          onClick={() => setDuration((prev) => Math.max(prev - 30, 30))}
                          disabled={duration === 30}
                        >
                          −
                        </button>
                        {duration} menit
                        <button
                          onClick={() => setDuration((prev) => Math.min(prev + 30, maxDuration))}
                          disabled={duration === maxDuration}
                        >
                          +
                        </button>
                      </span>
                    </div>

                    <div className="info-row total">
                      <span>Total Biaya:</span>
                      <span>Rp {(duration / 30 * 50000).toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="button-wrapper">
                    <button className="btn-payment" onClick={handlePayment}>
                      Bayar Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </main>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Payment;
