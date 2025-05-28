import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Checkout.css";

const PaymentCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isEmbeddedActive, setIsEmbeddedActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isKonsultasi = !!state?.advokat;
  const advokat = state?.advokat || null;
  const duration = state?.duration || 0;
  const totalPrice = state?.totalPrice || 0;

  const kasusData = state?.kasusData || null;
  const biayaKasus = state?.biaya || 0;

  // Fungsi untuk mendapatkan URL foto
  const getPhotoUrl = (photoPath) => {
    if (!photoPath || photoPath === "default-profile.png") {
      return "/assets/images/emptyprofile.png";
    }
    return `http://localhost:5000/uploads/${photoPath}`;
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/api/profile/id/${user.id}`);
        if (!response.ok) throw new Error("Gagal mengambil data profil");
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle payment initialization
  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Anda harus login terlebih dahulu.");
        navigate("/login");
        return;
      }

      try {
        let paymentResponse;

        if (isKonsultasi) {
          if (!advokat || !duration || !totalPrice) {
            setError("Data pembayaran konsultasi tidak lengkap.");
            setLoading(false);
            return;
          }

          paymentResponse = await fetch("http://localhost:5000/api/payment/transaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pengacara_id: advokat.id,
              user_id: user.id,
              durasi_konsultasi: duration,
              total_harga: totalPrice,
            }),
          });
        } else {
          if (!kasusData || !biayaKasus) {
            setError("Data pengajuan kasus tidak lengkap.");
            setLoading(false);
            return;
          }

          paymentResponse = await fetch("http://localhost:5000/api/payment-kasus/transaction-kasus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              biaya_min: biayaKasus,
            }),
          });
        }

        const paymentData = await paymentResponse.json();
        if (!paymentData.token) {
          setError("Gagal mendapatkan token pembayaran.");
          setLoading(false);
          return;
        }

        setToken(paymentData.token);
        setLoading(false);
        setIsEmbeddedActive(true);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memproses pembayaran.");
        setLoading(false);
      }
    };

    fetchData();
  }, [advokat, duration, totalPrice, kasusData, biayaKasus, isKonsultasi, navigate]);

  // Initialize Midtrans payment
  useEffect(() => {
    if (token && isEmbeddedActive && window.snap?.embed) {
      if (window.snap.hide) window.snap.hide();
      const container = document.getElementById("snap-container");
      if (container) container.innerHTML = "";

      window.snap.embed(token, {
        embedId: "snap-container",
        onSuccess: () => {
          alert("✅ Pembayaran sukses!");
          setIsEmbeddedActive(false);
          if (isKonsultasi) {
            navigate(`/chat/pengacara/${advokat.id}`, { state: { durasi: duration } });
          } else {
            navigate("/RiwayatKasus");
          }
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
  }, [token, isEmbeddedActive, advokat, duration, isKonsultasi, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading || profileLoading) {
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
          <button onClick={() => navigate("/HomeAfter")} className="btn-back">
            Kembali
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
        <main className="left-main">
          <h2 className="checkout-title">
            {isKonsultasi ? "Pembayaran Konsultasi" : "Pembayaran Pengajuan Kasus"}
          </h2>
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

        <section className="right-section">
          <h2 className="checkout-title">Konfirmasi Pembayaran</h2>
          <div className="riwayat-card confirm-card" style={{ marginBottom: "32px" }}>
            {isKonsultasi ? (
              <>
                <div className="riwayat-card-image">
                  <img
                    className="confirm-card-image"
                    src={getPhotoUrl(advokat?.upload_foto)}
                    alt={advokat?.nama || "Pengacara"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/emptyprofile.png";
                    }}
                  />
                </div>
                <div className="riwayat-card-content">
                  <p><strong>Nama Pengacara:</strong> {advokat?.nama}</p>
                  <p><strong>Spesialisasi:</strong> {advokat?.spesialisasi}</p>
                  <p><strong>Durasi Konsultasi:</strong> {duration} menit</p>
                  <p><strong>Total Biaya:</strong> Rp {totalPrice.toLocaleString("id-ID")}</p>
                </div>
              </>
            ) : (
              <>
                <div className="riwayat-card-image">
                 <img
                    className="confirm-card-image"
                    src={`http://localhost:5000${userProfile?.photo_url}`}
                    alt={userProfile?.name || "Profil"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/emptyprofile.png";
                    }}
                  />
                </div>
                <div className="riwayat-card-content">
                  <p><strong>Nama:</strong> {kasusData?.nama || userProfile?.name}</p>
                  <p><strong>Email:</strong> {kasusData?.email || userProfile?.email}</p>
                  <p><strong>Nomor HP:</strong> {kasusData?.noHp || userProfile?.phone}</p>
                  <p><strong>Area Hukum:</strong> {kasusData?.areaPraktik || '-'}</p>
                  <p><strong>Jenis Pengerjaan:</strong> {kasusData?.jenisPengerjaan || '-'}</p>
                  <p><strong>Biaya Minimum:</strong> Rp {biayaKasus.toLocaleString("id-ID")}</p>
                  <p><strong>Biaya Maksimum:</strong> Rp {kasusData?.biayaMax?.toLocaleString("id-ID") || '-'}</p>
                  <p><strong>Estimasi Selesai:</strong> {formatDate(kasusData?.estimasiSelesai)}</p>
                  <p><strong>Lokasi:</strong> {kasusData?.lokasi || '-'}</p>
                  <p><strong>Deskripsi:</strong> {kasusData?.deskripsi || '-'}</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default PaymentCheckout;