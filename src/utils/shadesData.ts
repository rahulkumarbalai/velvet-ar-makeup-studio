import type { LipShade } from '../types/makeup';

export const LIP_SHADES: LipShade[] = [
  {
    id: 'ruby',
    name: 'Ruby Red',
    rgba: 'rgba(225, 29, 72, 0.64)',
    hex: '#e11d48',
    stops: ['#881337', '#f43f5e', '#e11d48', '#9f1239', '#4c0519'],
    category: 'red',
  },
  {
    id: 'rose',
    name: 'Rose Velvet',
    rgba: 'rgba(236, 72, 153, 0.64)',
    hex: '#ec4899',
    stops: ['#9d174d', '#f472b6', '#ec4899', '#be185d', '#500724'],
    category: 'pink',
  },
  {
    id: 'berry',
    name: 'Midnight Berry',
    rgba: 'rgba(136, 19, 55, 0.74)',
    hex: '#881337',
    stops: ['#4c0519', '#9f1239', '#881337', '#64152f', '#28020b'],
    category: 'berry',
  },
  {
    id: 'coral',
    name: 'Sunset Coral',
    rgba: 'rgba(249, 115, 22, 0.60)',
    hex: '#f97316',
    stops: ['#9a3412', '#fb923c', '#f97316', '#c2410c', '#431407'],
    category: 'red',
  },
  {
    id: 'nude',
    name: 'Peachy Nude',
    rgba: 'rgba(217, 119, 104, 0.58)',
    hex: '#d97768',
    stops: ['#7c362b', '#ea9384', '#d97768', '#a84c3c', '#4a1b14'],
    category: 'nude',
  },
  // NEW LUXURY EXPANSE SHADES
  {
    id: 'bronze',
    name: 'Golden Bronze',
    rgba: 'rgba(180, 83, 9, 0.65)',
    hex: '#d97706',
    stops: ['#78350f', '#f59e0b', '#d97706', '#b45309', '#451a03'],
    category: 'exotic',
  },
  {
    id: 'fuchsia',
    name: 'Electric Fuchsia',
    rgba: 'rgba(217, 70, 239, 0.66)',
    hex: '#d946ef',
    stops: ['#701a75', '#e879f9', '#d946ef', '#a21caf', '#4a044e'],
    category: 'pink',
  },
  {
    id: 'cocoa',
    name: 'Truffle Cocoa',
    rgba: 'rgba(120, 53, 31, 0.70)',
    hex: '#78351f',
    stops: ['#451a03', '#92400e', '#78351f', '#602213', '#280d05'],
    category: 'nude',
  },
  {
    id: 'lilac',
    name: 'Glitter Lilac',
    rgba: 'rgba(168, 85, 247, 0.62)',
    hex: '#a855f7',
    stops: ['#581c87', '#c084fc', '#a855f7', '#7e22ce', '#3b0764'],
    category: 'exotic',
  }
];

export const DEFAULT_SHADE = LIP_SHADES[0];
