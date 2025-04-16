const Artikel = require("../models/Artikel");
const path = require("path");

exports.uploadArtikel = async (req, res) => {
  try {
    const { judul } = req.body;
    const file = req.file;

    if (!judul || !file) {
      return res.status(400).json({ message: "Judul dan file wajib diisi." });
    }

    const newArtikel = await Artikel.create({
      judul,
      filePath: file.filename,
    });

    res.status(201).json(newArtikel);
  } catch (err) {
    console.error("Upload gagal:", err);
    res.status(500).json({ message: "Gagal mengupload artikel." });
  }
};

exports.getAllArtikel = async (req, res) => {
  try {
    const artikels = await Artikel.findAll();
    res.json(artikels);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data artikel." });
  }
};
