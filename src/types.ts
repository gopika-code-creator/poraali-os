export type AmmaOperatingState = 
  | 'CALM_CHAYA'
  | 'SUSPICIOUS_SCAN'
  | 'PREEMPTIVE_PANIC'
  | 'MARTYR_MODE';

export type DaemonType = 
  | 'MAZHA.EXE'
  | 'KSEB_TRIP'
  | 'GUEST_RADAR'
  | 'TUPPERWARE_INTEGRITY'
  | 'CHAYA_PIPELINE';

export interface DaemonInterrupt {
  id: string;
  type: DaemonType;
  title: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
  countdownSeconds: number;
  initialStressBump: number;
  failureStressBump: number;
  successStressDrop: number;
  primaryAction: string;
  secondaryAction: string;
  dialogueTrigger: string;
}

export interface TerminalEntry {
  id: string;
  timestamp: string;
  clock: string;
  command?: string;
  isSystem?: boolean;
  stress: number;
  stressDelta?: number;
  state: AmmaOperatingState;
  ammaDialogue: string;
  englishTranslation?: string;
  systemLogs: string[];
  isGuiltTrip?: boolean;
  guiltTripText?: string;
  suggestedCommands: string[];
}

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface TupperwareItem {
  id: string;
  name: string;
  origin: string;
  status: 'SAFE' | 'MISSING' | 'SUSPECT_WITH_SHAJI' | 'DEFCON_1_CRACKED';
  location: string;
  sentimentalValue: string;
}

export interface RelativeContact {
  name: string;
  relation: string;
  threatLevel: 'GOSSIP_HAZARD' | 'MARRIAGE_BROKER' | 'TEA_INSPECTOR' | 'PENSION_DISCUSSION';
  distanceMeters: number;
  favoriteQuestion: string;
}

export type HouseholdTimeSlot = 'PRABATHAM' | 'OONU' | 'NAALU_MANI' | 'SERIAL_TIME';

export interface TimeSlotConfig {
  id: HouseholdTimeSlot;
  timeString: string;
  titleMalayalam: string;
  titleEnglish: string;
  activity: string;
  stressFactor: string;
}

export interface KudumbamMessage {
  id: string;
  sender: string;
  senderRole: string;
  avatarText: string;
  avatarBg: string;
  time: string;
  forwardTag?: boolean;
  content: string;
  contentEnglish: string;
  options: {
    label: string;
    labelEnglish: string;
    stressDelta: number;
    ammaComment: string;
    ammaCommentEnglish: string;
  }[];
}

export interface ClothesLineItem {
  id: string;
  name: string;
  nameMalayalam: string;
  type: 'saree' | 'mundu' | 'uniform' | 'towel' | 'vest';
  color: string;
  isCritical: boolean; // e.g. Kasavu Saree or Ironed Uniform
  isRescued: boolean;
  isWet: boolean;
}
