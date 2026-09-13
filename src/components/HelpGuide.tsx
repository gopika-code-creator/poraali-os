import React, { useState } from 'react';
import { HelpCircle, BookOpen, ShieldAlert, Terminal, Coffee, Sparkles, X, ChevronRight, Play } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HelpGuideProps {
  onClose: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export const HelpGuide: React.FC<HelpGuideProps> = ({ onClose, onExecuteCommand }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'states' | 'commands' | 'daemons' | 'tips'>('basics');

  const handleRun = (cmd: string) => {
    sounds.playKeyClick();
    onExecuteCommand(cmd);
  };

  const commandCategories = [
    {
      category: '☕ Tea & Snacks (Stress Reducers)',
      items: [
        { cmd: 'tea --brew', desc: 'Brews strong cardamom tea. Amma loves this.', stress: '-20%' },
        { cmd: 'snack --parippuvada', desc: 'Request or serve hot parippuvada/pazham pori.', stress: '-15%' },
        { cmd: 'glass --wash', desc: 'Wash unwashed tea glasses in the adukkala sink.', stress: '-10%' },
      ]
    },
    {
      category: '🧺 Chores & Household Duties',
      items: [
        { cmd: 'thuni --fetch', desc: 'Fetch clothes from terrace line before rain hits.', stress: '-20%' },
        { cmd: 'clean --room --fast', desc: 'Tidy up bedsheet, hide tangled cables.', stress: '-15%' },
        { cmd: 'find --bottle', desc: 'Locate Dubai-imported Milton Tupperware bottle.', stress: '-15%' },
        { cmd: 'plants --water', desc: 'Water the thulasi and sit-out potted plants.', stress: '-10%' },
      ]
    },
    {
      category: '📱 Survival & De-escalation',
      items: [
        { cmd: 'phone --hide', desc: 'Put phone face down or hide under pillow.', stress: '-10%' },
        { cmd: 'study --psc', desc: 'Pretend to prepare for Kerala PSC / Bank exams.', stress: '-25%' },
        { cmd: 'apologize --promise:study', desc: 'Humble apology and promise to reform.', stress: '-20%' },
        { cmd: 'reboot --tea-bribe --calm', desc: 'Emergency reset with a double milk tea bribe.', stress: '-30%' },
      ]
    },
    {
      category: '⚡ Hardware & Danger Tests',
      items: [
        { cmd: 'kseb --fuse-check', desc: 'Inspect fuse carrier and silence screaming inverter.', stress: '-15%' },
        { cmd: 'biscuit --goodday', desc: 'Serve emergency Britannia Good Day to visitors.', stress: '-20%' },
        { cmd: 'bsod', desc: 'Simulate 100% Stress Blue Screen of Death (BSOD).', stress: '100% 💥' },
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col font-sans select-none bg-[#c0c0c0]">
      {/* Retro Menu Bar */}
      <div className="flex items-center gap-3 px-2 py-1 text-xs border-b border-gray-400 bg-[#c0c0c0] text-gray-700">
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Edit</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Bookmark</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer font-bold">Options</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-400 bg-gray-200 text-xs font-mono">
        <button
          onClick={() => setActiveTab('basics')}
          className={`px-3 py-1 border-t-2 border-l-2 border-r-2 rounded-t font-bold cursor-pointer ${
            activeTab === 'basics'
              ? 'bg-[#c0c0c0] border-white text-blue-900 shadow-inner'
              : 'bg-gray-300 border-gray-400 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📘 Goal & Rules
        </button>
        <button
          onClick={() => setActiveTab('commands')}
          className={`px-3 py-1 border-t-2 border-l-2 border-r-2 rounded-t font-bold cursor-pointer ${
            activeTab === 'commands'
              ? 'bg-[#c0c0c0] border-white text-blue-900 shadow-inner'
              : 'bg-gray-300 border-gray-400 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⌨️ Commands Cheatsheet
        </button>
        <button
          onClick={() => setActiveTab('states')}
          className={`px-3 py-1 border-t-2 border-l-2 border-r-2 rounded-t font-bold cursor-pointer ${
            activeTab === 'states'
              ? 'bg-[#c0c0c0] border-white text-blue-900 shadow-inner'
              : 'bg-gray-300 border-gray-400 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🌡️ 4 Amma States
        </button>
        <button
          onClick={() => setActiveTab('daemons')}
          className={`px-3 py-1 border-t-2 border-l-2 border-r-2 rounded-t font-bold cursor-pointer ${
            activeTab === 'daemons'
              ? 'bg-[#c0c0c0] border-white text-blue-900 shadow-inner'
              : 'bg-gray-300 border-gray-400 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🚨 Daemons & Radar
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-3 overflow-y-auto win95-inset bg-white text-gray-900 text-xs font-sans leading-relaxed">
        {/* Tab 1: Basics */}
        {activeTab === 'basics' && (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-300 p-2.5 rounded text-yellow-900">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-yellow-800">
                <Sparkles size={14} className="text-amber-600" />
                The Golden Rule of Tharavadu 95
              </h3>
              <p className="mt-1">
                Your mother is the central system kernel (<code className="bg-yellow-200 px-1 font-mono">AMMA_KERNEL.SYS</code>, PID 0).
                Your mission is to <strong>keep her Stress Level below 100%</strong> by running household commands, solving crises, and obeying timed maternal interrupts!
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase text-gray-700 tracking-wider">How to Play:</h4>
              <ul className="space-y-1.5 list-disc pl-4 text-gray-700">
                <li>
                  <strong>Type or Click Commands:</strong> You don't need to memorize anything! You can click any suggested action button below the terminal, or type in commands like <code className="bg-gray-100 px-1 font-mono text-emerald-700">tea --brew</code>.
                </li>
                <li>
                  <strong>Watch the Stress Gauge:</strong> The analog meter in the right sidebar measures Amma's blood pressure and suspicion. If it reaches <strong>100%</strong>, the system triggers the <strong>Blue Screen of Death (BSOD)</strong>.
                </li>
                <li>
                  <strong>Handle Timed Daemons:</strong> Random household emergencies will pop up (e.g. rain hitting terrace clothes, power tripping, relatives arriving). Resolve them before the timer runs out!
                </li>
                <li>
                  <strong>Hear Amma's Voice:</strong> Toggle the <code className="bg-gray-100 px-1 font-mono">AMMA_AUDIO</code> button at the top of the terminal to have Amma's dialogues read out loud via voice synthesis.
                </li>
              </ul>
            </div>

            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-900 flex items-center justify-between">
              <div>
                <span className="font-bold">Ready to test a command right now?</span>
                <p className="text-[11px] text-blue-700">Brewing cardamom tea is the safest way to calm Amma.</p>
              </div>
              <button
                onClick={() => handleRun('tea --brew')}
                className="win95-btn px-2.5 py-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 flex items-center gap-1 text-amber-900 cursor-pointer"
              >
                <Coffee size={12} />
                <span>Run `tea --brew`</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Commands Cheatsheet */}
        {activeTab === 'commands' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-gray-200">
              <p className="text-gray-600 text-[11px]">
                Click <span className="font-bold text-blue-700">RUN</span> on any command below to execute it immediately in the terminal!
              </p>
            </div>

            <div className="space-y-3">
              {commandCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1 bg-gray-100 p-1 border-l-2 border-blue-700">
                    {cat.category}
                  </h4>
                  <div className="space-y-1">
                    {cat.items.map((item, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-center justify-between p-1.5 bg-slate-50 hover:bg-blue-50 border border-gray-200 rounded text-[11px]"
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1 border border-emerald-200 rounded">
                              {item.cmd}
                            </code>
                            <span className={`px-1 rounded text-[10px] font-bold ${
                              item.stress.includes('100%') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'
                            }`}>
                              {item.stress}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-0.5 text-[10px]">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleRun(item.cmd)}
                          className="win95-btn px-2 py-0.5 text-[10px] font-bold text-blue-900 hover:bg-blue-100 flex items-center gap-1 cursor-pointer flex-shrink-0"
                        >
                          <Play size={10} className="text-blue-700 fill-blue-700" />
                          <span>RUN</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: States */}
        {activeTab === 'states' && (
          <div className="space-y-3">
            <p className="text-gray-600">
              Amma transitions through four distinct psychological states based on the stress level:
            </p>

            <div className="space-y-2">
              <div className="p-2 border-l-4 border-emerald-500 bg-emerald-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">1. CALM_CHAYA (10% – 35% Stress)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">OPTIMAL</span>
                </div>
                <p className="text-emerald-800 text-[11px] mt-1">
                  Amma is humming classical Carnatic songs, slicing ripe bananas for pazham pori, and issuing mild reminders to wash lunchboxes.
                </p>
              </div>

              <div className="p-2 border-l-4 border-amber-500 bg-amber-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">2. SUSPICIOUS_SCAN (40% – 70% Stress)</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">WARNING</span>
                </div>
                <p className="text-amber-800 text-[11px] mt-1">
                  Amma is eye-tracking your computer screen from the adukkala door. She suspects you are chatting with friends instead of studying for competitive exams.
                </p>
              </div>

              <div className="p-2 border-l-4 border-orange-500 bg-orange-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-900">3. PREEMPTIVE_PANIC (75% – 95% Stress)</span>
                  <span className="text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.2 rounded font-bold">CRITICAL</span>
                </div>
                <p className="text-orange-800 text-[11px] mt-1">
                  Spice container lids slamming. Rapid pacing. Any rain cloud, power cut, or missing Milton flask will immediately be attributed to your phone addiction.
                </p>
              </div>

              <div className="p-2 border-l-4 border-red-600 bg-red-50 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">4. MARTYR_MODE (100% Lockout & BSOD)</span>
                  <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-bold">FATAL CRASH</span>
                </div>
                <p className="text-red-800 text-[11px] mt-1">
                  Refuses all human assistance: <em>"Ningal aarum enikku oru sahayam cheyyanda! Njan ivide kidannu thulanj potte!"</em>. Triggers full-screen retro Blue Screen of Death.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Daemons */}
        {activeTab === 'daemons' && (
          <div className="space-y-3">
            <p className="text-gray-600">
              Household daemons execute in the background and pop up as urgent modal dialogs:
            </p>

            <div className="space-y-2">
              <div className="p-2 border border-blue-200 rounded bg-blue-50">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  🌧️ MAZHA.EXE (Monsoon Cloudburst)
                </span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Dark clouds gather over Tharavadu. You have 25 seconds to collect clothes from the terrace before Amma's wedding silk saree gets soaked.
                </p>
              </div>

              <div className="p-2 border border-amber-200 rounded bg-amber-50">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  ⚡ KSEB_TRIP (Line Voltage Collapse)
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  The inverter screams. Amma instantly accuses your phone charger of bringing down the entire sub-station grid. Check the fuse or unplug immediately!
                </p>
              </div>

              <div className="p-2 border border-purple-200 rounded bg-purple-50">
                <span className="font-bold text-purple-900 flex items-center gap-1">
                  📡 GUEST_RADAR (Unannounced Relatives)
                </span>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Sukumaran Ammavan arrives on his Bajaj Chetak. Prepare Sulaimani tea and hide in the bedroom or answer probing questions about your salary.
                </p>
              </div>

              <div className="p-2 border border-emerald-200 rounded bg-emerald-50">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  🫖 CHAYA_PIPELINE (4:00 PM Deadline)
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Tea is boiling. Accept the hot cup, eat snacks, and immediately put the used glass in the sink to avoid escalation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-2 py-1 bg-[#c0c0c0] border-t border-white text-[11px] text-gray-700 flex items-center justify-between font-mono">
        <span>Press ESC or close button to exit</span>
        <button
          onClick={onClose}
          className="win95-btn px-2 py-0.5 text-xs font-bold text-black"
        >
          OK
        </button>
      </div>
    </div>
  );
};
