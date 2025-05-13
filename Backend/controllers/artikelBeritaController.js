const ArtikelBerita = require('../models/artikelBeritaModel');

exports.getAllArtikel = (req, res) => {
  ArtikelBerita.getAll((err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil artikel' });
    res.json(result);
  });
};

exports.getArtikelById = (req, res) => {
  const { id } = req.params;
  ArtikelBerita.getById(id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ error: 'Artikel tidak ditemukan' });
    res.json(result[0]);
  });
};

exports.createArtikel = (req, res) => {
  const { judul, isi, kategori } = req.body;
  const gambar = req.file ? req.file.filename : null;
  ArtikelBerita.create({ judul, isi, gambar, kategori }, (err) => {
    if (err) return res.status(500).json({ error: 'Gagal menambahkan artikel' });
    res.status(201).json({ message: 'Artikel berhasil ditambahkan' });
  });
};

exports.updateArtikel = (req, res) => {
  const { id } = req.params;
  const { judul, isi, kategori } = req.body;
  const gambar = req.file ? req.file.filename : req.body.existingImage;
  ArtikelBerita.update(id, { judul, isi, gambar, kategori }, (err) => {
    if (err) return res.status(500).json({ error: 'Gagal memperbarui artikel' });
    res.json({ message: 'Artikel berhasil diperbarui' });
  });
};

exports.deleteArtikel = (req, res) => {
  const { id } = req.params;
  ArtikelBerita.delete(id, (err) => {
    if (err) return res.status(500).json({ error: 'Gagal menghapus artikel' });
    res.json({ message: 'Artikel berhasil dihapus' });
  });
};

exports.updateTopStatus = (req, res) => {
  const { id } = req.params;
  const { top_berita } = req.body;
  ArtikelBerita.updateTopStatus(id, top_berita, (err) => {
    if (err) return res.status(500).json({ error: 'Gagal update top_berita' });
    res.json({ message: 'Top_berita berhasil diperbarui' });
  });
};

exports.getTopBerita = (req, res) => {
  ArtikelBerita.getTopBerita((err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal mengambil top berita' });
    res.json(result);
  });
};
