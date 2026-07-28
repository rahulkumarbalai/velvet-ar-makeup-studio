export type EyelinerStyle = 'none' | 'classic' | 'smoky';

export interface LipShade {
  id: string;
  name: string;
  rgba: string;      // Color applied to HTML5 Canvas for lip makeup
  hex: string;       // Swatch preview color
  stops: string[];   // SVG Gradient color stops for virtual bullet lipstick
  category: 'red' | 'pink' | 'berry' | 'nude' | 'exotic';
}

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface LipstickOverlayState {
  visible: boolean;
  xPercent: number;
  yPercent: number;
  widthPx: number;
  heightPx: number;
}

export interface StudioConfig {
  activeShade: LipShade;
  isBlushActive: boolean;
  eyelinerStyle: EyelinerStyle;
  isLipsPainted: boolean;
  isPeekBefore: boolean; // True when holding Before/After comparison button
  cameraRunning: boolean;
  statusMessage: string;
  statusType: 'idle' | 'loading' | 'live' | 'painted';
}

export interface HolisticResults {
  faceLandmarks?: Landmark[];
  leftHandLandmarks?: Landmark[];
  rightHandLandmarks?: Landmark[];
  image?: HTMLVideoElement | HTMLCanvasElement;
}
