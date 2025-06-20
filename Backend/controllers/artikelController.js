const path = require("path");
const os = require("os");
const Artikel = require("../models/Artikel");

// Cegah error di Railway Linux: hanya require pdf-poppler jika bukan Linux
let convert = null;
if (process.platform !== "linux") {
  const poppler = require("pdf-poppler");
  convert = poppler.convert;
}

// Fungsi untuk generate cover dari halaman pertama PDF
const generatePDFCover = async (pdfPath, outputFolder, outputName) => {
  if (process.platform === "linux") {
    console.log("Skipping PDF cover generation on Linux (Railway)");
    return null;
  }

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

// Upload Artikel Baru
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

    if (
      !judul || !deskripsi || !jenis_hukum || !file ||
      !nomor || !tahun || !jenis_dokumen || !tanggal_penetapan ||
      !tempat_penetapan || !status
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    const filePath = file.path.replace(/\\/g, "/");

    const outputName = `cover_${Date.now()}`;
    const coverFileName = await generatePDFCover(
      path.resolve(filePath),
      path.resolve("uploads/covers"),
      outputName
    );
    const coverPath = coverFileName ? `uploads/covers/${coverFileName}` : null;

    Artikel.createArtikel(
      judul, deskripsi, jenis_hukum, filePath, nomor, parseInt(tahun),
      jenis_dokumen, tanggal_penetapan, tempat_penetapan, status, coverPath,
      (err, result) => {
        if (err) {
          console.error("Gagal menyimpan artikel:", err.message);
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

// Ambil Semua Artikel
exports.getAllArtikel = (req, res) => {
  Artikel.getAllArtikel((err, results) => {
    if (err) {
      console.error("Gagal ambil artikel:", err.message);
      return res.status(500).json({ message: "Gagal mengambil data artikel." });
    }
    res.json(results);
  });
};

// Ambil Artikel Berdasarkan ID
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

// Update Artikel
exports.updateArtikel = async (req, res) => {
  const { id } = req.params;
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

  let filePath = null;
  let coverPath = null;

  if (req.file) {
    filePath = req.file.path.replace(/\\/g, "/");
    const outputName = `cover_${Date.now()}`;
    const coverFileName = await generatePDFCover(
      path.resolve(filePath),
      path.resolve("uploads/covers"),
      outputName
    );
    coverPath = coverFileName ? `uploads/covers/${coverFileName}` : null;
  }

  Artikel.updateArtikel(
    id, judul, deskripsi, jenis_hukum, filePath, nomor,
    parseInt(tahun), jenis_dokumen, tanggal_penetapan, tempat_penetapan,
    status, coverPath,
    (err, result) => {
      if (err) {
        console.error("Gagal update artikel:", err.message);
        return res.status(500).json({ message: "Gagal update artikel." });
      }
      res.json({ message: "Artikel berhasil diperbarui." });
    }
  );
};

// Delete Artikel
exports.deleteArtikel = (req, res) => {
  const { id } = req.params;
  Artikel.deleteArtikel(id, (err) => {
    if (err) {
      console.error("Gagal menghapus artikel:", err.message);
      return res.status(500).json({ message: "Gagal menghapus artikel." });
    }
    res.json({ message: "Artikel berhasil dihapus." });
  });
};
