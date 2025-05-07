const midtransClient = require("midtrans-client");
const { getPengacaraById } = require("../models/paymentModel");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const createTransaction = async (req, res) => {
  const { pengacara_id, user_id } = req.body;

  try {
    const pengacara = await getPengacaraById(pengacara_id);
    if (!pengacara.harga_konsultasi) throw new Error("Harga konsultasi tidak ditemukan");

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: pengacara.harga_konsultasi,
      },
      customer_details: {
        first_name: `User-${user_id}`,
        email: `user${user_id}@example.com`,
        phone: "081234567890",
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction };