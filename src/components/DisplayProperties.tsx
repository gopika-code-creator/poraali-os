import React from 'react';
import { Monitor, Palette, Sparkles, X, Check, RefreshCw, Flame } from 'lucide-react';
import { AmmaOperatingState } from '../types';
import { DitherPatternType, getDesktopBackground, getDesktopStyle } from '../utils/desktopTheme';
import { sounds } from '../utils/sound';

interface DisplayPropertiesProps {
  stress: number;
  state: AmmaOperatingState;
  patternOverride?: DitherPatternType;
  onSetPatternOverride: (pattern: DitherPatternType | undefined) => void;
  onSetStress: (newStress: number) => void;
  onClose: () => void;
}

export const DisplayProperties: React.FC<DisplayPropertiesProps> = ({
  stress,
  state,
  patternOverride,
  onSetPatternOverride,
  onSetStress,
  onClose
}) => {
  const currentTheme = getDesktopBackground(state, stress, patternOverride);
  const previewStyle = getDesktopStyle(state, stress, patternOverride);

  const patterns: { id: DitherPatternType | 'auto'; name: string; desc: string }[] = [
    { id: 'auto', name: 'Auto (Dynamic Amma State)', desc: 'Transitions pattern & palette according to Amma BP' },
    { id: 'weave', name: '50% Subtle Weave (Calm)', desc: 'Classic nostalgic Windows 95 stippling' },
    { id: 'dots', name: 'Dot Matrix (Surveillance)', desc: 'Radar scanline pattern for tupperware audit' },
    { id: 'crosshatch', name: 'Crosshatch (Monsoon Panic)', desc: 'Dense turbulence for terrace saree drying' },
    { id: 'angry', name: 'Angry Maternal Alert (Red)', desc: 'High-contrast checkerboard alert for 90%+ stress' },
    { id: 'checker', name: 'Standard 2x2 Checker', desc: 'Authentic 1995 pixel grid' },
    { id: 'solid', name: 'Solid Color (No Dither)', desc: 'Flat retro color without mask' }
  ];

  const presets = [
    { label: 'Calm Chaya (25%)', stress: 25, tip: 'Classic Teal #008080' },
    { label: 'Suspicious Scan (55%)', stress: 55, tip: 'Olive-Teal #164e43' },
    { label: 'Terrace Panic (82%)', stress: 82, tip: 'Rust Amber #803800' },
    { label: '🔥 Angry Red Alert (94%)', stress: 94, tip: 'Angry Maroon #800000 (>90%)' },
    { label: '💥 100% BSOD Lockout', stress: 100, tip: 'Critical Crimson #660000' }
  ];

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      {/* Tabs */}
      <div className="flex border-b border-gray-400 px-2 pt-1 gap-1 text-[11px]">
        <div className="win95-box border-b-0 px-3 py-1 bg-[#c0c0c0] font-bold text-gray-900 -mb-[2px] z-10">
          Background & Pattern
        </div>
        <div className="px-3 py-1 text-gray-500 cursor-default">
          Screen Saver
        </div>
        <div className="px-3 py-1 text-gray-500 cursor-default">
          Appearance
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
        {/* Mock CRT Monitor Preview */}
        <div className="flex flex-col items-center">
          <div className="w-56 h-36 bg-[#808080] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-700 p-2 rounded-xs shadow-md flex flex-col items-center justify-between">
            {/* CRT Screen Bezel */}
            <div className="w-full h-28 bg-[#111] p-1.5 rounded-[3px] border border-gray-900 flex items-center justify-center shadow-inner relative overflow-hidden">
              {/* Dynamic Live Desktop Background in CRT */}
              <div 
                className="w-full h-full border border-gray-600 rounded-[2px] relative flex flex-col justify-between p-1 transition-colors duration-500"
                style={previewStyle}
              >
                {/* Mini desktop icons */}
                <div className="space-y-1">
                  <div className="w-2.5 h-2.5 bg-yellow-200 border border-black shadow-xs" />
                  <div className="w-2.5 h-2.5 bg-blue-300 border border-black shadow-xs" />
                </div>
                {/* Mini window inside screen */}
                <div className="self-center w-24 h-12 bg-[#c0c0c0] border border-black p-0.5 shadow-sm">
                  <div className="h-2 bg-[#000080] text-[6px] text-white px-0.5 flex items-center justify-between">
                    <span>AMMA_SYS</span>
                  </div>
                  <div className="text-[5px] text-black p-0.5 font-mono leading-none truncate">
                    {stress}% {state}
                  </div>
                </div>
                {/* Mini taskbar */}
                <div className="w-full h-2 bg-[#c0c0c0] border-t border-white flex items-center px-0.5 justify-between text-[5px]">
                  <span className="font-bold">Start</span>
                  <span>16:05</span>
                </div>

                {/* Angry Red Alert Indicator on Screen */}
                {currentTheme.isAngryRed && (
                  <div className="absolute inset-0 bg-red-600/15 pointer-events-none animate-pulse" />
                )}
              </div>
            </div>

            {/* Monitor Stand Base */}
            <div className="w-16 h-2 bg-[#999] border-t border-white border-b border-black rounded-b-xs" />
          </div>
          <div className="text-[10px] text-gray-700 mt-1 flex items-center gap-1 font-bold">
            <span>CURRENT PATTERN:</span>
            <span className={currentTheme.isAngryRed ? 'text-red-700 font-black' : 'text-teal-900'}>
              {currentTheme.patternName}
            </span>
          </div>
        </div>

        {/* Amma Stress to Desktop Color Mapping Banner */}
        <div className={`win95-inset p-2 flex items-center justify-between gap-2 ${
          currentTheme.isAngryRed ? 'bg-red-50 border-red-400 text-red-950' : 'bg-yellow-50 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center gap-1.5">
            {currentTheme.isAngryRed ? (
              <Flame size={18} className="text-red-600 animate-bounce" />
            ) : (
              <Palette size={18} className="text-teal-700" />
            )}
            <div>
              <div className="font-bold text-[11px] leading-tight">
                {currentTheme.isAngryRed 
                  ? '🔥 ANGRY RED (>90% STRESS ACTIVE)' 
                  : 'TEAL #008080 DYNAMIC PROTOCOL'}
              </div>
              <div className="text-[10px] text-gray-700 font-sans">
                {currentTheme.isAngryRed
                  ? 'Desktop color switched from Teal (#008080) to Intense Angry Red (#800000) with Rage Dither!'
                  : 'Desktop dynamically shifts as Amma stress rises: Teal (Calm) → Olive (Scan) → Rust (Panic) → Angry Red (>90%).'}
              </div>
            </div>
          </div>
          <div 
            className="w-7 h-7 border-2 border-black rounded-xs shadow-inner flex-shrink-0"
            style={{ backgroundColor: currentTheme.backgroundColor }}
            title={`Active Hex: ${currentTheme.backgroundColor}`}
          />
        </div>

        {/* Quick Stress Test Controls */}
        <div className="win95-box p-2 bg-[#dfdfdf] space-y-1.5">
          <div className="font-bold text-[10px] text-gray-700 uppercase tracking-wider flex items-center justify-between">
            <span>Test Maternal Stress Levels:</span>
            <span className="font-mono font-bold text-blue-900">{stress}%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playKeyClick();
                  onSetStress(p.stress);
                }}
                className={`win95-btn py-1 px-1 text-[10px] font-mono cursor-pointer transition-none text-center ${
                  stress === p.stress ? 'win95-btn-pressed bg-gray-300 font-bold' : ''
                } ${p.stress >= 90 ? 'text-red-700 hover:bg-red-50' : 'text-gray-800'}`}
                title={p.tip}
              >
                <div className="truncate font-bold">{p.stress}%</div>
                <div className="text-[8px] text-gray-500 truncate">{p.label.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dither Pattern Selection Table */}
        <div className="space-y-1">
          <div className="font-bold text-[10px] text-gray-700 uppercase tracking-wider">
            Retro Dither Mask Style:
          </div>
          <div className="win95-inset bg-white p-1 max-h-32 overflow-y-auto space-y-0.5">
            {patterns.map((item) => {
              const isSelected = item.id === 'auto' ? !patternOverride : patternOverride === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playKeyClick();
                    onSetPatternOverride(item.id === 'auto' ? undefined : item.id as DitherPatternType);
                  }}
                  className={`px-2 py-1 flex items-center justify-between cursor-pointer text-[11px] rounded-[1px] ${
                    isSelected ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3">
                      {isSelected ? <Check size={12} /> : ''}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className={`text-[9px] ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dialog Footer Actions */}
      <div className="p-2 border-t border-gray-400 flex items-center justify-between bg-[#c0c0c0]">
        <div className="text-[9px] text-gray-600 font-mono">
          Color: <span className="font-bold text-gray-900">{currentTheme.backgroundColor}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playKeyClick();
              onSetPatternOverride(undefined);
            }}
            className="win95-btn px-2 py-1 text-[11px] cursor-pointer flex items-center gap-1"
            title="Reset to automatic Amma state dither"
          >
            <RefreshCw size={10} />
            <span>Reset Auto</span>
          </button>
          <button
            onClick={() => {
              sounds.playKeyClick();
              onClose();
            }}
            className="win95-btn px-3 py-1 text-[11px] font-bold cursor-pointer"
          >
            OK
          </button>
          <button
            onClick={() => {
              sounds.playKeyClick();
              onClose();
            }}
            className="win95-btn px-3 py-1 text-[11px] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
