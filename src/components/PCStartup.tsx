import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/sound';
import { Power, Monitor, HardDrive, CheckCircle2, Volume2, Sparkles, Cpu } from 'lucide-react';

interface PCStartupProps {
  onComplete: () => void;
  soundEnabled: boolean;
}

export const PCStartup: React.FC<PCStartupProps> = ({ onComplete, soundEnabled }) => {
  const [phase, setPhase] = useState<'POWER_OFF' | 'BIOS' | 'SPLASH' | 'WELCOME' | 'DONE'>('POWER_OFF');
  const [biosLogs, setBiosLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [audioUnlocked, setAudioUnlocked] = useState<boolean>(false);

  const startBootSequence = () => {
    setAudioUnlocked(true);
    sounds.playKeyClick();
    setPhase('BIOS');
  };

  // BIOS POST stage
  useEffect(() => {
    if (phase !== 'BIOS') return;

    const messages = [
      'AMMA BIOS (C) 1995 THARAVADU MICROSYSTEMS INC.',
      'CPU: Kerala Intel Pentium 75MHz - Sambar Heat Sink Detected',
      'RAM: 640KB BASE CONVENTIONAL OK, 16MB EXTENDED (0% COMMON SENSE)',
      'STORAGE: 1.2GB SEAGATE (PARTITION 1: KERALA_PSC_NOTES, PARTITION 2: ASIANET_EPISODES)',
      'PERIPHERALS: Milton Thermosteel Flask connected on LPT1',
      'AUDIO: Sound Blaster 16 (Amma Decibel Range: 40dB - 110dB)',
      'MOUSE: 2-Button Serial Mouse (Dust Ball Needs Cleaning)',
      'HOUSEHOLD SENSORS: 4:00 PM Kannan Devan Tea Whistle ARMED',
      'CHECKING SYSTEM INTEGRITY... OK',
      'BOOTING AMMA_KERNEL.SYS...'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < messages.length) {
        setBiosLogs(prev => [...prev, messages[currentIdx]]);
        sounds.playKeyClick();
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('SPLASH');
        }, 500);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [phase]);

  // SPLASH SCREEN WITH PROGRESS BAR AND CLASSIC WIN95 CHIME
  useEffect(() => {
    if (phase !== 'SPLASH') return;

    // Trigger authentic Windows 95 startup chime
    try {
      sounds.playStartup();
    } catch {
      // fallback
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [phase]);

  // Transition from SPLASH to WELCOME when progress reaches 100%
  useEffect(() => {
    if (phase !== 'SPLASH' || progress < 100) return;
    const t = setTimeout(() => {
      setPhase('WELCOME');
    }, 400);
    return () => clearTimeout(t);
  }, [phase, progress]);

  // WELCOME DESKTOP HANDOFF
  useEffect(() => {
    if (phase !== 'WELCOME') return;
    const finishTimeout = setTimeout(() => {
      setPhase('DONE');
      onComplete();
    }, 1100);
    return () => clearTimeout(finishTimeout);
  }, [phase, onComplete]);

  if (phase === 'DONE') return null;

  return (
    <div id="pc-boot-screen" className="fixed inset-0 z-50 flex items-center justify-center bg-black font-mono select-none overflow-hidden">
      {/* 1. POWER OFF STANDBY / INITIAL POWER-ON BUTTON */}
      {phase === 'POWER_OFF' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md w-full"
        >
          {/* Retro Beige PC Tower Case Visual */}
          <div className="win95-box p-6 bg-[#d4cbbe] border-4 border-[#e8e2d8] shadow-2xl relative">
            {/* 3.5" Floppy & CD-ROM Drive Slots */}
            <div className="space-y-2 mb-6">
              <div className="win95-inset bg-[#2a2824] h-7 px-3 flex items-center justify-between text-[#808080] text-[10px]">
                <span>5.25&quot; DRIVE A: [EMPTY]</span>
                <div className="w-2 h-2 rounded-full bg-red-900 border border-black" />
              </div>
              <div className="win95-inset bg-[#2a2824] h-6 px-3 flex items-center justify-between text-[#808080] text-[10px]">
                <span>3.5&quot; FLOPPY [THARAVADU_95.IMG]</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-black" />
              </div>
            </div>

            {/* Retro PC Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-800 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-serif font-black text-sm shadow">
                തി
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-800 tracking-wider">THARAVADU-PC 95</div>
                <div className="text-[10px] text-slate-600">Amma Household OS Edition</div>
              </div>
            </div>

            {/* Prominent Tactile Power Button */}
            <button
              id="pc-power-on-btn"
              onClick={startBootSequence}
              className="win95-btn group relative w-full py-3.5 px-6 font-bold text-sm tracking-wide bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-none cursor-pointer flex items-center justify-center gap-3 transition-all transform active:scale-98 shadow-md"
            >
              <Power size={18} className="text-yellow-300 group-hover:scale-110 transition-transform" />
              <span className="font-serif">POWER ON THARAVADU PC</span>
              <Volume2 size={16} className="text-emerald-200 animate-pulse" />
            </button>

            <p className="text-[11px] text-slate-600 mt-4 leading-normal font-sans">
              Click to initiate boot sequence with full sound effects, CRT scanline diagnostics, and Amma OS startup chime.
            </p>
          </div>
        </motion.div>
      )}

      {/* 2. BIOS POST BOOT SCREEN */}
      {phase === 'BIOS' && (
        <div className="w-full h-full p-6 text-white text-xs sm:text-sm font-mono flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3 text-emerald-400">
              <div className="flex items-center gap-2">
                <Cpu size={18} />
                <span className="font-bold">AWARD MODULAR BIOS v4.51PG, THARAVADU ENERGY STAR ALLIANCE</span>
              </div>
              <span>ENERGY SAVER [DISABLED]</span>
            </div>
            {biosLogs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                <span className="text-amber-400 mr-2">&gt;&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          <div className="text-slate-400 text-xs flex items-center justify-between border-t border-white/20 pt-2">
            <span>Press &lt;DEL&gt; to enter Adukkala Setup | Press &lt;ESC&gt; to skip PSC exam</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>FLOPPY READ: TRACK 00</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. WINDOWS 95 ICONIC RETRO SPLASH SCREEN */}
      {phase === 'SPLASH' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full bg-[#008080] flex flex-col items-center justify-center p-6 text-white"
        >
          {/* Classic Clouds Backdrop */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Retro Splash Card */}
          <div className="win95-box max-w-lg w-full p-8 bg-[#c0c0c0] text-slate-900 shadow-2xl relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-[#808080] pb-4">
              <div className="flex items-center gap-3">
                {/* Kerala Flag Icon */}
                <div className="w-12 h-12 bg-emerald-800 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-serif font-black text-2xl shadow-lg">
                  തി
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-slate-900 font-serif flex items-center gap-1.5">
                    Tharavadu <span className="text-blue-700 italic">95</span>
                  </h1>
                  <p className="text-xs text-slate-600 font-sans">
                    Amma Household Architecture Edition
                  </p>
                </div>
              </div>
              <Sparkles size={24} className="text-amber-500 animate-bounce" />
            </div>

            {/* Amma Kernel Description */}
            <div className="win95-inset p-3 bg-white text-xs space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span>LOADING DAEMONS:</span>
                <span className="text-blue-700">{progress}%</span>
              </div>
              {/* Retro Blue Progress Bar */}
              <div className="win95-inset h-5 bg-gray-200 p-0.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 transition-all duration-100 flex items-center justify-center text-[10px] text-white font-bold tracking-widest"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 30 && 'PLEASE WAIT...'}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 truncate pt-1">
                {progress < 30 && 'Connecting Kannan Devan Chaya Pipeline...'}
                {progress >= 30 && progress < 60 && 'Scanning Milton Tupperware Bottle Inventory...'}
                {progress >= 60 && progress < 85 && 'Calibrating Sitout Guest Radar & Asianet Serial Audio...'}
                {progress >= 85 && 'Initializing Amma Household Operating State...'}
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-center text-[10px] text-slate-500 font-sans border-t border-[#808080] pt-3">
              Copyright &copy; 1995 Tharavadu Corporation. All rights reserved. Do not touch keyboard with wet hands.
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. WELCOME USER BANNER */}
      {phase === 'WELCOME' && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-emerald-700 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-serif font-black text-3xl shadow-xl">
            തി
          </div>
          <h2 className="text-xl font-bold font-serif tracking-wide text-amber-200">
            Welcome to Tharavadu 95
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Session started: 4:05 PM (Naalu Mani Chaya Ready)
          </p>
        </motion.div>
      )}
    </div>
  );
};
