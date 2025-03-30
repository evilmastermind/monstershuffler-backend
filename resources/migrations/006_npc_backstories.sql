-- resetting all npcs
DELETE FROM npcs;

INSERT INTO objecttypes (type, name) VALUES
(7, 'npc');

ALTER TABLE npcs
DROP COLUMN object;

ALTER TABLE npcs
DROP COLUMN hasbackstory;

ALTER TABLE npcs
ADD COLUMN objectid INTEGER REFERENCES objects(id) ON DELETE CASCADE;

CREATE TABLE npcsbackstories (
  id SERIAL PRIMARY KEY,
  npcid UUID REFERENCES npcs(id) ON DELETE CASCADE,
  hook INTEGER NOT NULL,
  backstory TEXT NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX npcsbackstories_npc_hook ON npcsbackstories(npcid, hook);
