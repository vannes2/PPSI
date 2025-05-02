const db = require("../config/database");

// Fungsi bantu untuk format tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // bulan dari 0-11
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// Ambil profil berdasarkan ID
exports.getProfileById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, name, email, phone, birthdate, gender, address 
    FROM users WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
    if (result.length === 0)
      return res.status(404).json({ message: "Profil tidak ditemukan" });

    // Format tanggal lahir
    result[0].birthdate = formatDate(result[0].birthdate);
    res.json(result[0]);
  });
};

// Ambil profil berdasarkan email
exports.getProfileByEmail = (req, res) => {
  const { email } = req.params;
  const sql = `
    SELECT id, name, email, phone, birthdate, gender, address 
    FROM users WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
    if (result.length === 0)
      return res.status(404).json({ message: "Profil tidak ditemukan" });

    // Format tanggal lahir
    result[0].birthdate = formatDate(result[0].birthdate);
    res.json(result[0]);
  });
};

// Update profil user TANPA password
exports.updateUserProfile = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const sql = `
    UPDATE users 
    SET name = ?, email = ?, phone = ?, address = ? 
    WHERE id = ?
  `;
  const values = [name, email, phone, address, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error Query:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User tidak ditemukan atau tidak ada perubahan" });
    }
    res.json({ message: "Profil berhasil diperbarui" });
  });
};
