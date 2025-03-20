const db = require("../config/database");
const User = require("../models/userModel");

exports.signup = async (req, res) => {
  const { name, email, phone, password, confirmPassword, gender, birthdate } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok!" });
  }

  try {
    await User.createUser({ name, email, phone, password, gender, birthdate });
    res.status(201).json({ message: "Pendaftaran berhasil" });
  } catch (error) {
    console.error("Error saat signup:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi Login yang baru ditambahkan
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Error saat login:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }

    if (results.length > 0) {
      res.status(200).json({ message: "Login berhasil", user: results[0] });
    } else {
      res.status(401).json({ message: "Email atau password salah" });
    }
  });
};

// Fungsi untuk mendapatkan semua user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error saat mengambil data user:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
