import React, { useRef, useEffect, useCallback } from 'react';
import type { LipShade, LipstickOverlayState, EyelinerStyle } from '../types/makeup';
import { renderMakeupStudio } from '../utils/mediaPipeHelper';

interface Props {
  cameraRunning: boolean;
  activeShade: LipShade;
  isBlushActive: boolean;
  eyelinerStyle: EyelinerStyle;
  isLipsPainted: boolean;
  isPeekBefore: boolean;
  onMakeupApplied: () => void;
  onStatusChange: (text: string, type: 'idle' | 'loading' | 'live' | 'painted') => void;
  onOverlayUpdate: (state: LipstickOverlayState) => void;
  onRegisterMediaRefs: (video: HTMLVideoElement | null, canvas: HTMLCanvasElement | null) => void;
}

export const StudioCamera: React.FC<Props> = ({
  cameraRunning,
  activeShade,
  isBlushActive,
  eyelinerStyle,
  isLipsPainted,
  isPeekBefore,
  onMakeupApplied,
  onStatusChange,
  onOverlayUpdate,
  onRegisterMediaRefs,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cameraInstanceRef = useRef<any>(null);
  const holisticInstanceRef = useRef<any>(null);

  useEffect(() => {
    onRegisterMediaRefs(videoRef.current, canvasRef.current);
  }, [onRegisterMediaRefs]);

  const latestPropsRef = useRef({
    activeShade,
    isBlushActive,
    eyelinerStyle,
    isLipsPainted,
    isPeekBefore,
    onMakeupApplied,
    onOverlayUpdate,
  });

  useEffect(() => {
    latestPropsRef.current = {
      activeShade,
      isBlushActive,
      eyelinerStyle,
      isLipsPainted,
      isPeekBefore,
      onMakeupApplied,
      onOverlayUpdate,
    };
  }, [activeShade, isBlushActive, eyelinerStyle, isLipsPainted, isPeekBefore, onMakeupApplied, onOverlayUpdate]);

  const processResults = useCallback((results: any) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!video || !canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
    }

    const {
      activeShade,
      isBlushActive,
      eyelinerStyle,
      isLipsPainted,
      isPeekBefore,
      onMakeupApplied,
      onOverlayUpdate,
    } = latestPropsRef.current;

    // 1. Render painted lip makeup, blush, & eyeliner if lips touched or already painted
    if (isLipsPainted || isBlushActive || eyelinerStyle !== 'none') {
      renderMakeupStudio(
        ctx,
        results.faceLandmarks || [],
        isLipsPainted ? activeShade : { ...activeShade, rgba: 'rgba(0,0,0,0)' },
        isBlushActive,
        eyelinerStyle,
        isPeekBefore
      );
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Process Hand Landmarks for pinch gesture & anatomical sizing
    const hand = results.rightHandLandmarks || results.leftHandLandmarks;
    if (!hand || hand.length < 21 || isPeekBefore) {
      onOverlayUpdate({ visible: false, xPercent: 50, yPercent: 50, widthPx: 38, heightPx: 110 });
      return;
    }

    const thumb = hand[4];
    const index = hand[8];
    const wrist = hand[0];
    const indexMCP = hand[5];

    const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
    const isPinching = pinchDist < 0.11;

    if (isPinching) {
      const midX = (thumb.x + index.x) / 2;
      const midY = (thumb.y + index.y) / 2;

      const handScale = Math.hypot(wrist.x - indexMCP.x, wrist.y - indexMCP.y);
      const wrapRect = wrap.getBoundingClientRect();

      const targetHeight = Math.max(35, Math.min(140, handScale * wrapRect.height * 0.65));
      const targetWidth = targetHeight * 0.30;

      onOverlayUpdate({
        visible: true,
        xPercent: (1 - midX) * 100,
        yPercent: midY * 100,
        widthPx: targetWidth,
        heightPx: targetHeight,
      });

      // 3. Collision with lip center
      if (results.faceLandmarks && results.faceLandmarks.length > 14) {
        const upperInner = results.faceLandmarks[13];
        const lowerInner = results.faceLandmarks[14];
        const lipCenterX = (upperInner.x + lowerInner.x) / 2;
        const lipCenterY = (upperInner.y + lowerInner.y) / 2;

        const tipY = midY - handScale * 0.35;
        const distToLips = Math.hypot(midX - lipCenterX, tipY - lipCenterY);
        const gripToLips = Math.hypot(midX - lipCenterX, midY - lipCenterY);

        if (Math.min(distToLips, gripToLips) < 0.13) {
          if (!isLipsPainted) {
            onMakeupApplied();
          }
        }
      }
    } else {
      onOverlayUpdate({ visible: false, xPercent: 50, yPercent: 50, widthPx: 38, heightPx: 110 });
    }
  }, []);

  useEffect(() => {
    if (!cameraRunning) return;

    const startStudio = async () => {
      onStatusChange('Requesting camera & initializing neural tracking models...', 'loading');
      const video = videoRef.current;
      if (!video || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onStatusChange('Camera access is unavailable or unsupported in this browser.', 'idle');
        return;
      }

      try {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: isMobile
            ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
            : { facingMode: 'user' }, // Allows PC webcam to initialize at its natural default hardware aspect ratio
          audio: false,
        });
        video.srcObject = stream;

        const settings = stream.getVideoTracks()[0]?.getSettings() || {};
        const camWidth = settings.width || (isMobile ? 640 : 1280);
        const camHeight = settings.height || (isMobile ? 480 : 720);

        const HolisticClass = (window as any).Holistic;
        const CameraClass = (window as any).Camera;

        if (!HolisticClass || !CameraClass) {
          onStatusChange('MediaPipe modules failed to load. Please verify internet connectivity.', 'idle');
          return;
        }

        const holistic = new HolisticClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        holistic.onResults(processResults);
        holisticInstanceRef.current = holistic;

        const camera = new CameraClass(video, {
          onFrame: async () => {
            if (videoRef.current && holisticInstanceRef.current) {
              await holisticInstanceRef.current.send({ image: videoRef.current });
            }
          },
          width: camWidth,
          height: camHeight,
        });

        cameraInstanceRef.current = camera;
        await camera.start();
        onStatusChange('Studio live! Pinch to reveal your hand-scaled lipstick and guide to lips to paint.', 'live');
      } catch (err) {
        console.error('Error starting camera:', err);
        onStatusChange('Camera permission denied or stream error occurred.', 'idle');
      }
    };

    startStudio();

    return () => {
      if (cameraInstanceRef.current && typeof cameraInstanceRef.current.stop === 'function') {
        cameraInstanceRef.current.stop();
      }
      if (holisticInstanceRef.current && typeof holisticInstanceRef.current.close === 'function') {
        holisticInstanceRef.current.close();
      }
    };
  }, [cameraRunning, onStatusChange, processResults]);

  return (
    <div className="camera-wrapper" ref={wrapRef}>
      <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="camera-canvas" />
    </div>
  );
};
