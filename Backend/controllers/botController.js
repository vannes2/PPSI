const db = require("../config/database");
const similarity = require("string-similarity");

// Membersihkan teks dan membuatnya konsisten
const normalize = (text) => {
  return text.toLowerCase().replace(/[^\w\s]/gi, "").trim();
};

exports.handleMessage = async (req, res) => {
  const userInput = normalize(req.body.message || "");
  const userId = req.body.user_id || null; // Kirim user_id dari frontend kalau ada

  try {
    const [rows] = await db.promise().query("SELECT * FROM faq_hukum");

    let bestMatch = null;
    let bestScore = 0;

    // 1. Cek dengan keywords
    for (const item of rows) {
      const keywords = JSON.parse(item.keywords || "[]");
      for (const keyword of keywords) {
        const score = similarity.compareTwoStrings(userInput, normalize(keyword));
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }

    // 2. Jika belum cukup match, cek dengan contoh_pertanyaan
    if (bestScore < 0.6) {
      for (const item of rows) {
        const contoh = item.contoh_pertanyaan || "";
        const score = similarity.compareTwoStrings(userInput, normalize(contoh));
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }

    let responseData;
    // 3. Jika ditemukan kecocokan
    if (bestScore >= 0.5 && bestMatch) {
      responseData = {
        response: bestMatch.response,
        intent: bestMatch.intent,
        kategori: bestMatch.kategori,
        referensi: bestMatch.sumber_referensi,
        contoh: bestMatch.contoh_pertanyaan,
        confidence: bestScore.toFixed(2)
      };
    } else {
      // 4. Jika tidak cocok, fallback saran
      const saran = rows.map((row) => `"${row.intent}"`).filter((v, i, a) => a.indexOf(v) === i);
      responseData = {
        response:
          `Maaf, saya belum memahami pertanyaan tersebut. ` +
          `Coba gunakan kata kunci seperti: ${saran.join(", ")}`,
        intent: null,
        kategori: null,
        referensi: null,
        confidence: 0
      };
    }

    // 5. Simpan log pertanyaan user ke database
    await db.promise().query(
      `INSERT INTO log_pertanyaan_user (user_id, pertanyaan, intent_didapat, confidence_score)
       VALUES (?, ?, ?, ?)`,
      [userId, req.body.message, responseData.intent, responseData.confidence]
    );

    // Kirim respon ke frontend
    return res.json(responseData);

  } catch (error) {
    console.error("Gagal memproses chatbot:", error);
    return res.status(500).json({
      response: "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.",
    });
  }
};
