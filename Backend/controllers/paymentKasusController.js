const midtransClient = require("midtrans-client");

// Inisialisasi Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

/**
 * Controller untuk transaksi pembayaran pengajuan kasus,
 * menggunakan biayaMin dari frontend sebagai gross_amount
 */
const createKasusTransaction = async (req, res) => {
  const { user_id, biaya_min } = req.body;

  if (!user_id || !biaya_min) {
    return res.status(400).json({ error: "user_id dan biaya_min wajib diisi" });
  }

  try {
    const parameter = {
        transaction_details: {
          order_id: `ORDER_KASUS-${Date.now()}`,
          gross_amount: parseInt(biaya_min),
        },
        customer_details: {
          first_name: `User-${user_id}`,
          email: `user${user_id}@example.com`,
          phone: "081234567890",
        },
        // Jika ingin pakai redirect otomatis
        finish_redirect_url: "http://localhost:5173/DaftarKasus"
      };
      

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans Kasus Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createKasusTransaction };
