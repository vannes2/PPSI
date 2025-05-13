const db = require('../config/database');

const ArtikelBerita = {
  getAll: (callback) => {
    db.query('SELECT * FROM artikel_berita ORDER BY created_at DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM artikel_berita WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const { judul, isi, gambar, kategori } = data;
    db.query(
      'INSERT INTO artikel_berita (judul, isi, gambar, kategori) VALUES (?, ?, ?, ?)',
      [judul, isi, gambar, kategori],
      callback
    );
  },

  update: (id, data, callback) => {
    const { judul, isi, gambar, kategori } = data;
    db.query(
      'UPDATE artikel_berita SET judul = ?, isi = ?, gambar = ?, kategori = ? WHERE id = ?',
      [judul, isi, gambar, kategori, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM artikel_berita WHERE id = ?', [id], callback);
  },

  updateTopStatus: (id, topBerita, callback) => {
    db.query(
      'UPDATE artikel_berita SET top_berita = ? WHERE id = ?',
      [topBerita, id],
      callback
    );
  },

  getTopBerita: (callback) => {
    db.query(
      'SELECT * FROM artikel_berita WHERE top_berita = 1 ORDER BY created_at DESC LIMIT 4',
      callback
    );
  }
};

module.exports = ArtikelBerita;
