-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 31.11.39.91:3306
-- Creato il: Dic 18, 2022 alle 08:23
-- Versione del server: 5.7.35-38-log
-- Versione PHP: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Sql1627101_1`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `actions`
--

CREATE TABLE `actions` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `subtype` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL,
  `object` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `actiontags`
--

CREATE TABLE `actiontags` (
  `actionid` int(11) NOT NULL,
  `tag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `armor`
--

CREATE TABLE `armor` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `object` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `backgrounds`
--

CREATE TABLE `backgrounds` (
  `id` int(11) NOT NULL,
  `background` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `bases`
--

CREATE TABLE `bases` (
  `id` int(11) NOT NULL,
  `age` varchar(255) NOT NULL,
  `part` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `characters`
--

CREATE TABLE `characters` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `folderid` int(11) DEFAULT NULL,
  `object` json NOT NULL,
  `trashed` tinyint(1) DEFAULT '0',
  `originalid` int(11) DEFAULT NULL,
  `originaluserid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `object` json NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `folderid` int(11) DEFAULT NULL,
  `trashed` tinyint(1) DEFAULT '0',
  `originaluserid` int(11) DEFAULT NULL,
  `originalid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `classvariants`
--

CREATE TABLE `classvariants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classid` int(11) NOT NULL,
  `object` json NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `damagetypes`
--

CREATE TABLE `damagetypes` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `folders`
--

CREATE TABLE `folders` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `folderid` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `trashed` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `languages`
--

CREATE TABLE `languages` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `script` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `names`
--

CREATE TABLE `names` (
  `race` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `professions`
--

CREATE TABLE `professions` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `age` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `object` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `publications`
--

CREATE TABLE `publications` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
  `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `monstertype` int(11) DEFAULT NULL,
  `cr` float DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `alignment` int(11) DEFAULT NULL,
  `adds` int(11) DEFAULT '0',
  `url` varchar(255) NOT NULL,
  `meta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `publicationsenvironments`
--

CREATE TABLE `publicationsenvironments` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `string` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `publicationsratings`
--

CREATE TABLE `publicationsratings` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `publicationssearchtags`
--

CREATE TABLE `publicationssearchtags` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `string` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `publicationssubtypes`
--

CREATE TABLE `publicationssubtypes` (
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `string` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `quirks`
--

CREATE TABLE `quirks` (
  `id` int(11) NOT NULL,
  `quirk` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `races`
--

CREATE TABLE `races` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `nameType` varchar(255) DEFAULT 'human',
  `object` json NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `folderid` int(11) DEFAULT NULL,
  `trashed` tinyint(1) DEFAULT '0',
  `originalid` int(11) DEFAULT NULL,
  `originaluserid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `racevariants`
--

CREATE TABLE `racevariants` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `raceid` int(11) NOT NULL,
  `object` json NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `reports`
--

CREATE TABLE `reports` (
  `reportid` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `userid` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `report` text,
  `datereported` datetime DEFAULT CURRENT_TIMESTAMP,
  `dateaction` datetime DEFAULT NULL,
  `moderator` int(11) DEFAULT NULL,
  `action` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `spells`
--

CREATE TABLE `spells` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `object` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `surnames`
--

CREATE TABLE `surnames` (
  `race` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `templates`
--

CREATE TABLE `templates` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `game` varchar(255) NOT NULL,
  `object` json NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `folderid` int(11) DEFAULT NULL,
  `trashed` tinyint(1) DEFAULT '0',
  `originalid` int(11) DEFAULT NULL,
  `originaluserid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `traits`
--

CREATE TABLE `traits` (
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `subtitle` tinyint(1) DEFAULT '0',
  `category` varchar(255) NOT NULL,
  `feeling` tinyint(1) DEFAULT '0',
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `tokenpwd` varchar(255) DEFAULT NULL,
  `verified` tinyint(4) DEFAULT '0',
  `premium` datetime DEFAULT NULL,
  `level` tinyint(4) DEFAULT '0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `publishsuspension` datetime DEFAULT NULL,
  `sessiontoken` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zipcode` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subscriptionstatus` varchar(255) DEFAULT NULL,
  `subscriptionmethod` varchar(255) DEFAULT NULL,
  `customerid` varchar(255) DEFAULT NULL,
  `subscriptionid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `voices`
--

CREATE TABLE `voices` (
  `voice` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `weapons`
--

CREATE TABLE `weapons` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `object` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `actiontags`
--
ALTER TABLE `actiontags`
  ADD PRIMARY KEY (`actionid`,`tag`);

--
-- Indici per le tabelle `armor`
--
ALTER TABLE `armor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `backgrounds`
--
ALTER TABLE `backgrounds`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indici per le tabelle `bases`
--
ALTER TABLE `bases`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indici per le tabelle `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folderid` (`folderid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folderid` (`folderid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `classvariants`
--
ALTER TABLE `classvariants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classid` (`classid`);

--
-- Indici per le tabelle `damagetypes`
--
ALTER TABLE `damagetypes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folderid` (`folderid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `names`
--
ALTER TABLE `names`
  ADD UNIQUE KEY `id` (`name`,`gender`,`race`);

--
-- Indici per le tabelle `professions`
--
ALTER TABLE `professions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `publications`
--
ALTER TABLE `publications`
  ADD PRIMARY KEY (`id`,`type`),
  ADD UNIQUE KEY `id` (`id`,`type`);

--
-- Indici per le tabelle `publicationsenvironments`
--
ALTER TABLE `publicationsenvironments`
  ADD PRIMARY KEY (`id`,`type`,`string`);

--
-- Indici per le tabelle `publicationsratings`
--
ALTER TABLE `publicationsratings`
  ADD PRIMARY KEY (`id`,`type`,`userid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `publicationssearchtags`
--
ALTER TABLE `publicationssearchtags`
  ADD PRIMARY KEY (`id`,`type`,`string`);

--
-- Indici per le tabelle `publicationssubtypes`
--
ALTER TABLE `publicationssubtypes`
  ADD PRIMARY KEY (`id`,`type`,`string`);

--
-- Indici per le tabelle `quirks`
--
ALTER TABLE `quirks`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indici per le tabelle `races`
--
ALTER TABLE `races`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folderid` (`folderid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `racevariants`
--
ALTER TABLE `racevariants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raceid` (`raceid`);

--
-- Indici per le tabelle `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`reportid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `skills`
--
ALTER TABLE `skills`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indici per le tabelle `spells`
--
ALTER TABLE `spells`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `surnames`
--
ALTER TABLE `surnames`
  ADD UNIQUE KEY `id` (`surname`,`gender`,`race`);

--
-- Indici per le tabelle `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folderid` (`folderid`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `traits`
--
ALTER TABLE `traits`
  ADD PRIMARY KEY (`name`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idemail` (`id`,`email`);

--
-- Indici per le tabelle `voices`
--
ALTER TABLE `voices`
  ADD PRIMARY KEY (`voice`);

--
-- Indici per le tabelle `weapons`
--
ALTER TABLE `weapons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `actions`
--
ALTER TABLE `actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `armor`
--
ALTER TABLE `armor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `backgrounds`
--
ALTER TABLE `backgrounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `bases`
--
ALTER TABLE `bases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `characters`
--
ALTER TABLE `characters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `classvariants`
--
ALTER TABLE `classvariants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `damagetypes`
--
ALTER TABLE `damagetypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `folders`
--
ALTER TABLE `folders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `professions`
--
ALTER TABLE `professions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `quirks`
--
ALTER TABLE `quirks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `races`
--
ALTER TABLE `races`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `racevariants`
--
ALTER TABLE `racevariants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `reports`
--
ALTER TABLE `reports`
  MODIFY `reportid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `spells`
--
ALTER TABLE `spells`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `weapons`
--
ALTER TABLE `weapons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `actions`
--
ALTER TABLE `actions`
  ADD CONSTRAINT `actions_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `actiontags`
--
ALTER TABLE `actiontags`
  ADD CONSTRAINT `actiontags_ibfk_1` FOREIGN KEY (`actionid`) REFERENCES `actions` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `armor`
--
ALTER TABLE `armor`
  ADD CONSTRAINT `armor_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `characters`
--
ALTER TABLE `characters`
  ADD CONSTRAINT `characters_ibfk_1` FOREIGN KEY (`folderid`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `characters_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`folderid`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `classvariants`
--
ALTER TABLE `classvariants`
  ADD CONSTRAINT `classvariants_ibfk_1` FOREIGN KEY (`classid`) REFERENCES `classes` (`id`);

--
-- Limiti per la tabella `damagetypes`
--
ALTER TABLE `damagetypes`
  ADD CONSTRAINT `damagetypes_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`folderid`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `folders_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `languages`
--
ALTER TABLE `languages`
  ADD CONSTRAINT `languages_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `professions`
--
ALTER TABLE `professions`
  ADD CONSTRAINT `professions_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `publicationsenvironments`
--
ALTER TABLE `publicationsenvironments`
  ADD CONSTRAINT `publicationsenvironments_ibfk_1` FOREIGN KEY (`id`,`type`) REFERENCES `publications` (`id`, `type`) ON DELETE CASCADE;

--
-- Limiti per la tabella `publicationsratings`
--
ALTER TABLE `publicationsratings`
  ADD CONSTRAINT `publicationsratings_ibfk_1` FOREIGN KEY (`id`,`type`) REFERENCES `publications` (`id`, `type`) ON DELETE CASCADE,
  ADD CONSTRAINT `publicationsratings_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `publicationssearchtags`
--
ALTER TABLE `publicationssearchtags`
  ADD CONSTRAINT `publicationssearchtags_ibfk_1` FOREIGN KEY (`id`,`type`) REFERENCES `publications` (`id`, `type`) ON DELETE CASCADE;

--
-- Limiti per la tabella `publicationssubtypes`
--
ALTER TABLE `publicationssubtypes`
  ADD CONSTRAINT `publicationssubtypes_ibfk_1` FOREIGN KEY (`id`,`type`) REFERENCES `publications` (`id`, `type`) ON DELETE CASCADE;

--
-- Limiti per la tabella `races`
--
ALTER TABLE `races`
  ADD CONSTRAINT `races_ibfk_1` FOREIGN KEY (`folderid`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `races_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `racevariants`
--
ALTER TABLE `racevariants`
  ADD CONSTRAINT `racevariants_ibfk_1` FOREIGN KEY (`raceid`) REFERENCES `races` (`id`);

--
-- Limiti per la tabella `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `spells`
--
ALTER TABLE `spells`
  ADD CONSTRAINT `spells_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `templates`
--
ALTER TABLE `templates`
  ADD CONSTRAINT `templates_ibfk_1` FOREIGN KEY (`folderid`) REFERENCES `folders` (`id`),
  ADD CONSTRAINT `templates_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Limiti per la tabella `weapons`
--
ALTER TABLE `weapons`
  ADD CONSTRAINT `weapons_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
