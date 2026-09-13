import { AmmaOperatingState, DaemonInterrupt, DaemonType } from '../types';

export interface CommandResult {
  stress: number;
  state: AmmaOperatingState;
  ammaDialogue: string;
  englishTranslation?: string;
  systemLogs: string[];
  isGuiltTrip?: boolean;
  guiltTripText?: string;
  suggestedCommands: string[];
}

export const DAEMON_INTERRUPTS: Record<DaemonType, DaemonInterrupt> = {
  'MAZHA.EXE': {
    id: 'int_mazha',
    type: 'MAZHA.EXE',
    title: 'CRITICAL INTERRUPT: MAZHA.EXE DETECTED',
    description: 'Black clouds over Tharavadu! Kooriruttu on eastern sky. Heavy washing cycle on terrace drying line.',
    urgency: 'CRITICAL',
    countdownSeconds: 25,
    initialStressBump: 25,
    failureStressBump: 35,
    successStressDrop: 20,
    primaryAction: 'thuni --fetch',
    secondaryAction: 'rain --ignore',
    dialogueTrigger: 'Mazha kaaruthu! Kande kooduthal cloud terrace-il varunnu! Ente kalyana pattu-saree nananjal njan ninte phone kinaril idum!'
  },
  'KSEB_TRIP': {
    id: 'int_kseb',
    type: 'KSEB_TRIP',
    title: 'SYSTEM HARDWARE ALERT: KSEB_TRIP DETECTED',
    description: 'Line voltage dropped to 0V. Inverter relay screaming. Amma immediately identifies phone charger as cause.',
    urgency: 'MEDIUM',
    countdownSeconds: 30,
    initialStressBump: 20,
    failureStressBump: 25,
    successStressDrop: 15,
    primaryAction: 'kseb --fuse-check',
    secondaryAction: 'phone --unplug',
    dialogueTrigger: 'Current poyo? Athu ninte aa chintha-shakthi illatha phone charge cheythu vechirikkunnath kondaanu! Whole feeder trip aayi!'
  },
  'GUEST_RADAR': {
    id: 'int_guest',
    type: 'GUEST_RADAR',
    title: 'PERIPHERAL RADAR: SUKUMARAN AMMAVAN AT SIT-OUT',
    description: 'Bajaj Chetak scooter sound heard at gate. Nosy relative incoming to question your salary and marriage prospects.',
    urgency: 'HIGH',
    countdownSeconds: 20,
    initialStressBump: 30,
    failureStressBump: 30,
    successStressDrop: 25,
    primaryAction: 'sitout --greet --tea',
    secondaryAction: 'bedroom --lock --hide',
    dialogueTrigger: 'Ayyoo Sukumaran Ammavan vannallo! Chekkan ivide lungi uduthu phone-il nokki irikkunnu! Odi poyi nalla shirt ittu sit-out-il nillada!'
  },
  'TUPPERWARE_INTEGRITY': {
    id: 'int_tupperware',
    type: 'TUPPERWARE_INTEGRITY',
    title: 'FILESYSTEM CORRUPTION: MISSING TUPPERWARE AUDIT',
    description: 'Catastrophic integrity failure. 2004 Dubai Gulf-imported yellow airtight Milton container missing.',
    urgency: 'CATASTROPHIC',
    countdownSeconds: 35,
    initialStressBump: 35,
    failureStressBump: 40,
    successStressDrop: 30,
    primaryAction: 'find --bottle --location:SHAJI_HOUSE',
    secondaryAction: 'tupperware --confess --lost',
    dialogueTrigger: 'Ente manja Tupperware bottle evide?! Ninte achan 15 kollam munpe Gulf-il ninnu vangi thannathaanu! Athu Shaji-kk kondu kodutho?!'
  },
  'CHAYA_PIPELINE': {
    id: 'int_chaya',
    type: 'CHAYA_PIPELINE',
    title: 'CRON PROTOCOL: 4:00 PM CHAYA & SNACK PIPELINE',
    description: 'Cardamom black tea boiling on gas stove. Parippuvada and Pazham Pori batch in danger of cooling down.',
    urgency: 'LOW',
    countdownSeconds: 40,
    initialStressBump: 10,
    failureStressBump: 20,
    successStressDrop: 20,
    primaryAction: 'chaya --accept --sugar:less',
    secondaryAction: 'tea --reject --say:later',
    dialogueTrigger: 'Chaya aayeda! Naalu mani aayille? Iniyum aa dabba computer-il thanne kuthi irikkumo? Choodode kudippikkan ivide servant aarum illa!'
  }
};

export function determineAmmaState(stress: number): AmmaOperatingState {
  if (stress >= 98) return 'MARTYR_MODE';
  if (stress >= 75) return 'PREEMPTIVE_PANIC';
  if (stress >= 40) return 'SUSPICIOUS_SCAN';
  return 'CALM_CHAYA';
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

interface DialoguePair {
  malayalam: string;
  english: string;
}

// Extensive randomized dialogue pools capturing the authentic Kerala Mallu Mom experience
const TEA_BREW_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Aha, chaya thappi vannaallo! Sugar korachittu oru strong elakka chaya tharaam. Pakshe kudichittu aa glass sink-il ittu vekkanam, table-il vechu pokaruthu!",
    english: "Look who came begging for tea! I'll make a strong cardamom tea with less sugar. But remember to wash the glass or put it in the sink, don't abandon it on the desk!"
  },
  {
    malayalam: "Chaya venam ennu parayaan oru madiyum illa! Oru naal ee adukkalayil njan kidannu kashtapedunnath aara kandath? Choodode kudi, pinne aa flask adachu vekku!",
    english: "No hesitation when asking for tea! Does anyone notice me toiling away in this kitchen all day? Drink it hot and tighten the lid on the hot-water flask!"
  },
  {
    malayalam: "Kannan Devan tea dust thottaa mathram ivante mukhath oru thelicham! Ninte achan vannaal parayam monu chaya undakki koduthathine patti. Kudichittu poyi PSC book eduthu vekku!",
    english: "Only Kannan Devan tea dust brings a smile to your face! I'll tell your father how I pamper you with fresh tea. Finish it and open that Kerala PSC book!"
  },
  {
    malayalam: "Kudi chaya! Pazham pori choodode undakki vechirunnu, nee varaan thamasichittu aari poyi! Ee veettil samayathinu oru kaaryam nadakko? Kudichittu poi bedsheet onnu thetti virikku!",
    english: "Drink your tea! The banana fritters were hot and crispy, but because of your delay they went cold! Can anything happen on time in this house? Go straighten your bedsheet afterwards!"
  },
  {
    malayalam: "Oru glass chaya kudikkaan engineering degree venamennu paranjathu aara? Chaya tharam, pakshe adukkalayil unwashed glass-inte oru malathundu undu, athokke aaru thekkum?",
    english: "Who said an engineering degree is needed to drink tea? I will give you tea, but there is a mountain of unwashed glasses in the kitchen sink—who is going to scrub them?"
  },
  {
    malayalam: "Chaya tharunnathil enikku vishamamilla. Pakshe kudichu kazhinjaal oru 'Nandi Amma' ennu polum illa! Achanodu parayam iniyum chaya venamengil swanthamayi adukkalayil poyi paalu thilappikkan!",
    english: "I have no problem serving tea. But after drinking, not even a single 'Thank you Amma'! I will tell your father that next time you can boil the milk yourself in the kitchen!"
  }
];

const PHONE_HIDE_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Appadi! Ippo phone maatti vekkan thonniyallo! Kanneerinte vilappam kettu Daivam ninte thalayil valla budhiyum itto? Ini poi aa table-le pusthakangal onnu adukki vekku!",
    english: "Finally! Good sense prevailed and you put the smartphone away! Did God hear my prayers and grant you some wisdom? Now go arrange the dusty textbooks on your study table!"
  },
  {
    malayalam: "Phone pillow-inte adiyil thirukki vechirikkunnath kandilla ennu karuthiya? Aa screen glow purathekku varunnundu! Oru divasam njan athu eduthu kinaril eriyum!",
    english: "Did you think I didn't see you stuffing the phone under the pillow? The screen glow is visible from here! One of these days I will march over and fling it into the water well!"
  },
  {
    malayalam: "Athu nallath! Kannu thallichu 24 manikkoorum reels nokki irunnal kazhuthinu spondylosis varum ennu doctor paranjath kettille? Poyi oru glass chooduvellam kudi!",
    english: "Wise decision! Staring bug-eyed at Instagram reels 24 hours a day causes cervical spondylosis, just like the doctor warned! Go drink a glass of warm water!"
  },
  {
    malayalam: "Ippo phone lock cheythu madiyil vechu nalla pillayaayi irikkunnu. Achan varumbozhum ithu pole irunnal maanam povaathe njan rakshapedum!",
    english: "Now you lock the phone, place it on your lap, and pretend to be an innocent child. If you maintain this good behavior when your father arrives, family dignity will be saved!"
  },
  {
    malayalam: "Phone maatti vechath kond mathram aayilla, manassil ulla PUBG chinthakal koodi ozhivakku! Poyi sit-out-le chedikalkku vellam ozhikkeda!",
    english: "Locking the phone is not enough; clear your mind of gaming distractions too! Go pour water for the potted plants in the sit-out veranda!"
  }
];

const STUDY_PSC_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Eeshwara! Oru varshathinu shesham pusthakam thurannu! Ithu kandaal njan oru 101 thenga odakkam Guruvayooril! Rank list-il ninte peru kaanumo entho?",
    english: "Praise the Lord! You opened a textbook after an entire year! I should break 101 coconuts at the Guruvayur temple in gratitude! Will your name finally appear on the PSC Rank List?"
  },
  {
    malayalam: "Pusthakam munnil vechu swapnam kaanuka aano? Aadyam General Knowledge thurakku! Ninte cousin Santhosh bank test ezhuthi ippo SBI-il officer aayi, nee ivide mouse click cheyyunnu!",
    english: "Are you daydreaming with the book open? Start with General Knowledge! Your cousin Santhosh cleared the bank test and is now an SBI officer, while you just click a computer mouse here!"
  },
  {
    malayalam: "Study cheyyunnu ennu kaanichu munnil pusthakavum ullil cinema song-um aano? Chodikkana oru question-u uthram tharan kazhiyo ninakku? Poyi Constitution Articles padikku!",
    english: "You keep the book open for show while humming film songs in your head! Can you answer a single question if I test you? Go memorize Indian Constitution articles!"
  },
  {
    malayalam: "Ninte prayathil njan mannayenna vilakkil irunnaa padichathu! Ivide AC-yum computer-um vangi thannittum PSC syllabus kandu vithumbunnu! Cheruppam nannayal bhavi nannavum!",
    english: "At your age, I studied under the dim glow of a kerosene lantern! You have an AC room and a computer, yet you tremble at the syllabus! Discipline in youth secures the future!"
  }
];

const THUNI_FETCH_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Odi poyi eduthond vannallo, athu bhagyam! Oru randu second koode thamasichirunnel ninte kalyana-pattu saree nananju kulichene. Dasa, namukku ee budhi nerathe thonnathathu entha?",
    english: "Thank goodness you sprinted up and brought the clothes! Two seconds later, my wedding silk saree would have been drenched. Dasa, why didn't this common sense strike us earlier?"
  },
  {
    malayalam: "Terrace-il poyi nokkiyappol mazhavellam thulliyaayi veenu thudangiyirunnu! Nalla kaaryam ippozhengilum manassilayi. Nananja mundokke fan-te thazhe idu!",
    english: "Monsoon raindrops were already pelting the terrace! At least your survival instincts kicked in. Spread the slightly damp dhotis under the bedroom ceiling fan!"
  },
  {
    malayalam: "Thuni eduthu kondu vannathukondu njan ninte thalayil adichilla! Pakshe clip-ukal ellaam bucket-il thirichu itto atho terrace-il thanne erinjo?",
    english: "I won't scold you because you brought the laundry in. But did you put the cloth-pegs back into the plastic bucket, or did you scatter them across the terrace floor?"
  },
  {
    malayalam: "Kothambum nananja thuniyum ivante kaiyyil tharande vannilla! Odi chaadi poyathukondu kaal thetti veenilla ennu vijaarichu aashwasikkam. Nalla kutti!",
    english: "I didn't have to carry soaking wet clothes on my head! You ran so fast you could have slipped on the wet moss. I am relieved, you did well!"
  }
];

const CLEAN_ROOM_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Aaha! Bedroom kandittu ippo oru manushyanu keraan kollam! Athuvare oru akri-kada pole aayirunnu, charger wire-um chaddi-yum ellaam tharayil!",
    english: "Aha! The bedroom finally looks fit for a human being to step inside! Until now it resembled a scrap metal scrapyard with charger cords and tangled clothes on the floor!"
  },
  {
    malayalam: "Bedsheet thட்டி viricha? Table-le dabba-kal matyo? Ithu oru 10 minute koodi ithupole nilkkuvo entho! Pakshe ippozhathekku njan sammathichu.",
    english: "Did you dust and straighten the bedsheet? Cleared the junk boxes from the study desk? I wonder if it will stay tidy for more than 10 minutes! But for now, you pass."
  },
  {
    malayalam: "Njan 20 pravashyam paranjittaanu ee sweeping nadannath! Ennalum parayam, room nannaayi. Poyi adukkala sink-le paathram koodi onnu nokkikkode?",
    english: "It took 20 reminders for you to pick up the broom! Still, credit where credit is due, the room looks neat. Now why not inspect the dishes in the kitchen sink as well?"
  },
  {
    malayalam: "Ippo computer table-il oru thelicham vannu. Ithupole eppozhum vechirunnel ninte achan daily ninne vazhakku parayilla aayirunnu!",
    english: "There is finally breathing room on your computer desk. If you kept it like this every day, your father wouldn't lecture you every evening!"
  }
];

const BOTTLE_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Shaji-de kayyil ninnu Tupperware thirichu vangiyo? Adappu undo? Njan nokkatte... Haa, original seal undu! Bhagyam, ninte jeevan thirichu kitti!",
    english: "Did you retrieve the Tupperware from Shaji? Is the airtight lid intact? Let me inspect... yes, the seal is original! Lucky you, your life is spared!"
  },
  {
    malayalam: "Ente manja Milton bottle! Ninte achan Dubai-il ninnu kashtappattu kondu vannathaanu. Ini aarkkelum koduthaal njan ninte phone vangi vekkum!",
    english: "My precious yellow Milton bottle! Your father brought that back with great effort from Dubai. If you lend it out to friends again, I will confiscate your smartphone!"
  },
  {
    malayalam: "Kandupidichallo! Evide aayirunnu? Kattilinadiyil thirukki vechirikkukayarnno? Ippo thanne athil chooduvellam ozhichu rinse cheythu vekku!",
    english: "You found it! Where was it hiding? Stuffed under the bed frame? Pour warm water and rinse it thoroughly right now before putting it away in the cupboard!"
  }
];

const GLASS_WASH_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Oru glass kazhuki vekkaan ippozhaano thonniyathu? Sabena ittu thecha? Sink-le vellam poya pipe block aakkathe nokkanam!",
    english: "Did you finally decide to wash your tea glass? Did you scrub it with soap? Make sure food particles don't clog the kitchen drain pipe!"
  },
  {
    malayalam: "Glass kazhuki counter-il kizhangu pole vekkathe kavizhthi vekkeda! Ennalum oru glass enkilum kazhukiyallo, njan aashwasikkunnu.",
    english: "Don't leave the washed glass right-side up like a potato, turn it upside down on the drying rack! Still, washing even one glass is a welcome relief."
  },
  {
    malayalam: "Sink clean aakkiya? Glass kazhuki vechath kandu njan mayangi veezhum ennu thonni! Ingane nalla sheelangal thudarnnaal nallath!",
    english: "Cleaned the sink area? Seeing you wash a glass almost made me faint from surprise! If you keep cultivating such rare habits, that would be wonderful!"
  }
];

const SNACK_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Parippuvada choodode eduthu vechirunnu! Choodaruvaan thudangiyirunnu. Thinnu, pakshe crumbs tharayil ittaal kooduthal cheetha kelkkum!",
    english: "I had hot crunchy parippuvada ready! It was starting to lose its heat. Eat, but if you drop greasy crumbs on the clean floor, prepare for an earful!"
  },
  {
    malayalam: "Pazham pori thinnan oru madiyum illa! Adukkalayilekku varaan choodu snacks venam! Thinnittu poyi dining table thudakku!",
    english: "Zero hesitation when it comes to eating banana fritters! You only visit the kitchen when hot snacks are frying! Finish eating and wipe the table!"
  },
  {
    malayalam: "Tea kadayil ninnu vangi thannathalla, njan swanthamayi cheythathaanu! Kooduthal kazhichittu stomach upset aayi ennu parayaruthu!",
    english: "This isn't bought from a roadside tea stall, I made it with fresh oil! Don't overeat and complain about stomach issues later!"
  }
];

const KSEB_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Fuse keri kattiya? Inverter screaming ninnu! Ennalum njan parayam, aa charger-um gaming computer-um aanu whole street trip aakkiyath!",
    english: "Did you climb up and wire the fuse? The inverter alarm finally shut up! Still, mark my words: your heavy charger and gaming setup brought down the entire street's line!"
  },
  {
    malayalam: "Current vannu! Fan thiriyan thudangi. Ippo thanne phone charging kutharuthu, voltage sthiram aakatte! Ente mixie koodi odikkan ullathaanu!",
    english: "Power is back! The ceiling fan is spinning. Don't immediately plug your phone in, wait for the line voltage to stabilize! I have coconut chutney to grind in the mixer!"
  },
  {
    malayalam: "Fuse-carrier shariyayi fix cheytho? Kaiyyil vellam thodathe cheythathaanennu karuthunnu. Ninte achan illatha samayathu ithokke aara nokkunne?",
    english: "Did you seat the porcelain fuse carrier securely? I hope you dried your hands beforehand! Who takes care of these emergencies when your father is away at work?"
  }
];

const APOLOGIZE_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Kshama chodichaal theerunna thettano ithu? Njan 30 varshamayi ee veettil ninnu karayunnu! Pakshe saramilla, nalla kuttiyaayi poyi padikku.",
    english: "Can a simple apology undo this grief? I have sacrificed 30 years in this house! But never mind, be a good boy and go study without making excuses."
  },
  {
    malayalam: "Aha, kannil ninnu kanneer vannallo! Njan parayunnath ninte nallathinanu mone. Poyi oru vaazha-kkai porichu vechirunnu, eduthu thinnu.",
    english: "Oh, real tears in your eyes! Everything I say is for your own future, my child. Go to the kitchen, I fried some raw plantain chips for you."
  },
  {
    malayalam: "Kshama paranjathu kondu mathram aayilla, naale muthal raavile 6 manikku unaranam! Phone switch off cheythu padikkan irikkanam!",
    english: "Saying sorry isn't enough; from tomorrow you wake up at 6:00 AM sharp! Switch off that phone and sit down with your books!"
  }
];

const REBOOT_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Double milk cardamom tea undakki munnil vechal njan ellaam marakkum ennu karuthiyo? ...Ennalum chaya kollam, cardamom manam nannayirikkunnu. Stress kuranju.",
    english: "Did you think serving double milk cardamom tea would make me forget everything? ...Still, the tea is fragrant and soothing. My blood pressure has cooled down."
  },
  {
    malayalam: "Bribe aano? Ammaye chaya koduthu valakkan nokkunno? ...Choodode kudippichathukondu ee pravashyathinu njan vittu. Ini aavarthikkaruthu!",
    english: "A bribe, is it? Trying to appease your mother with hot tea? ...Because you served it steaming hot, I will let you off this once. Never repeat your laziness!"
  },
  {
    malayalam: "System reboot cheythaal ninte laziness reboot aakumo? Ennalum chaya nalla choodundu. Njan sit-out-il irunnu kudikkam, nee poyi padikku.",
    english: "Will rebooting this machine reboot your lazy habits too? Anyway, the tea has great flavor. I will enjoy it on the veranda; you get back to your studies."
  }
];

const UNKNOWN_DIALOGUES: DialoguePair[] = [
  {
    malayalam: "Entheda ithu? Terminal-il enthelum type cheythal amma pedikkum ennu karuthiyo? Poyi valla kaaryamulla pani cheyyeda!",
    english: "What on earth is this? Did you think typing gibberish on a black terminal would intimidate your mother? Go do something productive around the house!"
  },
  {
    malayalam: "English-il entho type cheythu kaanikkunnu! Ithu kandu njan aashcharyapedum enno? Oru glass vellam eduthu kudikkaan ariyilla, valiya hacker aano nee?",
    english: "Showing off with cryptic English typing! Did you expect me to be amazed? You can't even fetch a glass of water on your own, are you acting like a master hacker?"
  },
  {
    malayalam: "Ithu ninte Linux tricks aano? Ammade munnil ee syntax onnum nadakkilla! Poyi bed virikku!",
    english: "Is this one of your fancy Linux tricks? None of this syntax works on your mother! Go straighten your bedsheets!"
  },
  {
    malayalam: "Dasa, ivan entha ee kaanikkunne? Ente thala pukaathirikkan poyi oru choodu chaya konduvaa!",
    english: "Dasa, what is he even doing? Before my head explodes with a migraine, bring me a cup of hot tea!"
  },
  {
    malayalam: "Ninte ee typing kaanumbol thanne enikku gas trouble varunnu! Shariyaaya command ezhuthu, allenkil phone eduthu kinaril idum!",
    english: "Watching your relentless keyboard clatter gives me acidity and gas trouble! Type a proper household command, or the smartphone goes into the well!"
  },
  {
    malayalam: "Achan varatte, njan kaanichu tharaam ninte ee 'Coding'! Oru bulb maaridenda samayathu computeril keri thappunnu!",
    english: "Wait till your father gets home, I will showcase your 'Coding' accomplishments! When a fused bulb needs replacement, you hide behind a keyboard!"
  }
];

const MARTYR_MONOLOGUES: string[] = [
  "Ningal aarum oru sahayam cheyyanda! Njan ivide kidannu thulanj potte! Naale njan illathe aavumbol manassilaakum ee ammade vila!",
  "Ente shavam kandaale ningal randinum samadhanam aavu! Oru glass chaya choodode chodichathinu ivante kali kando!",
  "Ninte achan varatte, 30 varshathe kanakkokke njan innu theerkkum! Oru Tupperware bottle polum samrakshikkan ariyatha thala-thericha kootam!",
  "Aarum ennodu mindenda! Njan adukkalayil poyi kathaadachu kidakkum! Vishannu karanjalum njan innu choru vekkilla!",
  "Refusing all human assistance! Ningal aarum oru sahayam cheyyanda! Njan thanne ivide theernnu poykkolam!"
];

export function generateLocalResponse(
  rawCmd: string,
  currentStress: number,
  activeInterrupt?: DaemonInterrupt | null
): CommandResult {
  const cmd = rawCmd.trim().toLowerCase();
  let newStress = currentStress;
  let dialoguePair: DialoguePair;
  let logs: string[] = [];
  let isGuiltTrip = false;
  let guiltTripText = '';
  let suggested: string[] = [];

  // 1. Check if user is handling an active interrupt
  if (activeInterrupt) {
    if (activeInterrupt.type === 'MAZHA.EXE') {
      if (cmd.includes('thuni') && (cmd.includes('fetch') || cmd.includes('collect') || cmd.includes('run') || cmd.includes('bring'))) {
        newStress = Math.max(15, currentStress - activeInterrupt.successStressDrop);
        dialoguePair = pickRandom(THUNI_FETCH_DIALOGUES);
        logs = [
          "INTERRUPT: MAZHA.EXE resolved successfully.",
          "TERRACE_LINE: 14 garments retrieved safely (dryness index 94%).",
          "KERNEL: Stress level reduced to safe operating limits."
        ];
        suggested = ["tea --brew", "clean --room --fast", "study --psc"];
      } else {
        newStress = Math.min(100, currentStress + activeInterrupt.failureStressBump);
        dialoguePair = {
          malayalam: "Thuni nanamo illayo ennu nokkan polum ivanu samayam illa! Phone-il oru thumb swipe cheythal ellaam aayallo! Achan varatte, terrace-ile kothambum nananja mundum ninte thalayil idum!",
          english: "You don't even have a moment to check if drying clothes are getting soaked! You think a thumb swipe on your phone fixes the world? Just wait till your father arrives!"
        };
        logs = [
          "INTERRUPT_FAILURE: MAZHA.EXE timed out or rejected.",
          "DAMAGE_REPORT: 6 shirts, 2 sarees drenched in monsoon downpour.",
          "CRITICAL: Amma blood pressure gauge spiking +35%."
        ];
        suggested = ["apologize --promise:study", "thuni --fetch", "reboot --tea-bribe --calm"];
      }
      const state = determineAmmaState(newStress);
      return { 
        stress: newStress, 
        state, 
        ammaDialogue: dialoguePair.malayalam, 
        englishTranslation: dialoguePair.english,
        systemLogs: logs, 
        suggestedCommands: suggested 
      };
    }

    if (activeInterrupt.type === 'KSEB_TRIP') {
      if (cmd.includes('kseb') || cmd.includes('fuse') || cmd.includes('unplug') || cmd.includes('power')) {
        newStress = Math.max(20, currentStress - activeInterrupt.successStressDrop);
        dialoguePair = pickRandom(KSEB_DIALOGUES);
        logs = [
          "DAEMON: KSEB_TRIP cleared.",
          "LINE_VOLTAGE: 230V restored on Tharavadu main grid.",
          "INVERTER: Battery standby resumed."
        ];
        suggested = ["phone --hide", "tea --brew", "clean --room --fast"];
      } else {
        newStress = Math.min(100, currentStress + activeInterrupt.failureStressBump);
        dialoguePair = {
          malayalam: "Dark aayathilum ivanu phone-inte light mathi! Kannerinjitt koodi WhatsApp status nokkikko! KSEB-kkarodu parayan ponu ivante room-ile line cut cheyyan!",
          english: "Even in total darkness all you need is your phone light! Even when your eyes burn, keep scrolling WhatsApp status! I will tell KSEB to cut the power to your room permanently!"
        };
        logs = [
          "KSEB_TRIP_UNRESOLVED: Inverter screaming low battery.",
          "ALLEGATION: Phone screen blamed for grid collapse."
        ];
        suggested = ["kseb --fuse-check", "phone --hide", "apologize --promise:study"];
      }
      const state = determineAmmaState(newStress);
      return { 
        stress: newStress, 
        state, 
        ammaDialogue: dialoguePair.malayalam, 
        englishTranslation: dialoguePair.english,
        systemLogs: logs, 
        suggestedCommands: suggested 
      };
    }

    if (activeInterrupt.type === 'GUEST_RADAR') {
      if (cmd.includes('sitout') || cmd.includes('greet') || cmd.includes('tea') || cmd.includes('ammavan')) {
        newStress = Math.max(25, currentStress - activeInterrupt.successStressDrop);
        dialoguePair = {
          malayalam: "Nalla chekkan aayi Sukumaran Ammavante munnil oru chiri thooki 'Sugamaano Ammava' ennu chodichu. Ammavan chodichu TCS-il joli undo ennu, njan parannju 'Valiya confidential project-il aanu' ennu! Njan thalliya thallu nee polum kettilla!",
          english: "Like an obedient child, you smiled and greeted Uncle Sukumaran: 'How are you, Uncle?'. He asked if you got placed at TCS, and I claimed you are on a confidential government project!"
        };
        logs = [
          "GUEST_RADAR: Sukumaran Ammavan appeased with Sulaimani tea.",
          "PREVENTED: Unsolicited 45-minute lecture on civil service exams."
        ];
        suggested = ["snack --parippuvada", "tea --brew", "study --psc"];
      } else {
        newStress = Math.min(100, currentStress + activeInterrupt.failureStressBump);
        dialoguePair = {
          malayalam: "Ammavan sit-out-il irikkumbol ivan room-il keri kathaadachu! Naattukaar enthu karuthum? 'Sheela-de monu valla mental case-um undo' ennu chodikkum Sukumaran! Ente maanam poyi!",
          english: "While Uncle sits in the front veranda, you bolted the bedroom door! What will society say? Uncle will ask if my son has gone crazy! Family reputation down the drain!"
        };
        logs = [
          "SOCIAL_FAIL: Guest neglected.",
          "RATING: Family pride down 85 points."
        ];
        suggested = ["sitout --greet --tea", "apologize --promise:study", "biscuit --goodday"];
      }
      const state = determineAmmaState(newStress);
      return { 
        stress: newStress, 
        state, 
        ammaDialogue: dialoguePair.malayalam, 
        englishTranslation: dialoguePair.english,
        systemLogs: logs, 
        suggestedCommands: suggested 
      };
    }

    if (activeInterrupt.type === 'TUPPERWARE_INTEGRITY') {
      if (cmd.includes('bottle') || cmd.includes('find') || cmd.includes('shaji') || cmd.includes('tupperware')) {
        newStress = Math.max(30, currentStress - 15);
        dialoguePair = pickRandom(BOTTLE_DIALOGUES);
        logs = [
          "TUPPERWARE_INTEGRITY: Search expedition dispatched to Shaji's house.",
          "FLAG: Milton Airtight Cap status CONFIRMED."
        ];
        suggested = ["glass --wash", "tea --brew", "clean --room --fast"];
      } else {
        newStress = Math.min(100, currentStress + 35);
        dialoguePair = {
          malayalam: "Kondu kalanju alle?! Athu 2004-il ninte Kochunni Ammavan Dubai-il ninnu air cargo vazhi kondu vanna Tupperware aanu! Athinte adappu polum ippo kittilla! Ente hridayam thakarunnu!",
          english: "You lost it, didn't you?! That was an authentic 2004 Tupperware shipped by air cargo from Dubai by Uncle Kochunni! You can't even buy that cap anymore! My heart is shattered!"
        };
        logs = [
          "CORRUPTION_FATAL: Tupperware lost permanently.",
          "STATUS: DEFCON 1 reached in Adukkala."
        ];
        suggested = ["find --bottle", "apologize --promise:study", "reboot --tea-bribe --calm"];
      }
      const state = determineAmmaState(newStress);
      return { 
        stress: newStress, 
        state, 
        ammaDialogue: dialoguePair.malayalam, 
        englishTranslation: dialoguePair.english,
        systemLogs: logs, 
        suggestedCommands: suggested 
      };
    }

    if (activeInterrupt.type === 'CHAYA_PIPELINE') {
      if (cmd.includes('chaya') || cmd.includes('accept') || cmd.includes('tea') || cmd.includes('drink')) {
        newStress = Math.max(15, currentStress - 15);
        dialoguePair = pickRandom(TEA_BREW_DIALOGUES);
        logs = [
          "CHAYA_PIPELINE: Tea served at optimal 78 degrees Celsius.",
          "SNACKS_CONSUMED: 2 Parippuvada, 1 Pazham Pori."
        ];
        suggested = ["glass --wash", "clean --room --fast", "study --psc"];
      } else {
        newStress = Math.min(95, currentStress + 20);
        dialoguePair = {
          malayalam: "Chaya vendaathavanu pinne entha vendathu? Zomato-il ninnu valla cold burger order cheyyan aano plan? Stomach poyi ICU-vil kidakkumbol njan paranjilla ennu parayaruthu!",
          english: "If you don't want homemade tea, what do you want? Planning to order cold burgers on Zomato? When you end up in the ICU with food poisoning, don't say I didn't warn you!"
        };
        logs = [
          "PIPELINE_REJECTION: Amma culinary offering turned down.",
          "SUSPICION: Fast food clandestine delivery suspected."
        ];
        suggested = ["tea --brew", "apologize --promise:study", "glass --wash"];
      }
      const state = determineAmmaState(newStress);
      return { 
        stress: newStress, 
        state, 
        ammaDialogue: dialoguePair.malayalam, 
        englishTranslation: dialoguePair.english,
        systemLogs: logs, 
        suggestedCommands: suggested 
      };
    }
  }

  // 2. Parse general CLI commands
  if (cmd.includes('tea') || cmd.includes('chaya') || cmd.includes('brew')) {
    newStress = Math.max(15, currentStress - 15);
    dialoguePair = pickRandom(TEA_BREW_DIALOGUES);
    logs = [
      "PROCESS: CHAYA_BREW [OK]",
      "INGREDIENTS: Kannan Devan Tea Dust, whole milk, crushed elaichi.",
      "DIRECTIVE: Glass must reach Adukkala sink within 10 minutes."
    ];
    suggested = ["glass --wash", "snack --parippuvada", "study --psc"];
  } else if (cmd.includes('phone') && (cmd.includes('hide') || cmd.includes('lock') || cmd.includes('keep') || cmd.includes('away'))) {
    newStress = Math.max(10, currentStress - 20);
    dialoguePair = pickRandom(PHONE_HIDE_DIALOGUES);
    logs = [
      "PHONE_DAEMON: Screen locked.",
      "OPTICAL_REST: Retinal exposure decreased.",
      "KERNEL: Amma approval rating +20%."
    ];
    suggested = ["study --psc", "clean --room --fast", "tea --brew"];
  } else if (cmd.includes('study') || cmd.includes('psc') || cmd.includes('book') || cmd.includes('padikkan') || cmd.includes('read')) {
    newStress = Math.max(10, currentStress - 25);
    dialoguePair = pickRandom(STUDY_PSC_DIALOGUES);
    logs = [
      "ACADEMIC_AUDIT: Kerala PSC Rank List study mode engaged.",
      "SUBJECT: Indian Constitution & Kerala History.",
      "KERNEL: Blood pressure normalizing rapidly."
    ];
    suggested = ["tea --brew", "snack --parippuvada", "plants --water"];
  } else if (cmd.includes('thuni') || cmd.includes('clothes') || cmd.includes('terrace') || cmd.includes('laundry')) {
    newStress = Math.max(15, currentStress - 20);
    dialoguePair = pickRandom(THUNI_FETCH_DIALOGUES);
    logs = [
      "CHORE_DISPATCH: Terrace drying line verified.",
      "STATUS: Laundry safely relocated indoors.",
      "MONSOON_DEFENSE: Success."
    ];
    suggested = ["clean --room --fast", "tea --brew", "phone --hide"];
  } else if (cmd.includes('clean') || cmd.includes('room') || cmd.includes('sweep') || cmd.includes('bed')) {
    newStress = Math.max(10, currentStress - 20);
    dialoguePair = pickRandom(CLEAN_ROOM_DIALOGUES);
    logs = [
      "CLEANUP_DAEMON: 4 dusty jeans folded.",
      "UNDER_BED_AUDIT: Suspicious pile minimized.",
      "HYGIENE_INDEX: Up from 12% to 75%."
    ];
    suggested = ["glass --wash", "tea --brew", "plants --water"];
  } else if (cmd.includes('bottle') || cmd.includes('tupperware') || cmd.includes('find')) {
    newStress = Math.max(20, currentStress - 15);
    dialoguePair = pickRandom(BOTTLE_DIALOGUES);
    logs = [
      "AUDIT_TRACE: Tracking Milton Bottle serial #TUPP-95-KL.",
      "STATUS: Yellow airtight container safe."
    ];
    suggested = ["glass --wash", "tea --brew", "study --psc"];
  } else if (cmd.includes('glass') || cmd.includes('wash') || cmd.includes('sink') || cmd.includes('dish')) {
    newStress = Math.max(10, currentStress - 15);
    dialoguePair = pickRandom(GLASS_WASH_DIALOGUES);
    logs = [
      "ADUKKALA_SINK: Cleaned with Sabena & Vim Bar.",
      "PIPELINE: Stainless steel glasses inverted on drying rack."
    ];
    suggested = ["tea --brew", "snack --parippuvada", "study --psc"];
  } else if (cmd.includes('snack') || cmd.includes('parippuvada') || cmd.includes('pazhampori') || cmd.includes('biscuit')) {
    newStress = Math.max(15, currentStress - 10);
    dialoguePair = pickRandom(SNACK_DIALOGUES);
    logs = [
      "CULINARY: Fresh snack batch served.",
      "CRISPINESS: 100% genuine coconut oil fry."
    ];
    suggested = ["tea --brew", "glass --wash", "clean --room --fast"];
  } else if (cmd.includes('kseb') || cmd.includes('fuse') || cmd.includes('inverter')) {
    newStress = Math.max(15, currentStress - 15);
    dialoguePair = pickRandom(KSEB_DIALOGUES);
    logs = [
      "POWER_SYSTEM: Rewired fuse wire.",
      "VOLTAGE: 230V clean AC power."
    ];
    suggested = ["phone --hide", "tea --brew", "study --psc"];
  } else if (cmd.includes('desktop') || cmd.includes('wallpaper') || cmd.includes('pattern') || cmd.includes('theme') || cmd.includes('bg')) {
    const isAngry = currentStress >= 90;
    dialoguePair = isAngry ? {
      malayalam: "Ente BP 90% kadannu poyi desktop motham chuvannu poyi kidakkunnu! Ennittum ivan desktop-il wallpaper maattunno? Ente nenju thakarkkan vendi oronnirangikkollum!",
      english: "My blood pressure blew past 90% and the desktop turned angry red! And you're still fiddling with desktop themes? You will literally be the end of me!"
    } : {
      malayalam: "Desktop kandille? Nalla shanthamaya #008080 Windows 95 teal colour! Chaya kudichu shanthamayi irikkumbozhe ee colour kaanu. Deshyam pidippichaal desktop chuvannu pokum kando!",
      english: "Notice the desktop? Authentic #008080 Windows 95 teal! You will only see this when I am calmly drinking tea. If you provoke me, the entire screen will turn furious angry red!"
    };
    logs = [
      `DESKTOP_ENGINE: State=${determineAmmaState(currentStress)}, Stress=${currentStress}%.`,
      isAngry ? "COLOR_PALETTE: ANGRY_RED (#800000) ACTIVE [STRESS > 90%]." : "COLOR_PALETTE: THARAVADU_TEAL (#008080) ACTIVE.",
      `DITHER_MASK: ${isAngry ? "CRITICAL_MATERNAL_ALERT" : "RETRO_50_WEAVE"}.`
    ];
    suggested = ["tea --brew", "study --psc", "clean --room --fast"];
  } else if (cmd.includes('achan') || cmd.includes('father')) {
    newStress = Math.max(15, currentStress - 30);
    dialoguePair = {
      malayalam: "Achanod parayippicho? Achan paranjathu kondu maathram njan onnum parayunnilla! Oru chaya koodi ittekaam, poyirunnu padikkan nokk!",
      english: "You made your father intervene? Only because Achan spoke on your behalf am I letting this go! I will make one more tea, now go and study!"
    };
    logs = [
      "ACHAN_FIREWALL: Paternal diplomatic immunity granted.",
      "BYPASS: Amma's anger suppressed via Achan's Manorama editorial reading.",
      "STRESS: Dropped by 30%."
    ];
    suggested = ["tea --brew", "study --psc", "clean --room --fast"];
  } else if (cmd.includes('saree') || cmd.includes('mazha_run') || cmd.includes('rescue')) {
    newStress = Math.max(15, currentStress - 25);
    dialoguePair = {
      malayalam: "Terrace-le thuni motham edutho? Kasavu saree nananjillallo! Nalla kaaryam. Ini kurachu neram shanthamayi irikkam.",
      english: "Retrieved all clothes from the terrace? The gold kasavu saree didn't get wet, right! Good job. Now we can have some peace for a while."
    };
    logs = [
      "TERRACE_DISPATCH: MAZHA_RUN.EXE executed successfully.",
      "LAUNDRY_STATUS: All garments dry in plastic basket.",
      "REWARD: Fresh Pazhampori queued."
    ];
    suggested = ["tea --brew", "clean --room --fast", "study --psc"];
  } else if (cmd.includes('kudumbam') || cmd.includes('whatsapp') || cmd.includes('family') || cmd.includes('forward')) {
    dialoguePair = {
      malayalam: "Kudumbam group-il Sukumaran Ammavan ayacha message kandille? NASA-de warning aanu! Oru reply polum kodukkathe phone-il game kalichondu irikkunno?",
      english: "Did you see the message Sukumaran Ammavan forwarded in the family group? It's a NASA warning! Staring at games without even replying with Pranams?"
    };
    logs = [
      "KUDUMBAM_95: 3 unread forwards in family group.",
      "AMMVAAN_WATCH: Waiting for respectful reply.",
      "STATUS: Blue ticks without reply will incur +18% penalty."
    ];
    suggested = ["study --psc", "tea --brew", "phone --hide"];
  } else if (cmd.includes('mixie') || cmd.includes('preethi') || cmd.includes('grind')) {
    dialoguePair = {
      malayalam: "KSEB current pokunnathinu munpu preethi mixie-yil thenga arachukko! Current poyaal ammiyil araykendi varum!",
      english: "Grind the coconut in the Preethi mixie before KSEB cuts power! Once power goes, you'll be grinding on the traditional stone slab!"
    };
    logs = [
      "APPLIANCE: Preethi 750W Mixie running at 18000 RPM.",
      "TASK: Coconut & green chilli paste ready for Moru curry."
    ];
    suggested = ["tea --brew", "kseb --fuse", "study --psc"];
  } else if (cmd.includes('cooker') || cmd.includes('whistle') || cmd.includes('prestige')) {
    dialoguePair = {
      malayalam: "Cooker 3 whistle adichu kando! Gas sim cheyyedo! Athu polum njan thanne vannu nokkanamo?",
      english: "Cooker whistled 3 times! Turn down the gas knob to sim! Do I have to walk over and check even that?"
    };
    logs = [
      "KITCHEN_TELEMETRY: Prestige 5L pressure cooker completed 3 whistles.",
      "GAS_STATUS: Simmer required to avoid burnt dal."
    ];
    suggested = ["tea --brew", "clean --room --fast", "study --psc"];
  } else if (cmd.includes('gate') || cmd.includes('sound') || cmd.includes('guest')) {
    dialoguePair = {
      malayalam: "Gate thurakkunna shabdham kettu! Aaraannu nokkiya? Sukumaran Ammavan aanengil sit-out-le chaya flask eduthu vekku!",
      english: "I heard the iron gate creak! Did you check who it is? If it is Sukumaran Ammavan, bring out the sit-out tea flask immediately!"
    };
    logs = [
      "SITOUT_RADAR: Acoustic gate creak detected at 12 meters.",
      "GUEST_SURVEILLANCE: Sukumaran Ammavan approaching."
    ];
    suggested = ["tea --brew", "phone --hide", "clean --room --fast"];
  } else if (cmd.includes('plants') || cmd.includes('water') || cmd.includes('thulasi')) {
    newStress = Math.max(15, currentStress - 15);
    dialoguePair = {
      malayalam: "Thulasi tharayil vellam ozhicho? Sit-out-le rose chediyil poovundonn nokkikko! Manushyanu shanthatha varanamenkil chedikalkku vellam ozhikkanam.",
      english: "Watered the holy thulasi pot? Check if the sit-out rose plant has blossomed! If a human wants true peace of mind, watering plants does wonders."
    };
    logs = [
      "BOTANICAL: Thulasi & Anthurium watered.",
      "NATURE_SCORE: Maternal tranquility restored."
    ];
    suggested = ["tea --brew", "study --psc", "clean --room --fast"];
  } else if (cmd.includes('apologize') || cmd.includes('sorry') || cmd.includes('repent')) {
    newStress = Math.max(15, currentStress - 20);
    dialoguePair = pickRandom(APOLOGIZE_DIALOGUES);
    logs = [
      "DIPLOMACY: Repentance accepted with traditional conditions.",
      "TERMS: 6:00 AM alarm required tomorrow."
    ];
    suggested = ["study --psc", "tea --brew", "clean --room --fast"];
  } else if (cmd.includes('reboot') || cmd.includes('restart') || cmd.includes('reset')) {
    newStress = 25;
    dialoguePair = pickRandom(REBOOT_DIALOGUES);
    logs = [
      "KERNEL: Soft reboot initialized with tea peace offering.",
      "AMMA_DAEMON: PID 0 re-attaching memory tables.",
      "STRESS_BASELINE: Reset to CALM_CHAYA 25%."
    ];
    suggested = ["tea --brew", "study --psc", "clean --room --fast"];
  } else if (cmd.includes('bsod') || cmd.includes('panic') || cmd.includes('crash')) {
    newStress = 100;
    isGuiltTrip = true;
    guiltTripText = pickRandom(MARTYR_MONOLOGUES);
    dialoguePair = {
      malayalam: guiltTripText,
      english: "Refusing all human assistance! Full rage lockout activated! None of you need to fetch me a glass of water, suffering alone is my eternal destiny!"
    };
    logs = [
      "FATAL: AMMA STRESS HIT 100% (MARTYR_MODE ENGAGED).",
      "BSOD: Blue Screen of Death triggered."
    ];
    suggested = ["reboot --tea-bribe --calm", "apologize --promise:study", "tea --brew"];
  } else {
    // Unknown or miscellaneous command
    newStress = Math.min(100, currentStress + 8);
    dialoguePair = pickRandom(UNKNOWN_DIALOGUES);
    logs = [
      `EXEC: '${rawCmd}' parsed as MATERNAL_DISAPPROVAL.`,
      "DIAGNOSTIC: Command unrecognized in Tharavadu household protocol."
    ];
    suggested = ["tea --brew", "thuni --fetch", "phone --hide"];
  }

  // Check for 100% stress threshold
  if (newStress >= 98) {
    newStress = 100;
    isGuiltTrip = true;
    guiltTripText = pickRandom(MARTYR_MONOLOGUES);
    dialoguePair = {
      malayalam: guiltTripText,
      english: "Amma Martyr Lockout: Refuses all help and reminds you that your father will hear about every single grievance when he steps through the front door."
    };
    logs.push("FATAL: AMMA STRESS HIT 100% (MARTYR_MODE ENGAGED).");
    logs.push("LOCKOUT: Passive-aggressive silent treatment enabled.");
    suggested = ["reboot --tea-bribe --calm", "apologize --promise:study", "tea --brew"];
  }

  const state = determineAmmaState(newStress);
  return {
    stress: newStress,
    state,
    ammaDialogue: dialoguePair.malayalam,
    englishTranslation: dialoguePair.english,
    systemLogs: logs,
    isGuiltTrip,
    guiltTripText,
    suggestedCommands: suggested
  };
}
