# Monstershuffler REST API
New backend interface for [monstershuffler.com](https://www.monstershuffler.com)

The purpose of this new interface is to allow other websites and platforms to access monsters and npcs created in Monstershuffler.com

( this project is still very incomplete, but you can check its progress if you want to )

## Dependencies & tools used
- [**Fastify**](https://www.fastify.io/): a node.js framework inspired by Express.js
- [**TypeScript**](https://www.typescriptlang.org/): a strongly typed programming language that builds on JavaScript
- [**Prisma**](https://www.prisma.io/): a next-gen ORM that makes this project (semi) independent from the type of db chosen
- [**Zod**](https://github.com/colinhacks/zod): a TypeScript-obsessed "schema" validator
- [**JWT**](https://jwt.io/): easy authorizations with JSON and tokens
- [**Swagger**](https://swagger.io/specification/v2/): automatic API specifications (yay!)

Initial project setup based on TomDoesTech's YouTube tutorial:
- YouTube: https://www.youtube.com/watch?v=LMoMHP44-xM
- github: https://github.com/TomDoesTech/fastify-prisma-rest-api

## How to run this project locally
To run this project locally, you need to install the following requirements in your pc:
- nodejs v16+
- mysql v8+

The steps to install node and mysql will depend on your operative system. Find a guide online or ask [ChatGPT](https://chat.openai.com/).

Create an empty mysql database, then use the terminal to import the two .sql files inside the folder `/db` of this project:
``` bash
# first upload the structure of the database
mysql -u your_mysql_username -p db_name < db_structure.sql
# then upload the seeds (starting values, like the admin user, spells, etc...)
mysql -u your_mysql_username -p db_name < db_structure.sql
```
Create a file called `.env` in the root folder of this project, then add the following lines of code inside:
``` bash
DATABASE_URL="mysql://your_mysql_username:your_password@localhost:3306/your_db_name"
JWT_SECRET="add_some_16+_random_characters_here"
```

You can now run the project using npm or yarn:
``` bash
# npm
npm run dev
# yarn
yarn dev
```





