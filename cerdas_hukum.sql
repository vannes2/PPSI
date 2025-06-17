-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 17, 2025 at 06:59 AM
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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `upload_foto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`, `reset_token`, `reset_token_expiry`, `upload_foto`) VALUES
(1, 'admin utamaaa', 'admin@cerdashukum.com', '081234567890', 'admin123', 'laki-laki', '1989-12-25', '2025-04-09 14:10:24', NULL, NULL, 'admin_1747493609538.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `ajukan_kasus`
--

CREATE TABLE `ajukan_kasus` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `no_hp` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `area_praktik` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `jenis_pengerjaan` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `biaya_min` int NOT NULL,
  `biaya_pengacara` decimal(15,2) DEFAULT NULL,
  `biaya_max` int NOT NULL,
  `estimasi_selesai` date NOT NULL,
  `lokasi` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Menunggu',
  `bukti` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lawyer_id` int DEFAULT NULL,
  `is_transferred` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ajukan_kasus`
--

INSERT INTO `ajukan_kasus` (`id`, `user_id`, `nama`, `email`, `no_hp`, `area_praktik`, `jenis_pengerjaan`, `biaya_min`, `biaya_pengacara`, `biaya_max`, `estimasi_selesai`, `lokasi`, `deskripsi`, `status`, `bukti`, `created_at`, `lawyer_id`, `is_transferred`) VALUES
(1, 1, 'Azzikra Praqasta Kusuma', 'azzikrapraqasta2522@gmail.com', '081316443334', 'Perdata', 'Pembuatan Dokumen', 2000000, '1600000.00', 500000, '2025-05-10', 'Jakarta', 'Dokumen Perjanjian dengan perusahaan X', 'Menunggu', NULL, '2025-05-07 10:45:10', 1, 0),
(2, 1, 'Joko', 'zikra@gmail.com', '081316443332', 'Pidana', 'Pembuatan Dokumen', 500000, '400000.00', 500000, '2025-05-19', 'Bandung', 'Dokumen Perjanjian dengan perusahaan Y', 'Menunggu', NULL, '2025-05-07 12:28:30', 1, 0),
(3, 14, 'Vanes', 'vns@gmail.com', '085781086148', 'Perusahaan', 'Negosiasi', 500000, '400000.00', 500000, '2025-05-26', 'Surabaya', 'perusahaan yang memiliki sengketa akibat keterlambatan pembayaran', 'Menunggu', NULL, '2025-05-07 12:36:06', 1, 0),
(4, 1, 'Agus', 'zikra00101@gmail.com', '085781086148', 'Perusahaan', 'Litigasi', 500000, '400000.00', 5000000, '2025-05-26', 'Jakarta', 'Tes', 'Menunggu', NULL, '2025-05-07 13:24:06', 1, 0),
(5, 1, 'Azzikra Praqasta Kusuma', 'termiteindonesia@gmail.com', '085781086148', 'Perdata', 'Negosiasi', 1000000000, '800000000.00', 500000, '2025-06-01', 'Jakarta Barat', 'tes 3', 'Diproses', NULL, '2025-05-12 10:58:06', 1, 0),
(6, 1, 'Umar Ali', 'sayaumarali@gmail.com', '085781086148', 'Keluarga', 'Pendampingan', 1000000, '800000.00', 50000000, '2025-06-01', 'Bandung', 'KDRT', 'Selesai', '1747053599169-Anggota1.pdf', '2025-05-12 12:39:59', 1, 1),
(7, 2, 'fajri', 'fajri30.r@gmail.com', '085706125411', 'Perdata', 'Pembuatan Dokumen', 1000000, '800000.00', 2000000, '2025-05-14', 'Jakarta', 'Warisan', 'Selesai', '1747201804678-PENGUMUMAN Libur Hari Raya Waisak 2569 BE.pdf', '2025-05-14 05:50:04', 9, 1),
(8, 2, 'fajri', 'fajri30.r@gmail.com', '085706125411', 'Pidana', 'Pendampingan', 1000000, '800000.00', 2000000, '2025-05-14', 'Jakarta', 'Pasal pasal', 'Selesai', '1747271588186-Laporan Zitline_Fajri Ramadhan.pdf', '2025-05-15 01:13:08', 9, 1),
(9, 2, 'Gus samsudinn', 'samsudin@gmail.com', '089876654334', 'Pidana', 'Negosiasi', 30000000, '24000000.00', 40000000, '2025-05-01', 'Lampung', 'Tindak kasus pembunuhan ', 'Selesai', NULL, '2025-05-19 09:37:39', 3, 1),
(10, 2, 'Jhoni', 'fajri30.r@gmail.com', '089876632332', 'Perdata', 'Pembuatan Dokumen', 1000000, '800000.00', 1200000, '2025-05-09', 'Tangerang', 'Data hak waris', 'Selesai', NULL, '2025-05-19 09:47:18', 3, 0),
(11, 2, 'Sherly', 'sherly@gmail.com', '087656761212', 'Perusahaan', 'Pendampingan', 2000000, '1600000.00', 2500000, '2025-05-19', 'Jakarta', 'Kasus perusahaan', 'Menunggu', NULL, '2025-05-19 09:49:04', NULL, 0),
(12, 2, 'Vernando', 'vernando@gmail.com', '08994335111', 'Keluarga', 'Konsultasi', 1500000, '1200000.00', 2000000, '2025-05-16', 'Depok', 'hak asuh anak', 'Menunggu', NULL, '2025-05-19 09:50:34', 3, 0),
(13, 2, 'Sherly', 'fajri30.r@gmail.com', '087656761212', 'Perdata', 'Konsultasi', 2000000, '1600000.00', 2500000, '2025-05-19', 'Jakarta', 'konsul', 'Menunggu', NULL, '2025-05-19 11:07:56', NULL, 0),
(14, 2, 'Sherly', 'fajri30.r@gmail.com', '087656761212', 'Keluarga', 'Negosiasi', 1000000, '800000.00', 2500000, '2025-05-19', 'Jakarta', 'good', 'Menunggu', NULL, '2025-05-19 11:14:50', NULL, 0),
(15, 2, 'fajri', 'fajri30.r@gmail.com', '085706125411', 'Tenaga Kerja', 'Konsultasi', 1000000, '800000.00', 1500000, '2025-05-19', 'Jakarta', 'new', 'Menunggu', NULL, '2025-05-19 11:23:32', NULL, 0),
(16, 2, 'Samsul', 'fajri30.r@gmail.com', '089876654334', 'Pidana', 'Pendampingan', 750000, '600000.00', 1000000, '2025-05-19', 'Lampung', 'Oke', 'Menunggu', NULL, '2025-05-19 11:31:49', NULL, 0),
(17, 2, 'Jhoni', 'fajri30.r@gmail.com', '089876632332', 'Perusahaan', 'Pembuatan Dokumen', 500000, '400000.00', 599999, '2025-05-19', 'Jakarta', 'new', 'Menunggu', NULL, '2025-05-19 11:37:06', NULL, 0),
(18, 2, 'fajri', 'fajri30.r@gmail.com', '085706125411', 'Pidana', 'Pembuatan Dokumen', 900000, '720000.00', 1500000, '2025-05-19', 'Jakarta', 'new', 'Menunggu', NULL, '2025-05-19 11:41:21', 3, 0),
(19, 14, 'Ahmad Fauzi', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta', 'sdas', 'Menunggu', NULL, '2025-05-28 07:43:33', NULL, 0),
(20, 14, 'vannes', 'vns@gmail.com', '987656789', 'Perdata', 'Konsultasi', 500000, '400000.00', 500000, '2006-02-22', 'jakarta', 'sa', 'Menunggu', NULL, '2025-05-28 08:55:11', NULL, 0),
(21, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Tenaga Kerja', 'Konsultasi', 500000, '400000.00', 500000, '2026-05-23', 'jakarta', 'testing', 'Menunggu', '1748423100876-LogoKecil.png', '2025-05-28 09:05:00', NULL, 0),
(22, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Pidana', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta', 'sadsa', 'Menunggu', NULL, '2025-05-28 09:13:31', NULL, 0),
(23, 14, 'Ahmad Fauzi', 'vns@gmail.com', '987656789', 'Pidana', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta', 'aa', 'Menunggu', NULL, '2025-05-28 09:33:04', NULL, 0),
(24, 14, 'vannes', 'vns@gmail.com', '987656789', 'Perdata', 'Pembuatan Dokumen', 500000, '400000.00', 500000, '4444-03-23', 'jakarta', 'sasa', 'Menunggu', NULL, '2025-05-28 09:39:01', NULL, 0),
(25, 14, 'Ahmad Fauzi', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '6332-02-21', 'jakarta', 'saaa', 'Menunggu', '1748425974795-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 09:52:54', NULL, 0),
(26, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426627009-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:03:47', NULL, 0),
(27, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426632451-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:03:52', NULL, 0),
(28, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426733153-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:05:33', NULL, 0),
(29, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426751151-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:05:51', NULL, 0),
(30, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426762584-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:06:02', NULL, 0),
(31, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2005-04-22', 'jakarta', 'TES', 'Menunggu', '1748426765810-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:06:05', NULL, 0),
(32, 14, 'manusia dingin', 'vns@gmail.com', '987656789', 'Perdata', 'Konsultasi', 500000, '400000.00', 500000, '2222-02-22', 'jakarta', 'SAS', 'Menunggu', '1748426878184-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:07:58', NULL, 0),
(33, 14, 'Ahmad Fauzi', 'vns@gmail.com', '333', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '3333-03-01', 'jakarta', 'SAA', 'Menunggu', NULL, '2025-05-28 10:09:06', NULL, 0),
(34, 14, 'Ahmad Fauzi', 'vns@gmail.com', '333', 'Perdata', 'Konsultasi', 500000, '400000.00', 500000, '2222-02-03', 'jakarta', '2', 'Menunggu', NULL, '2025-05-28 10:10:39', NULL, 0),
(35, 14, 'vanes', 'vns@gmail.com', '0986544', 'Pidana', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sas', 'Menunggu', '1748429281335-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 10:48:01', NULL, 0),
(36, 14, 'vanes', 'vns@gmail.com', '085781086148', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sfas', 'Menunggu', NULL, '2025-05-28 10:55:25', NULL, 0),
(37, 14, 'vanes', 'vns@gmail.com', '085781086148', 'Keluarga', 'Konsultasi', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sa', 'Menunggu', NULL, '2025-05-28 11:43:16', NULL, 0),
(38, 14, 'vanes', 'vns@gmail.com', '085781086148', 'Pidana', 'Konsultasi', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sasa', 'Menunggu', '1748433123923-WIN_20250526_11_01_41_Pro.jpg', '2025-05-28 11:52:03', NULL, 0),
(39, 14, 'vanes', 'vns@gmail.com', '0986544', 'Keluarga', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sas', 'Menunggu', NULL, '2025-05-28 11:55:40', NULL, 0),
(40, 14, 'percobaan', 'vns@gmail.com', '085781086148', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'sadas', 'Menunggu', NULL, '2025-05-28 19:53:50', NULL, 0),
(41, 14, 'vanes', 'vns@gmail.com', '0986544', 'Perusahaan', 'Litigasi', 500000, '400000.00', 500000, '9999-09-09', 'jakarta ', 'sas', 'Menunggu', NULL, '2025-05-28 19:55:22', NULL, 0),
(42, 14, 'SENKA - Perfect Whip Berry Bright', 'vns@gmail.com', '085781086148', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '3333-03-22', 'jakarta ', 'daf', 'Menunggu', NULL, '2025-05-28 19:58:02', NULL, 0),
(43, 14, 'vanes', 'vns@gmail.com', '085781086148', 'Pidana', 'Konsultasi', 500000, '400000.00', 500000, '7584-02-22', 'jakarta ', 'testing setelah pull', 'Menunggu', NULL, '2025-05-29 10:24:02', NULL, 0),
(44, 14, 'testing', 'vns@gmail.com', '085781086148', 'Perdata', 'Pendampingan', 500000, '400000.00', 500000, '2222-02-22', 'jakarta ', 'testing', 'Menunggu', NULL, '2025-05-29 11:20:56', NULL, 0),
(45, 14, 'Perfect Whip Berry Bright', 'vns@gmail.com', '085781086148', 'testing', 'Pendampingan', 500000, '400000.00', 500000, '9990-09-08', 'jakarta ', 'testing\r\n', 'Menunggu', NULL, '2025-05-29 11:22:55', NULL, 0),
(46, 9, 'demo woi', 'demon@gmail.com', '1283187321723', 'Perdata', 'Pembuatan Dokumen', 5000000, '4000000.00', 500000, '2025-06-18', 'tes', 'tes', 'Selesai', NULL, '2025-06-17 03:25:57', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `artikel`
--

CREATE TABLE `artikel` (
  `id` int NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `deskripsi` varchar(10000) COLLATE utf8mb4_general_ci NOT NULL,
  `jenis_hukum` enum('Pidana','Perdata','Internasional','Ketenagakerjaan','HAKI','Keluarga','Administrasi Negara') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `filePath` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `coverPath` varchar(225) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nomor` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tahun` int NOT NULL,
  `jenis_dokumen` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tempat_penetapan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('Aktif','Tidak Aktif') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Aktif',
  `tanggal_penetapan` date NOT NULL DEFAULT '2000-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artikel`
--

INSERT INTO `artikel` (`id`, `judul`, `deskripsi`, `jenis_hukum`, `filePath`, `coverPath`, `nomor`, `tahun`, `jenis_dokumen`, `tempat_penetapan`, `status`, `tanggal_penetapan`) VALUES
(29, 'Dasar Hukum Internasional', 'Hukum Internasional merupakan cabang ilmu hukum yang mengatur hubungan antar negara dan aktor internasional lainnya di dunia. Artikel ini membahas konsep dasar, prinsip-prinsip, serta ruang lingkup hukum internasional yang meliputi perjanjian internasional, norma, serta kebiasaan yang mengikat secara hukum bagi negara-negara anggota komunitas internasional. Selain itu, artikel ini juga menjelaskan peranan lembaga-lembaga internasional seperti Perserikatan Bangsa-Bangsa (PBB), Mahkamah Internasional, serta mekanisme penyelesaian sengketa antar negara.\r\n\r\nDengan memahami hukum internasional, kita dapat mengerti bagaimana aturan dan norma diterapkan untuk menjaga perdamaian, keamanan, serta keadilan global.', 'Internasional', 'uploads\\1747768089749.pdf', NULL, 'LEG/MEMO/005/II/2025', 2020, 'PDF', 'Dokumen ', 'Aktif', '2025-05-23'),
(30, 'Dasar Hukum Ketenagakerjaan', 'Hukum Ketenagakerjaan adalah cabang hukum yang mengatur hubungan antara pekerja, pemberi kerja, dan pemerintah dalam dunia kerja. Artikel ini mengulas berbagai aturan dan prinsip yang melindungi hak serta kewajiban pekerja dan pengusaha, termasuk perjanjian kerja, upah, jam kerja, keselamatan dan kesehatan kerja, serta penyelesaian perselisihan ketenagakerjaan.\r\n\r\nSelain itu, artikel ini juga membahas peranan Undang-Undang Ketenagakerjaan di Indonesia, mekanisme perlindungan tenaga kerja, dan kebijakan pemerintah dalam menciptakan kondisi kerja yang adil dan aman. Dengan memahami hukum ketenagakerjaan, baik pekerja maupun pengusaha dapat menjalankan hak dan kewajibannya secara seimbang demi terciptanya hubungan industrial yang harmonis dan produktif.', 'Ketenagakerjaan', 'uploads\\1747768492353.pdf', NULL, 'LEG/PND/008/IV/2025', 2018, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(31, 'Hukum Hak Kekayaan Intelektual (HAKI)', 'Hukum Hak Atas Kekayaan Intelektual (HAKI) adalah cabang hukum yang melindungi karya-karya hasil kreativitas dan inovasi manusia, seperti karya seni, penemuan teknologi, merek dagang, dan desain industri. Artikel ini membahas berbagai jenis hak kekayaan intelektual, termasuk hak cipta, paten, merek dagang, desain industri, dan rahasia dagang, serta mekanisme perlindungan hukum yang diberikan kepada pemilik hak tersebut.  Selain itu, artikel ini juga menjelaskan pentingnya HAKI dalam mendorong kemajuan ilmu pengetahuan, teknologi, dan seni, serta bagaimana hukum ini membantu melindungi hak dan kepentingan pencipta atau penemu dari penyalahgunaan atau pembajakan. Pembahasan juga mencakup proses pendaftaran hak kekayaan intelektual di Indonesia dan tantangan dalam penegakan hukum HAKI di era digital.', 'HAKI', 'uploads\\1747768770683.pdf', NULL, 'LEG/PND/009/IV/2025', 2019, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(32, 'Pengantar Hukum Tata Negara', 'Hukum Tata Negara merupakan cabang ilmu hukum yang mempelajari aturan dan prinsip dasar yang mengatur penyelenggaraan negara serta hubungan antara lembaga-lembaga negara dengan warga negara. Artikel ini memberikan pengantar mengenai konsep dasar hukum tata negara, termasuk bentuk dan sistem pemerintahan, pembagian kekuasaan, serta peran konstitusi sebagai sumber utama hukum tata negara.  Pembahasan juga mencakup hak dan kewajiban warga negara dalam sistem kenegaraan serta mekanisme pengawasan dan pertanggungjawaban pemerintah. Dengan memahami hukum tata negara, masyarakat dapat lebih sadar akan struktur negara dan tata kelola pemerintahan yang demokratis dan berdasarkan hukum.', 'Administrasi Negara', 'uploads\\1747769056072.pdf', NULL, '	LEG/PND/010/IV/2025', 2017, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(33, 'Hukum Administrasi Negara', 'Hukum Administrasi Negara adalah cabang ilmu hukum yang mengatur tata cara dan prinsip penyelenggaraan administrasi pemerintahan oleh lembaga negara dan pejabat publik. Artikel ini membahas ruang lingkup hukum administrasi negara, termasuk peraturan tentang pembuatan keputusan administratif, pelaksanaan fungsi pemerintahan, serta mekanisme pengawasan dan penegakan hukum terhadap tindakan administratif.  Pembahasan juga menyoroti peran hukum administrasi negara dalam menjamin agar penyelenggaraan pemerintahan berjalan transparan, akuntabel, dan sesuai dengan prinsip negara hukum (rechtsstaat). Dengan memahami hukum administrasi negara, masyarakat dapat mengawasi kinerja pemerintah dan menuntut perlindungan hukum atas tindakan administratif yang merugikan.', 'Administrasi Negara', 'uploads\\1747769890162.pdf', NULL, 'LEG/PND/011/IV/2025', 2023, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(34, 'Panduan Hukum Perdata', 'Hukum Perdata adalah cabang hukum yang mengatur hubungan hukum antara individu atau badan hukum secara privat, termasuk hak dan kewajiban yang timbul dalam kehidupan sehari-hari. Artikel ini membahas ruang lingkup hukum perdata seperti perjanjian, harta kekayaan, warisan, dan tanggung jawab perdata.  Selain itu, artikel ini menjelaskan prinsip-prinsip dasar hukum perdata, seperti itikad baik dan keadilan, serta mekanisme penyelesaian sengketa melalui peradilan perdata. Dengan memahami hukum perdata, masyarakat dapat melindungi hak-haknya dalam hubungan hukum pribadi dan menjalankan kewajiban secara tepat sesuai aturan yang berlaku.', 'Perdata', 'uploads\\1747770045750.pdf', NULL, 'LEG/PND/012/IV/2025', 2016, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(35, 'Dasar-dasar Hukum Pidana Indonesia', 'Hukum Pidana Indonesia merupakan cabang hukum yang mengatur tentang perbuatan-perbuatan yang dilarang dan sanksi yang dikenakan terhadap pelanggarnya demi menjaga ketertiban dan keadilan dalam masyarakat. Artikel ini membahas konsep dasar hukum pidana, termasuk asas-asas hukum pidana, jenis-jenis tindak pidana, serta prosedur penegakan hukum pidana di Indonesia.  Pembahasan juga meliputi prinsip-prinsip seperti legalitas, kepastian hukum, dan perlindungan hak asasi manusia dalam proses pidana. Dengan memahami dasar-dasar hukum pidana, masyarakat dapat mengenali batasan perilaku yang diatur dan konsekuensi hukum yang mungkin timbul, sekaligus mendukung penegakan hukum yang adil dan efektif.', 'Pidana', 'uploads\\1747770129718.pdf', NULL, 'LEG/PND/013/IV/2025', 2015, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(36, 'Hukum Keluarga Islam', 'Hukum Keluarga Islam adalah cabang hukum yang mengatur hubungan dan tata kelola keluarga berdasarkan prinsip-prinsip syariah Islam. Artikel ini membahas berbagai aspek penting dalam hukum keluarga Islam, seperti pernikahan, hak dan kewajiban suami-istri, perceraian, nafkah, warisan, serta hak anak.  Pembahasan juga mencakup dasar-dasar hukum Islam yang menjadi landasan aturan keluarga, termasuk Al-Qur’an dan Hadis, serta penerapan hukum keluarga Islam dalam sistem hukum nasional Indonesia. Dengan memahami hukum keluarga Islam, masyarakat dapat menjalankan kehidupan berkeluarga secara harmonis sesuai dengan ajaran agama dan ketentuan hukum yang berlaku.', 'Keluarga', 'uploads\\1747770459925.pdf', NULL, 'LEG/PND/013/IV/2025', 2022, 'PDF', 'Dokumen', 'Aktif', '2025-05-21'),
(39, 'tes edit', 'tes edit', 'Perdata', 'uploads/1748516820696.pdf', 'uploads/covers/cover_1748516820698-01.jpg', '91', 2028, 'tes edit', 'tes edit', 'Aktif', '4666-02-19');

-- --------------------------------------------------------

--
-- Table structure for table `artikel_berita`
--

CREATE TABLE `artikel_berita` (
  `id` int NOT NULL,
  `judul` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `isi` text COLLATE utf8mb4_general_ci NOT NULL,
  `gambar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kategori` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `top_berita` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artikel_berita`
--

INSERT INTO `artikel_berita` (`id`, `judul`, `isi`, `gambar`, `kategori`, `created_at`, `top_berita`) VALUES
(1, 'Pemahaman Dasar Hukum Perdata di Indonesia', 'Hukum Perdata mengatur hubungan antar individu. Dalam praktiknya, hukum ini mencakup urusan warisan, perjanjian, dan tanggung jawab perdata.', '1747161770196-1 akta.jpeg', NULL, '2025-05-13 08:23:08', 1),
(2, 'Hukum Pidana: Jenis dan Penerapannya di Masyarakat', 'Hukum pidana adalah perangkat aturan yang berkaitan dengan pelanggaran terhadap hukum yang dikenai sanksi pidana. Ini mencakup pencurian, kekerasan, dan kejahatan lainnya.', '1747161408325-2 pidana.jpg', NULL, '2025-05-13 08:23:08', 1),
(3, 'Panduan Menghadapi Perceraian secara Hukum', 'Perceraian diatur dalam hukum keluarga dan perdata. Prosesnya bisa ditempuh melalui pengadilan agama atau negeri, tergantung agama dan status perkawinan.', '1747161419797-3 cerai.jpg', NULL, '2025-05-13 08:23:08', 1),
(4, 'Langkah Hukum Menghadapi PHK Sepihak', 'PHK sepihak oleh perusahaan dapat dituntut ke Pengadilan Hubungan Industrial. Pastikan Anda memahami hak-hak Anda sebagai pekerja.', '1747161449492-4 PHK.jpg', NULL, '2025-05-13 08:23:08', 1),
(5, 'Kekerasan Dalam Rumah Tangga (KDRT): Cara Melapor dan Perlindungan Hukum', 'UU Penghapusan KDRT memberi perlindungan pada korban. Pelaporan bisa dilakukan ke kepolisian, rumah sakit, atau lembaga bantuan hukum.', '1747161488068-5 KDRT.webp', NULL, '2025-05-13 08:23:08', 0),
(6, 'Cybercrime: Perlindungan Hukum Terhadap Kejahatan Digital', 'Tindakan seperti penipuan online, hacking, atau pencemaran nama baik di internet kini bisa diproses secara hukum berdasarkan UU ITE.', '1747161647043-6 Cybercrime.jpg', NULL, '2025-05-13 08:23:08', 0),
(7, 'Cara Mengurus Surat Kuasa Hukum yang Sah', 'Surat kuasa hukum digunakan untuk mewakilkan seseorang dalam proses hukum. Format dan legalitasnya diatur dalam KUHPerdata.', '1747161654826-7 Surat.webp', NULL, '2025-05-13 08:23:08', 0),
(8, 'Perlindungan Konsumen dalam Transaksi Online', 'UU Perlindungan Konsumen dan Peraturan Perdagangan Elektronik melindungi hak konsumen dalam transaksi digital.', '1747161661142-8 transaksi.jpg', NULL, '2025-05-13 08:23:08', 0);

-- --------------------------------------------------------

--
-- Table structure for table `faq_hukum`
--

CREATE TABLE `faq_hukum` (
  `id` int NOT NULL,
  `intent` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kategori` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `keywords` text COLLATE utf8mb4_general_ci,
  `contoh_pertanyaan` text COLLATE utf8mb4_general_ci,
  `response` text COLLATE utf8mb4_general_ci,
  `sumber_referensi` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faq_hukum`
--

INSERT INTO `faq_hukum` (`id`, `intent`, `kategori`, `keywords`, `contoh_pertanyaan`, `response`, `sumber_referensi`) VALUES
(1, 'kdrt', NULL, '[\"kdrt\", \"kekerasan dalam rumah tangga\", \"pukulan\", \"aniaya\"]', NULL, 'KDRT diatur dalam UU No. 23 Tahun 2004. Korban bisa lapor ke polisi atau LBH.', NULL),
(2, 'perceraian', NULL, '[\"cerai\", \"perceraian\", \"gugatan cerai\", \"bercerai\", \"pisah\"]', NULL, 'Perceraian diajukan ke pengadilan agama/negeri sesuai status nikah.', NULL),
(3, 'warisan', 'perdata', '[\"warisan\", \"harta waris\", \"pembagian warisan\", \"hak ahli waris\", \"hukum waris\"]', 'Bagaimana cara pembagian warisan dalam hukum Islam?', 'Pembagian warisan mengikuti hukum Islam (Kompilasi Hukum Islam) atau KUHPerdata, tergantung agama pewaris.', 'https://peraturan.bpk.go.id/Home/Details/46974/kompilasi-hukum-islam'),
(4, 'ite', 'pidana', '[\"uu ite\", \"hukum internet\", \"fitnah online\", \"pasal 27\", \"sara online\", \"cybercrime\", \"undang undang ite\"]', 'Apakah menyebarkan hoaks termasuk pelanggaran UU ITE?', 'Ya, penyebaran informasi bohong atau pencemaran nama baik di internet dapat dijerat pasal 27 ayat (3) UU ITE.', 'https://peraturan.bpk.go.id/Home/Details/37582/uu-no-19-tahun-2016'),
(5, 'adopsi', 'keluarga', '[\"adopsi\", \"anak angkat\", \"proses adopsi\", \"mengadopsi anak\", \"hukum adopsi\"]', 'Apa syarat untuk mengadopsi anak secara hukum?', 'Adopsi anak harus melalui keputusan pengadilan serta rekomendasi dari dinas sosial sesuai PP No. 54 Tahun 2007.', 'https://peraturan.bpk.go.id/Home/Details/4806/pp-no-54-tahun-2007'),
(6, 'kdrt', 'pidana', '[\"kdrt\", \"kekerasan dalam rumah tangga\", \"kekerasan fisik\", \"kekerasan verbal\", \"suami kasar\", \"istri kasar\"]', 'Bagaimana prosedur melapor jika terjadi KDRT?', 'Korban KDRT dapat melapor ke kepolisian, rumah sakit, atau lembaga bantuan hukum. Bukti visum dapat memperkuat laporan.', 'https://peraturan.bpk.go.id/Home/Details/41769/uu-no-23-tahun-2004'),
(7, 'perceraian', 'keluarga', '[\"cerai\", \"perceraian\", \"gugat cerai\", \"bercerai\", \"pisah\", \"proses cerai\"]', 'Apa yang perlu disiapkan sebelum mengajukan perceraian?', 'Untuk mengajukan perceraian dibutuhkan surat nikah, KTP, bukti perselisihan, dan pengajuan ke pengadilan sesuai domisili.', 'https://www.mahkamahagung.go.id/id/pengadilan/agama'),
(8, 'kdrt', 'pidana', '[\"kdrt\", \"kekerasan dalam rumah tangga\", \"pukulan\", \"aniaya\"]', NULL, 'KDRT diatur dalam UU No. 23 Tahun 2004. Korban bisa lapor ke polisi atau LBH.', NULL),
(9, 'kdrt', 'pidana', '[\"kdrt\", \"kekerasan dalam rumah tangga\", \"kekerasan fisik\", \"kekerasan verbal\", \"suami kasar\", \"istri kasar\"]', 'Bagaimana prosedur melapor jika terjadi KDRT?', 'Korban KDRT dapat melapor ke kepolisian, rumah sakit, atau lembaga bantuan hukum. Bukti visum dapat memperkuat laporan.', 'https://peraturan.bpk.go.id/Home/Details/41769/uu-no-23-tahun-2004'),
(10, 'perceraian', 'keluarga', '[\"cerai\", \"perceraian\", \"gugatan cerai\", \"bercerai\", \"pisah\"]', NULL, 'Perceraian diajukan ke pengadilan agama/negeri sesuai status nikah.', NULL),
(11, 'perceraian', 'keluarga', '[\"cerai\", \"perceraian\", \"gugat cerai\", \"bercerai\", \"pisah\", \"proses cerai\"]', 'Apa yang perlu disiapkan sebelum mengajukan perceraian?', 'Untuk mengajukan perceraian dibutuhkan surat nikah, KTP, bukti perselisihan, dan pengajuan ke pengadilan sesuai domisili.', 'https://www.mahkamahagung.go.id/id/pengadilan/agama'),
(12, 'warisan', 'perdata', '[\"warisan\", \"harta waris\", \"pembagian warisan\", \"hak ahli waris\", \"hukum waris\"]', 'Bagaimana cara pembagian warisan dalam hukum Islam?', 'Pembagian warisan mengikuti hukum Islam (Kompilasi Hukum Islam) atau KUHPerdata, tergantung agama pewaris.', 'https://peraturan.bpk.go.id/Home/Details/46974/kompilasi-hukum-islam'),
(13, 'ite', 'pidana', '[\"uu ite\", \"hukum internet\", \"fitnah online\", \"pasal 27\", \"sara online\", \"cybercrime\", \"undang undang ite\"]', 'Apakah menyebarkan hoaks termasuk pelanggaran UU ITE?', 'Ya, penyebaran informasi bohong atau pencemaran nama baik di internet dapat dijerat pasal 27 ayat (3) UU ITE.', 'https://peraturan.bpk.go.id/Home/Details/37582/uu-no-19-tahun-2016'),
(14, 'adopsi', 'keluarga', '[\"adopsi\", \"anak angkat\", \"proses adopsi\", \"mengadopsi anak\", \"hukum adopsi\"]', 'Apa syarat untuk mengadopsi anak secara hukum?', 'Adopsi anak harus melalui keputusan pengadilan serta rekomendasi dari dinas sosial sesuai PP No. 54 Tahun 2007.', 'https://peraturan.bpk.go.id/Home/Details/4806/pp-no-54-tahun-2007'),
(15, 'kontrak kerja', 'perdata', '[\"[\\\"kontrak kerja\\\"\",\"\\\"perjanjian kerja\\\"\",\"\\\"hak karyawan\\\"]\"]', 'Apa hak-hak karyawan dalam kontrak kerja?', 'Hak karyawan diatur dalam UU Ketenagakerjaan, meliputi upah, jaminan sosial, cuti, dan perlindungan kerja lainnya.', 'https://peraturan.bpk.go.id/Home/Details/41317/uu-no-13-tahun-2003'),
(16, 'narkotika', 'pidana', '[\"narkoba\", \"narkotika\", \"sabu\", \"ganja\", \"zat adiktif\"]', 'Apa ancaman hukum bagi pengguna narkoba?', 'Pengguna narkotika bisa dikenakan pasal 127 UU No. 35 Tahun 2009 tentang Narkotika dengan ancaman rehabilitasi atau pidana penjara.', 'https://peraturan.bpk.go.id/Home/Details/39010/uu-no-35-tahun-2009'),
(17, 'perjanjian sewa', 'perdata', '[\"kontrak sewa\", \"sewa rumah\", \"perjanjian sewa\", \"sewa menyewa\", \"hak penyewa\"]', 'Bagaimana kekuatan hukum kontrak sewa rumah?', 'Perjanjian sewa menyewa merupakan perjanjian sah menurut KUHPerdata selama memenuhi syarat sah perjanjian (Pasal 1320 KUHPerdata).', 'https://peraturan.bpk.go.id/Home/Details/48159/kuhp-perdata'),
(18, 'utang piutang', 'perdata', '[\"utang\", \"piutang\", \"pinjam uang\", \"surat utang\", \"utang pribadi\"]', 'Bagaimana menyelesaikan sengketa utang piutang secara hukum?', 'Sengketa utang piutang dapat diselesaikan secara perdata di pengadilan atau melalui mediasi. Bukti tertulis sangat penting.', 'https://peraturan.bpk.go.id/Home/Details/48159/kuhp-perdata'),
(19, 'pencemaran nama baik', 'pidana', '[\"fitnah\", \"pencemaran nama\", \"ujaran kebencian\", \"pasal 310\", \"pasal 311\"]', 'Apakah menghina seseorang di media sosial bisa dipidana?', 'Ya, pencemaran nama baik diatur dalam KUHP Pasal 310 dan 311 serta UU ITE Pasal 27 ayat 3. Pelaku bisa dipidana.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(20, 'penipuan', 'pidana', '[\"penipuan\", \"scam\", \"modus penipuan\", \"tindak pidana penipuan\", \"pasal 378\"]', 'Apa pasal yang digunakan untuk menjerat pelaku penipuan?', 'Pelaku penipuan dapat dijerat Pasal 378 KUHP dengan ancaman pidana maksimal 4 tahun penjara.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(21, 'definisi_hukum_pidana', 'pidana', '[\"apa itu hukum pidana\", \"definisi hukum pidana\", \"pengertian hukum pidana\", \"pidana itu apa\"]', 'Apa itu hukum pidana?', 'Hukum pidana adalah cabang hukum yang mengatur tentang perbuatan yang dilarang dan diancam dengan pidana, serta prosedur penegakannya oleh aparat hukum seperti polisi dan jaksa.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(22, 'definisi_hukum_perdata', 'perdata', '[\"apa itu hukum perdata\", \"pengertian hukum perdata\", \"perdata itu apa\", \"definisi hukum privat\"]', 'Apa itu hukum perdata?', 'Hukum perdata adalah hukum yang mengatur hubungan antar individu dalam masyarakat, seperti perjanjian, warisan, perkawinan, dan utang-piutang.', 'https://peraturan.bpk.go.id/Home/Details/48159/kuhp-perdata'),
(23, 'definisi_hukum_tata_negara', 'tata negara', '[\"apa itu hukum tata negara\", \"pengertian hukum tata negara\", \"hukum negara\", \"konstitusi\", \"undang-undang dasar\"]', 'Apa itu hukum tata negara?', 'Hukum tata negara adalah cabang hukum yang mengatur struktur dan fungsi lembaga-lembaga negara serta hubungan antara negara dan warga negara.', 'https://peraturan.bpk.go.id/Home/Details/37974/uu-no-24-tahun-2003'),
(24, 'definisi_hukum_administrasi', 'administrasi negara', '[\"apa itu hukum administrasi\", \"pengertian hukum administrasi negara\", \"peraturan pemerintah\", \"putusan pejabat publik\"]', 'Apa itu hukum administrasi negara?', 'Hukum administrasi negara mengatur hubungan antara pemerintah (pejabat administrasi) dengan warga negara dalam konteks pelayanan publik dan pelaksanaan tugas negara.', 'https://peraturan.bpk.go.id/Home/Details/39706/uu-no-30-tahun-2014'),
(25, 'definisi_hukum_acara', 'acara', '[\"apa itu hukum acara\", \"pengertian hukum acara\", \"prosedur pengadilan\", \"hukum acara pidana\", \"hukum acara perdata\"]', 'Apa itu hukum acara?', 'Hukum acara adalah aturan tentang tata cara menjalankan proses peradilan, baik dalam perkara pidana maupun perdata, mulai dari penyelidikan hingga putusan.', 'https://peraturan.bpk.go.id/Home/Details/37630/kuhap'),
(26, 'definisi_hukum_internasional', 'internasional', '[\"apa itu hukum internasional\", \"pengertian hukum internasional\", \"hukum antarnegara\", \"perjanjian internasional\"]', 'Apa itu hukum internasional?', 'Hukum internasional adalah seperangkat aturan yang mengatur hubungan antara negara-negara dan organisasi internasional, termasuk perjanjian dan konvensi internasional.', 'https://www.un.org/en/about-us/un-charter'),
(27, 'definisi_hukum_adat', 'adat', '[\"apa itu hukum adat\", \"pengertian hukum adat\", \"hukum tradisional\", \"norma adat\"]', 'Apa itu hukum adat?', 'Hukum adat adalah aturan-aturan tidak tertulis yang hidup dan berlaku dalam masyarakat tertentu berdasarkan kebiasaan yang diwariskan turun-temurun.', 'https://peraturan.bpk.go.id/Home/Details/38937/uu-no-6-tahun-2014'),
(28, 'izin_usaha', 'perizinan', '[\"izin usaha\", \"cara membuat izin usaha\", \"nib\", \"oss\", \"legalitas usaha\"]', 'Bagaimana cara membuat izin usaha secara resmi?', 'Untuk membuat izin usaha, pelaku usaha harus mendaftarkan usahanya melalui sistem OSS (Online Single Submission) dan mendapatkan NIB (Nomor Induk Berusaha).', 'https://oss.go.id'),
(29, 'hak_asasi_manusia', 'ham', '[\"ham\", \"hak asasi\", \"pelanggaran ham\", \"kebebasan berpendapat\", \"hukum ham\"]', 'Apa saja contoh pelanggaran HAM di Indonesia?', 'Pelanggaran HAM dapat berupa pembatasan kebebasan berpendapat, diskriminasi, penyiksaan, atau pembunuhan tanpa proses hukum.', 'https://peraturan.bpk.go.id/Home/Details/45678/uu-no-39-tahun-1999'),
(30, 'sengketa_tanah', 'agraria', '[\"sengketa tanah\", \"sengketa agraria\", \"kepemilikan tanah\", \"sertifikat tanah\"]', 'Bagaimana cara menyelesaikan sengketa tanah?', 'Sengketa tanah dapat diselesaikan melalui mediasi di BPN, gugatan ke pengadilan, atau pengaduan ke Pengadilan Tata Usaha Negara jika melibatkan keputusan pemerintah.', 'https://peraturan.bpk.go.id/Home/Details/4747/uu-no-5-tahun-1960'),
(31, 'perdagangan_orang', 'pidana', '[\"perdagangan orang\", \"human trafficking\", \"eksploitasi manusia\", \"tppo\"]', 'Apa sanksi hukum bagi pelaku perdagangan orang?', 'Pelaku perdagangan orang dapat dijerat UU No. 21 Tahun 2007 dengan hukuman penjara maksimal 15 tahun dan/atau denda maksimal Rp600 juta.', 'https://peraturan.bpk.go.id/Home/Details/39642/uu-no-21-tahun-2007'),
(32, 'perzinahan', 'pidana', '[\"perzinahan\", \"selingkuh\", \"hubungan di luar nikah\", \"zina\", \"perselingkuhan\"]', 'Apakah perzinahan bisa dipidana di Indonesia?', 'Ya, perzinahan dapat diproses hukum jika dilaporkan oleh pasangan resmi, sesuai dengan Pasal 284 KUHP.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(33, 'perlindungan_konsumen', 'perdata', '[\"konsumen\", \"perlindungan konsumen\", \"hak konsumen\", \"sengketa konsumen\"]', 'Apa saja hak-hak konsumen menurut hukum?', 'Hak konsumen diatur dalam UU No. 8 Tahun 1999, seperti hak atas keamanan produk, informasi benar, serta mendapat kompensasi jika dirugikan.', 'https://peraturan.bpk.go.id/Home/Details/43585/uu-no-8-tahun-1999'),
(34, 'sanksi_pelanggaran_prokes', 'pidana', '[\"prokes\", \"pelanggaran prokes\", \"sanksi covid\", \"masker\", \"kerumunan saat pandemi\"]', 'Apakah ada sanksi hukum bagi pelanggar protokol kesehatan?', 'Ya, pelanggaran protokol kesehatan dapat dikenakan sanksi pidana atau administratif sesuai peraturan daerah atau UU Karantina Kesehatan.', 'https://peraturan.bpk.go.id/Home/Details/41143/uu-no-6-tahun-2018'),
(35, 'perdata_vs_pidana', 'umum', '[\"perbedaan pidana dan perdata\", \"pidana vs perdata\", \"jenis hukum\", \"contoh pidana\", \"contoh perdata\"]', 'Apa perbedaan antara hukum pidana dan hukum perdata?', 'Hukum pidana mengatur perbuatan yang dilarang negara (seperti pencurian, pembunuhan), sedangkan hukum perdata mengatur sengketa antar individu seperti warisan, kontrak, dan perceraian.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(36, 'sita_harta_gono_gini', 'keluarga', '[\"sita harta bersama\", \"gono gini\", \"pembagian harta cerai\", \"harta perkawinan\", \"sita harta\"]', 'Bagaimana cara menyita harta gono-gini dalam perceraian?', 'Pihak yang bercerai dapat mengajukan gugatan pembagian harta bersama (gono-gini) ke pengadilan. Harta yang diperoleh selama perkawinan akan dibagi sesuai hukum yang berlaku.', 'https://peraturan.bpk.go.id/Home/Details/46974/kompilasi-hukum-islam'),
(37, 'pencemaran_lingkungan', 'lingkungan', '[\"pencemaran lingkungan\", \"limbah pabrik\", \"perusakan lingkungan\", \"pidana lingkungan\", \"kerusakan alam\"]', 'Apa sanksi hukum bagi perusahaan yang mencemari lingkungan?', 'Perusahaan yang mencemari lingkungan bisa dikenai sanksi administratif, perdata, dan pidana sesuai UU No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup.', 'https://peraturan.bpk.go.id/Home/Details/39707/uu-no-32-tahun-2009'),
(38, 'hak_asuh_anak', 'keluarga', '[\"hak asuh anak\", \"perebutan anak\", \"pengasuhan anak\", \"custody\", \"anak cerai\"]', 'Siapa yang berhak atas anak setelah perceraian?', 'Hak asuh anak biasanya diberikan kepada ibu, kecuali terbukti tidak layak. Pengadilan mempertimbangkan kepentingan terbaik bagi anak.', 'https://peraturan.bpk.go.id/Home/Details/46974/kompilasi-hukum-islam'),
(39, 'lapor_pencurian', 'pidana', '[\"lapor pencurian\", \"barang hilang\", \"lapor ke polisi\", \"pencurian motor\", \"laporan kehilangan\"]', 'Bagaimana prosedur melaporkan pencurian ke polisi?', 'Korban pencurian harus segera melapor ke kantor polisi terdekat dengan membawa bukti kepemilikan, identitas diri, dan kronologi kejadian.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(40, 'ancaman_medsos', 'pidana', '[\"ancaman online\", \"ancaman di medsos\", \"mengancam lewat chat\", \"pasal ancaman\", \"ite\"]', 'Apakah mengancam orang lewat WhatsApp bisa dipidana?', 'Ya, ancaman melalui media elektronik termasuk pidana. Pelaku bisa dijerat Pasal 29 jo. Pasal 45B UU ITE dengan pidana penjara maksimal 4 tahun.', 'https://peraturan.bpk.go.id/Home/Details/37582/uu-no-19-tahun-2016'),
(41, 'apa_itu_cerdas_hukum', 'umum', '[\"apa itu cerdas hukum\", \"cerdas hukum\", \"aplikasi hukum\", \"platform konsultasi hukum\", \"tentang cerdas hukum\"]', 'Apa itu platform Cerdas Hukum?', 'Cerdas Hukum adalah platform edukasi dan konsultasi hukum digital yang memberikan akses mudah bagi masyarakat untuk memahami hukum dan berinteraksi langsung dengan pengacara profesional.', NULL),
(42, 'pemalsuan_dokumen', 'pidana', '[\"pemalsuan dokumen\", \"ijazah palsu\", \"dokumen palsu\", \"ktp palsu\", \"pasal 263\"]', 'Apa ancaman pidana bagi pelaku pemalsuan dokumen?', 'Pemalsuan dokumen diatur dalam Pasal 263 KUHP dengan ancaman pidana penjara hingga 6 tahun.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(43, 'cara_konsultasi', 'panduan', '[\"cara konsultasi\", \"mulai konsultasi\", \"konsultasi hukum\", \"klik konsultasi\", \"hubungi pengacara\"]', 'Bagaimana cara melakukan konsultasi di website Cerdas Hukum?', 'Pengguna dapat klik tombol \"Konsultasi\" pada kartu pengacara di halaman utama. Setelah menyelesaikan pembayaran, pengguna akan diarahkan langsung ke halaman chat untuk berkonsultasi dengan pengacara yang dipilih.', NULL),
(44, 'cara_ajukan_kasus', 'panduan', '[\"cara ajukan kasus\", \"ajukan kasus hukum\", \"isi form kasus\", \"kirim kasus\"]', 'Bagaimana cara mengajukan kasus di Cerdas Hukum?', 'Klik menu \"Ajukan Kasus\", lalu isi formulir lengkap mengenai permasalahan hukum Anda, unggah bukti (jika ada), dan kirim. Kasus akan masuk ke sistem dan bisa diproses oleh pengacara.', NULL),
(45, 'cara_daftar_lawyer', 'panduan', '[\"cara daftar lawyer\", \"pendaftaran pengacara\", \"daftar sebagai pengacara\", \"gabung pengacara\"]', 'Bagaimana cara mendaftar sebagai pengacara di Cerdas Hukum?', 'Klik tombol \"Daftar Lawyer\" dan isi formulir pendaftaran. Unggah KTP, foto, kartu advokat, dan dokumen lain. Data akan diverifikasi oleh admin sebelum disetujui sebagai pengacara aktif.', NULL),
(46, 'cara_daftar_pengguna', 'panduan', '[\"cara daftar pengguna\", \"buat akun\", \"daftar user\", \"registrasi pengguna\"]', 'Bagaimana cara membuat akun pengguna di Cerdas Hukum?', 'Klik tombol \"Sign Up\", lengkapi data diri seperti nama, email, nomor HP, password, lalu klik daftar. Setelah itu, Anda dapat langsung login dan menggunakan layanan.', NULL),
(47, 'cara_login', 'panduan', '[\"cara login\", \"masuk akun\", \"akses akun\", \"login cerdas hukum\"]', 'Bagaimana cara login ke akun Cerdas Hukum?', 'Klik tombol \"Login\", lalu masukkan email dan password Anda. Pastikan email sudah terdaftar sebelumnya.', NULL),
(48, 'cara_forgot_password', 'panduan', '[\"lupa password\", \"reset password\", \"ganti password\", \"otp\", \"verifikasi email\"]', 'Bagaimana cara reset password jika lupa?', 'Klik \"Forgot Password\" di halaman login, masukkan email Anda, lalu kode OTP akan dikirimkan ke email. Masukkan OTP dan buat password baru untuk mengakses kembali akun.', NULL),
(49, 'cara_edit_profil', 'panduan', '[\"edit profil\", \"ubah data\", \"ganti informasi akun\", \"update profil\", \"ubah foto profil\"]', 'Bagaimana cara mengedit profil di Cerdas Hukum?', 'Buka halaman profil, klik tombol \"Edit Profil\", lalu ubah data yang diperlukan seperti nama, email, alamat, atau unggah foto baru. Simpan perubahan untuk memperbarui data Anda.', NULL),
(50, 'alur_pendaftaran_lawyer', 'panduan', '[\"alur pendaftaran pengacara\", \"verifikasi lawyer\", \"proses approve lawyer\"]', 'Bagaimana alur setelah mendaftar sebagai pengacara?', 'Setelah mendaftar, data Anda akan masuk ke daftar pendaftaran dan ditinjau oleh admin. Jika disetujui, Anda akan otomatis masuk ke daftar pengacara aktif dan bisa menerima kasus.', NULL),
(51, 'fitur_platform', 'panduan', '[\"fitur cerdas hukum\", \"apa saja fitur\", \"menu di cerdas hukum\", \"halaman yang tersedia\", \"layanan cerdas hukum\"]', 'Apa saja fitur yang tersedia di platform Cerdas Hukum?', 'Platform Cerdas Hukum menyediakan fitur: Konsultasi hukum online, Pengajuan kasus, Riwayat konsultasi dan kasus, Chat real-time dengan pengacara, Pendaftaran pengacara, serta pengelolaan artikel hukum dan berita.', NULL),
(52, 'fitur_chat_pengacara', 'panduan', '[\"chat pengacara\", \"konsultasi langsung\", \"hubungi pengacara\", \"fitur chat\", \"obrolan hukum\"]', 'Apakah saya bisa langsung mengobrol dengan pengacara?', 'Ya, setelah melakukan pembayaran konsultasi, Anda akan diarahkan ke fitur chat langsung dengan pengacara terkait di halaman chat.', NULL),
(53, 'fitur_riwayat', 'panduan', '[\"riwayat konsultasi\", \"riwayat kasus\", \"daftar konsultasi\", \"riwayat user\"]', 'Apakah saya bisa melihat riwayat konsultasi dan kasus saya?', 'Ya. Anda bisa mengakses menu \"Riwayat\" untuk melihat seluruh riwayat transaksi, konsultasi, dan kasus yang pernah diajukan.', NULL),
(54, 'pengacara_spesialisasi', 'pengacara', '[\"spesialisasi pengacara\", \"pengacara hukum pidana\", \"pengacara perdata\", \"pengacara keluarga\"]', 'Apakah saya bisa memilih pengacara sesuai spesialisasi?', 'Tentu. Setiap pengacara memiliki spesialisasi seperti Hukum Pidana, Perdata, Keluarga, Bisnis, Ketenagakerjaan, dan lainnya. Anda bisa memilih sesuai kebutuhan.', NULL),
(55, 'pengacara_bersertifikat', 'pengacara', '[\"pengacara terverifikasi\", \"pengacara resmi\", \"sertifikat pengacara\", \"kartu advokat\"]', 'Apakah pengacara di Cerdas Hukum sudah terverifikasi?', 'Ya. Semua pengacara yang terdaftar wajib mengunggah kartu advokat dan sertifikat PKPA. Tim admin akan memverifikasi data sebelum disetujui.', NULL),
(56, 'pengacara_tarif', 'pengacara', '[\"tarif pengacara\", \"biaya konsultasi\", \"harga konsultasi\", \"biaya chat lawyer\"]', 'Berapa tarif konsultasi dengan pengacara?', 'Tarif konsultasi standar adalah Rp50.000 per sesi. Harga bisa berbeda jika ditentukan khusus oleh pengacara terkait.', NULL),
(57, 'pengacara_profil', 'pengacara', '[\"lihat profil pengacara\", \"detail lawyer\", \"profil lawyer\", \"data pengacara\"]', 'Apakah saya bisa melihat profil lengkap pengacara?', 'Ya. Di halaman utama, Anda bisa melihat nama, foto, pengalaman, spesialisasi, dan universitas pengacara sebelum memilih konsultasi.', NULL),
(58, 'pengacara_edit_profil', 'pengacara', '[\"edit profil lawyer\", \"ubah data pengacara\", \"update profil lawyer\", \"ubah foto lawyer\"]', 'Bagaimana cara pengacara mengedit profilnya?', 'Pengacara dapat membuka halaman \"Edit Profil\" dan mengubah data seperti nama, alamat, spesialisasi, pendidikan, dan mengunggah foto baru.', NULL),
(59, 'pengacara_ambil_kasus', 'pengacara', '[\"pengacara ambil kasus\", \"tombol ambil kasus\", \"proses ambil kasus\"]', 'Bagaimana cara pengacara mengambil kasus dari pengguna?', 'Pengacara dapat membuka halaman \"Daftar Kasus\", klik tombol \"Ambil Kasus\" untuk kasus yang belum ditangani. Kasus akan masuk ke daftar proses pengacara.', NULL),
(60, 'pengacara_riwayat_kasus', 'pengacara', '[\"riwayat lawyer\", \"log kasus lawyer\", \"daftar kasus lawyer\", \"log aktivitas pengacara\"]', 'Apakah pengacara bisa melihat riwayat perubahan status kasus?', 'Ya. Di halaman Daftar Kasus, pengacara bisa melihat log aktivitas untuk setiap kasus yang diambil, termasuk waktu dan status yang diperbarui.', NULL),
(61, 'daftar_nama_pengacara', 'pengacara', '[\"siapa saja pengacara\", \"nama pengacara\", \"list pengacara\", \"advokat tersedia\", \"pengacara yang ada\"]', 'Siapa saja pengacara yang tersedia di Cerdas Hukum?', 'Beberapa pengacara yang tersedia antara lain: Ahmad Fauzi, Siti Aminah, Budi Santoso, Rina Kusuma, Dedi Kurniawan, Nina Kartika, Yusuf Hidayat, Eka Putri, dan lainnya. Anda bisa melihat profil lengkap di halaman utama.', NULL),
(62, 'pengacara_hukum_perdata', 'pengacara', '[\"pengacara hukum perdata\", \"perdata lawyer\", \"spesialis perdata\", \"pengacara perdata\"]', 'Siapa saja pengacara spesialis hukum perdata?', 'Pengacara spesialis hukum perdata antara lain: Ahmad Fauzi, Rina Kusuma, Dedi Kurniawan, Lia Rahmawati, Mira Kartini, Louis, dan Rahmat Hidayat.', NULL),
(63, 'pengacara_hukum_pidana', 'pengacara', '[\"pengacara hukum pidana\", \"pidana lawyer\", \"spesialis pidana\", \"pengacara pidana\"]', 'Siapa pengacara spesialis hukum pidana?', 'Pengacara yang menangani hukum pidana antara lain: Siti Aminah, Nina Kartika, dan Rudi Hartono.', NULL),
(64, 'pengacara_berpengalaman', 'pengacara', '[\"pengacara pengalaman terbanyak\", \"lawyer senior\", \"pengacara lama\", \"pengalaman tertinggi\"]', 'Siapa pengacara dengan pengalaman terbanyak?', 'Fajar Maulana (14 tahun), Rahmat Hidayat (15 tahun), dan Yusuf Hidayat (12 tahun) adalah pengacara paling berpengalaman di platform ini.', NULL),
(65, 'pengacara_hukum_bisnis', 'pengacara', '[\"pengacara hukum bisnis\", \"lawyer perusahaan\", \"spesialis bisnis\", \"pengacara corporate\"]', 'Siapa saja pengacara spesialis hukum bisnis dan perusahaan?', 'Beberapa pengacara dengan spesialisasi hukum bisnis dan perusahaan adalah: Budi Santoso, Yusuf Hidayat, Fajar Maulana, dan Desi Anggraini.', NULL),
(66, 'hukum_paten', 'hukum kekayaan intelektual', '[\"hukum paten\", \"daftar paten\", \"hak paten\", \"mendaftarkan paten\", \"perlindungan paten\"]', 'Bagaimana cara mendaftarkan paten untuk inovasi saya?', 'Untuk mendaftarkan paten, Anda harus mengajukan permohonan ke Direktorat Jenderal Kekayaan Intelektual dan memenuhi persyaratan administratif serta teknis.', 'https://www.dgip.go.id'),
(67, 'hukum_ketenagakerjaan', 'hukum ketenagakerjaan', '[\"hukum ketenagakerjaan\", \"hak karyawan\", \"phk\", \"cuti kerja\", \"gaji minimum\"]', 'Apa hak karyawan yang harus dipenuhi perusahaan?', 'Hak karyawan meliputi upah yang adil, cuti tahunan, jaminan sosial, perlindungan keselamatan kerja, dan prosedur PHK sesuai UU No.13 Tahun 2003.', 'https://peraturan.bpk.go.id/Home/Details/41317/uu-no-13-tahun-2003'),
(68, 'hukum_perdata_keluarga', 'hukum keluarga', '[\"hukum perdata keluarga\", \"hak waris\", \"pernikahan\", \"perceraian\", \"hak asuh anak\"]', 'Bagaimana hukum mengatur perceraian dan hak asuh anak?', 'Perceraian diatur dalam UU Perdata dan pengadilan agama, dengan hak asuh anak biasanya diberikan kepada ibu kecuali ada alasan kuat lain.', 'https://peraturan.bpk.go.id/Home/Details/46974/kompilasi-hukum-islam'),
(69, 'hukum_lingkungan', 'hukum lingkungan', '[\"hukum lingkungan\", \"perlindungan lingkungan\", \"limbah industri\", \"pencemaran udara\", \"sanksi lingkungan\"]', 'Apa sanksi bagi perusahaan yang mencemari lingkungan?', 'Sanksi bisa berupa denda, pencabutan izin usaha, dan pidana sesuai UU No.32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup.', 'https://peraturan.bpk.go.id/Home/Details/39707/uu-no-32-tahun-2009'),
(70, 'hukum_perpajakan', 'hukum pajak', '[\"hukum perpajakan\", \"pajak penghasilan\", \"pelaporan pajak\", \"sanksi pajak\", \"pajak badan\"]', 'Apa kewajiban wajib pajak badan usaha?', 'Wajib pajak badan harus melaporkan penghasilan, membayar pajak sesuai ketentuan, dan mematuhi peraturan perpajakan yang berlaku.', 'https://www.pajak.go.id'),
(71, 'sapaan_halo', 'umum', '[\"halo\", \"hi\", \"hai\", \"hello\", \"selamat datang\"]', 'Hallo, ada yang bisa saya bantu?', 'Halo! Selamat datang di Cerdas Hukum. Ada yang bisa saya bantu hari ini?', NULL),
(72, 'sapaan_selamat_pagi', 'umum', '[\"selamat pagi\", \"pagi\", \"good morning\"]', 'Selamat pagi, bagaimana saya bisa membantu?', 'Selamat pagi! Semoga hari Anda menyenangkan. Ada yang ingin Anda tanyakan tentang layanan kami?', NULL),
(73, 'bantuan', 'panduan', '[\"bantuan\", \"tolong\", \"help\", \"membantu\", \"support\"]', 'Saya butuh bantuan terkait penggunaan platform', 'Tentu! Saya siap membantu Anda. Anda bisa menanyakan tentang cara konsultasi, pengajuan kasus, dan lain-lain.', NULL),
(74, 'penawaran_layanan', 'umum', '[\"penawaran\", \"layanan\", \"konsultasi\", \"pengacara\", \"bantuan hukum\"]', 'Apa layanan yang tersedia di platform ini?', 'Cerdas Hukum menyediakan layanan konsultasi hukum online dengan pengacara profesional, pengajuan kasus, serta artikel edukasi hukum. Mau saya bantu carikan pengacara sesuai kebutuhan Anda?', NULL),
(75, 'definisi_hukum', 'umum', '[\"apa itu hukum\", \"definisi hukum\", \"pengertian hukum\"]', 'Apa itu hukum?', 'Hukum adalah sekumpulan aturan atau norma yang mengatur perilaku manusia dalam masyarakat agar tercipta ketertiban dan keadilan.', 'https://id.wikipedia.org/wiki/Hukum'),
(76, 'fungsi_hukum', 'umum', '[\"fungsi hukum\", \"tujuan hukum\", \"peran hukum\"]', 'Apa fungsi hukum dalam masyarakat?', 'Fungsi hukum adalah menjaga ketertiban, memberikan keadilan, melindungi hak dan kewajiban warga negara, serta menyelesaikan perselisihan.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(77, 'jenis_hukum', 'umum', '[\"jenis hukum\", \"macam hukum\", \"hukum pidana\", \"hukum perdata\", \"hukum tata negara\"]', 'Apa saja jenis-jenis hukum yang ada?', 'Jenis hukum utama meliputi hukum pidana, hukum perdata, hukum tata negara, hukum administrasi negara, dan hukum internasional.', 'https://peraturan.bpk.go.id'),
(78, 'hukum_pidana', 'pidana', '[\"hukum pidana\", \"pidana\", \"jenis hukum pidana\"]', 'Apa itu hukum pidana?', 'Hukum pidana mengatur tindak pidana dan sanksi yang dikenakan kepada pelaku kejahatan.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(79, 'hukum_perdata', 'perdata', '[\"hukum perdata\", \"perdata\", \"jenis hukum perdata\"]', 'Apa itu hukum perdata?', 'Hukum perdata mengatur hubungan hukum antar individu, seperti kontrak, warisan, dan perkawinan.', 'https://peraturan.bpk.go.id/Home/Details/48159/kuhp-perdata'),
(80, 'hukum_tata_negara', 'tata negara', '[\"hukum tata negara\", \"konstitusi\", \"undang undang dasar\"]', 'Apa itu hukum tata negara?', 'Hukum tata negara mengatur struktur dan fungsi lembaga negara serta hubungan antara negara dan warga negara.', 'https://peraturan.bpk.go.id/Home/Details/37974/uu-no-24-tahun-2003'),
(81, 'sumber_hukum', 'umum', '[\"sumber hukum\", \"asal usul hukum\", \"darimana hukum berasal\"]', 'Apa saja sumber hukum di Indonesia?', 'Sumber hukum Indonesia meliputi Undang-Undang, Kebiasaan, Yurisprudensi, dan Doktrin.', 'https://peraturan.bpk.go.id'),
(82, 'tujuan_hukum', 'umum', '[\"tujuan hukum\", \"apa tujuan hukum\"]', 'Apa tujuan dari hukum?', 'Tujuan hukum adalah menciptakan keadilan, ketertiban, keamanan, dan kepastian hukum di masyarakat.', 'https://id.wikipedia.org/wiki/Hukum'),
(83, 'perbedaan_hukum', 'umum', '[\"perbedaan hukum pidana dan perdata\", \"pidana vs perdata\", \"jenis hukum\"]', 'Apa perbedaan antara hukum pidana dan hukum perdata?', 'Hukum pidana mengatur perbuatan yang dilarang negara dengan sanksi pidana, sedangkan hukum perdata mengatur hubungan antar individu tanpa sanksi pidana.', 'https://peraturan.bpk.go.id/Home/Details/48160/kuhp'),
(84, 'contoh_kasus_hukum', 'umum', '[\"contoh kasus hukum\", \"kasus hukum\", \"kasus pidana\", \"kasus perdata\"]', 'Bisakah memberi contoh kasus hukum pidana dan perdata?', 'Contoh kasus pidana: pencurian, penganiayaan. Contoh kasus perdata: sengketa warisan, perceraian.', NULL),
(85, 'hukum_dan_keadilan', 'umum', '[\"hukum dan keadilan\", \"hubungan hukum dan keadilan\"]', 'Apa hubungan antara hukum dan keadilan?', 'Hukum berfungsi sebagai alat untuk menegakkan keadilan dalam masyarakat melalui aturan yang berlaku.', NULL),
(86, 'penegakan_hukum', 'umum', '[\"penegakan hukum\", \"bagaimana penegakan hukum\"]', 'Bagaimana proses penegakan hukum di Indonesia?', 'Penegakan hukum dilakukan oleh aparat seperti polisi, jaksa, dan pengadilan untuk memastikan aturan hukum ditaati dan pelanggar dihukum.', NULL),
(87, 'hukum_dan_etika', 'umum', '[\"hukum dan etika\", \"perbedaan hukum dan etika\"]', 'Apa perbedaan antara hukum dan etika?', 'Hukum adalah aturan yang berlaku secara resmi dengan sanksi hukum, sedangkan etika adalah norma moral yang mengatur perilaku tanpa sanksi hukum.', NULL),
(88, 'pendiri_cerdas_hukum', 'umum', '[\"pendiri cerdas hukum\", \"pemilik cerdas hukum\", \"siapa yang buat cerdas hukum\", \"founder cerdas hukum\"]', 'Siapakah pendiri atau pemilik platform Cerdas Hukum?', 'Platform Cerdas Hukum didirikan oleh tim profesional oleh Azzikra, Fajri, dan Vanes yang berkomitmen memberikan akses mudah dan terpercaya untuk konsultasi hukum secara digital di Indonesia.', NULL),
(89, 'tentang_cerdas_hukum', 'umum', '[\"tentang cerdas hukum\", \"apa itu cerdas hukum\", \"profil cerdas hukum\", \"informasi cerdas hukum\"]', 'Apa itu platform Cerdas Hukum?', 'Cerdas Hukum adalah platform edukasi dan konsultasi hukum digital yang memudahkan masyarakat untuk mendapatkan informasi hukum dan berinteraksi langsung dengan pengacara profesional secara online.', NULL),
(90, 'layanan_cerdas_hukum', 'umum', '[\"layanan cerdas hukum\", \"fitur cerdas hukum\", \"apa layanan di cerdas hukum\"]', 'Apa saja layanan yang disediakan oleh Cerdas Hukum?', 'Cerdas Hukum menyediakan layanan konsultasi hukum online, pengajuan kasus, chat langsung dengan pengacara, artikel edukasi hukum, serta pendaftaran pengacara.', NULL),
(91, 'keamanan_data_cerdas_hukum', 'umum', '[\"keamanan data\", \"privasi data\", \"data pengguna\", \"perlindungan data\"]', 'Bagaimana keamanan data pengguna di Cerdas Hukum?', 'Cerdas Hukum menjamin keamanan dan kerahasiaan data pengguna dengan teknologi enkripsi dan kebijakan privasi yang ketat sesuai standar perlindungan data.', NULL),
(92, 'cara_menggunakan_cerdas_hukum', 'panduan', '[\"cara menggunakan cerdas hukum\", \"panduan cerdas hukum\", \"bagaimana pakai cerdas hukum\"]', 'Bagaimana cara menggunakan platform Cerdas Hukum?', 'Anda dapat mendaftar akun, memilih pengacara sesuai kebutuhan, melakukan pembayaran, dan memulai konsultasi secara langsung melalui fitur chat di platform.', NULL),
(93, 'siapa_pengacara_cerdas_hukum', 'pengacara', '[\"siapa pengacara\", \"daftar pengacara\", \"profil pengacara cerdas hukum\"]', 'Siapa saja pengacara yang tergabung di Cerdas Hukum?', 'Cerdas Hukum memiliki jaringan pengacara profesional dengan berbagai spesialisasi hukum yang telah terverifikasi oleh tim admin.', NULL),
(94, 'cara_ajukan_kasus', 'panduan', '[\"cara ajukan kasus\", \"mengajukan kasus hukum\", \"proses ajukan kasus\"]', 'Bagaimana cara mengajukan kasus di platform?', 'Anda dapat mengajukan kasus dengan mengisi formulir yang tersedia di menu \"Ajukan Kasus\", lengkapi data dan unggah bukti pendukung, lalu kirimkan. Kasus Anda akan diproses oleh pengacara.', NULL),
(95, 'cara_daftar_pengacara', 'panduan', '[\"cara daftar pengacara\", \"pendaftaran lawyer\", \"jadi pengacara di platform\"]', 'Bagaimana cara mendaftar sebagai pengacara di platform?', 'Klik menu \"Daftar Lawyer\", isi formulir pendaftaran lengkap dengan dokumen pendukung seperti KTP dan kartu advokat, lalu tunggu verifikasi dari admin.', NULL),
(96, 'biaya_konsultasi', 'umum', '[\"biaya konsultasi\", \"tarif konsultasi\", \"harga konsultasi\"]', 'Berapa biaya konsultasi dengan pengacara?', 'Biaya konsultasi standar adalah Rp50.000 per sesi, namun dapat berbeda sesuai pengacara dan jenis konsultasi.', NULL),
(97, 'waktu_kerja_pengacara', 'umum', '[\"waktu kerja pengacara\", \"jadwal konsultasi\", \"jam operasional\"]', 'Kapan waktu kerja pengacara tersedia untuk konsultasi?', 'Pengacara biasanya tersedia pada jam kerja normal, Senin sampai Jumat pukul 08.00-17.00, namun dapat berbeda tergantung pengacara.', NULL),
(98, 'status_kasus', 'umum', '[\"status kasus\", \"update kasus\", \"progres kasus\"]', 'Bagaimana cara mengetahui status kasus yang saya ajukan?', 'Anda dapat melihat status kasus melalui menu \"Riwayat Kasus\" di akun Anda, yang menampilkan progres dan catatan terbaru.', NULL),
(99, 'layanan_artikel_hukum', 'umum', '[\"artikel hukum\", \"berita hukum\", \"informasi hukum\"]', 'Apa layanan artikel yang tersedia di platform?', 'Platform menyediakan artikel edukasi hukum dan berita hukum terbaru yang dapat membantu Anda memahami berbagai topik hukum.', NULL),
(100, 'pengaduan_keluhan', 'umum', '[\"pengaduan\", \"keluhan\", \"masalah layanan\"]', 'Bagaimana jika saya ingin menyampaikan keluhan atau pengaduan?', 'Anda bisa menghubungi layanan pelanggan melalui fitur kontak kami atau email resmi untuk menyampaikan keluhan dan pengaduan.', NULL),
(101, 'cara_reset_password', 'panduan', '[\"lupa password\", \"reset password\", \"ganti password\"]', 'Apa yang harus saya lakukan jika lupa password?', 'Klik tombol \"Forgot Password\" di halaman login, masukkan email Anda, lalu ikuti petunjuk untuk mereset password melalui email.', NULL),
(102, 'dukungan_teknis', 'umum', '[\"dukungan teknis\", \"bantuan teknis\", \"masalah teknis\"]', 'Saya mengalami masalah teknis saat menggunakan platform, apa yang harus saya lakukan?', 'Anda dapat menghubungi tim dukungan teknis melalui fitur kontak atau email untuk bantuan segera.', NULL),
(103, 'cara_chat_pengacara', 'panduan', '[\"chat pengacara\", \"konsultasi chat\", \"cara bicara dengan lawyer\"]', 'Bagaimana cara memulai chat konsultasi dengan pengacara?', 'Setelah pembayaran selesai, Anda akan diarahkan ke halaman chat untuk berkomunikasi langsung dengan pengacara terkait.', NULL);

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
-- Table structure for table `konsultasi_session`
--

CREATE TABLE `konsultasi_session` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `pengacara_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `duration` int NOT NULL,
  `biaya` int NOT NULL DEFAULT '0',
  `biaya_pengacara` decimal(15,2) DEFAULT NULL,
  `status` enum('aktif','selesai') COLLATE utf8mb4_general_ci DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_transferred` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `konsultasi_session`
--

INSERT INTO `konsultasi_session` (`id`, `user_id`, `pengacara_id`, `start_time`, `duration`, `biaya`, `biaya_pengacara`, `status`, `created_at`, `is_transferred`) VALUES
(1, 2, 7, '2025-05-15 10:31:38', 60, 100000, '80000.00', 'selesai', '2025-05-15 03:31:38', 1),
(2, 2, 9, '2025-05-19 17:42:46', 30, 50000, '40000.00', 'selesai', '2025-05-15 03:36:03', 1),
(3, 2, 5, '2025-05-15 11:25:02', 30, 50000, '40000.00', 'selesai', '2025-05-15 04:25:02', 0),
(4, 3, 9, '2025-05-15 12:45:53', 60, 100000, '80000.00', 'selesai', '2025-05-15 04:33:03', 1),
(5, 3, 1, '2025-05-15 11:37:40', 30, 50000, '40000.00', 'selesai', '2025-05-15 04:37:40', 0),
(6, 14, 1, '2025-05-15 20:34:28', 30, 50000, '40000.00', 'selesai', '2025-05-15 13:33:44', 1),
(7, 2, 1, '2025-05-19 18:10:19', 30, 50000, '40000.00', 'selesai', '2025-05-19 11:10:19', 1),
(8, 2, 3, '2025-05-23 11:09:03', 60, 100000, '80000.00', 'selesai', '2025-05-19 11:24:59', 0),
(9, 2, 15, '2025-05-19 18:38:15', 30, 50000, '40000.00', 'selesai', '2025-05-19 11:38:15', 0),
(11, 2, 9, '2025-05-31 23:30:37', 30, 50000, '40000.00', 'aktif', '2025-05-25 13:43:14', 1),
(12, 3, 7, '2025-05-25 20:44:43', 60, 100000, '80000.00', 'aktif', '2025-05-25 13:44:43', 0),
(13, 2, 20, '2025-05-27 16:17:58', 60, 100000, '80000.00', 'aktif', '2025-05-27 09:17:58', 0),
(14, 2, 2, '2025-06-10 11:10:50', 30, 50000, '40000.00', 'aktif', '2025-05-27 09:41:09', 0),
(15, 2, 3, '2025-05-27 16:50:58', 60, 100000, '80000.00', 'aktif', '2025-05-27 09:50:58', 0),
(16, 14, 3, '2025-05-28 19:59:21', 30, 50000, '40000.00', 'selesai', '2025-05-27 10:46:29', 1),
(17, 14, 2, '2025-05-28 17:42:27', 30, 50000, '40000.00', 'selesai', '2025-05-27 10:57:22', 1),
(18, 14, 4, '2025-05-28 18:55:16', 30, 50000, '40000.00', 'selesai', '2025-05-27 13:36:41', 0),
(19, 14, 20, '2025-05-29 00:10:06', 30, 50000, '40000.00', 'selesai', '2025-05-27 18:29:07', 0),
(20, 14, 9, '2025-05-28 14:45:30', 30, 50000, '40000.00', 'selesai', '2025-05-27 19:07:22', 0),
(21, 14, 8, '2025-05-28 17:53:39', 30, 50000, '40000.00', 'selesai', '2025-05-28 09:01:47', 0),
(22, 14, 7, '2025-05-28 16:32:10', 30, 50000, '40000.00', 'selesai', '2025-05-28 09:32:10', 0),
(24, 14, 13, '2025-05-28 17:48:15', 30, 50000, '40000.00', 'selesai', '2025-05-28 10:44:26', 0),
(26, 14, 12, '2025-05-28 18:48:23', 30, 50000, '40000.00', 'selesai', '2025-05-28 11:48:23', 0),
(27, 14, 19, '2025-05-28 20:04:00', 30, 50000, '40000.00', 'selesai', '2025-05-28 13:04:00', 0),
(28, 14, 11, '2025-05-29 02:51:46', 30, 50000, '40000.00', 'selesai', '2025-05-28 19:50:28', 0),
(30, 14, 16, '2025-05-29 14:05:00', 30, 50000, '40000.00', 'selesai', '2025-05-29 07:04:59', 0),
(31, 14, 3, '2025-05-29 14:44:17', 30, 50000, '40000.00', 'selesai', '2025-05-29 07:06:16', 1),
(32, 14, 2, '2025-05-29 17:14:12', 30, 50000, '40000.00', 'selesai', '2025-05-29 10:14:11', 1),
(33, 14, 9, '2025-05-29 17:18:02', 30, 50000, '40000.00', 'selesai', '2025-05-29 10:17:58', 1),
(35, 14, 13, '2025-05-29 17:21:32', 30, 50000, '40000.00', 'selesai', '2025-05-29 10:21:32', 1);

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

--
-- Dumping data for table `log_aktivitas`
--

INSERT INTO `log_aktivitas` (`id`, `id_pengguna`, `aktivitas`, `waktu`) VALUES
(17, 1, 'Status kasus ID 2 diperbarui menjadi \"Diproses\"', '2025-05-11 12:38:13'),
(18, 1, 'Status kasus ID 2 diubah menjadi \'Diproses\'', '2025-05-11 12:38:13'),
(19, 1, 'Status kasus ID 4 diperbarui menjadi \"Selesai\"', '2025-05-11 12:38:17'),
(20, 1, 'Status kasus ID 4 diubah menjadi \'Selesai\'', '2025-05-11 12:38:17'),
(21, 1, 'Status kasus ID 4 diperbarui menjadi \"Diproses\"', '2025-05-11 14:13:16'),
(22, 1, 'Status kasus ID 4 diubah menjadi \'Diproses\'', '2025-05-11 14:13:16'),
(23, 1, 'Status kasus ID 4 diperbarui menjadi \"Diproses\"', '2025-05-11 14:19:10'),
(24, 1, 'Status kasus ID 4 diubah menjadi \'Diproses\'', '2025-05-11 14:19:10'),
(25, 14, 'Status kasus ID 3 diperbarui menjadi \"Diproses\"', '2025-05-11 14:19:42'),
(26, 14, 'Status kasus ID 3 diubah menjadi \'Diproses\'', '2025-05-11 14:19:42'),
(27, 1, 'Status kasus ID 2 diperbarui menjadi \"Diproses\"', '2025-05-11 14:19:42'),
(28, 1, 'Status kasus ID 2 diubah menjadi \'Diproses\'', '2025-05-11 14:19:42'),
(29, 1, 'Status kasus ID 1 diperbarui menjadi \"Diproses\"', '2025-05-11 14:19:43'),
(30, 1, 'Status kasus ID 1 diubah menjadi \'Diproses\'', '2025-05-11 14:19:43'),
(31, 1, 'Status kasus ID 4 diperbarui menjadi \"Diproses\"', '2025-05-11 15:03:33'),
(32, 1, 'Status kasus ID 4 diubah menjadi \'Diproses\'', '2025-05-11 15:03:33'),
(33, 14, 'Status kasus ID 3 diperbarui menjadi \"Diproses\"', '2025-05-11 15:39:30'),
(34, 14, 'Status kasus ID 3 diubah menjadi \'Diproses\'', '2025-05-11 15:39:30'),
(35, 1, 'Status kasus ID 2 diperbarui menjadi \"Diproses\"', '2025-05-11 15:39:42'),
(36, 1, 'Status kasus ID 2 diubah menjadi \'Diproses\'', '2025-05-11 15:39:42'),
(37, 1, 'Status kasus ID 1 diperbarui menjadi \"Diproses\"', '2025-05-11 15:39:45'),
(38, 1, 'Status kasus ID 1 diubah menjadi \'Diproses\'', '2025-05-11 15:39:45'),
(39, 1, 'Status kasus ID 4 diperbarui menjadi \"Diproses\"', '2025-05-11 15:48:14'),
(40, 1, 'Status kasus ID 4 diubah menjadi \'Diproses\'', '2025-05-11 15:48:14'),
(41, 1, 'Status kasus ID 2 diperbarui menjadi \"Diproses\"', '2025-05-11 15:48:16'),
(42, 1, 'Status kasus ID 2 diubah menjadi \'Diproses\'', '2025-05-11 15:48:16'),
(43, 14, 'Status kasus ID 3 diperbarui menjadi \"Diproses\"', '2025-05-12 04:10:58'),
(44, 14, 'Status kasus ID 3 diubah menjadi \'Diproses\'', '2025-05-12 04:10:58'),
(45, 1, 'Status kasus ID 4 diperbarui menjadi \"Diproses\"', '2025-05-12 09:03:43'),
(46, 1, 'Status kasus ID 4 diubah menjadi \'Diproses\'', '2025-05-12 09:03:43'),
(47, 1, 'Status kasus ID 4 diperbarui menjadi \"Selesai\"', '2025-05-12 09:03:48'),
(48, 1, 'Status kasus ID 4 diubah menjadi \'Selesai\'', '2025-05-12 09:03:48'),
(49, 14, 'Status kasus ID 3 diperbarui menjadi \"Diproses\"', '2025-05-12 09:40:04'),
(50, 14, 'Status kasus ID 3 diubah menjadi \'Diproses\'', '2025-05-12 09:40:04'),
(51, 1, 'Status kasus ID 2 diperbarui menjadi \"Diproses\"', '2025-05-12 09:45:13'),
(52, 1, 'Status kasus ID 2 diubah menjadi \'Diproses\'', '2025-05-12 09:45:13'),
(53, 1, 'Status kasus ID 5 diperbarui menjadi \"Diproses\"', '2025-05-12 12:05:19'),
(54, 1, 'Status kasus ID 5 diubah menjadi \'Diproses\'', '2025-05-12 12:05:19'),
(55, 1, 'Status kasus ID 1 diperbarui menjadi \"Diproses\"', '2025-05-12 12:05:20'),
(56, 1, 'Status kasus ID 1 diubah menjadi \'Diproses\'', '2025-05-12 12:05:20'),
(57, 1, 'Status kasus ID 5 diperbarui menjadi \"Selesai\"', '2025-05-12 12:06:26'),
(58, 1, 'Status kasus ID 5 diubah menjadi \'Selesai\'', '2025-05-12 12:06:26'),
(59, 1, 'Status kasus ID 5 diperbarui menjadi \"Diproses\"', '2025-05-12 12:23:05'),
(60, 1, 'Status kasus ID 5 diubah menjadi \'Diproses\'', '2025-05-12 12:23:05'),
(61, 1, 'Status kasus ID 6 diperbarui menjadi \"Diproses\"', '2025-05-12 12:40:53'),
(62, 1, 'Status kasus ID 6 diubah menjadi \'Diproses\'', '2025-05-12 12:40:53'),
(63, 1, 'Status kasus ID 6 diperbarui menjadi \"Selesai\"', '2025-05-12 12:41:32'),
(64, 1, 'Status kasus ID 6 diubah menjadi \'Selesai\'', '2025-05-12 12:41:32'),
(65, 2, 'Status kasus ID 7 diperbarui menjadi \"Diproses\"', '2025-05-14 05:51:19'),
(66, 2, 'Status kasus ID 7 diubah menjadi \'Diproses\'', '2025-05-14 05:51:20'),
(67, 2, 'Status kasus ID 7 diperbarui menjadi \"Selesai\"', '2025-05-14 05:51:42'),
(68, 2, 'Status kasus ID 7 diubah menjadi \'Selesai\'', '2025-05-14 05:51:42'),
(69, 2, 'Status kasus ID 8 diperbarui menjadi \"Diproses\"', '2025-05-15 01:13:53'),
(70, 2, 'Status kasus ID 8 diubah menjadi \'Diproses\'', '2025-05-15 01:13:53'),
(71, 2, 'Status kasus ID 8 diperbarui menjadi \"Selesai\"', '2025-05-15 01:14:13'),
(72, 2, 'Status kasus ID 8 diubah menjadi \'Selesai\'', '2025-05-15 01:14:13'),
(73, 2, 'Status kasus ID 9 diperbarui menjadi \"Diproses\"', '2025-05-19 09:39:41'),
(74, 2, 'Status kasus ID 9 diubah menjadi \'Diproses\'', '2025-05-19 09:39:41'),
(75, 2, 'Status kasus ID 10 diperbarui menjadi \"Diproses\"', '2025-05-27 10:00:06'),
(76, 2, 'Status kasus ID 10 diubah menjadi \'Diproses\'', '2025-05-27 10:00:06'),
(77, 2, 'Status kasus ID 10 diperbarui menjadi \"Selesai\"', '2025-05-27 10:00:10'),
(78, 2, 'Status kasus ID 10 diubah menjadi \'Selesai\'', '2025-05-27 10:00:10'),
(79, 2, 'Status kasus ID 9 diperbarui menjadi \"Selesai\"', '2025-05-27 10:00:13'),
(80, 2, 'Status kasus ID 9 diubah menjadi \'Selesai\'', '2025-05-27 10:00:13'),
(81, 9, 'Status kasus ID 46 diperbarui menjadi \"Diproses\"', '2025-06-17 03:30:29'),
(82, 9, 'Status kasus ID 46 diubah menjadi \'Diproses\'', '2025-06-17 03:30:29'),
(83, 9, 'Status kasus ID 46 diperbarui menjadi \"Selesai\"', '2025-06-17 03:30:35'),
(84, 9, 'Status kasus ID 46 diubah menjadi \'Selesai\'', '2025-06-17 03:30:35');

-- --------------------------------------------------------

--
-- Table structure for table `log_pertanyaan_user`
--

CREATE TABLE `log_pertanyaan_user` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `pertanyaan` text COLLATE utf8mb4_general_ci NOT NULL,
  `intent_didapat` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `confidence_score` decimal(5,2) DEFAULT NULL,
  `waktu` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_pertanyaan_user`
--

INSERT INTO `log_pertanyaan_user` (`id`, `user_id`, `pertanyaan`, `intent_didapat`, `confidence_score`, `waktu`) VALUES
(1, NULL, 'hallo', NULL, '0.00', '2025-05-16 09:16:05'),
(2, NULL, 'hallo', NULL, '0.00', '2025-05-16 09:16:26'),
(3, NULL, 'Kontrak kerja', 'kontrak kerja', '1.00', '2025-05-16 11:08:38'),
(4, NULL, 'Apa itu KDRT', 'kdrt', '0.50', '2025-05-16 11:55:11'),
(5, NULL, 'KDRT', 'kdrt', '1.00', '2025-05-16 11:55:21'),
(6, NULL, 'tes', NULL, '0.00', '2025-05-16 13:08:27'),
(7, NULL, 'tes', NULL, '0.00', '2025-05-16 13:10:03'),
(8, NULL, 'hallo', NULL, '0.00', '2025-05-16 13:11:50'),
(9, NULL, 'tes', NULL, '0.00', '2025-05-16 13:16:21'),
(10, NULL, 'tes', NULL, '0.00', '2025-05-16 13:16:25'),
(11, NULL, 'tes', NULL, '0.00', '2025-05-16 13:16:36'),
(12, NULL, 'tes', NULL, '0.00', '2025-05-16 13:17:47'),
(13, NULL, 'tes', NULL, '0.00', '2025-05-16 13:17:52'),
(14, NULL, 'tes', NULL, '0.00', '2025-05-16 13:22:39'),
(15, NULL, 'tes', NULL, '0.00', '2025-05-16 13:22:44'),
(16, NULL, 'apa itu uu ite', 'ite', '0.57', '2025-05-16 13:26:42'),
(17, NULL, 'a', NULL, '0.00', '2025-05-16 13:38:50'),
(18, NULL, 'a', NULL, '0.00', '2025-05-16 13:38:53'),
(19, NULL, 'sdasdas', NULL, '0.00', '2025-05-16 13:38:58'),
(20, NULL, 'a', NULL, '0.00', '2025-05-16 13:42:38'),
(21, NULL, 'a', NULL, '0.00', '2025-05-16 13:42:41'),
(22, NULL, 'tes', NULL, '0.00', '2025-05-16 13:51:34'),
(23, NULL, 'aaas', NULL, '0.00', '2025-05-16 14:01:26'),
(24, NULL, 'apa itu KDRT', 'kdrt', '0.50', '2025-05-16 18:31:50'),
(25, NULL, 'APA ITU uu ite', 'ite', '0.57', '2025-05-16 18:32:31'),
(26, NULL, 'hallo', NULL, '0.00', '2025-05-16 18:32:40'),
(27, NULL, 'hallo', NULL, '0.00', '2025-05-16 20:18:44'),
(28, NULL, 'perceraian', 'perceraian', '1.00', '2025-05-16 21:26:04'),
(29, NULL, 'saya punya masalah perceraian', 'perceraian', '0.53', '2025-05-16 21:26:26'),
(30, NULL, 'berikan solusi nya', NULL, '0.00', '2025-05-16 21:26:35'),
(31, NULL, 'apa itu uu ite', 'ite', '0.57', '2025-05-17 03:34:23'),
(32, NULL, 'hukum', 'warisan', '0.62', '2025-05-18 12:28:09'),
(33, NULL, 'halo', NULL, '0.00', '2025-05-18 12:28:20'),
(34, NULL, 'kdrt', 'kdrt', '1.00', '2025-05-19 04:06:05'),
(35, NULL, 'haki', 'hak cipta', '1.00', '2025-05-19 04:08:28'),
(36, NULL, 'pidana', NULL, '0.00', '2025-05-19 04:10:30'),
(37, NULL, 'perdata', NULL, '0.00', '2025-05-19 04:10:36'),
(38, NULL, 'penipuan', 'penipuan', '1.00', '2025-05-19 04:20:12'),
(39, NULL, 'apa hukum pidana', 'definisi_hukum_pidana', '0.83', '2025-05-19 04:22:49'),
(40, NULL, 'perdata', 'definisi_hukum_perdata', '0.67', '2025-05-19 04:22:56'),
(41, NULL, 'apa cerdas hukum', 'apa_itu_cerdas_hukum', '0.87', '2025-05-19 04:29:15'),
(42, NULL, 'bagaimana cara pendaftaran advokat', 'cara_daftar_lawyer', '0.61', '2025-05-19 04:37:24'),
(43, NULL, 'bagaimana verifikasi advokat', 'cara_forgot_password', '0.56', '2025-05-19 04:37:43'),
(44, NULL, 'bagaimana alur login', 'cara_login', '0.51', '2025-05-19 04:37:58'),
(45, NULL, 'berita', NULL, '0.00', '2025-05-19 04:38:24'),
(46, NULL, 'bagaimana cara konsultasi', 'cara_konsultasi', '0.74', '2025-05-19 04:38:51'),
(47, NULL, 'chat pengacara', 'fitur_chat_pengacara', '1.00', '2025-05-19 04:46:41'),
(48, NULL, 'profil', 'cara_edit_profil', '0.71', '2025-05-19 04:47:15'),
(49, NULL, 'kontol', NULL, '0.00', '2025-05-19 05:06:21'),
(50, NULL, 'ajukan kasus', 'cara_ajukan_kasus', '0.83', '2025-05-19 05:06:28'),
(51, NULL, 'bagaimana cara login', 'cara_login', '0.64', '2025-05-19 05:06:36'),
(52, NULL, 'apa yang dimaksud hukum pidana', 'definisi_hukum_pidana', '0.59', '2025-05-19 08:38:51'),
(53, NULL, 'bagaimana cara konsultasi', 'cara_konsultasi', '0.74', '2025-05-19 08:41:52'),
(54, NULL, 'halo', NULL, '0.00', '2025-05-20 04:08:55'),
(55, NULL, 'apa itu hukum?', 'definisi_hukum_adat', '0.83', '2025-05-20 04:16:21'),
(56, NULL, 'hukum', 'hak_asasi_manusia', '0.73', '2025-05-20 04:16:31'),
(57, NULL, 'siapa pendiri cerdas hukum', 'pendiri_cerdas_hukum', '0.87', '2025-05-20 04:20:45'),
(58, NULL, 'cara ajukan kasus', 'cara_ajukan_kasus', '1.00', '2025-05-20 04:24:31'),
(59, NULL, 'cara konsultasi', 'cara_konsultasi', '1.00', '2025-05-20 04:24:46'),
(60, NULL, 'cara komsultasi', 'cara_konsultasi', '0.85', '2025-05-20 04:25:03'),
(61, NULL, 'halo', 'sapaan_halo', '1.00', '2025-05-27 09:13:05'),
(62, NULL, 'bagaimana cara konsultasi', 'cara_konsultasi', '0.74', '2025-05-27 09:13:18'),
(63, NULL, 'tes', 'tes', '1.00', '2025-05-29 11:18:48'),
(64, NULL, 'tes edit', 'tes edit', '1.00', '2025-05-29 11:19:21'),
(65, NULL, 'halo', 'sapaan_halo', '1.00', '2025-06-06 13:24:23'),
(66, NULL, 'apa itu hukum', 'definisi_hukum', '1.00', '2025-06-06 13:24:45'),
(67, NULL, 'apa itu cerdas hukum', 'apa_itu_cerdas_hukum', '1.00', '2025-06-06 13:25:05'),
(68, NULL, 'apa saja fitur cerdas hukum', 'fitur_platform', '0.81', '2025-06-06 13:25:37');

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
  `file` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `sender_role`, `receiver_id`, `receiver_role`, `message`, `file`, `timestamp`, `is_read`) VALUES
(1, 2, 'user', 1, 'pengacara', 'go', NULL, '2025-04-28 17:31:25', 0),
(2, 2, 'user', 3, 'pengacara', 'hello', NULL, '2025-04-28 17:32:07', 0),
(3, 1, 'pengacara', 1, 'pengacara', 'tes', NULL, '2025-04-28 17:48:59', 1),
(4, 1, 'pengacara', 1, 'pengacara', 'hello', NULL, '2025-04-28 17:49:37', 1),
(5, 2, 'user', 1, 'pengacara', 'hello', NULL, '2025-04-28 17:55:36', 0),
(6, 3, 'user', 1, 'pengacara', 'hallo', NULL, '2025-04-28 18:15:04', 0),
(7, 17, 'user', 1, 'pengacara', 'woi kontol', NULL, '2025-04-28 18:18:05', 0),
(8, 14, 'user', 1, 'pengacara', 'woi', NULL, '2025-04-28 19:56:46', 0),
(9, 1, 'pengacara', 1, 'pengacara', 'tes', NULL, '2025-04-28 19:57:58', 1),
(10, 1, 'pengacara', 2, 'user', 'apa', NULL, '2025-04-28 19:58:19', 0),
(11, 1, 'pengacara', 14, 'user', 'apa', NULL, '2025-04-28 20:07:54', 0),
(12, 1, 'pengacara', 1, 'pengacara', 'tes', NULL, '2025-04-28 20:08:16', 1),
(13, 1, 'pengacara', 1, 'pengacara', 'hLLO', NULL, '2025-04-28 20:08:52', 1),
(14, 1, 'user', 1, 'pengacara', 'haii', NULL, '2025-04-28 20:11:03', 0),
(15, 1, 'pengacara', 1, 'user', 'tes', NULL, '2025-04-28 20:11:17', 1),
(16, 1, 'user', 1, 'pengacara', 'hola', NULL, '2025-04-28 20:11:28', 0),
(17, 1, 'pengacara', 1, 'user', 'button', NULL, '2025-04-28 20:22:24', 1),
(18, 1, 'user', 1, 'pengacara', 'oit', NULL, '2025-04-28 23:05:01', 0),
(19, 1, 'user', 2, 'pengacara', 'hai', NULL, '2025-04-29 00:03:36', 0),
(20, 2, 'pengacara', 1, 'user', 'hallo', NULL, '2025-04-29 00:03:50', 1),
(21, 1, 'user', 2, 'pengacara', 'kamu lagi apa?', NULL, '2025-04-29 00:04:04', 0),
(22, 2, 'pengacara', 1, 'user', 'nguli', NULL, '2025-04-29 00:04:12', 1),
(23, 1, 'user', 2, 'pengacara', 'emg iyaaa', NULL, '2025-04-29 00:04:24', 0),
(24, 1, 'user', 2, 'pengacara', 'woi', NULL, '2025-04-29 00:16:26', 0),
(25, 2, 'pengacara', 1, 'user', 'apa cok', NULL, '2025-04-29 00:16:37', 1),
(26, 1, 'user', 1, 'pengacara', 'hallo', NULL, '2025-04-29 02:06:52', 0),
(27, 1, 'pengacara', 1, 'user', 'oit', NULL, '2025-04-29 02:07:04', 1),
(28, 1, 'user', 2, 'pengacara', 'woi pepek', NULL, '2025-04-29 02:28:25', 0),
(29, 1, 'user', 2, 'pengacara', 'woiiiii ribut yuk cina', NULL, '2025-04-29 02:30:12', 0),
(30, 2, 'pengacara', 1, 'user', 'ayokkk mmk', NULL, '2025-04-29 02:30:36', 1),
(31, 1, 'user', 2, 'pengacara', 'gass', NULL, '2025-04-29 02:30:51', 0),
(32, 1, 'pengacara', 1, 'user', 'woi', NULL, '2025-04-29 14:18:31', 1),
(33, 1, 'user', 30, 'pengacara', 'hallo', NULL, '2025-04-30 15:38:46', 0),
(34, 30, 'pengacara', 1, 'user', 'iya', NULL, '2025-04-30 15:38:59', 0),
(35, 1, 'user', 1, 'pengacara', 'tes', NULL, '2025-04-30 20:14:06', 0),
(36, 1, 'user', 1, 'pengacara', 'woi', NULL, '2025-04-30 20:15:20', 0),
(37, 1, 'pengacara', 1, 'user', 'oi', NULL, '2025-05-01 00:51:37', 0),
(38, 1, 'pengacara', 1, 'user', 'hari ini cerah ya', NULL, '2025-05-01 00:51:45', 0),
(39, 1, 'user', 1, 'pengacara', 'iyaaa yaaa', NULL, '2025-05-01 00:52:03', 0),
(40, 1, 'pengacara', 2, 'user', 'tes', NULL, '2025-05-02 14:16:21', 0),
(41, 1, 'pengacara', 2, 'user', 'hi', NULL, '2025-05-02 14:16:24', 0),
(42, 14, 'user', 1, 'pengacara', 'tes', NULL, '2025-05-05 11:01:41', 0),
(43, 14, 'user', 1, 'pengacara', 'tes', NULL, '2025-05-05 11:06:27', 0),
(44, 1, 'pengacara', 14, 'user', 'teesssss', NULL, '2025-05-05 11:08:13', 0),
(45, 1, 'pengacara', 2, 'user', 'tes', NULL, '2025-05-06 14:26:32', 0),
(46, 2, 'user', 1, 'pengacara', 'oii', NULL, '2025-05-06 14:26:41', 0),
(47, 1, 'user', 1, 'pengacara', 'coba coba coba', NULL, '2025-05-07 11:27:15', 0),
(48, 1, 'user', 1, 'pengacara', 'tes', NULL, '2025-05-08 07:54:14', 0),
(49, 1, 'user', 1, 'pengacara', 'percobaan pertama', NULL, '2025-05-11 20:50:19', 0),
(50, 1, 'pengacara', 1, 'user', 'okeee masuk', NULL, '2025-05-11 20:50:28', 0),
(51, 1, 'pengacara', 1, 'user', 'hallo', NULL, '2025-05-11 20:50:40', 0),
(52, 1, 'user', 1, 'pengacara', 'tes', NULL, '2025-05-11 20:50:52', 0),
(53, 1, 'pengacara', 1, 'user', 'iya', NULL, '2025-05-11 20:51:00', 0),
(54, 2, 'user', 3, 'pengacara', 'tes', NULL, '2025-05-14 13:01:47', 0),
(55, 2, 'user', 9, 'pengacara', 'Assalamualaikum', NULL, '2025-05-14 13:05:06', 0),
(56, 9, 'pengacara', 2, 'user', 'waalaikumsalam', NULL, '2025-05-14 13:05:21', 0),
(57, 2, 'user', 20, 'pengacara', 'tes', NULL, '2025-05-15 07:47:50', 0),
(58, 1, 'user', 2, 'pengacara', 'tes', NULL, '2025-05-15 08:01:40', 0),
(59, 2, 'user', 2, 'pengacara', 'tes', NULL, '2025-05-15 10:09:28', 0),
(60, 2, 'user', 2, 'pengacara', 'tes', NULL, '2025-05-15 10:29:55', 0),
(61, 2, 'user', 7, 'pengacara', 'pepek', NULL, '2025-05-15 10:32:15', 0),
(62, 2, 'user', 7, 'pengacara', 'oke', NULL, '2025-05-15 11:12:50', 0),
(63, 2, 'user', 7, 'pengacara', 'ok', NULL, '2025-05-15 11:24:02', 0),
(64, 2, 'user', 5, 'pengacara', 'halo', NULL, '2025-05-15 11:25:26', 0),
(65, 2, 'user', 9, 'pengacara', 'good', NULL, '2025-05-15 11:29:42', 0),
(66, 9, 'pengacara', 2, 'user', 'nice ', NULL, '2025-05-15 11:30:02', 0),
(67, 3, 'user', 9, 'pengacara', 'hallo', NULL, '2025-05-15 11:33:28', 0),
(68, 9, 'pengacara', 3, 'user', 'masuk', NULL, '2025-05-15 11:33:54', 0),
(69, 2, 'user', 9, 'pengacara', 'gas', NULL, '2025-05-15 12:31:05', 0),
(70, 2, 'user', 9, 'pengacara', '', '1747287516565-501185643.jpeg', '2025-05-15 12:38:36', 0),
(71, 2, 'user', 9, 'pengacara', '', '1747287535649-485755329.pdf', '2025-05-15 12:38:55', 0),
(72, 3, 'user', 9, 'pengacara', '', '1747287996055-992464305.png', '2025-05-15 12:46:36', 0),
(73, 3, 'user', 9, 'pengacara', 'beli nih', NULL, '2025-05-15 12:46:40', 0),
(74, 9, 'pengacara', 3, 'user', 'malah jualan cina', NULL, '2025-05-15 12:47:05', 0),
(75, 2, 'user', 9, 'pengacara', 'malam', NULL, '2025-05-18 19:26:31', 0),
(76, 9, 'pengacara', 2, 'user', 'yak\\', NULL, '2025-05-18 19:27:04', 0),
(77, 2, 'user', 9, 'pengacara', 'oke', NULL, '2025-05-18 19:27:12', 0),
(78, 9, 'pengacara', 2, 'user', '', '1747571329678-735393495.jpeg', '2025-05-18 19:28:49', 0),
(79, 2, 'user', 9, 'pengacara', 'Selamat malam Pak Andi Prasetyo', NULL, '2025-05-18 20:05:14', 0),
(80, 2, 'user', 9, 'pengacara', 'Saya Ingin Konsultasi terkait Hak waris', NULL, '2025-05-18 20:05:51', 0),
(81, 2, 'user', 9, 'pengacara', 'Selamat malam Pak Andi Prasetyo', NULL, '2025-05-18 20:06:31', 0),
(82, 2, 'user', 9, 'pengacara', 'Saya ingin konsultasi terkait HAKI', NULL, '2025-05-18 20:06:45', 0),
(83, 9, 'pengacara', 2, 'user', 'Selamat malam Pak Samsudin, tentu saja saya akan membantu menangani kasus Anda', NULL, '2025-05-18 20:09:42', 0),
(84, 2, 'user', 9, 'pengacara', 'Baik pak, saya akan mengirimkan dokumen untuk bapak analisis lebih lanjut', NULL, '2025-05-18 20:11:38', 0),
(85, 2, 'user', 9, 'pengacara', '', '1747574019331-911943145.jpg', '2025-05-18 20:13:39', 0),
(86, 2, 'user', 3, 'pengacara', 'kacau', NULL, '2025-05-23 11:10:00', 0),
(87, 3, 'user', 7, 'pengacara', 'halo', NULL, '2025-05-25 20:45:09', 0),
(88, 7, 'pengacara', 3, 'user', 'tes', NULL, '2025-05-25 20:47:32', 0),
(89, 3, 'user', 7, 'pengacara', 'ok', NULL, '2025-05-25 20:47:41', 0),
(90, 2, 'user', 20, 'pengacara', 'tes', NULL, '2025-05-27 16:18:41', 0),
(91, 2, 'user', 20, 'pengacara', 'masuk', NULL, '2025-05-27 16:18:45', 0),
(92, 14, 'user', 2, 'pengacara', 'halo', NULL, '2025-05-27 20:31:02', 0),
(93, 14, 'user', 3, 'pengacara', 'sas', NULL, '2025-05-28 00:43:48', 0),
(94, 14, 'user', 3, 'pengacara', 'sa', NULL, '2025-05-28 00:45:28', 0),
(95, 14, 'user', 20, 'pengacara', 'tes', NULL, '2025-05-29 00:11:28', 0),
(96, 14, 'user', 11, 'pengacara', 'tes', NULL, '2025-05-29 02:52:14', 0),
(97, 14, 'user', 2, 'pengacara', 'testing', NULL, '2025-05-29 17:15:01', 0),
(98, 2, 'pengacara', 14, 'user', 'testing', NULL, '2025-05-29 17:15:22', 0),
(99, 2, 'pengacara', 14, 'user', 'masuk', NULL, '2025-05-29 17:15:28', 0),
(100, 2, 'pengacara', 14, 'user', 'testing ke 2', NULL, '2025-05-29 17:34:06', 0),
(101, 14, 'user', 2, 'pengacara', 'di terima', NULL, '2025-05-29 17:34:56', 0),
(102, 2, 'user', 2, 'pengacara', 'halo', NULL, '2025-06-10 11:11:07', 0);

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
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP,
  `linkedin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `twitter` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resume_cv` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `portofolio` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
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
  `linkedin` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `twitter` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resume_cv` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `portofolio` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga_konsultasi` int NOT NULL DEFAULT '50000',
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengacara`
--

INSERT INTO `pengacara` (`id`, `nama`, `ktp`, `tanggal_lahir`, `jenis_kelamin`, `alamat`, `email`, `no_hp`, `nomor_induk_advokat`, `universitas`, `pendidikan`, `spesialisasi`, `pengalaman`, `upload_ktp`, `upload_foto`, `upload_kartu_advokat`, `upload_pkpa`, `username`, `password`, `tanggal_daftar`, `linkedin`, `instagram`, `twitter`, `bank_name`, `account_name`, `account_number`, `resume_cv`, `portofolio`, `harga_konsultasi`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'Ahmad Fauzi', '3201010401010001', '1988-05-12', 'Laki-laki', 'Jl. Merdeka No.1 Jakarta', 'azzikrapraqasta1@gmail.com', '081234567890', 'ADV001', 'Universitas Indonesia', 'S1 Hukum', 'Hukum Perdata', 5, 'ktp1.png', '1747075461123-aguss.png', 'kartu1.png', 'pkpa1.png', 'ahmadf', 'root', '2025-04-20 20:03:57', NULL, NULL, NULL, 'Bank BCA', 'Ahmadq', '821038123123', NULL, NULL, 50000, NULL, NULL),
(2, 'Siti Aminah', '3201010401010002', '1990-07-23', 'Perempuan', 'Jl. Sudirman No.2 Jakarta', 'siti.aminah@example.com', '081234567891', 'ADV002', 'Universitas Gadjah Mada', 'S2 Hukum', 'Hukum Pidana', 8, 'ktp2.png', '1746589437463-Siti.png', 'kartu2.png', 'pkpa2.png', 'sitia', 'hashedpassword2', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, '23BA92', '2025-05-14 13:03:19'),
(3, 'Budi Santoso', '3201010401010003', '1985-03-11', 'Laki-laki', 'Jl. Thamrin No.3 Jakarta', 'budi.santoso@example.com', '081234567892', 'ADV003', 'Universitas Airlangga', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 10, 'ktp3.png', '1746589565797-Budi.png', 'kartu3.png', 'pkpa3.png', 'budis', 'hashedpassword3', '2025-04-20 20:03:57', NULL, NULL, NULL, 'Bank BRI', 'Santoso Budi', '117897666322', NULL, NULL, 50000, NULL, NULL),
(4, 'Rina Kusuma', '3201010401010004', '1992-08-05', 'Perempuan', 'Jl. Gatot Subroto No.4 Jakarta', 'rina.kusuma@example.com', '081234567893', 'ADV004', 'Universitas Padjajaran', 'S1 Hukum', 'Hukum Perdata', 4, 'ktp4.png', '1746589603259-rina.png', 'kartu4.png', 'pkpa4.png', 'rinak', 'hashedpassword4', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(5, 'Dedi Kurniawan', '3201010401010005', '1987-10-19', 'Laki-laki', 'Jl. Rasuna Said No.5 Jakarta', 'dedi.kurniawan@example.com', '081234567894', 'ADV005', 'Universitas Islam Indonesia', 'S1 Hukum', 'Hukum Perdata', 7, 'ktp5.png', '1746626478988-dedi.png', 'kartu5.png', 'pkpa5.png', 'dedik', 'hashedpassword5', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(6, 'Nina Kartika', '3201010401010006', '1993-11-25', 'Perempuan', 'Jl. Casablanca No.6 Jakarta', 'nina.kartika@example.com', '081234567895', 'ADV006', 'Universitas Trisakti', 'S2 Hukum', 'Hukum Pidana', 6, 'ktp6.png', '1746626533725-nina.png', 'kartu6.png', 'pkpa6.png', 'ninak', 'hashedpassword6', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(7, 'Yusuf Hidayat', '3201010401010007', '1984-02-10', 'Laki-laki', 'Jl. Kuningan No.7 Jakarta', 'yusuf.hidayat@example.com', '081234567896', 'ADV007', 'Universitas Muhammadiyah Jakarta', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 12, 'ktp7.png', '1746628216720-yusuf.png', 'kartu7.png', 'pkpa7.png', 'yusufh', 'hashedpassword7', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(8, 'Eka Putri', '3201010401010008', '1995-09-15', 'Perempuan', 'Jl. Tebet No.8 Jakarta', 'eka.putri@example.com', '081234567897', 'ADV008', 'Universitas Pelita Harapan', 'S1 Hukum', 'Hukum Keluarga', 3, 'ktp8.png', '1746628484534-eka.png', 'kartu8.png', 'pkpa8.png', 'ekap', 'hashedpassword8', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(9, 'Andi Prasetyo', '3201010401010009', '1986-01-30', 'Laki-laki', 'Jl. Kalibata No.9 Jakarta', 'andi.prasetyo@example.com', '081234567898', 'ADV009', 'Universitas Diponegoro', 'S2 Hukum', 'Hukum HAKI', 9, 'ktp9.png', '1746626753680-andi.png', 'kartu9.png', 'pkpa9.png', 'andip', 'hashedpassword9', '2025-04-20 20:03:57', NULL, NULL, NULL, 'Bank BNI', 'Prasetyo Andi', '92241456789', NULL, NULL, 50000, NULL, NULL),
(10, 'Lia Rahmawati', '3201010401010010', '1991-04-22', 'Perempuan', 'Jl. Pasar Minggu No.10 Jakarta', 'lia.rahmawati@example.com', '081234567899', 'ADV010', 'Universitas Parahyangan', 'S1 Hukum', 'Hukum Perdata', 5, 'ktp10.png', '1746626854298-lia.png', 'kartu10.png', 'pkpa10.png', 'liar', 'hashedpassword10', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(11, 'Dian Syafitri', '3201010401010011', '1990-06-16', 'Perempuan', 'Jl. Antasari No.11 Jakarta', 'dian.syafitri@example.com', '081234567800', 'ADV011', 'Universitas Andalas', 'S1 Hukum', 'Hukum Keluarga', 6, 'ktp11.png', '1746626891931-dian.png', 'kartu11.png', 'pkpa11.png', 'dians', 'hashedpassword11', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(12, 'Fajar Maulana', '3201010401010012', '1983-12-08', 'Laki-laki', 'Jl. Mampang No.12 Jakarta', 'fajar.maulana@example.com', '081234567801', 'ADV012', 'Universitas Brawijaya', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 14, 'ktp12.png', '1746626929858-fajar.png', 'kartu12.png', 'pkpa12.png', 'fajarm', 'hashedpassword12', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(13, 'Mira Kartini', '3201010401010013', '1994-05-28', 'Perempuan', 'Jl. Cilandak No.13 Jakarta', 'mira.kartini@example.com', '081234567802', 'ADV013', 'Universitas Esa Unggul', 'S1 Hukum', 'Hukum Perdata', 2, 'ktp13.png', '1746626960953-mira.png', 'kartu13.png', 'pkpa13.png', 'mirak', 'hashedpassword13', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(14, 'Rudi Hartono', '3201010401010014', '1989-08-30', 'Laki-laki', 'Jl. Prapanca No.14 Jakarta', 'rudi.hartono@example.com', '081234567803', 'ADV014', 'Universitas Atma Jaya', 'S1 Hukum', 'Hukum Pidana', 11, 'ktp14.png', '1746627617939-Rudi.png', 'kartu14.png', 'pkpa14.png', 'rudih', 'hashedpassword14', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(15, 'Desi Anggraini', '3201010401010015', '1993-03-12', 'Perempuan', 'Jl. Cipete No.15 Jakarta', 'desi.anggraini@example.com', '081234567804', 'ADV015', 'Universitas Pancasila', 'S1 Hukum', 'Hukum Bisnis dan Perusahaan', 4, 'ktp15.png', '1746627665072-desi.png', 'kartu15.png', 'pkpa15.png', 'desia', 'hashedpassword15', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(16, 'Rahmat Hidayat', '3201010401010016', '1982-11-20', 'Laki-laki', 'Jl. Kemang No.16 Jakarta', 'rahmat.hidayat@example.com', '081234567805', 'ADV016', 'Universitas Sultan Agung', 'S1 Hukum', 'Hukum Perdata', 15, 'ktp16.png', '1746627754050-rahmat.jpeg', 'kartu16.png', 'pkpa16.png', 'rahmath', 'hashedpassword16', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(17, 'Louis', '3201010401010017', '1995-02-17', 'Perempuan', 'Jl. Lenteng Agung No.17 Jakarta', 'louis@gmail.com', '081234567806', 'ADV017', 'Universitas Mercu Buana', 'S2 Hukum', 'Hukum Perdata', 4, 'ktp17.png', '1746627792377-louis.png', 'kartu17.png', 'pkpa17.png', 'liliss', 'hashedpassword17', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(19, 'Fitri Yuliani', '3201010401010019', '1992-06-14', 'Perempuan', 'Jl. Pasar Rebo No.19 Jakarta', 'fitri.yuliani@example.com', '081234567808', 'ADV019', 'Universitas Lampung', 'S1 Hukum', 'Hukum Keluarga', 5, 'ktp19.png', '1746627913183-fitrii.png', 'kartu19.png', 'pkpa19.png', 'fitriy', 'hashedpassword19', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(20, 'Agus Saputra', '3201010401010020', '1988-01-01', 'Laki-laki', 'Jl. Condet No.20 Jakarta', 'agus.saputra@example.com', '081234567809', 'ADV020', 'Universitas Mulawarman', 'S1 Hukum', 'Hukum Ketenagakerjaan', 8, 'ktp20.png', '1746591929001-agus.png', 'kartu20.png', 'pkpa20.png', 'aguss', 'hashedpassword20', '2025-04-20 20:03:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 50000, NULL, NULL),
(31, 'Ahmad Fauzi', '2222', '0222-02-22', 'Laki-laki', 'Jl. Merdeka No.1 Jakarta', 'fajri30.r@gmail.com', '2222224', '222223', 'Universitas Indonesia 3', 'S1 Hukum', 'Hukum perdata', 11, '1747330218227-Lawyer Login dan Register.png', '1747330218229-Lawyer Login dan Register.png', '1747330218230-Lawyer Login dan Register.png', '1747330218232-Lawyer Login dan Register.png', 'admin@cerdashukum.com', '222', '2025-05-16 00:35:14', 'https://x.com/', 'https://x.com/', 'https://x.com/', NULL, NULL, NULL, '1747330218233-Lawyer Login dan Register.png', '1747330218235-Lawyer Login dan Register.png', 50000, NULL, NULL),
(32, 'ts', '31234433', '0222-02-22', 'Laki-laki', 'Jl. Merdeka No.1 Jakarta', 'vns@gmail.com', '22222456777', '22222352', 'Universitas Indonesia', 'S1 Huuku', 'Hukum keluarga', 7, '1748516675670-WIN_20250526_11_01_41_Pro.jpg', '1748516675674-WIN_20250526_11_01_41_Pro.jpg', '1748516675678-WIN_20250526_11_01_41_Pro.jpg', '1748516675680-WIN_20250526_11_01_41_Pro.jpg', 'testing', '222', '2025-05-29 18:04:52', 'https://x.com/', 'https://x.com/', 'https://x.com/', NULL, NULL, NULL, '1748516675684-WIN_20250526_11_01_41_Pro.jpg', '1748516675686-WIN_20250526_11_01_41_Pro.jpg', 50000, NULL, NULL);

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
-- Table structure for table `review_pengacara`
--

CREATE TABLE `review_pengacara` (
  `id` int NOT NULL,
  `pengacara_id` int NOT NULL,
  `user_id` int NOT NULL,
  `kasus_id` int DEFAULT NULL,
  `konsultasi_id` int DEFAULT NULL,
  `rating` tinyint NOT NULL,
  `komentar` text,
  `tanggal_review` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `review_pengacara`
--

INSERT INTO `review_pengacara` (`id`, `pengacara_id`, `user_id`, `kasus_id`, `konsultasi_id`, `rating`, `komentar`, `tanggal_review`) VALUES
(1, 9, 2, 7, NULL, 5, 'Sangat profesional dan membantu saya memahami hak waris keluarga. Penjelasannya detail dan mudah dimengerti. Sangat direkomendasikan!', '2025-05-15 03:00:00'),
(2, 3, 2, 10, NULL, 4, 'Proses pembuatan dokumen perjanjian berjalan lancar. Ada beberapa revisi kecil tapi secara keseluruhan pelayanannya memuaskan.', '2025-05-20 04:30:00'),
(3, 1, 14, NULL, 6, 3, 'Sesi konsultasi cukup baik, tapi saya berharap bisa mendapatkan jawaban yang lebih mendalam. Terasa sedikit terburu-buru.', '2025-05-16 02:00:00'),
(4, 2, 14, NULL, 17, 5, 'Luar biasa! Ibu Siti sangat ahli dalam hukum pidana. Saya merasa lebih tenang setelah berkonsultasi. Terima kasih banyak.', '2025-05-28 11:00:00'),
(5, 7, 2, NULL, 1, 4, 'Pelayanan cepat dan tanggap. Memberikan pandangan hukum yang jelas untuk masalah bisnis saya.', '2025-05-15 07:00:00'),
(6, 1, 1, 6, NULL, 5, 'Kasus KDRT yang saya ajukan ditangani dengan sangat baik dan penuh empati. Hasilnya juga memuaskan. Terima kasih Pak Fauzi.', '2025-05-13 08:00:00'),
(7, 3, 14, NULL, 16, 2, 'Kurang puas, responnya agak lambat dan solusi yang diberikan terasa umum. Tidak sesuai ekspektasi saya.', '2025-05-28 13:15:00'),
(8, 9, 2, 8, NULL, 5, 'Pendampingan yang sangat solid. Pak Andi selalu siap sedia memberikan update dan saran. Highly recommended!', '2025-05-16 10:00:00'),
(9, 4, 1, NULL, NULL, 4, 'Ulasan untuk pengacara yang kasusnya tidak tercatat di sistem. Secara umum pelayanannya baik.', '2025-06-01 03:00:00'),
(10, 2, 1, NULL, 14, 5, 'Konsultasi hukum pidana yang sangat berbobot. Semua pertanyaan saya terjawab tuntas.', '2025-06-10 07:00:00'),
(11, 2, 2, NULL, NULL, 5, 'bagus tes te', '2025-06-16 16:44:11'),
(12, 1, 9, 46, NULL, 5, 'tes', '2025-06-17 04:34:48');

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
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `gender`, `birthdate`, `created_at`, `address`, `photo`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'zikra', 'termiteindonesia@gmail.com', '089918181819', 'ayam', 'L', '1888-02-01', '2025-03-20 07:09:05', 'Jakarta Barat', '1747336247911.jpg', NULL, NULL),
(2, 'Fajri', 'fajri30.r@gmail.com', '085706125411', '12345678', 'L', '1988-03-01', '2025-03-20 07:13:06', 'Kebon Jeruk', '1749218036024.png', 'F635FE', '2025-05-18 19:39:31'),
(3, 'Vanes Lampung', 'vanes@gmail.com', '08928188192', '12345678', 'L', '2025-10-03', '2025-03-20 07:26:06', '', NULL, NULL, NULL),
(4, 'human', 'human@gmail.com', '1234156161718', '12345678', 'L', '1888-01-01', '2025-03-20 07:32:57', NULL, NULL, NULL, NULL),
(5, 'newest', 'newest@gmail.com', '09891817182', '12345678', 'P', '2000-10-10', '2025-03-20 08:48:30', NULL, NULL, NULL, NULL),
(6, 'baru', 'baru@gmail.com', '12345678', '12345678', 'P', '2025-03-20', '2025-03-20 09:08:23', NULL, NULL, NULL, NULL),
(7, 'newbie', 'newbie@gmail.com', '12345678', '12345678', 'L', '2025-03-20', '2025-03-20 09:11:59', NULL, NULL, NULL, NULL),
(8, 'black', 'black@gmail.com', '1234156161718', '$2b$10$ITbuKjaBTFRvNxjOIjgZHummJGSjMra30jFR9.fdm.Sr4QPeGji5q', 'L', '2000-10-02', '2025-03-25 15:26:48', NULL, NULL, NULL, NULL),
(9, 'demon', 'demon@gmail.com', '089918181819', '12345678', 'L', '1898-02-01', '2025-03-25 15:48:10', NULL, NULL, NULL, NULL),
(10, 'abc', 'abc@gmail.com', '123456', '12345678', 'L', '1222-11-11', '2025-03-27 03:18:49', NULL, NULL, NULL, NULL),
(11, 'Vannes vernando ', 'vanesvernando72@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:05:26', NULL, NULL, NULL, NULL),
(13, 'Vannes vernando ', 'vanesvernando@gmail.com', '085781086148', '333', 'L', '0033-03-31', '2025-04-09 11:07:27', NULL, NULL, NULL, NULL),
(14, 'Vannes vernando ', 'vns@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 11:30:29', '', '1748429171884.jpg', NULL, NULL),
(15, 'Vannes vernando ', 'cba@gmail.com', '085781086148', '222', 'L', '2222-02-22', '2025-04-09 14:20:19', NULL, NULL, NULL, NULL),
(16, 'manusia', 'manusia@gmail.com', '089967372738', '222', 'L', '2025-05-01', '2025-04-15 08:23:51', NULL, NULL, NULL, NULL),
(17, 'ihsan', 'ihsan@gmail.com', '8789907788', '333', 'L', '2025-04-15', '2025-04-15 08:26:36', NULL, NULL, NULL, NULL),
(18, 'Ayunnie', 'sukagelay299@gmail.com', '0857061254118', '222', 'P', '2222-02-22', '2025-04-15 08:28:08', NULL, NULL, NULL, NULL),
(21, 'testing', 'testing@email.com', '997479383989', '123456', 'L', '2000-01-01', '2025-05-29 11:02:13', 'tes', NULL, NULL, NULL);

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
-- Indexes for table `ajukan_kasus`
--
ALTER TABLE `ajukan_kasus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `artikel_berita`
--
ALTER TABLE `artikel_berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faq_hukum`
--
ALTER TABLE `faq_hukum`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`),
  ADD KEY `id_pengacara` (`id_pengacara`);

--
-- Indexes for table `konsultasi_session`
--
ALTER TABLE `konsultasi_session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unik_session` (`user_id`,`pengacara_id`,`start_time`);

--
-- Indexes for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengguna` (`id_pengguna`);

--
-- Indexes for table `log_pertanyaan_user`
--
ALTER TABLE `log_pertanyaan_user`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `review_pengacara`
--
ALTER TABLE `review_pengacara`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pengacara` (`pengacara_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `fk_review_for_kasus` (`kasus_id`),
  ADD KEY `fk_review_for_konsultasi` (`konsultasi_id`);

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
-- AUTO_INCREMENT for table `ajukan_kasus`
--
ALTER TABLE `ajukan_kasus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `artikel_berita`
--
ALTER TABLE `artikel_berita`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `faq_hukum`
--
ALTER TABLE `faq_hukum`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `konsultasi`
--
ALTER TABLE `konsultasi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `konsultasi_session`
--
ALTER TABLE `konsultasi_session`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `log_pertanyaan_user`
--
ALTER TABLE `log_pertanyaan_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pengacara`
--
ALTER TABLE `pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_pengacara`
--
ALTER TABLE `review_pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`id_pengguna`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_pengacara`
--
ALTER TABLE `review_pengacara`
  ADD CONSTRAINT `fk_review_for_kasus` FOREIGN KEY (`kasus_id`) REFERENCES `ajukan_kasus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_for_konsultasi` FOREIGN KEY (`konsultasi_id`) REFERENCES `konsultasi_session` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_from_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_to_pengacara` FOREIGN KEY (`pengacara_id`) REFERENCES `pengacara` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
