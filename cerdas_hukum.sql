-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 28 Apr 2025 pada 13.20
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cerdas_hukum`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `gender` enum('laki-laki','perempuan') NOT NULL,
  `birthdate` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`) VALUES
(1, 'admin utama', 'admin@cerdashukum.com', '081234567890', 'admin123', 'laki-laki', '1990-01-01', '2025-04-09 14:10:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `artikel`
--

CREATE TABLE `artikel` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `filePath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `artikel`
--

INSERT INTO `artikel` (`id`, `judul`, `deskripsi`, `filePath`) VALUES
(1, 'coba coba', '', 'uploads\\1744711708938.pdf'),
(2, 'percobaan 4', '', 'uploads\\1744711863315.pdf'),
(3, 'percobaan 4', '', 'uploads\\1744711867145.pdf'),
(4, 'percobaan 5', '', 'uploads\\1744712032876.pdf'),
(5, 'Cerdas Hukum', '', 'uploads\\1744859807604.pdf'),
(6, 'percobaan 5', '', 'uploads\\1744864158716.pdf'),
(7, 'percoban 7', '', 'uploads\\1744864306136.pdf'),
(8, 'baru', 'test', 'uploads\\1744864840891.pdf'),
(9, 'Artikel 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i', 'uploads\\1744867479755.pdf'),
(10, 'Hukum Indonesia', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel augue eget velit dictum volutpat. Sed nec risus nec neque egestas tristique. Vivamus id metus vel elit fringilla iaculis. Curabitur at sapien id neque feugiat vehicula. Suspendisse poten', 'uploads\\1744896391267.pdf');

-- --------------------------------------------------------

--
-- Struktur dari tabel `konsultasi`
--

CREATE TABLE `konsultasi` (
  `id` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  `id_pengacara` int(11) NOT NULL,
  `tanggal_konsultasi` datetime NOT NULL,
  `status` enum('Dijadwalkan','Selesai','Dibatalkan') DEFAULT 'Dijadwalkan',
  `catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  `aktivitas` text NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_role` enum('user','pengacara') NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `receiver_role` enum('user','pengacara') NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `receiver_id`, `receiver_role`, `message`, `timestamp`, `is_read`) VALUES
(1, 2, 'user', 1, 'pengacara', 'go', '2025-04-28 17:31:25', 0),
(2, 2, 'user', 3, 'pengacara', 'hello', '2025-04-28 17:32:07', 0),
(3, 1, 'pengacara', 1, 'pengacara', 'tes', '2025-04-28 17:48:59', 1),
(4, 1, 'pengacara', 1, 'pengacara', 'hello', '2025-04-28 17:49:37', 1),
(5, 2, 'user', 1, 'pengacara', 'hello', '2025-04-28 17:55:36', 0),
(6, 3, 'user', 1, 'pengacara', 'hallo', '2025-04-28 18:15:04', 0),
(7, 17, 'user', 1, 'pengacara', 'woi kontol', '2025-04-28 18:18:05', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pendaftaran_pengacara`
--

CREATE TABLE `pendaftaran_pengacara` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `ktp` varchar(30) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `nomor_induk_advokat` varchar(50) NOT NULL,
  `universitas` varchar(100) NOT NULL,
  `pendidikan` varchar(100) NOT NULL,
  `spesialisasi` varchar(150) NOT NULL,
  `pengalaman` int(11) NOT NULL,
  `upload_ktp` varchar(255) DEFAULT NULL,
  `upload_foto` varchar(255) DEFAULT NULL,
  `upload_kartu_advokat` varchar(255) DEFAULT NULL,
  `upload_pkpa` varchar(255) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tanggal_daftar` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pendaftaran_pengacara`
--

INSERT INTO `pendaftaran_pengacara` (`id`, `nama`, `ktp`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `email`, `no_hp`, `nomor_induk_advokat`, `universitas`, `pendidikan`, `spesialisasi`, `pengalaman`, `upload_ktp`, `upload_foto`, `upload_kartu_advokat`, `upload_pkpa`, `username`, `password`, `tanggal_daftar`) VALUES
(7, 'hello', '127718819', '2025-04-25', 'Perempuan', 'jalan cemani', 'hello@gmail.com', '081919188', 'ADV12', 'Universitas Trisakti', 'S2 Ilmu Hukum', 'Hukum Bisnis', 3, '1745550576140-1745546224183-zitline_ip.sql', '1745550576141-1745546224183-zitline_ip.sql', '1745550576144-1745549490864-TM 4 KP Inna Sabily karima.pptx', '1745550576152-1745549490864-TM 4 KP Inna Sabily karima.pptx', 'hello', '$2b$10$07HBfTIqu3l4oLsTWvZYC.o4zAnh2ra.j6uwqf2nOGdxZnRNc4vrO', '2025-04-25 10:09:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengacara`
--

CREATE TABLE `pengacara` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `ktp` varchar(30) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `alamat` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `nomor_induk_advokat` varchar(50) NOT NULL,
  `universitas` varchar(100) NOT NULL,
  `pendidikan` varchar(100) NOT NULL,
  `spesialisasi` varchar(150) NOT NULL,
  `pengalaman` int(11) NOT NULL,
  `upload_ktp` varchar(255) DEFAULT NULL,
  `upload_foto` varchar(255) DEFAULT NULL,
  `upload_kartu_advokat` varchar(255) DEFAULT NULL,
  `upload_pkpa` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tanggal_daftar` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pengacara`
--

INSERT INTO `pengacara` (`id`, `nama`, `ktp`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `email`, `no_hp`, `nomor_induk_advokat`, `universitas`, `pendidikan`, `spesialisasi`, `pengalaman`, `upload_ktp`, `upload_foto`, `upload_kartu_advokat`, `upload_pkpa`, `username`, `password`, `tanggal_daftar`) VALUES
(1, 'Ahmad Fauzi', '3201010401010001', '1988-05-12', 'Laki-laki', 'Jl. Merdeka No.1 Jakarta', 'ahmad.fauzi@example.com', '081234567890', 'ADV001', 'Universitas Indonesia', 'S1 Hukum', 'Hukum Perdata', 5, 'ktp1.png', 'foto1.png', 'kartu1.png', 'pkpa1.png', 'ahmadf', 'hashedpassword1', '2025-04-20 20:03:57'),
(2, 'Siti Aminah', '3201010401010002', '1990-07-23', 'Perempuan', 'Jl. Sudirman No.2 Jakarta', 'siti.aminah@example.com', '081234567891', 'ADV002', 'Universitas Gadjah Mada', 'S2 Hukum', 'Hukum Pidana', 8, 'ktp2.png', 'foto2.png', 'kartu2.png', 'pkpa2.png', 'sitia', 'hashedpassword2', '2025-04-20 20:03:57'),
(3, 'Budi Santoso', '3201010401010003', '1985-03-11', 'Laki-laki', 'Jl. Thamrin No.3 Jakarta', 'budi.santoso@example.com', '081234567892', 'ADV003', 'Universitas Airlangga', 'S1 Hukum', 'Hukum Dagang', 10, 'ktp3.png', 'foto3.png', 'kartu3.png', 'pkpa3.png', 'budis', 'hashedpassword3', '2025-04-20 20:03:57'),
(4, 'Rina Kusuma', '3201010401010004', '1992-08-05', 'Perempuan', 'Jl. Gatot Subroto No.4 Jakarta', 'rina.kusuma@example.com', '081234567893', 'ADV004', 'Universitas Padjajaran', 'S1 Hukum', 'Hukum Perdata', 4, 'ktp4.png', 'foto4.png', 'kartu4.png', 'pkpa4.png', 'rinak', 'hashedpassword4', '2025-04-20 20:03:57'),
(5, 'Dedi Kurniawan', '3201010401010005', '1987-10-19', 'Laki-laki', 'Jl. Rasuna Said No.5 Jakarta', 'dedi.kurniawan@example.com', '081234567894', 'ADV005', 'Universitas Islam Indonesia', 'S1 Hukum', 'Hukum Lingkungan', 7, 'ktp5.png', 'foto5.png', 'kartu5.png', 'pkpa5.png', 'dedik', 'hashedpassword5', '2025-04-20 20:03:57'),
(6, 'Nina Kartika', '3201010401010006', '1993-11-25', 'Perempuan', 'Jl. Casablanca No.6 Jakarta', 'nina.kartika@example.com', '081234567895', 'ADV006', 'Universitas Trisakti', 'S2 Hukum', 'Hukum Pidana', 6, 'ktp6.png', 'foto6.png', 'kartu6.png', 'pkpa6.png', 'ninak', 'hashedpassword6', '2025-04-20 20:03:57'),
(7, 'Yusuf Hidayat', '3201010401010007', '1984-02-10', 'Laki-laki', 'Jl. Kuningan No.7 Jakarta', 'yusuf.hidayat@example.com', '081234567896', 'ADV007', 'Universitas Muhammadiyah Jakarta', 'S1 Hukum', 'Hukum Pajak', 12, 'ktp7.png', 'foto7.png', 'kartu7.png', 'pkpa7.png', 'yusufh', 'hashedpassword7', '2025-04-20 20:03:57'),
(8, 'Eka Putri', '3201010401010008', '1995-09-15', 'Perempuan', 'Jl. Tebet No.8 Jakarta', 'eka.putri@example.com', '081234567897', 'ADV008', 'Universitas Pelita Harapan', 'S1 Hukum', 'Hukum Waris', 3, 'ktp8.png', 'foto8.png', 'kartu8.png', 'pkpa8.png', 'ekap', 'hashedpassword8', '2025-04-20 20:03:57'),
(9, 'Andi Prasetyo', '3201010401010009', '1986-01-30', 'Laki-laki', 'Jl. Kalibata No.9 Jakarta', 'andi.prasetyo@example.com', '081234567898', 'ADV009', 'Universitas Diponegoro', 'S2 Hukum', 'Hukum Tata Negara', 9, 'ktp9.png', 'foto9.png', 'kartu9.png', 'pkpa9.png', 'andip', 'hashedpassword9', '2025-04-20 20:03:57'),
(10, 'Lia Rahmawati', '3201010401010010', '1991-04-22', 'Perempuan', 'Jl. Pasar Minggu No.10 Jakarta', 'lia.rahmawati@example.com', '081234567899', 'ADV010', 'Universitas Parahyangan', 'S1 Hukum', 'Hukum Agraria', 5, 'ktp10.png', 'foto10.png', 'kartu10.png', 'pkpa10.png', 'liar', 'hashedpassword10', '2025-04-20 20:03:57'),
(11, 'Dian Syafitri', '3201010401010011', '1990-06-16', 'Perempuan', 'Jl. Antasari No.11 Jakarta', 'dian.syafitri@example.com', '081234567800', 'ADV011', 'Universitas Andalas', 'S1 Hukum', 'Hukum Keluarga', 6, 'ktp11.png', 'foto11.png', 'kartu11.png', 'pkpa11.png', 'dians', 'hashedpassword11', '2025-04-20 20:03:57'),
(12, 'Fajar Maulana', '3201010401010012', '1983-12-08', 'Laki-laki', 'Jl. Mampang No.12 Jakarta', 'fajar.maulana@example.com', '081234567801', 'ADV012', 'Universitas Brawijaya', 'S1 Hukum', 'Hukum Bisnis', 14, 'ktp12.png', 'foto12.png', 'kartu12.png', 'pkpa12.png', 'fajarm', 'hashedpassword12', '2025-04-20 20:03:57'),
(13, 'Mira Kartini', '3201010401010013', '1994-05-28', 'Perempuan', 'Jl. Cilandak No.13 Jakarta', 'mira.kartini@example.com', '081234567802', 'ADV013', 'Universitas Esa Unggul', 'S1 Hukum', 'Hukum Perdata', 2, 'ktp13.png', 'foto13.png', 'kartu13.png', 'pkpa13.png', 'mirak', 'hashedpassword13', '2025-04-20 20:03:57'),
(14, 'Rudi Hartono', '3201010401010014', '1989-08-30', 'Laki-laki', 'Jl. Prapanca No.14 Jakarta', 'rudi.hartono@example.com', '081234567803', 'ADV014', 'Universitas Atma Jaya', 'S1 Hukum', 'Hukum Pidana', 11, 'ktp14.png', 'foto14.png', 'kartu14.png', 'pkpa14.png', 'rudih', 'hashedpassword14', '2025-04-20 20:03:57'),
(15, 'Desi Anggraini', '3201010401010015', '1993-03-12', 'Perempuan', 'Jl. Cipete No.15 Jakarta', 'desi.anggraini@example.com', '081234567804', 'ADV015', 'Universitas Pancasila', 'S1 Hukum', 'Hukum Perbankan', 4, 'ktp15.png', 'foto15.png', 'kartu15.png', 'pkpa15.png', 'desia', 'hashedpassword15', '2025-04-20 20:03:57'),
(16, 'Rahmat Hidayat', '3201010401010016', '1982-11-20', 'Laki-laki', 'Jl. Kemang No.16 Jakarta', 'rahmat.hidayat@example.com', '081234567805', 'ADV016', 'Universitas Sultan Agung', 'S1 Hukum', 'Hukum Properti', 15, 'ktp16.png', 'foto16.png', 'kartu16.png', 'pkpa16.png', 'rahmath', 'hashedpassword16', '2025-04-20 20:03:57'),
(17, 'Louis', '3201010401010017', '1995-02-17', 'Perempuan', 'Jl. Lenteng Agung No.17 Jakarta', 'louis@gmail.com', '081234567806', 'ADV017', 'Universitas Mercu Buana', 'S2 Hukum', 'Hukum Perdata', 4, 'ktp17.png', 'foto17.png', 'kartu17.png', 'pkpa17.png', 'liliss', 'hashedpassword17', '2025-04-20 20:03:57'),
(19, 'Fitri Yuliani', '3201010401010019', '1992-06-14', 'Perempuan', 'Jl. Pasar Rebo No.19 Jakarta', 'fitri.yuliani@example.com', '081234567808', 'ADV019', 'Universitas Lampung', 'S1 Hukum', 'Hukum Waris', 5, 'ktp19.png', 'foto19.png', 'kartu19.png', 'pkpa19.png', 'fitriy', 'hashedpassword19', '2025-04-20 20:03:57'),
(20, 'Agus Saputra', '3201010401010020', '1988-01-01', 'Laki-laki', 'Jl. Condet No.20 Jakarta', 'agus.saputra@example.com', '081234567809', 'ADV020', 'Universitas Mulawarman', 'S1 Hukum', 'Hukum Ketenagakerjaan', 8, 'ktp20.png', 'foto20.png', 'kartu20.png', 'pkpa20.png', 'aguss', 'hashedpassword20', '2025-04-20 20:03:57'),
(22, 'jamaludin', '31829201010', '1980-01-15', 'Laki-laki', 'Jl Kedaton', 'jamaludin@yahoo.com', '088812123456', 'ADV77', 'UPH', 'S2 Ilmu Hukum', 'Hukum Bisnis', 12, '1745157508818-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508841-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508828-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508853-ChatGPT Image Apr 17, 2025, 10_51_55 AM.png', 'jamal', '$2b$10$XFIk/eKfkfDA0hZkYYy3Jen1KjieWOCWfGp1u3eG1qPBRn4aj.7E2', '2025-04-20 20:58:28'),
(23, 'Anwar', '41627818199', '2025-04-25', 'Laki-laki', 'Jakbar', 'anwar@gmail.com', '0877617718819', 'ADV99', 'Universitas Trisakti', 'S2 Hukum', 'Hukum Perdata', 5, '1745544909164-zitline_ip.sql', '1745544909167-zitline_ip.sql', '1745544909165-zitline_ip.sql', '1745544909168-zitline_ip.sql', 'anwar', '$2b$10$3nRZ/7rNL3S3i0dV8DjFfe0Y4aND4Y/bG1Dx2dY8L1arp27WYpcsm', '2025-04-25 09:22:02'),
(25, 'komangs', '12818811992', '2025-04-25', 'Laki-laki', 'jawa', 'steve@gmail.com', '089977661661', 'ADV107', 'UPH', 'S2 Hukum', 'Hukum Alam', 4, '1745549642332-zitline_ip.sql', '1745549642332-zitline_ip.sql', '1745549642333-zitline_ip.sql', '1745549642333-zitline_ip.sql', 'nvidia', '$2b$10$HlIj4Qkq.ygFXTWaQ8rCBuWXKGCRY9B6yBnHhTaXrXUzHF0ixCjrK', '2025-04-25 09:56:47'),
(26, 'blues', '1181881919', '2025-05-02', 'Perempuan', 'jalan cemani', 'blues@gmail.com', '1234156161718', 'ADV13', 'UPH', 'S2 Ilmu Hukum', 'Hukum Bisnis', 10, '1745584134806-pendaftaran_pengacara.sql', '1745584134807-pendaftaran_pengacara.sql', '1745584134807-pendaftaran_pengacara.sql', '1745584134807-pendaftaran_pengacara.sql', 'blues', '$2b$10$KNCZrCH99bHeiddM2yMpNeXaJ0yrIxA9xQrt1Ib0vTB5L6D4Y6eNa', '2025-04-25 19:30:23'),
(27, 'black', '31829201010', '2025-04-25', 'Laki-laki', 'jalan cemani', 'black@gmail.com', '1234156161718', 'ADV79', 'UPH', 'S2 Hukum', 'Hukum Internasional', 10, '1745585634296-pendaftaran_pengacara.sql', '1745585634297-pendaftaran_pengacara.sql', '1745585634297-pendaftaran_pengacara.sql', '1745585634298-pendaftaran_pengacara.sql', 'black', '123', '2025-04-25 19:54:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `no_hp` varchar(15) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `tanggal_daftar` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tanya_jawab`
--

CREATE TABLE `tanya_jawab` (
  `id` int(11) NOT NULL,
  `id_pengguna` int(11) NOT NULL,
  `id_pengacara` int(11) NOT NULL,
  `pertanyaan` text NOT NULL,
  `jawaban` text DEFAULT NULL,
  `status` enum('Menunggu','Dijawab') DEFAULT 'Menunggu',
  `tanggal_tanya` timestamp NOT NULL DEFAULT current_timestamp(),
  `tanggal_jawab` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` enum('L','P') NOT NULL,
  `birthdate` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`) VALUES
(1, 'zikra', 'zikra@gmail.com', '089918181819', '$2b$10$meP0OIBJlWfsma88P9Sd.u5QYUgKDYZr7tdiRrJlKwbYV/QjF04uC', 'L', '1888-02-01', '2025-03-20 07:09:05'),
(2, 'fajri', 'fajri30.r@gmail.com', '085706125411', '12345678', 'L', '1988-03-01', '2025-03-20 07:13:06'),
(3, 'vanes', 'vanes@gmail.com', '08928188192', '12345678', 'L', '2025-10-03', '2025-03-20 07:26:06'),
(4, 'human', 'human@gmail.com', '1234156161718', '12345678', 'L', '1888-01-01', '2025-03-20 07:32:57'),
(5, 'newest', 'newest@gmail.com', '09891817182', '12345678', 'P', '2000-10-10', '2025-03-20 08:48:30'),
(6, 'baru', 'baru@gmail.com', '12345678', '12345678', 'P', '2025-03-20', '2025-03-20 09:08:23'),
(7, 'newbie', 'newbie@gmail.com', '12345678', '12345678', 'L', '2025-03-20', '2025-03-20 09:11:59'),
(8, 'black', 'black@gmail.com', '1234156161718', '$2b$10$ITbuKjaBTFRvNxjOIjgZHummJGSjMra30jFR9.fdm.Sr4QPeGji5q', 'L', '2000-10-02', '2025-03-25 15:26:48'),
(9, 'demon', 'demon@gmail.com', '089918181819', '12345678', 'L', '1898-02-01', '2025-03-25 15:48:10'),
(10, 'abc', 'abc@gmail.com', '123456', '12345678', 'L', '1222-11-11', '2025-03-27 03:18:49'),
(11, 'Vannes vernando ', 'vanesvernando72@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:05:26'),
(13, 'Vannes vernando ', 'vanesvernando@gmail.com', '085781086148', '333', 'L', '0033-03-31', '2025-04-09 11:07:27'),
(14, 'Vannes vernando ', 'vns@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:30:29'),
(15, 'Vannes vernando ', 'cba@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 14:20:19'),
(16, 'manusia', 'manusia@gmail.com', '089967372738', '222', 'L', '2025-05-01', '2025-04-15 08:23:51'),
(17, 'ihsan', 'ihsan@gmail.com', '8789907788', '333', 'L', '2025-04-15', '2025-04-15 08:26:36'),
(18, 'Ayunnie', 'sukagelay299@gmail.com', '0857061254118', '222', 'P', '2222-02-22', '2025-04-15 08:28:08'),
(19, 'ihsan', 'sukagelay9@gmail.com', '0857061254113', '222', 'P', '0002-02-22', '2025-04-15 08:29:35');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_pengacara` (`id_pengacara`);

--
-- Indeks untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`);

--
-- Indeks untuk tabel `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `pengacara`
--
ALTER TABLE `pengacara`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_pengacara` (`id_pengacara`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `pengacara`
--
ALTER TABLE `pengacara`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD CONSTRAINT `konsultasi_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `konsultasi_ibfk_2` FOREIGN KEY (`id_pengacara`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `log_aktivitas_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  ADD CONSTRAINT `tanya_jawab_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tanya_jawab_ibfk_2` FOREIGN KEY (`id_pengacara`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
