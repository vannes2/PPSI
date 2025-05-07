const db = require("../config/database");

class SimpleUser {
  static getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, name, email, phone, gender, birthdate, address, created_at FROM users";
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static updateById(id, data) {
    const { name, email, phone, address } = data;
    return new Promise((resolve, reject) => {
      const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
      db.query(sql, [name, email, phone, address, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static create(data) {
    const { name, email, phone, password, gender, birthdate, address } = data;
    const sql = `
      INSERT INTO users (name, email, phone, password, gender, birthdate, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [name, email, phone, password, gender, birthdate, address], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = SimpleUser;
