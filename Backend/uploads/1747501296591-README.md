
# ⚖️ Cerdas Hukum – Platform Konsultasi dan Manajemen Kasus Hukum

**Cerdas Hukum** adalah aplikasi web berbasis **Node.js** dan **React** yang dirancang untuk memfasilitasi interaksi antara masyarakat umum dengan pengacara profesional. Aplikasi ini mendukung konsultasi hukum secara real-time, pengajuan dan pengelolaan kasus, serta sistem pembayaran terintegrasi menggunakan Midtrans.

---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Manajemen Pengguna
- Login dan Register untuk **User**, **Pengacara**, dan **Admin**
- Verifikasi OTP untuk reset password

### 💬 Konsultasi & Chat Real-time
- Chat antara user dan pengacara menggunakan **Socket.IO**
- Riwayat pesan tersimpan di database
- Menampilkan info profil pengacara secara dinamis

### 📁 Manajemen Kasus
- User dapat mengajukan kasus lengkap dengan **upload bukti**
- Pengacara dapat mengambil, memproses, dan menyelesaikan kasus
- Riwayat kasus dapat dilihat oleh kedua belah pihak

### 📝 Log Aktivitas
- Perubahan status kasus direkam secara otomatis sebagai log aktivitas

### 💳 Pembayaran Midtrans
- Terintegrasi dengan **Midtrans Snap**
- Transaksi dicatat dalam database

### 📰 Artikel Berita Hukum
- Admin dapat melakukan **CRUD Artikel Berita**
- Pengguna bisa memilih kategori dan melihat detail berita

---

## 🛠️ Teknologi yang Digunakan

### 🔧 Backend:
- **Node.js**, **Express.js**
- **MySQL** (`mysql2`)
- **JWT** untuk autentikasi
- **Multer** untuk upload foto/bukti
- **Socket.IO** untuk fitur chat
- **Midtrans API** untuk sistem pembayaran

### 🎨 Frontend:
- **React.js**
- **Axios** untuk fetch API
- **React Router DOM**
- **React Icons**, **JS PDF**
- **Bootstrap + CSS Custom**

---

## 📁 Struktur Proyek

```
📦 CerdasHukum
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── CSS_User/
    │   ├── CSS_Lawyer/
    │   ├── App.jsx
    │   └── index.js
```

---

## 📸 Preview Tampilan

| Halaman         | Tampilan                                        |
|-----------------|-------------------------------------------------|
| 🏠 Home         | ![Home](./screenshots/home.png)                |
| 💬 Chat         | ![Chat](./screenshots/chat.png)                |
| 📂 Daftar Kasus | ![Kasus](./screenshots/daftar-kasus.png)       |
| 📰 Artikel      | ![Artikel](./screenshots/artikel-berita.png)   |


---

## 📄 Lisensi

Proyek ini berlisensi **MIT**. Proyek sedang dalam tahap pengembangan.

---

