const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Routes
const authRoutes = require("./routes/authRoutes");
const pengacaraRoutes = require("./routes/pengacaraRoutes");
const userRoutes = require("./routes/userRoutes");
const artikelRoutes = require("./routes/artikelRoutes"); // Pastikan file ini ada

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan rute API
app.use("/api", authRoutes);
app.use("/api", pengacaraRoutes); 
app.use("/api", userRoutes);
app.use("/api", artikelRoutes);
app.use("/uploads", express.static("uploads"));

// Jalankan server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
