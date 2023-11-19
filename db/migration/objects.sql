ALTER TABLE users ADD COLUMN settings JSON;

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
(5, 'background'),
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
  `description` text DEFAULT NULL,
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
SELECT 2, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name")),'race') as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `races`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 3, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name")),'class') as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `classes`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 4, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name")),'template') as name, 1, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, NULL, id FROM `templates`;

INSERT INTO `objects` (type, name, game, userid, created, lastedited, object, originalid, originaluserid, folderid, trashed, variantof, oldid) 
SELECT 5, IFNULL(JSON_UNQUOTE(JSON_EXTRACT(object, "$.name")),'professsion') as name, 1, userid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, object, NULL, NULL, NULL, 0, NULL, id FROM `professions`;

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

CREATE TABLE `npcgeneratorblacklist` (
  `objectid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (objectid, userid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


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
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.TypeNumber")), 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.CR")),
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.AlignmentNumber")), 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.Size")), 
  JSON_UNQUOTE(JSON_EXTRACT(a.object, "$.statistics.Meta"))
FROM `characters` a
  LEFT JOIN `objects` b ON a.id = b.oldid AND b.type = 1;

CREATE TABLE `backgroundsdetails` ( 
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `femalename` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `racesdetails` (
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `femalename` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `classesdetails` (
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `femalename` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `templatesdetails` (
  `objectid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `femalename` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (objectid),
  FOREIGN KEY (objectid) REFERENCES objects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `backgroundsdetails` (objectid, age, description, name, femalename)
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

UPDATE objects o
JOIN actionsdetails ad ON o.id = ad.objectid
SET o.object = JSON_SET(o.object, '$.tag', ad.name, '$.actionType', ad.actiontype, '$.subType', ad.subtype, '$.source', ad.source)
WHERE o.type = 101;

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

UPDATE objects o
JOIN (
  SELECT objectid, JSON_ARRAYAGG(tag) AS tags
  FROM actionstags
  GROUP BY objectid
) at ON o.id = at.objectid
SET o.object = JSON_SET(o.object, '$.tags', at.tags);


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
CREATE INDEX objectid on `backgroundsdetails` (objectid);
CREATE INDEX objectid on `publications` (objectid);
CREATE INDEX type on `publications` (type);
CREATE INDEX objectid on `publicationsenvironments` (objectid);
CREATE INDEX objectid on `publicationsratings` (objectid);
CREATE INDEX objectid on `publicationssearchtags` (objectid);
CREATE INDEX objectid on `publicationssubtypes` (objectid);


-- SKILLS TABLE FIX
alter table skills DROP column game ;
alter table skills ADD column game INT not null;
update skills set game = 1;
ALTER TABLE skills ADD FOREIGN KEY (game) REFERENCES game(game);
alter table skills ADD column userid INT not null;
update skills set userid = 0;
ALTER TABLE skills ADD FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE;


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

-- NEW VOICES
DROP TABLE `voices`;
CREATE TABLE `voices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gender` varchar(255) NOT NULL,
  `person` varchar(255) NOT NULL,
  `character` varchar(255),
  `production` varchar(255),
  `filename` varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO voices (gender,person,`character`,production,filename)
VALUES
('male','Barrack Obama', NULL, NULL, 'barrack_obama'),
('male','Dwayne Johnson', 'Agent Hobbs', 'Fast & Furious','agent_hobbs'),
('male','Viggo Mortensen','Aragorn','The Lord of the Rings','aragorn'),
('male', 'Bill Burr', NULL, NULL,'bill_burr'),
('female', 'Uma Thurman', 'The Bride', 'Kill Bill','bride'),
('male','James Earl Jones','Darth Vader','Star Wars','darth_vader'),
('male', 'Dave Chappelle', NULL, NULL,'dave_chappelle'),
('female','Imelda Staunton','Dolores Umbridge','Harry Potter','dolores_umbridge'),
('female','Judy Garland','Dorothy','The Wizard of Oz','dorothy'),
('female','Elizabeth Banks','Effie Trinket','The Hunger Games','effie_Trinket'),
('female','Judy Foster','Dr. Eleanor Ann Arroway','Contact','eleanor_ann_arroway'),
('male','Hugo Weaving','Elrond','The Lord of the Rings','elrond'),
('female','Emily Bett Rickards','Felicity Smoak','Arrow','felicity_smoak'),
('female','Fran Drescher','Fran Fine','The Nanny','fran_fine'),
('male','Kevin Hart','Franklin "Mouse" Finbar','Jumanji','franklin_mouse_finbar'),
('male','Ian McKellen','Gandalf','The Lord of the Rings','gandalf'),
('female','Chelsea Peretti','Gina Linetti','Brooklyn 99','gina'),
('female','Emma Watson','Hermione Granger','Harry Potter','hermione_granger'),
('male','Sean Connery', 'James Bond','James Bond','james_bond'),
('female','Angela Lansbury','Jessica Fletcher','Murder She Wrote','jessica_fletcher'),
('male','Mark Hamill','Joker','Batman','joker'),
('male','Matthew McConaughey','Joseph Cooper','Interstellar','joseph_cooper'),
('male','Samuel L. Jackson','Jules Winnfield','Pulp Fiction','jules_winnfield'),
('female','Katey Sagal','Turanga Leela','Futurama','leela'),
('male','Mark Hamill','Luke Skywalker','Star Wars','luke_skywalker'),
('female','Maggie Smith','Minerva McGonagall','Harry Potter','minerva_mcgonagall'),
('female','Scarlett Johansson','Natasha Romanoff','Black Widow','natasha_romanoff'),
('male','Keanu Reeves','Neo','The Matrix','neo'),
('female','Whoopi Goldberg','Oda Mae Brown','Ghost','oda_mae_brown'),
('male','Stephen Amell','Oliver Queen','Arrow','oliver_queen'),
('female','Diane Morgan','Philomena Cunk',NULL,'philomena_cunk'),
('male','Morgan Freeman','Prof. Samuel Norman','Lucy','professor_samuel_norman'),
('female','Queen Elizabeth II',NULL,NULL,'queen_elizabeth'),
('male','Richard Nixon',NULL,NULL,'richard_nixon'),
('male','Arnold Schwarzenegger','The Terminator','The Terminator','terminator'),
('male','Joe Pesci','Tommy DeVito', 'Goodfellas','tommy_devito'),
('female','Emma Stone','Wichita','Zombieland','wichita');





-- NEW INSERTS
-- BACKGROUND => CHARACTER HOOKS
ALTER TABLE backgrounds RENAME characterhooks;
ALTER TABLE characterhooks RENAME COLUMN background to hook;
DELETE FROM characterhooks;
ALTER TABLE characterhooks ADD COLUMN object JSON NOT NULL;
INSERT INTO characterhooks (hook, object)
VALUES
('blessed with good luck', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('cursed by the gods', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('cursed with bad luck', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('cursed with good luck', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('escaping the past', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('from a good family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('from a loathed family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('from an unusual family line', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('from nowhere', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('haunted by dark memories', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('hiding a dark secret', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('living on borrowed time', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('looking for love', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('needing a friend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('on the run from the law', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('on the wrong side of the law', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('searching for justice', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('searching for love', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('trapped by the past', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who can''t resist a fight', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who fears people think [they] is a fraud', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who fell in with the wrong crowd', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who had a near-death experience', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who had a near-death experience that changed [them] significantly', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has an alter ego', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has an arch-enemy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has an odd way of speaking', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates animals', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates children', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates the government', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a complete fraud', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a jack of all trades', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a loose cannon', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is an undercover agent', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is barking up the wrong tree', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is being blackmailed', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is considered the worst in [their] profession', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is dependent on medication', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is estranged from family members', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is given to moments of deep introspection', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is helping the local community', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is just a cog in the machine', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is keeping [their] mouth shut', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is keeping something at bay', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is more than meets the eye', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is prone to odd statements', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is searching for employment', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is struggling between good and evil', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is stubborn as a mule', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the life and soul of the party', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is thinking of retiring', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is ugly as sin', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost a close friend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost meaning in life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who loves animals', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who loves children', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who prefers to work alone', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who recently betrayed [their] faith', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who seems insane', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who looks very suspect', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who spent part of [their] life in prison', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who suffers from a chronic medical condition', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a bright future ahead', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a chemical dependency', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a criminal mind', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a dark past', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a false identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a grim future ahead', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a heart of gold', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a knack for trouble', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a lot of friends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a lovely smile', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a terrible poker face', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a thirst for knowledge', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a thirst for vengeance', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a very tight schedule', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a weird superpower', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an extraordinary wealth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an obsessive desire for power', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an odd birthmark', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an odd tattoo', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an unexpected destiny', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an unusual child', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an unusual spouse', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with big dreams', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with little money', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a mental illness', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with no friends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with no hope', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with repressed memories', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with suicidal thoughts', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with unconventional clothing', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who wants to change the world', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose heart is broken', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who wants to redeem [their] family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a sexy body', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a weird body', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is very famous', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is despised in the community', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who can''t read', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who wrote a book', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates the wilderness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who loves the wilderness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is perfectly normal', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a huge obsession', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an identical twin', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a second family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was falsely accused of a crime', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who gambles a lot', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a self taught martial artist', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who always arrives late', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who always arrives early', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who thinks [they] saw an alien', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose face is badly scarred', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an animal friend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a hidden agenda', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is very proud of [their] own race', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who refuses to call people by their own name', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who only works part-time', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who mysteriously wanders at night', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never wears underwear', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is very attached to tradition', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who likes to be domineering', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a very successful business', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with an unsuccessful business', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who fought in a war', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who only wants to feel appreciated', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates crowds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who does daily workouts', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who will never be as good as [their] predecessor', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who outclasses [their] predecessor', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a tyrannical master', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a boring life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a conventional life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a secret romantic relationship', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who schemes in the shadows', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a best friend from far away', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is an adventurer for hire', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was adopted', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who takes care of [their] family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a talented singer', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with three parents', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who recently lost a close friend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a childhood trauma', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who travels a lot', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who almost never leaves [their] house', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who believes in strange conspiracy theories', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who grows [their] own food', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a hoarding disorder', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a lot of issues', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is an expert in astrology', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who designs [their] own clothes', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lives inside [their] head', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who likes to have guests', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who hates foreigners', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has been publicly shamed', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is admired by many', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is very old fashioned', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who embraces innovation', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is afraid of death', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who believes in destiny', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who loves to give public speeches', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who drinks a lot', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with sinister morals', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with pure thoughts', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who endeavors to solve philosophical dilemmas', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with gastrointestinal issues', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with political ambitions', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who admires a local hero', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who can''t control [them]self', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is very perverted', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who got married more than once', '{"compatibleAges": ["adult", "middle-aged", "elderly", "venerable"]}'),
('from a privileged family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who recently moved to a new house', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who unintentionally hurt someone', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is also a collectionist', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with lots of jewelry', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has witnessed a crime', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was promised wealth and fame', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who goes on vacation often', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a deadly allergy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a valuable family heirloom', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who cares for the environment', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who doesn''t care for the environment', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is really a robot in disguise', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is seeking redemption', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is silently judging everyone', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is struggling with addiction', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the black sheep of the family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the last of [their] kind', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the only survivor of a tragedy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the victim of mistaken identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is trying to make amends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is unsure of [their] true identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is wanted dead or alive', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who keeps having prophetic dreams', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who left everything behind to pursue a dream', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost everything in a natural disaster', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who made a deal with the devil', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never backs down from a challenge', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never forgets a face', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never speaks the truth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who ran away from home at a young age', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who sees ghosts', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who seeks revenge for a past betrayal', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who seems average but has a hidden talent', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who talks to imaginary friends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was abandoned as a child', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was betrayed by someone [they] trusted', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was once a hero but now a villain', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was once wealthy but lost everything', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who wishes to be immortal', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the lookout for danger', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s constantly plagued with bad luck', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s haunted by the ghosts of [their] enemies', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s known for [their] terrible cooking', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s searching for a lost artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking [their] true purpose', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who struggles with social anxiety', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who possesses a mysterious and ancient artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s on a quest for knowledge', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has a love-hate relationship with [their] powers', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who believes [they]''s descended from a mythical creature', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for the next big opportunity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has an unrequited love for someone unattainable', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to start a new life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a survivor of a deadly virus outbreak', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the lookout for the supernatural', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s haunted by a past mistake', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s physically strong but emotionally fragile', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has a scar that tells a story', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s motivated by revenge', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a master of disguise', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s constantly changing [their] appearance', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always the underdog', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s can''t escape [their] own mind', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a thrill-seeker', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to break a bad habit', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s plagued by nightmares', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s running from [their] own destiny', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always working hard to make a living', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in the shadow of someone else', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a sucker for a good romance', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always putting others before [them]self', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to atone for a terrible mistake', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking vengeance against an enemy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s determined to prove [their] worth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s constantly underestimated but fiercely determined', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s struggling to overcome a debilitating illness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in the right place at the right time', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a master of sarcasm and wit', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for the next thrill', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s desperately holding onto a lost love', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s just trying to get by in life', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s been gifted with a unique talent', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s haunted by a traumatic event from [their] childhood', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s constantly searching for a sense of belonging', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s torn between two worlds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always been a lone wolf', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s chasing after an elusive dream', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the brink of self-destruction', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to escape a life of crime', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s hiding a mysterious past', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in the front lines of battle', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s struggling to forgive [them]self', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s facing insurmountable odds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to live up to [their] family''s expectations', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the move', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s fighting against [their] own destiny', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s battling a powerful addiction', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s harboring a dangerous obsession', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always searching for the next challenge', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to forget a painful memory', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s living with a heavy heart', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('fighting for redemption', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('haunted by the past', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('hunted by a powerful foe', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('in search of wisdom', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who inherited a mystical artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is lost and searching for purpose', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('marked by destiny', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('on a mission to save [their] people', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('suffering from a rare disease', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('surviving against all odds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('taken in by a mentor', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('trained in a secret art', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is wandering aimlessly', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('yearning for adventure', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('born under a lucky star', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('born under an unlucky star', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('determined to prove [their] worth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('facing an impossible choice', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('gifted with extraordinary powers', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('carrying a heavy burden', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('cursed with immortality', '{"compatibleAges": ["adult", "middle-aged", "elderly", "venerable"]}'),
('destined for greatness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('destined to fail', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('disguised as someone else', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('earning a living through thievery', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('hiding [their] true identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is hunting a dangerous creature', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('living a double life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('living in constant fear', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('on a quest for vengeance', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is part of a lost civilization', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('preparing for a great battle', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('protecting [their] homeland', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('running from a terrible fate', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('sailing the high seas', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('searching for a lost city', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('seeking revenge for a past betrayal', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('serving [their] country', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('struggling with a moral dilemma', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the chosen one', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the subject of a prophecy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('trained to be a deadly assassin', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('working as a spy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('wielding an ancient weapon', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('working as a sellsword', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('wrangling a dangerous pet', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('yearning for a peaceful life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is becoming a master of [their] craft', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('battling inner demons', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is conquering insurmountable odds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who inadvertently became a curse-breaker', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a disgraced noble seeking redemption', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('dreaming of a different life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('escaping the fate of [their] family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a guardian of an ancient artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a heir to a powerful kingdom', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('hiding a supernatural identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is hunting a personal foe', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is hunting the creature that killed someone important', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is losing faith in [their] cause', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('owning and operating a successful business', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is part of a squad of elite soldiers', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a prisoner on the run', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('protecting the balance of nature', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('recovering from a tragic loss', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('seeking to uncover [their] family history', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('selling [their] services to the highest bidder', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('serving a powerful and corrupt ruler', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('stranded in a foreign land', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the last hope of [their] people', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('using [their] powers for personal gain', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('yearning for revenge on an old enemy', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is an unwitting pawn in a greater game', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is on the verge of a breakthrough', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is plagued by chronic pain', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is secretly a werecreature', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is seeking redemption for past mistakes', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is struggling with [their] identity', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the black sheep of the family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the last of [their] kind', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who knows everyone in town', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who learned a dark secret about [their] family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lives on the edge', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost everything in a tragic event', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost [their] sense of taste', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who lost [their] sense of touch', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never gives up', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who never sleeps', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who plays by [their] own rules', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who possesses a rare skill', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who returned from the dead', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who seeks power above all else', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who suffers from claustrophobia', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who suffers from chronic memory loss', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who suffers from intense nightmares', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s had the same nightmare every night since [their] birth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who survived a natural disaster', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who takes orders from no one', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who talks to animals', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was abandoned as a child', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was born into a life of luxury', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was cursed by a witch', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was disowned by [their] family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was exiled from society', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was forced to flee [their] homeland', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was framed for a crime [they] didn''t commit', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was gifted with incredible powers', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was hunted by a powerful organization', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was imprisoned for years', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was inspired by a childhood hero', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was left for dead in the wilderness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was never given a chance to succeed', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was once a member of a cult', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was once a notorious pirate', '{"compatibleAges": ["adult", "middle-aged", "elderly", "venerable"]}'),
('who was once a revered leader', '{"compatibleAges": ["adult", "middle-aged", "elderly", "venerable"]}'),
('who was once betrayed by [their] closest friend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was once famous but fell from grace', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was recruited by a secret society', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was saved by a mysterious stranger', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was sent back in time', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was separated from [their] twin at birth', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was taken in by a group of outlaws', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was trained by a legendary warrior', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was turned into a monster', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was victimized by a powerful corporation', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who will do anything to protect [their] loved ones', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who works for an evil organization', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who yearns for adventure and excitement', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s an adrenaline junkie', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s an expert escape artist', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for a quick buck', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s atoning for a past mistake', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s been cursed with immortality', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s constantly on the move', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s haunted by a past trauma', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s immortalized in legend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s known for [their] incredible speed', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s lost in a world foreign to [them]', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was born in another plane of existence', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking inner peace', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a former paladin seeking redemption', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s out for revenge against the government', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s on the run from [their] past', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s searching for [their] true purpose', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s sworn to protect the defenseless', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s terrified of the dark', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s the last hope for [their] people', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to undo a mistake from the past', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s wanted dead or alive', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s working to topple a corrupt regime', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s wracked with guilt over a past mistake', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s crossed paths with fortune', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose deepest desire is to attain power', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who knows the location of a powerful artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who always attracts suspicion', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose family was murdered by a rival clan', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose scars tell a story', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a skilled con artist', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s on a quest to save [their] lost love', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s suffered a great betrayal', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking atonement for past sins', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trained in the deadliest of martial art forms', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s lived a double life for years', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a failed experiment that turned out to be a success', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s imbued with magic energy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s been given a second chance at life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s destined for greatness', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s sworn to protect a sacred artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s betrayed those closest to [them]', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking revenge against a traitor', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trapped between two worlds', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s bound by a powerful spell', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s lost [their] memories in a tragic event', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s the only one who knows a dark secret', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s destined to bring about the apocalypse', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s seeking to restore a disrupted balance in nature', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s been scarred by a great tragedy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose past mistakes haunt [their] every step', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was raised by the undead', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose family heirloom is corrupting [their] soul', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always running late', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s an avid reader', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s never without [their] morning coffee', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s terrible at cooking', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a night owl', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a morning person', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a neat freak', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always losing [their] keys', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always forgetting important dates', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying new recipes', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the latest trend', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s often caught daydreaming', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in the middle of home renovation projects', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for a deal', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always overthinking things', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always working on [their] side hustle', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the go', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a little bit of a perfectionist', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s very organized', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in need of a good night''s sleep', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a game night', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s very sentimental', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always talking about [their] pets', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to make people laugh', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s never without a to-do list', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of DIY projects', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good workout', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for inspiration', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always ready to lend a hand', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s passionate about gardening', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a strict vegetarian', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always running errands', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a board game', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying new restaurants', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of a good bargain', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s often caught singing in the shower', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to save energy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to cut down on waste', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a regular at the local farmer''s market', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to improve [their] skills', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always willing to try something new', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a natural at problem-solving', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to give back to the community', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a little friendly competition', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to simplify [their] life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to stay organized', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always chasing [their] dreams', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a hike', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of the perfect cup of tea', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to improve [their] health', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on top of the latest news and trends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always committed to [their] workout routine', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good book', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on top of [their] appointments and deadlines', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to learn something new', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always ready to lend an ear or give advice', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for creative ways to decorate [their] home', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of thrift stores', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always open to new experiences', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good theatre night', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to save money', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of cozy nights in', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a stroll in the park', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a responsible exotic pet owner', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s an irresponsible exotic pet owner', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who owns way too many cats', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who owns way too many dogs', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who owns way too many pets', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of weekend brunches', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to reduce stress in [their] life', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of the perfect work-life balance', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always interested in learning about different cultures', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for new recipes to try at home', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to improve [their] work skills', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good dance party', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of the perfect cup of coffee', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of volunteering for a good cause', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to stay organized at work', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good karaoke session', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always a stickler for punctuality', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of relaxation and tranquility', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a friendly game of basketball', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good caravan trip', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to keep [their] living space tidy', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of the perfect skincare routine', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a game of chess', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of afternoon naps', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the lookout for the latest fashion trends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good workout class', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to reduce waste in [their] home', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a regular at the nearby wrestling ring', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a talented wrestler', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the hunt for the best sandwich in town', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a walk around the neighborhood', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('blessed by the gods', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('from a cursed family', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who belongs to a secret organization', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is considered the best in [their] profession', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who prefers to work naked', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with a pathetic plastic smile', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('with no regard for the law', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is highly respected in the community', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who eats very healthy after that accident', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is in between jobs', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('whose actions are supervised by a relative', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is at the top of [their] career', '{"compatibleAges": ["adult", "middle-aged", "elderly", "venerable"]}'),
('with biased ideologies', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who suffers from panic attacks', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is skilled in a forgotten art', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who possesses a rare and powerful gift', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in the wrong place at the wrong time', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s searching for meaning in a meaningless world', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s trying to create a better future', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s keeping a dark secret from [their] loved ones', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is the last of [their] kind', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('destined to lead [their] people', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who has sworn to protect the innocent', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who is a gifted artist struggling to make a name for [them]self', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('surviving in a harsh, post-apocalyptic wasteland', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('working [their] way to the top through cunning and charisma', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who seems to have it all figured out, but [their] is just putting on a front', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who was transformed by a magical artifact', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s known for [their] incredible agility', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s in hiding from [their] enemies', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s hunted for what [they] know', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always writing boring letters to [their] friends', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good conversation', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always daydreaming about [their] next vacation', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for ways to stay hydrated', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to stay on top of [their] laundry pile', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always in search of the best way to wind down after work', '{"compatibleAges": ["young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a friendly game of cards', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s a fan of meditation and mindfulness practices', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good art exhibit', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always trying to learn a new language', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always on the hunt for unique jewelry', '{"compatibleAges": ["adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for new and exciting workout routines', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always up for a good camping trip', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who''s always looking for new ways to spice up [their] meals', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who only wears pink clothes', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}'),
('who only wears black clothes', '{"compatibleAges": ["child", "adolescent", "young adult","adult", "middle-aged", "elderly", "venerable"]}');

ALTER TABLE traits ADD COLUMN object JSON NOT NULL;
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Able';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Abrasive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Abrupt';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Absent-minded';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Abusive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Accepting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Accident-prone';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Accommodating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Accomplished';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Action-oriented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Adamant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Adaptable';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Addict';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='ADHD';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Adorable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Adventurous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Affable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Affectionate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Afraid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Afraid of commitment';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Aggressive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Agonized';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Agreeable';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Alcoholic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Alert';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Alluring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Aloof';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Altruistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Always late';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Amateurish demeanor';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ambiguous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ambitious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ambivalent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Amiable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Amused';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Amusing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Analytical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Angry';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Animated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Annoyed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Annoying';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Antagonistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Anti-intellectual';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Anti-social';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Anxious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Apathetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Apologetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Appreciative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Apprehensive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Approachable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Arbitrary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Argumentative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Arrogant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Articulate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Artistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Artless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ashamed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Aspiring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Assertive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Astonished';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Astounded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Astute';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Attentive to others';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Audacious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Austere';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Authoritarian';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Authoritative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Autocratic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Avoids conflict';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Aware of own limitations';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Awed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Awful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Awkward';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Babbling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Babyish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Backstabber';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bashful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Beautiful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Belligerent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Benevolent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Betrayed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bewildered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bewitching';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Biter';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bitter';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Blames others';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Blasé';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Blissful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Blowhard';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Boastful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Boisterous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bold';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Boorish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bored';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Boring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bossy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bragging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brainy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brash';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bratty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brave';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brazen';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bright';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brilliant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Broad-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brotherly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Brutish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bubbly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Bully';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Burdened';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Busy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Calculating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Callous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Calm';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Candid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Capable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Capricious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Captivated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Carefree';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Careful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Careless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Careless of social rules';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Caring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Caustic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cautious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Charismatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Charitable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Charming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Chaste';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Chatty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cheater';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cheerful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cheerless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Childish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Chivalrous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Civilised';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Classy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Clever';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Close-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dominant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Clumsy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Coarse';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cocky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Coherent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cold hearted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Combative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Comfortable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Committed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Communicative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Compassionate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Competent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Competitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Complacent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Compliant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Compulsive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Compulsive liar';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conceited';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Concerned';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Concrete thinking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Condescending';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Confident';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conformist';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Confused';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Congenial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Connoisseur of good drink';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Connoisseur of good food';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conscientious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conservative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Considerate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Consistent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conspiracy theorist';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Constructive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Content';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Contented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Contrarian';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Contrary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Contrite';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Controlling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Conventional';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cool';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cooperative';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Coquettish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cosmopolitan';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Courageous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Courteous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Covetous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cowardly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cowering';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Coy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Crabby';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Crafty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Crazy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Creative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Credible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Creepy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Critical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cross';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Crude';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cruel';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Crushed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cuddly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cultured';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cunning';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Curious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cutthroat';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Cynical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dangerous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Daredevil';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Daring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dark';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dashing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dauntless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dazzling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Debonair';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Deceiving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Decent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Decisive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dedicated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Defeated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Deferential';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Defiant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Delegates authority';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Delicate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Delighted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Delightful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Delusional about own skills';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Demanding';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Demonic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dependable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dependent';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Depraved';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Depressed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Deranged';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Despairing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Despicable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Despondent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Destructive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Detail-oriented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Determined';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Develops close friendships';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Devilish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Devious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Devoted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Devout';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dictatorial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Diffident';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dignified';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Diligent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Diminished';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Diplomatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Direct';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Directionless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dirty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disaffected';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disagreeable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Discerning';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disciplined';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Discontented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Discouraged';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Discreet';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disgusting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dishonest';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disillusioned';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disinterested';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disloyal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dismayed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disorderly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disorganized';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disparaging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disregards rules';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disrespectful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dissatisfied';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dissident';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dissolute';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Distant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Distracted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Distraught';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Distressed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Distrustful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Disturbed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Docile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Does what is convenient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Does what is necessary or right';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dogmatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Domineering';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dorky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Doubtful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Downtrodden';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dreamer';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dreamy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Driven';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Drug addict';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Drunk';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dubious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dull';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dumb';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dutiful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Dynamic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Eager';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Easily embarrassed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Easily led';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Easily upset';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Easygoing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Eccentric';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ecstatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Educated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Effervescent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Efficient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Egocentric';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Egotistical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Elated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Eloquent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Embarrassed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Embittered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Embraces change';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Eminent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Emotional';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Emotionally stable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Empathetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Empty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enchanted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enchanting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Encouraging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Energetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Engaging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enigmatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enjoys a good argument';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enjoys a good brawl';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enjoys a little friendly competition';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enterprising';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Entertaining';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Enthusiastic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Entrepreneurial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Envious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Equable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Erratic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ethical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Evasive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Evil';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Exasperated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Excitable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Excited';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Exclusive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Exhausted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Expansive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Expert in own profession';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Expressive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Extravagant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Extreme';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Extroverted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Exuberant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fabulous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Facetious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fair';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Faith in others';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Faith in self';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Faithful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Faithless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fake';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fanatical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fantastic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fascinated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fast learner';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fastidious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fatalistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fatigued';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fawning';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fearful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fearless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Feisty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ferocious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fidgety';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fierce';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fiery';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fighter';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Finicky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fitness fanatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flagging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flakey';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flamboyant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flashy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flexible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flighty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flippant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flirtatious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Flustered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Focused';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Follower';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Follows rules';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Foolhardy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Foolish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Forceful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Forgetful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Forgiving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Formal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Forthright';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fortunate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Foul';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fragile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frank';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frantic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frazzled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Freethinking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fresh';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fretful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Friendly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frightened';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frugal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Frustrated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fuddy-duddy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fun to be around';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fun-loving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Funny';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Furious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Furtive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Fussy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gabby';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Garrulous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Generous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Genial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gentle';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Genuine';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Giddy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Giggly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gives others their freedom';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gives up easily';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Giving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Glad';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Glamorous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gloomy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Glorious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Glum';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Goal oriented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Good';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Good communicator';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Good listener';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Goofy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Graceful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gracious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grandiose';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grateful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gratified';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Greedy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gregarious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grieving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Groovy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grotesque';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grouchy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grounded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gruesome';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gruff';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Grumpy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Guarded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Guileless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Guilt prone';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Guilt ridden';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Guilt-free';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Gullible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Haggard';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Haggling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Handsome';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Happy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hard';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hard working';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hardy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Harmonious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Harried';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Harsh';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Has clear goals';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Has good taste';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hassled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hateful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Haughty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Heart broken';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Heartless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Heavy-hearted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hedonistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Helpful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Helpless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Heroic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hesitant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='High energy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='High self-esteem';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hilarious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Holy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Homesick';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Honest';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Honor-bound';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Honorable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hopeful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hopeless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hormonal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Horrible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hospitable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hostile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hot headed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Huffy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Humble';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Humorous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hurt';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hypocritical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Hysterical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ignorant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ignored';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ill-bred';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Imaginative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Immature';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Immobile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Immodest';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impartial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impatient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impeccable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impersonal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impolite';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impotent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impractical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impressed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Improves self';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impudent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Impulsive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inactive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Incoherent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Incompetent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inconsiderate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inconsistent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indecisive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Independent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indifferent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indiscreet';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indiscriminate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Individualistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indolent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Indulgent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Industrious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inefficient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inept';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Infantile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Infatuated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inflexible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Informed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Infuriated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inhibited';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inhumane';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inimitable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Innocent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inquisitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insane';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insecure';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insensitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insightful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insincere';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insipid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insistent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insolent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insouciant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inspired';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Instinctive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Insulting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intellectual';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intelligent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intense';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Interested';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intimidated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intimidating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intolerant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intrepid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Introspective';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Introverted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Intuitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Inventive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Irresolute';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Irresponsible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Irreverent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Irritable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Irritating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Isolated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jackass';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jaded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jealous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jittery';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Joking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jolly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jovial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Joyful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Judgmental';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Jumpy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Just';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Keen';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Kind';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Kittenish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Knowledgeable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lackadaisical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lacking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Laconic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Languid';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lascivious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lax';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lazy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Leader';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Leaves things unfinished';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lecherous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lethargic';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lewd';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Liar';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Liberal';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Licentious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Light-hearted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Likeable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Likes people';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Limited';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lively';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Logical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lonely';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Longing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loquacious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lordly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loudmouth';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lovable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lovely';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loves challenge';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Low confidence';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lowly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loyal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loyal to boss';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loyal to community';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loyal to family';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Loyal to friends';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lucky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lunatic';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Lusty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Macho';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mad';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Malevolent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Malicious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Maniacal';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Manic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Manipulative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mannerly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Masochistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Materialistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Matter-of-fact';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mature';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mean';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Meek';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Megalomaniac';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Melancholy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Melodramatic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mentally slow';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Merciful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mercurial';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Messy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Meticulous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mild';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mischievous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Miserable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Miserly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mistrusting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Modern';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Modest';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Moody';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Moping';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Moralistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Morbid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Motherly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Motivated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Muddled goals';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Murderer';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mysterious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Mystical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Naive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Narcissistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Narrow-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nasty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Neat';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Needs social approval';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Needy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Negative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Negligent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nervous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Neurotic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Never gives up';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nice';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Night owl';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nihilistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='No purpose';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='No self confidence';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='No-nonsense';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Noble';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Noisy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Non-committing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nonchalant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nostalgic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nosy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nuisance';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nurturing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Nut';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obedient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obliging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Oblivious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obnoxious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obscene';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obsequious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Observant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obsessed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Obstinate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Odd';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Odious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Open';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Open to change';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Remorseful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Open-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Opinionated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Opportunistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Oppositional';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Optimistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Organized';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ornery';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ostentatious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Outgoing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Outraged';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Outrageous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Outspoken';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Overbearing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Overconfident';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Overwhelmed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Overwhelming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Overwrought';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pacifistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Painstaking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pampered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Panicked';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Paranoid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Passionate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Passive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Passive-aggressive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pathetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Patient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Patriotic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Peaceful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Penitent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pensive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perceptive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perfect';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perfectionist';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Performer';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Persecuted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perserverant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Persistent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Persuasive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perverse';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Perverted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pessimistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Petrified';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Petty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Petulant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Philanthropic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Picky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Placid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Plain';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Playful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pleasant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pleased';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Plotting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Plucky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Polished';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Polite';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pompous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Poor communicator';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Poor listener';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Popular';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Positive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unsettled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Possessive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Power-hungry';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Practical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Precise';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Predictable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Preoccupied';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pressured';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Presumptuous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pretentious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pretty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Prim';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Primitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Private';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Productive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Profane';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Professional';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Promiscuous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Prosaic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Prosperous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Protective';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Proud';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Prudent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Psychopath';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Psychotic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Puckish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Punctilious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Purposeful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Pushy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Puzzled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quarrelsome';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Queer';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quick';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quick-tempered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quiet';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quirky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quitter';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Quixotic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Radical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Raging';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rambunctious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Random';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rash';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rational';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reactionary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Realistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reasonable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rebellious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Recalcitrant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Receptive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reckless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reclusive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reflective';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Refreshed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Regretful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rejects change';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Relaxed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Relentless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reliable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Relieved';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Religious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reluctant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Remote';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Repugnant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Repulsive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Resentful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reserved';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Resilient';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Resolute';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Resourceful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Respectful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Respects experience';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Respects traditional ideas';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Responsible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Responsive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Restless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Restrained';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Results-oriented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Reverent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Righteous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rigid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Risk-averse';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Risk-taking';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rogue';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Romantic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rough';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rowdy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rude';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Rule-bound';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ruthless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sacrificing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sad';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sadistic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sage';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Saintly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sanctimonious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sanguine';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sarcastic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sassy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Satisfied';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Saucy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Savage';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Savvy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Scared';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Scarred';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Scary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Scheming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Scornful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Screwed up';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Secretive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sedate';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Seditious';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Seductive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sees the bigger picture';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Selective';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-absorbed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-assured';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-blaming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-centered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-confident';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-conscious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-controlled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-deprecating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-directed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-disciplined';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-doubting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-effacing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-indulgent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-reliant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-righteous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-satisfied';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Self-serving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Selfish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Selfless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Senile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sense of duty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sensitive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sensual';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sentimental';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Serene';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Serious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Servile';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sexy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shallow';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shameless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sharp-tongued';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sharp-witted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sheepish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shiftless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shifty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shocked';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Short-tempered';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shows initiative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shrewd';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Shy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Silent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Silly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Simple-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sincere';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Skeptical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Skillful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sleazy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Slovenly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Slow-paced';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sluggish';
UPDATE traits SET object = '{"compatibleAges": ["young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Slutty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Small-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Smart';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Smooth';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sneaky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Snob';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sociable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Socially bold';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Soft';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Soft-hearted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Solemn';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Solution-oriented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sophisticated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sore';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sorrowful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sorry';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Spendthrift';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Spiritual';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Spiteful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Splendid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Spoiled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unsure';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Spontaneous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Squeamish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Staid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Startled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stately';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Steadfast';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Steady';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stern';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stimulating';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stingy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stoic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stolid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Straightforward';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strait-laced';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strange';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stress free';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stressed out';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strict';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strong';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strong nerves';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Strong willed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stubborn';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Studious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stunned';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stupefied';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Stupid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Suave';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Submissive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Subtle';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Succinct';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sulky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sullen';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sultry';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Supercilious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Superstitious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Supportive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sure';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Surly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Suspicious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Suspicious of strangers';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sweet';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Sympathetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Systematic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Taciturn';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tactful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tactless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Talented';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Talkative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tasteful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Telepathic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Temperamental';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tempted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tenacious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tender-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tense';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Terrible';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Terrified';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Testy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thankful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thick skinned';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thief';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thoughtful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thoughtless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Threatened';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Threatening';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thrifty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thrill seeker';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Thrilled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Timid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tired';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tireless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tiresome';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Toadying';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tolerant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Torpid';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Touchy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tough';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tough-minded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Traditional';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Traitorous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tranquil';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Treacherous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tricky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Troubled';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Truculent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Trusting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Trustworthy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Truthful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Typical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Tyrannical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unappreciative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unapproachable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unassuming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unaware of own limitations';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unbending';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unbiased';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncaring';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncommitted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncommunicative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unconcerned';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unconventional';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncooperative';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncoordinated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uncouth';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Undependable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Understanding';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Undesirable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Undisciplined';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uneasy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uneducated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unenthusiastic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unfeeling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unfocused';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unforgiving';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unfriendly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Ungrateful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unhappy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unhelpful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uninhibited';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unkind';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unlucky';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unmotivated';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unpredictable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unprejudiced';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unpretentious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unreasonable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unreceptive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unreliable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unresponsive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unrestrained';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unruly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unscrupulous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unselfish';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unsuspecting';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unsympathetic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unsystematic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unusual';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Unwilling';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Upbeat';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Upset';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Uptight';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Useful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vague';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vain';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Valiant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Valorous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values fair competition';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values family';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values hard work';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values honesty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values material possessions';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values money';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Values religion';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vehement';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vengeful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Venomous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Venturesome';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Verbose';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Versatile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Veteran';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vicious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vigilant';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vigorous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vindictive';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Violent';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Virtuous';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vivacious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Volatile';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Voracious';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vulgar';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Vulnerable';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Warlike';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Warm-hearted';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wasteful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Watchful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Weak';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Weary';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Weepy';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Weird';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Welcoming';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Well grounded';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Well-groomed';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Whimsical';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wicked';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wild';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wilful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Willing';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wise';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Withdrawn';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Witty';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wonderful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Works well under pressure';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worldly';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worried';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worrying';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worshipful';
UPDATE traits SET object = '{"compatibleAges": ["adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worships the devil';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Worthless';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Wretched';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Xenophobic';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Youthful';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Zany';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Zealot';
UPDATE traits SET object = '{"compatibleAges": ["child","adolescent","young adult","adult","middle-aged","elderly","venerable"]}' WHERE name ='Zealous';
update traits set description = "not concealing one''s thoughts or feelings; frank and communicative." where name = 'open';


CREATE TABLE `pagesettings` (
  `userid` int(11) NOT NULL,
  `page` varchar(255) NOT NULL,
  `object` json NOT NULL,
  FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`userid`, `page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
