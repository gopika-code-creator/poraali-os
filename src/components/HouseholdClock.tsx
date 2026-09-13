import React from 'react';
import { Clock, Sun, Utensils, Coffee, Tv } from 'lucide-react';
import { HouseholdTimeSlot, TimeSlotConfig } from '../types';
import { sounds } from '../utils/sound';

interface HouseholdClockProps {
  currentSlot: HouseholdTimeSlot;
  currentTimeString?: string;
  onSelectSlot: (slot: HouseholdTimeSlot) => void;
}

export const TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'PRABATHAM',
    timeString: '07:00 AM',
    titleMalayalam: 'പ്രഭാതം (ചായ & പത്രം)',
    titleEnglish: 'Prabhatham (Morning Tea & Newspaper)',
    activity: 'Milk boiled, Nirmalyam chants on radio, Appuppan reading newspaper on sitout.',
    stressFactor: 'Moderate (Must brush teeth before 7:15 AM)'
  },
  {
    id: 'OONU',
    timeString: '01:00 PM',
    titleMalayalam: 'ഉച്ചയൂണ് (മത്തിക്കറി & ചോറ്)',
    titleEnglish: 'Oonu (Lunch & Fish Curry)',
    activity: 'Steaming matta rice ready, fish fry aroma filling Tharavadu. Lunch attendance required.',
    stressFactor: 'High if missing from dining table'
  },
  {
    id: 'NAALU_MANI',
    timeString: '04:30 PM',
    titleMalayalam: 'നാലുമണി ചായ & പഴംപൊരി',
    titleEnglish: 'Naalu Mani (Evening Snacks & Chaya)',
    activity: 'Preethi mixie grinding coconut chutney, fresh pazhampori sizzling in iron kadai.',
    stressFactor: 'Low & Peaceful (Ideal moment for tea bribes)'
  },
  {
    id: 'SERIAL_TIME',
    timeString: '08:30 PM',
    titleMalayalam: 'മെഗാ സീരിയൽ പ്രൈം ടൈം',
    titleEnglish: 'Serial Time (Asianet Mega Serial)',
    activity: 'Strict silence enforced in hall. Mobile phone ringers must be muted.',
    stressFactor: 'DEFCON 1 if TV screen is blocked or noise is made'
  }
];

export const HouseholdClock: React.FC<HouseholdClockProps> = ({
  currentSlot,
  currentTimeString,
  onSelectSlot
}) => {
  const activeConfig = TIME_SLOTS.find(t => t.id === currentSlot) || TIME_SLOTS[2];
  const displayTime = currentTimeString || activeConfig.timeString;

  const handleSlotChange = (slotId: HouseholdTimeSlot) => {
    sounds.playKeyClick();
    if (slotId === 'NAALU_MANI') sounds.playSuccessChime();
    else if (slotId === 'OONU') sounds.playPressureCooker();
    else if (slotId === 'SERIAL_TIME') sounds.playInverterBeep();
    else sounds.playStartup();

    onSelectSlot(slotId);
  };

  const slotLabels: Record<HouseholdTimeSlot, { short: string; full: string }> = {
    PRABATHAM: { short: 'Prabhatham', full: 'പ്രഭാതം' },
    OONU: { short: 'Oonu', full: 'ഊണ്' },
    NAALU_MANI: { short: '4 Mani Chaya', full: '4 മണി' },
    SERIAL_TIME: { short: 'Serial', full: 'സീരിയൽ' }
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#dfdfdf] px-2 py-1 border border-gray-400 rounded-xs text-[11px] font-mono shadow-xs select-none">
      {/* Ticking Live Digital Household Clock */}
      <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 border border-gray-500 shadow-inner">
        <Clock size={12} className="text-gray-700 animate-spin-slow" />
        <span className="font-bold text-gray-900 tracking-wider font-mono">{displayTime}</span>
      </div>

      {/* Interactive Time Slot Phase Buttons: Prabhatham, Oonu, Naalu Mani, Serial Time */}
      <div className="flex items-center gap-1 ml-0.5">
        {TIME_SLOTS.map((slot) => {
          const isSelected = slot.id === currentSlot;
          const icon = slot.id === 'PRABATHAM' ? <Sun size={11} /> :
                       slot.id === 'OONU' ? <Utensils size={11} /> :
                       slot.id === 'NAALU_MANI' ? <Coffee size={11} /> :
                       <Tv size={11} />;

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotChange(slot.id)}
              className={`px-2 py-0.5 rounded-[1px] text-[10px] cursor-pointer flex items-center gap-1 whitespace-nowrap transition-none ${
                isSelected 
                  ? 'win95-btn-pressed bg-[#000080] text-white font-bold border-t-2 border-l-2 border-black' 
                  : 'win95-btn text-gray-900 font-semibold hover:bg-gray-200 active:bg-gray-300'
              }`}
              title={`${slot.titleEnglish} (${slot.timeString})\n${slot.activity}`}
            >
              {icon}
              <span>{slotLabels[slot.id].short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

