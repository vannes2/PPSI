import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isEmbeddedActive, setIsEmbeddedActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [riwayatKonsultasi, setRiwayatKonsultasi] = useState([]);

  const advokat = state?.advokat || null;
  const duration = state?.duration || 0;
  const totalPrice = state?.totalPrice || 0;

  useEffect(() => {
    if (!advokat || !duration || !totalPrice) {
      setError("Data pembayaran tidak lengkap. Silakan kembali ke halaman pembayaran.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          alert("Anda harus login terlebih dahulu.");
          navigate("/login");
          return;
        }

        // Fetch token pembayaran
        const paymentResponse = await fetch("http://localhost:5000/api/payment/transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pengacara_id: advokat.id,
            user_id: user.id,
            durasi_konsultasi: duration,
            total_harga: totalPrice,
          }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentData.token) {
          setError("Gagal mendapatkan token pembayaran.");
          setLoading(false);
          return;
        }
        setToken(paymentData.token);

        // Fetch riwayat konsultasi user
        const konsultasiResponse = await fetch(
          `http://localhost:5000/api/konsultasi_session/riwayat/${user.id}`
        );
        const konsultasiData = await konsultasiResponse.json();
        setRiwayatKonsultasi(konsultasiData);

        setLoading(false);
        setIsEmbeddedActive(true);
      } catch (err) {
        setError("Terjadi kesalahan saat memproses pembayaran.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [advokat, duration, totalPrice, navigate]);

  useEffect(() => {
    if (token && isEmbeddedActive && window.snap && window.snap.embed) {
      if (window.snap.hide) window.snap.hide();
      const container = document.getElementById("snap-container");
      if (container) container.innerHTML = "";

      window.snap.embed(token, {
        embedId: "snap-container",
        onSuccess: () => {
          alert("✅ Pembayaran sukses!");
          setIsEmbeddedActive(false);
          navigate(`/chat/pengacara/${advokat.id}`, { state: { durasi: duration } });
        },
        onPending: () => alert("⏳ Menunggu pembayaran..."),
        onError: () => {
          alert("❌ Pembayaran gagal.");
          setIsEmbeddedActive(false);
        },
        onClose: () => {
          alert("⚠️ Transaksi dibatalkan.");
          setIsEmbeddedActive(false);
        },
      });
    }
  }, [token, isEmbeddedActive, advokat, duration, navigate]);

  const getFotoPengacaraUrl = (foto) =>
    foto && foto !== "default-profile.png" ? `http://localhost:5000/uploads/${foto}` : null;

  if (loading) {
    return (
      <div className="checkout-wrapper checkout-page">
        <HeaderAfter />
        <main className="checkout-content">
          <p>Memuat data pembayaran...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-wrapper checkout-page">
        <HeaderAfter />
        <main className="checkout-content">
          <p className="error-text">{error}</p>
          <button onClick={() => navigate("/payment")} className="btn-back">
            Kembali ke Pembayaran
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-wrapper checkout-page">
      <HeaderAfter />

      <div className="content-wrapper">
        {/* Kolom kiri: Card Konfirmasi Pembayaran + Pembayaran Midtrans */}
        <main className="left-main">
          <h2 className="checkout-title">Konfirmasi Pembayaran</h2>

          {/* Card Konfirmasi Pembayaran */}
          <div className="riwayat-card confirm-card" style={{ marginBottom: "32px" }}>
            <div className="riwayat-card-image">
              {getFotoPengacaraUrl(advokat?.upload_foto) ? (
                <img
                  className="confirm-card-image"
                  src={getFotoPengacaraUrl(advokat.upload_foto)}
                  alt={advokat.nama}
                />
              ) : (
                <span className="no-image">No Image</span>
              )}
            </div>
            <div className="riwayat-card-content">
              <p>
                <strong>Advokat:</strong> {advokat?.nama}
              </p>
              <p>
                <strong>Spesialisasi:</strong> {advokat?.spesialisasi}
              </p>
              <p>
                <strong>Durasi Konsultasi:</strong> {duration} menit
              </p>
              <p>
                <strong>Total Biaya:</strong> Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Embed Midtrans */}
          {isEmbeddedActive && (
            <div
              id="snap-container"
              style={{
                minHeight: "700px",
                maxWidth: "600px",
                margin: "32px auto 0",
              }}
            />
          )}
        </main>

        {/* Kolom kanan: Riwayat Konsultasi */}
        <section className="right-section">
          <h2 className="checkout-title">Riwayat Konsultasi</h2>
          <div className="riwayat-list">
            {riwayatKonsultasi.length === 0 ? (
              <p>Belum ada riwayat konsultasi.</p>
            ) : (
              riwayatKonsultasi.map((session) => (
                <div key={session.id} className="riwayat-card">
                  <div className="riwayat-card-image">
                    {getFotoPengacaraUrl(session.foto_pengacara) ? (
                      <img
                        src={getFotoPengacaraUrl(session.foto_pengacara)}
                        alt="Foto Pengacara"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </div>
                  <div className="riwayat-card-content">
                    <p>
                      <strong>Nama Pengacara:</strong>{" "}
                      {session.nama_pengacara || "Belum diambil Advokat"}
                    </p>
                    <p>
                      <strong>Harga Konsultasi:</strong> Rp{" "}
                      {session.harga_konsultasi?.toLocaleString("id-ID")}
                    </p>
                    <p>
                      <strong>Waktu Mulai:</strong>{" "}
                      {new Date(session.start_time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Durasi (menit):</strong> {session.duration}
                    </p>
                    <p>
                      <strong>Status:</strong> {session.status}
                    </p>
                    <div className="btn-group">
                      {session.id_pengacara ? (
                        <Link to={`/pengacara/detail/${session.id_pengacara}`}>
                          <button className="btn detail-btn">Detail</button>
                        </Link>
                      ) : (
                        <button className="btn detail-btn" disabled>
                          Detail
                        </button>
                      )}
                      <Link to={`/chat/pengacara/${session.id_pengacara}`}>
                        <button className="btn history-btn">Riwayat</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Checkout;
