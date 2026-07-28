import React from 'react';
import type { LipShade } from '../types/makeup';
import { LIP_SHADES } from '../utils/shadesData';

interface Props {
  activeShade: LipShade;
  onSelectShade: (shade: LipShade) => void;
}

export const ShadePalette: React.FC<Props> = ({ activeShade, onSelectShade }) => {
  return (
    <div>
      <div className="section-title" style={{ marginBottom: '10px' }}>
        <span>🎨 Luxury Shade Vault</span>
        <span className="section-badge">{LIP_SHADES.length} Shades</span>
      </div>
      <div className="shades-grid">
        {LIP_SHADES.map((shade) => {
          const isSelected = shade.id === activeShade.id;
          return (
            <button
              key={shade.id}
              type="button"
              onClick={() => onSelectShade(shade)}
              className={`shade-btn ${isSelected ? 'active' : ''}`}
            >
              <span className="shade-swatch" style={{ backgroundColor: shade.hex }} />
              <span>{shade.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
