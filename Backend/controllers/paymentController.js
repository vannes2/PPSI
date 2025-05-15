const midtransClient = require("midtrans-client");
const { getPengacaraById } = require("../models/paymentModel");
const { createOrUpdateSession } = require("../models/konsultasiSessionModel");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const createTransaction = async (req, res) => {
  const { pengacara_id, user_id, durasi_konsultasi } = req.body;

  try {
    const pengacara = await getPengacaraById(pengacara_id);
    if (!pengacara.harga_konsultasi) throw new Error("Harga konsultasi tidak ditemukan");

    const grossAmount = (durasi_konsultasi / 30) * 50000; // Harga fix per 30 menit

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: `User-${user_id}`,
        email: `user${user_id}@example.com`,
        phone: "081234567890",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Buat atau update session konsultasi (overwrite session lama jika ada)
    const session = await createOrUpdateSession(user_id, pengacara_id, durasi_konsultasi);

    res.json({ token: transaction.token, session });
  } catch (error) {
    console.error("Midtrans Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction };
