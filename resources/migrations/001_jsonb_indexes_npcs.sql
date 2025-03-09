-- Convert all JSON columns to JSONB
ALTER TABLE objects ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE characterhooks ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE traits ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE users ALTER COLUMN settings TYPE JSONB USING settings::JSONB;

-- Add indexes to JSONB columns
CREATE INDEX idx_gin_characterhooks ON characterhooks USING GIN(object);
CREATE INDEX idx_gin_traits ON traits USING GIN(object);

-- NPCs: recycle backstories generated with the AI to save money
CREATE TABLE IF NOT EXISTS npcs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object JSONB NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  raceid INT NOT NULL,
  racevariantid INT DEFAULT NULL,
  backgroundid INT DEFAULT NULL,
  classid INT DEFAULT NULL,
  classvariantid INT DEFAULT NULL,
  alignmentethical VARCHAR(255) NOT NULL,
  alignmentmoral VARCHAR(255) DEFAULT NULL,
  gender VARCHAR(255) NOT NULL,
  ischild BOOLEAN NOT NULL DEFAULT FALSE,
  hasbackstory BOOLEAN NOT NULL DEFAULT FALSE,
  backstorystatus VARCHAR(20) DEFAULT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_session_unique_npcs UNIQUE (id, userid, sessionid),
  CONSTRAINT user_fk_npcs FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE INDEX idx_npcs_userid ON npcs(userid);
CREATE INDEX idx_npcs_sessionid ON npcs(sessionid);

CREATE TABLE IF NOT EXISTS npcssenttousers (
  id SERIAL PRIMARY KEY,
  npcid UUID NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (npcid) REFERENCES npcs (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_npcssenttousers UNIQUE (npcid, userid, sessionid),
  CONSTRAINT user_fk_npcssenttousers FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE INDEX idx_npcssenttousers_npcid ON npcssenttousers(npcid);
CREATE INDEX idx_npcssenttousers_userid ON npcssenttousers(userid);
CREATE INDEX idx_npcssenttousers_sessionid ON npcssenttousers(sessionid);

CREATE TABLE IF NOT EXISTS npcsrating (
  id SERIAL PRIMARY KEY,
  npcid UUID NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  rating INT NOT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (npcid) REFERENCES npcs (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_npcsrating UNIQUE (npcid, userid, sessionid),
  CONSTRAINT user_fk_npcsrating FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE INDEX idx_npcsrating_npcid on npcsrating(npcid);
CREATE UNIQUE INDEX user_session_unique_npcsrating_idx
ON npcsrating (npcid, userid, sessionid) NULLS NOT DISTINCT;

-- FEEDBACK Q&A TABLES
CREATE TABLE IF NOT EXISTS feedbackquestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(255) NOT NULL, -- e.g. "npcgenerator"
  question JSONB NOT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbackanswers (
  id SERIAL PRIMARY KEY,
  questionid UUID NOT NULL,
  answer JSONB NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (questionid) REFERENCES feedbackquestions (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_feedbackanswers UNIQUE (questionid, userid, sessionid),
  CONSTRAINT user_fk_feedbackanswers FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE INDEX idx_feedbackanswers_questionid ON feedbackanswers(questionid);
CREATE INDEX idx_feedbackanswers_userid ON feedbackanswers(userid);
CREATE INDEX idx_feedbackanswers_sessionid ON feedbackanswers(sessionid);

DELETE FROM VOICES;
INSERT INTO voices (gender,person,"character",production,filename)
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
('female','Elizabeth Banks','Effie Trinket','The Hunger Games','effie_trinket'),
('female','Judy Foster','Dr. Eleanor Ann Arroway','Contact','eleanor_ann_arroway'),
('male','Hugo Weaving','Elrond','The Lord of the Rings','elrond'),
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
('female','Diane Morgan','Philomena Cunk',NULL,'philomena_cunk'),
('male','Morgan Freeman','Prof. Samuel Norman','Lucy','professor_samuel_norman'),
('female','Queen Elizabeth II',NULL,NULL,'queen_elizabeth'),
('male','Richard Nixon',NULL,NULL,'richard_nixon'),
('male','Arnold Schwarzenegger','The Terminator','The Terminator','terminator'),
('male','Joe Pesci','Tommy DeVito', 'Goodfellas','tommy_devito'),
('male','Alan Rickman','Severus Snape', 'Harry Potter','snape'),
('female','Evanna Lynch','Luna Lovegood', 'Harry Potter','luna_lovegood'),
('female','Helena Bonham Carter','Bellatrix Lestrange', 'Harry Potter','bellatrix_lestrange'),
('male','Robbie Coltraine','Hagrid', 'Harry Potter','hagrid'),
('male','Christopher Lee','Saruman','The Lord of the Rings','saruman'),
('female','Cate Blanchett','Galadriel','The Lord of the Rings','galadriel'),
('female','Liv Tyler','Arwen','The Lord of the Rings','arwen'),
('male','Steve Carell','Michael Scott','The Office','michael_scott'),
('female','Angela Kinsey','Angela','The Office','angela'),
('male','Brian Baumgartner','Kevin Malone','The Office','kevin_malone'),
('female','Mindy Kaling','Kelly Kapoor','The Office','kelly_kapoor'),
('male','Rainn Wilson','Dwight Schrute','The Office','dwight'),
('female','Phyllis Smith','Phyllis Vance','The Office','phyllis_vance'),
('male','Leslie David Baker','Stanley Hudson','The Office','stanley_hudson');


INSERT INTO feedbackquestions (id, topic, question) VALUES
('f1a73150-7c20-429e-93a0-12efbd6f3b03', 'npcgenerator_prompt_words', '{"question": "Which words didn''t find a match in the prompt?"}'),
('019306e3-f9eb-7dba-a650-ace9b2ecb3f7', 'npcgenerator_new_ideas', '{"question": "Are there any features you would like to see added to the NPC generator?"}'),
('019306e4-1f06-7bd1-a875-df052189d19f', 'npcgenerator_improvements', '{"question": "Are there any improvements we could make to the NPC generator?"}'),
('464a22a2-0896-4d61-8280-2c750b0d5c09', 'tools_features', '{"question": "Are there any other tools or features you would like to see added to the final version?"}'),
('6d80c61a-00e2-4c36-83d0-1f870aad8295', 'tools_features', '{"question": "Which tool are you looking forward to using the most?", "type": "poll", "options": ["Notes", "Note Groups", "Stat Block Editor v2", "Combat Manager", "Random Text Generators"] }');
