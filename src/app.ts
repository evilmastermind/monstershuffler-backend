import "module-alias/register";
import * as dotenv from "dotenv";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import Sensible from "@fastify/sensible";
import fjwt from "@fastify/jwt";
import cors from "@fastify/cors";
import { version } from "../package.json";
import fs from "fs";
// schemas
// import { actionSchemas } from '@/modules/action/action.schema';
// import { armorSchemas } from '@/modules/armor/armor.schema';
// import { backgroundSchemas } from '@/modules/background/background.schema';
// import { characterSchemas } from '@/modules/character/character.schema';
import { classSchemas } from "@/modules/class/class.schema";
// import { classvariantSchemas } from '@/modules/classvariant/classvariant.schema';
// import { damageTypeSchemas } from '@/modules/damagetype/damagetype.schema';
// import { folderSchemas } from '@/modules/folder/folder.schema';
// import { languageSchemas } from '@/modules/language/language.schema';
// import { nameSchemas } from '@/modules/name/name.schema';
import { npcSchemas } from "@/modules/npc/npc.schema";
import { professionSchemas } from "@/modules/profession/profession.schema";
// import { quirkSchemas } from '@/modules/quirk/quirk.schema';
import { raceSchemas } from "@/modules/race/race.schema";
// import { racevariantSchemas } from '@/modules/racevariant/racevariant.schema';
// import { reportSchemas } from '@/modules/report/report.schema';
// import { skillSchemas } from '@/modules/skill/skill.schema';
// import { spellSchemas } from '@/modules/spell/spell.schema';
// import { surnameSchemas } from '@/modules/surname/surname.schema';
// import { templateSchemas } from '@/modules/template/template.schema';
// import { traitSchemas } from '@/modules/trait/trait.schema';
import { userSchemas } from "@/modules/user/user.schema";
// import { weaponSchemas } from '@/modules/weapon/weapon.schema';
// routes
// import actionRoutes from '@/modules/action/action.route';
// import armorRoutes from '@/modules/armor/armor.route';
// import backgroundRoutes from '@/modules/background/background.route';
// import characterRoutes from '@/modules/character/character.route';
import classRoutes from "@/modules/class/class.route";
// import classvariantRoutes from '@/modules/classvariant/classvariant.route';
// import damageTypeRoutes from '@/modules/damagetype/damagetype.route';
// import folderRoutes from '@/modules/folder/folder.route';
// import languageRoutes from '@/modules/language/language.route';
// import nameRoutes from '@/modules/name/name.route';
import npcRoutes from "@/modules/npc/npc.route";
import professionRoutes from "@/modules/profession/profession.route";
// import quirkRoutes from '@/modules/quirk/quirk.route';
import raceRoutes from "@/modules/race/race.route";
// import racevariantRoutes from '@/modules/racevariant/racevariant.route';
// import reportRoutes from '@/modules/report/report.route';
// import skillRoutes from '@/modules/skill/skill.route';
// import spellRoutes from '@/modules/spell/spell.route';
// import surnameRoutes from '@/modules/surname/surname.route';
// import templateRoutes from '@/modules/template/template.route';
// import traitRoutes from '@/modules/trait/trait.route';
import userRoutes from "@/modules/user/user.route";
// import weaponRoutes from '@/modules/weapon/weapon.route';
// import { hashPassword } from '@/utils/hash';
// utility routes
import converterRoutes from "@/modules/converter/converter.route";

dotenv.config();
export const server = Fastify({ logger: true });
// export const server = Fastify();

const secret = process.env.JWT_SECRET;
if (secret === undefined) {
  console.error("Missing JWT_SECRET in .env");
  process.exit(1);
}

server
  // cors
  .register(cors, {
    origin: true,
  })
  // jwt
  .register(fjwt, {
    secret: secret,
  })
  // default responses & other tools
  .register(Sensible)
  // mailer
  .register(require("fastify-mailer"), {
    defaults: { from: `Ismael <${process.env.AUTH_USER}>` },
    transport: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      // secureConnection: false, // TLS requires secureConnection to be false
      secure: true,
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD,
      },
      tls: {
        ciphers:'SSLv3'
      }
    },
  })
  // authentication with jwt
  .decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        return reply.send(error);
      }
    }
  )
  .decorate("authenticateOptional", async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      return; // keep going without authentication
    }
  })
  // test route
  .get("/api/health", async function () {
    return { status: "WORKIN'" };
  })

  .setErrorHandler(function (error, request, reply) {
    if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
      // Log error
      this.log.error(error);
      // Send error response
      reply.status(500).send({ ok: false });
    } else {
      // fastify will use parent error handler to handle this
      reply.send(error);
    }
  });

async function main() {
  try {
    const schemas = [
      // ...actionSchemas,
      // ...armorSchemas,
      // ...backgroundSchemas,
      // ...characterSchemas,
      ...classSchemas,
      // ...classvariantSchemas,
      // ...damageTypeSchemas,
      // ...folderSchemas,
      // ...languageSchemas,
      // ...nameSchemas,
      ...npcSchemas,
      ...professionSchemas,
      // ...quirkSchemas,
      ...raceSchemas,
      // ...racevariantSchemas,
      // ...reportSchemas,
      // ...skillSchemas,
      // ...spellSchemas,
      // ...surnameSchemas,
      // ...templateSchemas,
      // ...traitSchemas,
      ...userSchemas,
      // ...weaponSchemas
    ];

    for (const schema of schemas) {
      server.addSchema(schema);
    }

    server.register(
      swagger,
      withRefResolver({
        routePrefix: "api/docs",
        openapi: {
          info: {
            title: "Monstershuffler API",
            description: "REST API for monstershuffler.com",
            version,
          },
          tags: [
            { name: "users", description: "The users' account. " },
            // { name: 'actions', description: 'Retrieve the official actions of srd monsters, classes and races to build your creatures faster. Save your custom actions and share them with other users.' },
            // { name: 'armor', description: 'The different types of armor that can be worn by characters.' },
            // { name: 'backgrounds', description: 'Tiny snippets of lore to add to your characters for roleplay purposes.' },
            // { name: 'characters', description: 'Any type of Dungeons & Dragons creature, like Monsters, NPCs, Player Characters, etc.' },
            {
              name: "classes",
              description:
                "Classes are the main way to define a character's role in the game. They define what abilities the character has and how they can use them.",
            },
            // { name: 'class variants', description: 'Class variants can be subclasses, archetypes, variants or customizations that add new features on top of their base class.' },
            // { name: 'damage types', description: 'Damage types are the different types of damage that can be dealt by weapons, spells, and other effects.' },
            // { name: 'folders', description: 'Folders are a way to organize your characters, actions, etc. into groups.' },
            // { name: 'languages', description: 'Languages are the different ways that characters can communicate with each other.' },
            // { name: 'names', description: 'A collection of names for your characters, divided into different categories.' },
            {
              name: "npcs",
              description: "Tools to generate non-player-characters (NPCs).",
            },
            {
              name: "professions",
              description:
                "Professions are a way to define a character's occupation, like a soldier, a merchant, a priest, etc. and give them minor abilities related to that occupation. They are usually given to NPCs in place of classes.",
            },
            // { name: 'quirks', description: 'Quirks are small, random snippets of lore that can be added to your characters for roleplay purposes.' },
            {
              name: "races",
              description:
                "A race defines the innate abilities derived from a character's fantasy ancestry.",
            },
            // { name: 'race variants', description: 'Race variants, or subraces, further define a character\'s ancestry by adding new features on top of their base race.' },
            // { name: 'reports', description: 'Suggestions, complaints or bug reports made by users.' },
            // { name: 'skills', description: 'Skills are abilities that characters can use to perform certain tasks.' },
            // { name: 'spells', description: 'Spells are magical abilities that characters can use to perform certain tasks.'},
            // { name: 'surnames', description: 'A collection of surnames for your characters, divided into different categories.' },
            // { name: 'templates', description: 'Templates are \'bundles of statistics\' that can be added to characters to turn them into something different, like a Werefolf, a Zombie, or a Fire creature.' },
            // { name: 'traits', description: 'Traits are  mostly adjectives describing a creature\'s state of mind, attitude, core beliefs or current feelings.' },
            // { name: 'weapons', description: 'Different types of weapons that can be used to better define characters\'s actions.'}
          ],
        },
      })
    );
    server.register(swaggerUi, {
      routePrefix: "api/docs",
      staticCSP: true,
    });

    // server.register(actionRoutes, { prefix: 'api/actions' });
    // server.register(armorRoutes, { prefix: 'api/armor' });
    // server.register(backgroundRoutes, { prefix: 'api/backgrounds' });
    // server.register(characterRoutes, { prefix: 'api/characters' });
    server.register(classRoutes, { prefix: "api/classes" });
    // server.register(classvariantRoutes, { prefix: 'api/classvariants' });
    // server.register(damageTypeRoutes, { prefix: 'api/damagetypes' });
    // server.register(folderRoutes, { prefix: 'api/folders' });
    // server.register(languageRoutes, { prefix: 'api/languages' });
    // server.register(nameRoutes, { prefix: 'api/names' });
    server.register(npcRoutes, { prefix: "api/npcs" });
    server.register(professionRoutes, { prefix: "api/professions" });
    // server.register(quirkRoutes, { prefix: 'api/quirks' });
    server.register(raceRoutes, { prefix: "api/races" });
    // server.register(racevariantRoutes, { prefix: 'api/racevariants' });
    // server.register(reportRoutes, { prefix: 'api/reports' });
    // server.register(skillRoutes, { prefix: 'api/skills' });
    // server.register(spellRoutes, { prefix: 'api/spells' });
    // server.register(surnameRoutes, { prefix: 'api/surnames' });
    // server.register(templateRoutes, { prefix: 'api/templates' });
    // server.register(traitRoutes, { prefix: 'api/traits' });
    server.register(userRoutes, { prefix: "api/users" });
    // server.register(weaponRoutes, { prefix: 'api/weapons' });
    // utility routes
    server.register(converterRoutes, { prefix: "api/converter" });

    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.info("///////////////////////////////////////////");
    console.info("// M O N S T E R S H U F F L E R   A P I");
    console.info("// ✓ Server ready at http://localhost:3000");
    console.info("// ✓ Docs at http://localhost:3000/api/docs");
    const swaggerYAML = server.swagger({ yaml: true });
    fs.writeFileSync("./swagger.yaml", swaggerYAML);
    console.info("// ✓ swagger.yaml written!");
    console.info("///////////////////////////////////////////");
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
}

main();
