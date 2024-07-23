-- 2023/01/05 - this strategy is no longer used, but I'm keeping it around for reference

-- CREATE TABLE `publishedcharacters` (
--   `characterid` int(11) NOT NULL,
--   `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
--   `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
--   `name` varchar(255) NOT NULL,
--   `monstertype` int(11) DEFAULT NULL,
--   `cr` float DEFAULT NULL,
--   `size` int(11) DEFAULT NULL,
--   `alignment` int(11) DEFAULT NULL,
--   `adds` int(11) DEFAULT '0',
--   `url` varchar(255) NOT NULL,
--   `meta` varchar(255) DEFAULT NULL,
--   PRIMARY KEY (characterid),
--   FOREIGN KEY (characterid) REFERENCES characters(id) ON DELETE CASCADE,
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedcharacters_environments` (
--   `characterid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (characterid),
--   FOREIGN KEY (characterid) REFERENCES characters(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedcharacters_ratings` (
--   `characterid` int(11) NOT NULL,
--   `userid` int(11) NOT NULL,
--   `value` int(11) NOT NULL,
--   PRIMARY KEY (characterid, userid),
--   FOREIGN KEY (characterid) REFERENCES characters(id) ON DELETE CASCADE,
--   FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedcharacters_searchtags` (
--   `characterid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (characterid),
--   FOREIGN KEY (characterid) REFERENCES characters(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedcharacters_subtypes` (
--   `characterid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (characterid),
--   FOREIGN KEY (characterid) REFERENCES characters(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- INSERT INTO `publishedcharacters` (characterid, datepublished, datemodified, name, monstertype, cr, size, alignment, adds, url, meta)
-- SELECT id, datepublished, datemodified, name, monstertype, cr, size, alignment, adds, url, meta
-- FROM publications
-- WHERE type = "character";

-- INSERT INTO `publishedcharacters_environments` (characterid, string)
-- SELECT id, string
-- FROM publicationsenvironments
-- WHERE type = "character";

-- INSERT INTO `publishedcharacters_ratings` (characterid, userid, value)
-- SELECT id, userid, value
-- FROM publicationsratings
-- WHERE type = "character";

-- INSERT INTO `publishedcharacters_searchtags` (characterid, string)
-- SELECT id, string
-- FROM publicationssearchtags
-- WHERE type = "character";

-- INSERT INTO `publishedcharacters_subtypes` (characterid, string)
-- SELECT id, string
-- FROM publicationssubtypes
-- WHERE type = "character";

-- CREATE TABLE `publishedclasses` (
--   `classid` int(11) NOT NULL,
--   `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
--   `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
--   `name` varchar(255) NOT NULL,
--   `adds` int(11) DEFAULT '0',
--   `url` varchar(255) NOT NULL,
--   PRIMARY KEY (classid),
--   FOREIGN KEY (classid) REFERENCES classes(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedclasses_environments` (
--   `classid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (classid),
--     FOREIGN KEY (classid) REFERENCES classes(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedclasses_ratings` (
--   `classid` int(11) NOT NULL,
--   `userid` int(11) NOT NULL,
--   `value` int(11) NOT NULL,
--   PRIMARY KEY (classid, userid),
--   FOREIGN KEY (classid) REFERENCES classes(id) ON DELETE CASCADE,
--   FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedclasses_searchtags` (
--   `classid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (classid),
--   FOREIGN KEY (classid) REFERENCES classes(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedclasses_subtypes` (
--   `classid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (classid),
--   FOREIGN KEY (classid) REFERENCES classes(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- INSERT INTO `publishedclasses` (classid, datepublished, datemodified, name, adds, url)
-- SELECT id, datepublished, datemodified, name, adds, url
-- FROM publications
-- WHERE type = "class";

-- INSERT INTO `publishedclasses_environments` (classid, string)
-- SELECT id, string
-- FROM publicationsenvironments
-- WHERE type = "class";

-- INSERT INTO `publishedclasses_ratings` (classid, userid, value)
-- SELECT id, userid, value
-- FROM publicationsratings
-- WHERE type = "class";

-- INSERT INTO `publishedclasses_searchtags` (classid, string)
-- SELECT id, string
-- FROM publicationssearchtags
-- WHERE type = "class";

-- INSERT INTO `publishedclasses_subtypes` (classid, string)
-- SELECT id, string
-- FROM publicationssubtypes
-- WHERE type = "class";


-- CREATE TABLE `publishedraces` (
--   `raceid` int(11) NOT NULL,
--   `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
--   `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
--   `name` varchar(255) NOT NULL,
--   `adds` int(11) DEFAULT '0',
--   `url` varchar(255) NOT NULL,
--   PRIMARY KEY (raceid),
--   FOREIGN KEY (raceid) REFERENCES races(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedraces_environments` (
--   `raceid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (raceid),
--   FOREIGN KEY (raceid) REFERENCES races(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedraces_ratings` (
--   `raceid` int(11) NOT NULL,
--   `userid` int(11) NOT NULL,
--   `value` int(11) NOT NULL,
--   PRIMARY KEY (raceid, userid),
--   FOREIGN KEY (raceid) REFERENCES races(id) ON DELETE CASCADE,
--   FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedraces_searchtags` (
--   `raceid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (raceid),
--   FOREIGN KEY (raceid) REFERENCES races(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedraces_subtypes` (
--   `raceid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (raceid),
--   FOREIGN KEY (raceid) REFERENCES races(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- INSERT INTO `publishedraces` (raceid, datepublished, datemodified, name, adds, url)
-- SELECT id, datepublished, datemodified, name, adds, url
-- FROM publications
-- WHERE type = "race";

-- INSERT INTO `publishedraces_environments` (raceid, string)
-- SELECT id, string
-- FROM publicationsenvironments
-- WHERE type = "race";

-- INSERT INTO `publishedraces_ratings` (raceid, userid, value)
-- SELECT id, userid, value
-- FROM publicationsratings
-- WHERE type = "race";

-- INSERT INTO `publishedraces_searchtags` (raceid, string)
-- SELECT id, string
-- FROM publicationssearchtags
-- WHERE type = "race";

-- INSERT INTO `publishedraces_subtypes` (raceid, string)
-- SELECT id, string
-- FROM publicationssubtypes
-- WHERE type = "race";


-- CREATE TABLE `publishedtemplates` (
--   `templateid` int(11) NOT NULL,
--   `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
--   `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
--   `name` varchar(255) NOT NULL,
--   `adds` int(11) DEFAULT '0',
--   `url` varchar(255) NOT NULL,
--   PRIMARY KEY (templateid),
--   FOREIGN KEY (templateid) REFERENCES templates(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedtemplates_environments` (
--   `templateid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (templateid),
--     FOREIGN KEY (templateid) REFERENCES templates(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedtemplates_ratings` (
--   `templateid` int(11) NOT NULL,
--   `userid` int(11) NOT NULL,
--   `value` int(11) NOT NULL,
--   PRIMARY KEY (templateid, userid),
--   FOREIGN KEY (templateid) REFERENCES templates(id) ON DELETE CASCADE,
--   FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedtemplates_searchtags` (
--   `templateid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (templateid),
--   FOREIGN KEY (templateid) REFERENCES templates(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATE TABLE `publishedtemplates_subtypes` (
--   `templateid` int(11) NOT NULL,
--   `string` varchar(255) NOT NULL,
--   PRIMARY KEY (templateid),
--   FOREIGN KEY (templateid) REFERENCES templates(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- INSERT INTO `publishedtemplates` (templateid, datepublished, datemodified, name, adds, url)
-- SELECT id, datepublished, datemodified, name, adds, url
-- FROM publications
-- WHERE type = "template";

-- INSERT INTO `publishedtemplates_environments` (templateid, string)
-- SELECT id, string
-- FROM publicationsenvironments
-- WHERE type = "template";

-- INSERT INTO `publishedtemplates_ratings` (templateid, userid, value)
-- SELECT id, userid, value
-- FROM publicationsratings
-- WHERE type = "template";

-- INSERT INTO `publishedtemplates_searchtags` (templateid, string)
-- SELECT id, string
-- FROM publicationssearchtags
-- WHERE type = "template";

-- INSERT INTO `publishedtemplates_subtypes` (templateid, string)
-- SELECT id, string
-- FROM publicationssubtypes
-- WHERE type = "template";



-- create index characterid on `publishedcharacters_environments` (characterid);
-- create index characterid on `publishedcharacters_ratings` (characterid);
-- create index characterid on `publishedcharacters_searchtags` (characterid);
-- create index characterid on `publishedcharacters_subtypes` (characterid);
-- create index classid on `publishedclasses_environments` (classid);
-- create index classid on `publishedclasses_ratings` (classid);
-- create index classid on `publishedclasses_searchtags` (classid);
-- create index classid on `publishedclasses_subtypes` (classid);
-- create index raceid on `publishedraces_environments` (raceid);
-- create index raceid on `publishedraces_ratings` (raceid);
-- create index raceid on `publishedraces_searchtags` (raceid);
-- create index raceid on `publishedraces_subtypes` (raceid);
-- create index templateid on `publishedtemplates_environments` (templateid);
-- create index templateid on `publishedtemplates_ratings` (templateid);
-- create index templateid on `publishedtemplates_searchtags` (templateid);
-- create index templateid on `publishedtemplates_subtypes` (templateid);
-- create index characterid on `publishedcharacters` (characterid);
-- create index templateid on `publishedtemplates` (templateid);
-- create index raceid on `publishedraces` (raceid);
-- create index classid on `publishedclasses` (classid);
