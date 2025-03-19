const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

// Koneksi ke database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cerdas_hukum"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Database connected...");
});

// Endpoint untuk mengambil data pengacara
app.get("/api/pengacara", (req, res) => {
    db.query("SELECT * FROM pengacara", (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
