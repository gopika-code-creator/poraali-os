import React from 'react';
import { motion } from 'motion/react';
import { AmmaOperatingState } from '../types';

interface StressGaugeProps {
  stress: number;
  state: AmmaOperatingState;
  onResetStress: () => void;
  onTriggerBsod?: () => void;
}

export const StressGauge: React.FC<StressGaugeProps> = ({ stress, state, onResetStress, onTriggerBsod }) => {
  // Calculate needle rotation (-90deg to +90deg)
  const rotation = -90 + (stress / 100) * 180;
  const isHighStress = stress >= 75;

  // Color according to danger
  const getGaugeColor = () => {
    if (stress >= 98) return 'text-red-600';
    if (stress >= 75) return 'text-orange-500';
    if (stress >= 40) return 'text-yellow-600';
    return 'text-emerald-600';
  };

  return (
    <div className="win95-box p-2.5 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-gray-400 pb-1">
        <span className="font-bold text-xs tracking-wider flex items-center gap-1">
          <motion.span 
            animate={isHighStress ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
            className={`inline-block w-2 h-2 rounded-sm ${stress >= 90 ? 'bg-red-600' : isHighStress ? 'bg-orange-500' : 'bg-emerald-500'}`}
          />
          AMMA STRESS GAUGE v1.0
        </span>
        <button
          onClick={onResetStress}
          title="Attempt emergency reboot with tea bribe"
          className="win95-btn px-1.5 py-0.5 text-[10px] font-bold active:translate-y-0.5 cursor-pointer hover:bg-gray-100"
        >
          VENT STRESS
        </button>
      </div>

      {/* Analog Retro Dial & Gauge Container */}
      <div className="win95-inset bg-slate-900 p-2 text-white flex flex-col items-center relative overflow-hidden">
        {/* Semi-circular dial SVG */}
        <div className="relative w-48 h-24 flex items-center justify-center">
          <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Safe Zone (10-35%) */}
            <path
              d="M 10 50 A 40 40 0 0 1 31.7 20.3"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray="2,1"
            />
            {/* Suspicious Zone (40-70%) */}
            <path
              d="M 31.7 20.3 A 40 40 0 0 1 68.3 20.3"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray="2,1"
            />
            {/* Panic Zone (75-95%) */}
            <path
              d="M 68.3 20.3 A 40 40 0 0 1 87.5 42"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeDasharray="2,1"
            />
            {/* Martyr Zone (98-100%) */}
            <path
              d="M 87.5 42 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
            />

            {/* Dial Labels */}
            <text x="14" y="48" fill="#10b981" fontSize="4" fontWeight="bold">CALM</text>
            <text x="44" y="16" fill="#f59e0b" fontSize="4" fontWeight="bold">SCAN</text>
            <text x="68" y="27" fill="#f97316" fontSize="4" fontWeight="bold">PANIC</text>
            <text x="82" y="48" fill="#ef4444" fontSize="4" fontWeight="bold">100%</text>

            {/* Center Pivot Point */}
            <circle cx="50" cy="50" r="4" fill="#64748b" stroke="#ffffff" strokeWidth="1" />

            {/* Dial Needle with spring motion & high-stress jitter */}
            <motion.g
              animate={{
                rotate: isHighStress ? [rotation - 2, rotation + 2, rotation] : rotation
              }}
              transition={{
                rotate: isHighStress 
                  ? { duration: 0.15, repeat: Infinity, ease: 'linear' }
                  : { type: 'spring', stiffness: 85, damping: 12 }
              }}
              style={{ transformOrigin: '50px 50px' }}
            >
              <polygon points="48,50 50,12 52,50" fill={stress >= 95 ? '#ef4444' : '#ffffff'} />
              <line x1="50" y1="50" x2="50" y2="12" stroke="#ef4444" strokeWidth="1" />
            </motion.g>
          </svg>
        </div>

        {/* Digital Readout */}
        <div className="w-full flex items-center justify-between px-2 pt-1 font-mono text-xs border-t border-slate-700 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">AMMA_BP:</span>
            <motion.span 
              key={stress}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`font-bold text-sm tracking-wider ${getGaugeColor()}`}
            >
              {stress}%
            </motion.span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            {isHighStress && (
              <motion.span 
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500 inline-block"
              />
            )}
            <span className="uppercase text-slate-300 font-bold">{state}</span>
          </div>
        </div>

        {/* Segmented LED Bar Indicator with smooth glows */}
        <div className="w-full grid grid-cols-10 gap-0.5 mt-2 h-2.5 bg-black p-0.5 border border-slate-700">
          {Array.from({ length: 10 }).map((_, i) => {
            const threshold = (i + 1) * 10;
            const isLit = stress >= threshold - 5;
            let ledColor = 'bg-emerald-500';
            if (threshold > 70) ledColor = 'bg-orange-500';
            if (threshold > 90) ledColor = 'bg-red-600';
            else if (threshold > 35) ledColor = 'bg-yellow-400';

            return (
              <motion.div
                key={i}
                animate={isLit && isHighStress ? { opacity: [0.7, 1, 0.7] } : { opacity: isLit ? 1 : 0.2 }}
                transition={{ duration: 0.4, repeat: isHighStress ? Infinity : 0 }}
                className={`h-full rounded-[1px] transition-all duration-200 ${
                  isLit ? `${ledColor} shadow-[0_0_5px_currentColor]` : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* State threshold quick guide */}
      <div className="text-[10px] text-gray-600 font-mono flex justify-between items-center px-1">
        <span>10-35%: Chaya</span>
        <span>40-70%: Scan</span>
        <span>75-95%: Panic</span>
        {onTriggerBsod ? (
          <button
            onClick={onTriggerBsod}
            title="Click to simulate 100% BSOD Crash"
            className="text-red-700 font-bold hover:underline cursor-pointer bg-red-50 px-1 py-0.5 rounded border border-red-200 active:scale-95 transition-transform"
          >
            100%: BSOD
          </button>
        ) : (
          <span className="text-red-700 font-bold">100%: Lockout</span>
        )}
      </div>
    </div>
  );
};
