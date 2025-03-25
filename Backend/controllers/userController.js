const db = require("../config/database");

exports.getProfileById = (req, res) => {
    const { id } = req.params;
    db.query("SELECT id, name, email, phone, password FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
        if (result.length === 0) return res.status(404).json({ message: "Profil tidak ditemukan" });
        res.json(result[0]);
    });
};

exports.getProfileByEmail = (req, res) => {
    const { email } = req.params;
    db.query("SELECT id, name, email, phone, password FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan" });
        if (result.length === 0) return res.status(404).json({ message: "Profil tidak ditemukan" });
        res.json(result[0]);
    });
};

exports.updateUserProfile = (req, res) => {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const sql = `UPDATE users SET name = ?, email = ?, phone = ?, password = ? WHERE id = ?`;
    const values = [name, email, phone, password, id];

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
