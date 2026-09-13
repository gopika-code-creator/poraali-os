import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalConsole } from './components/TerminalConsole';
import { AmmaAvatar } from './components/AmmaAvatar';
import { StressGauge } from './components/StressGauge';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { InterruptModal } from './components/InterruptModal';
import { TaskManager } from './components/TaskManager';
import { TupperwareRegistry } from './components/TupperwareRegistry';
import { GuestRadar } from './components/GuestRadar';
import { BsodScreen } from './components/BsodScreen';
import { HelpGuide } from './components/HelpGuide';
import { DisplayProperties } from './components/DisplayProperties';
import { SareeRescueGame } from './components/SareeRescueGame';
import { KudumbamMessenger } from './components/KudumbamMessenger';
import { AchanDaemonModal } from './components/AchanDaemonModal';
import { HouseholdClock, TIME_SLOTS } from './components/HouseholdClock';
import { sounds } from './utils/sound';
import { DAEMON_INTERRUPTS, determineAmmaState, generateLocalResponse } from './utils/localEngine';
import { getDesktopBackground, getDesktopStyle, DitherPatternType } from './utils/desktopTheme';
import { AmmaOperatingState, DaemonInterrupt, DaemonType, TerminalEntry, HouseholdTimeSlot } from './types';
import { Terminal, Activity, Package, Radio, CloudRain, Zap, Coffee, HelpCircle, BookOpen, Monitor, MessageSquare, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Amma OS State
  const [stress, setStress] = useState<number>(45);
  const [state, setState] = useState<AmmaOperatingState>('SUSPICIOUS_SCAN');
  const [clockTime, setClockTime] = useState<string>('16:05');
  const [householdSlot, setHouseholdSlot] = useState<HouseholdTimeSlot>('NAALU_MANI');
  const [activeInterrupt, setActiveInterrupt] = useState<DaemonInterrupt | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [crtFilter, setCrtFilter] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [startOpen, setStartOpen] = useState<boolean>(false);

  // Window Management
  const [windows, setWindows] = useState<{
    taskmgr: boolean;
    tupperware: boolean;
    radar: boolean;
    help: boolean;
    display: boolean;
    saree: boolean;
    kudumbam: boolean;
    achan: boolean;
  }>({
    taskmgr: false,
    tupperware: false,
    radar: false,
    help: false,
    display: false,
    saree: false,
    kudumbam: false,
    achan: false,
  });

  const [patternOverride, setPatternOverride] = useState<DitherPatternType | undefined>(undefined);
  const [focusedWindow, setFocusedWindow] = useState<string>('terminal');

  // Calculate dynamic desktop theme and dither pattern based on ammaState & stress level
  const desktopTheme = getDesktopBackground(state, stress, patternOverride);
  const desktopStyle = getDesktopStyle(state, stress, patternOverride);

  // Initial terminal entries from user's boot sequence & previous turns
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      id: 'boot_0',
      timestamp: '15:58',
      clock: '15:58',
      stress: 32,
      state: 'CALM_CHAYA',
      ammaDialogue:
        'Aha, thurannuallo! Entha ippo oru prathyekatha? Ammavanu kooduthal data balance thanno atho ninte aa WhatsApp-il valla "Good Morning" message-um vanna? Njan ivide oru chaya kudippikkan vendi ee adukkalayil kidannu kashtappadunnu, appozha ivan vanna vazhi ee "Dabba" thurannu irikkunne. Phone-il thanne nokki irunno, kanneriyumbol parayaruthu njan paranjilla ennu!',
      systemLogs: [
        'THARAVADU_OS v1.0 [BOOT SEQUENCE COMPLETE]',
        'KERNEL: AMMA_KERNEL.SYS (PID 0) INITIALIZED',
        'MEM_CHECK: 0% Brain Power (According to Amma)',
        'I/O_CHECK: Cheviyil earphone vechathond onnum kelkkilla.',
        'DAEMON: CHAYA_PIPELINE initiated.',
        'SENSOR: Smell of Parippuvada detected in background.'
      ],
      suggestedCommands: ['tea --brew', 'thuni --fetch', 'whatsapp --status --mute']
    },
    {
      id: 'turn_1',
      timestamp: '16:05',
      clock: '16:05',
      command: 'build it',
      stress: 45,
      state: 'SUSPICIOUS_SCAN',
      ammaDialogue:
        'Build it-o? Enthu build cheyyanenna ee parayunne? Naattukaarku motham joli undu, ivan ivide irunnu "build" cheyyunnu! Engineering padichittu ippo ninte ee room-inte ullil enthu "building" aanu nadakkunne? Atho aa "Coding" ennu parayunna valla thallu aano? Oru karyam paranjekkatti, aa puthiya Milton bottle evide poyi ennu ippo parayanam! Athu kandu pidichittu mathi ninte ee "Empire Building". Adhu ninte koottukaaran Shaji kondu poyo? Phone-il nokki irunnal bottle thirichu varillallo!',
      systemLogs: [
        'PROCESS: BUILD_COMMAND received.',
        'ERROR: MISSING_DEPENDENCY (Yellow_Tupperware_Bottle_02).',
        'SCANNING: Analyzing User\'s facial expression for lies.'
      ],
      suggestedCommands: [
        'find --bottle --location:SHAJI_HOUSE',
        'clean --room --fast',
        'excuse --invent --target:AMMA'
      ]
    }
  ]);

  // Clock progression
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(prev => {
        const [hoursStr, minutesStr] = prev.split(':');
        let hours = parseInt(hoursStr, 10);
        let minutes = parseInt(minutesStr, 10) + 1;
        if (minutes >= 60) {
          minutes = 0;
          hours = (hours + 1) % 24;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      });
    }, 45000);

    return () => clearInterval(timer);
  }, []);

  // Sync sounds manager
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.setSoundEnabled(nextState);
  };

  // Execute command via Server API (with Gemini AI) or fallback
  const handleExecuteCommand = async (cmd: string) => {
    setIsProcessing(true);
    sounds.playKeyClick();

    // Check for explicit BSOD / crash commands
    const normalized = cmd.trim().toLowerCase();
    if (normalized === 'bsod' || normalized === 'crash' || normalized === 'panic --100%') {
      setStress(100);
      setState('MARTYR_MODE');
      setIsProcessing(false);
      return;
    }

    // Close any active interrupt modal
    const currentInterrupt = activeInterrupt;
    if (activeInterrupt) {
      setActiveInterrupt(null);
    }

    if (cmd.toLowerCase().trim() === 'help' || cmd.toLowerCase().trim() === 'man') {
      setWindows(prev => ({ ...prev, help: true }));
      setFocusedWindow('help');
    } else if (normalized.includes('saree') || normalized.includes('mazha_run')) {
      setWindows(prev => ({ ...prev, saree: true }));
      setFocusedWindow('saree');
    } else if (normalized.includes('kudumbam') || normalized.includes('whatsapp') || normalized.includes('forward')) {
      setWindows(prev => ({ ...prev, kudumbam: true }));
      setFocusedWindow('kudumbam');
    } else if (normalized.includes('achan') || normalized.includes('father')) {
      setWindows(prev => ({ ...prev, achan: true }));
      setFocusedWindow('achan');
    } else if (normalized.includes('display') || normalized.includes('desk.cpl')) {
      setWindows(prev => ({ ...prev, display: true }));
      setFocusedWindow('display');
    } else if (normalized.includes('taskmgr') || normalized.includes('ps ')) {
      setWindows(prev => ({ ...prev, taskmgr: true }));
      setFocusedWindow('taskmgr');
    } else if (normalized.includes('tupperware') || normalized.includes('milton')) {
      setWindows(prev => ({ ...prev, tupperware: true }));
      setFocusedWindow('tupperware');
    } else if (normalized.includes('radar') || normalized.includes('guest')) {
      setWindows(prev => ({ ...prev, radar: true }));
      setFocusedWindow('radar');
    }

    if (normalized.includes('mixie') || normalized.includes('grind')) {
      sounds.playMixieGrind();
    } else if (normalized.includes('cooker') || normalized.includes('whistle')) {
      sounds.playPressureCooker();
    } else if (normalized.includes('gate') || normalized.includes('squeak')) {
      sounds.playGateCreak();
    } else if (normalized.includes('tsk') || normalized.includes('tongue')) {
      sounds.playTongueClick();
    }

    try {
      const res = await fetch('/api/kernel-exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          currentStress: stress,
          currentState: state,
          clock: clockTime,
          activeInterrupt: currentInterrupt
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const updatedStress = data.stress ?? stress;
      const updatedState = data.state ?? determineAmmaState(updatedStress);
      const delta = updatedStress - stress;

      setStress(updatedStress);
      setState(updatedState);

      // Sound and visual cues
      if (updatedStress >= 98) {
        sounds.playErrorChord();
      } else if (cmd.toLowerCase().includes('tea') || cmd.toLowerCase().includes('chaya')) {
        sounds.playPressureCooker();
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      } else if (cmd.toLowerCase().includes('thuni')) {
        sounds.playStartup();
      }

      const newEntry: TerminalEntry = {
        id: `entry_${Date.now()}`,
        timestamp: clockTime,
        clock: clockTime,
        command: cmd,
        stress: updatedStress,
        stressDelta: delta,
        state: updatedState,
        ammaDialogue: data.ammaDialogue,
        englishTranslation: data.englishTranslation,
        systemLogs: data.systemLogs || [],
        isGuiltTrip: data.isGuiltTrip,
        guiltTripText: data.guiltTripText,
        suggestedCommands: data.suggestedCommands || ['tea --brew', 'thuni --fetch', 'phone --hide']
      };

      setEntries(prev => [...prev, newEntry]);
    } catch {
      // Direct client-side failover to local engine
      const localFallback = generateLocalResponse(cmd, stress, currentInterrupt);
      const updatedStress = localFallback.stress;
      const updatedState = localFallback.state;
      const delta = updatedStress - stress;

      setStress(updatedStress);
      setState(updatedState);

      const fallbackEntry: TerminalEntry = {
        id: `entry_fallback_${Date.now()}`,
        timestamp: clockTime,
        clock: clockTime,
        command: cmd,
        stress: updatedStress,
        stressDelta: delta,
        state: updatedState,
        ammaDialogue: localFallback.ammaDialogue,
        systemLogs: [
          ...localFallback.systemLogs,
          '[SYS_OFFLINE] Operating on client-side Tharavadu backup generator.'
        ],
        isGuiltTrip: localFallback.isGuiltTrip,
        guiltTripText: localFallback.guiltTripText,
        suggestedCommands: localFallback.suggestedCommands
      };
      setEntries(prev => [...prev, fallbackEntry]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger specific household daemon interrupt
  const triggerDaemonInterrupt = (daemonType: DaemonType) => {
    const interrupt = DAEMON_INTERRUPTS[daemonType];
    if (interrupt) {
      setActiveInterrupt(interrupt);
      const newStress = Math.min(100, stress + interrupt.initialStressBump);
      setStress(newStress);
      setState(determineAmmaState(newStress));
    }
  };

  // Trigger random panic daemon
  const triggerRandomDaemon = () => {
    const types: DaemonType[] = [
      'MAZHA.EXE',
      'KSEB_TRIP',
      'GUEST_RADAR',
      'TUPPERWARE_INTEGRITY',
      'CHAYA_PIPELINE'
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    triggerDaemonInterrupt(chosen);
  };

  // Handle interrupt timeout
  const handleInterruptTimeout = () => {
    if (!activeInterrupt) return;
    sounds.playErrorChord();
    handleExecuteCommand(`${activeInterrupt.type.toLowerCase()} --timeout --failed`);
  };

  // Reset / Vent stress with tea bribe
  const handleResetStress = () => {
    handleExecuteCommand('reboot --tea-bribe --calm');
  };

  // Handle BSOD recovery
  const handleBsodRecover = (bribeType: 'chaya' | 'apologize' | 'reboot') => {
    sounds.playStartup();
    if (bribeType === 'chaya') {
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      setStress(25);
      setState('CALM_CHAYA');
      const recoverEntry: TerminalEntry = {
        id: `entry_bsod_${Date.now()}`,
        timestamp: clockTime,
        clock: clockTime,
        command: 'tea --brew --cardamom',
        stress: 25,
        state: 'CALM_CHAYA',
        ammaDialogue:
          'Aha! Choodu chaya kandappol thanne ninte thalayil ulla vishamellaam poyi! Ennalum oru karyam njan paranjekkam: adutha pravashyam 4 mani kazhinju chaya tharan madichaal ninte modem njan aattukattilil ketti thazhottu eriyum!',
        systemLogs: [
          'BSOD_RECOVERY: Lactose & cardamom packets injected into kernel memory.',
          'AMMA_TOLERANCE: Buffer restored to 75%.',
          'SYSTEM: MARTYR_MODE disengaged. Household stability returned.'
        ],
        suggestedCommands: ['clean --room --fast', 'study --psc', 'whatsapp --status --mute']
      };
      setEntries(prev => [...prev, recoverEntry]);
    } else if (bribeType === 'apologize') {
      setStress(35);
      setState('CALM_CHAYA');
      const recoverEntry: TerminalEntry = {
        id: `entry_bsod_${Date.now()}`,
        timestamp: clockTime,
        clock: clockTime,
        command: 'apologize --promise:study',
        stress: 35,
        state: 'CALM_CHAYA',
        ammaDialogue:
          'Uvva uvva! Ee kshama parayal njan ethra pravashyam kettittundu! Padikkum ennu parayum, pinne Achan varumbol parayum "computer course" aayirunnu ennu! Phone eduthu poykko, achanu kaanichu kodukkan ulla mark sheet njan ivide eduthu vechirikkunnu!',
        systemLogs: [
          'BSOD_RECOVERY: User issued humble apology.',
          'KERNEL: Warning issued. Phone custody transferred to Amma kitchen shelf.',
          'STRESS: Decreased from 100% to 35%.'
        ],
        suggestedCommands: ['thuni --fetch', 'tea --brew', 'find --bottle']
      };
      setEntries(prev => [...prev, recoverEntry]);
    } else {
      setStress(30);
      setState('CALM_CHAYA');
      const recoverEntry: TerminalEntry = {
        id: `entry_bsod_${Date.now()}`,
        timestamp: clockTime,
        clock: clockTime,
        command: 'reboot --hard',
        stress: 30,
        state: 'CALM_CHAYA',
        ammaDialogue:
          'Reboot cheythu vannuallo! Ee dabba computer reboot cheythal ninte swabhavam maarumo? Poyirunnu adukkalayil ninnu aa Milton flask eduthu vekkeda!',
        systemLogs: [
          'SYSTEM: COLD_BOOT complete.',
          'AMMA_KERNEL.SYS (PID 0) restarted.',
          'HEARTBEAT: Normal.'
        ],
        suggestedCommands: ['tea --brew', 'phone --hide', 'clean --room']
      };
      setEntries(prev => [...prev, recoverEntry]);
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col select-none transition-colors duration-500"
      style={desktopStyle}
    >
      {/* High-Stress Angry Red Perimeter Alert Flash (>90% Stress) */}
      {desktopTheme.isAngryRed && (
        <div className="absolute inset-0 pointer-events-none border-4 border-red-600/50 z-0 animate-pulse" />
      )}

      {/* Top Banner / Retro OS Watermark with Household Clock */}
      <div className="absolute top-2 right-3 z-0 flex items-center gap-3">
        <HouseholdClock
          currentSlot={householdSlot}
          onSelectSlot={(slot) => {
            setHouseholdSlot(slot);
            const slotConfig = TIME_SLOTS.find(t => t.id === slot);
            if (slotConfig) {
              const timeEntry: TerminalEntry = {
                id: `time_slot_${Date.now()}`,
                timestamp: slotConfig.timeString.split(' ')[0],
                clock: slotConfig.timeString.split(' ')[0],
                command: `schedule --slot:${slot.toLowerCase()}`,
                stress: slot === 'NAALU_MANI' ? Math.max(15, stress - 10) : slot === 'SERIAL_TIME' ? Math.min(95, stress + 15) : stress,
                state: determineAmmaState(slot === 'NAALU_MANI' ? Math.max(15, stress - 10) : stress),
                ammaDialogue: slot === 'PRABATHAM'
                  ? "Kannan Devan chaya ittu! Poyi pallu thechu kulichu vaa! Newspaper Achan eduthu!"
                  : slot === 'OONU'
                  ? "Oonu samayam aayi! Chora thinnan varunnundo atho computer-il irunnu valla chips thinnu vayaru niraikkano?"
                  : slot === 'NAALU_MANI'
                  ? "Naalu mani aayi! Choodu chaya ready! Pazhampori chuttathu kadayil ninnu eduthu vechittundu!"
                  : "Mega serial Asianet-il thudangi! Hall-il aarum orakye samsarikkalle! Phone silent cheytho!",
                systemLogs: [
                  `HOUSEHOLD_CLOCK: Switched to ${slotConfig.titleEnglish}.`,
                  `ACTIVITY: ${slotConfig.activity}`,
                  `STRESS_PROFILE: ${slotConfig.stressFactor}`
                ],
                suggestedCommands: ['tea --brew', 'study --psc', 'clean --room']
              };
              setEntries(prev => [...prev, timeEntry]);
            }
          }}
        />

        <div 
          onClick={() => {
            sounds.playKeyClick();
            setWindows(prev => ({ ...prev, display: true }));
            setFocusedWindow('display');
          }}
          className="cursor-pointer text-white/60 hover:text-white font-mono text-[11px] text-right transition-colors group hidden sm:block"
          title="Click to open Display Properties [Desk.cpl]"
        >
          <div>THARAVADU 95 [BUILD 1995.08]</div>
          <div className={`text-[10px] font-bold ${desktopTheme.isAngryRed ? 'text-red-300 animate-pulse' : 'text-teal-200'}`}>
            BG: {desktopTheme.isAngryRed ? '🔥 ANGRY RED (>90% STRESS)' : desktopTheme.patternName}
          </div>
        </div>
      </div>

      {/* Desktop Workspace */}
      <div className="flex-1 p-2 md:p-3 pb-11 overflow-hidden flex flex-col lg:flex-row gap-3 relative z-10">
        {/* Left Side: Desktop Icons (Hidden or scrollable on small screens) */}
        <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0 z-10 overflow-y-auto max-h-full pr-1">
          {/* AMMA Terminal Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setFocusedWindow('terminal');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-slate-900 border border-white flex items-center justify-center shadow-md">
              <Terminal size={22} className="text-emerald-400" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              AMMA_KERNEL
            </span>
          </button>

          {/* Saree Rescue Arcade Game Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, saree: true }));
              setFocusedWindow('saree');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-blue-100 border border-white flex items-center justify-center shadow-md">
              <CloudRain size={22} className="text-blue-700" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300 font-bold text-yellow-200"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Saree Run
            </span>
          </button>

          {/* Kudumbam 95 Family WhatsApp Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, kudumbam: true }));
              setFocusedWindow('kudumbam');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-emerald-100 border border-white flex items-center justify-center shadow-md">
              <MessageSquare size={22} className="text-emerald-700" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Kudumbam 95
            </span>
          </button>

          {/* Achan Daemon Intermediary Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, achan: true }));
              setFocusedWindow('achan');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-amber-100 border border-white flex items-center justify-center shadow-md">
              <ShieldCheck size={22} className="text-amber-800" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Achan SYS
            </span>
          </button>

          {/* Task Manager Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, taskmgr: true }));
              setFocusedWindow('taskmgr');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-slate-200 border border-white flex items-center justify-center shadow-md">
              <Activity size={22} className="text-blue-700" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Task Mgr
            </span>
          </button>

          {/* Tupperware Log Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, tupperware: true }));
              setFocusedWindow('tupperware');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-amber-100 border border-white flex items-center justify-center shadow-md">
              <Package size={22} className="text-amber-800" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Milton Log
            </span>
          </button>

          {/* Guest Radar Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, radar: true }));
              setFocusedWindow('radar');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-purple-100 border border-white flex items-center justify-center shadow-md">
              <Radio size={22} className="text-purple-700" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Sitout Radar
            </span>
          </button>

          {/* Survival Guide & Help Manual Desktop Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, help: true }));
              setFocusedWindow('help');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-yellow-100 border border-white flex items-center justify-center shadow-md">
              <HelpCircle size={22} className="text-yellow-700" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 font-bold text-yellow-200 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              User Guide
            </span>
          </button>

          {/* Display Properties Desktop Icon */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setWindows(prev => ({ ...prev, display: true }));
              setFocusedWindow('display');
            }}
            className="flex flex-col items-center gap-1 p-1 text-white hover:bg-blue-600/40 rounded cursor-pointer group"
          >
            <div className="w-10 h-10 win95-box bg-teal-100 border border-white flex items-center justify-center shadow-md">
              <Monitor size={22} className="text-teal-800" />
            </div>
            <span 
              className="text-[10px] text-center font-mono leading-tight px-0.5 group-hover:bg-blue-700 transition-colors duration-300"
              style={{ backgroundColor: desktopTheme.labelBgColor }}
            >
              Display
            </span>
          </button>
        </div>

        {/* Center: Main Primary AMMA_KERNEL Window */}
        <div className="flex-1 flex flex-col win95-box shadow-2xl h-full overflow-hidden z-20">
          {/* Window Title Bar */}
          <div className="win95-titlebar px-2 py-1 flex items-center justify-between font-bold text-xs select-none">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-300" />
              <span>THARAVADU 95 - AMMA_KERNEL.SYS (PID 0)</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCrtFilter(!crtFilter)}
                title="Toggle CRT Scanlines"
                className="win95-btn px-1.5 py-0 text-[10px] font-bold cursor-pointer"
              >
                CRT: {crtFilter ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => handleExecuteCommand('reboot')}
                title="Reboot Kernel"
                className="win95-btn px-1.5 py-0 text-[10px] font-bold cursor-pointer"
              >
                _
              </button>
              <button
                onClick={() => {
                  setWindows(prev => ({ ...prev, help: true }));
                  setFocusedWindow('help');
                }}
                title="Survival Guide & Cheatsheet"
                className="win95-btn px-1.5 py-0 text-[10px] font-bold cursor-pointer text-blue-900"
              >
                ?
              </button>
            </div>
          </div>

          {/* Window Body: Terminal Console */}
          <div className="flex-1 overflow-hidden">
            <TerminalConsole
              entries={entries}
              onExecuteCommand={handleExecuteCommand}
              isProcessing={isProcessing}
              crtFilter={crtFilter}
              onOpenHelp={() => {
                setWindows(prev => ({ ...prev, help: true }));
                setFocusedWindow('help');
              }}
            />
          </div>
        </div>

        {/* Right Side / Sidebar: Amma Avatar & Real-time Stress Gauge */}
        <div className="w-full lg:w-80 flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0 z-20">
          {/* Amma Portrait Avatar Card */}
          <div className="flex-1 sm:w-1/2 lg:w-full">
            <AmmaAvatar state={state} stress={stress} />
          </div>

          {/* Stress Gauge Card */}
          <div className="flex-1 sm:w-1/2 lg:w-full">
            <StressGauge
              stress={stress}
              state={state}
              onResetStress={handleResetStress}
              onTriggerBsod={() => {
                setStress(100);
                setState('MARTYR_MODE');
              }}
            />
          </div>

          {/* Quick House Daemons Panel */}
          <div className="win95-box p-2 hidden sm:flex flex-col gap-1 text-[11px] font-mono">
            <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider pb-1 border-b border-gray-300 flex items-center justify-between">
              <span>DAEMON SHORTCUTS:</span>
              <span className="text-[9px] text-gray-500">CLICK TO TRIGGER</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <button
                onClick={() => triggerDaemonInterrupt('MAZHA.EXE')}
                className="win95-btn p-1 text-[10px] font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
              >
                <CloudRain size={11} className="text-blue-600" />
                <span>Mazha</span>
              </button>
              <button
                onClick={() => triggerDaemonInterrupt('KSEB_TRIP')}
                className="win95-btn p-1 text-[10px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
              >
                <Zap size={11} className="text-amber-600" />
                <span>KSEB Trip</span>
              </button>
              <button
                onClick={() => triggerDaemonInterrupt('GUEST_RADAR')}
                className="win95-btn p-1 text-[10px] font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
              >
                <Radio size={11} className="text-purple-600" />
                <span>Guest</span>
              </button>
              <button
                onClick={() => triggerDaemonInterrupt('CHAYA_PIPELINE')}
                className="win95-btn p-1 text-[10px] font-bold text-amber-900 bg-yellow-50 hover:bg-yellow-100 flex items-center gap-1 cursor-pointer"
              >
                <Coffee size={11} className="text-amber-700" />
                <span>Chaya</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Auxiliary Windows: Task Manager */}
      <AnimatePresence>
        {windows.taskmgr && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-12 md:left-24 md:w-[480px] md:h-[380px] z-30 shadow-2xl"
          >
            <TaskManager
              stress={stress}
              onClose={() => setWindows(prev => ({ ...prev, taskmgr: false }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Tupperware Registry */}
      <AnimatePresence>
        {windows.tupperware && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-16 md:right-28 md:w-[500px] md:h-[420px] z-30 shadow-2xl"
          >
            <TupperwareRegistry
              onClose={() => setWindows(prev => ({ ...prev, tupperware: false }))}
              onAuditMissing={(itemName) => {
                handleExecuteCommand(`find --bottle --item:"${itemName}"`);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Guest Radar */}
      <AnimatePresence>
        {windows.radar && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:bottom-16 md:left-32 md:w-[440px] md:h-[390px] z-30 shadow-2xl"
          >
            <GuestRadar
              onClose={() => setWindows(prev => ({ ...prev, radar: false }))}
              onSitoutAction={(cmd) => {
                handleExecuteCommand(cmd);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Survival Guide & Cheatsheet */}
      <AnimatePresence>
        {windows.help && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-14 md:left-24 md:w-[560px] md:h-[460px] z-40 shadow-2xl"
          >
            <HelpGuide
              onClose={() => setWindows(prev => ({ ...prev, help: false }))}
              onExecuteCommand={(cmd) => {
                handleExecuteCommand(cmd);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Display Properties [Desk.cpl] */}
      <AnimatePresence>
        {windows.display && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-12 md:right-16 md:w-[490px] md:h-[530px] z-40 shadow-2xl"
          >
            <DisplayProperties
              stress={stress}
              state={state}
              patternOverride={patternOverride}
              onSetPatternOverride={setPatternOverride}
              onSetStress={(newStress) => {
                setStress(newStress);
                setState(determineAmmaState(newStress));
              }}
              onClose={() => setWindows(prev => ({ ...prev, display: false }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Saree Rescue Arcade Game */}
      <AnimatePresence>
        {windows.saree && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-10 md:left-28 md:w-[480px] md:h-[540px] z-40 shadow-2xl"
          >
            <SareeRescueGame
              onClose={() => setWindows(prev => ({ ...prev, saree: false }))}
              onSuccess={(savedCount) => {
                const newStress = Math.max(15, stress - (savedCount * 5));
                setStress(newStress);
                setState(determineAmmaState(newStress));
                const entry: TerminalEntry = {
                  id: `saree_win_${Date.now()}`,
                  timestamp: clockTime,
                  clock: clockTime,
                  command: 'mazha_run --completed',
                  stress: newStress,
                  stressDelta: -(savedCount * 5),
                  state: determineAmmaState(newStress),
                  ammaDialogue: `Mothathil ${savedCount} thuni nanayathe eduthu! Nalla kaaryam! Kasavu saree oru thulli vellam polum veenilla! Choodu chaya kudikku!`,
                  systemLogs: [
                    `TERRACE_RESIDUAL: ${savedCount} dry clothes safely stacked in plastic tub.`,
                    `AMMA_APPROVAL: +${savedCount * 10}XP, Maternal relief level boosted.`,
                    `STRESS_REDUCTION: -${savedCount * 5}%`
                  ],
                  suggestedCommands: ['tea --brew', 'clean --room', 'study --psc']
                };
                setEntries(prev => [...prev, entry]);
              }}
              onFailure={(wetCount) => {
                const newStress = Math.min(100, stress + (wetCount * 7));
                setStress(newStress);
                setState(determineAmmaState(newStress));
                const entry: TerminalEntry = {
                  id: `saree_fail_${Date.now()}`,
                  timestamp: clockTime,
                  clock: clockTime,
                  command: 'mazha_run --failed',
                  stress: newStress,
                  stressDelta: wetCount * 7,
                  state: determineAmmaState(newStress),
                  ammaDialogue: `Ayyo! ${wetCount} thuni nananju kulichu poyi! Ente Onam kasavu saree nanayichallo drohi! Ippo poyi bucket-il mukki pizhinyu vekku!`,
                  systemLogs: [
                    `TERRACE_ALERT: ${wetCount} garments soaked in torrential Kerala rain.`,
                    `MATERNAL_DAMAGE: Critical kasavu fabric degradation.`,
                    `STRESS_INCREASE: +${wetCount * 7}%`
                  ],
                  suggestedCommands: ['reboot --tea-bribe --calm', 'clean --room --fast']
                };
                setEntries(prev => [...prev, entry]);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Kudumbam 95 WhatsApp */}
      <AnimatePresence>
        {windows.kudumbam && (
          <motion.div 
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-4 md:inset-auto md:top-14 md:right-20 md:w-[460px] md:h-[520px] z-40 shadow-2xl"
          >
            <KudumbamMessenger
              onClose={() => setWindows(prev => ({ ...prev, kudumbam: false }))}
              onSendReply={(text) => {
                const newStress = Math.max(15, stress - 8);
                setStress(newStress);
                setState(determineAmmaState(newStress));
                const entry: TerminalEntry = {
                  id: `kudumbam_rep_${Date.now()}`,
                  timestamp: clockTime,
                  clock: clockTime,
                  command: `whatsapp --reply:"${text.slice(0, 20)}..."`,
                  stress: newStress,
                  stressDelta: -8,
                  state: determineAmmaState(newStress),
                  ammaDialogue: "Kudumbam group-il maryadhakku reply koduthathukondu naanamkedu ozhivayi! Sukumaran Ammavanu thrupthi aayi!",
                  systemLogs: [
                    'WHATSAPP_95: Respectful reply broadcast to 42 family members.',
                    'AMMVAAN_SCORE: Maximum pranams delivered.',
                    'STRESS: -8%'
                  ],
                  suggestedCommands: ['tea --brew', 'study --psc', 'clean --room']
                };
                setEntries(prev => [...prev, entry]);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Auxiliary Windows: Achan Daemon Intermediary */}
      <AnimatePresence>
        {windows.achan && (
          <AchanDaemonModal
            isOpen={windows.achan}
            currentStress={stress}
            onMediate={() => {
              const newStress = Math.max(15, stress - 35);
              setStress(newStress);
              setState(determineAmmaState(newStress));
              setWindows(prev => ({ ...prev, achan: false }));
              const entry: TerminalEntry = {
                id: `achan_mediation_${Date.now()}`,
                timestamp: clockTime,
                clock: clockTime,
                command: 'achan --mediate --bypass-rage',
                stress: newStress,
                stressDelta: -35,
                state: determineAmmaState(newStress),
                ammaDialogue: "Achanod parayippicho? Achan paranjathu kondu maathram njan onnum parayunnilla! Oru chaya koodi ittekaam, poyirunnu padikkan nokk!",
                systemLogs: [
                  'ACHAN_SYS: Paternal mediation protocol enacted.',
                  'MANORAMA_SHIELD: Malayala Manorama editorial reading neutralized Amma anger.',
                  'BYPASS_STATUS: Amma rage reduced by 35%.'
                ],
                suggestedCommands: ['tea --brew', 'study --psc', 'clean --room']
              };
              setEntries(prev => [...prev, entry]);
            }}
            onClose={() => setWindows(prev => ({ ...prev, achan: false }))}
          />
        )}
      </AnimatePresence>

      {/* Critical Daemon Interrupt Modal */}
      <AnimatePresence>
        {activeInterrupt && (
          <InterruptModal
            interrupt={activeInterrupt}
            onResolve={(cmd) => handleExecuteCommand(cmd)}
            onTimeout={handleInterruptTimeout}
          />
        )}
      </AnimatePresence>

      {/* Start Menu Popup */}
      <StartMenu
        isOpen={startOpen}
        onClose={() => setStartOpen(false)}
        onOpenWindow={(id) => {
          if (id === 'terminal') setFocusedWindow('terminal');
          else if (id === 'taskmgr') setWindows(prev => ({ ...prev, taskmgr: true }));
          else if (id === 'tupperware') setWindows(prev => ({ ...prev, tupperware: true }));
          else if (id === 'radar') setWindows(prev => ({ ...prev, radar: true }));
          else if (id === 'help') setWindows(prev => ({ ...prev, help: true }));
          else if (id === 'display') setWindows(prev => ({ ...prev, display: true }));
          else if (id === 'saree') setWindows(prev => ({ ...prev, saree: true }));
          else if (id === 'kudumbam') setWindows(prev => ({ ...prev, kudumbam: true }));
          else if (id === 'achan') setWindows(prev => ({ ...prev, achan: true }));
        }}
        onReboot={() => handleExecuteCommand('reboot')}
        onTriggerDaemon={(daemonType) => triggerDaemonInterrupt(daemonType as DaemonType)}
        onTriggerBsod={() => {
          setStress(100);
          setState('MARTYR_MODE');
        }}
      />

      {/* Windows 95 Taskbar */}
      <Taskbar
        startOpen={startOpen}
        onToggleStart={() => setStartOpen(!startOpen)}
        activeWindows={[
          { id: 'terminal', title: 'AMMA_KERNEL Console', isOpen: true, isMinimized: false },
          { id: 'taskmgr', title: 'Task Manager', isOpen: windows.taskmgr, isMinimized: false },
          { id: 'tupperware', title: 'Tupperware Log', isOpen: windows.tupperware, isMinimized: false },
          { id: 'radar', title: 'Sit-Out Radar', isOpen: windows.radar, isMinimized: false },
          { id: 'help', title: 'Survival Guide', isOpen: windows.help, isMinimized: false },
          { id: 'display', title: 'Display Properties', isOpen: windows.display, isMinimized: false },
          { id: 'saree', title: 'Saree Rescue (Mazha Run)', isOpen: windows.saree, isMinimized: false },
          { id: 'kudumbam', title: 'Kudumbam 95 Messenger', isOpen: windows.kudumbam, isMinimized: false },
          { id: 'achan', title: 'Achan Mediation Daemon', isOpen: windows.achan, isMinimized: false },
        ]}
        focusedWindowId={focusedWindow}
        onWindowClick={(id) => {
          if (id === 'terminal') setFocusedWindow('terminal');
          else if (id === 'taskmgr') setWindows(prev => ({ ...prev, taskmgr: !prev.taskmgr }));
          else if (id === 'tupperware') setWindows(prev => ({ ...prev, tupperware: !prev.tupperware }));
          else if (id === 'radar') setWindows(prev => ({ ...prev, radar: !prev.radar }));
          else if (id === 'help') setWindows(prev => ({ ...prev, help: !prev.help }));
          else if (id === 'display') setWindows(prev => ({ ...prev, display: !prev.display }));
          else if (id === 'saree') setWindows(prev => ({ ...prev, saree: !prev.saree }));
          else if (id === 'kudumbam') setWindows(prev => ({ ...prev, kudumbam: !prev.kudumbam }));
          else if (id === 'achan') setWindows(prev => ({ ...prev, achan: !prev.achan }));
        }}
        crtFilter={crtFilter}
        onToggleCrt={() => setCrtFilter(!crtFilter)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        stress={stress}
        state={state}
        clockTime={clockTime}
        onQuickInterrupt={triggerRandomDaemon}
      />

      {/* 100% Stress Blue Screen of Death (BSOD) */}
      {stress >= 100 && (
        <BsodScreen
          stress={stress}
          onRecover={handleBsodRecover}
        />
      )}
    </div>
  );
}
