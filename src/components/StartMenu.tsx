import React from 'react';
import { Terminal, Activity, Package, Radio, RotateCcw, HelpCircle, Shield, Sparkles, Monitor, CloudRain, MessageSquare, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/sound';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: string) => void;
  onReboot: () => void;
  onTriggerDaemon: (daemon: string) => void;
  onTriggerBsod: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenWindow,
  onReboot,
  onTriggerDaemon,
  onTriggerBsod
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-9 left-1 w-64 win95-box shadow-2xl z-50 flex font-mono text-xs select-none">
      {/* Left blue decorative vertical banner with "Tharavadu 95" */}
      <div className="w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-3 text-white font-bold tracking-widest text-sm shadow-inner">
        <span className="transform -rotate-90 origin-center whitespace-nowrap text-gray-200">
          THARAVADU 95
        </span>
      </div>

      {/* Main menu items */}
      <div className="flex-1 bg-[#c0c0c0] p-1 flex flex-col gap-0.5">
        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('terminal');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <Terminal size={14} className="text-emerald-700" />
          <span className="font-bold">AMMA_KERNEL Console</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('taskmgr');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <Activity size={14} className="text-blue-700" />
          <span>Task Manager</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('tupperware');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <Package size={14} className="text-amber-700" />
          <span>Tupperware & Milton Log</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('radar');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <Radio size={14} className="text-purple-700" />
          <span>Sit-Out Relative Sonar</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('help');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <HelpCircle size={14} className="text-yellow-600" />
          <span className="font-bold">Survival Guide & Cheatsheet</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('display');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <Monitor size={14} className="text-teal-700" />
          <span>Display Properties [Desk.cpl]</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('saree');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <CloudRain size={14} className="text-blue-600" />
          <span className="font-bold text-blue-950">MAZHA_RUN.EXE (Saree Rescue)</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('kudumbam');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <MessageSquare size={14} className="text-emerald-700" />
          <span>Kudumbam 95 (Family WhatsApp)</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onOpenWindow('achan');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <ShieldCheck size={14} className="text-amber-700" />
          <span>ACHAN_DAEMON.SYS (Intermediary)</span>
        </button>

        <div className="border-t border-gray-400 my-1"></div>

        {/* Daemon interrupt triggers */}
        <div className="px-2 py-0.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
          SIMULATE HOUSE INTERRUPT:
        </div>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onTriggerDaemon('MAZHA.EXE');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white text-gray-800 rounded-[1px] cursor-pointer text-left text-[11px]"
        >
          <Sparkles size={12} className="text-blue-600" />
          <span>Trigger MAZHA.EXE (Rain)</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onTriggerDaemon('KSEB_TRIP');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white text-gray-800 rounded-[1px] cursor-pointer text-left text-[11px]"
        >
          <Sparkles size={12} className="text-amber-600" />
          <span>Trigger KSEB_TRIP (Power Cut)</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onTriggerDaemon('GUEST_RADAR');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white text-gray-800 rounded-[1px] cursor-pointer text-left text-[11px]"
        >
          <Sparkles size={12} className="text-purple-600" />
          <span>Trigger GUEST_RADAR (Ammavan)</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onTriggerDaemon('TUPPERWARE_INTEGRITY');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white text-gray-800 rounded-[1px] cursor-pointer text-left text-[11px]"
        >
          <Sparkles size={12} className="text-red-600" />
          <span>Trigger TUPPERWARE Audit</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeyClick();
            onTriggerDaemon('CHAYA_PIPELINE');
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white text-gray-800 rounded-[1px] cursor-pointer text-left text-[11px]"
        >
          <Sparkles size={12} className="text-amber-700" />
          <span>Trigger 4 PM CHAYA PIPELINE</span>
        </button>

        <button
          onClick={() => {
            onTriggerBsod();
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1 bg-red-100 hover:bg-red-800 hover:text-white text-red-900 rounded-[1px] cursor-pointer text-left text-[11px] font-bold"
        >
          <Shield size={12} className="text-red-600" />
          <span>Simulate 100% BSOD Panic</span>
        </button>

        <div className="border-t border-gray-400 my-1"></div>

        <button
          onClick={() => {
            sounds.playStartup();
            onReboot();
            onClose();
          }}
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-gray-900 rounded-[1px] cursor-pointer text-left"
        >
          <RotateCcw size={14} className="text-emerald-600" />
          <span>Reboot Tharavadu OS</span>
        </button>
      </div>
    </div>
  );
};
