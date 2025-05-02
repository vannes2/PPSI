-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 02, 2025 at 11:54 AM
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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
