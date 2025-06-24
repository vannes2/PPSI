import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Payment.css";
import { Mail, BookText, GraduationCap, Briefcase } from "lucide-react";

const Payment = () => {
  const { state } = useLocation();
  const [advokat, setAdvokat] = useState(null);
  const [rating, setRating] = useState(0); // Tambahan rating state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duration, setDuration] = useState(30);
  const [maxDuration, setMaxDuration] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.pengacaraId) return;

    const getAdvokat = async () => {
      try {
        const res = await fetch("https://ppsi-production.up.railway.app/api/profilpengacara");
        const data = await res.json();
        const found = data.find((p) => p.id === state.pengacaraId);
        if (found) {
          setAdvokat(found);
          setMaxDuration(found.pengalaman * 60);

          // 🎯 Tambahkan fetch rating di sini
          const ratingRes = await fetch(`https://ppsi-production.up.railway.app/api/reviews/rating/${found.id}`);
          const ratingData = await ratingRes.json();
          setRating(ratingData.average_rating || 0);
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
                      src={`https://ppsi-production.up.railway.app/uploads/${advokat.upload_foto}`}
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

                  {/* ⭐ RATING */}
                  <div className="rating-stars">
                    {(() => {
                      const fullStars = Math.floor(rating);
                      const hasHalfStar =
                        rating - fullStars >= 0.25 && rating - fullStars < 0.75;
                      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                      return (
                        <>
                          {[...Array(fullStars)].map((_, i) => (
                            <span key={`full-${i}`} className="star full">★</span>
                          ))}
                          {hasHalfStar && <span className="star half">⯪</span>}
                          {[...Array(emptyStars)].map((_, i) => (
                            <span key={`empty-${i}`} className="star empty">★</span>
                          ))}
                        </>
                      );
                    })()}
                    <span className="rating-number">
                      ({isNaN(Number(rating)) ? "0.0" : Number(rating).toFixed(1)})
                    </span>
                  </div>
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
                      <span>
                        Rp {(duration / 30 * (advokat.harga_konsultasi || 50000)).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

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
