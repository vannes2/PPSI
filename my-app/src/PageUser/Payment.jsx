import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAfter from "../components/HeaderAfter";
import Footer from "../components/Footer";
import "../CSS_User/Payment.css";

const Payment = () => {
  const { state } = useLocation();
  const [pengacara, setPengacara] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.pengacaraId) {
      fetch(`http://localhost:5000/api/pengacara/${state.pengacaraId}`)
        .then((res) => res.json())
        .then((data) => {
          setPengacara(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Gagal fetch pengacara:", err);
          setLoading(false);
        });
    }
  }, [state]);

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!pengacara || !user) return;

    const response = await fetch("http://localhost:5000/api/payment/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pengacara_id: pengacara.id,
        user_id: user.id,
      }),
    });

    const data = await response.json();
    if (data.token) {
      window.snap.pay(data.token, {
        onSuccess: () => {
          alert("✅ Pembayaran sukses!");
          navigate(`/chat/pengacara/${pengacara.id}`);
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
      <div className="payment-page" style={{ padding: "2rem" }}>
        {loading ? (
          <p>Memuat data pengacara...</p>
        ) : pengacara ? (
          <div className="payment-card" style={{ background: "#fffbe6", padding: "1.5rem", borderRadius: "10px" }}>
            <h2>Detail Pengacara</h2>
            <p><strong>Nama:</strong> {pengacara.nama}</p>
            <p><strong>Email:</strong> {pengacara.email}</p>
            <p><strong>Spesialisasi:</strong> {pengacara.spesialisasi}</p>
            <p><strong>Pendidikan:</strong> {pengacara.pendidikan}</p>
            <p><strong>Pengalaman:</strong> {pengacara.pengalaman} tahun</p>
            <p><strong>Harga Konsultasi:</strong> {pengacara.harga_konsultasi !== undefined
              ? `Rp${pengacara.harga_konsultasi.toLocaleString("id-ID")}`
              : "Tidak tersedia"}
            </p>
            <button onClick={handlePayment} className="btn-bayar" style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
              Bayar Sekarang
            </button>
          </div>
        ) : (
          <p>Pengacara tidak ditemukan.</p>
        )}
      </div>
      <div className="footer-separator"></div>
      <Footer />
    </div>
  );
};

export default Payment;
