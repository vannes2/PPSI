-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 07, 2025 at 07:50 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.16

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
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('laki-laki','perempuan') COLLATE utf8mb4_general_ci NOT NULL,
  `birthdate` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`) VALUES
(1, 'admin utama', 'admin@cerdashukum.com', '081234567890', 'admin123', 'laki-laki', '1990-01-01', '2025-04-09 14:10:24');

-- --------------------------------------------------------

--
-- Table structure for table `artikel`
--

CREATE TABLE `artikel` (
  `id` int NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `jenis_hukum` enum('KDRT','perceraian','pelanggaran_HAM') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `filePath` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artikel`
--

INSERT INTO `artikel` (`id`, `judul`, `deskripsi`, `jenis_hukum`, `filePath`) VALUES
(1, 'coba coba', '', 'KDRT', 'uploads\\1744711708938.pdf'),
(2, 'percobaan 4', '', 'KDRT', 'uploads\\1744711863315.pdf'),
(3, 'percobaan 4', '', 'perceraian', 'uploads\\1744711867145.pdf'),
(4, 'percobaan 5', '', 'perceraian', 'uploads\\1744712032876.pdf'),
(5, 'Cerdas Hukum', '', 'perceraian', 'uploads\\1744859807604.pdf'),
(6, 'percobaan 5', '', 'pelanggaran_HAM', 'uploads\\1744864158716.pdf'),
(7, 'percoban 7', '', 'pelanggaran_HAM', 'uploads\\1744864306136.pdf'),
(8, 'baru', 'test', 'perceraian', 'uploads\\1744864840891.pdf'),
(9, 'Artikel 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i', 'KDRT', 'uploads\\1744867479755.pdf'),
(10, 'Hukum Indonesia', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel augue eget velit dictum volutpat. Sed nec risus nec neque egestas tristique. Vivamus id metus vel elit fringilla iaculis. Curabitur at sapien id neque feugiat vehicula. Suspendisse poten', 'pelanggaran_HAM', 'uploads\\1744896391267.pdf'),
(26, 'sss', 'sss', 'KDRT', 'uploads\\1746201172608.pdf'),
(27, 'jajaja', 'jaijsjao', 'perceraian', 'uploads\\1746418170165.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `konsultasi`
--

CREATE TABLE `konsultasi` (
  `id` int NOT NULL,
  `id_pengguna` int NOT NULL,
  `id_pengacara` int NOT NULL,
  `tanggal_konsultasi` datetime NOT NULL,
  `status` enum('Dijadwalkan','Selesai','Dibatalkan') COLLATE utf8mb4_general_ci DEFAULT 'Dijadwalkan',
  `catatan` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` int NOT NULL,
  `id_pengguna` int NOT NULL,
  `aktivitas` text COLLATE utf8mb4_general_ci NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `sender_role` enum('user','pengacara') COLLATE utf8mb4_general_ci NOT NULL,
  `receiver_id` int NOT NULL,
  `receiver_role` enum('user','pengacara') COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `receiver_id`, `receiver_role`, `message`, `timestamp`, `is_read`) VALUES
(1, 2, 'user', 1, 'pengacara', 'go', '2025-04-28 17:31:25', 0),
(2, 2, 'user', 3, 'pengacara', 'hello', '2025-04-28 17:32:07', 0),
(3, 1, 'pengacara', 1, 'pengacara', 'tes', '2025-04-28 17:48:59', 1),
(4, 1, 'pengacara', 1, 'pengacara', 'hello', '2025-04-28 17:49:37', 1),
(5, 2, 'user', 1, 'pengacara', 'hello', '2025-04-28 17:55:36', 0),
(6, 3, 'user', 1, 'pengacara', 'hallo', '2025-04-28 18:15:04', 0),
(7, 17, 'user', 1, 'pengacara', 'woi kontol', '2025-04-28 18:18:05', 0),
(8, 14, 'user', 1, 'pengacara', 'woi', '2025-04-28 19:56:46', 0),
(9, 1, 'pengacara', 1, 'pengacara', 'tes', '2025-04-28 19:57:58', 1),
(10, 1, 'pengacara', 2, 'user', 'apa', '2025-04-28 19:58:19', 0),
(11, 1, 'pengacara', 14, 'user', 'apa', '2025-04-28 20:07:54', 0),
(12, 1, 'pengacara', 1, 'pengacara', 'tes', '2025-04-28 20:08:16', 1),
(13, 1, 'pengacara', 1, 'pengacara', 'hLLO', '2025-04-28 20:08:52', 1),
(14, 1, 'user', 1, 'pengacara', 'haii', '2025-04-28 20:11:03', 0),
(15, 1, 'pengacara', 1, 'user', 'tes', '2025-04-28 20:11:17', 1),
(16, 1, 'user', 1, 'pengacara', 'hola', '2025-04-28 20:11:28', 0),
(17, 1, 'pengacara', 1, 'user', 'button', '2025-04-28 20:22:24', 1),
(18, 1, 'user', 1, 'pengacara', 'oit', '2025-04-28 23:05:01', 0),
(19, 1, 'user', 2, 'pengacara', 'hai', '2025-04-29 00:03:36', 0),
(20, 2, 'pengacara', 1, 'user', 'hallo', '2025-04-29 00:03:50', 1),
(21, 1, 'user', 2, 'pengacara', 'kamu lagi apa?', '2025-04-29 00:04:04', 0),
(22, 2, 'pengacara', 1, 'user', 'nguli', '2025-04-29 00:04:12', 1),
(23, 1, 'user', 2, 'pengacara', 'emg iyaaa', '2025-04-29 00:04:24', 0),
(24, 1, 'user', 2, 'pengacara', 'woi', '2025-04-29 00:16:26', 0),
(25, 2, 'pengacara', 1, 'user', 'apa cok', '2025-04-29 00:16:37', 1),
(26, 1, 'user', 1, 'pengacara', 'hallo', '2025-04-29 02:06:52', 0),
(27, 1, 'pengacara', 1, 'user', 'oit', '2025-04-29 02:07:04', 1),
(28, 1, 'user', 2, 'pengacara', 'woi pepek', '2025-04-29 02:28:25', 0),
(29, 1, 'user', 2, 'pengacara', 'woiiiii ribut yuk cina', '2025-04-29 02:30:12', 0),
(30, 2, 'pengacara', 1, 'user', 'ayokkk mmk', '2025-04-29 02:30:36', 1),
(31, 1, 'user', 2, 'pengacara', 'gass', '2025-04-29 02:30:51', 0),
(32, 1, 'pengacara', 1, 'user', 'woi', '2025-04-29 14:18:31', 1),
(33, 1, 'user', 30, 'pengacara', 'hallo', '2025-04-30 15:38:46', 0),
(34, 30, 'pengacara', 1, 'user', 'iya', '2025-04-30 15:38:59', 0),
(35, 1, 'user', 1, 'pengacara', 'tes', '2025-04-30 20:14:06', 0),
(36, 1, 'user', 1, 'pengacara', 'woi', '2025-04-30 20:15:20', 0),
(37, 1, 'pengacara', 1, 'user', 'oi', '2025-05-01 00:51:37', 0),
(38, 1, 'pengacara', 1, 'user', 'hari ini cerah ya', '2025-05-01 00:51:45', 0),
(39, 1, 'user', 1, 'pengacara', 'iyaaa yaaa', '2025-05-01 00:52:03', 0),
(40, 1, 'pengacara', 2, 'user', 'tes', '2025-05-02 14:16:21', 0),
(41, 1, 'pengacara', 2, 'user', 'hi', '2025-05-02 14:16:24', 0),
(42, 14, 'user', 1, 'pengacara', 'tes', '2025-05-05 11:01:41', 0),
(43, 14, 'user', 1, 'pengacara', 'tes', '2025-05-05 11:06:27', 0),
(44, 1, 'pengacara', 14, 'user', 'teesssss', '2025-05-05 11:08:13', 0),
(45, 1, 'pengacara', 2, 'user', 'tes', '2025-05-06 14:26:32', 0),
(46, 2, 'user', 1, 'pengacara', 'oii', '2025-05-06 14:26:41', 0),
(47, 1, 'user', 1, 'pengacara', 'coba coba coba', '2025-05-07 11:27:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pendaftaran_pengacara`
--

CREATE TABLE `pendaftaran_pengacara` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ktp` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') COLLATE utf8mb4_general_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nomor_induk_advokat` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `universitas` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `pendidikan` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `spesialisasi` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `pengalaman` int NOT NULL,
  `upload_ktp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_kartu_advokat` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_pkpa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengacara`
--

CREATE TABLE `pengacara` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ktp` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') COLLATE utf8mb4_general_ci NOT NULL,
  `alamat` text COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nomor_induk_advokat` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `universitas` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `pendidikan` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `spesialisasi` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `pengalaman` int NOT NULL,
  `upload_ktp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_kartu_advokat` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upload_pkpa` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP,
  `harga_konsultasi` int NOT NULL DEFAULT '50000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengacara`
--

INSERT INTO `pengacara` (`id`, `nama`, `ktp`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `email`, `no_hp`, `nomor_induk_advokat`, `universitas`, `pendidikan`, `spesialisasi`, `pengalaman`, `upload_ktp`, `upload_foto`, `upload_kartu_advokat`, `upload_pkpa`, `username`, `password`, `tanggal_daftar`, `harga_konsultasi`) VALUES
(1, 'Ahmad Fauzi', '3201010401010001', '1988-05-12', 'Laki-laki', 'Jl. Merdeka No.1 Jakarta', 'ahmad.fauzi@example.com', '081234567890', 'ADV001', 'Universitas Indonesia', 'S1 Hukum', 'Hukum Perdata', 5, 'ktp1.png', '1746589378429-aguss.png', 'kartu1.png', 'pkpa1.png', 'ahmadf', 'hashedpassword1', '2025-04-20 20:03:57', 50000),
(2, 'Siti Aminah', '3201010401010002', '1990-07-23', 'Perempuan', 'Jl. Sudirman No.2 Jakarta', 'siti.aminah@example.com', '081234567891', 'ADV002', 'Universitas Gadjah Mada', 'S2 Hukum', 'Hukum Pidana', 8, 'ktp2.png', '1746589437463-Siti.png', 'kartu2.png', 'pkpa2.png', 'sitia', 'hashedpassword2', '2025-04-20 20:03:57', 50000),
(3, 'Budi Santoso', '3201010401010003', '1985-03-11', 'Laki-laki', 'Jl. Thamrin No.3 Jakarta', 'budi.santoso@example.com', '081234567892', 'ADV003', 'Universitas Airlangga', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 10, 'ktp3.png', '1746589565797-Budi.png', 'kartu3.png', 'pkpa3.png', 'budis', 'hashedpassword3', '2025-04-20 20:03:57', 50000),
(4, 'Rina Kusuma', '3201010401010004', '1992-08-05', 'Perempuan', 'Jl. Gatot Subroto No.4 Jakarta', 'rina.kusuma@example.com', '081234567893', 'ADV004', 'Universitas Padjajaran', 'S1 Hukum', 'Hukum Perdata', 4, 'ktp4.png', '1746589603259-rina.png', 'kartu4.png', 'pkpa4.png', 'rinak', 'hashedpassword4', '2025-04-20 20:03:57', 50000),
(5, 'Dedi Kurniawan', '3201010401010005', '1987-10-19', 'Laki-laki', 'Jl. Rasuna Said No.5 Jakarta', 'dedi.kurniawan@example.com', '081234567894', 'ADV005', 'Universitas Islam Indonesia', 'S1 Hukum', 'Hukum Perdata', 7, 'ktp5.png', 'foto5.png', 'kartu5.png', 'pkpa5.png', 'dedik', 'hashedpassword5', '2025-04-20 20:03:57', 50000),
(6, 'Nina Kartika', '3201010401010006', '1993-11-25', 'Perempuan', 'Jl. Casablanca No.6 Jakarta', 'nina.kartika@example.com', '081234567895', 'ADV006', 'Universitas Trisakti', 'S2 Hukum', 'Hukum Pidana', 6, 'ktp6.png', 'foto6.png', 'kartu6.png', 'pkpa6.png', 'ninak', 'hashedpassword6', '2025-04-20 20:03:57', 50000),
(7, 'Yusuf Hidayat', '3201010401010007', '1984-02-10', 'Laki-laki', 'Jl. Kuningan No.7 Jakarta', 'yusuf.hidayat@example.com', '081234567896', 'ADV007', 'Universitas Muhammadiyah Jakarta', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 12, 'ktp7.png', 'foto7.png', 'kartu7.png', 'pkpa7.png', 'yusufh', 'hashedpassword7', '2025-04-20 20:03:57', 50000),
(8, 'Eka Putri', '3201010401010008', '1995-09-15', 'Perempuan', 'Jl. Tebet No.8 Jakarta', 'eka.putri@example.com', '081234567897', 'ADV008', 'Universitas Pelita Harapan', 'S1 Hukum', 'Hukum Keluarga', 3, 'ktp8.png', 'foto8.png', 'kartu8.png', 'pkpa8.png', 'ekap', 'hashedpassword8', '2025-04-20 20:03:57', 50000),
(9, 'Andi Prasetyo', '3201010401010009', '1986-01-30', 'Laki-laki', 'Jl. Kalibata No.9 Jakarta', 'andi.prasetyo@example.com', '081234567898', 'ADV009', 'Universitas Diponegoro', 'S2 Hukum', 'Hukum HAKI', 9, 'ktp9.png', 'foto9.png', 'kartu9.png', 'pkpa9.png', 'andip', 'hashedpassword9', '2025-04-20 20:03:57', 50000),
(10, 'Lia Rahmawati', '3201010401010010', '1991-04-22', 'Perempuan', 'Jl. Pasar Minggu No.10 Jakarta', 'lia.rahmawati@example.com', '081234567899', 'ADV010', 'Universitas Parahyangan', 'S1 Hukum', 'Hukum Perdata', 5, 'ktp10.png', 'foto10.png', 'kartu10.png', 'pkpa10.png', 'liar', 'hashedpassword10', '2025-04-20 20:03:57', 50000),
(11, 'Dian Syafitri', '3201010401010011', '1990-06-16', 'Perempuan', 'Jl. Antasari No.11 Jakarta', 'dian.syafitri@example.com', '081234567800', 'ADV011', 'Universitas Andalas', 'S1 Hukum', 'Hukum Keluarga', 6, 'ktp11.png', 'foto11.png', 'kartu11.png', 'pkpa11.png', 'dians', 'hashedpassword11', '2025-04-20 20:03:57', 50000),
(12, 'Fajar Maulana', '3201010401010012', '1983-12-08', 'Laki-laki', 'Jl. Mampang No.12 Jakarta', 'fajar.maulana@example.com', '081234567801', 'ADV012', 'Universitas Brawijaya', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 14, 'ktp12.png', 'foto12.png', 'kartu12.png', 'pkpa12.png', 'fajarm', 'hashedpassword12', '2025-04-20 20:03:57', 50000),
(13, 'Mira Kartini', '3201010401010013', '1994-05-28', 'Perempuan', 'Jl. Cilandak No.13 Jakarta', 'mira.kartini@example.com', '081234567802', 'ADV013', 'Universitas Esa Unggul', 'S1 Hukum', 'Hukum Perdata', 2, 'ktp13.png', 'foto13.png', 'kartu13.png', 'pkpa13.png', 'mirak', 'hashedpassword13', '2025-04-20 20:03:57', 50000),
(14, 'Rudi Hartono', '3201010401010014', '1989-08-30', 'Laki-laki', 'Jl. Prapanca No.14 Jakarta', 'rudi.hartono@example.com', '081234567803', 'ADV014', 'Universitas Atma Jaya', 'S1 Hukum', 'Hukum Pidana', 11, 'ktp14.png', 'foto14.png', 'kartu14.png', 'pkpa14.png', 'rudih', 'hashedpassword14', '2025-04-20 20:03:57', 50000),
(15, 'Desi Anggraini', '3201010401010015', '1993-03-12', 'Perempuan', 'Jl. Cipete No.15 Jakarta', 'desi.anggraini@example.com', '081234567804', 'ADV015', 'Universitas Pancasila', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 4, 'ktp15.png', 'foto15.png', 'kartu15.png', 'pkpa15.png', 'desia', 'hashedpassword15', '2025-04-20 20:03:57', 50000),
(16, 'Rahmat Hidayat', '3201010401010016', '1982-11-20', 'Laki-laki', 'Jl. Kemang No.16 Jakarta', 'rahmat.hidayat@example.com', '081234567805', 'ADV016', 'Universitas Sultan Agung', 'S1 Hukum', 'Hukum Perdata', 15, 'ktp16.png', 'foto16.png', 'kartu16.png', 'pkpa16.png', 'rahmath', 'hashedpassword16', '2025-04-20 20:03:57', 50000),
(17, 'Louis', '3201010401010017', '1995-02-17', 'Perempuan', 'Jl. Lenteng Agung No.17 Jakarta', 'louis@gmail.com', '081234567806', 'ADV017', 'Universitas Mercu Buana', 'S2 Hukum', 'Hukum Perdata', 4, 'ktp17.png', 'foto17.png', 'kartu17.png', 'pkpa17.png', 'liliss', 'hashedpassword17', '2025-04-20 20:03:57', 50000),
(19, 'Fitri Yuliani', '3201010401010019', '1992-06-14', 'Perempuan', 'Jl. Pasar Rebo No.19 Jakarta', 'fitri.yuliani@example.com', '081234567808', 'ADV019', 'Universitas Lampung', 'S1 Hukum', 'Hukum Keluarga', 5, 'ktp19.png', 'foto19.png', 'kartu19.png', 'pkpa19.png', 'fitriy', 'hashedpassword19', '2025-04-20 20:03:57', 50000),
(20, 'Agus Saputra', '3201010401010020', '1988-01-01', 'Laki-laki', 'Jl. Condet No.20 Jakarta', 'agus.saputra@example.com', '081234567809', 'ADV020', 'Universitas Mulawarman', 'S1 Hukum', 'Hukum Ketenagakerjaan', 8, 'ktp20.png', '1746591929001-agus.png', 'kartu20.png', 'pkpa20.png', 'aguss', 'hashedpassword20', '2025-04-20 20:03:57', 50000);

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_general_ci,
  `tanggal_daftar` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tanya_jawab`
--

CREATE TABLE `tanya_jawab` (
  `id` int NOT NULL,
  `id_pengguna` int NOT NULL,
  `id_pengacara` int NOT NULL,
  `pertanyaan` text COLLATE utf8mb4_general_ci NOT NULL,
  `jawaban` text COLLATE utf8mb4_general_ci,
  `status` enum('Menunggu','Dijawab') COLLATE utf8mb4_general_ci DEFAULT 'Menunggu',
  `tanggal_tanya` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tanggal_jawab` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `transaksi_id` int NOT NULL,
  `pengacara_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` int NOT NULL,
  `status` enum('Pending','Success','Failed') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `tanggal_transaksi` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('L','P') COLLATE utf8mb4_general_ci NOT NULL,
  `birthdate` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`, `address`) VALUES
(1, 'zikra', 'zikra@gmail.com', '089918181819', '123', 'L', '1888-02-01', '2025-03-20 07:09:05', 'Jakarta Barat'),
(2, 'fajri', 'fajri30.r@gmail.com', '085706125411', '12345678', 'L', '1988-03-01', '2025-03-20 07:13:06', NULL),
(3, 'vanes', 'vanes@gmail.com', '08928188192', '12345678', 'L', '2025-10-03', '2025-03-20 07:26:06', NULL),
(4, 'human', 'human@gmail.com', '1234156161718', '12345678', 'L', '1888-01-01', '2025-03-20 07:32:57', NULL),
(5, 'newest', 'newest@gmail.com', '09891817182', '12345678', 'P', '2000-10-10', '2025-03-20 08:48:30', NULL),
(6, 'baru', 'baru@gmail.com', '12345678', '12345678', 'P', '2025-03-20', '2025-03-20 09:08:23', NULL),
(7, 'newbie', 'newbie@gmail.com', '12345678', '12345678', 'L', '2025-03-20', '2025-03-20 09:11:59', NULL),
(8, 'black', 'black@gmail.com', '1234156161718', '$2b$10$ITbuKjaBTFRvNxjOIjgZHummJGSjMra30jFR9.fdm.Sr4QPeGji5q', 'L', '2000-10-02', '2025-03-25 15:26:48', NULL),
(9, 'demon', 'demon@gmail.com', '089918181819', '12345678', 'L', '1898-02-01', '2025-03-25 15:48:10', NULL),
(10, 'abc', 'abc@gmail.com', '123456', '12345678', 'L', '1222-11-11', '2025-03-27 03:18:49', NULL),
(11, 'Vannes vernando ', 'vanesvernando72@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:05:26', NULL),
(13, 'Vannes vernando ', 'vanesvernando@gmail.com', '085781086148', '333', 'L', '0033-03-31', '2025-04-09 11:07:27', NULL),
(14, 'Vannes vernando ', 'vns@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:30:29', NULL),
(15, 'Vannes vernando ', 'cba@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 14:20:19', NULL),
(16, 'manusia', 'manusia@gmail.com', '089967372738', '222', 'L', '2025-05-01', '2025-04-15 08:23:51', NULL),
(17, 'ihsan', 'ihsan@gmail.com', '8789907788', '333', 'L', '2025-04-15', '2025-04-15 08:26:36', NULL),
(18, 'Ayunnie', 'sukagelay299@gmail.com', '0857061254118', '222', 'P', '2222-02-22', '2025-04-15 08:28:08', NULL),
(19, 'ihsan', 'sukagelay9@gmail.com', '0857061254113', '222', 'P', '0002-02-22', '2025-04-15 08:29:35', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_pengacara` (`id_pengacara`);

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `pengacara`
--
ALTER TABLE `pengacara`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_pengacara` (`id_pengacara`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`transaksi_id`),
  ADD KEY `pengacara_id` (`pengacara_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `konsultasi`
--
ALTER TABLE `konsultasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pengacara`
--
ALTER TABLE `pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `transaksi_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD CONSTRAINT `konsultasi_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `konsultasi_ibfk_2` FOREIGN KEY (`id_pengacara`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `log_aktivitas_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tanya_jawab`
--
ALTER TABLE `tanya_jawab`
  ADD CONSTRAINT `tanya_jawab_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tanya_jawab_ibfk_2` FOREIGN KEY (`id_pengacara`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `fk_pengacara_id` FOREIGN KEY (`pengacara_id`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
