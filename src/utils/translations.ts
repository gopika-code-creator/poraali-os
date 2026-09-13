/**
 * English translations and cultural context helpers for Amma's Manglish dialogues.
 * Allows users of any background to fully appreciate the authentic humor.
 */

export function getEnglishTranslation(dialogue: string, cmd?: string): string {
  const text = dialogue.toLowerCase();

  if (text.includes('chaya thappi') || text.includes('elakka chaya') || text.includes('sugar korachittu')) {
    return 'English: "Look who came begging for tea! I\'ll make a strong cardamom tea with less sugar. But remember to put the empty glass in the kitchen sink, don\'t leave it sitting on the table!"';
  }

  if (text.includes('thuni') && (text.includes('odi poyi') || text.includes('dasa') || text.includes('bhagyam'))) {
    return 'English: "Good thing you ran and grabbed the clothes from the terrace! If you delayed two more seconds, the downpour would have soaked everything. Why didn\'t we get this common sense earlier?"';
  }

  if (text.includes('thuni nanamo') || text.includes('kothambum nananja mundum') || text.includes('mazha kaaruthu')) {
    return 'English: "You don\'t even have time to check if clothes are drying outside! You think one swipe on your phone solves everything? Wait till your father returns, I will drop the soaked dhotis on your head!"';
  }

  if (text.includes('fuse keri kattiya') || text.includes('inverter') || text.includes('pubg')) {
    return 'English: "Did you fix the fuse? The inverter alarm stopped. Still, let me tell you: it\'s because you play games and scroll Instagram 24 hours that the electricity substation grid collapses!"';
  }

  if (text.includes('sukumaran') || text.includes('ammavan') || text.includes('chiri thooki')) {
    return 'English: "Act like a good boy and smile in front of Uncle Sukumaran: \'Are you doing well, Uncle?\'. He asked if you got a software job, and I boasted you\'re working on a huge confidential project!"';
  }

  if (text.includes('shaji') || text.includes('tupperware') || text.includes('milton') || text.includes('manja')) {
    return 'English: "Where is my yellow Tupperware container?! Your father brought that genuine airtight box from the Gulf 15 years ago! Did you lend it to your friend Shaji? If it doesn\'t return, your pocket money is frozen!"';
  }

  if (text.includes('study') || text.includes('psc') || text.includes('padikkan') || text.includes('rank')) {
    return 'English: "At last, you opened a study book! If you put half the effort into the PSC Rank List that you put into your phone screen, you would have become a District Collector by now!"';
  }

  if (text.includes('phone') && (text.includes('kinaril') || text.includes('kinattil') || text.includes('aduppil'))) {
    return 'English: "Keep looking at that glowing screen! One of these days when you are asleep, I will take your smartphone and throw it straight down the backyard water well!"';
  }

  if (text.includes('ningal aarum') || text.includes('thulanj potte') || text.includes('sahayam cheyyanda')) {
    return 'English (Martyr Monologue): "None of you need to help me! Let me suffer and perish alone in this kitchen! I asked for a simple cup of tea at 4 PM and you just stare at your phone! Just wait till your father gets home!"';
  }

  if (text.includes('reboot cheythu') || text.includes('dabba computer')) {
    return 'English: "Oh, so you restarted the computer! If you reboot this junk machine, will your lazy habits change too? Go to the kitchen right now and put the steel flask away!"';
  }

  if (text.includes('room') || text.includes('clean') || text.includes('bedsheet')) {
    return 'English: "You finally cleaned the bedroom? It used to look like a hardware junkyard with cables and clothes everywhere. Keep it like this, don\'t mess it up again in 5 minutes!"';
  }

  // Generic fallback translation contextualizer
  if (cmd?.includes('tea')) {
    return 'English: Amma acknowledges the tea offering, reminding you that chores cannot be postponed forever.';
  }
  if (cmd?.includes('phone')) {
    return 'English: Amma expresses deep suspicion regarding your constant phone usage and unverified WhatsApp habits.';
  }
  if (cmd?.includes('study')) {
    return 'English: Amma approves of studying, but compares you unfavorably to a cousin who already has a government job.';
  }

  return 'English translation: Amma issues a sharp maternal assessment with classic domestic expectations.';
}
