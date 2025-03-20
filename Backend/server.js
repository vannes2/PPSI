const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // Import route login

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan Route Login
app.use("/api", authRoutes); // Semua route di authRoutes akan berada di /api

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
