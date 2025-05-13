# ⚖️ Cerdas Hukum – Platform Konsultasi dan Manajemen Kasus Hukum

**Cerdas Hukum** adalah aplikasi web berbasis Node.js dan React yang dirancang untuk memfasilitasi interaksi antara masyarakat umum dengan pengacara profesional. Aplikasi ini mendukung konsultasi hukum secara real-time, pengajuan dan pengelolaan kasus, serta sistem pembayaran terintegrasi.

---

## 🚀 Fitur Utama

### 🔒 Autentikasi & Manajemen Pengguna
- Login dan Register untuk **User**, **Pengacara**, dan **Admin**
- Sistem verifikasi OTP untuk **reset password**

### 🧑‍⚖️ Konsultasi & Chat Real-time
- Chat antara user dan pengacara menggunakan **Socket.IO**
- Riwayat pesan tersimpan dalam database
- Informasi profil pengacara ditampilkan secara dinamis

### 📂 Manajemen Kasus
- Pengguna dapat **mengajukan kasus** lengkap dengan file bukti
- Pengacara dapat **mengambil kasus**, memproses, dan menyelesaikannya
- Riwayat kasus dapat dilihat oleh pengguna dan pengacara

### 📄 Log Aktivitas
- Setiap perubahan status kasus direkam sebagai log aktivitas

### 💳 Pembayaran Midtrans
- Sistem pembayaran langsung via **Midtrans Snap**
- Riwayat transaksi disimpan secara otomatis

### 📰 Artikel Berita Hukum
- Admin dapat **CRUD Artikel Berita**
- User dapat **memilih kategori berita** dan melihat detail artikel

---

## 🛠️ Teknologi yang Digunakan

### Backend:
- **Node.js** + **Express.js**
- **MySQL** (via `mysql2`)
- **Multer** (upload bukti/foto)
- **JWT** untuk autentikasi
- **Socket.IO** untuk chat
- **Midtrans API** untuk pembayaran

### Frontend:
- **React.js**
- **Axios** (untuk komunikasi API)
- **React Router DOM**
- **React Icons** & **JS PDF**
- **CSS Custom + Bootstrap**

---

## 🧱 Struktur Folder

📦CerdasHukum
┣ 📁Backend
┃ ┣ 📁config
┃ ┣ 📁controllers
┃ ┣ 📁models
┃ ┣ 📁routes
┃ ┣ 📁uploads
┃ ┣ 📜server.js
┗ 📁Frontend
┣ 📁src
┃ ┣ 📁components
┃ ┣ 📁pages
┃ ┣ 📁CSS_User
┃ ┣ 📁CSS_Lawyer
┃ ┣ 📜App.jsx
┗ 📜index.js



