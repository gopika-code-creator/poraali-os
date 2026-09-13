import React from 'react';
import { AmmaOperatingState } from '../types';

export type DitherPatternType = 'weave' | 'dots' | 'crosshatch' | 'angry' | 'checker' | 'solid';

export interface DesktopTheme {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundRepeat: string;
  labelBgColor: string;
  accentBorderColor: string;
  patternName: string;
  statusText: string;
  isAngryRed: boolean;
  isCritical: boolean;
  stress: number;
  state: AmmaOperatingState;
}

/**
 * Procedural SVG Data URIs representing authentic Windows 95 8x8 and 4x4 monochrome dither masks.
 * These require no external assets and scale with pixel-perfect crispness.
 */
const SVG_DITHERS = {
  // 1. Classic Windows 95 50% Weave Dither (Peaceful subtle stippling)
  weave: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Crect x='0' y='0' width='2' height='2' fill='rgba(0,0,0,0.12)'/%3E%3Crect x='2' y='2' width='2' height='2' fill='rgba(0,0,0,0.12)'/%3E%3Crect x='0' y='2' width='2' height='2' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")`,

  // 2. Suspicious Scanline Dot Matrix (Surveillance and tracking missing tupperware)
  dots: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6' viewBox='0 0 6 6'%3E%3Crect x='0' y='0' width='6' height='1' fill='rgba(0,0,0,0.22)'/%3E%3Ccircle cx='3' cy='4' r='1' fill='rgba(255,255,255,0.08)'/%3E%3Crect x='0' y='5' width='1' height='1' fill='rgba(0,0,0,0.25)'/%3E%3C/svg%3E")`,

  // 3. Preemptive Panic Turbulent Crosshatch (Approaching monsoon clouds & unplucked terrace sarees)
  crosshatch: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cline x1='0' y1='0' x2='8' y2='8' stroke='rgba(0,0,0,0.32)' stroke-width='1.5'/%3E%3Cline x1='8' y1='0' x2='0' y2='8' stroke='rgba(0,0,0,0.2)' stroke-width='1'/%3E%3Ccircle cx='4' cy='4' r='1' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")`,

  // 4. Critical Maternal Rage Dither (Intense high-contrast angry alert checkerboard)
  angry: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Crect x='0' y='0' width='4' height='4' fill='rgba(0,0,0,0.42)'/%3E%3Crect x='4' y='4' width='4' height='4' fill='rgba(0,0,0,0.42)'/%3E%3Crect x='2' y='2' width='2' height='2' fill='rgba(255,20,20,0.35)'/%3E%3Crect x='6' y='6' width='2' height='2' fill='rgba(255,20,20,0.35)'/%3E%3Cline x1='0' y1='4' x2='8' y2='4' stroke='rgba(0,0,0,0.2)' stroke-width='1'/%3E%3C/svg%3E")`,

  // 5. Classic Win95 Checkerboard (Standard retro 2x2 pixel grid)
  checker: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Crect x='0' y='0' width='2' height='2' fill='rgba(0,0,0,0.2)'/%3E%3Crect x='2' y='2' width='2' height='2' fill='rgba(0,0,0,0.2)'/%3E%3C/svg%3E")`,

  // 6. Solid (No pattern overlay)
  solid: 'none'
};

/**
 * Calculates the desktop background configuration based on Amma's operating state
 * and stress percentage.
 * 
 * Rules:
 * - Stress > 90% (or MARTYR_MODE): Transitions from classic teal '#008080' to an intense, angry red
 *   ('#800000' maroon to '#990000' blood red) paired with a high-contrast angry warning dither mask.
 * - PREEMPTIVE_PANIC (75% <= stress < 90%): Intense burnt rust/ochre warning palette ('#803800')
 *   with turbulent monsoon diagonal crosshatch dither.
 * - SUSPICIOUS_SCAN (40% <= stress < 75%): Guarded olive-teal ('#005959' / '#1a4e44')
 *   with dot-matrix surveillance scan dither.
 * - CALM_CHAYA (stress < 40%): Authentic Windows 95 nostalgic Teal ('#008080')
 *   with classic 50% weave dither.
 * 
 * @param ammaState The current operating state ('CALM_CHAYA' | 'SUSPICIOUS_SCAN' | 'PREEMPTIVE_PANIC' | 'MARTYR_MODE')
 * @param stress The current maternal stress percentage (0 - 100)
 * @param patternOverride Optional explicit pattern type override
 * @returns DesktopTheme metadata including background color, dither pattern, icon label colors, and labels
 */
export function getDesktopBackground(
  ammaState: AmmaOperatingState,
  stress: number,
  patternOverride?: DitherPatternType
): DesktopTheme {
  const isAngryRed = stress >= 90 || ammaState === 'MARTYR_MODE';
  const isCritical = stress >= 98;

  // 1. Stress > 90% or MARTYR_MODE: Intense Angry Red
  if (isAngryRed) {
    // Escalate from deep classic Windows 95 maroon (#800000) to crimson blood red as stress approaches 100%
    const redBg = isCritical ? '#660000' : stress >= 95 ? '#7f1111' : '#800000';
    const chosenPattern = patternOverride ? SVG_DITHERS[patternOverride] : SVG_DITHERS.angry;

    return {
      backgroundColor: redBg,
      backgroundImage: chosenPattern,
      backgroundSize: patternOverride === 'dots' ? '6px 6px' : patternOverride === 'weave' ? '4px 4px' : '8px 8px',
      backgroundRepeat: 'repeat',
      labelBgColor: redBg,
      accentBorderColor: '#ef4444',
      patternName: isCritical ? 'Critical Martyr Red Alert (100% Rage)' : 'Angry Maternal Red (Dithered Alert)',
      statusText: `CRITICAL MATERNAL LOCKOUT - STRESS ${stress}%`,
      isAngryRed: true,
      isCritical,
      stress,
      state: ammaState
    };
  }

  // 2. PREEMPTIVE_PANIC or 75% <= Stress < 90%: Intense Rust / Burnt Ochre
  if (ammaState === 'PREEMPTIVE_PANIC' || stress >= 75) {
    const panicBg = '#803800'; // Rich retro rust/ochre warning tone
    const chosenPattern = patternOverride ? SVG_DITHERS[patternOverride] : SVG_DITHERS.crosshatch;

    return {
      backgroundColor: panicBg,
      backgroundImage: chosenPattern,
      backgroundSize: patternOverride === 'dots' ? '6px 6px' : patternOverride === 'weave' ? '4px 4px' : '8px 8px',
      backgroundRepeat: 'repeat',
      labelBgColor: panicBg,
      accentBorderColor: '#f97316',
      patternName: 'Preemptive Monsoon Panic (Crosshatch)',
      statusText: `PANIC ALERT - TERRACE CLOUDS GATHERING - STRESS ${stress}%`,
      isAngryRed: false,
      isCritical: false,
      stress,
      state: ammaState
    };
  }

  // 3. SUSPICIOUS_SCAN or 40% <= Stress < 75%: Guarded Olive-Teal Surveillance
  if (ammaState === 'SUSPICIOUS_SCAN' || stress >= 40) {
    const scanBg = '#164e43'; // Deep guarded olive-teal
    const chosenPattern = patternOverride ? SVG_DITHERS[patternOverride] : SVG_DITHERS.dots;

    return {
      backgroundColor: scanBg,
      backgroundImage: chosenPattern,
      backgroundSize: patternOverride === 'weave' ? '4px 4px' : '6px 6px',
      backgroundRepeat: 'repeat',
      labelBgColor: scanBg,
      accentBorderColor: '#eab308',
      patternName: 'Suspicious Surveillance Grid (Dot Matrix)',
      statusText: `SUSPICIOUS SCAN - AUDITING PHONE & TUPPERWARE - STRESS ${stress}%`,
      isAngryRed: false,
      isCritical: false,
      stress,
      state: ammaState
    };
  }

  // 4. Default / CALM_CHAYA (Stress < 40%): Authentic Windows 95 Teal
  const calmBg = '#008080'; // Iconic Windows 95 desktop teal
  const chosenPattern = patternOverride ? SVG_DITHERS[patternOverride] : SVG_DITHERS.weave;

  return {
    backgroundColor: calmBg,
    backgroundImage: chosenPattern,
    backgroundSize: '4px 4px',
    backgroundRepeat: 'repeat',
    labelBgColor: calmBg,
    accentBorderColor: '#10b981',
    patternName: 'Classic Tharavadu Teal (50% Weave)',
    statusText: `CALM CHAYA - KANNAN DEVAN BREWING - STRESS ${stress}%`,
    isAngryRed: false,
    isCritical: false,
    stress,
    state: ammaState
  };
}

/**
 * Returns a React inline CSS properties object for direct application
 * to the desktop root container.
 */
export function getDesktopStyle(
  ammaState: AmmaOperatingState,
  stress: number,
  patternOverride?: DitherPatternType
): React.CSSProperties {
  const theme = getDesktopBackground(ammaState, stress, patternOverride);

  return {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundImage,
    backgroundSize: theme.backgroundSize,
    backgroundRepeat: theme.backgroundRepeat,
    transition: 'background-color 0.4s ease-in-out'
  };
}
