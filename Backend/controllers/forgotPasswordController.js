const db = require("../config/database");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// === Email setup ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// === Helper untuk menemukan pengguna dari semua tabel ===
const findUserByEmail = (email, callback) => {
  const roles = [
    { table: "users", id: "id", name: "name" },
    { table: "admin", id: "id", name: "name" },
    { table: "pengacara", id: "id", name: "nama" },
  ];

  const checkRole = (index) => {
    if (index >= roles.length) return callback(null, null);

    const { table } = roles[index];
    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, result) => {
      if (err) return callback(err, null);
      if (result.length > 0) return callback(null, { table, user: result[0] });
      checkRole(index + 1);
    });
  };

  checkRole(0);
};

// === 1. Kirim OTP ===
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  findUserByEmail(email, (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data) return res.status(404).json({ message: "Email tidak ditemukan" });

    const { table } = data;

    db.query(
      `UPDATE ${table} SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`,
      [otp, expiry, email],
      (err) => {
        if (err) return res.status(500).json({ message: "Gagal menyimpan token" });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Kode OTP Reset Password",
          html: `<p>Gunakan kode berikut untuk reset password Anda:</p><h2>${otp}</h2><p>Berlaku 15 menit.</p>`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error("Gagal mengirim email:", error);
            return res.status(500).json({ message: "Gagal mengirim email" });
          }
          return res.json({ message: "OTP berhasil dikirim ke email Anda" });
        });
      }
    );
  });
};

// === 2. Verifikasi OTP ===
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  findUserByEmail(email, (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data) return res.status(404).json({ message: "Email tidak ditemukan" });

    const { user } = data;
    if (user.reset_token !== otp) return res.status(400).json({ message: "OTP salah" });
    if (new Date() > new Date(user.reset_token_expiry)) return res.status(400).json({ message: "OTP kadaluwarsa" });

    return res.json({ message: "OTP valid. Silakan lanjutkan ke reset password." });
  });
};

// === 3. Reset Password (Plaintext) ===
exports.resetPassword = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Konfirmasi password tidak cocok" });

  findUserByEmail(email, (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data) return res.status(404).json({ message: "Email tidak ditemukan" });

    const { table } = data;

    db.query(
      `UPDATE ${table} SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?`,
      [password, email],
      (err) => {
        if (err) return res.status(500).json({ message: "Gagal mereset password" });
        return res.json({ message: "Password berhasil direset" });
      }
    );
  });
};
