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
  const [profileLoading, setLoadingProfile] = useState(true); // Ganti setUserProfile ke setLoadingProfile

  const isKonsultasi = !!state?.advokat;
  const advokat = state?.advokat || null;
  const duration = state?.duration || 0;
  const totalPrice = state?.totalPrice || 0;

  const kasusData = state?.kasusData || null;
  const biayaKasus = state?.biaya || 0; // Ini biaya_min dari ajukan kasus

  // Fungsi untuk mendapatkan URL foto
  const getPhotoUrl = (photoFilename, isAdvokat = false) => {
    if (!photoFilename || photoFilename === "default-profile.png" || photoFilename === "") {
      return "/assets/images/emptyprofile.png";
    }
    // Jika itu foto pengacara, gunakan path "uploads/"
    if (isAdvokat) {
      return `https://ppsi-production.up.railway.app/uploads/${photoFilename}`;
    }
    // Jika itu foto pengguna, gunakan path "uploads/profile_photos/${photoFilename}"
    return `https://ppsi-production.up.railway.app/uploads/profile_photos/${photoFilename}`;
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const response = await fetch(`https://ppsi-production.up.railway.app/api/profile/id/${user.id}`);
        if (!response.ok) throw new Error("Gagal mengambil data profil");
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingProfile(false); // Gunakan setLoadingProfile
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

          paymentResponse = await fetch("https://ppsi-production.up.railway.app/api/payment/transaction", {
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
          // Ini adalah pembayaran untuk pengajuan kasus
          if (!kasusData || !biayaKasus) {
            setError("Data pengajuan kasus tidak lengkap.");
            setLoading(false);
            return;
          }

          paymentResponse = await fetch("https://ppsi-production.up.railway.app/api/payment-kasus/transaction-kasus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              biaya_min: biayaKasus,
              area_praktik: kasusData.areaPraktik,
              jenis_pengerjaan: kasusData.jenisPengerjaan,
              deskripsi_kasus: kasusData.deskripsi,
              lokasi_kasus: kasusData.lokasi,
              thumbnail_bukti_kasus: kasusData.thumbnailBuktiKasus, 
              estimasi_selesai: kasusData.estimasiSelesai,
              biaya_max: kasusData.biayaMax
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
    const date = new Date(dateString);

    // Periksa apakah tanggal valid
    if (isNaN(date.getTime())) {
        // Jika tidak valid, coba anggap itu angka tahun jika bisa di-parse sebagai integer
        const yearInt = parseInt(dateString);
        if (!isNaN(yearInt) && String(yearInt) === String(dateString)) {
            return yearInt; // Hanya tampilkan tahun jika memang angka tahun
        }
        return "-"; // Jika tidak valid dan bukan angka tahun, tampilkan '-'
    }
    
    // Jika tanggal valid, format seperti biasa
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
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
                    src={getPhotoUrl(advokat?.upload_foto, true)}
                    alt={advokat?.nama || "Pengacara"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/emptyprofile.png";
                    }}
                  />
                </div>
                {/* === START PERUBAHAN HTML UNTUK KONSULTASI === */}
                {/* Konten riwayat-card-content kini langsung strong dan span */}
                <div className="riwayat-card-content">
                    {/* Baris 1: Nama Pengacara & Spesialisasi */}
                    <strong>Nama Pengacara:</strong> <span>{advokat?.nama}</span>
                    <strong>Spesialisasi:</strong> <span>{advokat?.spesialisasi}</span>
                    {/* Baris 2: Durasi Konsultasi & (placeholder jika ada lagi) */}
                    <strong>Durasi Konsultasi:</strong> <span>{duration} menit</span>
                    {/* Anda bisa tambahkan item lain di sini jika ada pasangan yang pas di samping Durasi */}
                    {/* Misalnya: <strong>Rating:</strong> <span>{advokat?.rating}</span> */}

                    {/* Baris Penuh: Total Biaya */}
                    {/* full-row-item digunakan pada strong dan span untuk membuatnya mengambil seluruh lebar grid */}
                    <strong className="full-row-item">Total Biaya:</strong> <span className="full-row-item">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                {/* === END PERUBAHAN HTML UNTUK KONSULTASI === */}
              </>
            ) : (
              <>
                <div className="riwayat-card-image">
                  <img
                    className="confirm-card-image"
                    src={getPhotoUrl(userProfile?.photo)}
                    alt={userProfile?.name || "Profil"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/images/emptyprofile.png";
                    }}
                  />
                </div>
                {/* === START PERUBAHAN HTML UNTUK KASUS === */}
                {/* Konten riwayat-card-content kini langsung strong dan span */}
                <div className="riwayat-card-content">
                    {/* Baris 1: Nama & Email */}
                    <strong>Nama:</strong> <span>{kasusData?.nama || userProfile?.name}</span>
                    <strong>Email:</strong> <span>{kasusData?.email || userProfile?.email}</span>
                    {/* Baris 2: No. HP & Area Hukum */}
                    <strong>No. HP:</strong> <span>{kasusData?.noHp || userProfile?.phone}</span>
                    <strong>Area Hukum:</strong> <span>{kasusData?.areaPraktik || '-'}</span>
                    {/* Baris 3: Jenis Pengerjaan & Lokasi */}
                    <strong>Jenis Pengerjaan:</strong> <span>{kasusData?.jenisPengerjaan || '-'}</span>
                    <strong>Lokasi:</strong> <span>{kasusData?.lokasi || '-'}</span>
                    {/* Baris 4: Estimasi Selesai */}
                    {/* Ini hanya satu item, jadi akan mengambil setengah lebar */}
                    <strong>Estimasi Selesai:</strong> <span>{formatDate(kasusData?.estimasiSelesai)}</span>
                    {/* Jika Anda ingin item ini juga mengisi setengah baris dan ada item lain di sebelahnya,
                        tambahkan item lain di sini atau ubah grid-template-columns di CSS untuk kasus ini */}

                    {/* Baris Penuh: Biaya Min & Biaya Max */}
                    <strong className="full-row-item">Biaya Min:</strong> <span className="full-row-item">Rp {biayaKasus.toLocaleString("id-ID")}</span>
                    <strong className="full-row-item">Biaya Max:</strong> <span className="full-row-item">Rp {kasusData?.biayaMax?.toLocaleString("id-ID") || '-'}</span>
                    
                    {/* Baris Penuh: Deskripsi */}
                    <strong className="full-row-item">Deskripsi:</strong> <span className="full-row-item">{kasusData?.deskripsi || '-'}</span>
                </div>
                {/* === END PERUBAHAN HTML UNTUK KASUS === */}
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