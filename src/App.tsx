import React, { useState, useCallback, useRef, useEffect } from 'react';
import './styles/index.css';
import './styles/studio.css';
import { DEFAULT_SHADE } from './utils/shadesData';
import type { LipShade, LipstickOverlayState, EyelinerStyle } from './types/makeup';
import { Header } from './components/Header';
import { StudioCamera } from './components/StudioCamera';
import { LipstickOverlay } from './components/LipstickOverlay';
import { ShadePalette } from './components/ShadePalette';
import { BlushControl } from './components/BlushControl';
import { GuideCards } from './components/GuideCards';

export const App: React.FC = () => {
  const [activeShade, setActiveShade] = useState<LipShade>(DEFAULT_SHADE);
  // User explicit request: Blush is preapplied it should be applied after user clicks on Blush: ON
  const [isBlushActive, setIsBlushActive] = useState<boolean>(false);
  const [eyelinerStyle, setEyelinerStyle] = useState<EyelinerStyle>('none');
  const [isLipsPainted, setIsLipsPainted] = useState<boolean>(false);
  const [isPeekBefore, setIsPeekBefore] = useState<boolean>(false);
  const [cameraRunning, setCameraRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Click "Start Camera Studio" below to initialize real-time neural makeup detection.'
  );
  const [statusType, setStatusType] = useState<'idle' | 'loading' | 'live' | 'painted'>('idle');
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [overlayState, setOverlayState] = useState<LipstickOverlayState>({
    visible: false,
    xPercent: 50,
    yPercent: 50,
    widthPx: 38,
    heightPx: 110,
  });

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Cursor & Touch tracking for hypnotic ambient glow movements
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const handleRegisterMediaRefs = useCallback((video: HTMLVideoElement | null, canvas: HTMLCanvasElement | null) => {
    videoElementRef.current = video;
    canvasElementRef.current = canvas;
  }, []);

  const handleSelectShade = (shade: LipShade) => {
    setActiveShade(shade);
    if (isLipsPainted) {
      setStatusMessage(`Switched lipstick to luxury ${shade.name}.`);
    }
  };

  const handleToggleBlush = () => {
    const nextVal = !isBlushActive;
    setIsBlushActive(nextVal);
    setStatusMessage(nextVal ? '🌸 Rosy pink cheek blush enabled!' : 'Rosy pink cheek blush disabled.');
  };

  const handleCycleEyeliner = () => {
    const styles: EyelinerStyle[] = ['none', 'classic', 'smoky'];
    const nextIdx = (styles.indexOf(eyelinerStyle) + 1) % styles.length;
    const nextStyle = styles[nextIdx];
    setEyelinerStyle(nextStyle);
    if (nextStyle === 'classic') setStatusMessage('Applied Classic Liquid Winged Eyeliner!');
    else if (nextStyle === 'smoky') setStatusMessage('Applied Sultry Smoky Eye shadow diffusion!');
    else setStatusMessage('Eyeliner styling turned OFF.');
  };

  const handleTogglePeekBefore = () => {
    const nextVal = !isPeekBefore;
    setIsPeekBefore(nextVal);
    if (nextVal) {
      setStatusMessage('Showing your untouched natural look (Peek Before mode ON).');
    } else {
      setStatusMessage('Restored virtual luxury AI makeover overlay!');
    }
  };

  const handleTakeSnapshot = () => {
    const video = videoElementRef.current;
    const canvas = canvasElementRef.current;
    if (!video || !canvas || !cameraRunning) {
      setStatusMessage('Camera stream must be active to capture a selfie!');
      return;
    }

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width || video.videoWidth || 1280;
    offscreen.height = canvas.height || video.videoHeight || 720;
    const ctx = offscreen.getContext('2d');

    if (ctx && offscreen.width > 0 && offscreen.height > 0) {
      ctx.save();
      ctx.translate(offscreen.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
      ctx.restore();

      ctx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);

      const dataUrl = offscreen.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `velvet-ar-makeover-${activeShade.id}.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage('📸 High-resolution makeover selfie downloaded successfully!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleResetMakeup = () => {
    setIsLipsPainted(false);
    setIsPeekBefore(false);
    setStatusMessage('Makeup reset. Guide the lipstick bullet to your mouth to paint again!');
    setStatusType('live');
    setShowCelebration(false);
  };

  const handleStartCamera = () => {
    setCameraRunning(true);
  };

  const handleStatusChange = useCallback(
    (text: string, type: 'idle' | 'loading' | 'live' | 'painted') => {
      setStatusMessage(text);
      setStatusType(type);
    },
    []
  );

  const handleMakeupApplied = useCallback(() => {
    setIsLipsPainted(true);
    setStatusType('painted');
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 4500);
  }, []);

  const handleOverlayUpdate = useCallback((newOverlay: LipstickOverlayState) => {
    setOverlayState((prev) => {
      if (!prev.visible && !newOverlay.visible) {
        return prev;
      }
      return newOverlay;
    });
  }, []);

  const celebrationText = `✨ Magnificent! Makeover in ${activeShade.name} ✨`;

  return (
    <>
      {/* Impressive Dynamic & Interactive Ambient Background with Movements */}
      <div className="ambient-background">
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
        <div className="interactive-spotlight" />
      </div>

      <div className="studio-container">
        <div className={`sparkle-toast ${showCelebration ? 'visible' : ''}`}>{celebrationText}</div>

        <Header />

        <div className="studio-grid">
          <div style={{ position: 'relative', width: '100%' }}>
            <StudioCamera
              cameraRunning={cameraRunning}
              activeShade={activeShade}
              isBlushActive={isBlushActive}
              eyelinerStyle={eyelinerStyle}
              isLipsPainted={isLipsPainted}
              isPeekBefore={isPeekBefore}
              onMakeupApplied={handleMakeupApplied}
              onStatusChange={handleStatusChange}
              onOverlayUpdate={handleOverlayUpdate}
              onRegisterMediaRefs={handleRegisterMediaRefs}
            />
            <LipstickOverlay state={overlayState} stops={activeShade.stops} />
          </div>

          <div className="controls-dashboard">
            <ShadePalette activeShade={activeShade} onSelectShade={handleSelectShade} />
            <BlushControl
              isBlushActive={isBlushActive}
              eyelinerStyle={eyelinerStyle}
              isPeekBefore={isPeekBefore}
              onToggleBlush={handleToggleBlush}
              onCycleEyeliner={handleCycleEyeliner}
              onTogglePeekBefore={handleTogglePeekBefore}
              onTakeSnapshot={handleTakeSnapshot}
              onResetMakeup={handleResetMakeup}
              cameraRunning={cameraRunning}
              onStartCamera={handleStartCamera}
              statusText={statusMessage}
              statusType={statusType}
            />
          </div>
        </div>

        <GuideCards />
      </div>
    </>
  );
};
export default App;
