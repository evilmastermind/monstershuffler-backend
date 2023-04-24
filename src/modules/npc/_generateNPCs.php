<?php
require_once(getenv("ENV_FOLDER") . "/php/config.php");
require_once("choicesSolver.php");

issetordie(["options"]);
$options = json_decode($_POST["options"]);
if(!isset($options->prace)) { echo "ERROR: no options defined!"; exit(); }

for($i = 1; $i<= 1; $i++) {

//---------------------------------------------
// Generating random statistics from functions
//---------------------------------------------

// choosing a random race

$chosenrace = "";
$chosenvariant = "";

$options->prace = json_decode($options->prace);
$options->srace = json_decode($options->srace);
if(!isset($options->prace->race)) { $options->prace = new stdClass(); $options->prace->race = null; $options->prace->variant = null; }
if(!isset($options->srace->race)) { $options->srace = new stdClass(); $options->srace->race = null; $options->srace->variant = null; }

$random100 = rand(1,100) ;
if($random100 <= intval($options->ppercentage))         { $chosenrace = $options->prace->race ; $chosenvariant = $options->prace->variant; }
else if($random100 <= intval($options->spercentage) + intval($options->ppercentage))    { $chosenrace = $options->srace->race ; $chosenvariant = $options->srace->variant; }

$race           = getRace($options->game,$chosenrace) ;
$racevariant    = getRaceVariant($race,$chosenvariant);
$gender         = getGender($race,$racevariant);
$name           = ($racevariant? getName($gender, $racevariant) : getName($gender, $race)) ;
$surname        = ($racevariant? getSurname($gender, $racevariant) : getSurname($gender, $race)) ;
$trait          = getTrait() ;
$feeling        = getFeeling() ;
$alignment      = getAlignment($trait["category"]) ;
$skill          = [ getSkill($options->game, $gender) ];
// $voice          = getVoice($_POST["voice"]) ;   
$color          = "" ;
$class          = null;
$classvariant   = null;
$profession     = null;
$level          = getLevel($options->level);

$options->class = json_decode($options->class);
if(!isset($options->class->class)) { $options->class = new stdClass(); $options->class->class = null; $options->class->variant = null; }

switch ($options->classtype) {
    case "Specific Class":          $class = getClass($options->game,$options->class->class) ; $classvariant = getClassVariant($class,$options->class->variant); break ;
    case "Class only":              $class = getClass($options->game) ; $classvariant = getClassVariant($class); break ;
    case "Class and Profession":    $class = getClass($options->game) ; $classvariant = getClassVariant($class); $profession = getProfession() ; break ;
    case "Profession mostly":
        if(rand(1,20)==20) {
            $class = getClass($options->game);
            $classvariant = getClassVariant($class);
        }       
        $profession = getProfession() ; 
        break ;
    case "Profession only":         $profession = getProfession() ; break ;
}

$smallbackground     = getBackground($gender) ;



//---------------------------------------
// Inserting statistics into an stdClass object
//---------------------------------------

$character = new stdClass();
$character->name = $name ;
$character->surname = $surname ;
$character->gender  = $gender ;
$character->trait   = $trait["name"] ;
$character->feeling   = $feeling["name"] ;
$character->alignment   = json_decode($alignment) ;
$character->smallbackground = $smallbackground ;

if(isset($race)) {
    $character->race        = $race;
    $levelassignment = &$character->race;
    // resolving choices inside race
    findChoices($character->race,$character->race,0);
    // adding variant if available
    if(isset($racevariant->name)) {
        $character->racevariant = $racevariant;
        // resolving choices inside race variant
        findChoices($character->racevariant,$character->racevariant,0); 
    }
}



if(isset($profession)) { 
    $character->profession = $profession;
    $levelassignment = &$character->profession;
    // resolving choices inside profession
    findChoices($character->profession,$character->profession,0); 
}
// giving a random skill for NPCs without a profession
else $character->skills  = $skill ;




if(isset($class->name)) {
    $character->class = $class;
    $levelassignment = &$character->class;
    // resolving choices inside class
    findChoices($character->class,$character->class,0);
    // adding variant if available
    if(isset($classvariant->name))  {
        $character->classvariant = $classvariant;
        // resolving choices inside class variant
        findChoices($character->classvariant,$character->classvariant,0);
    }
}

// adding levels to class, profession or race
if(!isset($levelassignment->HD)) $levelassignment->HD = 0;
$levelassignment->HD += strval($level);

// adding root to object
$output = new stdClass();
$output->character = $character ;

// encoding json
$JSON = json_encode($output, JSON_UNESCAPED_UNICODE) ;
echo $JSON;
}

    




function getGender($race,$racevariant) {
    $gender = "";
    if(isset($racevariant->gender)) $gender = $racevariant->gender;
    else if(isset($race->gender)) $gender = $race->gender;

    if($gender) return $gender;
    else if(rand(1,50)===50) return "neutral";
    else return (rand(1,2)===1? "male":"female");
} 


function setGender($string, $gender) {
    if($gender=="male") {
        $string = str_replace("§","he", $string) ;
        $string = str_replace("@","his",$string) ;
        $string = str_replace("#","him",$string) ;
    } else {
        $string = str_replace("§","she",$string) ;
        $string = str_replace("@","her",$string) ;
        $string = str_replace("#","her",$string) ;                
    }
    return $string ;
}


function getLevel($option) {
    if( $option  == 'random (1-20)') {
        return rand(1,20) ;
    } elseif ( $option == 'random (mostly low-level)') {
        $value = floor( 30/rand(1,150) + 1);
        return ($value>20? 20 : $value);
    }    
}


function getRace($game = null, $race = null) {
    
    $raceObject = "" ;
    $queryselector = "" ;

    // empty strings are now null
    $userid = isset($_SESSION['id'])? intval($_SESSION['id']) : null ;
    $game   = $game? $game : null;
    $race   = $race? intval($race) : null;

    $conn  = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($conn,'utf8');

    $stmt = $conn->prepare("
        SELECT  object, id, JSON_UNQUOTE(JSON_EXTRACT(object, '$.name')) AS name
        FROM    races
        WHERE   1=1
            AND (game = IFNULL(?,'5e'))
            AND (id   = IFNULL(?,id))
            AND (userid = 0 OR (userid = IFNULL(?,0)))
            AND  trashed = 0
            AND JSON_CONTAINS(`object`,'\"1\"', '$.\"enableGenerator\"')
        ORDER BY RAND() LIMIT 1;
        ");

    $stmt->bind_param('sii',$game,$race,$userid);

    if(!$stmt->execute()) { echo "Error: could not retrieve the races requested"; exit(); }

    $result = $stmt->get_result();
    $row    = $result->fetch_assoc();
    if(!isset($row["object"])) return null;
    $raceObject = json_decode($row["object"]);
    $raceObject->id = $row["id"];

    return $raceObject ;
}

function getRaceVariant($race,$variant = null) {
    if(!$race) return null;

    $race       = isset($race->id)?    intval($race->id)    : null;
    $variant    = $variant? $variant : null;

    $conn  = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($conn,'utf8');

    $stmt = $conn->prepare("
        SELECT object
        FROM racevariants
        WHERE raceid = ?
            AND (name   = IFNULL(?,name))
        ORDER BY RAND() LIMIT 1;
        ");

    $stmt->bind_param('is',$race,$variant);

    if(!$stmt->execute()) { echo "Error: could not retrieve the race variant requested"; exit(); }

    $result = $stmt->get_result();
    $row    = $result->fetch_assoc();

    if(isset($row["object"])) {
        return json_decode($row["object"]);
    }
    else return null;

}



function getName($gender, $race) {

        $nameType = 'human';
        if(isset($race->nameType)) $nameType = $race->nameType;

        $genderClause = "";
        if($gender === "male" || $gender === "female") $genderClause = " AND gender = '". $gender . "' ";

        $query = query("
            SELECT  name 
            FROM    names  
            WHERE   race = '" . $nameType . "'" . $genderClause . "
            ORDER BY RAND() LIMIT 1;
            " ) ;

        confirm($query);
        $row = mysqli_fetch_array($query) ;

        return $row['name'] ;
}


function getSurname($gender, $race) {

    $nameType = 'human';
    if(isset($race->nameType)) $nameType = $race->nameType;
    $addSurname = 0;
    if(isset($race->addSurname)) $addSurname = intval($race->addSurname);

    // addSurname is now a number between 0 and 100
    // and it indicates the chance this character has to have a surname
    // 20220506 - removed --- gender = '". $gender . "' and --- why do surnames have genders?
    if(rand(1,100)<$addSurname) {
        $query = query("
            SELECT  surname 
            FROM    surnames  
            WHERE race = '" . $nameType . "' 
            ORDER BY RAND() LIMIT 1;
            " ) ;

        confirm($query);
        $row = mysqli_fetch_array($query) ;

        return $row['surname'] ;
    }

    return '' ;
}



function getClass($game = null, $class = null) {
        
    $classObject = "" ;
    $queryselector = "" ;

    // empty strings are now null
    $userid = isset($_SESSION['id'])? intval($_SESSION['id']) : null ;
    $game   = $game? $game : null;
    $class  = $class? intval($class) : null;

    $conn  = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($conn,'utf8');

    $stmt = $conn->prepare("
        SELECT  object, id, JSON_UNQUOTE(JSON_EXTRACT(object, '$.name')) AS name
        FROM    classes
        WHERE   1=1
            AND (game = IFNULL(?,'5e'))
            AND (id   = IFNULL(?,id))
            AND (userid = 0 OR (userid = IFNULL(?,0)))
            AND  trashed = 0
            AND JSON_CONTAINS(`object`,'\"1\"', '$.\"enableGenerator\"')
        ORDER BY RAND() LIMIT 1;
        ");

    $stmt->bind_param('sii',$game,$class,$userid);

    if(!$stmt->execute()) { echo "Error: could not retrieve the class requested"; exit(); }

    $result = $stmt->get_result();
    $row    = $result->fetch_assoc();
    if(!isset($row["object"])) return null;
    $classObject = json_decode($row["object"]);
    $classObject->id = $row["id"];

    return $classObject ;
}

function getClassVariant($class,$variant = null) {
    if(!$class) return null;

    $class       = isset($class->id)?    intval($class->id)    : null;
    $variant    = $variant? $variant : null;

    $conn  = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    mysqli_set_charset($conn,'utf8');

    $stmt = $conn->prepare("
        SELECT object
        FROM classvariants
        WHERE classid = ?
            AND (name   = IFNULL(?,name))
        ORDER BY RAND() LIMIT 1;
        ");

    $stmt->bind_param('is',$class,$variant);

    if(!$stmt->execute()) { echo "Error: could not retrieve the class variant requested"; exit(); }

    $result = $stmt->get_result();
    $row    = $result->fetch_assoc();

    if(isset($row["object"])) {
        return json_decode($row["object"]);
    }
    else return null;
}




function getProfession() {
    $query = query("
        SELECT  * 
        FROM    professions 
        ORDER BY RAND() 
        LIMIT 1;
        ") ;
    
    confirm($query);
    $result = mysqli_fetch_array($query) ;
    $profession = json_decode($result["object"]);

    return $profession;
}



function getTrait() {
    $query = query("
        SELECT  * 
        FROM    traits 
        WHERE   feeling = 0 
        ORDER BY RAND() LIMIT 1 ;
        ") ;
        
    confirm($query);
    $row = mysqli_fetch_array($query) ;
    return $row ;
}


function getFeeling() {
    $query = query("
        SELECT  * 
        FROM    traits 
        WHERE   feeling = 1 
        ORDER BY RAND() LIMIT 1 ;
        ") ;
        
    confirm($query);
    $row = mysqli_fetch_array($query) ;
    return $row ;
}


function getAlignment($traitCategory) {

    $goodness   = 0.0 ;
    $lawfulness = 0.0 ;
    //Alignment is dependent on the character's defining trait
    //Traits are divided in categories, which may influence how good, evil,
    //lawful or chaotic a character is
    switch ($traitCategory) {
        case "bad":         $goodness   = $goodness   - 0.5;    break;
        case "weird":                                           break;
        case "evil": ;      $goodness   = $goodness   - 1.0;    break;
        case "submissive":  $lawfulness = $lawfulness + 0.5;    break;
        case "successful":                                      break;
        case "strong":                                          break;
        case "weak":                                            break;
        case "good":        $goodness   = $goodness   + 1.0;    break;
        case "traumatized": $goodness   = $goodness   + 0.5;    break;
        case "intelligent":                                     break;
        case "stupid":                                          break;
        case "seductive":   $lawfulness = $lawfulness - 0.5;    break;
        case "lawful":      $lawfulness = $lawfulness + 1.0;    break;
        case "chaotic":     $lawfulness = $lawfulness - 1.0;    break;
        default:                                                break; 
    }

    $alignment = array(strval($lawfulness),strval($goodness));
    $JSON = json_encode($alignment);
    return $JSON ;
     
}



function getQuirk($quirkOption) {
    if ($quirkOption == 'sometimes') { (rand(1,20)==20 ? $quirkOption = 'yes' : $quirkOption = 'no' ); }
    if ($quirkOption == 'yes') {
        $newline = 1 ;
        $query = query("
            SELECT  quirk 
            FROM    quirks 
            ORDER BY RAND() 
            LIMIT 1;
            ") ;
        
        confirm($query);
        $row = mysqli_fetch_array($query) ;
        $string = $string . $row['quirk'] . ' ' ;           
    }
}


function getBackground($gender) {

    $query = query("
        SELECT  background 
        FROM    backgrounds 
        ORDER BY RAND() 
        LIMIT 1;"
        );
    
    confirm($query);
    $row = mysqli_fetch_array($query) ;
    
    return setGender($row['background'], $gender);
}


function getSkill($game, $gender) {
    $skill = "" ;
    $query = query("
        SELECT  name 
        FROM    skills 
        WHERE   game = '" . $game . "' 
        ORDER BY RAND() 
        LIMIT 1;"
        );
    
    confirm($query);
    $row = mysqli_fetch_array($query) ;
    
    $skill = setGender($row['name'], $gender) ;
    return $skill;
}


function getLair($gender, $lairOption) {
    $lair = "" ;

    if ($lairOption == 'sometimes') { (rand(1,20)==20 ? $lairOption = 'yes' : $lairOption = 'no' ); }
        if ($lairOption == 'yes') {   
            ($gender=='male' ? $lair = "He" : $lair = "She" )  ;      
            $query = query("
                SELECT  value 
                FROM    bases 
                where   part = 'where' 
                ORDER BY RAND() 
                LIMIT 1;"
                );
            
            confirm($query);
            $row = mysqli_fetch_array($query) ;
            $lair = $lair . " lives in " . $row['value'] . " that" ;
            
            (rand(0,1)==1 ? $lair = $lair . " is " : $lair = $lair . " was " )  ;   
            $query = query("
                SELECT  value 
                FROM    bases 
                WHERE   part = 'what' 
                ORDER BY RAND() 
                LIMIT 1;"
                );
            
            confirm($query);
            $row = mysqli_fetch_array($query) ;                       
            
            $lair = $lair . $row['value'] . " " ;
            
            $query = query("
                SELECT  value 
                FROM    bases 
                WHERE   part = 'who' 
                ORDER BY RAND() 
                LIMIT 1;"
                );
            
            confirm($query);
            $row = mysqli_fetch_array($query) ;                       
            $lair = $lair . $row['value'] . "." ;
        }
}

function getVoice($voiceOption) {
    
    $voice = "" ;
    if ($voiceOption == 'true') {
        $query = query("
            SELECT  voice 
            FROM    voices 
            ORDER BY RAND() 
            LIMIT 1;"
            );
        
        confirm($query);
        $row = mysqli_fetch_array($query) ;
        $voice = $row['voice'] ;
    }
    return $voice ;
}





?>
