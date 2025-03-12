CREATE TABLE IF NOT EXISTS backstorysentences (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  alignment INT NOT NULL,
  locationorclass VARCHAR(255) DEFAULT NULL,
  sentence TEXT NOT NULL,
  summary TEXT NOT NULL
);
CREATE INDEX ON backstorysentences (type);
CREATE INDEX ON backstorysentences (alignment);
CREATE INDEX ON backstorysentences (locationorclass);

INSERT INTO backstorysentences (type,alignment,locationorclass, sentence, summary)
VALUES 
('plot',33,NULL,'[Name] found a blessed bow that grants powerful abilities but slowly corrupts its wielder. Now, [he] is using its gifts to sow chaos and destruction, seeking to bring anarchy to all who cross [his] path.','who wields a cursed blessed bow.');
