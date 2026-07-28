import type { Landmark, LipShade, EyelinerStyle } from '../types/makeup';

// MediaPipe Lip Landmark Contour Indices
export const UPPER_LIP_INDICES = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 61
];

export const LOWER_LIP_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 61
];

// MediaPipe Cheek Apple Landmark Clusters
export const LEFT_CHEEK_INDICES = [117, 123, 50, 205, 137, 177, 215, 138];
export const RIGHT_CHEEK_INDICES = [346, 352, 280, 425, 366, 401, 435, 367];

// MediaPipe Upper Eyelash Line Contours (Left and Right Eyes)
export const LEFT_EYE_LASH_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
export const RIGHT_EYE_LASH_INDICES = [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 263];

/**
 * Render virtual eyeliner / eye styling onto the 2D canvas context.
 */
export function renderEyeliner(
  ctx: CanvasRenderingContext2D,
  faceLandmarks: Landmark[],
  style: EyelinerStyle
): void {
  if (style === 'none' || !faceLandmarks || faceLandmarks.length < 468) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();

  const drawEyeContour = (indices: number[], isLeft: boolean) => {
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const pt = faceLandmarks[idx];
      if (!pt) return;
      let x = pt.x * width;
      let y = pt.y * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    if (style === 'classic') {
      // Classic Liquid Winged Eyeliner
      ctx.filter = 'blur(1.8px)';
      ctx.strokeStyle = 'rgba(9, 9, 11, 0.85)';
      ctx.lineWidth = Math.max(2.5, width * 0.0035);
      ctx.stroke();

      // Wing tip extension at outer corners (133 for Left eye on camera, 263 for Right eye)
      const outerCornerIdx = isLeft ? 133 : 263;
      const innerCornerIdx = isLeft ? 33 : 362;
      const outerPt = faceLandmarks[outerCornerIdx];
      const innerPt = faceLandmarks[innerCornerIdx];

      if (outerPt && innerPt) {
        const ox = outerPt.x * width;
        const oy = outerPt.y * height;
        const ix = innerPt.x * width;
        const iy = innerPt.y * height;

        // Vector pointing outward & slightly upward for feline wing
        const dirX = ox - ix;
        const dirY = oy - iy;
        const len = Math.hypot(dirX, dirY) || 1;
        const wingLen = len * 0.25;

        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + (dirX / len) * wingLen, oy + (dirY / len) * wingLen - (wingLen * 0.35));
        ctx.strokeStyle = 'rgba(9, 9, 11, 0.80)';
        ctx.lineWidth = Math.max(2, width * 0.0028);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    } else if (style === 'smoky') {
      // Sultry Smoky Shadow diffusion
      ctx.filter = 'blur(7px)';
      ctx.fillStyle = 'rgba(49, 16, 63, 0.42)'; // Deep plum/charcoal smoky tone
      ctx.fill();
      ctx.filter = 'blur(2.2px)';
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.70)';
      ctx.lineWidth = Math.max(3, width * 0.0045);
      ctx.stroke();
    }
  };

  drawEyeContour(LEFT_EYE_LASH_INDICES, true);
  drawEyeContour(RIGHT_EYE_LASH_INDICES, false);

  ctx.restore();
}

/**
 * Render soft airbrushed rosy pink cheek blush onto the 2D canvas context.
 */
export function renderCheekBlush(
  ctx: CanvasRenderingContext2D,
  faceLandmarks: Landmark[]
): void {
  const earLeft = faceLandmarks[234];
  const earRight = faceLandmarks[454];
  if (!earLeft || !earRight) return;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Dynamically calculate radius proportional to overall face width
  const faceWidthPx = Math.hypot((earRight.x - earLeft.x) * width, (earRight.y - earLeft.y) * height);
  const blushRadius = faceWidthPx * 0.21;

  const drawCheek = (indices: number[]) => {
    let sumX = 0, sumY = 0;
    let count = 0;
    indices.forEach(idx => {
      const pt = faceLandmarks[idx];
      if (pt) {
        sumX += pt.x * width;
        sumY += pt.y * height;
        count++;
      }
    });
    if (count === 0) return;
    const centerX = sumX / count;
    const centerY = sumY / count;

    ctx.save();
    ctx.filter = 'blur(14px)'; // Airbrushed soft makeup glow
    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, blushRadius);
    grad.addColorStop(0, 'rgba(244, 114, 182, 0.48)');    // Rosy glow at center of apple
    grad.addColorStop(0.55, 'rgba(244, 114, 182, 0.18)'); // Mid-tone feathering
    grad.addColorStop(1, 'rgba(244, 114, 182, 0)');       // Seamless transparent skin fade

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, blushRadius, blushRadius * 0.76, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  };

  drawCheek(LEFT_CHEEK_INDICES);
  drawCheek(RIGHT_CHEEK_INDICES);
}

/**
 * Render smooth lip tint with edge blur and specular center gloss highlight.
 */
export function renderMakeupStudio(
  ctx: CanvasRenderingContext2D,
  faceLandmarks: Landmark[],
  shade: LipShade,
  isBlushActive: boolean,
  eyelinerStyle: EyelinerStyle,
  isPeekBefore: boolean
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // If user is actively holding down "Peek Before / Natural", bypass rendering completely!
  if (isPeekBefore) return;

  // 1. Draw cheek blush first
  if (isBlushActive) {
    renderCheekBlush(ctx, faceLandmarks);
  }

  // 2. Draw Eyeliner styling
  if (eyelinerStyle !== 'none') {
    renderEyeliner(ctx, faceLandmarks, eyelinerStyle);
  }

  // 3. Draw upper and lower lip makeup
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.save();
  ctx.filter = 'blur(2.5px)'; // Feather lip boundaries for authentic lipstick blend
  ctx.fillStyle = shade.rgba;

  const drawPolygon = (indices: number[]) => {
    ctx.beginPath();
    indices.forEach((index, idx) => {
      const pt = faceLandmarks[index];
      if (!pt) return;
      const x = pt.x * width;
      const y = pt.y * height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  };

  drawPolygon(UPPER_LIP_INDICES);
  drawPolygon(LOWER_LIP_INDICES);

  // 4. Realistic lower-lip glossy reflection highlight
  const bottomOuter = faceLandmarks[17];
  const bottomInner = faceLandmarks[14];
  if (bottomOuter && bottomInner) {
    ctx.filter = 'blur(5px)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.beginPath();
    const shineX = ((bottomOuter.x + bottomInner.x) / 2) * width;
    const shineY = ((bottomOuter.y + bottomInner.y) / 2) * height;
    ctx.arc(shineX, shineY, width * 0.016, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
