import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import { ShieldAlert, Activity, Cpu } from 'lucide-react';

interface TaskManagerProps {
  onClose: () => void;
  stress: number;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onClose, stress }) => {
  const [selectedProcess, setSelectedProcess] = useState<string>('AMMA_KERNEL.SYS');
  const [activeTab, setActiveTab] = useState<'processes' | 'performance'>('processes');
  const [denialAlert, setDenialAlert] = useState<string | null>(null);

  const processes = [
    { name: 'AMMA_KERNEL.SYS', pid: 0, cpu: `${Math.min(99, stress + 10)}%`, memory: 'Priceless', status: 'HYPER_VIGILANT', immutable: true },
    { name: 'MAZHA.EXE', pid: 110, cpu: '12%', memory: '1.4 MB', status: 'LISTENING_THUNDER', immutable: false },
    { name: 'KSEB_GRID_TRIP', pid: 220, cpu: '4%', memory: '512 KB', status: 'STANDBY', immutable: false },
    { name: 'TUPPERWARE_AUDIT', pid: 330, cpu: '45%', memory: '8.2 MB', status: 'SEARCHING_SHAJI', immutable: false },
    { name: 'PHONE_ADDICTION', pid: 999, cpu: '92%', memory: '99% BRAIN', status: 'CRITICAL_LEAK', immutable: false },
    { name: 'GUEST_RADAR', pid: 440, cpu: '18%', memory: '2.1 MB', status: 'SITOUT_SCAN', immutable: false },
    { name: 'CHAYA_PIPELINE', pid: 550, cpu: '8%', memory: '3.4 MB', status: 'BREWING_TEA', immutable: false }
  ];

  const handleEndTask = () => {
    sounds.playErrorChord();
    if (selectedProcess === 'AMMA_KERNEL.SYS') {
      setDenialAlert("ACCESS DENIED: Ninte achanod poi parayada! Amma-ne terminate cheyyan ulla root permissions ninte ee dabba computer-il illa!");
    } else if (selectedProcess === 'PHONE_ADDICTION') {
      setDenialAlert("PROCESS LOCKED: Phone addict aayathil pinne switch-off cheyyan thoniyilla! Amma will enforce physical confiscation instead.");
    } else {
      setDenialAlert(`PROCESS REFUSED: Amma intercepted SIGKILL for ${selectedProcess}. Reason: 'Ivide njan parayunnath kettal mathi!'`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-[#c0c0c0] border-b border-gray-400">
        <button
          onClick={() => setActiveTab('processes')}
          className={`px-3 py-1 text-xs font-bold border-t-2 border-l-2 border-r-2 cursor-pointer ${
            activeTab === 'processes'
              ? 'bg-[#c0c0c0] border-white border-b-0 -mb-[1px] z-10'
              : 'bg-gray-300 border-gray-400 text-gray-600'
          }`}
        >
          Processes
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-1 text-xs font-bold border-t-2 border-l-2 border-r-2 cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-[#c0c0c0] border-white border-b-0 -mb-[1px] z-10'
              : 'bg-gray-300 border-gray-400 text-gray-600'
          }`}
        >
          Performance
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-2 bg-[#c0c0c0] flex flex-col gap-2 overflow-hidden">
        {activeTab === 'processes' ? (
          <>
            <div className="win95-inset bg-white flex-1 overflow-y-auto p-1 font-mono text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400 text-gray-800 text-[10px]">
                    <th className="p-1">Image Name</th>
                    <th className="p-1">PID</th>
                    <th className="p-1">CPU</th>
                    <th className="p-1">Memory</th>
                    <th className="p-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p) => {
                    const isSelected = selectedProcess === p.name;
                    return (
                      <tr
                        key={p.pid}
                        onClick={() => setSelectedProcess(p.name)}
                        className={`cursor-pointer ${
                          isSelected ? 'bg-[#000080] text-white' : 'hover:bg-blue-50 text-gray-900'
                        }`}
                      >
                        <td className="p-1 font-bold">{p.name}</td>
                        <td className="p-1">{p.pid}</td>
                        <td className="p-1">{p.cpu}</td>
                        <td className="p-1">{p.memory}</td>
                        <td className="p-1 text-[10px]">{p.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {denialAlert && (
              <div className="win95-box p-2 bg-red-100 text-red-900 flex items-start gap-2 border border-red-400">
                <ShieldAlert size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] leading-tight font-bold">
                  {denialAlert}
                </div>
                <button
                  onClick={() => setDenialAlert(null)}
                  className="text-xs font-bold text-red-700 hover:text-red-900 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-gray-700">
                Selected: <span className="font-bold">{selectedProcess}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleEndTask}
                  className="win95-btn px-3 py-1 font-bold text-xs bg-red-100 hover:bg-red-200 text-red-950 cursor-pointer"
                >
                  End Task
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="win95-inset bg-[#0a0e14] text-emerald-400 p-3 flex-1 flex flex-col gap-3 font-mono">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="win95-box bg-slate-900 p-2 text-slate-200 border border-slate-700">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Cpu size={12} /> AMMA CPU UTILIZATION
                </div>
                <div className="text-lg font-bold text-amber-400 mt-1">{stress}%</div>
                <div className="text-[10px] text-slate-400">High moral arbitration load</div>
              </div>

              <div className="win95-box bg-slate-900 p-2 text-slate-200 border border-slate-700">
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity size={12} /> USER BRAIN CAPACITY
                </div>
                <div className="text-lg font-bold text-red-400 mt-1">0%</div>
                <div className="text-[10px] text-slate-400">According to Amma diagnosis</div>
              </div>
            </div>

            <div className="win95-inset bg-slate-950 p-2 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-amber-300 border-b border-slate-800 pb-1">
                SYSTEM TELEMETRY AUDIT:
              </div>
              <div>• Screen Time Debt: 14 hours 28 mins today</div>
              <div>• Missing Tupperware Containers: 2 (Defcon 1)</div>
              <div>• Current Feeder Status: 230V Single-Phase</div>
              <div>• Chaya Intake Today: 3 glasses (Sugar-less preferred)</div>
              <div>• Engineering Degree ROI: 0.04%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
