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

/**
 * Always compute lanyard dimensions from viewport width (window.innerWidth),
 * NEVER from column width.
 */
export function getLanyardDims(viewportWidth: number): LanyardDims {
  if (viewportWidth >= 900) {
    return { cw: 244, ch: 396, rope: 196, strapWidth: 34, scale: 1, isMobile: false };
  }
  return { cw: 160, ch: 212, rope: 100, strapWidth: 24, scale: 0.68, isMobile: true };
}

export class VerletRope {
  pts: Point[] = [];
  restLengths: number[] = [];
  readonly segments = 7;

  constructor(public anchorX: number, public dims: LanyardDims) {
    const segLen = dims.rope / (this.segments - 1);
    for (let i = 0; i <= this.segments; i++) {
      const y = i < this.segments ? i * segLen : dims.rope + dims.ch;
      this.pts.push({ x: anchorX, y, px: anchorX, py: y });
    }
    for (let i = 0; i < this.segments; i++) {
      this.restLengths.push(i < this.segments - 1 ? segLen : dims.ch);
    }
    // Gentle one-time initial swing on mount
    for (let i = 1; i <= this.segments; i++) {
      this.pts[i].px -= i * 0.35 * dims.scale;
    }
  }

  step(grabTarget: { x: number; y: number } | null): void {
    const P = this.pts;
    const n = this.segments;
    // Higher velocity damping while grabbed prevents any oscillation/jitter when held still
    const damping = grabTarget ? 0.82 : 0.992;

    for (let i = 1; i < P.length; i++) {
      const p = P[i];
      const vx = (p.x - p.px) * damping;
      const vy = (p.y - p.py) * damping;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + 0.62 * this.dims.scale;
    }

    if (grabTarget) {
      const topCard = P[n - 1];
      const botCard = P[n];
      const cx = (topCard.x + botCard.x) * 0.5;
      const cy = (topCard.y + botCard.y) * 0.5;
      const dx = (grabTarget.x - cx) * 0.35;
      const dy = (grabTarget.y - cy) * 0.35;
      topCard.x += dx;
      topCard.y += dy;
      botCard.x += dx;
      botCard.y += dy;
    }

    for (let iter = 0; iter < 12; iter++) {
      for (let i = 0; i < n; i++) {
        const a = P[i];
        const b = P[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1e-6;
        const diff = (dist - this.restLengths[i]) / dist;
        if (i === 0) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }
      // Anchor flush at the top edge (y = 0)
      P[0].x = this.anchorX;
      P[0].y = 0;
    }

    // Smooth angular alignment between bottom of strap and card body
    const prev = P[n - 2];
    const topCard = P[n - 1];
    const botCard = P[n];
    const rx = topCard.x - prev.x;
    const ry = topCard.y - prev.y;
    const rl = Math.hypot(rx, ry) || 1;
    botCard.x += (topCard.x + (rx / rl) * this.dims.ch - botCard.x) * 0.05;
    botCard.y += (topCard.y + (ry / rl) * this.dims.ch - botCard.y) * 0.05;
  }

  cardAngle(): number {
    const topCard = this.pts[this.segments - 1];
    const botCard = this.pts[this.segments];
    return Math.atan2(-(botCard.x - topCard.x), botCard.y - topCard.y);
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
