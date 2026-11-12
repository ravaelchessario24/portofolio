import React, { useEffect, useRef, useState } from 'react';
import { VerletRope, getLanyardDims, type LanyardDims } from './lanyardPhysics';
import { triggerHapticAndSound } from '../lib/feedback';

export interface LanyardProps {
  name: string;
  badgeRole: string;
  photo: string;
  summaryRole: string;
  email: string;
  location: string;
  hint: string;
  flipBackLabel: string;
}

export default function Lanyard({
  name,
  badgeRole,
  photo,
  summaryRole,
  email,
  location,
  hint,
  flipBackLabel,
}: LanyardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapPathRef = useRef<SVGPathElement>(null);
  const strapClipPathRef = useRef<SVGPathElement>(null);
  const centerPathRef = useRef<SVGPathElement>(null);
  const ropeRef = useRef<VerletRope | null>(null);

  const grabRef = useRef<{ x: number; y: number } | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDownRef = useRef<{
    x: number;
    y: number;
    time: number;
    moved: boolean;
    pointerId: number;
    pointerType: string;
  }>({ x: 0, y: 0, time: 0, moved: false, pointerId: -1, pointerType: 'mouse' });

  const [flipped, setFlipped] = useState(false);
  const [dims, setDims] = useState<LanyardDims>(() =>
    getLanyardDims(typeof window !== 'undefined' ? window.innerWidth : 1280)
  );

  useEffect(() => {
    const box = containerRef.current;
    const card = cardRef.current;
    const strap = strapPathRef.current;
    const strapClip = strapClipPathRef.current;
    const centerLine = centerPathRef.current;
    if (!box || !card || !strap || !strapClip || !centerLine) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;
    let accumulator = 0;
    let lastTime = 0;
    let isVisible = true;
    let boxWidth = 0;
    let currentDims = getLanyardDims(window.innerWidth);

    const renderFrame = () => {
      const r = ropeRef.current;
      if (!r) return;
      const attachPt = r.pts[r.segments - 1];
      const angle = r.cardAngle();
      const cardOffsetY = r.dims.isMobile ? 16 : 22;
      card.style.transform = `translate3d(${(attachPt.x - r.dims.cw * 0.5).toFixed(2)}px, ${(attachPt.y + cardOffsetY).toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
      const polyD = r.strapPolygonPath(r.dims.strapWidth);
      strap.setAttribute('d', polyD);
      strapClip.setAttribute('d', polyD);
      centerLine.setAttribute('d', r.centerlinePath());
    };

    const initializePhysics = () => {
      boxWidth = box.clientWidth || 320;
      const nextDims = getLanyardDims(window.innerWidth);
      currentDims = nextDims;
      setDims(nextDims);
      ropeRef.current = new VerletRope(boxWidth * 0.5, nextDims);
      if (prefersReducedMotion) {
        for (let i = 0; i < 480; i++) {
          ropeRef.current.step(null);
        }
      }
      renderFrame();
    };

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!isVisible || document.hidden) {
        lastTime = now;
        return;
      }
      accumulator += Math.min(now - lastTime, 48) / 1000;
      lastTime = now;
      while (accumulator >= 1 / 60) {
        ropeRef.current?.step(grabRef.current);
        accumulator -= 1 / 60;
      }
      renderFrame();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(box);

    const handleResize = () => {
      const nextDims = getLanyardDims(window.innerWidth);
      if (box.clientWidth !== boxWidth || nextDims.cw !== currentDims.cw) {
        initializePhysics();
      }
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(box);
    window.addEventListener('resize', handleResize);

    initializePhysics();
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame((t) => {
        lastTime = t;
        loop(t);
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getLocalCoords = (e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = getLocalCoords(e);
    const center = ropeRef.current?.cardCenter() ?? p;
    pointerDownRef.current = {
      x: p.x,
      y: p.y,
      time: performance.now(),
      moved: false,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
    };
    offsetRef.current = { x: center.x - p.x, y: center.y - p.y };

    if (e.pointerType !== 'touch') {
      e.currentTarget.setPointerCapture(e.pointerId);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        grabRef.current = { x: center.x, y: center.y };
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const down = pointerDownRef.current;
    if (down.pointerId !== e.pointerId) return;
    const p = getLocalCoords(e);
    const dx = p.x - down.x;
    const dy = p.y - down.y;

    if (e.pointerType === 'touch') {
      if (!down.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        grabRef.current = null;
        pointerDownRef.current.pointerId = -1;
        return;
      }
      if (!down.moved && Math.abs(dx) > 8 && Math.abs(dx) >= Math.abs(dy)) {
        down.moved = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          grabRef.current = { x: p.x + offsetRef.current.x, y: p.y + offsetRef.current.y };
        }
      }
    }

    if (Math.hypot(dx, dy) > 6) {
      down.moved = true;
    }
    if (grabRef.current) {
      grabRef.current = { x: p.x + offsetRef.current.x, y: p.y + offsetRef.current.y };
    }
  };

  const handlePointerUp = () => {
    const wasTap =
      !pointerDownRef.current.moved && performance.now() - pointerDownRef.current.time < 420;
    grabRef.current = null;
    pointerDownRef.current.pointerId = -1;
    if (wasTap) {
      toggleFlip();
    }
  };

  const toggleFlip = () => {
    triggerHapticAndSound('flip');
    setFlipped((f) => !f);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  const totalHeight = dims.rope + dims.ch + (dims.isMobile ? 28 : 44);

  return (
    <div
      className={`lanyard-stage ${dims.isMobile ? 'is-mobile' : 'is-desktop'}`}
      ref={containerRef}
      style={{ height: totalHeight }}
    >
      <svg className="lanyard-svg" aria-hidden="true">
        <defs>
          <path id="lanyard-center-path" ref={centerPathRef} />
          <clipPath id="lanyard-strap-clip">
            <path ref={strapClipPathRef} />
          </clipPath>
          <clipPath id="lanyard-top-ceiling-clip">
            <rect x="-500" y="0" width="2000" height="2000" />
          </clipPath>
        </defs>

        <g clipPath="url(#lanyard-top-ceiling-clip)">
          {/* Uniform-width Woven Lanyard Strap anchored flush to top ceiling (y=0) */}
          <path ref={strapPathRef} className="lanyard-strap-fill" />

          {/* Repeated Large Bold RAVAEL printed along the lanyard strap */}
          <g clipPath="url(#lanyard-strap-clip)">
            <text
              className="lanyard-strap-text"
              dominantBaseline="central"
              dy={dims.isMobile ? '0.5' : '1'}
            >
              <textPath href="#lanyard-center-path" startOffset="-6%">
                {'RAVAEL\u00A0\u00A0\u00A0RAVAEL\u00A0\u00A0\u00A0RAVAEL'}
              </textPath>
            </text>
          </g>
        </g>
      </svg>

      <div
        ref={cardRef}
        className={`lanyard-card ${flipped ? 'is-flipped' : ''} ${dims.isMobile ? 'is-compact' : ''}`}
        style={{
          width: dims.cw,
          height: dims.ch,
          ['--card-scale' as string]: dims.scale,
          ['--strap-w' as string]: `${dims.strapWidth}px`,
        }}
        role="button"
        tabIndex={0}
        aria-label={`${hint} — ${name}`}
        aria-pressed={flipped}
        title={hint}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          grabRef.current = null;
          pointerDownRef.current.pointerId = -1;
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Metallic D-Ring + Swivel Clasp connecting uniform strap to card (matching reference image) */}
        <div className="lanyard-hardware" aria-hidden="true">
          <div className="lanyard-dring" />
          <div className="lanyard-swivel" />
          <div className="lanyard-clasp">
            <span className="lanyard-clasp-slot" />
          </div>
        </div>

        <div className="lanyard-card-inner">
          {/* FRONT FACE */}
          <div className="lanyard-face lanyard-front">
            <div className="lanyard-photo-wrap">
              <img
                src={photo}
                alt={name}
                className="lanyard-photo-img"
                width={dims.isMobile ? 140 : 208}
                height={dims.isMobile ? 140 : 216}
                decoding="async"
              />
              {!dims.isMobile && <span className="lanyard-status-dot" aria-hidden="true" />}
            </div>

            <div className="lanyard-front-meta">
              <strong className="lanyard-name">{name}</strong>
              {/* On Desktop show "Data Enthusiast" (without city) + barcode; on Mobile show ONLY photo and name */}
              {!dims.isMobile && (
                <>
                  <span className="lanyard-role">{badgeRole}</span>
                  <div className="lanyard-footer">
                    <span className="lanyard-barcode" aria-hidden="true" />
                    <span className="lanyard-edition">PORTOFOLIO 2026</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BACK FACE */}
          <div className="lanyard-face lanyard-back">
            <div className="lanyard-back-top">
              <span className="lanyard-back-eyebrow">ID PASS · VERIFIED</span>
              <strong className="lanyard-back-title">{summaryRole}</strong>
              <p className="lanyard-back-stack">Python · SQL · Excel · Scikit-Learn · Streamlit</p>
            </div>
            <div className="lanyard-back-contact">
              <span className="lanyard-back-email">{email}</span>
              <span className="lanyard-back-loc">{location}</span>
              <small className="lanyard-back-hint">{flipBackLabel}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
