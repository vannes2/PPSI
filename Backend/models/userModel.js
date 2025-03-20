const db = require("../config/database");

class User {
  static async createUser({ name, email, phone, password, gender, birthdate }) {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO users (name, email, phone, password, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(sql, [name, email, phone, password, gender, birthdate], (err, result) => {  // Password disimpan tanpa hash
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users"; // Menampilkan password asli
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = User;
