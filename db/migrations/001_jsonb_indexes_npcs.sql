-- Convert all JSON columns to JSONB
ALTER TABLE objects ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE characterhooks ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE traits ALTER COLUMN object TYPE JSONB USING object::JSONB;
ALTER TABLE users ALTER COLUMN settings TYPE JSONB USING settings::JSONB;

-- Add indexes to JSONB columns
CREATE INDEX idx_gin_characterhooks ON characterhooks USING GIN(object);
CREATE INDEX idx_gin_traits ON traits USING GIN(object);

-- NPCs: recycle backstories generated with the AI in order to save money
CREATE TABLE npcs (
  id UUID NOT NULL PRIMARY KEY,
  object JSONB NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  race VARCHAR(255) NOT NULL,
  racevariant VARCHAR(255) DEFAULT NULL,
  background VARCHAR(255) DEFAULT NULL,
  class VARCHAR(255) DEFAULT NULL,
  classvariant VARCHAR(255) DEFAULT NULL,
  alignmentmoral VARCHAR(255) NOT NULL,
  alignmentethical VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_session_unique_npcs UNIQUE (id, userid, sessionid),
  CONSTRAINT user_fk_npcs FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE TABLE npcssenttousers (
  npcid UUID NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (npcid, userid, sessionid),
  FOREIGN KEY (npcid) REFERENCES npcs (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_npcssenttousers UNIQUE (npcid, userid, sessionid),
  CONSTRAINT user_fk_npcssenttousers FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
CREATE TABLE npcsrating (
  npcid UUID NOT NULL,
  userid INT DEFAULT NULL,
  sessionid VARCHAR(250) DEFAULT NULL,
  rating INT NOT NULL,
  datecreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (npcid, userid, sessionid),
  FOREIGN KEY (npcid) REFERENCES npcs (id) ON DELETE CASCADE,
  CONSTRAINT user_session_unique_npcsrating UNIQUE (npcid, userid, sessionid),
  CONSTRAINT user_fk_npcsrating FOREIGN KEY (userid) REFERENCES users(id),
  CHECK (userid IS NOT NULL OR sessionid IS NOT NULL),
  CHECK (userid IS NULL OR sessionid IS NULL)
);
