import React, { useEffect, useRef, useState } from 'react';
import { triggerHapticAndSound } from '../../lib/feedback';

export const dashedX = {
  backgroundImage:
    'repeating-linear-gradient(to right, rgba(120,120,120,0.42) 0 1px, transparent 1px 6px)',
} as const;

export const dashedY = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, rgba(120,120,120,0.42) 0 1px, transparent 1px 6px)',
} as const;

/* ==========================================================================
   1. BANNER PARTICLES (Exact port from portfolio-main/src/components/BannerParticles.tsx)
   ========================================================================== */
const particleSettings = {
  minWind: 1.2,
  maxWind: 4.8,
  minSize: 6,
  maxSize: 18,
  emitterY: 0.2,
  emitterSpread: 0.9,
  gravity: 0.3,
  turbulence: 0.5,
  rotationSpeed: 0,
  tumbleStrength: 0.3,
  staticTilt: 0,
  particleCount: 56,
  direction: 1,
};

function createLeafImage(): HTMLImageElement | null {
  if (typeof document === 'undefined') return null;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 128;
  tempCanvas.height = 128;
  const tCtx = tempCanvas.getContext('2d');
  if (!tCtx) return null;

  tCtx.scale(2, 2);
  tCtx.beginPath();
  tCtx.moveTo(32, 5);
  tCtx.quadraticCurveTo(5, 32, 32, 59);
  tCtx.quadraticCurveTo(59, 32, 32, 5);
  tCtx.fillStyle = '#bfdbfe';
  tCtx.fill();
  tCtx.strokeStyle = '#60a5fa';
  tCtx.lineWidth = 1;
  tCtx.stroke();
  tCtx.beginPath();
  tCtx.moveTo(32, 5);
  tCtx.lineTo(32, 59);
  tCtx.stroke();

  const img = new Image();
  img.src = tempCanvas.toDataURL();
  return img;
}

function rotateVector(x: number, y: number, z: number, ax: number, ay: number, az: number) {
  let cos = Math.cos(az);
  let sin = Math.sin(az);
  const x1 = x * cos - y * sin;
  const y1 = x * sin + y * cos;
  const z1 = z;

  cos = Math.cos(ay);
  sin = Math.sin(ay);
  const x2 = x1 * cos + z1 * sin;
  const y2 = y1;
  const z2 = -x1 * sin + z1 * cos;

  cos = Math.cos(ax);
  sin = Math.sin(ax);
  return {
    x: x2,
    y: y2 * cos - z2 * sin,
    z: y2 * sin + z2 * cos,
  };
}

export function BannerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let isUnmounted = false;
    let lastFrameTime = 0;

    const minSize = particleSettings.minSize;
    const maxSize = particleSettings.maxSize;
    const minWind = particleSettings.minWind;
    const maxWind = particleSettings.maxWind;
    const tiltRad = 0;

    const particleImage = createLeafImage();
    if (!particleImage) return;

    class Particle {
      x = 0;
      y = 0;
      width = 0;
      height = 0;
      windFactor = 0;
      vx = 0;
      vy = 0;
      waveOffset = 0;
      angleZ = 0;
      spinZ = 0;
      angleX = 0;
      angleY = 0;
      spinX = 0;
      spinY = 0;

      constructor(initOnScreen = false) {
        this.reset(initOnScreen);
      }

      reset(initOnScreen = false) {
        this.width = minSize + Math.random() * (maxSize - minSize);
        this.height = this.width;
        const centerY = height * particleSettings.emitterY;
        const spreadHeight = height * particleSettings.emitterSpread;
        const minY = centerY - spreadHeight / 2;
        const maxY = centerY + spreadHeight / 2;
        this.y = minY + Math.random() * (maxY - minY);

        if (initOnScreen) {
          this.x = Math.random() * width;
        } else {
          const entryDistance = Math.min(width * 0.12, 80);
          this.x = -this.width - Math.random() * entryDistance;
        }

        const sizeFactor = (this.width - minSize) / (maxSize - minSize || 1);
        this.windFactor = Math.max(0.1, Math.min(1, 1 - (sizeFactor * 0.5 + Math.random() * 0.5)));
        this.vx = 0;
        this.vy = 0;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.angleZ = Math.random() * Math.PI * 2;
        this.spinZ = 0;
        this.angleX = 0;
        this.angleY = 0;
        this.spinX = (Math.random() - 0.5) * 0.1;
        this.spinY = (Math.random() - 0.5) * 0.1;
      }

      update() {
        const targetSpeed = minWind + (maxWind - minWind) * this.windFactor;
        this.vx += (targetSpeed - this.vx) * 0.1;
        this.x += this.vx;

        const gravityMod = 1.5 - this.windFactor;
        this.vy += particleSettings.gravity * 0.05 * gravityMod;
        const wave = Math.sin(this.x * 0.01 + this.waveOffset);
        this.vy += wave * particleSettings.turbulence * 0.05;
        this.vy *= 0.98;
        this.y += this.vy;
        this.angleZ += this.spinZ + this.vx * 0.002;
        this.angleX += this.spinX * particleSettings.tumbleStrength;
        this.angleY += this.spinY * particleSettings.tumbleStrength;

        const buffer = 200;
        if (this.x > width + buffer || this.y > height + buffer || this.y < -buffer) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx || !particleImage) return;
        const vecU = rotateVector(1, 0, 0, this.angleX, this.angleY + tiltRad, this.angleZ);
        const vecV = rotateVector(0, 1, 0, this.angleX, this.angleY + tiltRad, this.angleZ);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.transform(vecU.x, vecU.y, vecV.x, vecV.y, 0, 0);
        ctx.globalAlpha = 0.6;
        ctx.drawImage(particleImage, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = canvas.width = parent.clientWidth;
        height = canvas.height = parent.clientHeight;
      }
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(56, Math.max(32, Math.round((width * height) / 2500)));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(true));
      }
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
    };

    resize();
    initParticles();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      drawFrame();
      return;
    }

    const animate = (timestamp: number) => {
      if (isUnmounted) return;
      animationFrameId = requestAnimationFrame(animate);
      if (timestamp - lastFrameTime < 1000 / 30) return;
      lastFrameTime = timestamp;
      drawFrame();
    };
    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
    />
  );
}

/* ==========================================================================
   2. CURRENT TIME (Live WIB / Tangerang Clock with Dot Matrix Separator)
   ========================================================================== */
function TwoDots() {
  return (
    <div className="mx-0.5 sm:mx-1 flex flex-col gap-2 -translate-x-[2px] sm:-translate-x-[3px]">
      <div className="w-[2px] h-[2px] bg-zinc-400 dark:bg-zinc-500" />
      <div className="w-[2px] h-[2px] bg-zinc-400 dark:bg-zinc-500" />
    </div>
  );
}

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="absolute top-2.5 right-3 sm:top-3 sm:right-4 z-[5] pointer-events-none select-none flex items-center opacity-0">
        <div
          className="text-[20px] sm:text-[24px] tracking-[0.15em] text-zinc-200 dark:text-zinc-300"
          style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
        >
          00.00.00
        </div>
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="absolute top-2.5 right-3 sm:top-3 sm:right-4 z-[5] pointer-events-none select-none flex items-center h-[24px]">
      <div
        className="text-[20px] sm:text-[24px] tracking-[0.15em] flex items-center text-white/85 dark:text-zinc-300 drop-shadow-sm h-full"
        style={{ fontFamily: 'var(--font-doto), monospace', fontWeight: 700 }}
      >
        <span>{hours}</span>
        <TwoDots />
        <span>{minutes}</span>
        <TwoDots />
        <span>{seconds}</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. FOOTER BACKGROUND (Interactive Dot-Matrix Hover Spotlight)
   ========================================================================== */
export function FooterBackground({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !spotlightRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!spotlightRef.current) return;
        const mask = `radial-gradient(250px circle at ${x}px ${y}px, black, transparent)`;
        spotlightRef.current.style.maskImage = mask;
        spotlightRef.current.style.webkitMaskImage = mask;
      });
    };

    const handleMouseEnter = () => {
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0.28';
    };
    const handleMouseLeave = () => {
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full text-zinc-400 dark:text-zinc-500 opacity-20 dark:opacity-[0.12] pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />
      <div
        ref={spotlightRef}
        className="absolute inset-0 w-full h-full text-zinc-600 dark:text-zinc-300 opacity-0 pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(250px circle at -1000px -1000px, black, transparent)',
          WebkitMaskImage: 'radial-gradient(250px circle at -1000px -1000px, black, transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ==========================================================================
   4. SOFT PILL BUTTON & 3D FLIP COVER BUTTON
   ========================================================================== */
export function SoftPillButton({
  className = '',
  children,
  variant = 'secondary',
  as: Comp = 'button',
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  const isPrimary = variant === 'primary';
  return (
    <Comp
      className={`group relative inline-block rounded-[6px] text-center px-3.5 py-1.5 text-[12px] font-medium tracking-tight transition-[transform] duration-200 active:scale-[0.99] cursor-pointer [backdrop-filter:blur(6px)] ${
        isPrimary
          ? 'text-neutral-50 dark:text-neutral-950'
          : 'text-neutral-900 dark:text-neutral-200'
      } ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-[6px] overflow-hidden transition-colors duration-200 ${
          isPrimary
            ? 'bg-[#18181b] group-hover:bg-[#27272a] dark:bg-white dark:group-hover:bg-neutral-100 border border-black/10 dark:border-white/10'
            : 'bg-white/90 dark:bg-[#18181b] group-hover:bg-neutral-100 group-hover:dark:bg-[#222226] border border-black/15 dark:border-white/15 group-hover:border-black/25 dark:group-hover:border-white/25'
        }`}
      />
      <span className="relative">{children}</span>
    </Comp>
  );
}

export function FlipCoverButton({
  href,
  label,
  coverLabel,
  subLabel,
  onClick,
}: {
  href?: string;
  label: string;
  coverLabel?: string;
  subLabel?: string;
  onClick?: () => void;
}) {
  const innerText = coverLabel || subLabel || label;
  const handleAction = () => {
    triggerHapticAndSound('tap');
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="bp-flip-wrapper inline-block"
      onMouseEnter={() => triggerHapticAndSound('hover')}
    >
      <button type="button" onClick={handleAction} className="bp-flip-button">
        <span className="bp-flip-inner">
          <span className="bp-flip-text">{innerText}</span>
        </span>
        <span className="bp-flip-cover" aria-hidden="true">
          <span className="bp-flip-text">{label}</span>
        </span>
      </button>
    </div>
  );
}
