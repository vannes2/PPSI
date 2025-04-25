-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 24, 2025 at 04:03 PM
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
  `tanggal_daftar` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengacara`
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
(21, 'steve', '12818811992', '2025-04-20', 'Laki-laki', 'jawa', 'steve@gmail.com', '089977661661', 'ADV100', 'Universitas Indonesia', 'S2 Hukum', 'Hukum Internasional', 5, '1745156923607-pengacara (1).sql', '1745156923611-pengacara (1).sql', '1745156923609-pengacara (1).sql', '1745156923611-pengacara (1).sql', 'steve', '$2b$10$QAU6K4ov2naaCELI3Jjd1eEt/YPgtBSVndB35M.DVjJb1n8SdOD/e', '2025-04-20 20:48:43'),
(22, 'jamaludin', '31829201010', '1980-01-15', 'Laki-laki', 'Jl Kedaton', 'jamaludin@yahoo.com', '088812123456', 'ADV77', 'UPH', 'S2 Ilmu Hukum', 'Hukum Bisnis', 12, '1745157508818-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508841-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508828-ChatGPT Image Apr 17, 2025, 10_53_20 AM.png', '1745157508853-ChatGPT Image Apr 17, 2025, 10_51_55 AM.png', 'jamal', '$2b$10$XFIk/eKfkfDA0hZkYYy3Jen1KjieWOCWfGp1u3eG1qPBRn4aj.7E2', '2025-04-20 20:58:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pengacara`
--
ALTER TABLE `pengacara`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pengacara`
--
ALTER TABLE `pengacara`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
