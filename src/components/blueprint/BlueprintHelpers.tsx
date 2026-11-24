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

/* ==========================================================================
   5. ARCHITECTURAL BLUEPRINT LOADER (Exact 1:1 Geometry Match to Screenshot & Video)
   ========================================================================== */
const hatchStyle: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(-45deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 6px)',
};

const blueprintGridStyle: React.CSSProperties = {
  backgroundColor: '#2355B8',
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px),
    linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
  `,
  backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
};

function BpTag({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-1.5 py-[1px] bg-white text-[#1D47A0] font-mono text-[8.5px] sm:text-[9px] font-bold tracking-wider uppercase leading-tight select-none shadow-xs ${className}`}
    >
      {children}
    </span>
  );
}

export function BlueprintLoader() {
  // phase 0: blue grid + main column ticks
  // phase 1: banner + 112px profile bar + right INDEX draw in
  // phase 2: bio copy 01-03 + CTA buttons + 4 social pills + Pengalaman card draw in
  // phase 3: overlay becomes semi-transparent over the live portfolio (aligned 1:1)
  // phase 4: top-to-bottom wipe reveal
  // phase 5: unmounted
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setPhase(5);
      return;
    }

    const t1 = window.setTimeout(() => setPhase(1), 120);
    const t2 = window.setTimeout(() => setPhase(2), 520);
    const t3 = window.setTimeout(() => setPhase(3), 1150);
    const t4 = window.setTimeout(() => setPhase(4), 1580);
    const t5 = window.setTimeout(() => setPhase(5), 2320);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      window.clearTimeout(t5);
    };
  }, []);

  if (phase === 5) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden select-none"
      style={{
        ...blueprintGridStyle,
        backgroundColor: phase >= 3 ? 'rgba(35, 85, 184, 0.78)' : '#2355B8',
        clipPath: phase === 4 ? 'inset(100% 0 0 0)' : 'inset(0% 0 0 0)',
        transition:
          'clip-path 720ms cubic-bezier(0.65, 0, 0.35, 1), background-color 360ms ease',
      }}
    >
      {/* Top Wipe Edge Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]" />

      {/* Architectural Vertical Guidelines — Exact 1:1 coordinates with PortfolioApp */}
      <div className="absolute top-0 bottom-0 left-2.5 sm:left-4 md:left-[15%] lg:left-[18%] xl:left-[26%] w-[1px] bg-white/50" />
      <div className="absolute top-0 bottom-0 right-2.5 sm:right-4 md:right-[15%] lg:right-[18%] xl:right-[26%] w-[1px] bg-white/50" />

      {/* Left Margin Dimension Rulers (Desktop) */}
      <div className="hidden md:flex flex-col items-end justify-center pr-2 absolute left-0 md:w-[15%] lg:w-[18%] xl:w-[26%] top-0 h-[22vh] font-mono text-[9px] text-white/75">
        <span>┬ 22vh</span>
        <span className="my-1 h-10 w-[1px] bg-white/35 mr-2" />
        <span>┴ BANNER</span>
      </div>
      <div className="hidden md:flex flex-col items-end justify-center pr-2 absolute left-0 md:w-[15%] lg:w-[18%] xl:w-[26%] top-[22vh] h-[112px] font-mono text-[9px] text-white/75">
        <span>┬ 112px</span>
        <span className="my-0.5 h-6 w-[1px] bg-white/35 mr-2" />
        <span>┴ HEADER</span>
      </div>

      {/* Right Fixed INDEX Schematic — Exact 1:1 position with RightNavbar */}
      <div
        className={`hidden lg:flex flex-col gap-3.5 absolute top-[22vh] left-[calc(82%+24px)] xl:left-[calc(74%+32px)] mt-3 transition-all duration-300 ${
          phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <BpTag>INDEX</BpTag>
        {[
          { label: 'Pengalaman', active: true, w: 'w-20' },
          { label: 'Proyek', active: false, w: 'w-14' },
          { label: 'Keahlian', active: false, w: 'w-16' },
          { label: 'Pendidikan', active: false, w: 'w-20' },
          { label: 'Highlights', active: false, w: 'w-18' },
          { label: 'Film & Musik', active: false, w: 'w-22' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {item.active && <span className="w-4 h-[1.5px] bg-white" />}
            <div
              className={`h-3.5 ${item.w} border ${
                item.active ? 'border-white' : 'border-white/55'
              } flex items-center px-1`}
              style={hatchStyle}
            >
              <span className="font-mono text-[8px] text-white/90 truncate">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Center Column — Exact 1:1 coordinates with PortfolioApp */}
      <div className="mx-2.5 sm:mx-4 md:mx-[15%] lg:mx-[18%] xl:mx-[26%]">
        {/* 1. Top Banner (Exact h-[18vh] sm:h-[22vh]) */}
        <div
          className={`relative h-[18vh] sm:h-[22vh] w-full overflow-hidden transition-opacity duration-300 ${
            phase >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
          style={hatchStyle}
        >
          <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-white/80">
            <BpTag>BANNER 01</BpTag>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#2355B8]/90 border border-white/40">
              ◄─── 100% × 22vh ───►
            </span>
            <div className="px-2 py-0.5 border border-white/85 bg-[#2355B8]/80 font-mono text-[11px] sm:text-xs font-bold text-white">
              TIME · WIB
            </div>
          </div>

          <div className="absolute bottom-2 right-[18%] w-24 sm:w-32 h-[62%] border border-dashed border-white/65 flex items-end justify-center pb-1">
            <span className="px-1 bg-[#2355B8]/90 font-mono text-[8px] text-white/85">
              HERO_ART
            </span>
          </div>
        </div>

        {/* In-Flow Full-Bleed Horizontal Line 1 */}
        <div className="relative w-full h-[1px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[1px] bg-white/50" />
        </div>

        {/* 2. Profile Bar (Exact min-h-[96px] sm:h-[112px] flex items-stretch) */}
        <div
          className={`relative min-h-[96px] sm:h-[112px] flex items-stretch transition-all duration-300 ${
            phase >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Avatar Box */}
          <div className="relative w-[88px] sm:w-[112px] shrink-0 p-[3px] border-r border-white/50 flex items-center justify-center">
            <div
              className="w-full aspect-square sm:h-full rounded-[10px] border border-white/90 flex flex-col justify-between p-1.5"
              style={hatchStyle}
            >
              <BpTag>AVATAR</BpTag>
              <span className="self-end px-1 bg-white text-[#1D47A0] font-mono text-[8px] font-bold">
                106×106
              </span>
            </div>
          </div>

          {/* Right Header Controls + In-Flow Divider + Name & Location */}
          <div className="relative flex-1 flex flex-col justify-between min-w-0">
            {/* Top Row: Tagline + ID/EN + ⌘K + Theme */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-2 gap-y-1">
              <div className="order-2 sm:order-1 w-full sm:w-auto flex items-center gap-1.5 min-w-0 sm:flex-1">
                <BpTag>COPY 01</BpTag>
                <div
                  className="h-3.5 sm:h-4 flex-1 sm:w-72 max-w-full border border-white/70"
                  style={hatchStyle}
                />
              </div>
              <div className="order-1 sm:order-2 ml-auto sm:ml-0 flex items-center gap-1.5 shrink-0">
                <div
                  className="h-5 w-11 border border-white/85 flex items-center justify-center font-mono text-[8px] text-white"
                  style={hatchStyle}
                >
                  ID/EN
                </div>
                <div
                  className="h-5 w-7 border border-white/85 flex items-center justify-center font-mono text-[8px] text-white"
                  style={hatchStyle}
                >
                  ⌘K
                </div>
                <div
                  className="h-5 w-6 border border-white/85 flex items-center justify-center font-mono text-[8px] text-white"
                  style={hatchStyle}
                >
                  ☼
                </div>
              </div>
            </div>

            {/* In-Flow Horizontal Divider */}
            <div className="w-full h-[1px] bg-white/45" />

            {/* Bottom Row: Name + Location */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 min-w-0">
              <div className="flex flex-col gap-0.5 flex-1 max-w-md">
                <div className="flex items-center gap-1.5">
                  <BpTag>TITLE</BpTag>
                  <span className="px-1 bg-white text-[#1D47A0] font-mono text-[8px] font-bold">
                    385 × 28
                  </span>
                </div>
                <div className="h-5 sm:h-7 w-full border border-white/90" style={hatchStyle} />
              </div>

              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <BpTag>LOC</BpTag>
                <div className="h-4 w-28 border border-white/70" style={hatchStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* In-Flow Full-Bleed Horizontal Line 2 */}
        <div className="relative w-full h-[1px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[1px] bg-white/50" />
        </div>

        {/* 3. Intro Bio, Bullet Points, CTA Buttons & Social Pills (Exact pt-5 px-4 pb-6) */}
        <div
          className={`pt-5 px-4 pb-6 space-y-3 transition-all duration-300 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Lead Paragraph Box */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <BpTag>COPY 02 · BIO SUMMARY</BpTag>
              <span className="font-mono text-[8.5px] text-white/80">100% × 56</span>
            </div>
            <div className="w-full h-14 border border-white/80" style={hatchStyle} />
          </div>

          {/* 3 Bullet Points Boxes */}
          <div className="space-y-1.5 pl-4">
            {[
              { tag: 'BULLET 01 · MOBILE JKN 63.766 REVIEWS', h: 'h-10' },
              { tag: 'BULLET 02 · DSAREA GRADE A & COURSERA', h: 'h-8' },
              { tag: 'BULLET 03 · PAUD CMS & KKN DIGIMAPAN', h: 'h-8' },
            ].map((b) => (
              <div key={b.tag} className="relative">
                <span className="absolute -left-3 top-2 w-1.5 h-1.5 rounded-full bg-white/80" />
                <div
                  className={`w-full ${b.h} border border-white/70 flex items-center justify-between px-2`}
                  style={hatchStyle}
                >
                  <span className="font-mono text-[8px] text-white/85">{b.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Open to opportunities line */}
          <div className="w-3/4 h-4 border border-white/60" style={hatchStyle} />

          {/* CTA Buttons Row: [Lihat Studi Kasus Mobile JKN] + [Hubungi Saya] */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div
              className="h-8 w-48 rounded-[10px] border-2 border-white flex items-center justify-between px-2.5"
              style={hatchStyle}
            >
              <BpTag>CTA 01</BpTag>
              <span className="font-mono text-[8.5px] text-white">192 × 32</span>
            </div>
            <div
              className="h-8 w-28 rounded-[6px] border border-white/85 flex items-center justify-between px-2"
              style={hatchStyle}
            >
              <BpTag>CTA 02</BpTag>
              <span className="font-mono text-[8.5px] text-white">112 × 32</span>
            </div>
          </div>

          {/* Social & CV Pills Row (4 Pills: LinkedIn, Email, Tangerang ID, Unduh CV) */}
          <div className="pt-4 space-y-2">
            <div className="w-56 h-3.5 border border-white/50" style={hatchStyle} />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'LINKEDIN', w: 'w-20' },
                { label: 'EMAIL · RAVAELCHESSARIO', w: 'w-44' },
                { label: 'TANGERANG, ID', w: 'w-28' },
                { label: 'CV PDF', w: 'w-28' },
              ].map((p) => (
                <div
                  key={p.label}
                  className={`h-7 ${p.w} rounded-md border border-white/80 flex items-center justify-center px-2`}
                  style={hatchStyle}
                >
                  <span className="font-mono text-[8px] text-white truncate">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-[1px] my-4 bg-white/45" />

        {/* 4. Pengalaman Section Schematic */}
        <div
          className={`px-4 py-2 space-y-3 transition-all duration-300 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BpTag>SECTION 01</BpTag>
              <div className="h-6 w-36 border border-white/85" style={hatchStyle} />
            </div>
            <div className="h-3.5 w-80 max-w-full border border-white/55" style={hatchStyle} />
          </div>

          {/* Experience Card 1 Wireframe */}
          <div
            className="p-3.5 rounded-lg border border-dashed border-white/80 space-y-3"
            style={hatchStyle}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-md border border-white/90 flex items-center justify-center font-mono text-[8px] text-white">
                  LOGO
                </div>
                <div className="space-y-1">
                  <div className="w-40 h-4 border border-white/85" />
                  <div className="w-28 h-3 border border-white/60" />
                </div>
              </div>
              <div className="hidden sm:block w-28 h-7 border border-white/65" />
            </div>
            <div className="w-full h-14 border border-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
