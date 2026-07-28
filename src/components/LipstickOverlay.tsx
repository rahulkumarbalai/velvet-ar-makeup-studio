import React from 'react';
import type { LipstickOverlayState } from '../types/makeup';

interface Props {
  state: LipstickOverlayState;
  stops: string[];
}

export const LipstickOverlay: React.FC<Props> = ({ state, stops }) => {
  if (!state.visible) return null;

  return (
    <div
      className="lipstick-overlay"
      style={{
        opacity: 1,
        left: `${state.xPercent}%`,
        top: `${state.yPercent}%`,
        width: `${state.widthPx}px`,
        height: `${state.heightPx}px`,
        transform: 'translate(-50%, -68%) scale(1)',
      }}
    >
      <svg viewBox="0 0 120 400" xmlns="http://www.w3.org/2000/svg" className="lipstick-svg">
        <defs>
          <linearGradient id="reactCasingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="25%" stopColor="#21293a" />
            <stop offset="55%" stopColor="#141a27" />
            <stop offset="85%" stopColor="#05080f" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="reactGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9f580a" />
            <stop offset="25%" stopColor="#f5b842" />
            <stop offset="50%" stopColor="#fef3ae" />
            <stop offset="75%" stopColor="#e39a2b" />
            <stop offset="100%" stopColor="#693703" />
          </linearGradient>

          <linearGradient id="reactSheathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8c95a3" />
            <stop offset="30%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="90%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="reactBulletGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            {stops.map((color, i) => {
              const offset = Math.round((i / (stops.length - 1)) * 100);
              return <stop key={i} offset={`${offset}%`} stopColor={color} />;
            })}
          </linearGradient>

          <linearGradient id="reactShineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <filter id="reactUltraShadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>

        <g filter="url(#reactUltraShadow)">
          <rect x="15" y="190" width="90" height="195" rx="7" fill="url(#reactCasingGrad)" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="60" cy="275" r="16" fill="none" stroke="url(#reactGoldGrad)" strokeWidth="2" opacity="0.9" />
          <text x="60" y="282" fontFamily="'Outfit', serif" fontSize="16" fontWeight="800" fill="url(#reactGoldGrad)" textAnchor="middle">V</text>
          <path d="M 32 215 L 88 215" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

          <rect x="17" y="174" width="86" height="18" rx="2.5" fill="url(#reactGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
          
          <rect x="24" y="100" width="72" height="76" rx="3.5" fill="url(#reactSheathGrad)" stroke="#94a3b8" strokeWidth="1" />
          <line x1="46" y1="100" x2="46" y2="176" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />

          <path
            d="M 28 102 C 28 75, 31 45, 48 20 C 58 6, 78 4, 88 20 C 93 28, 92 65, 92 102 Z"
            fill="url(#reactBulletGrad)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.5"
          />
          <path d="M 40 98 C 38 72, 41 42, 54 24 C 47 42, 44 68, 46 98 Z" fill="url(#reactShineGrad)" opacity="0.9" />
          <ellipse cx="68" cy="18" rx="14" ry="7" transform="rotate(-18 68 18)" fill="rgba(255,255,255,0.3)" filter="blur(1px)" />
        </g>
      </svg>
    </div>
  );
};
