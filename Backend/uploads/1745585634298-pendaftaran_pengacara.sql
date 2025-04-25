-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Apr 2025 pada 05.13
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

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pendaftaran_pengacara`
--
ALTER TABLE `pendaftaran_pengacara`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
