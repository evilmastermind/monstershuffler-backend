import { parsePolygenGrammar } from '@/modules/polygen/polygen.service';

export async function getCause() {
  return await parsePolygenGrammar(`
S ::= (+++ Monster from the game "Dungeons and Dragons 5th edition" | Relationship | Event | deity | Organization |+++ Magicalstuff );

Magicalstuff ::= (Magical Wearable | Magical Weapon | Magical Anomaly | Magical Item | Magical Instrument);
Magical ::= (enchanted | magical | cursed |-- sentient |-- haunted |- blessed);
Wearable ::= (Jewelery |  Clothing | Armor | Hats);
Jewelery ::= (amulet | brooch | earring | medallion | necklace | ring | trinket);
Clothing ::= (blouse | boots | belt | bracers | bracelets | cape | cloak | cuirass | dress | gauntlet | goggles | gloves | helm | helmet | kilt | lenses | monocle | lingerie | loincloth | mask | mantle | mittens | pants | pajamas | sandals | sashscarf | shawl | shirt | shoes | shorts | skirt | socks | stockings | trousers | vest | underwear | thong | scepter | cane);
Armor ::= (breastplate armor | chain mail armor | chain shirt | half plate armor | hide armor | leather armor | padded armor | plate armor | ring mail armor |+ (robe | tunic) | scale mail armor |+ shield | studded leather armor);
Hats ::= (bandana | hat | cap | fez | turban | headband | fedora | cowboy hat | sombrero | top hat | cloche hat | mitre | bonnet | hood | tiara | crown);
Weapon ::= (sword | dagger | axe | mace | hammer | staff | wand | bow | crossbow | sling | spear | lance | halberd | scythe | flail | whip | club | trident | javelin | blowgun | net | truncheon | glaive | pike | rapier | scimitar | longsword | shortsword | greatsword | handaxe | battleaxe | warhammer | maul | quarterstaff | light crossbow | heavy crossbow | shortbow | longbow | sling | spear | lance | halberd | scythe | flail | whip | club | trident | javelin | blowgun | net | truncheon | glaive | pike | rapier | scimitar | longsword | shortsword | greatsword | handaxe | battleaxe | warhammer | maul | quarterstaff | light crossbow | heavy crossbow | shortbow | longbow | catapult |- cannon |-- trebuchet );
Anomaly ::= ( portal | rift | anomaly | time distortion | pit | disturbance | zone );
Item ::= (Adventuringgear | Valuables | Furniture |-- Transportation | Tools);
Adventuringgear ::= (bag | backpack | +book | tome | candle | chain | holster | hourglass | lamp | lantern | map | pouch | quiver | rope | sack | satchel | tent | torch | lockpick);
Valuables ::= (coin | crystal | gem | key | orb | + potion | relic | scepter | painting | + scroll | (statue | statuette | figurine));
Furniture ::= (barrel | bottle | bauble | bowl | bucket | carpet | cauldron | chair | chalice | chest | crate | cup | door | fireplace | fork | goblet | jar | jug | kettle | pan | plate | banner | pedestal | flag | rod | rug | saucer | spoon | stove | tapestry | vase);
Transportation ::= ([--flying] (boat | ship | galleon) | chariot | cart | carriage);
Tools ::= (abacus | pen | quill | ink | rake | scythe | shovel | spade | stick | wheelbarrow | hammer | sledgehammer | scissors | pocket knife | saw | paperclip | pliers | wrench | chisel);
Monster ::= ( homunculus | lemure | shrieker | kobold | merfolk | stirge | aarakocra | dretch | drow | flying sword | goblin | grimlock | pseudodragon | pteranodon | skeleton | sprite | steam mephit | violet fungus | zombie | cockatrice | darkmantle | dust mephit | gnoll | svirfneblin | gray ooze | hobgoblin | ice mephit | lizardfolk | magma mephit | magmin | orc | rust monster | sahuagin | satyr | shadow | warhorse skeleton | animated armor | brass dragon wyrmling | bugbear | copper dragon wyrmling | dryad | duergar | ghoul | harpy | hippogriff | imp | quasit | specter | allosaurus | ankheg | azer | black dragon wyrmling | bronze dragon wyrmling | centaur | ettercap | gargoyle | gelatinous cube | ghast | gibbering mouther | green dragon wyrmling | grick | griffon | merrow | mimic | minotaur skeleton | ochre jelly | ogre | ogre zombie | pegasus | plesiosaurus | rug of smothering | sea hag | wererat | white dragon wyrmling | will o wisp | silver dragon wyrmling | ankylosaurus | basilisk | bearded devil | blue dragon wyrmling | doppelganger | green hag | hell hound | manticore | minotaur | mummy | nightmare | owlbear | werewolf | wight | gold dragon wyrmling | black pudding | chuul | couatl | ettin | ghost | lamia | red dragon wyrmling | succubus | incubus | wereboar | weretiger | air elemental | barbed devil | bulette | earth elemental | fire elemental | flesh golem | gorgon | hill giant | night hag | otyugh | roper | salamander | shambling mound | triceratops | troll | unicorn | vampire spawn | water elemental | werebear | wraith | xorn | chimera | drider | invisible stalker | medusa | vrock | wyvern | young brass dragon | young white dragon | oni | shield guardian | stone giant | young black dragon | young copper dragon | chain devil | cloaker | frost giant | hezrou | hydra | spirit naga | tyrannosaurus rex | young bronze dragon | young green dragon | bone devil | clay golem | cloud giant | fire giant | glabrezu | treant | young blue dragon | young silver dragon | aboleth | deva | guardian naga | stone golem | young red dragon | young gold dragon | behir | djinni | efreeti | gynosphinx | horned devil | remorhaz | roc | erinyes | adult brass dragon | adult white dragon | nalfeshnee | rakshasa | storm giant | vampire | adult black dragon | adult copper dragon | ice devil | adult bronze dragon | adult green dragon | mummy lord | purple worm | adult blue dragon | iron golem | marilith | planetar | adult silver dragon | adult red dragon | androsphinx | dragon turtle | adult gold dragon | balor | ancient brass dragon | ancient white dragon | pit fiend | ancient black dragon | ancient copper dragon | lich | solar | ancient bronze dragon | ancient green dragon | ancient blue dragon | kraken | ancient silver dragon | ancient red dragon | ancient gold dragon | tarrasque );
Instrument ::= (++lute | flute | drum | harp | lyre | horn | trumpet | violin | cello | bagpipes | "hurdy gurdy" | accordion | harmonica | tambourine | triangle | maracas | cymbals | gong | drumset | bass guitar | guitar | banjo | mandolin | ukulele | bongo | harmonica | harp | harpsichord | piano);
Socialevent ::= ( festival | celebration | ritual | ceremony | battle | war | skirmish | duel | competition | contest | war | rebellion | revolution | uprising | coup | assassination );
Naturalevent ::= ( aurora | avalanche | blizzard | cold snap | comet | drought | earthquake | eclipse | flood | fog | hailstorm | heatwave | hurricane | meteor shower | mist | rainbow | rainstorm | sandstorm | snowfall | storm | thunderstorm | tornado | tsunami | volcanic eruption | wildfire );
Event ::= ( Naturalevent | Socialevent | Magicalevent );
Magicalevent ::= ( ritual | ceremony | spell | curse | enchantment | prophecy );
Organization ::= ( guild | order | brotherhood | sisterhood | cult | sect | cabal | coven | circle | society | club | association | league | alliance | coalition | confederation | federation | corporation | company | business | firm | enterprise | consortium | syndicate | cartel | foundation | charity | institute | academy | university | school | college | seminary | fraternity | sorority | council | committee | board of directors | commission | agency | bureau | department | administration | government | regime | political authority | business corporation | company | bandit gang | criminal organization | thieves guild | assassins guild | mercenary company | military order | knightly order | religious order | secret society);
Relationship ::= ( betrayal | (unrequited | forbidden | secret) love | love triangle | (arranged | political | forced) marriage | (estranged | lost) family | rival | enemy | gamble | loan | kidnapping | extortion | blackmail | torture |+ murder | adoption | disgrace | parenthood | inheritance | (+ death of (a parent | both parents | a relative | a sibling | a friend) ) );

`);
}

export async function getLocation() {
  return await parsePolygenGrammar(`
S ::= Locationstatus Locationtype ;

Locationstatus ::= [ abandoned | ancient | cursed | haunted | hidden | lost | magical | mysterious | sacred | secret | strange | unknown | unexplored | uninhabited | unfinished | forgotten | forbidden | hidden ];
Locationtype ::= ( castle | fortress | tower | keep | palace | temple | cathedral | shrine | church | monastery | abbey | library |- university | school | academy | guildhall | inn | tavern | pub | market | bazaar | fair | festival | carnival | circus | theater | opera house | concert hall | amphitheater | stadium | arena | coliseum | bathhouse | brothel | prison | jail | dungeon | catacombs | sewers | crypt | graveyard | cemetery | mausoleum | tomb | pyramid | ziggurat | obelisk | statue | monument | fountain | well | spring | river | lake | pond | waterfall | stream | brook | canal | aqueduct | bridge | causeway | road | highway | path | trail | street | alley | lane | square | plaza | park | garden | woods | bog | moor | heath | glacier | valley | canyon | cave | cavern | grotto | mine | battlefield);

  `);
}

export async function getEnvironment() {
  return await parsePolygenGrammar(`
S ::= (+(city | town | village | hamlet) | arctic | forest | underdark | desert | mountain | swamp | jungle |-- (sea | ocean)| coastal | grassland | savannah | wasteland | tundra );
    `);
}
