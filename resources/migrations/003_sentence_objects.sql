CREATE TABLE IF NOT EXISTS backstorysentencesactions (
  id SERIAL PRIMARY KEY,
  backstorysentenceid INT NOT NULL,
  game INT DEFAULT 1,
  object JSONB NOT NULL,
  FOREIGN KEY (backstorysentenceid) REFERENCES backstorysentences(id) ON DELETE CASCADE
);
