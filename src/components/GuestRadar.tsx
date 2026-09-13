import React from 'react';
import { RelativeContact } from '../types';
import { sounds } from '../utils/sound';
import { Radio, Users, ShieldAlert, Coffee } from 'lucide-react';

interface GuestRadarProps {
  onClose: () => void;
  onSitoutAction: (cmd: string) => void;
}

export const GuestRadar: React.FC<GuestRadarProps> = ({ onClose, onSitoutAction }) => {
  const relatives: RelativeContact[] = [
    {
      name: 'Sukumaran Ammavan',
      relation: 'Maternal Uncle (Pensioned Govt Officer)',
      threatLevel: 'GOSSIP_HAZARD',
      distanceMeters: 14,
      favoriteQuestion: "'Infosys-il jolikk keri ennu kettallo, ethra aanu in-hand salary?'"
    },
    {
      name: 'Remani Aunty',
      relation: 'Neighbor & Self-Appointed Marriage Broker',
      threatLevel: 'MARRIAGE_BROKER',
      distanceMeters: 38,
      favoriteQuestion: "'Jathakam onnu tharuvo Sheele? Palakkad nalla oru kalyana aalojana undu!'"
    },
    {
      name: 'Kunjumon (Tuition Master)',
      relation: 'Maths Teacher from 10th Standard',
      threatLevel: 'TEA_INSPECTOR',
      distanceMeters: 75,
      favoriteQuestion: "'Integration theorem orma undo atho athum phone-il poyo?'"
    }
  ];

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* Radar Screen Graphic */}
        <div className="win95-inset bg-black p-3 flex flex-col items-center justify-center relative overflow-hidden h-36">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Concentric rings */}
            <div className="w-28 h-28 rounded-full border border-emerald-500/30"></div>
            <div className="w-20 h-20 rounded-full border border-emerald-500/40"></div>
            <div className="w-10 h-10 rounded-full border border-emerald-500/60"></div>
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-emerald-500/20"></div>
            <div className="absolute h-full w-[1px] bg-emerald-500/20"></div>
          </div>

          {/* Sweeping radar line */}
          <div className="absolute w-16 h-16 origin-bottom-right top-2 left-10 bg-gradient-to-tr from-emerald-500/20 to-transparent rotate-45 pointer-events-none animate-spin duration-3000"></div>

          {/* Target Blips */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-emerald-400 font-bold text-xs tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              TARGET INCOMING: 14 METERS (SUKUMARAN AMMAVAN)
            </span>
            <span className="text-[10px] text-emerald-600 mt-1">
              Engine Sound: Bajaj Chetak 150cc (Kickstart confirmed)
            </span>
          </div>
        </div>

        {/* Relative Contact Cards */}
        <div className="space-y-2">
          {relatives.map((rel, idx) => (
            <div key={idx} className="win95-box p-2 bg-white flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <Users size={13} className="text-purple-700" />
                  <span>{rel.name}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                  {rel.distanceMeters}m away
                </span>
              </div>
              <div className="text-[11px] text-gray-600">
                <span>{rel.relation}</span>
              </div>
              <div className="win95-inset bg-amber-50 p-1.5 text-[10px] text-amber-900 italic font-serif border border-amber-200">
                Uncomfortable Query: {rel.favoriteQuestion}
              </div>
            </div>
          ))}
        </div>

        {/* Countermeasures */}
        <div className="win95-box p-2 bg-gray-100 flex flex-col gap-1.5">
          <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert size={12} className="text-amber-600" />
            SIT-OUT COUNTERMEASURES:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                sounds.playKeyClick();
                onSitoutAction('sitout --greet --tea');
              }}
              className="win95-btn p-1.5 text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Coffee size={11} />
              <span>Serve Sulaimani Tea</span>
            </button>
            <button
              onClick={() => {
                sounds.playKeyClick();
                onSitoutAction('bedroom --lock --hide');
              }}
              className="win95-btn p-1.5 text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-900 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Lock Bedroom Door</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
