USE nodues;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `defaulters` (
  `rollNumber` varchar(10) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tpc` tinyint(1) NOT NULL DEFAULT 0,
  `store` tinyint(1) NOT NULL DEFAULT 0,
  `library` tinyint(1) NOT NULL DEFAULT 0,
  `deplib` tinyint(1) NOT NULL DEFAULT 0,
  `deplabs` tinyint(1) NOT NULL DEFAULT 0,
  `commonlabs` tinyint(1) NOT NULL DEFAULT 0,
  `accounts` tinyint(1) NOT NULL DEFAULT 0,
  `exam` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `requests` (
  `_id` int(11) NOT NULL,
  `rollNumber` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `classValue` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `areYouPlaced` tinyint(1) DEFAULT NULL,
  `deplabs` tinyint(1) DEFAULT NULL,
  `commonlabs` tinyint(1) DEFAULT NULL,
  `accounts` tinyint(1) DEFAULT NULL,
  `exam` tinyint(1) DEFAULT NULL,
  `library` tinyint(1) DEFAULT NULL,
  `deplib` tinyint(1) DEFAULT NULL,
  `store` tinyint(1) DEFAULT NULL,
  `tpc` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `students` (
  `rollNumber` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `classValue` varchar(255) DEFAULT NULL,
  `passedOutYear` varchar(255) DEFAULT NULL,
  `postalAddress` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `feeReceiptNumber` varchar(255) DEFAULT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `isPursuingHS` tinyint(1) NOT NULL,
  `higherStudies` varchar(255) NOT NULL,
  `areYouPlaced` tinyint(1) DEFAULT NULL,
  `offerLetter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`offerLetter`)),
  `internship` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`internship`)),
  `letterOfJoining` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`letterOfJoining`)),
  `isFilled` tinyint(1) DEFAULT 0,
  `isCompleted` tinyint(1) DEFAULT 0,
  `password` varchar(255) DEFAULT 'dypatil@123'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `requests` ADD PRIMARY KEY (`_id`);

ALTER TABLE `students` ADD PRIMARY KEY (`rollNumber`);

ALTER TABLE `requests` MODIFY `_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

COMMIT;
