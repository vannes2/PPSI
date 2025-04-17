const Artikel = require("../models/Artikel");

// Fungsi upload artikel jika kamu pakai controller terpisah
exports.uploadArtikel = async (req, res) => {
  try {
    const { judul } = req.body;
    const file = req.file;

    if (!judul || !file) {
      return res.status(400).json({ message: "Judul dan file wajib diisi." });
    }

    const filePath = file.path;

    Artikel.createArtikel(judul, filePath, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menyimpan artikel." });
      }
      res.status(201).json({ message: "Artikel berhasil ditambahkan." });
    });
  } catch (err) {
    console.error("Upload gagal:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat upload artikel." });
  }
};

// Fungsi ambil semua artikel dari database
exports.getAllArtikel = (req, res) => {
  Artikel.getAllArtikel((err, results) => {
    if (err) {
      console.error("Gagal ambil artikel:", err);
      return res.status(500).json({ message: "Gagal mengambil data artikel." });
    }
    res.json(results);
  });
};
