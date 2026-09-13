import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DaemonInterrupt } from '../types';
import { sounds } from '../utils/sound';
import { AlertTriangle, Clock, CloudRain, Zap, Users, Package, Coffee } from 'lucide-react';

interface InterruptModalProps {
  interrupt: DaemonInterrupt;
  onResolve: (actionCommand: string) => void;
  onTimeout: () => void;
}

export const InterruptModal: React.FC<InterruptModalProps> = ({
  interrupt,
  onResolve,
  onTimeout
}) => {
  const [timeLeft, setTimeLeft] = useState(interrupt.countdownSeconds);
  const hasResolvedRef = React.useRef(false);

  useEffect(() => {
    // Play appropriate sound when interrupt appears
    if (interrupt.type === 'MAZHA.EXE') {
      sounds.playThunder();
    } else if (interrupt.type === 'KSEB_TRIP') {
      sounds.playInverterBeep();
    } else if (interrupt.type === 'CHAYA_PIPELINE') {
      sounds.playPressureCooker();
    } else {
      sounds.playErrorChord();
    }
  }, [interrupt.type]);

  // Countdown timer effect - strictly avoids calling onTimeout inside a state updater
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasResolvedRef.current) {
        hasResolvedRef.current = true;
        onTimeout();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
      if (interrupt.type === 'KSEB_TRIP' && (timeLeft - 1) % 4 === 0) {
        sounds.playInverterBeep();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, interrupt.type, onTimeout]);

  const handleAction = (cmd: string) => {
    if (hasResolvedRef.current) return;
    hasResolvedRef.current = true;
    onResolve(cmd);
  };

  const getDaemonIcon = () => {
    switch (interrupt.type) {
      case 'MAZHA.EXE':
        return <CloudRain size={28} className="text-blue-600" />;
      case 'KSEB_TRIP':
        return <Zap size={28} className="text-amber-500" />;
      case 'GUEST_RADAR':
        return <Users size={28} className="text-purple-600" />;
      case 'TUPPERWARE_INTEGRITY':
        return <Package size={28} className="text-red-600" />;
      case 'CHAYA_PIPELINE':
        return <Coffee size={28} className="text-amber-700" />;
    }
  };

  const percentLeft = (timeLeft / interrupt.countdownSeconds) * 100;
  const isUrgent = timeLeft <= 8;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <motion.div 
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={isUrgent ? { scale: 1, opacity: 1, x: [-2, 2, -2, 2, 0] } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: isUrgent ? 0.25 : 0.2, repeat: isUrgent ? Infinity : 0 }}
        className="win95-box max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Windows 95 Critical Title Bar */}
        <div className="win95-titlebar px-2.5 py-1 flex items-center justify-between font-bold text-xs">
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle size={14} className="text-yellow-300" />
            </motion.div>
            <span>{interrupt.title}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono bg-red-900/80 px-1.5 py-0.5 rounded text-yellow-200">
            <Clock size={11} />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Dialog Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3.5">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="p-2 bg-yellow-100 border-2 border-yellow-400 rounded-sm flex-shrink-0 shadow-sm"
            >
              {getDaemonIcon()}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-red-900">
                CRITICAL DAEMON FAULT: {interrupt.type}
              </h4>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug">
                {interrupt.description}
              </p>
            </div>
          </div>

          {/* Amma's reaction quote */}
          <div className="win95-inset p-2.5 bg-amber-50 border border-amber-300">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-0.5">
              AMMA_KERNEL IMMEDIATE DIRECTIVE:
            </div>
            <p className="text-xs font-bold text-amber-950 font-serif italic leading-relaxed">
              &ldquo;{interrupt.dialogueTrigger}&rdquo;
            </p>
          </div>

          {/* Urgent Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-gray-600 mb-1">
              <span>TIME BEFORE CATASTROPHIC STRESS OVERFLOW:</span>
              <span className={`font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                {timeLeft}s REMAINING
              </span>
            </div>
            <div className="win95-inset bg-gray-200 h-4 p-0.5 overflow-hidden">
              <motion.div
                className={`h-full ${
                  percentLeft < 30 ? 'bg-red-600' : percentLeft < 60 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                animate={{ width: `${percentLeft}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2.5 border-t border-gray-400">
            <button
              onClick={() => handleAction(interrupt.primaryAction)}
              className="win95-btn win95-btn-emerald flex-1 py-2 px-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{interrupt.primaryAction}</span>
              <span className="text-[10px] text-emerald-200 font-normal">(Avert Disaster)</span>
            </button>
            <button
              onClick={() => handleAction(interrupt.secondaryAction)}
              className="win95-btn win95-btn-danger flex-1 py-2 px-3 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{interrupt.secondaryAction}</span>
              <span className="text-[10px] text-red-200 font-normal">(High Risk)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
