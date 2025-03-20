const db = require("../config/database");

exports.getPengacara = (req, res) => {
    const sql = "SELECT id, nama, email, no_hp, spesialisasi, pengalaman, tanggal_daftar FROM users";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error saat mengambil data pengacara:", err);
            return res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
        res.status(200).json(results);
    });
};
