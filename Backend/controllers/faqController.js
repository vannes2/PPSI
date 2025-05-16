// controllers/faqController.js
const db = require("../config/database");

exports.getAllFaq = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM faq_hukum ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data FAQ:", error);
    res.status(500).json({ message: "Gagal mengambil data FAQ" });
  }
};

exports.createFaq = async (req, res) => {
  const { intent, kategori, keywords, contoh_pertanyaan, response, sumber_referensi } = req.body;
  try {
    const sql = `INSERT INTO faq_hukum (intent, kategori, keywords, contoh_pertanyaan, response, sumber_referensi)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      intent,
      kategori,
      JSON.stringify(keywords || []),
      contoh_pertanyaan,
      response,
      sumber_referensi,
    ];
    const [result] = await db.promise().query(sql, values);
    res.status(201).json({ message: "FAQ berhasil ditambahkan", id: result.insertId });
  } catch (error) {
    console.error("Gagal menambah FAQ:", error);
    res.status(500).json({ message: "Gagal menambah FAQ" });
  }
};

exports.updateFaq = async (req, res) => {
  const { id } = req.params;
  const { intent, kategori, keywords, contoh_pertanyaan, response, sumber_referensi } = req.body;
  try {
    const sql = `UPDATE faq_hukum SET intent=?, kategori=?, keywords=?, contoh_pertanyaan=?, response=?, sumber_referensi=? WHERE id=?`;
    const values = [
      intent,
      kategori,
      JSON.stringify(keywords || []),
      contoh_pertanyaan,
      response,
      sumber_referensi,
      id,
    ];
    await db.promise().query(sql, values);
    res.json({ message: "FAQ berhasil diupdate" });
  } catch (error) {
    console.error("Gagal mengupdate FAQ:", error);
    res.status(500).json({ message: "Gagal mengupdate FAQ" });
  }
};

exports.deleteFaq = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM faq_hukum WHERE id = ?", [id]);
    res.json({ message: "FAQ berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus FAQ:", error);
    res.status(500).json({ message: "Gagal menghapus FAQ" });
  }
};
