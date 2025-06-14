import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Import Link
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
        // Asumsi endpoint ini mengembalikan array, dan kita mencari yang sesuai
        const res = await fetch("http://localhost:5000/api/profilpengacara");
        const data = await res.json();
        const found = data.find((p) => p.id === state.pengacaraId);
        if (found) {
          setAdvokat(found);
          // Mengatur maxDuration berdasarkan pengalaman jika pengalaman adalah tahun
          // 1 tahun pengalaman = 60 menit durasi maksimal
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

  const handlePayment = () => {
    if (!advokat) return;

    // Pastikan advokat.harga_konsultasi digunakan di sini. Fallback ke 50000 jika null/undefined
    const hargaPerUnit = advokat.harga_konsultasi || 50000; 
    const totalPrice = (duration / 30) * hargaPerUnit;

    navigate("/PaymentCheckout", {
      state: {
        advokat,
        duration,
        totalPrice,
      },
    });
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
          ) : advokat ? (
            <>
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
                  {/* Tombol detail tidak lagi di sini, dipindahkan ke button-wrapper */}
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
                      <span>Rp {(duration / 30 * (advokat.harga_konsultasi || 50000)).toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  {/* BUTTON WRAPPER - Tombol Bayar Sekarang dan Detail Advokat */}
                  <div className="button-wrapper button-group-horizontal">
                    <Link to={`/pengacara/detail/${advokat.id}`} className="btn-payment">
                      Detail Pengacara
                    </Link>
                    <button className="btn-payment" onClick={handlePayment}>
                      Bayar Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Payment;