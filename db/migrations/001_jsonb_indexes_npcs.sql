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

INSERT INTO feedbackquestions (id, topic, question) VALUES
('f1a73150-7c20-429e-93a0-12efbd6f3b03', 'npcgenerator_prompt_words', '{"question": "Which words didn''t find a match in the prompt?"}'),
('019306e3-f9eb-7dba-a650-ace9b2ecb3f7', 'npcgenerator_new_ideas', '{"question": "Are there any features you would like to see added to the NPC generator?"}'),
('019306e4-1f06-7bd1-a875-df052189d19f', 'npcgenerator_improvements', '{"question": "Are there any improvements we could make to the NPC generator?"}');
