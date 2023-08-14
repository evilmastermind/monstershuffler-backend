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
INSERT INTO characterhooks (hook)
VALUES
('who is really a robot in disguise'),
('who is seeking redemption'),
('who is silently judging everyone'),
('who is skilled in a forgotten art'),
('who is struggling with addiction'),
('who is the black sheep of the family'),
('who is the last of [their] kind'),
('who is the only survivor of a tragedy'),
('who is the victim of mistaken identity'),
('who is trying to make amends'),
('who is unsure of [their] true identity'),
('who is wanted dead or alive'),
('who keeps having prophetic dreams'),
('who left everything behind to pursue a dream'),
('who lost everything in a natural disaster'),
('who made a deal with the devil'),
('who never backs down from a challenge'),
('who never forgets a face'),
('who never speaks the truth'),
('who possesses a rare and powerful gift'),
('who ran away from home at a young age'),
('who sees ghosts'),
('who seeks revenge for a past betrayal'),
('who seems average but has a hidden talent'),
('who talks to imaginary friends'),
('who was abandoned as a child'),
('who was betrayed by someone [they] trusted'),
('who was once a hero but now a villain'),
('who was once wealthy but lost everything'),
('who wishes to be immortal'),
('who''s always on the lookout for danger'),
('who''s constantly plagued with bad luck'),
('who''s haunted by the ghosts of [their] enemies'),
('who''s known for [their] terrible cooking'),
('who''s searching for a lost artifact'),
('who''s seeking [their] true purpose'),
('who struggles with social anxiety'),
('who''s always in the wrong place at the wrong time'),
('who possesses a mysterious and ancient artifact'),
('who''s on a quest for knowledge'),
('who has a love-hate relationship with [their] powers'),
('who believes [they]''s descended from a mythical creature'),
('who''s always looking for the next big opportunity'),
('who has an unrequited love for someone unattainable'),
('who''s trying to start a new life'),
('who''s a survivor of a deadly virus outbreak'),
('who''s always on the lookout for the supernatural'),
('who''s haunted by a past mistake'),
('who''s physically strong but emotionally fragile'),
('who has a scar that tells a story'),
('who''s motivated by revenge'),
('who''s a master of disguise'),
('who''s constantly changing [their] appearance'),
('who''s always the underdog'),
('who''s searching for meaning in a meaningless world'),
('who''s can''t escape [their] own mind'),
('who''s a thrill-seeker'),
('who''s trying to break a bad habit'),
('who''s plagued by nightmares'),
('who''s running from [their] own destiny'),
('who''s always working hard to make a living'),
('who''s always in the shadow of someone else'),
('who''s trying to create a better future'),
('who''s a sucker for a good romance'),
('who''s always putting others before [them]self'),
('who''s trying to atone for a terrible mistake'),
('who''s seeking vengeance against an enemy'),
('who''s determined to prove [their] worth'),
('who''s constantly underestimated but fiercely determined'),
('who''s struggling to overcome a debilitating illness'),
('who''s always in the right place at the right time'),
('who''s a master of sarcasm and wit'),
('who''s always looking for the next thrill'),
('who''s desperately holding onto a lost love'),
('who''s just trying to get by in life'),
('who''s been gifted with a unique talent'),
('who''s haunted by a traumatic event from [their] childhood'),
('who''s constantly searching for a sense of belonging'),
('who''s torn between two worlds'),
('who''s always been a lone wolf'),
('who''s keeping a dark secret from [their] loved ones'),
('who''s chasing after an elusive dream'),
('who''s always on the brink of self-destruction'),
('who''s trying to escape a life of crime'),
('who''s hiding a mysterious past'),
('who''s always in the front lines of battle'),
('who''s struggling to forgive [them]self'),
('who''s facing insurmountable odds'),
('who''s trying to live up to [their] family''s expectations'),
('who''s always on the move'),
('who''s fighting against [their] own destiny'),
('who''s battling a powerful addiction'),
('who''s harboring a dangerous obsession'),
('who''s always searching for the next challenge'),
('who''s trying to forget a painful memory'),
('who''s living with a heavy heart'),
('fighting for redemption'),
('haunted by the past'),
('hunted by a powerful foe'),
('in search of wisdom'),
('who inherited a mystical artifact'),
('who is lost and searching for purpose'),
('marked by destiny'),
('on a mission to save [their] people'),
('who is the last of [their] kind'),
('struggling with addiction'),
('suffering from a rare disease'),
('surviving against all odds'),
('taken in by a mentor'),
('trained in a secret art'),
('who is wandering aimlessly'),
('yearning for adventure'),
('born under a lucky star'),
('born under an unlucky star'),
('determined to prove [their] worth'),
('facing an impossible choice'),
('gifted with extraordinary powers'),
('carrying a heavy burden'),
('cursed with immortality'),
('destined for greatness'),
('destined to fail'),
('destined to lead [their] people'),
('disguised as someone else'),
('earning a living through thievery'),
('hiding [their] true identity'),
('who is hunting a dangerous creature'),
('living a double life'),
('living in constant fear'),
('on a quest for vengeance'),
('who is part of a lost civilization'),
('preparing for a great battle'),
('protecting [their] homeland'),
('running from a terrible fate'),
('sailing the high seas'),
('searching for a lost city'),
('seeking revenge for a past betrayal'),
('serving [their] country'),
('struggling with a moral dilemma'),
('who has sworn to protect the innocent'),
('who is the chosen one'),
('who is the subject of a prophecy'),
('trained to be a deadly assassin'),
('working as a spy'),
('wielding an ancient weapon'),
('working as a sellsword'),
('wrangling a dangerous pet'),
('yearning for a peaceful life'),
('who is becoming a master of [their] craft'),
('battling inner demons'),
('who is conquering insurmountable odds'),
('who inadvertently became a curse-breaker'),
('who is a disgraced noble seeking redemption'),
('dreaming of a different life'),
('escaping the fate of [their] family'),
('who is a gifted artist struggling to make a name for [them]self'),
('who is a guardian of an ancient artifact'),
('who is a heir to a powerful kingdom'),
('hiding a supernatural identity'),
('who is hunting a personal foe'),
('who is hunting the creature that killed someone important'),
('who is losing faith in [their] cause'),
('owning and operating a successful business'),
('who is part of a squad of elite soldiers'),
('who is a prisoner on the run'),
('protecting the balance of nature'),
('recovering from a tragic loss'),
('seeking to uncover [their] family history'),
('selling [their] services to the highest bidder'),
('serving a powerful and corrupt ruler'),
('stranded in a foreign land'),
('summoner of powerful elemental magic'),
('surviving in a harsh, post-apocalyptic wasteland'),
('who is the last hope of [their] people'),
('using [their] powers for personal gain'),
('working [their] way to the top through cunning and charisma'),
('yearning for revenge on an old enemy'),
('who is an unwitting pawn in a greater game'),
('who is on the verge of a breakthrough'),
('who is plagued by chronic pain'),
('who is secretly a werecreature'),
('who is seeking redemption for past mistakes'),
('who is struggling with [their] identity'),
('who is the black sheep of the family'),
('who is the last of [their] kind'),
('who knows everyone in town'),
('who learned a dark secret about [their] family'),
('who lives on the edge'),
('who lost everything in a tragic event'),
('who lost [their] sense of taste'),
('who lost [their] sense of touch'),
('who never gives up'),
('who never sleeps'),
('who plays by [their] own rules'),
('who possesses a rare skill'),
('who returned from the dead'),
('who seeks power above all else'),
('who seems to have it all figured out, but [their] is just putting on a front'),
('who suffers from claustrophobia'),
('who suffers from chronic memory loss'),
('who suffers from intense nightmares'),
('who''s had the same nightmare every night since [their] birth'),
('who survived a natural disaster'),
('who takes orders from no one'),
('who talks to animals'),
('who was abandoned as a child'),
('who was born into a life of luxury'),
('who was cursed by a witch'),
('who was disowned by [their] family'),
('who was exiled from society'),
('who was forced to flee [their] homeland'),
('who was framed for a crime [they] didn''‘t commit'),
('who was gifted with incredible powers'),
('who was hunted by a powerful organization'),
('who was imprisoned for years'),
('who was inspired by a childhood hero'),
('who was left for dead in the wilderness'),
('who was never given a chance to succeed'),
('who was once a member of a cult'),
('who was once a notorious pirate'),
('who was once a revered leader'),
('who was once betrayed by [their] closest friend'),
('who was once famous but fell from grace'),
('who was recruited by a secret society'),
('who was saved by a mysterious stranger'),
('who was sent back in time'),
('who was separated from [their] twin at birth'),
('who was taken in by a group of outlaws'),
('who was trained by a legendary warrior'),
('who was transformed by a magical artifact'),
('who was turned into a monster'),
('who was victimized by a powerful corporation'),
('who will do anything to protect [their] loved ones'),
('who works for an evil organization'),
('who yearns for adventure and excitement'),
('who''s an adrenaline junkie'),
('who''s an expert escape artist'),
('who''s always looking for a quick buck'),
('who''s atoning for a past mistake'),
('who''s been cursed with immortality'),
('who''s constantly on the move'),
('who''s haunted by a past trauma'),
('who''s immortalized in legend'),
('who''s known for [their] incredible speed'),
('who''s known for [their] incredible strength'),
('who''s known for [their] sharp intellect'),
('who''s lost in a world foreign to [them]'),
('who was born in another plane of existence'),
('who''s known for [their] incredible agility'),
('who''s seeking inner peace'),
('who''s a former paladin seeking redemption'),
('who''s out for revenge against the government'),
('who''s on the run from [their] past'),
('who''s searching for [their] true purpose'),
('who''s sworn to protect the defenseless'),
('who''s terrified of the dark'),
('who''s the last hope for [their] people'),
('who''s trying to undo a mistake from the past'),
('who''s wanted dead or alive'),
('who''s working to topple a corrupt regime'),
('who''s wracked with guilt over a past mistake'),
('who''s crossed paths with fortune'),
('whose deepest desire is to attain power'),
('who knows the location of a powerful artifact'),
('who always attracts suspicion'),
('whose family was murdered by a rival clan'),
('whose scars tell a story'),
('who''s a skilled con artist'),
('who''s in hiding from [their] enemies'),
('who''s on a quest to save [their] lost love'),
('who''s suffered a great betrayal'),
('who''s seeking atonement for past sins'),
('who''s trained in the deadliest of martial art forms'),
('who''s lived a double life for years'),
('who''s a failed experiment that turned out to be a success'),
('who''s imbued with magic energy'),
('who''s been given a second chance at life'),
('who''s destined for greatness'),
('who''s sworn to protect a sacred artifact'),
('who''s betrayed those closest to [them]'),
('who''s seeking revenge against a traitor'),
('who''s trapped between two worlds'),
('who''s bound by a powerful spell'),
('who''s lost [their] memories in a tragic event'),
('who''s hunted for what [they] know'),
('who''s the only one who knows a dark secret'),
('who''s destined to bring about the apocalypse'),
('who''s seeking to restore a disrupted balance in nature'),
('who''s been scarred by a great tragedy'),
('whose past mistakes haunt [their] every step'),
('who was raised by the undead'),
('whose family heirloom is corrupting [their] soul'),
('who''s always running late'),
('who''s an avid reader'),
('who''s never without [their] morning coffee'),
('who''s terrible at cooking'),
('who''s a night owl'),
('who''s a morning person'),
('who''s always writing boring letters to [their] friends'),
('who''s a neat freak'),
('who''s always losing [their] keys'),
('who''s always forgetting important dates'),
('who''s always trying new recipes'),
('who''s always on the latest trend'),
('who''s often caught daydreaming'),
('who''s always in the middle of home renovation projects'),
('who''s always looking for a deal'),
('who''s always overthinking things'),
('who''s always working on [their] side hustle'),
('who''s always on the go'),
('who''s a little bit of a perfectionist'),
('who''s very organized'),
('who''s always in need of a good night''s sleep'),
('who''s always up for a game night'),
('who''s very sentimental'),
('who''s always talking about [their] pets'),
('who''s always trying to make people laugh'),
('who''s never without a to-do list'),
('who''s a fan of DIY projects'),
('who''s always up for a good workout'),
('who''s always looking for inspiration'),
('who''s always ready to lend a hand'),
('who''s passionate about gardening'),
('who''s a strict vegetarian'),
('who''s always up for a good conversation'),
('who''s always running errands'),
('who''s always up for a board game'),
('who''s always trying new restaurants'),
('who''s always in search of a good bargain'),
('who''s often caught singing in the shower'),
('who''s always looking for ways to save energy'),
('who''s always trying to cut down on waste'),
('who''s a regular at the local farmer''s market'),
('who''s always trying to improve [their] skills'),
('who''s always willing to try something new'),
('who''s a natural at problem-solving'),
('who''s always looking for ways to give back to the community'),
('who''s always up for a little friendly competition'),
('who''s always daydreaming about [their] next vacation'),
('who''s always looking for ways to simplify [their] life'),
('who''s always looking for ways to stay organized'),
('who''s always chasing [their] dreams'),
('who''s always up for a hike'),
('who''s always in search of the perfect cup of tea'),
('who''s always looking for ways to improve [their] health'),
('who''s always on top of the latest news and trends'),
('who''s always committed to [their] workout routine'),
('who''s always up for a good book'),
('who''s always on top of [their] appointments and deadlines'),
('who''s always trying to learn something new'),
('who''s always ready to lend an ear or give advice'),
('who''s always looking for creative ways to decorate [their] home'),
('who''s a fan of thrift stores'),
('who''s always open to new experiences'),
('who''s always up for a good theatre night'),
('who''s always looking for ways to save money'),
('who''s a fan of cozy nights in'),
('who''s always up for a stroll in the park'),
('who''s a responsible exotic pet owner'),
('who owns way too many cats'),
('who owns way too many dogs'),
('who owns way too many pets'),
('who''s always looking for ways to stay hydrated'),
('who''s a fan of weekend brunches'),
('who''s always trying to reduce stress in [their] life'),
('who''s always in search of the perfect work-life balance'),
('who''s always interested in learning about different cultures'),
('who''s always looking for new recipes to try at home'),
('who''s always trying to improve [their] work skills'),
('who''s always up for a good dance party'),
('who''s always in search of the perfect cup of coffee'),
('who''s a fan of volunteering for a good cause'),
('who''s always looking for ways to stay organized at work'),
('who''s always up for a good karaoke session'),
('who''s always a stickler for punctuality'),
('who''s always in search of relaxation and tranquility'),
('who''s always up for a friendly game of basketball'),
('who''s always up for a good caravan trip'),
('who''s always trying to keep [their] living space tidy'),
('who''s always in search of the perfect skincare routine'),
('who''s always up for a game of chess'),
('who''s a fan of afternoon naps'),
('who''s always trying to stay on top of [their] laundry pile'),
('who''s always on the lookout for the latest fashion trends'),
('who''s always up for a good workout class'),
('who''s always looking for ways to reduce waste in [their] home'),
('who''s a regular at the nearby wrestling ring'),
('who''s a talented wrestler'),
('who''s always on the hunt for the best sandwich in town'),
('who''s always up for a walk around the neighborhood'),
('who''s always in search of the best way to wind down after work'),
('who''s always up for a friendly game of cards'),
('who''s a fan of meditation and mindfulness practices'),
('who''s always up for a good art exhibit'),
('who''s always trying to learn a new language'),
('who''s always on the hunt for unique jewelry'),
('who''s always looking for new and exciting workout routines'),
('who''s always up for a good camping trip'),
('who''s always looking for new ways to spice up [their] meals'),
('who only wears pink clothes'),
('who only wears black clothes');
