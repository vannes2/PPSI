const db = require("../config/database");
const User = require("../models/userModel");

// Fungsi Signup
exports.signup = (req, res) => {
  const { name, email, phone, password, confirmPassword, gender, birthdate } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok!" });
  }

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, adminCheck) => {
    if (err) {
      console.error("Error saat cek email di admin:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }

    if (adminCheck.length > 0) {
      return res.status(400).json({ message: "Email ini sudah digunakan sebagai Admin." });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, userCheck) => {
      if (err) {
        console.error("Error saat cek email di users:", err);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }

      if (userCheck.length > 0) {
        return res.status(400).json({ message: "Email ini sudah digunakan sebagai Pengguna." });
      }

      const insertQuery = "INSERT INTO users (name, email, phone, password, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertQuery, [name, email, phone, password, gender, birthdate], (err, result) => {
        if (err) {
          console.error("Error saat menyimpan user:", err);
          return res.status(500).json({ message: "Terjadi kesalahan pada server saat menyimpan data" });
        }
        return res.status(201).json({ message: "Pendaftaran berhasil" });
      });
    });
  });
};

// Fungsi Login (integrasi, photo_url lengkap)
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Cek users
  const userQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(userQuery, [email, password], (err, userResults) => {
    if (err) {
      console.error("Error saat login user:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }

    if (userResults.length > 0) {
      const user = userResults[0];
      return res.status(200).json({
        message: "Login berhasil sebagai User",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "user",
          photo_url: user.photo ? `http://localhost:5000/uploads/profile_photos/${user.photo}` : null,
        },
      });
    }

    // Cek pengacara
    const lawyerQuery = "SELECT * FROM pengacara WHERE email = ? AND password = ?";
    db.query(lawyerQuery, [email.trim(), password], (err, lawyerResults) => {
      if (err) {
        console.error("Error saat login pengacara:", err);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }

      if (lawyerResults.length > 0) {
        const lawyer = lawyerResults[0];
        return res.status(200).json({
          message: "Login berhasil sebagai Pengacara",
          user: {
            id: lawyer.id,
            name: lawyer.nama,
            email: lawyer.email,
            role: "pengacara",
            photo_url: lawyer.upload_foto ? `http://localhost:5000/uploads/profile_photos/${lawyer.upload_foto}` : null,
          },
        });
      }

      // Cek admin
      const adminQuery = "SELECT * FROM admin WHERE email = ? AND password = ?";
      db.query(adminQuery, [email, password], (err, adminResults) => {
        if (err) {
          console.error("Error saat login admin:", err);
          return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }

        if (adminResults.length > 0) {
          const admin = adminResults[0];
          return res.status(200).json({
            message: "Login berhasil sebagai Admin",
            user: {
              id: admin.id,
              name: admin.nama,
              email: admin.email,
              role: "admin",
              photo_url: admin.upload_foto ? `http://localhost:5000/uploads/profile_photos/${admin.upload_foto}` : null,
            },
          });
        }

        return res.status(401).json({ message: "Email atau password salah" });
      });
    });
  });
};

// Fungsi Ambil Semua User (tidak berubah)
exports.getUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error("Error saat mengambil data user:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
    res.status(200).json(users);
  });
};
