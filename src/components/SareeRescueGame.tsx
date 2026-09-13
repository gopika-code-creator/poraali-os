import React, { useState, useEffect } from 'react';
import { CloudRain, Zap, Check, AlertTriangle, X, RefreshCw, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { ClothesLineItem } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface SareeRescueGameProps {
  onSuccess: (stressReduction: number, message: string) => void;
  onFailure: (stressPenalty: number, message: string) => void;
  onClose: () => void;
}

const INITIAL_CLOTHES: ClothesLineItem[] = [
  {
    id: 'kasavu_saree',
    name: "Amma's Gold Kasavu Saree",
    nameMalayalam: 'കസവു സാരി',
    type: 'saree',
    color: 'bg-amber-100 border-amber-400 text-amber-900',
    isCritical: true,
    isRescued: false,
    isWet: false
  },
  {
    id: 'school_uniform',
    name: 'Ironed School Uniform',
    nameMalayalam: 'സ്കൂൾ യൂണിഫോം',
    type: 'uniform',
    color: 'bg-sky-100 border-sky-400 text-sky-900',
    isCritical: true,
    isRescued: false,
    isWet: false
  },
  {
    id: 'achan_mundu',
    name: "Achan's Function Mundu",
    nameMalayalam: 'അച്ഛന്റെ മുണ്ട്',
    type: 'mundu',
    color: 'bg-stone-50 border-stone-400 text-stone-900',
    isCritical: false,
    isRescued: false,
    isWet: false
  },
  {
    id: 'thorthu_1',
    name: 'Nadan Cotton Thorthu',
    nameMalayalam: 'തോർത്ത്',
    type: 'towel',
    color: 'bg-rose-100 border-rose-400 text-rose-900',
    isCritical: false,
    isRescued: false,
    isWet: false
  },
  {
    id: 'vip_vest',
    name: 'VIP Rupa Banyan',
    nameMalayalam: 'ബനിയൻ',
    type: 'vest',
    color: 'bg-slate-100 border-slate-300 text-slate-800',
    isCritical: false,
    isRescued: false,
    isWet: false
  }
];

export const SareeRescueGame: React.FC<SareeRescueGameProps> = ({
  onSuccess,
  onFailure,
  onClose
}) => {
  const [clothes, setClothes] = useState<ClothesLineItem[]>(INITIAL_CLOTHES);
  const [timeLeft, setTimeLeft] = useState<number>(14);
  const [rainIntensity, setRainIntensity] = useState<number>(15);
  const [gameState, setGameState] = useState<'PLAYING' | 'VICTORY' | 'DEFEAT'>('PLAYING');
  const [lightningFlash, setLightningFlash] = useState<boolean>(false);
  const [basketCount, setBasketCount] = useState<number>(0);

  // Sound effects during game
  useEffect(() => {
    sounds.playThunder();
  }, []);

  // Timer & Rain progression loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (timeLeft <= 0) {
      evaluateEndGame();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));

      // Increase rain intensity
      setRainIntensity(prev => Math.min(100, prev + 6));

      // Occasional lightning strike & thunder
      if (Math.random() > 0.65) {
        setLightningFlash(true);
        sounds.playThunder();
        setTimeout(() => setLightningFlash(false), 200);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, timeLeft, clothes]);

  // Handle unpegging an item
  const handleRescueItem = (item: ClothesLineItem) => {
    if (gameState !== 'PLAYING' || item.isRescued || item.isWet) return;

    sounds.playSuccessChime();
    const updated = clothes.map(c => c.id === item.id ? { ...c, isRescued: true } : c);
    setClothes(updated);
    setBasketCount(prev => prev + 1);

    // Check if all are rescued
    if (updated.every(c => c.isRescued)) {
      setGameState('VICTORY');
      confetti({ particleCount: 70, spread: 60 });
      sounds.playStartup();
      onSuccess(35, "Ente ponnumon/mol saree nanayathe eduthallo! Da, choodu pazhampori tharam!");
    }
  };

  const evaluateEndGame = () => {
    // Wet any unrescued clothes
    const updated = clothes.map(c => c.isRescued ? c : { ...c, isWet: true });
    setClothes(updated);

    const criticalLost = updated.some(c => c.isCritical && c.isWet);
    const rescuedCount = updated.filter(c => c.isRescued).length;

    if (criticalLost) {
      setGameState('DEFEAT');
      sounds.playBsodCrash();
      onFailure(35, "Ayyayyo! Ente kasavu saree nananju kulamayi! Ini oru aazhcha njan aarodum mindilla!");
    } else if (rescuedCount >= 3) {
      setGameState('VICTORY');
      sounds.playStartup();
      onSuccess(20, "Saree rakshapettu! Bakki thorthu nananjalum kuzhappamilla.");
    } else {
      setGameState('DEFEAT');
      sounds.playErrorChord();
      onFailure(25, "Thuni motham nananju! Enthina njan ninne veettil nirthiyirikunne?");
    }
  };

  const restartGame = () => {
    setClothes(INITIAL_CLOTHES);
    setTimeLeft(14);
    setRainIntensity(15);
    setGameState('PLAYING');
    setBasketCount(0);
    sounds.playThunder();
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      {/* Retro Status HUD */}
      <div className="p-2 border-b border-gray-400 bg-[#dfdfdf] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="win95-inset bg-black text-red-500 font-mono px-2 py-1 text-sm font-bold tracking-wider">
            RAIN IN: {timeLeft}s
          </div>
          <div className="text-[11px] text-gray-800">
            Rescued: <span className="font-bold text-blue-900">{basketCount}/{clothes.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 font-bold uppercase">Cloud Density:</span>
          <div className="w-24 h-3.5 win95-inset bg-gray-200 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-300 ${
                rainIntensity > 70 ? 'bg-red-600 animate-pulse' : rainIntensity > 40 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${rainIntensity}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Stage (Terrace Clothesline) */}
      <div className={`flex-1 relative overflow-hidden flex flex-col justify-between p-3 transition-colors duration-200 ${
        lightningFlash ? 'bg-white' : 'bg-gradient-to-b from-slate-700 via-slate-600 to-slate-800'
      }`}>
        {/* Falling Rain Animation Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] animate-pulse" />
        </div>

        {/* Terrace Railing & Overhead Clouds */}
        <div className="flex items-center justify-between px-2 pt-1 text-slate-300 text-[10px] z-10">
          <div className="flex items-center gap-1">
            <CloudRain size={16} className="text-slate-300 animate-bounce" />
            <span className="font-bold">TERRACE 2ND FLOOR (EAST WING)</span>
          </div>
          <div className="text-yellow-300 font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle size={12} />
            <span>CRITICAL: AMMA'S KASAVU SAREE ON THE LINE!</span>
          </div>
        </div>

        {/* Clothesline Wire (Horizontal Cable) */}
        <div className="relative my-auto py-6">
          {/* Tension wire line */}
          <div className="w-full h-[2px] bg-slate-300 shadow-sm relative">
            {/* Clothespin clips */}
            <div className="absolute inset-x-0 -top-1.5 flex justify-around">
              {clothes.map((item) => (
                <div key={item.id} className="w-1.5 h-3 bg-amber-800 rounded-xs shadow-xs" />
              ))}
            </div>
          </div>

          {/* Hanging Clothes Items */}
          <div className="grid grid-cols-5 gap-2 pt-2 px-1">
            {clothes.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRescueItem(item)}
                className={`relative group cursor-pointer transition-all duration-200 flex flex-col items-center ${
                  item.isRescued 
                    ? 'opacity-20 scale-75 pointer-events-none' 
                    : item.isWet
                    ? 'opacity-80'
                    : 'hover:-translate-y-1 hover:scale-105'
                }`}
              >
                {/* Clothes Shape Card */}
                <div className={`w-full py-3 px-1 border-2 rounded-xs shadow-md flex flex-col items-center justify-between text-center relative ${
                  item.isWet 
                    ? 'bg-blue-900 border-blue-400 text-blue-200' 
                    : item.color
                }`}>
                  {/* Badge */}
                  {item.isCritical && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold text-[8px] px-1 rounded-full uppercase shadow-xs whitespace-nowrap">
                      PRIORITY!
                    </span>
                  )}

                  {/* Icon representation */}
                  <div className="text-lg my-1">
                    {item.type === 'saree' ? '🥻' : item.type === 'mundu' ? '🧺' : item.type === 'uniform' ? '👔' : item.type === 'towel' ? '🧣' : '🎽'}
                  </div>

                  <div className="text-[9px] font-bold leading-tight font-sans">
                    {item.nameMalayalam}
                  </div>
                  <div className="text-[8px] opacity-75 font-mono truncate max-w-full">
                    {item.name}
                  </div>

                  {/* State badge */}
                  {item.isRescued && (
                    <div className="absolute inset-0 bg-emerald-600/80 text-white flex items-center justify-center font-bold text-[10px]">
                      <Check size={16} />
                    </div>
                  )}
                  {item.isWet && (
                    <div className="absolute inset-0 bg-blue-950/85 text-red-300 flex flex-col items-center justify-center font-bold text-[9px] p-1">
                      <CloudRain size={14} className="text-blue-300 mb-0.5" />
                      <span>DRENCHED!</span>
                    </div>
                  )}
                </div>

                {/* Click Instruction Callout */}
                {!item.isRescued && !item.isWet && (
                  <span className="mt-1 text-[8px] bg-black/60 text-white px-1 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    CLICK UNPEG
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Laundry Basket & Ground Floor */}
        <div className="win95-inset bg-slate-900/80 p-2 text-white flex items-center justify-between rounded-[2px] z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <div>
              <div className="text-[11px] font-bold text-amber-300">
                Plastic Laundry Basket
              </div>
              <div className="text-[9px] text-slate-300">
                Rescued items safe from Kerala Monsoon: {basketCount} of {clothes.length}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-gray-400">Survival Reward:</span>
            <div className="text-[10px] font-bold text-emerald-400">
              -35% Amma Stress + Hot Pazhampori
            </div>
          </div>
        </div>

        {/* Game Over Banner Overlay */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-emerald-950/90 text-white flex flex-col items-center justify-center p-4 z-20 space-y-2 text-center animate-fade-in">
            <Award size={36} className="text-yellow-400 animate-bounce" />
            <h2 className="text-lg font-bold text-yellow-300">SAREE RESCUE MISSION ACCOMPLISHED!</h2>
            <p className="text-xs text-emerald-200 max-w-xs font-sans">
              "Ente ponnumon/mol saree nanayathe eduthallo! Da, choodu pazhampori tharam!"
            </p>
            <div className="text-[10px] bg-emerald-800 px-3 py-1 rounded font-mono text-white font-bold">
              AMMA STRESS REDUCED BY 35%
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={onClose}
                className="win95-btn px-4 py-1.5 text-xs font-bold text-gray-900 cursor-pointer"
              >
                Close & Return to OS
              </button>
              <button
                onClick={restartGame}
                className="win95-btn px-3 py-1.5 text-xs text-gray-900 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} /> Play Again
              </button>
            </div>
          </div>
        )}

        {gameState === 'DEFEAT' && (
          <div className="absolute inset-0 bg-red-950/95 text-white flex flex-col items-center justify-center p-4 z-20 space-y-2 text-center animate-fade-in">
            <ShieldAlert size={36} className="text-red-500 animate-pulse" />
            <h2 className="text-lg font-bold text-red-300">CATASTROPHIC TERRACE FLOOD!</h2>
            <p className="text-xs text-red-200 max-w-xs font-sans">
              "Ayyayyo! Ente kasavu saree nananju kulamayi! Ini oru aazhcha njan aarodum mindilla!"
            </p>
            <div className="text-[10px] bg-red-800 px-3 py-1 rounded font-mono text-white font-bold">
              AMMA STRESS INCREASED BY 35%
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={onClose}
                className="win95-btn px-4 py-1.5 text-xs font-bold text-gray-900 cursor-pointer"
              >
                Close & Face Consequences
              </button>
              <button
                onClick={restartGame}
                className="win95-btn px-3 py-1.5 text-xs text-gray-900 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} /> Retry Rescue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions footer */}
      <div className="p-2 border-t border-gray-400 bg-[#c0c0c0] flex items-center justify-between text-[10px] text-gray-700">
        <span>Click each clothes item rapidly to unpeg and toss into laundry basket before the monsoon arrives.</span>
        <button
          onClick={restartGame}
          className="win95-btn px-2 py-1 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={10} /> Reset
        </button>
      </div>
    </div>
  );
};
