-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 06, 2019 at 10:29 AM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dicebot`
--

CREATE DATABASE IF NOT EXISTS `dicebot` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `dicebot`;

-- --------------------------------------------------------

--
-- Table structure for table `bot_accounts`
--

CREATE TABLE `bot_accounts` (
  `botID` int(8) NOT NULL,
  `user` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `api` varchar(128) NOT NULL,
  `disabled` int(2) NOT NULL,
  `deposit` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bot_accounts`
--

INSERT INTO `bot_accounts` (`botID`, `user`, `password`, `api`, `disabled`, `deposit`) VALUES
(1, 'account_name', 'plaintext_password', 'api_key', 0, 'deposit_adress');

-- --------------------------------------------------------

--
-- Table structure for table `bot_state`
--

CREATE TABLE `bot_state` (
  `botID` int(8) NOT NULL,
  `round` int(8) NOT NULL,
  `lost` int(8) NOT NULL,
  `depth` int(8) NOT NULL,
  `basebet` varchar(16) NOT NULL,
  `balance` varchar(64) NOT NULL,
  `continue` int(1) NOT NULL,
  `disabled` int(1) NOT NULL,
  `lastRequest` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bot_state`
--

INSERT INTO `bot_state` (`botID`, `round`, `lost`, `depth`, `basebet`, `balance`, `continue`, `disabled`, `lastRequest`) VALUES
(1, 0, 0, 0, '0', '0', 0, 0, '00-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `proxy`
--

CREATE TABLE `proxy` (
  `proxyID` int(11) NOT NULL,
  `host` varchar(16) NOT NULL,
  `port` int(5) NOT NULL,
  `inUse` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `proxy`
--

INSERT INTO `proxy` (`proxyID`, `host`, `port`, `inUse`) VALUES
(1, '127.0.0.1', 999, 0);
-- --------------------------------------------------------

--
-- Table structure for table `stats`
--

CREATE TABLE `stats` (
  `ID` int(11) NOT NULL,
  `lost_alltime` int(64) NOT NULL,
  `won_alltime` int(64) NOT NULL,
  `highest_winstreak` int(8) NOT NULL,
  `highest_loosestreak` int(8) NOT NULL,
  `highest_win` int(64) NOT NULL,
  `highest_loose` int(64) NOT NULL,
  `bets` int(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stats`
--

INSERT INTO `stats` (`ID`, `lost_alltime`, `won_alltime`, `highest_winstreak`, `highest_loosestreak`, `highest_win`, `highest_loose`, `bets`) VALUES
(1, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `strategy`
--

CREATE TABLE `strategy` (
  `botID` int(8) NOT NULL,
  `basebet` int(32) NOT NULL,
  `chance` varchar(8) NOT NULL,
  `multiply` varchar(8) NOT NULL,
  `max_value` int(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `strategy`
--

INSERT INTO `strategy` (`botID`, `basebet`, `chance`, `multiply`, `max_value`) VALUES
(1, 1000, '600000', '2', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bot_accounts`
--
ALTER TABLE `bot_accounts`
  ADD PRIMARY KEY (`botID`);

--
-- Indexes for table `bot_state`
--
ALTER TABLE `bot_state`
  ADD PRIMARY KEY (`botID`);

--
-- Indexes for table `proxy`
--
ALTER TABLE `proxy`
  ADD PRIMARY KEY (`proxyID`),
  ADD UNIQUE KEY `host` (`host`);

--
-- Indexes for table `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `strategy`
--
ALTER TABLE `strategy`
  ADD PRIMARY KEY (`botID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bot_accounts`
--
ALTER TABLE `bot_accounts`
  MODIFY `botID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `bot_state`
--
ALTER TABLE `bot_state`
  MODIFY `botID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `proxy`
--
ALTER TABLE `proxy`
  MODIFY `proxyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;
--
-- AUTO_INCREMENT for table `stats`
--
ALTER TABLE `stats`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `strategy`
--
ALTER TABLE `strategy`
  MODIFY `botID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;COMMIT;
