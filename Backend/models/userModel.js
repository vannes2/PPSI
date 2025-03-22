const db = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  // Buat pengguna baru dengan hashing password
  static async createUser({ name, email, phone, password, gender, birthdate }) {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql =
          "INSERT INTO users (name, email, phone, password, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, email, phone, hashedPassword, gender, birthdate], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Ambil semua pengguna tanpa password
  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, name, email, phone, gender, birthdate, created_at FROM users";
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  // Ambil pengguna berdasarkan ID
  static async getUserById(id) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT id, name, email, phone, gender, birthdate, created_at FROM users WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  }

  // Ambil pengguna berdasarkan Email
  static async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT id, name, email, phone, gender, birthdate, created_at FROM users WHERE email = ?";
      db.query(sql, [email], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  }

  // Update data pengguna berdasarkan ID
  static async updateUser(id, { name, email, phone, gender, birthdate }) {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE users SET name = ?, email = ?, phone = ?, gender = ?, birthdate = ? WHERE id = ?";
      db.query(sql, [name, email, phone, gender, birthdate, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = User;
