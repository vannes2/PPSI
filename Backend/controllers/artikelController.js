const Artikel = require("../models/Artikel");

exports.uploadArtikel = async (req, res) => {
  try {
    const { judul, deskripsi, jenis_hukum } = req.body;  // Retrieve the correct values from the body
    const file = req.file;  // Retrieve the file

    console.log("Request body:", req.body);  // Log the received data

    if (!judul || !deskripsi || !jenis_hukum || !file) {
      return res.status(400).json({ message: "Judul, deskripsi, jenis hukum, dan file wajib diisi." });
    }

    const filePath = file.path;

    // Ensure the data is passed correctly to the model
    Artikel.createArtikel(judul, deskripsi, jenis_hukum, filePath, (err, result) => {
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
