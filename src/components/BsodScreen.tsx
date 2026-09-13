import React, { useEffect } from 'react';
import { sounds } from '../utils/sound';
import { RotateCcw, Coffee, ShieldCheck } from 'lucide-react';

interface BsodScreenProps {
  onRecover: (bribeType: 'chaya' | 'apologize' | 'reboot') => void;
  stress: number;
}

export const BsodScreen: React.FC<BsodScreenProps> = ({ onRecover, stress }) => {
  useEffect(() => {
    // Play harsh crash sound when BSOD mounts
    sounds.playBsodCrash();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onRecover('chaya');
      } else if (e.code === 'Enter') {
        e.preventDefault();
        onRecover('apologize');
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onRecover('reboot');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRecover]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0000AA] text-white font-mono p-4 sm:p-8 md:p-12 flex flex-col justify-between overflow-y-auto select-none crt-scanlines">
      {/* Top Warning Banner */}
      <div className="max-w-4xl mx-auto w-full space-y-4">
        <div className="flex justify-center mb-6">
          <span className="bg-[#c0c0c0] text-[#0000AA] px-4 py-1 text-sm sm:text-base font-black tracking-widest uppercase shadow">
            THARAVADU_OS v1.0 - FATAL EXCEPTION 0E
          </span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed font-bold">
          A fatal moral exception 0E has occurred at 0028:C0011E36 in VXD AMMA_PATIENCE(01) + 00010E36.
          The current application <span className="underline decoration-red-400">PHONE_SCREEN_TIME.EXE</span> will be terminated.
        </p>

        {/* Amma's Martyr Monologue Box */}
        <div className="border border-white/40 p-4 bg-[#000088] my-4 shadow-inner space-y-2">
          <div className="text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
            *** AMMA_KERNEL PANIC: 100% MARTYR_MODE LOCKOUT ***
          </div>
          <div className="text-white text-base sm:text-lg font-bold italic leading-snug">
            &ldquo;Ningal aarum enikku oru sahayam cheyyanda! Njan ivide kidannu thulanj potte! Naalu mani aayappol chaya chodichathinu oru thalavedana pole phone-il nokki irikkunnu! Achan varatte, ninte ee dabba computer njan aduppil idum!&rdquo;
          </div>
          <div className="text-blue-200 text-xs mt-1">
            Maternal Tolerance Level: <span className="text-red-400 font-bold">0.00% (STRESS_BUFFER_OVERFLOW: {stress}%)</span>
          </div>
        </div>

        {/* Stack Trace / Crash Dump */}
        <div className="space-y-1.5 text-xs sm:text-sm text-blue-100 font-mono">
          <div className="text-white font-bold">
            * CRASH DETAILS & GUILT TELEMETRY:
          </div>
          <div className="pl-4 space-y-0.5 text-blue-200">
            <div>STOP: 0x0000007F (0xPHONE_ADDICTION, 0xMILTON_BOTTLE_LOST, 0x00CHAYA_BURNT, 0xSHAJI_FAILED)</div>
            <div>ADUKKALA_BUS.SYS : 4 unwashed tea glasses detected in kitchen sink.</div>
            <div>KSEB_FEEDER.VXD   : Inverter battery exhausted blaming your phone charger.</div>
            <div>TERRACE_LINE.DRV  : Nananja mundu completely drenched in monsoon cloudburst.</div>
            <div>TUPPERWARE.DLL    : Dubai-imported lunchbox #04 marked as MISSING_PRESUMED_STOLEN.</div>
          </div>
        </div>

        {/* Instruction List */}
        <div className="space-y-2 text-xs sm:text-sm pt-2 text-white">
          <p>
            * Press <span className="font-bold underline text-yellow-300">SPACE</span> to offer warm Chaya & Parippuvada bribe to Amma.
          </p>
          <p>
            * Press <span className="font-bold underline text-yellow-300">ENTER</span> to apologize profusely and promise to study for PSC/Engineering exams.
          </p>
          <p>
            * Press <span className="font-bold underline text-yellow-300">ESC</span> to perform an Emergency Tharavadu Hard Reboot.
          </p>
        </div>

        {/* Action Buttons for Mobile/Touch & Click */}
        <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onRecover('chaya')}
            className="flex-1 py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-white shadow cursor-pointer active:translate-y-0.5"
          >
            <Coffee size={16} />
            <span>Serve Chaya Bribe (Stress Drops to 25%)</span>
          </button>

          <button
            onClick={() => onRecover('apologize')}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-white shadow cursor-pointer active:translate-y-0.5"
          >
            <ShieldCheck size={16} />
            <span>&ldquo;Kshamikkanam Amme!&rdquo; (Repent & Hide Phone)</span>
          </button>

          <button
            onClick={() => onRecover('reboot')}
            className="py-2.5 px-4 bg-red-700 hover:bg-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-white shadow cursor-pointer active:translate-y-0.5"
          >
            <RotateCcw size={16} />
            <span>Hard Reboot (CTRL+ALT+DEL)</span>
          </button>
        </div>
      </div>

      {/* Bottom Blinking Cursor */}
      <div className="max-w-4xl mx-auto w-full text-xs text-blue-200 mt-6 flex items-center justify-between border-t border-blue-400/30 pt-3">
        <span>PRESS ANY KEY TO CONTINUE _</span>
        <span className="animate-pulse font-bold text-yellow-300">KERNEL_HALTED</span>
      </div>
    </div>
  );
};
