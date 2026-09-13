import React from 'react';
import { Clock, Sun, Moon, Utensils, Tv, Coffee, Sparkles } from 'lucide-react';
import { HouseholdTimeSlot, TimeSlotConfig } from '../types';
import { sounds } from '../utils/sound';

interface HouseholdClockProps {
  currentSlot: HouseholdTimeSlot;
  onSelectSlot: (slot: HouseholdTimeSlot) => void;
}

export const TIME_SLOTS: TimeSlotConfig[] = [
  {
    id: 'PRABATHAM',
    timeString: '07:00 AM',
    titleMalayalam: 'പ്രഭാതം (ചായ & പത്രം)',
    titleEnglish: 'Morning (Kannan Devan Tea & Manorama)',
    activity: 'Milk boiled, Nirmalyam chants on radio, Appuppan reading newspaper on sitout.',
    stressFactor: 'Moderate (Must brush teeth before 7:15 AM)'
  },
  {
    id: 'OONU',
    timeString: '01:00 PM',
    titleMalayalam: 'ഉച്ചയൂണ് (മത്തിക്കറി & ചോറ്)',
    titleEnglish: 'Lunch (Fish Curry, Matta Rice & Moru)',
    activity: 'Steaming matta rice ready, fish fry aroma filling Tharavadu. Lunch attendance required.',
    stressFactor: 'High if missing from dining table'
  },
  {
    id: 'NAALU_MANI',
    timeString: '04:30 PM',
    titleMalayalam: 'നാലുമണി ചായ & പഴംപൊരി',
    titleEnglish: 'Evening Snack (Hot Chaya & Pazhampori)',
    activity: 'Preethi mixie grinding coconut chutney, fresh pazhampori sizzling in iron kadai.',
    stressFactor: 'Low & Peaceful (Ideal moment for tea bribes)'
  },
  {
    id: 'SERIAL_TIME',
    timeString: '08:30 PM',
    titleMalayalam: 'മെഗാ സീരിയൽ പ്രൈം ടൈം',
    titleEnglish: 'Mega Serial Prime Time (Asianet/Mazhavil)',
    activity: 'Strict silence enforced in hall. Mobile phone ringers must be muted.',
    stressFactor: 'DEFCON 1 if TV screen is blocked or noise is made'
  }
];

export const HouseholdClock: React.FC<HouseholdClockProps> = ({
  currentSlot,
  onSelectSlot
}) => {
  const activeConfig = TIME_SLOTS.find(t => t.id === currentSlot) || TIME_SLOTS[2];

  const handleSlotChange = (slotId: HouseholdTimeSlot) => {
    sounds.playKeyClick();
    if (slotId === 'NAALU_MANI') sounds.playSuccessChime();
    else if (slotId === 'OONU') sounds.playPressureCooker();
    else if (slotId === 'SERIAL_TIME') sounds.playInverterBeep();
    else sounds.playStartup();

    onSelectSlot(slotId);
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#dfdfdf] px-2 py-0.5 border border-gray-400 rounded-xs text-[11px] font-mono">
      <Clock size={12} className="text-gray-700" />
      <span className="font-bold text-gray-900">{activeConfig.timeString}</span>

      <div className="flex items-center gap-0.5 ml-1">
        {TIME_SLOTS.map((slot) => {
          const isSelected = slot.id === currentSlot;
          const icon = slot.id === 'PRABATHAM' ? <Sun size={10} /> :
                       slot.id === 'OONU' ? <Utensils size={10} /> :
                       slot.id === 'NAALU_MANI' ? <Coffee size={10} /> :
                       <Tv size={10} />;

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotChange(slot.id)}
              className={`px-1.5 py-0.5 rounded-[1px] text-[10px] cursor-pointer flex items-center gap-0.5 transition-none ${
                isSelected 
                  ? 'win95-btn-pressed bg-[#000080] text-white font-bold' 
                  : 'win95-btn text-gray-800 hover:bg-gray-100'
              }`}
              title={`${slot.titleEnglish} - ${slot.activity}`}
            >
              {icon}
              <span className="hidden xl:inline">{slot.id.split('_')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
