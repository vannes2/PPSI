const path = require("path");
const { convert } = require("pdf-poppler");
const Artikel = require("../models/Artikel");

// Fungsi untuk generate cover dari halaman pertama PDF
const generatePDFCover = async (pdfPath, outputFolder, outputName) => {
  const options = {
    format: "jpeg",
    out_dir: outputFolder,
    out_prefix: outputName,
    page: 1,
  };

  try {
    await convert(pdfPath, options);
    return `${outputName}-01.jpg`; // hasil nama file cover
  } catch (err) {
    console.error("Gagal membuat cover dari PDF:", err);
    return null;
  }
};

// ✅ Upload Artikel Baru
exports.uploadArtikel = async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      jenis_hukum,
      nomor,
      tahun,
      jenis_dokumen,
      tanggal_penetapan,
      tempat_penetapan,
      status,
    } = req.body;

    const file = req.file;

    // Validasi semua field wajib
    if (
      !judul ||
      !deskripsi ||
      !jenis_hukum ||
      !file ||
      !nomor ||
      !tahun ||
      !jenis_dokumen ||
      !tanggal_penetapan ||
      !tempat_penetapan ||
      !status
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const filePath = file.path.replace(/\\/g, "/"); // normalisasi path

    // 🔄 Buat cover image dari PDF
    const outputName = `cover_${Date.now()}`;
    const coverFileName = await generatePDFCover(
      path.resolve(filePath),
      path.resolve("uploads/covers"),
      outputName
    );

    const coverPath = coverFileName ? `uploads/covers/${coverFileName}` : null;

    // ⏺ Simpan ke DB
    Artikel.createArtikel(
      judul,
      deskripsi,
      jenis_hukum,
      filePath,
      nomor,
      parseInt(tahun),
      jenis_dokumen,
      tanggal_penetapan,
      tempat_penetapan,
      status,
      coverPath,
      (err, result) => {
        if (err) {
          console.error("Gagal menyimpan artikel:", err.sqlMessage || err.message);
          return res.status(500).json({ message: "Gagal menyimpan artikel." });
        }
        res.status(201).json({ message: "Artikel berhasil ditambahkan." });
      }
    );
  } catch (err) {
    console.error("Upload gagal:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan saat upload artikel." });
  }
};

// ✅ Ambil Semua Artikel
exports.getAllArtikel = (req, res) => {
  Artikel.getAllArtikel((err, results) => {
    if (err) {
      console.error("Gagal ambil artikel:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data artikel." });
    }
    res.json(results);
  });
};

// ✅ Ambil Detail Artikel Berdasarkan ID
exports.getArtikelById = (req, res) => {
  const { id } = req.params;
  Artikel.getArtikelById(id, (err, result) => {
    if (err) {
      console.error("Gagal ambil artikel:", err.message);
      return res.status(500).json({ message: "Gagal mengambil artikel." });
    }
    if (!result) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    res.json(result);
  });
};
