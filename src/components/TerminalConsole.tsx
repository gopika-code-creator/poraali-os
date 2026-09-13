import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalEntry } from '../types';
import { sounds } from '../utils/sound';
import { getEnglishTranslation } from '../utils/translations';
import { 
  Send, 
  CornerDownLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Languages, 
  Coffee, 
  Shirt, 
  Smartphone, 
  HeartHandshake,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface TerminalConsoleProps {
  entries: TerminalEntry[];
  onExecuteCommand: (command: string) => void;
  isProcessing: boolean;
  crtFilter: boolean;
  onOpenHelp?: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  entries,
  onExecuteCommand,
  isProcessing,
  crtFilter,
  onOpenHelp
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [showQuickDeck, setShowQuickDeck] = useState(false);
  const [quickDeckCategory, setQuickDeckCategory] = useState<'chaya' | 'chores' | 'survival' | 'bribe'>('chaya');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new entries arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isProcessing, showTranslations, showQuickDeck]);

  // Read latest Amma dialogue with Web Speech API if voice is toggled on
  useEffect(() => {
    if (!voiceSpeechEnabled || entries.length === 0) return;
    const latest = entries[entries.length - 1];
    if (latest.ammaDialogue && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(latest.ammaDialogue);
      utterance.pitch = 1.35; // slightly higher expressive mother pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [entries, voiceSpeechEnabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isProcessing) return;

    sounds.playKeyClick();
    setCommandHistory(prev => [trimmed, ...prev.slice(0, 30)]);
    setHistoryIndex(-1);
    setInputVal('');
    onExecuteCommand(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sounds.playKeyClick();

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete with the first suggested command of latest entry
      const latest = entries[entries.length - 1];
      if (latest && latest.suggestedCommands.length > 0) {
        setInputVal(latest.suggestedCommands[0]);
      }
    }
  };

  const latestEntry = entries[entries.length - 1];
  const suggested = latestEntry?.suggestedCommands || ['tea --brew', 'thuni --fetch', 'phone --hide'];
  const isHighStress = (latestEntry?.stress ?? 0) >= 80;

  const quickDecks = {
    chaya: [
      { label: '🍵 Brew Cardamom Tea', cmd: 'tea --brew', delta: '-20%' },
      { label: '🥟 Order Parippuvada', cmd: 'snack --parippuvada', delta: '-15%' },
      { label: '🚰 Wash Used Glasses', cmd: 'glass --wash', delta: '-10%' },
      { label: '🍌 Pazham Pori Batch', cmd: 'snack --pazhampori', delta: '-15%' }
    ],
    chores: [
      { label: '🧺 Fetch Clothes from Terrace', cmd: 'thuni --fetch', delta: '-20%' },
      { label: '🧹 Clean & Sweep Bedroom', cmd: 'clean --room --fast', delta: '-15%' },
      { label: '🍼 Find Milton Container', cmd: 'find --bottle', delta: '-15%' },
      { label: '🪴 Water Sit-out Plants', cmd: 'plants --water', delta: '-10%' }
    ],
    survival: [
      { label: '📵 Hide Phone under Pillow', cmd: 'phone --hide', delta: '-10%' },
      { label: '📖 Open Kerala PSC Book', cmd: 'study --psc', delta: '-25%' },
      { label: '⚡ Inspect Inverter Fuse', cmd: 'kseb --fuse-check', delta: '-15%' },
      { label: '🍪 Serve Good Day Biscuits', cmd: 'biscuit --goodday', delta: '-20%' }
    ],
    bribe: [
      { label: '🙏 Humble Repentance & Study', cmd: 'apologize --promise:study', delta: '-20%' },
      { label: '🫖 Double Milk Tea Bribe', cmd: 'reboot --tea-bribe --calm', delta: '-30%' },
      { label: '💥 100% Panic BSOD Crash', cmd: 'bsod', delta: '100%' }
    ]
  };

  return (
    <motion.div 
      animate={isHighStress ? { x: [-1, 1, -1, 1, 0] } : {}}
      transition={{ duration: 0.2, repeat: isHighStress ? Infinity : 0 }}
      className="flex flex-col h-full min-h-0 bg-[#0a0e14] text-emerald-400 font-mono select-text relative"
    >
      {/* Optional CRT Scanline & Curvature Filter */}
      {crtFilter && (
        <div className="absolute inset-0 crt-scanlines crt-glow pointer-events-none z-10" />
      )}

      {/* Terminal Top Info Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 select-none z-20">
        <div className="flex items-center gap-2">
          <motion.span 
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
          />
          <span className="font-bold text-slate-200">AMMA_KERNEL.SYS TERMINAL [tty0]</span>
          <span className="hidden md:inline text-slate-500">| VT100 / MANGLISH PROTOCOL</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Survival Guide Help Button */}
          {onOpenHelp && (
            <button
              onClick={() => {
                sounds.playKeyClick();
                onOpenHelp();
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-950/70 border border-amber-500/80 text-amber-300 hover:bg-amber-900 cursor-pointer font-bold transition-transform active:scale-95"
              title="Open Tharavadu Survival Guide & Command Manual"
            >
              <HelpCircle size={12} className="text-yellow-400" />
              <span>GUIDE & TIPS</span>
            </button>
          )}

          {/* Translation Toggle */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setShowTranslations(!showTranslations);
            }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
              showTranslations
                ? 'bg-blue-950 border-blue-500 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle English Translation for Manglish dialogues"
          >
            <Languages size={12} />
            <span className="hidden sm:inline">TRANSLATION:</span>
            <span>{showTranslations ? 'ON' : 'OFF'}</span>
          </button>

          {/* Audio Speech Toggle */}
          <button
            onClick={() => {
              sounds.playKeyClick();
              setVoiceSpeechEnabled(!voiceSpeechEnabled);
            }}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border cursor-pointer transition-colors ${
              voiceSpeechEnabled
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Read Amma's reaction out loud"
          >
            {voiceSpeechEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span className="hidden sm:inline">AUDIO:</span>
            <span>{voiceSpeechEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-4 text-xs leading-relaxed z-0">
        <AnimatePresence initial={false}>
          {entries.map((item) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 border-b border-slate-900/80 pb-3"
            >
              {/* 1. Required System Diagnostic Header */}
              <div className="bg-slate-900/90 text-amber-400 px-2.5 py-1 rounded border border-slate-700 font-bold tracking-wide flex flex-wrap items-center justify-between gap-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <span>
                    [THARAVADU_OS v1.0 | CLOCK: {item.clock} | AMMA STRESS: {item.stress}% | STATE: {item.state}]
                  </span>
                  {item.stressDelta !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                      item.stressDelta <= 0
                        ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                        : 'bg-red-950 border border-red-500 text-red-300'
                    }`}>
                      {item.stressDelta <= 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                      <span>{item.stressDelta <= 0 ? `${item.stressDelta}% Calm` : `+${item.stressDelta}% Stress`}</span>
                    </span>
                  )}
                </div>
                {item.command && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    CMD: <span className="text-emerald-300 font-mono">{item.command}</span>
                  </span>
                )}
              </div>

              {/* 2. Amma's Reaction Dialogue in Bold Manglish */}
              <div className="pl-2 border-l-2 border-amber-500 py-1 space-y-1.5">
                <div className="text-amber-200 text-sm font-bold tracking-wide leading-relaxed font-sans sm:font-mono">
                  &ldquo;{item.ammaDialogue}&rdquo;
                </div>

                {/* English Translation / Cultural Meaning */}
                {showTranslations && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] font-sans text-blue-300/90 bg-blue-950/40 border border-blue-900/60 px-2 py-1 rounded italic flex items-start gap-1.5"
                  >
                    <span className="text-blue-400 font-bold not-italic text-[10px] uppercase tracking-wider bg-blue-900/50 px-1 rounded flex-shrink-0">
                      ENG:
                    </span>
                    <span>{item.englishTranslation || getEnglishTranslation(item.ammaDialogue, item.command)}</span>
                  </motion.div>
                )}
              </div>

              {/* 3. Rejection / Guilt-Trip Monologue if Stress is 100% or Critical */}
              {item.isGuiltTrip && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-red-950/70 border border-red-500/80 text-red-200 p-2.5 rounded font-sans text-xs sm:text-sm leading-relaxed shadow-lg"
                >
                  <div className="font-bold text-red-400 uppercase tracking-widest text-[10px] mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    CRITICAL MARTYR_MODE GUILT-TRIP MONOLOGUE (LOCKOUT ACTIVE)
                  </div>
                  <p className="font-bold italic">
                    &ldquo;{item.guiltTripText || item.ammaDialogue}&rdquo;
                  </p>
                </motion.div>
              )}

              {/* System Diagnostic Logs */}
              {item.systemLogs && item.systemLogs.length > 0 && (
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">SYSTEM LOG:</div>
                  {item.systemLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1 font-mono">
                      <span className="text-emerald-600 font-bold">&gt;</span>
                      <span className="text-slate-300">{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-amber-400 py-2"
          >
            <RefreshCw size={14} className="animate-spin" />
            <span className="font-bold text-xs">AMMA_KERNEL.SYS is calculating moral culpability and screen time debt...</span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 4. Required: 3 Quick Command Options user can click or type */}
      <div className="flex-shrink-0 bg-slate-900/95 border-t border-slate-800 p-2 z-20 space-y-2">
        {/* Dynamic Context Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-400" />
              SUGGESTED ACTIONS FOR THIS MOMENT:
            </span>
            <button
              onClick={() => setShowQuickDeck(!showQuickDeck)}
              className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-0.5"
            >
              <span>{showQuickDeck ? 'Hide Action Palette' : '📂 Show All Household Actions'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {suggested.map((cmd, idx) => (
              <button
                key={idx}
                disabled={isProcessing}
                onClick={() => {
                  sounds.playKeyClick();
                  onExecuteCommand(cmd);
                }}
                className="flex items-center justify-between px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-amber-300 rounded text-[11px] font-mono transition-all text-left group cursor-pointer disabled:opacity-50"
              >
                <div className="truncate">
                  <span className="text-amber-500 font-bold mr-1.5">{idx + 1}.</span>
                  <span className="group-hover:underline">{cmd}</span>
                </div>
                <CornerDownLeft size={10} className="text-slate-500 group-hover:text-amber-400 flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Expandable Quick Action Deck (Categorized One-Click Palette) */}
        <AnimatePresence>
          {showQuickDeck && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950 p-2 rounded border border-slate-800 space-y-2 overflow-hidden"
            >
              <div className="flex items-center gap-1 border-b border-slate-800 pb-1 text-[11px]">
                <button
                  onClick={() => setQuickDeckCategory('chaya')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    quickDeckCategory === 'chaya' ? 'bg-amber-900/60 text-amber-200 border border-amber-600' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Coffee size={11} />
                  <span>Chaya & Snacks</span>
                </button>
                <button
                  onClick={() => setQuickDeckCategory('chores')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    quickDeckCategory === 'chores' ? 'bg-blue-900/60 text-blue-200 border border-blue-600' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shirt size={11} />
                  <span>Chores</span>
                </button>
                <button
                  onClick={() => setQuickDeckCategory('survival')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    quickDeckCategory === 'survival' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={11} />
                  <span>Survival & Study</span>
                </button>
                <button
                  onClick={() => setQuickDeckCategory('bribe')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    quickDeckCategory === 'bribe' ? 'bg-purple-900/60 text-purple-200 border border-purple-600' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HeartHandshake size={11} />
                  <span>Peace / Bribes</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {quickDecks[quickDeckCategory].map((item, idx) => (
                  <button
                    key={idx}
                    disabled={isProcessing}
                    onClick={() => {
                      sounds.playKeyClick();
                      onExecuteCommand(item.cmd);
                    }}
                    className="flex flex-col p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded text-left transition-colors cursor-pointer group disabled:opacity-50"
                  >
                    <span className="text-[11px] font-sans font-bold text-slate-200 group-hover:text-emerald-300">
                      {item.label}
                    </span>
                    <div className="flex items-center justify-between text-[9px] mt-1 text-slate-400">
                      <span className="font-mono">{item.cmd}</span>
                      <span className={`px-1 rounded font-bold ${item.delta.includes('100') ? 'bg-red-950 text-red-400' : 'bg-emerald-950 text-emerald-400'}`}>
                        {item.delta}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive CLI Command Input Field */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs pl-1">
            <span>root@tharavadu:~#</span>
          </div>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command here (e.g. thuni --fetch, tea --brew, phone --hide, study --psc)..."
              disabled={isProcessing}
              className="w-full bg-black/80 border border-slate-700 text-emerald-300 placeholder-slate-600 px-2.5 py-1.5 text-xs rounded focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-50"
              autoFocus
            />
            {/* Blinking block cursor when empty */}
            {!inputVal && (
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute left-3 w-1.5 h-3.5 bg-emerald-500 pointer-events-none opacity-60"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={isProcessing || !inputVal.trim()}
            className="win95-btn win95-btn-emerald px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>EXECUTE</span>
            <Send size={12} className="text-emerald-200" />
          </button>
        </form>
      </div>
    </motion.div>
  );
};
