//=======================================================
// schemas
//=======================================================
// import { actionSchemas } from '@/modules/action/action.schema';
// import { aiSchemas } from '@/modules/ai/ai.schema';
// import { armorSchemas } from '@/modules/armor/armor.schema';
// import { characterhookSchemas } from '@/modules/background/characterhook.schema';
// import { backgroundSchemas } from '@/modules/background/background.schema';
// import { characterSchemas } from '@/modules/character/character.schema';
// import { classSchemas } from '@/modules/class/class.schema';
// import { classvariantSchemas } from '@/modules/classvariant/classvariant.schema';
// import { damageTypeSchemas } from '@/modules/damagetype/damagetype.schema';
// import { folderSchemas } from '@/modules/folder/folder.schema';
// import { languageSchemas } from '@/modules/language/language.schema';
// import { nameSchemas } from '@/modules/name/name.schema';
// import { npcSchemas } from '@/modules/npc/npc.schema';
// import { pagesettingSchemas } from '@/modules/pagesetting/pagesetting.schema';
// import { polygenSchemas } from '@/modules/polygen/polygen.schema';
// import { quirkSchemas } from '@/modules/quirk/quirk.schema';
// import { raceSchemas } from '@/modules/race/race.schema';
// import { racevariantSchemas } from '@/modules/racevariant/racevariant.schema';
// import { reportSchemas } from '@/modules/report/report.schema';
// import { skillSchemas } from '@/modules/skill/skill.schema';
// import { spellSchemas } from '@/modules/spell/spell.schema';
// import { surnameSchemas } from '@/modules/surname/surname.schema';
// import { templateSchemas } from '@/modules/template/template.schema';
// import { traitSchemas } from '@/modules/trait/trait.schema';
// import { userSchemas } from '@/modules/user/user.schema';
// import { weaponSchemas } from '@/modules/weapon/weapon.schema';

//=======================================================
// routes
//=======================================================
// import actionRoutes from '@/modules/action/action.route';
// import aiRoutes from '@/modules/ai/ai.route';
// import armorRoutes from '@/modules/armor/armor.route';
import backgroundRoutes from '@/modules/background/background.route';
// import characterhookRoutes from '@/modules/characterhook/characterhook.route';
// import characterRoutes from '@/modules/character/character.route';
import classRoutes from '@/modules/class/class.route';
// import classvariantRoutes from '@/modules/classvariant/classvariant.route';
// import damageTypeRoutes from '@/modules/damagetype/damagetype.route';
// import folderRoutes from '@/modules/folder/folder.route';
// import languageRoutes from '@/modules/language/language.route';
// import nameRoutes from '@/modules/name/name.route';
import npcRoutes from '@/modules/npc/npc.route';
import pagesettingRoutes from './pagesetting/pagesetting.route';
import polygenRoutes from '@/modules/polygen/polygen.route';
// import quirkRoutes from '@/modules/quirk/quirk.route';
import raceRoutes from '@/modules/race/race.route';
// import racevariantRoutes from '@/modules/racevariant/racevariant.route';
// import reportRoutes from '@/modules/report/report.route';
// import skillRoutes from '@/modules/skill/skill.route';
import spellRoutes from '@/modules/spell/spell.route';
// import surnameRoutes from '@/modules/surname/surname.route';
// import templateRoutes from '@/modules/template/template.route';
import traitRoutes from '@/modules/trait/trait.route';
import userRoutes from '@/modules/user/user.route';
// import weaponRoutes from '@/modules/weapon/weapon.route';
// import { hashPassword } from '@/utils/hash';
// utility routes
import converterRoutes from '@/modules/converter/converter.route';

export const schemas = [
  // ...actionSchemas,
  // ...aiSchemas,
  // ...armorSchemas,
  // ...backgroundSchemas,
  // ...characterSchemas,
  // ...classSchemas,
  // ...classvariantSchemas,
  // ...damageTypeSchemas,
  // ...folderSchemas,
  // ...languageSchemas,
  // ...nameSchemas,
  // ...npcSchemas,
  // ...pagesettingSchemas,
  // ...polygenSchemas,
  //...characterhookSchemas,
  // ...quirkSchemas,
  // ...raceSchemas,
  // ...racevariantSchemas,
  // ...reportSchemas,
  // ...skillSchemas,
  // ...spellSchemas,
  // ...surnameSchemas,
  // ...templateSchemas,
  // ...traitSchemas,
  // ...userSchemas,
  // ...weaponSchemas
];

export const routes = [
  //  {routes: actionRoutes,  prefix: 'api/actions' },
  // { routes: aiRoutes, prefix: 'api/ai' },
  //  {routes: armorRoutes,  prefix: 'api/armor' },
  { routes: backgroundRoutes, prefix: 'api/backgrounds' },
  //  {routes: characterRoutes,  prefix: 'api/characters' },
  { routes: classRoutes, prefix: 'api/classes' },
  //  {routes: classvariantRoutes,  prefix: 'api/classvariants' },
  //  {routes: damageTypeRoutes,  prefix: 'api/damagetypes' },
  //  {routes: folderRoutes,  prefix: 'api/folders' },
  //  {routes: languageRoutes,  prefix: 'api/languages' },
  //  {routes: nameRoutes,  prefix: 'api/names' },
  { routes: npcRoutes, prefix: 'api/npcs' },
  { routes: pagesettingRoutes, prefix: 'api/page-settings' },
  { routes: polygenRoutes, prefix: 'api/polygen' },
  // { routes: backgroundRoutes,  prefix: "api/backgrounds" },
  //  {routes: quirkRoutes,  prefix: 'api/quirks' },
  { routes: raceRoutes, prefix: 'api/races' },
  //  {routes: racevariantRoutes,  prefix: 'api/racevariants' },
  //  {routes: reportRoutes,  prefix: 'api/reports' },
  //  {routes: skillRoutes,  prefix: 'api/skills' },
  {routes: spellRoutes,  prefix: 'api/spells' },
  //  {routes: surnameRoutes,  prefix: 'api/surnames' },
  //  {routes: templateRoutes,  prefix: 'api/templates' },
  { routes: traitRoutes,  prefix: 'api/traits' },
  { routes: userRoutes, prefix: 'api/users' },
  // {routes: weaponRoutes,  prefix: 'api/weapons' },
  { routes: converterRoutes, prefix: 'api/converter' },
];
