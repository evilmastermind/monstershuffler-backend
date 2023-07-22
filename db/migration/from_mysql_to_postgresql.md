-1 mount the old mysql database

```sql
mysql -u root -p
...
use dbname (or create database dbname)
source old-db.sql
```

-2 execute objects.sql to update the tables

-3 get nmig https://github.com/AnatolyUss/nmig and convert the db from mysql to postgresql

Example of config.json file (nmig)

```json
    [...]
    "source" : {
        "host"             : "localhost",
        "port"             : 3306,
        "database"         : "monstershuffler",
        "charset"          : "utf8mb4",
        "supportBigNumbers": true,
        "user"             : "root",
        "password"         : "password"
    },
    [...]
    "target" : {
        "host"     : "localhost",
        "port"     : 5432,
        "database" : "monstershuffler",
        "charset"  : "UTF8",
        "user"     : "postgres",
        "password" : "password"
    },
    [...]
```

-4 link the backend to the new db

-5 request the conversion of all the objects in the DB with the HTTP call converter/converter, to update the JSON objects to the new version

-6 convert Objects from JSON to JSONB
``` sql
 ALTER TABLE monstershuffler.objects ALTER COLUMN object TYPE JSONB USING object::JSONB;
```
