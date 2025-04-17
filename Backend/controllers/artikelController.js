const Artikel = require("../models/Artikel");

exports.uploadArtikel = async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const file = req.file;

    if (!judul || !deskripsi || !file) {
      return res.status(400).json({ message: "Judul, deskripsi, dan file wajib diisi." });
    }

    const filePath = file.path;

    Artikel.createArtikel(judul, deskripsi, filePath, (err, result) => {
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

exports.getAllArtikel = (req, res) => {
  Artikel.getAllArtikel((err, results) => {
    if (err) {
      console.error("Gagal ambil artikel:", err);
      return res.status(500).json({ message: "Gagal mengambil data artikel." });
    }
    res.json(results);
  });
};
