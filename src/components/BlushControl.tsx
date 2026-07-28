import React from 'react';
import type { EyelinerStyle } from '../types/makeup';

interface Props {
  isBlushActive: boolean;
  eyelinerStyle: EyelinerStyle;
  isPeekBefore: boolean;
  onToggleBlush: () => void;
  onCycleEyeliner: () => void;
  onTogglePeekBefore: () => void;
  onTakeSnapshot: () => void;
  onResetMakeup: () => void;
  cameraRunning: boolean;
  onStartCamera: () => void;
  statusText: string;
  statusType: 'idle' | 'loading' | 'live' | 'painted';
}

export const BlushControl: React.FC<Props> = ({
  isBlushActive,
  eyelinerStyle,
  isPeekBefore,
  onToggleBlush,
  onCycleEyeliner,
  onTogglePeekBefore,
  onTakeSnapshot,
  onResetMakeup,
  cameraRunning,
  onStartCamera,
  statusText,
  statusType,
}) => {
  const getEyelinerLabel = () => {
    if (eyelinerStyle === 'classic') return '👁️ Eyeliner: Classic Wing';
    if (eyelinerStyle === 'smoky') return '👁️ Eyeliner: Sultry Smoke';
    return '👁️ Eyeliner: OFF';
  };

  const getEyelinerClass = () => {
    if (eyelinerStyle === 'classic') return 'active-purple';
    if (eyelinerStyle === 'smoky') return 'active-pink';
    return '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div className="section-title">
        <span>✨ Interactive Makeover Suite</span>
      </div>
      <div className="actions-row">
        {!cameraRunning && (
          <button type="button" onClick={onStartCamera} className="primary-btn">
            Start Camera Studio
          </button>
        )}
        {cameraRunning && (
          <>
            <button
              type="button"
              onClick={onToggleBlush}
              className={`action-pill-btn ${isBlushActive ? 'active-pink' : ''}`}
            >
              🌸 Blush: {isBlushActive ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              onClick={onCycleEyeliner}
              className={`action-pill-btn ${getEyelinerClass()}`}
            >
              {getEyelinerLabel()}
            </button>

            <button
              type="button"
              onClick={onTakeSnapshot}
              className="action-pill-btn snapshot"
            >
              📸 Take Selfie
            </button>

            <button
              type="button"
              onClick={onTogglePeekBefore}
              className={`action-pill-btn ${isPeekBefore ? 'active-amber' : ''}`}
              title="Compare natural look with virtual makeover"
            >
              🔍 {isPeekBefore ? 'Showing Natural' : 'Peek Original'}
            </button>

            <button type="button" onClick={onResetMakeup} className="action-pill-btn" style={{ flex: '1 1 100%' }}>
              💫 Reset Studio Makeup
            </button>
          </>
        )}
      </div>

      <div className="status-badge">
        <span className={`status-dot ${statusType}`} />
        <span>{statusText}</span>
      </div>
    </div>
  );
};
