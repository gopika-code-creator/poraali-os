import React from 'react';
import { Terminal, Activity, Package, Radio, Monitor, Volume2, VolumeX, AlertCircle, HelpCircle, CloudRain, MessageSquare, ShieldCheck, Play, Pause, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';
import { AmmaOperatingState } from '../types';

interface TaskbarProps {
  startOpen: boolean;
  onToggleStart: () => void;
  activeWindows: { id: string; title: string; isOpen: boolean; isMinimized: boolean }[];
  focusedWindowId: string;
  onWindowClick: (id: string) => void;
  crtFilter: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  stress: number;
  state: AmmaOperatingState;
  clockTime: string;
  onQuickInterrupt: () => void;
  autoTriggerEnabled: boolean;
  onToggleAutoTrigger: () => void;
  onRestartPC: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  startOpen,
  onToggleStart,
  activeWindows,
  focusedWindowId,
  onWindowClick,
  crtFilter,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  stress,
  state,
  clockTime,
  onQuickInterrupt,
  autoTriggerEnabled,
  onToggleAutoTrigger,
  onRestartPC
}) => {
  const getWindowIcon = (id: string) => {
    switch (id) {
      case 'terminal':
        return <Terminal size={12} className="text-emerald-700" />;
      case 'taskmgr':
        return <Activity size={12} className="text-blue-700" />;
      case 'tupperware':
        return <Package size={12} className="text-amber-700" />;
      case 'radar':
        return <Radio size={12} className="text-purple-700" />;
      case 'help':
        return <HelpCircle size={12} className="text-yellow-600" />;
      case 'display':
        return <Monitor size={12} className="text-teal-700" />;
      case 'saree':
        return <CloudRain size={12} className="text-blue-600" />;
      case 'kudumbam':
        return <MessageSquare size={12} className="text-emerald-700" />;
      case 'achan':
        return <ShieldCheck size={12} className="text-amber-700" />;
      default:
        return <Terminal size={12} />;
    }
  };

  const getStressBadgeColor = () => {
    if (stress >= 98) return 'bg-red-600 text-white animate-pulse';
    if (stress >= 75) return 'bg-orange-500 text-white';
    if (stress >= 40) return 'bg-amber-400 text-gray-900';
    return 'bg-emerald-600 text-white';
  };

  return (
    <div className="h-9 win95-box flex-shrink-0 w-full z-40 flex items-center justify-between px-1 py-0.5 select-none font-mono text-xs">
      {/* Left side: Start button and Window Tabs */}
      <div className="flex items-center gap-1.5 h-full overflow-x-auto">
        {/* Windows 95 Start Button */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onToggleStart();
          }}
          className={`h-7 px-2.5 flex items-center gap-1.5 font-bold cursor-pointer transition-none ${
            startOpen ? 'win95-btn-pressed bg-gray-300' : 'win95-btn bg-[#c0c0c0]'
          }`}
        >
          {/* Retro Kerala icon / elephant silhouette flag */}
          <div className="w-4 h-4 bg-emerald-700 border border-amber-400 flex items-center justify-center text-[10px] font-serif font-black text-amber-300 shadow-xs">
            തി
          </div>
          <span className="tracking-wider">Start</span>
        </button>

        <div className="h-5 w-[2px] bg-gray-400 mx-0.5" />

        {/* Running Window Tabs */}
        {activeWindows.map((win) => {
          if (!win.isOpen) return null;
          const isFocused = focusedWindowId === win.id && !win.isMinimized;

          return (
            <button
              key={win.id}
              onClick={() => {
                sounds.playKeyClick();
                onWindowClick(win.id);
              }}
              className={`h-7 px-2 max-w-[170px] truncate flex items-center gap-1.5 cursor-pointer text-left ${
                isFocused ? 'win95-btn-pressed bg-gray-200 font-bold' : 'win95-btn bg-[#c0c0c0]'
              }`}
            >
              {getWindowIcon(win.id)}
              <span className="truncate text-[11px]">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* Right side: System Tray */}
      <div className="flex items-center gap-1 h-full pl-2">
        {/* Auto-Triggering Daemon Interruption Mode */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onToggleAutoTrigger();
          }}
          title={autoTriggerEnabled ? 'Disable Auto-Triggering Daemons' : 'Enable Auto-Triggering Daemons (Random Kerala Household Chaos)'}
          className={`win95-btn h-7 px-2 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
            autoTriggerEnabled 
              ? 'bg-amber-100 text-amber-900 border-amber-500 shadow-inner' 
              : 'bg-[#c0c0c0] text-gray-700'
          }`}
        >
          {autoTriggerEnabled ? (
            <>
              <Pause size={11} className="text-amber-700 animate-pulse" />
              <span className="hidden sm:inline">AUTO: ON</span>
            </>
          ) : (
            <>
              <Play size={11} className="text-gray-600" />
              <span className="hidden sm:inline">AUTO: OFF</span>
            </>
          )}
        </button>

        {/* Quick interrupt trigger button */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onQuickInterrupt();
          }}
          title="Simulate immediate household panic interrupt"
          className="win95-btn win95-btn-danger h-7 px-2 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <AlertCircle size={12} className="text-yellow-200 animate-bounce" />
          <span className="hidden sm:inline">PANIC!</span>
        </button>

        {/* Restart PC Boot Screen Button */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onRestartPC();
          }}
          title="Restart Tharavadu PC & Play Boot Animation / Chime"
          className="win95-btn h-7 px-1.5 text-[10px] font-bold text-slate-800 bg-[#c0c0c0] flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} className="text-blue-700" />
          <span className="hidden md:inline text-[10px]">RESTART</span>
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onToggleCrt();
          }}
          title={crtFilter ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
          className={`win95-btn h-7 px-1.5 flex items-center gap-1 cursor-pointer ${
            crtFilter ? 'win95-btn-pressed bg-emerald-100' : ''
          }`}
        >
          <Monitor size={13} className={crtFilter ? 'text-emerald-700' : 'text-gray-600'} />
          <span className="hidden md:inline text-[10px]">CRT</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            sounds.playKeyClick();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Retro Sound FX' : 'Unmute Retro Sound FX'}
          className="win95-btn h-7 px-1.5 flex items-center cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={13} className="text-gray-800" /> : <VolumeX size={13} className="text-red-600" />}
        </button>

        {/* Windows 95 Inset Tray: Stress & Clock */}
        <div className="win95-inset h-7 px-2 flex items-center gap-2 text-[11px] bg-white text-gray-900 font-mono">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-bold hidden sm:inline">AMMA:</span>
            <span className={`text-[10px] font-bold px-1 rounded ${getStressBadgeColor()}`}>
              {stress}%
            </span>
          </div>
          <div className="text-[10px] text-gray-400">|</div>
          <div className="font-bold tracking-wider">{clockTime}</div>
        </div>
      </div>
    </div>
  );
};
