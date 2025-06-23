const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require('http');
const socketIo = require('socket.io');
const db = require('./config/database');

// Routes
const authRoutes = require("./routes/authRoutes");
const pengacaraRoutes = require("./routes/pengacaraRoutes");
const userRoutes = require("./routes/userRoutes");
const artikelRoutes = require("./routes/artikelRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");
const chatRoutes = require("./routes/chatRoutes");   // Tambahkan route chat
const adminRoutes = require("./routes/adminRoutes"); 
const profilpengacaraRoutes = require("./routes/profilpengacaraRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const kasusRoutes = require('./routes/kasusRoutes');
const simpleUserRoutes = require("./routes/simpleUserRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const artikelBeritaRoutes = require('./routes/artikelBeritaRoutes');
const konsultasiSessionRoutes = require("./routes/konsultasiSessionRoutes");
const lawyerController = require('./controllers/lawyerController');
const logPertanyaanRoutes = require("./routes/logPertanyaanRoutes");
const faqRoutes = require('./routes/faqRoutes');
const transaksiRoutes = require("./routes/transaksiRoutes"); // Pastikan ini ada// const riwayatKasusRoutes = require("./routes/riwayatKasusRoutes");
const konsultasiRoutes = require("./routes/konsultasiRoutes");
const transaksiKeuanganRoutes = require("./routes/transaksiKeuanganRoutes");
const riwayatPengacaraRoutes = require("./routes/riwayatPengacaraRoutes");
const dashboardRoutes = require('./routes/dashboardPengacaraRoutes');
const reviewRoutes = require('./routes/reviews');

const botRoutes = require("./routes/botRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api/reviews', reviewRoutes);
// Gunakan rute API
app.use("/api", authRoutes);
app.use("/api", lawyerRoutes);
app.use("/api", pengacaraRoutes);
app.use("/api", userRoutes);
app.use("/api", artikelRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/chat", chatRoutes);   // Route untuk chat
app.use("/api", adminRoutes);
app.use("/api", profilpengacaraRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api', kasusRoutes);
app.use("/api/simple-users", simpleUserRoutes);
app.use("/api", forgotPasswordRoutes);
app.use('/api/artikel-berita', artikelBeritaRoutes);
app.use("/api/konsultasi-session", konsultasiSessionRoutes);
app.use("/api/log-pertanyaan", logPertanyaanRoutes);
app.use('/api/faq', faqRoutes);
app.use("/api/payment-kasus", require("./routes/paymentKasusRoutes"));
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/chatbot", require("./routes/botRoutes"));
app.use("/api/chatbot", botRoutes);
app.use("/api/transaksi-keuangan", transaksiKeuanganRoutes);
app.use('/api/transaksi', transaksiKeuanganRoutes);
app.use("/api", riwayatPengacaraRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/konsultasi', konsultasiRoutes);

// app.use("/api/kasus", riwayatKasusRoutes);
app.use("/api/konsultasi_session", konsultasiRoutes);

// Setup HTTP server + Socket.io
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('send_message', (data) => {
        const { sender_id, sender_role, receiver_id, receiver_role, message } = data;
        db.query('INSERT INTO messages SET ?', { sender_id, sender_role, receiver_id, receiver_role, message }, (err) => {
            if (!err) {
                io.emit(`receive_message_${receiver_role}_${receiver_id}`, data);
            } else {
                console.error('Failed to save message:', err);
            }
        });
    });

    socket.on('mark_read', ({ receiver_id, receiver_role, sender_id, sender_role }) => {
        db.query(
            'UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND receiver_role = ? AND sender_id = ? AND sender_role = ? AND is_read = 0',
            [receiver_id, receiver_role, sender_id, sender_role],
            (err) => {
                if (err) console.error('Failed to update read status:', err);
            }
        );
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

setInterval(() => {
    lawyerController.autoRejectExpiredRegistrations();
  }, 5 * 60 * 1000); // 5 menit sekali

  app.get("/", (req, res) => {
    res.json({
      status: "success",
      message: "Backend API is live on Railway 🚀",
      timestamp: new Date(),
    });
  });

// Jalankan server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});