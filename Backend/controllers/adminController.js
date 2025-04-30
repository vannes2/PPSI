// File: controllers/adminController.js
const db = require('../config/database');

const getAdminProfile = (req, res) => {
  const sql = "SELECT * FROM admin WHERE id = 1"; // Assuming only one admin for now

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching admin data:", err);
      return res.status(500).json({ message: "Error fetching admin data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(results[0]);
  });
};

module.exports = {
  getAdminProfile,
};
