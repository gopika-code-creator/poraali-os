import React, { useState } from 'react';
import { ShieldCheck, Coffee, Newspaper, Wrench, X, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { sounds } from '../utils/sound';

interface AchanDaemonModalProps {
  currentStress: number;
  onBypassLockout?: (stressDrop: number, achanDialogue: string, englishTranslation: string) => void;
  onMediate?: () => void;
  isOpen?: boolean;
  onClose: () => void;
}

export const AchanDaemonModal: React.FC<AchanDaemonModalProps> = ({
  currentStress,
  onBypassLockout,
  onMediate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'INTERVENE' | 'PAPER' | 'KSEB'>('INTERVENE');
  const [lastActionLog, setLastActionLog] = useState<string | null>(null);

  const handleIntervention = (type: 'TEA' | 'EXCUSE' | 'KSEB') => {
    sounds.playKeyClick();
    if (onMediate) {
      onMediate();
      return;
    }
    if (type === 'TEA') {
      sounds.playSuccessChime();
      setLastActionLog("Achan adjusted his reading glasses, looked towards the kitchen, and cleared his throat.");
      onBypassLockout?.(
        35,
        "Shylaja... avan raavile thottu irunnu padikkunnu. Oru chaya koodi ittekkedo, paavam.",
        "Shylaja (Amma)... the child has been studying since morning. Just make one more cup of tea, poor kid."
      );
    } else if (type === 'EXCUSE') {
      sounds.playSuccessChime();
      setLastActionLog("Achan folded Malayala Manorama and gave a calm paternal nod.");
      onBypassLockout?.(
        25,
        "Vittukaledo... pillerayittalla athokke sheriyavum. Computer padikkatte.",
        "Let it go... they are just kids, they will learn. Let them study computer."
      );
    } else if (type === 'KSEB') {
      sounds.playInverterBeep();
      setLastActionLog("Achan took his trusty test-screwdriver and checked the sitout main fuse.");
      onBypassLockout?.(
        20,
        "Fuse poyathalla, KSEB-kar line cut cheythathaanu. 10 min-il varum.",
        "The fuse hasn't blown; KSEB just took a maintenance shutdown. Power will return in 10 mins."
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#c0c0c0] font-mono text-xs select-none">
      {/* Retro Banner */}
      <div className="p-2 border-b border-gray-400 bg-amber-50 text-amber-950 flex items-center gap-2">
        <div className="text-2xl">👴📰</div>
        <div>
          <div className="font-bold text-[11px] leading-tight text-amber-900">
            ACHAN (FATHER) INTERMEDIARY SERVICE
          </div>
          <div className="text-[10px] text-amber-800 font-sans">
            When Amma is in Critical Rage or Martyr Mode, direct communication drops to 0% success. Achan is the only authorized gateway.
          </div>
        </div>
      </div>

      {/* Achan Status View */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-3 overflow-y-auto">
        {/* Visual Graphic Representation */}
        <div className="win95-inset bg-[#f4ece1] p-3 rounded-[2px] flex items-center gap-3 border border-amber-300">
          <div className="w-16 h-16 bg-amber-200 border-2 border-amber-700 rounded-sm flex flex-col items-center justify-center text-center shadow-inner">
            <span className="text-2xl">👓</span>
            <span className="text-[8px] font-bold text-amber-900 mt-0.5">MANORAMA</span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="text-xs font-bold text-gray-900 flex items-center justify-between">
              <span>Status: Reading Malayala Manorama Editorial</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xs font-mono font-bold">
                RECEPTIVE
              </span>
            </div>
            <div className="text-[10px] text-gray-600 font-sans">
              Location: Sitout Teak Easy Chair (ചാരുപടി)
            </div>
            <div className="text-[10px] text-blue-900 font-mono">
              Intervention Power: <span className="font-bold">Bypasses Amma Firewall (-35% Stress)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="font-bold text-[10px] text-gray-700 uppercase tracking-wider">
            Available Paternal Mediation Routines:
          </div>

          <button
            onClick={() => handleIntervention('TEA')}
            className="w-full win95-box p-2 bg-white hover:bg-amber-50 text-left flex items-center gap-2 cursor-pointer group"
          >
            <Coffee size={18} className="text-amber-700 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <div className="font-bold text-xs text-gray-900">
                1. "Acha, Ammayodu oru chaya koodi ittekaan parayumo?"
              </div>
              <div className="text-[10px] text-gray-500 font-sans">
                Achan requests tea on your behalf $\rightarrow$ Amma complies without scolding! (-35% Stress)
              </div>
            </div>
          </button>

          <button
            onClick={() => handleIntervention('EXCUSE')}
            className="w-full win95-box p-2 bg-white hover:bg-amber-50 text-left flex items-center gap-2 cursor-pointer group"
          >
            <Newspaper size={18} className="text-blue-700 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <div className="font-bold text-xs text-gray-900">
                2. Hand Achan the Manorama Sports & Cinema Supplement
              </div>
              <div className="text-[10px] text-gray-500 font-sans">
                Achan defends your computer study hours to Amma (-25% Stress)
              </div>
            </div>
          </button>

          <button
            onClick={() => handleIntervention('KSEB')}
            className="w-full win95-box p-2 bg-white hover:bg-amber-50 text-left flex items-center gap-2 cursor-pointer group"
          >
            <Wrench size={18} className="text-stone-700 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <div className="font-bold text-xs text-gray-900">
                3. Ask Achan to inspect the Sitout Main Fuse Box
              </div>
              <div className="text-[10px] text-gray-500 font-sans">
                Achan verifies KSEB line voltage with his test-screwdriver (-20% Stress)
              </div>
            </div>
          </button>
        </div>

        {/* Action Log Result */}
        {lastActionLog && (
          <div className="win95-inset bg-emerald-50 border border-emerald-300 p-2 text-emerald-950 text-[10px] font-mono">
            <span className="font-bold">ACHAN_DISPATCH:</span> {lastActionLog}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-400 bg-[#c0c0c0] flex items-center justify-between">
        <div className="text-[10px] text-gray-600">
          Current Amma Stress: <span className="font-bold text-red-700">{currentStress}%</span>
        </div>
        <button
          onClick={() => {
            sounds.playKeyClick();
            onClose();
          }}
          className="win95-btn px-4 py-1 text-xs font-bold cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
