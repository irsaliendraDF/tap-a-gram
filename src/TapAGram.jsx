import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart, Sun, Flower, Skull, Home, Sparkles,
  Check, Download, Send, Volume2, VolumeX,
  RotateCcw, Play,
} from 'lucide-react';

// ============================================================
// TONES — palette + vibe icon per tone
// ============================================================
const TONES = {
  crush: {
    id: 'crush', name: 'Crush', emoji: '💘',
    tagline: 'flirty, slightly nervous',
    primary: '#ff3b6b', deep: '#c91f4a', soft: '#ffe5ec',
    studColors: ['#ff3b6b', '#ff8aa8', '#ffb6c8', '#ff6b9d', '#e91e63'],
    vibe: 'heart',
    bg: 'radial-gradient(ellipse at top, #ffe5ec 0%, #ffd1dc 40%, #ffb6c8 100%)',
  },
  bestie: {
    id: 'bestie', name: 'Bestie', emoji: '💛',
    tagline: 'ride-or-die warmth',
    primary: '#f59f00', deep: '#cc7a00', soft: '#fff4d6',
    studColors: ['#ffb700', '#ffd954', '#fff0a8', '#ff9500', '#fbbf24'],
    vibe: 'sun',
    bg: 'radial-gradient(ellipse at top, #fff4d6 0%, #ffe9a8 40%, #ffd954 100%)',
  },
  selflove: {
    id: 'selflove', name: 'Self-love', emoji: '🌸',
    tagline: 'soft hype for yourself',
    primary: '#d96bb5', deep: '#a83d8e', soft: '#fce7f3',
    studColors: ['#d96bb5', '#f0a5cd', '#fbcfe8', '#c084fc', '#e879c9'],
    vibe: 'flower',
    bg: 'radial-gradient(ellipse at top, #fce7f3 0%, #f5d0e6 40%, #f0a5cd 100%)',
  },
  roast: {
    id: 'roast', name: 'Roast', emoji: '😈',
    tagline: 'sweetly mean',
    primary: '#7c3aed', deep: '#5b21b6', soft: '#ede9fe',
    studColors: ['#7c3aed', '#a78bfa', '#2d1a4d', '#4c1d95', '#1a1a1a'],
    vibe: 'skull',
    bg: 'radial-gradient(ellipse at top, #ede9fe 0%, #c4b5fd 40%, #8b5cf6 100%)',
  },
  family: {
    id: 'family', name: 'Family', emoji: '🤎',
    tagline: 'low-key, true',
    primary: '#b45309', deep: '#78350f', soft: '#fef3c7',
    studColors: ['#b45309', '#d97706', '#f59e0b', '#92400e', '#fbbf24'],
    vibe: 'home',
    bg: 'radial-gradient(ellipse at top, #fef3c7 0%, #fde68a 40%, #fbbf24 100%)',
  },
  justbecause: {
    id: 'justbecause', name: 'Just because', emoji: '💚',
    tagline: 'random sweetness',
    primary: '#16a34a', deep: '#15803d', soft: '#dcfce7',
    studColors: ['#16a34a', '#4ade80', '#86efac', '#22c55e', '#14b8a6'],
    vibe: 'sparkles',
    bg: 'radial-gradient(ellipse at top, #dcfce7 0%, #bbf7d0 40%, #86efac 100%)',
  },
};
const TONE_ORDER = ['crush', 'bestie', 'selflove', 'roast', 'family', 'justbecause'];

const VIBE_ICONS = { heart: Heart, sun: Sun, flower: Flower, skull: Skull, home: Home, sparkles: Sparkles };

// ============================================================
// MESSAGES — 6 tones × 3 tiers × 3 messages = 54 grams
// Sharp voice per tone. Line breaks (\n) tuned for chunky brick rendering.
// ============================================================
const MESSAGES = {
  crush: {
    // flirty, just-barely-confessing
    1: ['I\nPEEKED', 'UR OK\nI GUESS', 'BARELY\nNOTICED'],
    2: ['FAV\nTAB\nOPEN', 'BLUSH\nON\nSIGHT', 'U IN\nMY\nHEAD'],
    3: ['U MAKE\nME\nDUMB', 'MY\nWHOLE\nFEED', 'MY\nROMAN\nEMPIRE'],
  },
  bestie: {
    // ride or die, casual real love
    1: ['MID\nBUT\nMINE', 'STUCK\nWITH U', 'OK I\nGUESS'],
    2: ['GROUP\nCHAT\nMVP', 'MY 3AM\nCALL', 'RIDE\nOR\nDIE'],
    3: ['CHOSEN\nFAMILY', 'MY\nPERSON', 'MADE\nOF\nGOLD'],
  },
  selflove: {
    // soft hype, internet-native
    1: ['STILL\nHERE.\nWIN.', 'DOING\nFINE', 'JUST\nENOUGH'],
    2: ['U R\nTHE\nMOMENT', 'SOFTLY\nTHRIVING', 'MAIN\nCHAR'],
    3: ['BORN\nTO\nSHINE', 'UNREAL\nHUMAN', 'MOST\nICONIC'],
  },
  roast: {
    // sweetly mean, has bite
    1: ['MID\nAT\nBEST', 'DEEPLY\nMID', 'WHY\nU LIKE\nTHAT'],
    2: ['CHAOS\nDEMON', 'CRINGE\nBUT\nCUTE', 'RED\nFLAG\nENERGY'],
    3: ['MY FAV\nPROBLEM', 'FULL\nDISASTER', 'MENACE\n2\nSOCIETY'],
  },
  family: {
    // low-key true warmth
    1: ['FAMILY\nWEIRDO', 'OUR\nPROBLEM', 'STUCK\nWITH US'],
    2: ['THE\nGROUP\nTEXT', 'HOLDS\nIT ALL', 'HOME\nTO ME'],
    3: ['WHERE\nI START', 'BLOOD\nAND\nBONE', 'ALWAYS\nMY\nHOME'],
  },
  justbecause: {
    // random sweetness, low-stakes hi
    1: ['JUST\nA HI', 'ON MY\nMIND', 'U\nMATTER'],
    2: ['MADE\nMY DAY', 'U JUST\nPOPPED\nIN', 'QUIET\nGOOD'],
    3: ['SMALL\nMIRACLE', 'MADE\nMY\nWEEK', 'GRATEFUL\nFOR U'],
  },
};

// ============================================================
// 5×7 PIXEL FONT — each char is 7 rows × 5 cols, 1 = stud
// ============================================================
const _ = 0, X = 1;
const LETTERS = {
  'A': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X]],
  'B': [[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,_]],
  'C': [[_,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[_,X,X,X,X]],
  'D': [[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,_]],
  'E': [[X,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,_],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,X]],
  'F': [[X,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_]],
  'G': [[_,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[X,_,X,X,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,X]],
  'H': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X]],
  'I': [[X,X,X,X,X],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[X,X,X,X,X]],
  'J': [[X,X,X,X,X],[_,_,_,_,X],[_,_,_,_,X],[_,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  'K': [[X,_,_,_,X],[X,_,_,X,_],[X,_,X,_,_],[X,X,_,_,_],[X,_,X,_,_],[X,_,_,X,_],[X,_,_,_,X]],
  'L': [[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,X]],
  'M': [[X,_,_,_,X],[X,X,_,X,X],[X,_,X,_,X],[X,_,X,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X]],
  'N': [[X,_,_,_,X],[X,X,_,_,X],[X,_,X,_,X],[X,_,X,_,X],[X,_,_,X,X],[X,_,_,_,X],[X,_,_,_,X]],
  'O': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  'P': [[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,_],[X,_,_,_,_],[X,_,_,_,_],[X,_,_,_,_]],
  'Q': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,X,_,X],[X,_,_,X,_],[_,X,X,_,X]],
  'R': [[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,_],[X,_,X,_,_],[X,_,_,X,_],[X,_,_,_,X]],
  'S': [[_,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[_,X,X,X,_],[_,_,_,_,X],[_,_,_,_,X],[X,X,X,X,_]],
  'T': [[X,X,X,X,X],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_]],
  'U': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  'V': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,_,X,_],[_,_,X,_,_]],
  'W': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,_,X,_,X],[X,_,X,_,X],[X,X,_,X,X],[X,_,_,_,X]],
  'X': [[X,_,_,_,X],[X,_,_,_,X],[_,X,_,X,_],[_,_,X,_,_],[_,X,_,X,_],[X,_,_,_,X],[X,_,_,_,X]],
  'Y': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[_,X,_,X,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_]],
  'Z': [[X,X,X,X,X],[_,_,_,_,X],[_,_,_,X,_],[_,_,X,_,_],[_,X,_,_,_],[X,_,_,_,_],[X,X,X,X,X]],
  '0': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,X,X],[X,_,X,_,X],[X,X,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  '1': [[_,_,X,_,_],[_,X,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,X,X,X,_]],
  '2': [[_,X,X,X,_],[X,_,_,_,X],[_,_,_,_,X],[_,_,X,X,_],[_,X,_,_,_],[X,_,_,_,_],[X,X,X,X,X]],
  '3': [[X,X,X,X,_],[_,_,_,_,X],[_,_,_,_,X],[_,X,X,X,_],[_,_,_,_,X],[_,_,_,_,X],[X,X,X,X,_]],
  '4': [[X,_,_,_,X],[X,_,_,_,X],[X,_,_,_,X],[X,X,X,X,X],[_,_,_,_,X],[_,_,_,_,X],[_,_,_,_,X]],
  '5': [[X,X,X,X,X],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,_],[_,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  '6': [[_,X,X,X,_],[X,_,_,_,_],[X,_,_,_,_],[X,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  '7': [[X,X,X,X,X],[_,_,_,_,X],[_,_,_,_,X],[_,_,_,X,_],[_,_,X,_,_],[_,X,_,_,_],[X,_,_,_,_]],
  '8': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,_]],
  '9': [[_,X,X,X,_],[X,_,_,_,X],[X,_,_,_,X],[_,X,X,X,X],[_,_,_,_,X],[_,_,_,_,X],[_,X,X,X,_]],
  ' ': [[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_]],
  '.': [[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,X,X,_,_],[_,X,X,_,_]],
  '!': [[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,X,_,_],[_,_,_,_,_],[_,_,X,_,_]],
  '?': [[_,X,X,X,_],[X,_,_,_,X],[_,_,_,_,X],[_,_,_,X,_],[_,_,X,_,_],[_,_,_,_,_],[_,_,X,_,_]],
  '/': [[_,_,_,_,X],[_,_,_,_,X],[_,_,_,X,_],[_,_,X,_,_],[_,X,_,_,_],[X,_,_,_,_],[X,_,_,_,_]],
  "'": [[_,_,X,_,_],[_,_,X,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_],[_,_,_,_,_]],
};

// ============================================================
// GAME TUNING
// ============================================================
const GAME_DURATION = 60;
const SPAWN_INTERVAL_GOOD = [600, 1100];   // ms range
const SPAWN_INTERVAL_BAD = [1500, 2500];   // ms range
const CANDY_LIFETIME = [2200, 3000];        // ms range
const SCORE_GOOD = 10;
const SCORE_VIBE = 25;
const SCORE_BAD = -15;
const ON_VIBE_PROB = 0.4;                   // 40% of good candies are on-vibe
const TIER_THRESHOLDS = [100, 250];         // <100=T1, <250=T2, else T3

// ============================================================
// AUDIO — Web Audio synth (no asset files)
// ============================================================
let _audioCtx = null;
const audio = {
  enabled: true,
  ctx() {
    if (!_audioCtx) {
      try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    return _audioCtx;
  },
  play(type) {
    if (!this.enabled) return;
    const ctx = this.ctx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime;
    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.connect(g).connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'vibe') {
      // brighter, more rewarding ding
      [600, 900, 1200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.12, t + i * 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18 + i * 0.02);
        osc.connect(g).connect(ctx.destination);
        osc.start(t + i * 0.02); osc.stop(t + 0.2 + i * 0.02);
      });
    } else if (type === 'buzz') {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.12);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
      osc.connect(g).connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.14);
    } else if (type === 'snap') {
      // tight noise burst — brick clicking into place
      const bufferSize = ctx.sampleRate * 0.04;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;
      const g = ctx.createGain();
      g.gain.value = 0.08;
      noise.connect(filter).connect(g).connect(ctx.destination);
      noise.start(t);
    } else if (type === 'tada') {
      // celebratory game-end chord
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startT = t + i * 0.04;
        g.gain.setValueAtTime(0.001, startT);
        g.gain.linearRampToValueAtTime(0.1, startT + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.5);
        osc.connect(g).connect(ctx.destination);
        osc.start(startT); osc.stop(startT + 0.52);
      });
    }
  },
};

// ============================================================
// URL HASH ROUTING
// ============================================================
const encodeGram = ({ tone, forName, fromName, tier, messageIdx }) => {
  const params = new URLSearchParams();
  params.set('t', tone);
  params.set('to', forName || '');
  params.set('from', fromName || '');
  params.set('tier', tier);
  params.set('m', messageIdx);
  return '#' + params.toString();
};
const decodeGram = (hash) => {
  if (!hash || hash.length < 2) return null;
  try {
    const params = new URLSearchParams(hash.slice(1));
    const tone = params.get('t');
    if (!tone || !TONES[tone]) return null;
    const tier = parseInt(params.get('tier'), 10);
    if (![1, 2, 3].includes(tier)) return null;
    const messageIdx = parseInt(params.get('m'), 10);
    const pool = MESSAGES[tone][tier];
    if (isNaN(messageIdx) || messageIdx < 0 || messageIdx >= pool.length) return null;
    return {
      tone,
      forName: params.get('to') || '',
      fromName: params.get('from') || '',
      tier,
      messageIdx,
    };
  } catch (e) { return null; }
};

// ============================================================
// HELPERS
// ============================================================
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const scoreToTier = (s) => {
  if (s < TIER_THRESHOLDS[0]) return 1;
  if (s < TIER_THRESHOLDS[1]) return 2;
  return 3;
};
const pickMessageIdx = (tone, tier) => randInt(0, MESSAGES[tone][tier].length);
const getMessage = (tone, tier, idx) => MESSAGES[tone][tier][idx] || MESSAGES[tone][tier][0];

// ============================================================
// CANDY SHAPES — distinct enough to read at a glance
// ============================================================
const CandyShape = ({ kind, color, vibeKind, size = 64, isBad = false }) => {
  const Vibe = VIBE_ICONS[vibeKind];

  if (isBad) {
    // BAD candy: drippy melted gray glob with X
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.25))' }}>
        <defs>
          <radialGradient id={`badGrad-${color}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </radialGradient>
        </defs>
        <path d="M32 6 C 44 6, 54 14, 54 28 C 54 38, 50 44, 52 52 C 50 56, 44 54, 38 56 C 32 58, 26 56, 22 54 C 16 56, 12 54, 12 48 C 14 40, 10 36, 10 28 C 10 14, 20 6, 32 6 Z"
              fill={`url(#badGrad-${color})`} stroke="#374151" strokeWidth="2" />
        <line x1="22" y1="22" x2="34" y2="34" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <line x1="34" y1="22" x2="22" y2="34" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        <circle cx="42" cy="26" r="2" fill="#1f2937" />
        <circle cx="42" cy="28" r="2" fill="#1f2937" />
      </svg>
    );
  }

  if (kind === 'vibe') {
    // ON-VIBE candy: chunky brick base with vibe icon on top
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.3))' }}>
        <defs>
          <linearGradient id={`vibeG-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="4" y="14" width="56" height="44" rx="8" fill={`url(#vibeG-${color})`} stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
        {/* studs */}
        <circle cx="18" cy="22" r="5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <circle cx="32" cy="22" r="5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <circle cx="46" cy="22" r="5" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <ellipse cx="16" cy="20" rx="1.5" ry="1" fill="rgba(255,255,255,0.5)" />
        <ellipse cx="30" cy="20" rx="1.5" ry="1" fill="rgba(255,255,255,0.5)" />
        <ellipse cx="44" cy="20" rx="1.5" ry="1" fill="rgba(255,255,255,0.5)" />
        {/* central icon */}
        <g transform="translate(20, 28)">
          <Vibe size={24} color="#ffffff" strokeWidth={3} fill="#ffffff" fillOpacity={0.3} />
        </g>
      </svg>
    );
  }

  // GOOD candy: round gumdrop / lollipop variations
  const shapeIdx = kind === 'gumdrop' ? 0 : kind === 'square' ? 1 : 2;

  if (shapeIdx === 0) {
    // Round gumdrop
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.25))' }}>
        <defs>
          <radialGradient id={`gd-${color}`} cx="35%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="40%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="26" fill={`url(#gd-${color})`} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        <ellipse cx="24" cy="22" rx="6" ry="4" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }
  if (shapeIdx === 1) {
    // Square candy block
    return (
      <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.25))' }}>
        <rect x="8" y="8" width="48" height="48" rx="10" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        <rect x="14" y="14" width="36" height="36" rx="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <ellipse cx="22" cy="20" rx="5" ry="3" fill="rgba(255,255,255,0.5)" />
      </svg>
    );
  }
  // Lollipop
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.25))' }}>
      <rect x="30" y="32" width="4" height="28" fill="#f5f5f4" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <circle cx="32" cy="24" r="20" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      <path d="M 32 8 A 16 16 0 0 1 48 24" stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="14" rx="4" ry="2.5" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
};

// ============================================================
// BRICK STUD — true 3D brick: top face + right face + bottom face + cast shadow
// ============================================================
const BrickStud = ({ x, y, color, delay = 0, animate = true }) => {
  const sideColor = darkenHex(color, 0.32);
  const bottomColor = darkenHex(color, 0.48);
  const studSide = darkenHex(color, 0.22);
  return (
    <g style={animate ? {
      animation: `studTumble 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms backwards`,
      transformBox: 'fill-box',
      transformOrigin: 'center',
    } : {}}>
      {/* cast shadow on baseplate */}
      <ellipse cx={x + 0.55} cy={y + 1.04} rx="0.46" ry="0.08" fill="rgba(0,0,0,0.3)" />
      {/* bottom depth face */}
      <path d={`M ${x + 0.06} ${y + 0.94} L ${x + 0.14} ${y + 1.02} L ${x + 1.02} ${y + 1.02} L ${x + 0.94} ${y + 0.94} Z`}
            fill={bottomColor} />
      {/* right depth face */}
      <path d={`M ${x + 0.94} ${y + 0.06} L ${x + 1.02} ${y + 0.14} L ${x + 1.02} ${y + 1.02} L ${x + 0.94} ${y + 0.94} Z`}
            fill={sideColor} />
      {/* brick top face */}
      <rect x={x + 0.04} y={y + 0.04} width="0.9" height="0.9" rx="0.08"
            fill={color} stroke="rgba(0,0,0,0.22)" strokeWidth="0.04" />
      {/* top edge gloss strip */}
      <rect x={x + 0.1} y={y + 0.08} width="0.78" height="0.16" rx="0.05"
            fill="rgba(255,255,255,0.38)" />
      {/* stud cylinder side */}
      <rect x={x + 0.24} y={y + 0.45} width="0.52" height="0.12" fill={studSide} />
      <ellipse cx={x + 0.5} cy={y + 0.57} rx="0.26" ry="0.07" fill={sideColor} />
      {/* stud top face */}
      <ellipse cx={x + 0.5} cy={y + 0.45} rx="0.26" ry="0.1"
               fill={color} stroke="rgba(0,0,0,0.25)" strokeWidth="0.03" />
      {/* stud highlight */}
      <ellipse cx={x + 0.42} cy={y + 0.42} rx="0.11" ry="0.04" fill="rgba(255,255,255,0.7)" />
      {/* stud rim shine */}
      <path d={`M ${x + 0.3} ${y + 0.42} Q ${x + 0.4} ${y + 0.36} ${x + 0.55} ${y + 0.37}`}
            stroke="rgba(255,255,255,0.5)" strokeWidth="0.025" fill="none" strokeLinecap="round" />
    </g>
  );
};

// ============================================================
// BRICK MOSAIC — renders the gram in studs
// ============================================================
const BrickMosaic = ({ message, tone, animate = true, padding = 1.5 }) => {
  const lines = message.split('\n');
  const charW = 5, charH = 7, charSpace = 1, lineSpace = 2;
  const maxLen = Math.max(...lines.map(l => l.length));
  const contentW = maxLen * (charW + charSpace) - charSpace;
  const contentH = lines.length * (charH + lineSpace) - lineSpace;
  const totalW = contentW + padding * 2;
  const totalH = contentH + padding * 2;

  const studs = [];
  let studCounter = 0;

  lines.forEach((line, lineIdx) => {
    const lineW = line.length * (charW + charSpace) - charSpace;
    const offsetX = padding + (contentW - lineW) / 2;
    const lineY = padding + lineIdx * (charH + lineSpace);

    [...line].forEach((char, charIdx) => {
      const grid = LETTERS[char] || LETTERS[' '];
      const charX = offsetX + charIdx * (charW + charSpace);
      grid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          if (cell) {
            const color = tone.studColors[studCounter % tone.studColors.length];
            studs.push({ x: charX + ci, y: lineY + ri, color, delay: animate ? studCounter * 22 : 0, key: `s-${studCounter}` });
            studCounter++;
          }
        });
      });
    });
  });

  return (
    <svg viewBox={`0 0 ${totalW} ${totalH}`} preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', width: '100%', height: '100%' }}>
      {/* baseplate */}
      <rect x="0" y="0" width={totalW} height={totalH} rx="0.5" fill={tone.soft} />
      {/* baseplate stud pattern (faint) */}
      {Array.from({ length: Math.ceil(totalW) }).map((_, gx) =>
        Array.from({ length: Math.ceil(totalH) }).map((_, gy) => (
          <circle key={`bp-${gx}-${gy}`} cx={gx + 0.5} cy={gy + 0.5} r="0.12" fill={tone.primary} opacity="0.12" />
        ))
      )}
      {/* studs */}
      {studs.map(s => <BrickStud {...s} />)}
    </svg>
  );
};

// ============================================================
// CHUNKY BRICK BUTTON
// ============================================================
const BrickButton = ({ onClick, disabled, children, color = '#ff3b6b', textColor = '#ffffff', size = 'lg', wide = true }) => {
  const pad = size === 'lg' ? '16px 28px' : '12px 20px';
  const fs = size === 'lg' ? '1.05rem' : '0.9rem';
  return (
    <button onClick={onClick} disabled={disabled}
      className={`relative transition-all hover:translate-y-[-2px] active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${wide ? 'w-full' : ''}`}
      style={{
        backgroundColor: color, color: textColor,
        fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
        fontSize: fs, padding: pad, borderRadius: 16,
        border: 'none', cursor: 'pointer',
        boxShadow: `0 6px 0 ${darkenHex(color, 0.35)}, inset 0 -3px 6px rgba(0,0,0,0.12), inset 0 3px 6px rgba(255,255,255,0.25)`,
        letterSpacing: '0.02em',
      }}>
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

// ============================================================
// COLOR UTIL
// ============================================================
function darkenHex(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ============================================================
// MAIN
// ============================================================
export default function TapAGram() {
  // Screens: title | game | reveal | received
  const [screen, setScreen] = useState('title');

  // Title inputs
  const [selectedTone, setSelectedTone] = useState(null);
  const [forName, setForName] = useState('');
  const [fromName, setFromName] = useState('');

  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [candies, setCandies] = useState([]);
  const [scorePops, setScorePops] = useState([]);
  const [shake, setShake] = useState(0);

  // Reveal state
  const [revealTier, setRevealTier] = useState(3);
  const [revealMessageIdx, setRevealMessageIdx] = useState(0);
  const [showRevealConfetti, setShowRevealConfetti] = useState(false);

  // Received-from-link state
  const [incomingGram, setIncomingGram] = useState(null);

  // Misc
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const candyIdRef = useRef(0);
  const popIdRef = useRef(0);
  const gameStartRef = useRef(0);
  const spawnTimersRef = useRef([]);
  const arenaRef = useRef(null);

  // Sync audio enabled with state
  useEffect(() => { audio.enabled = soundOn; }, [soundOn]);

  // === URL HASH ON MOUNT ===
  useEffect(() => {
    const gram = decodeGram(window.location.hash);
    if (gram) {
      setIncomingGram(gram);
      setScreen('received');
    }
    const onHash = () => {
      const g = decodeGram(window.location.hash);
      if (g) { setIncomingGram(g); setScreen('received'); }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // === GAME LOOP ===
  useEffect(() => {
    if (screen !== 'game') return;
    gameStartRef.current = performance.now();
    setScore(0); setTimeLeft(GAME_DURATION); setCandies([]); setScorePops([]);

    let raf;
    const tick = () => {
      const elapsed = (performance.now() - gameStartRef.current) / 1000;
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);
      // remove expired candies
      setCandies(prev => {
        const now = performance.now();
        return prev.filter(c => now - c.spawnTime < c.lifetime);
      });
      setScorePops(prev => {
        const now = performance.now();
        return prev.filter(p => now - p.t < 700);
      });
      if (remaining > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        // game over
        endGame();
      }
    };
    raf = requestAnimationFrame(tick);

    // schedule spawns
    let active = true;
    const scheduleGood = () => {
      const delay = rand(...SPAWN_INTERVAL_GOOD);
      const t = setTimeout(() => {
        if (!active) return;
        spawnCandy('good');
        scheduleGood();
      }, delay);
      spawnTimersRef.current.push(t);
    };
    const scheduleBad = () => {
      const delay = rand(...SPAWN_INTERVAL_BAD);
      const t = setTimeout(() => {
        if (!active) return;
        spawnCandy('bad');
        scheduleBad();
      }, delay);
      spawnTimersRef.current.push(t);
    };
    scheduleGood();
    scheduleBad();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      spawnTimersRef.current.forEach(clearTimeout);
      spawnTimersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const endGame = () => {
    audio.play('tada');
    spawnTimersRef.current.forEach(clearTimeout);
    spawnTimersRef.current = [];
    // determine tier from final score
    setScore(s => {
      const t = scoreToTier(s);
      const idx = pickMessageIdx(selectedTone, t);
      setRevealTier(t); setRevealMessageIdx(idx);
      return s;
    });
    setTimeout(() => {
      setScreen('reveal');
      setShowRevealConfetti(true);
      setTimeout(() => setShowRevealConfetti(false), 2500);
    }, 800);
  };

  const spawnCandy = (kind) => {
    if (!arenaRef.current) return;
    const tone = TONES[selectedTone];
    const id = ++candyIdRef.current;
    const isBad = kind === 'bad';
    const isVibe = !isBad && Math.random() < ON_VIBE_PROB;
    const shapeKinds = ['gumdrop', 'square', 'lolly'];
    // random position
    const x = rand(8, 88);
    const y = rand(10, 82);
    const rot = rand(-15, 15);
    const lifetime = rand(...CANDY_LIFETIME);
    const candyColor = isVibe ? tone.primary : tone.studColors[randInt(0, tone.studColors.length)];
    setCandies(prev => [...prev, {
      id, isBad, isVibe,
      kind: isVibe ? 'vibe' : shapeKinds[randInt(0, 3)],
      x, y, rot, lifetime,
      color: candyColor,
      vibeKind: tone.vibe,
      spawnTime: performance.now(),
    }]);
  };

  const tapCandy = (candy) => {
    let delta = 0;
    if (candy.isBad) {
      delta = SCORE_BAD;
      audio.play('buzz');
      setShake(s => s + 1);
      setTimeout(() => setShake(0), 250);
    } else if (candy.isVibe) {
      delta = SCORE_VIBE;
      audio.play('vibe');
    } else {
      delta = SCORE_GOOD;
      audio.play('pop');
    }
    setScore(s => Math.max(0, s + delta));
    // score pop
    const popId = ++popIdRef.current;
    setScorePops(prev => [...prev, { id: popId, t: performance.now(), x: candy.x, y: candy.y, delta }]);
    // remove candy
    setCandies(prev => prev.filter(c => c.id !== candy.id));
  };

  // === GENERATE SHARE LINK ===
  const buildShareLink = () => {
    const hash = encodeGram({
      tone: selectedTone, forName, fromName,
      tier: revealTier, messageIdx: revealMessageIdx,
    });
    const base = window.location.origin + window.location.pathname;
    return base + hash;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) { console.error('copy failed', e); }
  };

  // === PNG DOWNLOAD ===
  const downloadPng = async () => {
    setDownloading(true);
    try {
      const tone = TONES[selectedTone || incomingGram?.tone];
      const message = incomingGram
        ? getMessage(incomingGram.tone, incomingGram.tier, incomingGram.messageIdx)
        : getMessage(selectedTone, revealTier, revealMessageIdx);
      const recipName = incomingGram?.forName || forName;
      const senderName = incomingGram?.fromName || fromName;

      const W = 1200, H = 1500;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      // background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, tone.soft);
      grad.addColorStop(1, tone.studColors[2] || tone.soft);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // baseplate stud pattern
      ctx.fillStyle = tone.primary + '15';
      for (let y = 30; y < H; y += 60) {
        for (let x = 30; x < W; x += 60) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // FOR banner at top
      if (recipName) {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '500 50px "Bricolage Grotesque", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`for ${recipName}`, W / 2, 140);
      }

      // BRICK MOSAIC — render letter by letter
      const lines = message.split('\n');
      const charW = 5, charH = 7, charSpace = 1, lineSpace = 2;
      const maxLen = Math.max(...lines.map(l => l.length));
      const contentW = maxLen * (charW + charSpace) - charSpace;
      const contentH = lines.length * (charH + lineSpace) - lineSpace;

      // figure out stud pixel size so the mosaic fits a target box
      const boxW = 1000, boxH = 1000;
      const studPx = Math.min(boxW / contentW, boxH / contentH);
      const mosaicW = contentW * studPx;
      const mosaicH = contentH * studPx;
      const mosaicX = (W - mosaicW) / 2;
      const mosaicY = 200;

      let counter = 0;
      lines.forEach((line, li) => {
        const lineW = line.length * (charW + charSpace) - charSpace;
        const offX = mosaicX + (contentW - lineW) / 2 * studPx;
        const lineY = mosaicY + li * (charH + lineSpace) * studPx;
        [...line].forEach((ch, ci) => {
          const grid = LETTERS[ch] || LETTERS[' '];
          const charX = offX + ci * (charW + charSpace) * studPx;
          grid.forEach((row, ri) => {
            row.forEach((cell, ccii) => {
              if (cell) {
                const sx = charX + ccii * studPx;
                const sy = lineY + ri * studPx;
                const color = tone.studColors[counter % tone.studColors.length];
                drawStud(ctx, sx, sy, studPx, color);
                counter++;
              }
            });
          });
        });
      });

      // FROM line
      if (senderName) {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '600 42px "Bricolage Grotesque", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`from ${senderName} ${tone.emoji}`, W / 2, mosaicY + mosaicH + 100);
      }

      // FOOTER
      ctx.fillStyle = 'rgba(26,26,26,0.55)';
      ctx.font = '500 26px "Bricolage Grotesque", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('made with Tap-A-Gram', W / 2, H - 60);

      // download
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tap-a-gram-${recipName || 'gram'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { console.error('png failed', e); }
    setDownloading(false);
  };

  // === GAME FLOW HELPERS ===
  const startGame = () => {
    if (!selectedTone || !forName.trim() || !fromName.trim()) return;
    setScreen('game');
  };
  const playAgain = () => {
    setScore(0); setTimeLeft(GAME_DURATION); setCandies([]);
    setSelectedTone(null); setForName(''); setFromName('');
    setIncomingGram(null);
    // clear hash
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setScreen('title');
  };
  const sendOneBack = () => {
    // pre-fill "for" with the original sender, clear "from"
    setForName(incomingGram?.fromName || '');
    setFromName('');
    setSelectedTone(null);
    setIncomingGram(null);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setScreen('title');
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen w-full overflow-hidden relative" style={{
      background: selectedTone ? TONES[selectedTone].bg : incomingGram ? TONES[incomingGram.tone].bg : 'radial-gradient(ellipse at top, #fef9e7 0%, #fce7f3 50%, #e0f2fe 100%)',
      transition: 'background 0.6s ease',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes studTumble {
          0% { opacity: 0; transform: translate(-3px, -22px) rotate(-30deg) scale(0.4); }
          55% { opacity: 1; transform: translate(2px, 3px) rotate(10deg) scale(1.1); }
          80% { transform: translate(-1px, -1px) rotate(-4deg) scale(0.97); }
          100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes cloudDrift {
          from { transform: translateX(-260px); }
          to { transform: translateX(calc(100vw + 260px)); }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-14px) scale(1.2); opacity: 1; }
        }
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes candyIn {
          0% { opacity: 0; transform: scale(0.2) translate(-50%, -50%); }
          60% { transform: scale(1.15) translate(-50%, -50%); }
          100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
        }
        @keyframes candyBob {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--rot)); }
          50% { transform: translate(-50%, calc(-50% - 6px)) rotate(var(--rot)); }
        }
        @keyframes scorePop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -65%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(1); }
        }
        @keyframes arenaShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chipBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes confettiFall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .screen-fade { animation: fadeUp 0.4s ease-out; }
      `}</style>

      {/* ====== TITLE ====== */}
      {screen === 'title' && (
        <>
          <CloudBg />
          <div className="screen-fade max-w-2xl mx-auto px-4 py-3 sm:py-5 relative" style={{ zIndex: 10 }}>
          {/* Hero */}
          <div className="text-center mb-3">
            <div className="inline-block mb-1" style={{ animation: 'mascotBob 3.2s ease-in-out infinite', transformOrigin: 'bottom center' }}>
              <BrickRosette
                bodyColor={selectedTone ? TONES[selectedTone].primary : '#ff3b6b'}
                bodyDeep={selectedTone ? TONES[selectedTone].deep : '#c91f4a'} />
            </div>
            <h1 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
              fontSize: 'clamp(1.9rem, 7vw, 3.2rem)',
              letterSpacing: '-0.03em', lineHeight: 0.95,
              color: '#1a1a1a',
            }}>tap-a-gram</h1>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontStyle: 'italic',
              fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500, marginTop: 4,
            }}>tap candies, build a love note in bricks.</p>
          </div>

          {/* Tone selector */}
          <div className="mb-3">
            <SectionLabel>1 · pick a tone</SectionLabel>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {TONE_ORDER.map(tid => {
                const t = TONES[tid];
                const sel = selectedTone === tid;
                return (
                  <button key={tid} onClick={() => { setSelectedTone(tid); audio.play('pop'); }}
                    className="relative transition-all"
                    style={{
                      backgroundColor: sel ? t.primary : '#ffffff',
                      color: sel ? '#ffffff' : '#1a1a1a',
                      borderRadius: 14, padding: '8px 6px',
                      border: 'none', cursor: 'pointer',
                      boxShadow: sel
                        ? `0 6px 0 ${t.deep}, inset 0 -3px 6px rgba(0,0,0,0.15)`
                        : '0 4px 0 #d4cfc4, inset 0 -2px 4px rgba(0,0,0,0.05)',
                      transform: sel ? 'translateY(-2px)' : 'translateY(0)',
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}>
                    <div style={{ fontSize: '1.3rem', lineHeight: 1, marginBottom: 2 }}>{t.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', letterSpacing: '-0.01em' }}>{t.name}</div>
                    {sel && <StudRow count={3} color={t.primary} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name inputs */}
          <div className="mb-3">
            <SectionLabel>2 · who's it for & from</SectionLabel>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <ChunkyInput label="for" value={forName} onChange={setForName} placeholder="Jamie" />
              <ChunkyInput label="from" value={fromName} onChange={setFromName} placeholder="Alex" />
            </div>
          </div>

          {/* Start button */}
          <div className="mb-2">
            <SectionLabel>3 · 60s. tap good, dodge gray.</SectionLabel>
          </div>
          <BrickButton
            onClick={startGame}
            disabled={!selectedTone || !forName.trim() || !fromName.trim()}
            color={selectedTone ? TONES[selectedTone].primary : '#9ca3af'}
            size="md">
            <Play size={18} fill="#ffffff" /> start tapping
          </BrickButton>

          {/* Sound toggle */}
          <button onClick={() => setSoundOn(s => !s)}
            className="mt-3 mx-auto flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{
              opacity: 0.6, fontFamily: "'DM Mono', monospace",
              fontSize: '0.7rem', color: '#1a1a1a',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', textTransform: 'uppercase', letterSpacing: '0.15em',
            }}>
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            sound {soundOn ? 'on' : 'off'}
          </button>
          </div>
        </>
      )}

      {/* ====== GAME ====== */}
      {screen === 'game' && selectedTone && (() => {
        const tone = TONES[selectedTone];
        const Vibe = VIBE_ICONS[tone.vibe];
        const pct = (timeLeft / GAME_DURATION) * 100;
        return (
          <div className="screen-fade max-w-2xl mx-auto px-4 py-3 flex flex-col" style={{ height: '100dvh' }}>
            {/* HUD */}
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full flex items-center justify-center"
                  style={{ width: 44, height: 44, backgroundColor: tone.primary, boxShadow: `0 4px 0 ${tone.deep}` }}>
                  <Vibe size={22} color="#ffffff" fill="#ffffff" fillOpacity={0.3} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a1a', opacity: 0.6 }}>
                    for {forName}
                  </div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', lineHeight: 1 }}>
                    {tone.name} run
                  </div>
                </div>
              </div>
              <ScoreBubble score={score} color={tone.primary} deep={tone.deep} />
            </div>

            {/* Time bar */}
            <div className="rounded-full h-2 mb-2 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
              <div className="h-full transition-all" style={{
                width: `${pct}%`, backgroundColor: timeLeft < 10 ? '#dc2626' : tone.deep,
                transition: 'width 100ms linear',
              }}/>
            </div>

            {/* Arena */}
            <div ref={arenaRef} className="relative w-full rounded-3xl overflow-hidden flex-1 min-h-0"
              style={{
                background: `${tone.soft}`,
                border: `4px solid ${tone.deep}`,
                boxShadow: `0 6px 0 ${tone.deep}, inset 0 0 50px rgba(0,0,0,0.05)`,
                animation: shake > 0 ? 'arenaShake 0.25s ease-in-out' : 'none',
              }}>
              {/* Baseplate stud pattern */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 125" preserveAspectRatio="none">
                {Array.from({ length: 14 }).map((__, gy) =>
                  Array.from({ length: 12 }).map((___, gx) => (
                    <circle key={`bp-${gx}-${gy}`}
                      cx={gx * 8.5 + 4.5} cy={gy * 8.5 + 4.5} r="1"
                      fill={tone.primary} opacity="0.18" />
                  ))
                )}
              </svg>

              {/* Vibe legend bottom-left */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
                <Vibe size={14} color={tone.primary} fill={tone.primary} fillOpacity={0.3} strokeWidth={2.5} />
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
                  color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
                }}>on-vibe = bonus</span>
              </div>

              {/* Time bottom-right */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '0.85rem',
                  color: timeLeft < 10 ? '#dc2626' : '#1a1a1a', fontWeight: 700,
                }}>{Math.ceil(timeLeft)}s</span>
              </div>

              {/* Candies */}
              {candies.map(c => {
                const ageMs = performance.now() - c.spawnTime;
                const remaining = c.lifetime - ageMs;
                const fadingOut = remaining < 400;
                return (
                  <button key={c.id} onClick={() => tapCandy(c)}
                    className="absolute"
                    style={{
                      left: `${c.x}%`, top: `${c.y}%`,
                      transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      animation: `candyIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), candyBob 1.6s ease-in-out 0.4s infinite`,
                      ['--rot']: `${c.rot}deg`,
                      opacity: fadingOut ? remaining / 400 : 1,
                      zIndex: c.isVibe ? 3 : c.isBad ? 1 : 2,
                    }}>
                    <CandyShape kind={c.kind} color={c.color} vibeKind={c.vibeKind} size={c.isVibe ? 78 : 64} isBad={c.isBad} />
                  </button>
                );
              })}

              {/* Score pops */}
              {scorePops.map(p => (
                <div key={p.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800, fontSize: '1.6rem',
                    color: p.delta > 0 ? (p.delta >= SCORE_VIBE ? tone.deep : '#1a1a1a') : '#dc2626',
                    textShadow: '0 2px 0 rgba(255,255,255,0.8)',
                    animation: 'scorePop 700ms ease-out forwards',
                  }}>
                  {p.delta > 0 ? '+' : ''}{p.delta}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ====== REVEAL (after playing) ====== */}
      {screen === 'reveal' && selectedTone && (() => {
        const tone = TONES[selectedTone];
        const message = getMessage(selectedTone, revealTier, revealMessageIdx);
        const tierLabels = { 1: 'a little gram', 2: 'a real gram', 3: 'a big gram' };
        return (
          <div className="screen-fade max-w-xl mx-auto px-4 py-3 sm:py-4">
            <div className="text-center mb-1">
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: '0.7rem',
                color: tone.deep, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700,
              }}>{tierLabels[revealTier]} · {score} pts</span>
            </div>
            <h2 className="text-center mb-3" style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
              fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
              letterSpacing: '-0.02em', color: '#1a1a1a', lineHeight: 1.05,
            }}>for {forName}</h2>

            {/* Mosaic */}
            <div className="rounded-3xl p-3 sm:p-4 mb-3 flex items-center justify-center"
              style={{
                backgroundColor: '#ffffff',
                border: `4px solid ${tone.deep}`,
                boxShadow: `0 8px 0 ${tone.deep}`,
                maxHeight: '52vh',
                overflow: 'hidden',
              }}>
              <div style={{ height: 'min(46vh, 360px)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BrickMosaic message={message} tone={tone} animate />
              </div>
            </div>

            {/* From signature */}
            <div className="text-center mb-3">
              <p style={{
                fontFamily: "'Bricolage Grotesque', sans-serif", fontStyle: 'italic',
                fontSize: '1rem', color: '#1a1a1a', fontWeight: 600,
              }}>from {fromName} {tone.emoji}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <BrickButton onClick={copyLink} color={copied ? tone.deep : tone.primary} size="md">
                {copied ? <><Check size={16} /> copied</> : <><Send size={16} /> copy link</>}
              </BrickButton>
              <BrickButton onClick={downloadPng} color={tone.primary} size="md" disabled={downloading}>
                <Download size={16} /> {downloading ? 'saving' : 'save png'}
              </BrickButton>
            </div>
            <BrickButton onClick={playAgain} color="#1a1a1a" size="md">
              <RotateCcw size={16} /> new gram
            </BrickButton>

            {/* Confetti */}
            {showRevealConfetti && <Confetti tone={tone} />}
          </div>
        );
      })()}

      {/* ====== RECEIVED (opened from a link) ====== */}
      {screen === 'received' && incomingGram && (() => {
        const tone = TONES[incomingGram.tone];
        const message = getMessage(incomingGram.tone, incomingGram.tier, incomingGram.messageIdx);
        return (
          <div className="screen-fade max-w-xl mx-auto px-4 py-3 sm:py-4">
            <div className="text-center mb-1">
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: '0.7rem',
                color: tone.deep, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700,
              }}>you got a gram</span>
            </div>
            {incomingGram.forName && (
              <h2 className="text-center mb-3" style={{
                fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
                fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
                letterSpacing: '-0.02em', color: '#1a1a1a', lineHeight: 1.05,
              }}>for {incomingGram.forName}</h2>
            )}

            <div className="rounded-3xl p-3 sm:p-4 mb-3 flex items-center justify-center"
              style={{
                backgroundColor: '#ffffff',
                border: `4px solid ${tone.deep}`,
                boxShadow: `0 8px 0 ${tone.deep}`,
                maxHeight: '52vh',
                overflow: 'hidden',
              }}>
              <div style={{ height: 'min(46vh, 360px)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BrickMosaic message={message} tone={tone} animate />
              </div>
            </div>

            {incomingGram.fromName && (
              <div className="text-center mb-3">
                <p style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif", fontStyle: 'italic',
                  fontSize: '1rem', color: '#1a1a1a', fontWeight: 600,
                }}>from {incomingGram.fromName} {tone.emoji}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-2">
              <BrickButton onClick={sendOneBack} color={tone.primary} size="md">
                <Send size={16} /> send one back
              </BrickButton>
              <BrickButton onClick={downloadPng} color={tone.deep} size="md" disabled={downloading}>
                <Download size={16} /> {downloading ? 'saving' : 'save png'}
              </BrickButton>
            </div>
            <BrickButton onClick={playAgain} color="#1a1a1a" size="md">
              <Play size={16} /> play your own
            </BrickButton>

            <Confetti tone={tone} oneShot />
          </div>
        );
      })()}
    </div>
  );
}

// ============================================================
// SMALL HELPERS / COMPONENTS
// ============================================================

function drawStud(ctx, x, y, size, color) {
  const pad = size * 0.04;
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.roundRect(x + pad * 2, y + size * 0.06, size - pad * 2, size - pad * 2, size * 0.1);
  ctx.fill();
  // base
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  ctx.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, size * 0.1);
  ctx.fill(); ctx.stroke();
  // highlight
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.roundRect(x + size * 0.08, y + size * 0.08, size * 0.84, size * 0.18, size * 0.08);
  ctx.fill();
  // stud shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.55, size * 0.26, 0, Math.PI * 2);
  ctx.fill();
  // stud
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = size * 0.03;
  ctx.stroke();
  // stud highlight
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(x + size * 0.42, y + size * 0.42, size * 0.1, size * 0.06, 0, 0, Math.PI * 2);
  ctx.fill();
}

const SectionLabel = ({ children }) => (
  <span style={{
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.7rem',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontWeight: 600,
    opacity: 0.7,
  }}>{children}</span>
);

const ChunkyInput = ({ label, value, onChange, placeholder }) => (
  <div className="relative">
    <label style={{
      position: 'absolute', top: -8, left: 14,
      fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
      backgroundColor: '#ffffff', padding: '0 6px',
      textTransform: 'uppercase', letterSpacing: '0.15em',
      color: '#1a1a1a', opacity: 0.7, fontWeight: 600,
    }}>{label}</label>
    <input type="text" value={value}
      onChange={e => onChange(e.target.value.slice(0, 18))}
      placeholder={placeholder}
      maxLength={18}
      className="w-full outline-none"
      style={{
        backgroundColor: '#ffffff',
        border: '3px solid #1a1a1a',
        borderRadius: 14,
        padding: '14px 16px',
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 600,
        fontSize: '1.05rem',
        color: '#1a1a1a',
        boxShadow: '0 4px 0 #1a1a1a',
      }}/>
  </div>
);

const StudRow = ({ count = 3, color }) => (
  <span aria-hidden style={{
    position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', gap: 6,
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} style={{
        width: 10, height: 10, borderRadius: '50%',
        background: '#ffffff',
        boxShadow: `inset 0 -2px 2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.6)`,
      }}/>
    ))}
  </span>
);

const ScoreBubble = ({ score, color, deep }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full"
    style={{
      backgroundColor: '#ffffff',
      border: `3px solid ${deep}`,
      boxShadow: `0 4px 0 ${deep}`,
    }}>
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: '0.65rem',
      color: '#1a1a1a', opacity: 0.6,
      textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600,
    }}>pts</span>
    <span style={{
      fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800,
      fontSize: '1.5rem', color: '#1a1a1a', letterSpacing: '-0.02em',
      lineHeight: 1,
    }}>{score}</span>
  </div>
);

const BrickRosette = ({ bodyColor = '#ff3b6b', bodyDeep = '#c91f4a' }) => (
  <svg viewBox="0 0 160 200" width="92" height="115">
    {/* ground shadow */}
    <ellipse cx="80" cy="195" rx="46" ry="6" fill="rgba(0,0,0,0.22)" />

    {/* === LEGS === */}
    <rect x="55" y="158" width="22" height="36" rx="3" fill="#1f2937" stroke="rgba(0,0,0,0.35)" strokeWidth="1.8" />
    <rect x="83" y="158" width="22" height="36" rx="3" fill="#1f2937" stroke="rgba(0,0,0,0.35)" strokeWidth="1.8" />
    {/* leg gloss */}
    <rect x="57" y="161" width="18" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x="85" y="161" width="18" height="6" rx="2" fill="rgba(255,255,255,0.18)" />
    {/* hip plate */}
    <rect x="52" y="152" width="56" height="10" rx="2" fill="#374151" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />

    {/* === BODY === */}
    <path d="M 52 100 L 108 100 L 114 152 L 46 152 Z" fill={bodyColor} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    {/* body gloss */}
    <path d="M 56 104 L 104 104 L 106 116 L 54 116 Z" fill="rgba(255,255,255,0.32)" />
    {/* body shading right side */}
    <path d="M 104 104 L 108 100 L 114 152 L 110 148 Z" fill="rgba(0,0,0,0.18)" />

    {/* === ARMS (raised up in joy) === */}
    {/* left arm */}
    <path d="M 52 108 Q 32 96 35 70 Q 42 62 54 70 L 60 110 Z" fill={bodyColor} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    <path d="M 36 72 Q 42 65 50 71" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
    {/* right arm */}
    <path d="M 108 108 Q 128 96 125 70 Q 118 62 106 70 L 100 110 Z" fill={bodyColor} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    <path d="M 124 72 Q 118 65 110 71" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />

    {/* === HANDS === */}
    <circle cx="38" cy="68" r="9" fill="#fcd34d" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    <circle cx="122" cy="68" r="9" fill="#fcd34d" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
    <ellipse cx="35" cy="65" rx="3" ry="1.5" fill="rgba(255,255,255,0.5)" />
    <ellipse cx="119" cy="65" rx="3" ry="1.5" fill="rgba(255,255,255,0.5)" />

    {/* === HEART CANDY in left hand === */}
    <g transform="translate(38, 56)">
      <path d="M 0 7 L -8 -1 Q -12 -6 -8 -10 Q -3 -11 0 -7 Q 3 -11 8 -10 Q 12 -6 8 -1 Z"
            fill="#ff3b6b" stroke="rgba(0,0,0,0.35)" strokeWidth="1.8" />
      <ellipse cx="-4" cy="-6" rx="2" ry="1.2" fill="rgba(255,255,255,0.6)" />
    </g>

    {/* === NECK === */}
    <rect x="72" y="93" width="16" height="9" rx="1" fill="#fbbf24" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

    {/* === HEAD === */}
    <circle cx="80" cy="64" r="32" fill="#fcd34d" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" />
    {/* head shading (right cheek) */}
    <path d="M 80 36 A 32 32 0 0 1 108 78 L 80 96 A 32 32 0 0 1 80 36 Z" fill="rgba(0,0,0,0.1)" />
    {/* head edge gloss (left top) */}
    <path d="M 56 56 Q 64 40 80 36" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />

    {/* eyes */}
    <circle cx="68" cy="62" r="3.5" fill="#1f2937" />
    <circle cx="92" cy="62" r="3.5" fill="#1f2937" />
    <circle cx="67" cy="60.5" r="1.2" fill="white" />
    <circle cx="91" cy="60.5" r="1.2" fill="white" />

    {/* smile */}
    <path d="M 68 74 Q 80 82 92 74" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />

    {/* blush */}
    <ellipse cx="60" cy="73" rx="4.5" ry="2.5" fill="#ff8aa8" opacity="0.65" />
    <ellipse cx="100" cy="73" rx="4.5" ry="2.5" fill="#ff8aa8" opacity="0.65" />

    {/* === HEAD STUD === */}
    <ellipse cx="80" cy="36" rx="10" ry="3" fill="rgba(0,0,0,0.22)" />
    <rect x="71" y="29" width="18" height="6" fill="#e5a017" />
    <ellipse cx="80" cy="29" rx="9" ry="2.8" fill="#fcd34d" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
    <ellipse cx="77" cy="27.5" rx="3.5" ry="1.2" fill="rgba(255,255,255,0.65)" />
  </svg>
);

// ============================================================
// CLOUDS BACKGROUND — drifting Lego-style clouds, full screen
// ============================================================
const CloudBg = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 240 110"
        style={{
          position: 'absolute',
          width: `${130 + i * 28}px`,
          top: `${4 + (i * 19) % 65}%`,
          left: `-260px`,
          animation: `cloudDrift ${42 + i * 11}s linear infinite`,
          animationDelay: `${-i * 9}s`,
          opacity: 0.55,
          filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.08))',
        }}>
        <ellipse cx="60" cy="70" rx="50" ry="32" fill="#ffffff" />
        <ellipse cx="110" cy="55" rx="42" ry="36" fill="#ffffff" />
        <ellipse cx="160" cy="65" rx="46" ry="30" fill="#ffffff" />
        <ellipse cx="100" cy="78" rx="60" ry="22" fill="#ffffff" />
        {/* gentle shadow on underside */}
        <ellipse cx="105" cy="88" rx="55" ry="6" fill="rgba(0,0,0,0.06)" />
      </svg>
    ))}
    {/* sparkles */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={`sp-${i}`} style={{
        position: 'absolute',
        top: `${(i * 11 + 5) % 90}%`,
        left: `${(i * 13 + 7) % 95}%`,
        width: 12, height: 12,
        animation: `sparkleFloat ${4 + (i % 3)}s ease-in-out ${-i * 0.7}s infinite`,
      }}>
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M 12 2 L 14 10 L 22 12 L 14 14 L 12 22 L 10 14 L 2 12 L 10 10 Z"
                fill="rgba(255,255,255,0.9)" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
        </svg>
      </div>
    ))}
  </div>
);

const Confetti = ({ tone, oneShot = false }) => {
  const colors = [tone.primary, tone.deep, ...tone.studColors.slice(0, 3), '#ffffff'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => {
        const left = (i * 1.7) % 100;
        const delay = (i % 12) * 80;
        const dur = 1800 + (i * 31) % 800;
        const rot = (i * 47) % 360;
        const drift = ((i * 17) % 70) - 35;
        const color = colors[i % colors.length];
        const isBrick = i % 3 === 0;
        return (
          <div key={i} className="absolute" style={{
            left: `${left}%`, top: '-30px',
            width: isBrick ? 14 : 10, height: isBrick ? 18 : 10,
            backgroundColor: color,
            borderRadius: isBrick ? 3 : '50%',
            boxShadow: isBrick ? `inset 0 -3px 0 rgba(0,0,0,0.2)` : 'none',
            animation: `confettiFall ${dur}ms ease-in ${delay}ms forwards`,
            transform: `rotate(${rot}deg)`,
            ['--drift']: `${drift}vw`,
          }} />
        );
      })}
    </div>
  );
};
