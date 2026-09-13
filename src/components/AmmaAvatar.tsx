import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AmmaOperatingState } from '../types';

interface AmmaAvatarProps {
  state: AmmaOperatingState;
  stress: number;
}

const AMBIENT_MOM_THOUGHTS = {
  CALM_CHAYA: [
    "Chaya kudippikkan vendi ee adukkalayil njan kidannu kashtappadunnu...",
    "Kannan Devan tea dust thilakkunnu... aa Harivarasanam paattu kelkkumbo oru aashwasam.",
    "Naalu mani aayi, pazhampori choodode kazhicho chekka.",
    "Achan varumbol kurachu choodu vellam eduthu vekkanam."
  ],
  SUSPICIOUS_SCAN: [
    "Innale rathri 2 mani vare aarodaa chat cheythath?",
    "Aa screen glow kandittu ente kannil theeyanu! Phone pillow-inte adiyil vecho?",
    "Milton Tupperware bottle evide ennu chodichaal ivanu vaaya thurakkan vayya!",
    "Kannu thallichu nokkunnath kando? Pusthakam thurannaal udane urakkam varum!"
  ],
  PREEMPTIVE_PANIC: [
    "Mazha kaaruthu! Thuni nananjal rendineyum koodi adichu purathaakkum!",
    "KSEB current cut aavum munpe mixie adichu theerkkanam! Fan off cheyyeda!",
    "Ayyoo Sukumaran Ammavan gate thurannu vannu! Shirt idu chekka!",
    "Kooriruttu varunnu! Terrace-ile pattu saree nananjaal achan ninte thalayil kuthum!"
  ],
  MARTYR_MODE: [
    "Ningal aarum oru sahayam cheyyanda! Njan ivide kidannu thulanj potte!",
    "Ente shavam kandaale ningal randinum thirichariyu ee ammade vila!",
    "Achan varatte, innu njan adukkalayil kathaadachu kidakkum!",
    "Oru glass vellam polum eduthu tharan aarum illa, njan thanne theernnu pokkolam!"
  ]
};

export const AmmaAvatar: React.FC<AmmaAvatarProps> = ({ state, stress }) => {
  const [blink, setBlink] = useState(false);
  const [ambientIndex, setAmbientIndex] = useState(0);

  // Periodic eye blink simulation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Cycle ambient thought periodically
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setAmbientIndex(prev => (prev + 1) % 4);
    }, 7000);
    return () => clearInterval(thoughtInterval);
  }, [state]);

  const getAvatarDetails = () => {
    const thoughts = AMBIENT_MOM_THOUGHTS[state] || AMBIENT_MOM_THOUGHTS.CALM_CHAYA;
    const currentBubble = thoughts[ambientIndex % thoughts.length];

    switch (state) {
      case 'CALM_CHAYA':
        return {
          mood: 'Calm & Content',
          subtitle: 'Humming Harivarasanam / Preparing Kannan Devan tea',
          eyebrows: 'M 16 19 Q 20 18 24 20',
          eyebrowsRight: 'M 28 20 Q 32 18 36 19',
          eyes: 'relaxed',
          mouth: 'M 22 29 Q 26 33 30 29',
          aura: 'bg-emerald-100 border-emerald-400 text-emerald-800',
          bubble: currentBubble,
          actionItem: 'Holding stainless steel tea tumbler'
        };
      case 'SUSPICIOUS_SCAN':
        return {
          mood: 'Suspicious Scan',
          subtitle: 'Eye tracking phone screen / Auditing Milton bottle',
          eyebrows: 'M 16 21 Q 20 17 24 18',
          eyebrowsRight: 'M 28 18 Q 32 17 36 21',
          eyes: 'squint',
          mouth: 'M 22 30 L 30 30',
          aura: 'bg-amber-100 border-amber-400 text-amber-900',
          bubble: currentBubble,
          actionItem: 'Glaring at screen with 20/20 laser vision'
        };
      case 'PREEMPTIVE_PANIC':
        return {
          mood: 'Preemptive Panic',
          subtitle: 'Slamming spice containers / Gazing at terrace clouds',
          eyebrows: 'M 16 17 Q 20 22 24 21',
          eyebrowsRight: 'M 28 21 Q 32 22 36 17',
          eyes: 'wide',
          mouth: 'M 22 28 Q 26 35 30 28 Z',
          aura: 'bg-orange-100 border-orange-500 text-orange-950',
          bubble: currentBubble,
          actionItem: 'Clutching head with both hands'
        };
      case 'MARTYR_MODE':
        return {
          mood: 'Martyr Mode (100%)',
          subtitle: 'Refusing all assistance / Passive-aggressive lockout',
          eyebrows: 'M 16 22 Q 20 18 24 19',
          eyebrowsRight: 'M 28 19 Q 32 18 36 22',
          eyes: 'tear',
          mouth: 'M 22 32 Q 26 27 30 32',
          aura: 'bg-red-100 border-red-500 text-red-950',
          bubble: currentBubble,
          actionItem: 'Dabbing tears with Kasavu saree pallu'
        };
    }
  };

  const details = getAvatarDetails();

  // Shake vibration animation for high stress / panic
  const isHighStress = stress >= 75;
  const isMartyr = state === 'MARTYR_MODE' || stress >= 98;

  return (
    <div className="win95-box p-2.5 flex flex-col gap-2 select-none relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-400 pb-1">
        <div className="flex items-center gap-1.5 font-bold text-xs tracking-wider">
          <motion.span 
            animate={{ scale: isHighStress ? [1, 1.4, 1] : 1, opacity: isHighStress ? [1, 0.4, 1] : 1 }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className={`w-2.5 h-2.5 rounded-full inline-block ${isMartyr ? 'bg-red-600' : isHighStress ? 'bg-orange-500' : 'bg-emerald-600'}`}
          />
          <span>AMMA_KERNEL.SYS (PID 0)</span>
        </div>
        <motion.span 
          animate={isHighStress ? { scale: [1, 1.05, 1], backgroundColor: ['#fecaca', '#fee2e2', '#fecaca'] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-gray-200 border border-gray-400"
        >
          STRESS: {stress}%
        </motion.span>
      </div>

      <div className="flex items-center gap-3">
        {/* Animated Retro Malayali Amma SVG Portrait */}
        <motion.div 
          animate={
            isMartyr
              ? { x: [-3, 3, -2, 2, 0], y: [-1, 1, -1, 1, 0] }
              : isHighStress
              ? { x: [-1.5, 1.5, -1, 1, 0], y: [-0.5, 0.5, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{
            duration: isHighStress ? 0.2 : 3,
            repeat: Infinity,
            ease: isHighStress ? 'linear' : 'easeInOut'
          }}
          className="relative w-20 h-20 bg-amber-50 border-2 border-gray-600 rounded flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center cursor-pointer"
          title="Click Amma to cycle maternal thoughts"
          onClick={() => setAmbientIndex(prev => prev + 1)}
        >
          <svg viewBox="0 0 52 52" className="w-full h-full">
            {/* Background halo / wallpaper with ambient glow */}
            <circle cx="26" cy="26" r="25" fill={isMartyr ? "#fee2e2" : isHighStress ? "#ffedd5" : "#fef3c7"} />

            {/* Saree Pallu over shoulder (Kasavu Gold Border) */}
            <path d="M 6 48 Q 12 36 26 36 Q 40 36 46 48 L 46 52 L 6 52 Z" fill="#451a03" />
            <path d="M 8 49 Q 26 38 44 49" stroke="#fbbf24" strokeWidth="2.5" fill="none" />
            <path d="M 12 40 L 40 40" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />

            {/* Traditional Gold Chain / Thali with subtle sway */}
            <motion.g 
              animate={{ rotate: [-1, 1, -1] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '26px 36px' }}
            >
              <path d="M 21 39 Q 26 44 31 39" stroke="#d97706" strokeWidth="1.5" fill="none" />
              <polygon points="26,43 28,46 24,46" fill="#b45309" />
            </motion.g>

            {/* Neck */}
            <rect x="23" y="32" width="6" height="6" fill="#fcd34d" />

            {/* Hair Bun (Kondai) behind head */}
            <circle cx="26" cy="14" r="14" fill="#1c1917" />
            <ellipse cx="36" cy="18" rx="5" ry="7" fill="#292524" />

            {/* Jasmine flower garland (Mulla poo) */}
            <circle cx="38" cy="14" r="2.2" fill="#ffffff" />
            <circle cx="40" cy="18" r="2.2" fill="#ffffff" />
            <circle cx="39" cy="22" r="2.2" fill="#ffffff" />

            {/* Face */}
            <ellipse cx="26" cy="24" rx="11" ry="12" fill="#fde68a" />

            {/* Big Maroon Chandana Pottu (Bindi) */}
            <circle cx="26" cy="19" r="2.2" fill="#881337" />
            <circle cx="26" cy="16.5" r="0.8" fill="#fef08a" />

            {/* Eyebrows with animated twitch in suspicious/panic states */}
            <motion.path 
              d={details.eyebrows} 
              stroke="#1c1917" 
              strokeWidth="1.5" 
              fill="none" 
              strokeLinecap="round" 
              animate={state === 'SUSPICIOUS_SCAN' ? { d: ['M 16 21 Q 20 17 24 18', 'M 16 19 Q 20 15 24 16', 'M 16 21 Q 20 17 24 18'] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.path 
              d={details.eyebrowsRight} 
              stroke="#1c1917" 
              strokeWidth="1.5" 
              fill="none" 
              strokeLinecap="round" 
              animate={state === 'SUSPICIOUS_SCAN' ? { d: ['M 28 18 Q 32 17 36 21', 'M 28 16 Q 32 15 36 19', 'M 28 18 Q 32 17 36 21'] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            {/* Spectacles (Classic retro gold-rimmed glasses) */}
            <circle cx="20" cy="24" r="4.2" stroke="#d97706" strokeWidth="1" fill="rgba(255,255,255,0.4)" />
            <circle cx="32" cy="24" r="4.2" stroke="#d97706" strokeWidth="1" fill="rgba(255,255,255,0.4)" />
            <line x1="24.2" y1="24" x2="27.8" y2="24" stroke="#d97706" strokeWidth="1" />

            {/* Eyes based on state, with periodic blink simulation */}
            {!blink ? (
              <>
                {details.eyes === 'relaxed' && (
                  <>
                    <motion.ellipse 
                      animate={{ rx: [1.6, 1.8, 1.6], ry: [1.6, 1.4, 1.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      cx="20" cy="24" rx="1.6" ry="1.6" fill="#1c1917" 
                    />
                    <motion.ellipse 
                      animate={{ rx: [1.6, 1.8, 1.6], ry: [1.6, 1.4, 1.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      cx="32" cy="24" rx="1.6" ry="1.6" fill="#1c1917" 
                    />
                  </>
                )}
                {details.eyes === 'squint' && (
                  <>
                    <line x1="18" y1="24" x2="22" y2="24" stroke="#7f1d1d" strokeWidth="1.8" />
                    <line x1="30" y1="24" x2="34" y2="24" stroke="#7f1d1d" strokeWidth="1.8" />
                    {/* Animated laser scan lines */}
                    <motion.line 
                      animate={{ opacity: [0.3, 1, 0.3], x2: [14, 18, 14] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      x1="20" y1="26" x2="16" y2="34" stroke="#ef4444" strokeWidth="1" strokeDasharray="1,1" 
                    />
                    <motion.line 
                      animate={{ opacity: [0.3, 1, 0.3], x2: [34, 38, 34] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      x1="32" y1="26" x2="36" y2="34" stroke="#ef4444" strokeWidth="1" strokeDasharray="1,1" 
                    />
                  </>
                )}
                {details.eyes === 'wide' && (
                  <>
                    <circle cx="20" cy="24" r="2.5" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
                    <motion.circle 
                      animate={{ r: [1.1, 1.4, 1.1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                      cx="20" cy="24" r="1.1" fill="#7f1d1d" 
                    />
                    <circle cx="32" cy="24" r="2.5" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
                    <motion.circle 
                      animate={{ r: [1.1, 1.4, 1.1] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                      cx="32" cy="24" r="1.1" fill="#7f1d1d" 
                    />
                  </>
                )}
                {details.eyes === 'tear' && (
                  <>
                    <ellipse cx="20" cy="24" rx="1.5" ry="1" fill="#1c1917" />
                    <ellipse cx="32" cy="24" rx="1.5" ry="1" fill="#1c1917" />
                    {/* Animated dripping tears */}
                    <motion.path 
                      animate={{ y: [0, 4], opacity: [1, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      d="M 33 26 C 33 28 35 28 35 26 C 35 25 33 24 33 26" fill="#38bdf8" 
                    />
                    <motion.path 
                      animate={{ y: [0, 4], opacity: [1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      d="M 19 26 C 19 28 17 28 17 26 C 17 25 19 24 19 26" fill="#38bdf8" 
                    />
                  </>
                )}
              </>
            ) : (
              // Closed eyelid during blink
              <>
                <line x1="18" y1="24" x2="22" y2="24" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="30" y1="24" x2="34" y2="24" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {/* Traditional Mukkuthi (Gold Nose Stud with sparkling diamond) */}
            <circle cx="28.5" cy="27" r="0.9" fill="#fbbf24" />
            <motion.circle 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              cx="28.5" cy="27" r="0.4" fill="#ffffff" 
            />

            {/* Animated Talking Mouth */}
            <motion.path 
              d={details.mouth} 
              stroke="#991b1b" 
              strokeWidth="1.4" 
              fill={state === 'PREEMPTIVE_PANIC' ? '#7f1d1d' : 'none'} 
              strokeLinecap="round" 
              animate={isHighStress ? { scaleY: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: '26px 30px' }}
            />

            {/* Jimikki Earings with subtle swing */}
            <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <polygon points="13,27 15,30 11,30" fill="#d97706" />
            </motion.g>
            <motion.g animate={{ rotate: [3, -3, 3] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <polygon points="39,27 41,30 37,30" fill="#d97706" />
            </motion.g>

            {/* Tea Steam Animation when in CALM_CHAYA */}
            {state === 'CALM_CHAYA' && (
              <motion.path
                d="M 44 38 Q 46 34 44 30 Q 42 26 44 22"
                stroke="#d97706"
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="2,2"
                animate={{ y: [0, -6], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </svg>

          {/* Panic Strobe Overlay */}
          {isMartyr && (
            <motion.div 
              animate={{ opacity: [0.1, 0.35, 0.1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              className="absolute inset-0 bg-red-600 pointer-events-none" 
            />
          )}
        </motion.div>

        {/* Status and Active Mode */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <motion.span 
              animate={isHighStress ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${details.aura}`}
            >
              {state}
            </motion.span>
          </div>
          <p className="text-xs text-gray-700 font-medium mt-1 leading-tight">
            {details.subtitle}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 font-mono">
            <span>ACTION:</span>
            <span className="truncate text-gray-800 font-bold">{details.actionItem}</span>
          </div>
        </div>
      </div>

      {/* Amma's Current Monologue Bubble with animated entrance */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${state}-${details.bubble.slice(0, 15)}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="win95-inset p-2 bg-yellow-50 text-[11px] font-serif italic text-amber-950 border border-amber-300 relative cursor-pointer"
          title="Click to hear another thought from Amma"
          onClick={() => setAmbientIndex(prev => prev + 1)}
        >
          &ldquo;{details.bubble}&rdquo;
          <span className="block text-[9px] not-italic text-amber-600 font-sans mt-0.5 text-right opacity-75">
            (click to cycle thought)
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
