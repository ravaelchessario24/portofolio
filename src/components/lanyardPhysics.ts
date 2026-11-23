export interface Point {
  x: number;
  y: number;
  px: number;
  py: number;
}

export interface LanyardDims {
  cw: number;
  ch: number;
  rope: number;
  strapWidth: number;
  scale: number;
  isMobile: boolean;
}

export interface GrabState {
  x: number;
  y: number;
  /** Normalized grab position on card: rx in [-0.5, 0.5], ry in [0, 1] */
  rx: number;
  ry: number;
}

/**
 * Always compute lanyard dimensions from viewport width (window.innerWidth),
 * NEVER from column width.
 */
export function getLanyardDims(viewportWidth: number): LanyardDims {
  if (viewportWidth >= 900) {
    return { cw: 240, ch: 392, rope: 204, strapWidth: 34, scale: 1, isMobile: false };
  }
  return { cw: 160, ch: 212, rope: 102, strapWidth: 24, scale: 0.68, isMobile: true };
}

export class VerletRope {
  pts: Point[] = [];
  restLengths: number[] = [];
  readonly segments = 9;
  private tick = 0;

  constructor(public anchorX: number, public dims: LanyardDims) {
    const startY = -6;
    const totalRope = dims.rope - startY;
    const segLen = totalRope / (this.segments - 1);
    for (let i = 0; i <= this.segments; i++) {
      const y = i < this.segments ? startY + i * segLen : dims.rope + dims.ch;
      this.pts.push({ x: anchorX, y, px: anchorX, py: y });
    }
    for (let i = 0; i < this.segments; i++) {
      this.restLengths.push(i < this.segments - 1 ? segLen : dims.ch);
    }
    // Initial natural swing impulse on page load
    for (let i = 1; i <= this.segments; i++) {
      this.pts[i].px -= i * 0.85 * dims.scale;
    }
  }

  /**
   * Injects momentum into the lanyard (e.g. from scroll velocity or pointer flick on release).
   */
  applyImpulse(ix: number, iy: number): void {
    const P = this.pts;
    const n = this.segments;
    for (let i = 1; i <= n; i++) {
      const weight = i / n;
      P[i].px -= ix * weight;
      P[i].py -= iy * weight;
    }
  }

  step(grab: GrabState | null): void {
    const P = this.pts;
    const n = this.segments;
    this.tick += 1;

    // Subtle ambient micro-sway so the badge feels alive even at rest
    const ambientWind = Math.sin(this.tick * 0.024) * 0.018 * this.dims.scale;
    const damping = grab ? 0.94 : 0.989;
    const gravity = 0.68 * this.dims.scale;

    for (let i = 1; i < P.length; i++) {
      const p = P[i];
      const vx = (p.x - p.px) * damping;
      const vy = (p.y - p.py) * damping;
      p.px = p.x;
      p.py = p.y;
      p.x += vx + ( grab ? 0 : ambientWind * (i / n) );
      p.y += vy + gravity;
    }

    // Elastic spring pull when user grabs and drags the card
    if (grab) {
      const topCard = P[n - 1];
      const botCard = P[n];

      // Allow realistic downward/sideways elastic stretch relative to anchor
      const maxPullDist = this.dims.rope * 1.42;
      const desiredTopX = grab.x - grab.rx * this.dims.cw * 0.65;
      const desiredTopY = grab.y - grab.ry * this.dims.ch;

      const adx = desiredTopX - this.anchorX;
      const ady = Math.max(24, desiredTopY - -6);
      const adist = Math.hypot(adx, ady) || 1;
      const clampedDist = Math.min(maxPullDist, adist);
      const targetTopX = this.anchorX + (adx / adist) * clampedDist;
      const targetTopY = -6 + (ady / adist) * clampedDist;

      topCard.x += (targetTopX - topCard.x) * 0.42;
      topCard.y += (targetTopY - topCard.y) * 0.42;

      // Torque on the bottom of the card based on where the user grabbed it
      const tiltTorque = grab.rx * 28 * this.dims.scale + (grab.x - topCard.x) * 0.25;
      const targetBotX = topCard.x + tiltTorque;
      const targetBotY = topCard.y + this.dims.ch;
      botCard.x += (targetBotX - botCard.x) * 0.34;
      botCard.y += (targetBotY - botCard.y) * 0.34;
    }

    // Distance constraints: softer while grabbed (for elastic stretch), firm when released
    const constraintIters = grab ? 5 : 14;
    const stretchFactor = grab ? 1.16 : 1.0;

    for (let iter = 0; iter < constraintIters; iter++) {
      for (let i = 0; i < n; i++) {
        const a = P[i];
        const b = P[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1e-6;
        const rest = i < n - 1 ? this.restLengths[i] * stretchFactor : this.restLengths[i];
        const diff = (dist - rest) / dist;
        const stiffness = grab && i < n - 1 ? 0.68 : 1.0;

        if (i === 0) {
          b.x -= dx * diff * stiffness;
          b.y -= dy * diff * stiffness;
        } else {
          a.x += dx * diff * 0.5 * stiffness;
          a.y += dy * diff * 0.5 * stiffness;
          b.x -= dx * diff * 0.5 * stiffness;
          b.y -= dy * diff * 0.5 * stiffness;
        }
      }
      // Keep top anchor pinned flush inside the top navbar border
      P[0].x = this.anchorX;
      P[0].y = -6;
    }

    // Pendulum rotational alignment between lower strap segment and card mass
    const prev = P[n - 2];
    const topCard = P[n - 1];
    const botCard = P[n];
    const rx = topCard.x - prev.x;
    const ry = topCard.y - prev.y;
    const rl = Math.hypot(rx, ry) || 1;
    const alignStrength = grab ? 0.03 : 0.065;
    botCard.x += (topCard.x + (rx / rl) * this.dims.ch - botCard.x) * alignStrength;
    botCard.y += (topCard.y + (ry / rl) * this.dims.ch - botCard.y) * alignStrength;
  }

  cardAngle(): number {
    const topCard = this.pts[this.segments - 1];
    const botCard = this.pts[this.segments];
    // Clamp visual rotation to [-38deg, +38deg] so card never flips upside down wildly
    const raw = Math.atan2(-(botCard.x - topCard.x), botCard.y - topCard.y);
    return Math.max(-0.66, Math.min(0.66, raw));
  }

  cardTopAttach(): { x: number; y: number } {
    const topCard = this.pts[this.segments - 1];
    return { x: topCard.x, y: topCard.y };
  }

  cardCenter(): { x: number; y: number } {
    const topCard = this.pts[this.segments - 1];
    const botCard = this.pts[this.segments];
    return {
      x: (topCard.x + botCard.x) * 0.5,
      y: (topCard.y + botCard.y) * 0.5,
    };
  }

  /**
   * Generates a 100% uniform-width ribbon polygon from top to bottom.
   */
  strapPolygonPath(uniformWidth: number): string {
    const P = this.pts;
    const n = this.segments;
    const leftPts: [number, number][] = [];
    const rightPts: [number, number][] = [];
    const halfW = uniformWidth * 0.5;

    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)];
      const b = P[Math.min(n - 1, i + 1)];
      let tx = b.x - a.x;
      let ty = b.y - a.y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      leftPts.push([P[i].x - ty * halfW, P[i].y + tx * halfW]);
      rightPts.push([P[i].x + ty * halfW, P[i].y - tx * halfW]);
    }

    const smoothCurve = (arr: [number, number][]) => {
      let d = '';
      for (let i = 1; i < arr.length - 1; i++) {
        const mx = (arr[i][0] + arr[i + 1][0]) * 0.5;
        const my = (arr[i][1] + arr[i + 1][1]) * 0.5;
        d += ` Q ${arr[i][0].toFixed(1)} ${arr[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      const last = arr[arr.length - 1];
      return d + ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
    };

    const revRight = rightPts.slice().reverse();
    return `M ${leftPts[0][0].toFixed(1)} ${leftPts[0][1].toFixed(1)}${smoothCurve(leftPts)} L ${revRight[0][0].toFixed(1)} ${revRight[0][1].toFixed(1)}${smoothCurve(revRight)} Z`;
  }

  centerlinePath(): string {
    const P = this.pts;
    const n = this.segments;
    let d = `M ${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`;
    for (let i = 1; i < n - 1; i++) {
      const a = P[i];
      const b = P[i + 1];
      d += ` Q ${a.x.toFixed(1)} ${a.y.toFixed(1)} ${((a.x + b.x) * 0.5).toFixed(1)} ${((a.y + b.y) * 0.5).toFixed(1)}`;
    }
    return d + ` L ${P[n - 1].x.toFixed(1)} ${P[n - 1].y.toFixed(1)}`;
  }
}
