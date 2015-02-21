-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 13, 2015 at 10:28 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `admin`
--
CREATE DATABASE IF NOT EXISTS `admin` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `admin`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `account_name` varchar(50) NOT NULL,
  `account_type` varchar(10) NOT NULL,
  `account_number` int(11) NOT NULL,
  `account_balance` bigint(11) NOT NULL,
  `created_date` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `account_name`, `account_type`, `account_number`, `account_balance`, `created_date`) VALUES
(81, 188, 'citi', 'savings', 123456789, 20000, ''),
(85, 187, 'citi bank', 'savings', 12345679, 50000, '');

-- --------------------------------------------------------

--
-- Table structure for table `category_managent`
--

CREATE TABLE IF NOT EXISTS `category_managent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(20) NOT NULL,
  `sub_category` varchar(20) NOT NULL,
  `created_date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=187 ;

--
-- Dumping data for table `category_managent`
--

INSERT INTO `category_managent` (`id`, `category`, `sub_category`, `created_date`) VALUES
(134, 'Giving', 'Tithing', '2015-02-12'),
(135, 'Giving', 'Offerings', '2015-02-12'),
(136, 'Giving', 'Charities', '2015-02-12'),
(137, 'Food', 'Groceries', ''),
(138, 'Food', 'Restaurants', ''),
(139, 'Food', 'Pet Food/Treats', ''),
(140, 'Shelter', 'Mortgage', ''),
(141, 'Shelter', 'Rent', ''),
(142, 'Shelter', 'Property Taxes', ''),
(143, 'Shelter', 'Household Repairs', ''),
(144, 'Shelter', 'HOA Dues', ''),
(145, 'Utilities', 'Electricity', ''),
(147, 'Utilities', 'Water', ''),
(148, 'Utilities', 'Heating', ''),
(149, 'Utilities', 'Garbage', ''),
(150, 'Utilities', 'Phones', ''),
(151, 'Utilities', 'Cable', ''),
(152, 'Utilities', 'Internet', ''),
(153, 'Clothing', 'Children’s Clothing', ''),
(154, 'Clothing', 'Adults’ Clothing', ''),
(155, 'Transportation', 'Fuel', ''),
(156, 'Transportation', 'Tires', ''),
(157, 'Transportation', 'Oil Changes', ''),
(158, 'Transportation', 'Maintenance', ''),
(159, 'Transportation', 'Parking Fees', ''),
(160, 'Transportation', 'Repairs', ''),
(161, 'Transportation', 'DMV Fees', ''),
(162, 'Transportation', 'Vehicle Replacement', ''),
(164, 'Medical', 'Primary Care', ''),
(165, 'Medical', 'Dental Care', ''),
(166, 'Medical', 'Specialty Care – Thi', ''),
(167, 'Medical', 'Medications', ''),
(168, 'Medical', 'Medical Devices', ''),
(169, 'Insurance', 'Health Insurance', ''),
(170, 'Insurance', 'Homeowner’s Insuranc', ''),
(171, 'Insurance', 'Renter’s Insurance', ''),
(172, 'Insurance', 'Auto Insurance', ''),
(173, 'Insurance', 'Life Insurance', ''),
(174, 'Insurance', 'Disability Insurance', ''),
(175, 'Insurance', 'Identity Theft Prote', ''),
(176, 'Insurance', 'Longterm Care Insura', ''),
(177, 'Fun Money', 'Entertainment', ''),
(178, 'Fun Money', 'Games', ''),
(179, 'Fun Money', 'Eating Out', ''),
(180, 'Fun Money', 'Vacations', ''),
(181, 'Fun Money', 'Subscriptions', ''),
(182, 'Debt Reduction', 'Mortgage', ''),
(183, 'Debt Reduction', 'Credit Card', ''),
(184, 'Debt Reduction', 'Personal Loan', ''),
(185, 'Debt Reduction', 'Student Loan', '');

-- --------------------------------------------------------

--
-- Table structure for table `credit_cards`
--

CREATE TABLE IF NOT EXISTS `credit_cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `account_name` varchar(20) NOT NULL,
  `account_type` varchar(10) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `outstanding_balance` varchar(20) NOT NULL,
  `interest` varchar(10) NOT NULL,
  `credit_limit` varchar(20) NOT NULL,
  `due_date` varchar(10) NOT NULL,
  `created_date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `credit_cards`
--

INSERT INTO `credit_cards` (`id`, `user_id`, `account_name`, `account_type`, `account_number`, `outstanding_balance`, `interest`, `credit_limit`, `due_date`, `created_date`) VALUES
(1, 187, 'citi', 'credit', '12345', '12000', '2', '1000000', '2', ''),
(4, 187, 'hdfc', 'visa', '123456789', '20000', '2', '500000', '1', ''),
(5, 187, 'standard charterd', 'mastercard', '123456789', '50000', '1', '5000000', '4', '');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=197 ;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`uid`, `name`, `email`, `phone`, `password`, `address`, `city`, `created`) VALUES
(187, 'senthilnathan', 'msnjsk@gmail.com', '9035323621', '123', 'F1 sri rama nivas tc palya,ramamurty nagar', 'bangalore', '2015-02-09 15:03:46'),
(188, 'karthikeyan', 'car@gmail.com', '935648646', 'karthi', 'sdfsdfsdf', 'salem', '2015-02-11 11:23:17'),
(196, 'senthilnathan', 'msn@gmail.com', '', 'msn', '', '', '2015-02-11 16:34:59');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE IF NOT EXISTS `loans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `bank_name` varchar(20) NOT NULL,
  `loan_number` varchar(20) NOT NULL,
  `loan_type` varchar(10) NOT NULL,
  `opening_balance` varchar(20) NOT NULL,
  `interest` varchar(10) NOT NULL,
  `loan_start_date` varchar(20) NOT NULL,
  `loan_tenure` varchar(50) NOT NULL,
  `payment_due_day` varchar(20) NOT NULL,
  `created_date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `user_id`, `bank_name`, `loan_number`, `loan_type`, `opening_balance`, `interest`, `loan_start_date`, `loan_tenure`, `payment_due_day`, `created_date`) VALUES
(8, 187, 'citi bank', '123456789', 'personal', '1000000', '13', '234234', '4', '1', ''),
(9, 187, 'kodak', '123456789', 'personal', '1000000', '13.5', '324234', '4', '6', '');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_title` varchar(20) NOT NULL,
  `event_dueDate` varchar(100) NOT NULL,
  `event_color` varchar(10) NOT NULL,
  `event_recurrence` varchar(10) NOT NULL,
  `created_date` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `user_id`, `event_title`, `event_dueDate`, `event_color`, `event_recurrence`, `created_date`) VALUES
(6, 187, 'dfgdfgdfg', 'Thu Feb 12 2015 00:00:00 GMT+0530 (India Standard Time)', '', 'daily', ''),
(7, 187, 'vxcvxcv', 'Thu Feb 12 2015 00:00:00 GMT+0530 (India Standard Time)', '#f012be', 'weekdays', ''),
(8, 187, 'test', 'Sat Feb 14 2015 00:00:00 GMT+0530 (India Standard Time)', '', 'weekdays', ''),
(9, 187, 'sample remainder', 'Sat Feb 28 2015 00:00:00 GMT+0530 (India Standard Time)', '#f39c12', 'one_time', ''),
(10, 187, 'asdasdasd', 'Fri Feb 20 2015 00:00:00 GMT+0530 (India Standard Time)', '#00c0ef', 'monthly', ''),
(11, 187, 'smale', 'Fri Feb 13 2015 00:00:00 GMT+0530 (India Standard Time)', '', 'daily', ''),
(12, 187, 'sdfsdf', 'Fri Feb 13 2015 00:00:00 GMT+0530 (India Standard Time)', '#00c0ef', 'one_time', ''),
(13, 187, 'sample text for remi', 'Thu Feb 26 2015 00:00:00 GMT+0530 (India Standard Time)', '#f56954', 'monthly', ''),
(14, 187, 'asdasdas', 'Fri Mar 13 2015 00:00:00 GMT+0530 (India Standard Time)', '#f012be', 'monthly', ''),
(15, 187, 'sdfsdf', 'Sat Feb 14 2015 00:00:00 GMT+0530 (India Standard Time)', '#f56954', 'monthly', ''),
(16, 187, 'ertertertert', 'Fri Apr 17 2015 00:00:00 GMT+0530 (India Standard Time)', '#00a65a', 'monthly', ''),
(17, 187, 'rtyrtyrtyrtyrt', 'Mon Feb 16 2015 00:00:00 GMT+0530 (India Standard Time)', '#932ab6', 'monthly', '');

-- --------------------------------------------------------

--
-- Table structure for table `transcations`
--

CREATE TABLE IF NOT EXISTS `transcations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `transcation_account` varchar(10) NOT NULL,
  `transcation_date` varchar(100) NOT NULL,
  `transcation_amount` float NOT NULL,
  `transcation_tag` varchar(10) NOT NULL,
  `transcation_description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `sub_category` varchar(50) NOT NULL,
  `created_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=77 ;

--
-- Dumping data for table `transcations`
--

INSERT INTO `transcations` (`id`, `user_id`, `transcation_account`, `transcation_date`, `transcation_amount`, `transcation_tag`, `transcation_description`, `category`, `sub_category`, `created_date`) VALUES
(70, 187, 'saving', '1423699200000', 1500, 'expense', 'sdasdasdasd', 'Giving', 'Offerings', '0000-00-00'),
(71, 187, 'credit car', '1423008000000', 1500, 'expense', 'ertertert', 'Food', 'Restaurants', '0000-00-00'),
(72, 187, 'saving', '1423699200000', 1500, 'expense', 'dfgdfgdfgdfg', 'Transportation', 'Fuel', '0000-00-00'),
(73, 187, 'saving', '1422921600000', 1500, 'expense', 'xvxcxcvxcvxcvxc', 'Food', 'Groceries', '0000-00-00'),
(74, 187, 'saving', '1423699200000', 1500, 'income', 'party', 'Food', 'Restaurants', '0000-00-00'),
(75, 187, 'saving', '1423699200000', 2000, 'Refund', 'dfgdfg', 'Insurance', 'Life Insurance', '0000-00-00'),
(76, 187, 'saving', '1423699200000', 2000, 'income', 'sdfsdfsdf', 'Giving', 'Tithing', '0000-00-00');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
