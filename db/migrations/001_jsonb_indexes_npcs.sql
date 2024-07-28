-- Convert all JSON columns to JSONB
ALTER TABLE objects ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE characterhooks ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE traits ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE users ALTER COLUMN settings TYPE JSONB USING settings::JSONB;

-- Add indexes to JSONB columns
CREATE INDEX idx_gin_characterhooks ON characterhooks USING GIN(object);
CREATE INDEX idx_gin_traits ON traits USING GIN(object);

-- NPCs: recycle backstories generated with the AI in order to save money
CREATE TABLE IF NOT EXISTS npcs (
  id SERIAL PRIMARY KEY,
  object JSONB NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  raceid INT NOT NULL,
  racevariantid INT DEFAULT NULL,
  backgroundid INT DEFAULT NULL,
  classid INT DEFAULT NULL,
  classvariantid INT DEFAULT NULL,
  alignmentmoral VARCHAR(255) NOT NULL,
  alignmentethical VARCHAR(255) NOT NULL,
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
  npcid INT NOT NULL,
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
  npcid INT NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  rating INT NOT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (npcid) REFERENCES npcs (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_npcsrating UNIQUE (npcid, userid, sessionid),
  CONSTRAINT user_fk_npcsrating FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
create index idx_npcsrating_npcid on npcsrating(npcid);
