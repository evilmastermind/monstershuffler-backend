CREATE TABLE `objecttypes` (
  `type` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `objecttypes` (type, name) VALUES 
(1, 'character'),
(2, 'race'),
(3, 'class'),
(4, 'template'),
(5, 'profession'),
(101, 'action'),
(102, 'spell'),
(1001, 'weapon'),
(1002, 'armor'),
(10002, 'racevariant'),
(10003, 'classvariant');

CREATE TABLE `game` (
  `game` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (game)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `game` (game, name) VALUES
(1, '5e');

CREATE TABLE `objects` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`type` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
	`game` int(11) NOT NULL,
	`userid` int(11) NOT NULL,
	`created` datetime DEFAULT  CURRENT_TIMESTAMP,
  `lastedited` datetime DEFAULT CURRENT_TIMESTAMP,
  `object` json NOT NULL,
	`originalid` int(11) DEFAULT NULL,
	`originaluserid` int(11) DEFAULT NULL,
	`folderid` int(11) DEFAULT NULL,
	`trashed` tinyint(1) DEFAULT '0',
  `variantof` int(11) DEFAULT NULL,
  `oldid` int(11) DEFAULT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (type) REFERENCES objecttypes(type),
	FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (folderid) REFERENCES folders(id)ON DELETE SET NULL,
  -- FOREIGN KEY (originalid) REFERENCES objects(id) ON DELETE SET NULL,  
  -- FOREIGN KEY (originaluserid) REFERENCES users(id)ON DELETE SET NULL,
  FOREIGN KEY (variantof) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 1, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.statistics.FullName")),'character') as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `characters`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 2, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name"),'race')) as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `races`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 3, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name"),'class')) as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `classes`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 4, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name"),'template')) as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `templates`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 5, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name"),'professsion')) as name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `professions`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 101, name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `actions`; 

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 102, name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `spells`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 1001, name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `weapons`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 1002, name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `armor`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 10002, a.name, 1, b.userid, a.created, a.lastedited, a.object, NULL, NULL, NULL, 0, c.id, a.id
FROM `racevariants` a 
  LEFT JOIN `races` b ON a.raceid = b.id 
  LEFT JOIN `objects` c ON b.id = c.oldid AND type = 2;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid)
SELECT 10003, a.name, 1, b.userid, a.created, a.lastedited, a.object, NULL, NULL, NULL, 0, c.id, a.id
FROM `classvariants` a 
  LEFT JOIN `classes` b ON a.classid = b.id 
  LEFT JOIN `objects` c ON b.id = c.oldid AND type = 3;

CREATE TABLE `charactersdetails` (
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `monstertype` int(11) NOT NULL,
  `cr` float NOT NULL,
  `alignment` int(11) NOT NULL,
  `size` int(11) NOT NULL,
  `meta` text NOT NULL,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `charactersdetails` (objectid, name, monstertype, cr, alignment, size, meta)
SELECT b.id, 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.FullName")),
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.TypeNumber"),) 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.CR"),) 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.AlignmentNumber"),) 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.Size"),) 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.Meta"))
FROM `characters` a
  LEFT JOIN `objects` b ON a.id = b.oldid AND b.type = 1;

CREATE TABLE `professionsdetails` ( 
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `femalename` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `professionsdetails` (objectid, age, description, name, femalename)
SELECT b.id, a.age, a.description,
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.name")),
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.femaleName"))
FROM `professions` a
  LEFT JOIN `objects` b ON a.id = b.oldid AND b.type = 5;

CREATE TABLE `actionsdetails` (
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `actiontype` varchar(255) NOT NULL,
  `subtype` varchar(255),
  `source` varchar(255) NOT NULL,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `actionsdetails` (objectid, name, actiontype, subtype, source)
SELECT b.id, a.name, a.type, a.subtype, a.source
FROM `actions` a
  LEFT JOIN `objects` b ON a.id = b.oldid AND b.type = 101;

CREATE TABLE `actionstags` (
  `objectid` int(11) NOT NULL,
  `tag` varchar(255) NOT NULL,
  PRIMARY KEY (objectid, tag),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `actionstags` (objectid, tag)
SELECT b.id, a.tag
FROM `actiontags` a
  LEFT JOIN `objects` b ON a.actionid = b.oldid AND b.type = 101;

RENAME TABLE `publications` TO `publications_old`;
RENAME TABLE `publicationsenvironments` TO `publicationsenvironments_old`;
RENAME TABLE `publicationsratings` TO `publicationsratings_old`;
RENAME TABLE `publicationssearchtags` TO `publicationssearchtags_old`;
RENAME TABLE `publicationssubtypes` TO `publicationssubtypes_old`;
RENAME TABLE `reports` TO `reports_old`;

CREATE TABLE `publications` (
  `objectid` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `oldid` int(11) NOT NULL,
  `oldtype` varchar(255) NOT NULL,
  `datepublished` datetime DEFAULT CURRENT_TIMESTAMP,
  `datemodified` datetime DEFAULT CURRENT_TIMESTAMP,
  `adds` int(11) DEFAULT '0',
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE,
  FOREIGN KEY (type) REFERENCES objecttypes(type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `publications` (objectid, type, oldid, oldtype, datepublished, datemodified, adds, url)
SELECT a.id, a.type, b.id, b.type, b.datepublished, b.datemodified, b.adds, b.url
FROM `objects` a
RIGHT JOIN `publications_old` b ON a.oldid = b.id 
  AND (
    (a.type = 1 AND b.type = 'character') OR
    (a.type = 2 AND b.type = 'race') OR
    (a.type = 3 AND b.type = 'class') OR
    (a.type = 4 AND b.type = 'template')
  );

CREATE TABLE `publicationsenvironments` (
  `objectid` int(11) NOT NULL,
  `string` varchar(255) NOT NULL,
  PRIMARY KEY (objectid, string),
  FOREIGN KEY (objectid) REFERENCES publications(objectid) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `publicationsenvironments` (objectid, string)
SELECT a.objectid, b.string
FROM `publications` a
  RIGHT JOIN `publicationsenvironments_old` b ON a.oldid = b.id AND a.oldtype = b.type;

CREATE TABLE `publicationsratings` (
  `objectid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (objectid, userid),
  FOREIGN KEY (objectid) REFERENCES publications(objectid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `publicationsratings` (objectid, userid, value)
SELECT a.objectid, b.userid, b.value
FROM `publications` a
  RIGHT JOIN `publicationsratings_old` b ON a.oldid = b.id AND a.oldtype = b.type;


CREATE TABLE `publicationssearchtags` (
  `objectid` int(11) NOT NULL,
  `string` varchar(255) NOT NULL,
  PRIMARY KEY (objectid, string),
  FOREIGN KEY (objectid) REFERENCES publications(objectid) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `publicationssearchtags` (objectid, string)
SELECT a.objectid, b.string
FROM `publications` a
  RIGHT JOIN `publicationssearchtags_old` b ON a.oldid = b.id AND a.oldtype = b.type;


CREATE TABLE `publicationssubtypes` (
  `objectid` int(11) NOT NULL,
  `string` varchar(255) NOT NULL,
  PRIMARY KEY (objectid, string),
  FOREIGN KEY (objectid) REFERENCES publications(objectid) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `publicationssubtypes` (objectid, string)
SELECT a.objectid, b.string
FROM `publications` a
  RIGHT JOIN `publicationssubtypes_old` b ON a.oldid = b.id AND a.oldtype = b.type;


CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `objectid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `report` text,
  `datereported` datetime DEFAULT CURRENT_TIMESTAMP,
  `dateaction` datetime DEFAULT NULL,
  `moderator` int(11) DEFAULT NULL,
  `action` text DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (objectid) REFERENCES publications(objectid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (moderator) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `reports` (objectid, userid, reason, report, datereported, dateaction, moderator, action)
SELECT b.objectid, a.userid, a.reason, a.report, a.datereported, a.dateaction, a.moderator, a.action
FROM `reports_old` a
  LEFT JOIN `publications` b 
    ON a.id = b.oldid AND a.type = b.oldtype;

-- CREATE INDEXES FOR THE NEW TABLES
CREATE INDEX id on `objects` (id) ;
CREATE INDEX type on `objects` (type) ;
CREATE INDEX objectid on `charactersdetails` (objectid);
CREATE INDEX objectid on `professionsdetails` (objectid);
CREATE INDEX objectid on `publications` (objectid);
CREATE INDEX type on `publications` (type);
CREATE INDEX objectid on `publicationsenvironments` (objectid);
CREATE INDEX objectid on `publicationsratings` (objectid);
CREATE INDEX objectid on `publicationssearchtags` (objectid);
CREATE INDEX objectid on `publicationssubtypes` (objectid);


-- SKILLS TABLE FIX
alter table skills drop column game ;
alter table skills create column game INT not null;
update skills set game = 1;
ALTER TABLE skills ADD FOREIGN KEY (game) REFERENCES game(game);

DROP TABLE `publicationssubtypes_old`;
DROP TABLE `publicationssearchtags_old`;
DROP TABLE `publicationsratings_old`;
DROP TABLE `publicationsenvironments_old`;
DROP TABLE `publications_old`;
DROP TABLE `reports_old`;
DROP TABLE `classvariants`;
DROP TABLE `racevariants`;
DROP TABLE `professions`;
DROP TABLE `templates`;
DROP TABLE `classes`;
DROP TABLE `races`;
DROP TABLE `characters`;
DROP TABLE `actiontags`;
DROP TABLE `actions`;
DROP TABLE `spells` ;
DROP TABLE `weapons` ;
DROP TABLE `armor` ;
