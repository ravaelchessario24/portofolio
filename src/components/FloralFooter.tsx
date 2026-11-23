import React, { useEffect, useRef, useState } from 'react';
import { triggerHapticAndSound } from '../lib/feedback';

export function RavaelSignature() {
  const [drawKey, setDrawKey] = useState(0);

  return (
    <span
      className="b-signature-wrap"
      onMouseEnter={() => {
        setDrawKey((k) => k + 1);
        triggerHapticAndSound('hover');
      }}
      aria-hidden="true"
    >
      <svg
        key={drawKey}
        className="b-signature-svg"
        width="108"
        height="36"
        viewBox="0 0 156 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="b-signature-path"
          pathLength={1}
          d="M14 39C15 27 18 11 22 9C27 7 32 11 31 17C30 22 22 25 18 26C23 26 29 31 35 37C39 40 43 37 47 31C50 26 48 22 44 23C40 24 38 30 40 35C42 39 47 38 51 32C53 28 56 24 58 31C60 36 63 38 66 32C69 27 71 23 73 23C76 28 81 36 86 31C89 28 88 23 84 23C80 24 78 30 81 35C84 39 90 38 95 33C99 29 103 24 100 22C96 20 93 26 95 32C98 38 106 38 113 31C119 24 125 13 123 9C121 6 116 13 116 23C116 33 122 39 132 36C137 34 142 31 146 29"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function SayHelloSignature({ label = 'say hello !' }: { label?: string }) {
  return (
    <span className="b-sayhello-wrap" aria-label={label}>
      <svg
        className="b-sayhello-svg"
        width="124"
        height="38"
        viewBox="0 0 176 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 26C13 24 9 25 10 29C11 32 17 33 17 37C17 40 12 41 9 39M28 28C24 27 21 31 22 36C23 39 27 38 29 33C30 30 30 36 33 38C36 39 39 34 40 29C41 34 44 37 47 32C49 28 50 35 48 44C46 50 40 50 38 46"
          stroke="currentColor"
          strokeWidth="1.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M68 13C67 22 65 33 65 38C66 33 70 29 73 30C76 31 75 37 78 38C82 39 87 34 88 30C88 27 84 27 83 32C82 37 87 40 93 36C98 31 103 19 102 13C100 18 98 29 100 36C102 40 107 38 111 31C115 24 118 15 116 12C114 18 112 29 115 36C117 40 122 38 126 32C128 29 133 28 135 32C136 36 132 40 128 38C125 36 125 31 129 29C133 28 138 30 141 29"
          stroke="currentColor"
          strokeWidth="1.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M155 16C154 22 153 28 152 33M151 40.5C151 41 151.5 41.5 152 41.5"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

interface GrassBlade {
  xRatio: number;
  h: number;
  baseWidth: number;
  baseLean: number;
  bend: number;
  vel: number;
  stiffness: number;
  damping: number;
  phase: number;
  speed: number;
  layer: 0 | 1 | 2;
  colorLight: string;
  strokeLight: string;
  colorDark: string;
  strokeDark: string;
}

const LIGHT_PALETTE = {
  0: [
    { fill: '#C7DEC0', stroke: '#84A98C' },
    { fill: '#B7D3AE', stroke: '#749B7E' },
  ],
  1: [
    { fill: '#84CC16', stroke: '#4D7C0F' },
    { fill: '#74B816', stroke: '#3F6212' },
    { fill: '#A3E635', stroke: '#4D7C0F' },
  ],
  2: [
    { fill: '#65A30D', stroke: '#365314' },
    { fill: '#4D7C0F', stroke: '#1A2E05' },
    { fill: '#84CC16', stroke: '#3F6212' },
  ],
} as const;

const DARK_PALETTE = {
  0: [
    { fill: 'rgba(244, 244, 246, 0.08)', stroke: 'rgba(244, 244, 246, 0.28)' },
    { fill: 'rgba(244, 244, 246, 0.11)', stroke: 'rgba(244, 244, 246, 0.34)' },
  ],
  1: [
    { fill: 'rgba(244, 244, 246, 0.16)', stroke: 'rgba(244, 244, 246, 0.56)' },
    { fill: 'rgba(244, 244, 246, 0.2)', stroke: 'rgba(244, 244, 246, 0.62)' },
  ],
  2: [
    { fill: 'rgba(244, 244, 246, 0.26)', stroke: 'rgba(244, 244, 246, 0.85)' },
    { fill: 'rgba(244, 244, 246, 0.32)', stroke: 'rgba(244, 244, 246, 0.92)' },
  ],
} as const;

function createBlades(count: number): GrassBlade[] {
  const blades: GrassBlade[] = [];
  // Deterministic pseudo-random generator so initial layout is balanced across the whole width
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    const layer: 0 | 1 | 2 = i < count * 0.35 ? 0 : i < count * 0.72 ? 1 : 2;
    const xRatio = (i % (count / 3)) / (count / 3) + (rand() - 0.5) * 0.012;
    const hBase = layer === 0 ? 58 : layer === 1 ? 76 : 92;
    const h = hBase + rand() * 44;
    const baseWidth = (layer === 0 ? 2.6 : layer === 1 ? 3.2 : 3.8) + rand() * 1.4;
    const baseLean = (rand() - 0.5) * 26;
    const lp = LIGHT_PALETTE[layer][Math.floor(rand() * LIGHT_PALETTE[layer].length)];
    const dp = DARK_PALETTE[layer][Math.floor(rand() * DARK_PALETTE[layer].length)];

    blades.push({
      xRatio: Math.max(0.002, Math.min(0.998, xRatio)),
      h,
      baseWidth,
      baseLean,
      bend: 0,
      vel: 0,
      stiffness: 0.075 + rand() * 0.045,
      damping: 0.84 + rand() * 0.05,
      phase: rand() * Math.PI * 2,
      speed: 1.1 + rand() * 0.9,
      layer,
      colorLight: lp.fill,
      strokeLight: lp.stroke,
      colorDark: dp.fill,
      strokeDark: dp.stroke,
    });
  }
  return blades;
}

export function FloralMeadowFooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bladesRef = useRef<GrassBlade[]>(createBlades(320));
  const pointerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    active: boolean;
    lastX: number;
  }>({
    x: -9999,
    y: -9999,
    vx: 0,
    active: false,
    lastX: -9999,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 165;
    let dpr = 1;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 165;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;

    const render = (timeMs: number) => {
      const t = timeMs * 0.001;
      const isDark = document.documentElement.dataset.theme === 'dark';

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const ptr = pointerRef.current;
      const interactionRadius = Math.max(95, Math.min(145, width * 0.1));
      const blades = bladesRef.current;

      for (let i = 0; i < blades.length; i++) {
        const b = blades[i];
        const bx = b.xRatio * width;
        const by = height;

        // Ambient gentle breeze
        const wind = reduceMotion ? 0 : Math.sin(t * b.speed + b.phase) * 4.5;

        // Pointer / finger interaction physics
        if (ptr.active) {
          const dx = bx - ptr.x;
          const dy = by - b.h * 0.55 - ptr.y;
          const dist = Math.hypot(dx, dy * 0.65);

          if (dist < interactionRadius) {
            const influence = Math.pow(1 - dist / interactionRadius, 1.45);
            // Push away from pointer + carry pointer horizontal momentum
            const dir = dx >= 0 ? 1 : -1;
            const targetPush = dir * influence * 48 + ptr.vx * influence * 1.4;
            b.vel += (targetPush - b.bend) * 0.24;
          }
        }

        // Hooke's law spring back to natural resting lean
        const springForce = -b.stiffness * b.bend;
        b.vel = (b.vel + springForce) * b.damping;
        b.bend += b.vel;
        if (Math.abs(b.bend) > 78) {
          b.bend = Math.sign(b.bend) * 78;
        }

        const totalTipOffset = b.baseLean + wind + b.bend;
        // Slightly lower tip Y when bent far sideways (length conservation)
        const verticalDrop = Math.min(b.h * 0.28, (totalTipOffset * totalTipOffset) / (b.h * 2.4));
        const tipX = bx + totalTipOffset;
        const tipY = by - b.h + verticalDrop;

        const ctrlX = bx + totalTipOffset * 0.42;
        const ctrlY = by - b.h * 0.52;
        const hw = b.baseWidth * 0.5;

        ctx.beginPath();
        ctx.moveTo(bx - hw, by);
        ctx.quadraticCurveTo(ctrlX - hw * 0.35, ctrlY, tipX, tipY);
        ctx.quadraticCurveTo(ctrlX + hw * 0.35, ctrlY, bx + hw, by);
        ctx.closePath();

        ctx.fillStyle = isDark ? b.colorDark : b.colorLight;
        ctx.fill();

        ctx.strokeStyle = isDark ? b.strokeDark : b.strokeLight;
        ctx.lineWidth = b.layer === 2 ? 1.15 : 0.9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Decay pointer velocity smoothly
      ptr.vx *= 0.85;

      ctx.restore();
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const handlePointerInput = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;

    const ptr = pointerRef.current;
    const vx = ptr.lastX > -9000 ? Math.max(-28, Math.min(28, localX - ptr.lastX)) : 0;

    ptr.x = localX;
    ptr.y = localY;
    ptr.vx = vx;
    ptr.lastX = localX;
    ptr.active = true;

    if (Math.abs(vx) > 3.2) {
      triggerHapticAndSound('grass');
    }
  };

  const clearPointer = () => {
    pointerRef.current.active = false;
    pointerRef.current.lastX = -9999;
  };

  return (
    <div
      className="b-floral-footer b-grass-footer"
      onPointerDown={(e) => handlePointerInput(e.clientX, e.clientY)}
      onPointerMove={(e) => handlePointerInput(e.clientX, e.clientY)}
      onPointerLeave={clearPointer}
      onPointerCancel={clearPointer}
      onTouchStart={(e) => {
        if (e.touches[0]) handlePointerInput(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handlePointerInput(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={clearPointer}
    >
      <canvas ref={canvasRef} className="b-grass-canvas" aria-hidden="true" />
    </div>
  );
}
