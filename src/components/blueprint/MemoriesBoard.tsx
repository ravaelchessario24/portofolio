import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type Lenis from 'lenis';
import { Music, Pencil, X } from 'lucide-react';
import {
  type Lang,
  type MemoryItem,
  memoriesList,
  memoryEdges,
  memoriesI18n,
  pick,
} from './blueprintData';
import { MemoriesAudioEngine } from './memoriesAudio';

interface MemoriesBoardProps {
  open: boolean;
  onRequestClose: () => void;
  lang: Lang;
  isDark: boolean;
  withBase: (p: string) => string;
  folderBtnRef: React.RefObject<HTMLButtonElement | null>;
  lenisRef: React.RefObject<Lenis | null>;
  audioEngineRef: React.RefObject<MemoriesAudioEngine | null>;
}

interface CardPhysics {
  m: MemoryItem;
  el: HTMLDivElement | null;
  ghost: HTMLDivElement | null;
  cap: HTMLDivElement | null;
  ovTitle: HTMLSpanElement | null;
  eqBars: (HTMLElement | null)[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  vw: number;
  vh: number;
  rot: number;
  vr: number;
  s: number;
  vs: number;
  tx: number;
  ty: number;
  tw: number;
  th: number;
  trot: number;
  ts: number;
  inSlot: boolean;
  dragging: boolean;
  hidden: boolean;
}

interface RopePoint {
  x: number;
  y: number;
  px: number;
  py: number;
}

interface RopeState {
  a: string;
  b: string;
  pts: RopePoint[];
  slack: number;
  off: number;
  pluck: number;
  phase: number;
}

const ROPE_SEGMENTS = 18;
const CAPTION_STORAGE_KEY = 'ravael_memories_captions_v1';

function stepSpring(
  val: number,
  vel: number,
  target: number,
  k: number,
  c: number,
  dt: number,
): [number, number] {
  const f = -k * (val - target) - c * vel;
  const nv = vel + f * dt;
  const nx = val + nv * dt;
  return [nx, nv];
}

function loadCustomCaptions(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CAPTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string' && v.trim()) out[k] = v.trim();
      }
      return out;
    }
  } catch {}
  return {};
}

function saveCustomCaptions(map: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAPTION_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function MemoriesBoard({
  open,
  onRequestClose,
  lang,
  isDark,
  withBase,
  folderBtnRef,
  lenisRef,
  audioEngineRef,
}: MemoriesBoardProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleClass, setVisibleClass] = useState(false);
  const [customCaps, setCustomCaps] = useState<Record<string, string>>({});
  const [nowPlayingSong, setNowPlayingSong] = useState<{ title: string; artist: string } | null>(
    null,
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const slotPromptRef = useRef<HTMLDivElement>(null);

  const cardsRef = useRef<Record<string, CardPhysics>>({});
  const ropePathsRef = useRef<(SVGPathElement | null)[]>([]);
  const ropesRef = useRef<RopeState[]>([]);

  const slotCardIdRef = useRef<string | null>(null);
  const dimsRef = useRef({ w: 1440, h: 900, s: 1, slot: 180 });
  const stringRgbRef = useRef(isDark ? '244, 114, 162' : '232, 106, 146');
  const reducedMotionRef = useRef(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isClosingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  // Precompute strand metadata for multi-strand duplicate edges
  const edgeMeta = useMemo(() => {
    const counts: Record<string, number> = {};
    const totals: Record<string, number> = {};
    for (const [a, b] of memoryEdges) {
      const k = [a, b].sort().join('|');
      totals[k] = (totals[k] || 0) + 1;
    }
    return memoryEdges.map(([a, b], idx) => {
      const k = [a, b].sort().join('|');
      counts[k] = (counts[k] || 0) + 1;
      const strand = counts[k] - 1;
      const multi = totals[k] > 1 ? 1 : 0;
      return {
        a,
        b,
        slack: 1.025 + strand * 0.045 + (idx % 3) * 0.012,
        off: (strand - 0.5) * 7 * multi,
        phase: ((idx * 1.73) % 6) + 0.3,
      };
    });
  }, []);

  // Initialize card physics map once
  if (Object.keys(cardsRef.current).length === 0) {
    for (const m of memoriesList) {
      cardsRef.current[m.id] = {
        m,
        el: null,
        ghost: null,
        cap: null,
        ovTitle: null,
        eqBars: [null, null, null, null],
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        w: 40,
        h: 50,
        vw: 0,
        vh: 0,
        rot: m.layout.rot,
        vr: 0,
        s: 1,
        vs: 0,
        tx: 0,
        ty: 0,
        tw: 40,
        th: 50,
        trot: m.layout.rot,
        ts: 1,
        inSlot: false,
        dragging: false,
        hidden: false,
      };
    }
  }

  useEffect(() => {
    setMounted(true);
    setCustomCaps(loadCustomCaptions());
  }, []);

  useEffect(() => {
    stringRgbRef.current = isDark ? '244, 114, 162' : '232, 106, 146';
  }, [isDark]);

  const getCaptionFor = useCallback(
    (m: MemoryItem): string => {
      const key = `${m.id}:${lang}`;
      return customCaps[key] || pick(m.caption, lang);
    },
    [customCaps, lang],
  );

  // Sync captions into DOM refs when language or customCaps change
  useEffect(() => {
    for (const m of memoriesList) {
      const st = cardsRef.current[m.id];
      if (!st) continue;
      const text = getCaptionFor(m);
      if (st.cap && !st.cap.isContentEditable) st.cap.textContent = text;
      if (st.ovTitle) st.ovTitle.textContent = text;
    }
  }, [getCaptionFor]);

  const clearScheduledTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const slotCenter = useCallback(() => {
    const { w, h } = dimsRef.current;
    return { x: w / 2, y: h * 0.47 };
  }, []);

  const computeHome = useCallback((st: CardPhysics) => {
    const { w: W, h: H, s: S } = dimsRef.current;
    const lay = st.m.layout;

    if (W < 640) {
      const mobileRing: Record<string, { fx: number; fy: number; w: number }> = {
        'sidang-skom': { fx: 0.16, fy: 0.18, w: 68 },
        wisuda: { fx: 0.5, fy: 0.15, w: 88 },
        gallery: { fx: 0.83, fy: 0.18, w: 72 },
        'court-day': { fx: 0.14, fy: 0.37, w: 70 },
        'kkn-desa': { fx: 0.85, fy: 0.36, w: 74 },
        commute: { fx: 0.14, fy: 0.6, w: 70 },
        keluarga: { fx: 0.84, fy: 0.59, w: 88 },
        'langit-siang': { fx: 0.16, fy: 0.8, w: 62 },
        'kawan-kampus': { fx: 0.48, fy: 0.81, w: 78 },
        'satu-angkatan': { fx: 0.82, fy: 0.8, w: 86 },
      };
      const mr = mobileRing[st.m.id];
      const mScale = Math.max(0.88, Math.min(1.15, W / 390));
      const cw = (mr ? mr.w : lay.w * 0.45) * mScale;
      const ch = cw * lay.hw;
      const rx = (mr ? mr.fx : lay.fx) * W;
      const ry = (mr ? mr.fy : lay.fy) * H;
      return {
        x: Math.max(cw / 2 + 8, Math.min(W - cw / 2 - 8, rx)),
        y: Math.max(ch / 2 + 68, Math.min(H - ch / 2 - 54, ry)),
        w: cw,
        h: ch,
        rot: lay.rot,
      };
    }

    const cw = lay.w * S;
    const ch = cw * lay.hw;
    const x = Math.max(cw / 2 + 14, Math.min(W - cw / 2 - 14, lay.fx * W));
    const y = Math.max(ch / 2 + 56, Math.min(H - ch / 2 - 30, lay.fy * H));

    return { x, y, w: cw, h: ch, rot: lay.rot };
  }, []);

  const setHomeTargets = useCallback(
    (st: CardPhysics) => {
      const h = computeHome(st);
      if (!st.inSlot && !st.dragging) {
        st.tx = h.x;
        st.ty = h.y;
        st.tw = h.w;
        st.th = h.h;
        st.trot = h.rot;
        st.ts = 1;
      }
      if (st.ghost) {
        st.ghost.style.width = `${h.w}px`;
        st.ghost.style.height = `${h.h}px`;
        st.ghost.style.transform = `translate(${h.x - h.w / 2}px, ${h.y - h.h / 2}px) rotate(${h.rot}deg)`;
      }
    },
    [computeHome],
  );

  const setSlotTargets = useCallback(
    (st: CardPhysics) => {
      const c = slotCenter();
      const { slot: SLOT } = dimsRef.current;
      st.tx = c.x;
      st.ty = c.y;
      st.tw = SLOT;
      st.th = SLOT;
      st.trot = 0;
      st.ts = 1;
    },
    [slotCenter],
  );

  const updateLayout = useCallback(() => {
    if (typeof window === 'undefined') return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const S = Math.max(0.55, Math.min(W / 1440, H / 860, 1.35));
    const SLOT = Math.round(Math.max(140, Math.min(210, 190 * S)));
    dimsRef.current = { w: W, h: H, s: S, slot: SLOT };

    if (slotRef.current) {
      slotRef.current.style.width = `${SLOT}px`;
      slotRef.current.style.height = `${SLOT}px`;
      slotRef.current.style.left = `${W / 2}px`;
      slotRef.current.style.top = `${H * 0.47}px`;
      slotRef.current.style.transform = 'translate(-50%, -50%)';
    }

    for (const m of memoriesList) {
      const st = cardsRef.current[m.id];
      if (!st) continue;
      setHomeTargets(st);
      if (st.inSlot) setSlotTargets(st);
    }
  }, [setHomeTargets, setSlotTargets]);

  const nodePos = useCallback(
    (id: string): { x: number; y: number } => {
      if (id === 'slot') return slotCenter();
      const st = cardsRef.current[id];
      return st ? { x: st.x, y: st.y } : slotCenter();
    },
    [slotCenter],
  );

  const buildRopes = useCallback(() => {
    ropesRef.current = edgeMeta.map((meta) => {
      const A = nodePos(meta.a);
      const B = nodePos(meta.b);
      const pts: RopePoint[] = [];
      for (let j = 0; j <= ROPE_SEGMENTS; j++) {
        const t = j / ROPE_SEGMENTS;
        const x = A.x + (B.x - A.x) * t;
        const y = A.y + (B.y - A.y) * t;
        pts.push({ x, y, px: x, py: y });
      }
      return {
        a: meta.a,
        b: meta.b,
        pts,
        slack: meta.slack,
        off: meta.off,
        pluck: 0,
        phase: meta.phase,
      };
    });
  }, [edgeMeta, nodePos]);

  const putInSlot = useCallback(
    (st: CardPhysics) => {
      const prevId = slotCardIdRef.current;
      if (prevId && prevId !== st.m.id) {
        const prev = cardsRef.current[prevId];
        if (prev) {
          prev.inSlot = false;
          prev.el?.classList.remove('in-slot');
          setHomeTargets(prev);
        }
      }

      slotCardIdRef.current = st.m.id;
      st.inSlot = true;
      st.el?.classList.add('in-slot');
      st.ghost?.classList.remove('on');
      setSlotTargets(st);

      if (slotPromptRef.current) {
        slotPromptRef.current.style.opacity = '0';
      }

      audioEngineRef.current?.play(st.m);
      setNowPlayingSong(st.m.song);

      for (const r of ropesRef.current) {
        if (
          r.a === 'slot' ||
          r.b === 'slot' ||
          r.a === st.m.id ||
          r.b === st.m.id
        ) {
          r.pluck = 1;
        }
      }
    },
    [audioEngineRef, setHomeTargets, setSlotTargets],
  );

  const ejectSlot = useCallback(
    (quickAudio = false) => {
      const curId = slotCardIdRef.current;
      if (!curId) return;
      const st = cardsRef.current[curId];
      slotCardIdRef.current = null;
      if (st) {
        st.inSlot = false;
        st.el?.classList.remove('in-slot');
        setHomeTargets(st);
      }
      if (slotPromptRef.current) {
        slotPromptRef.current.style.opacity = '1';
      }
      audioEngineRef.current?.stop(quickAudio);
      setNowPlayingSong(null);
    },
    [audioEngineRef, setHomeTargets],
  );

  const stepRopes = useCallback(
    (level: number, timeSec: number) => {
      const rgb = stringRgbRef.current;
      const activeId = slotCardIdRef.current;
      const allowVibe = !reducedMotionRef.current;

      ropesRef.current.forEach((r, idx) => {
        const pathEl = ropePathsRef.current[idx];
        if (!pathEl) return;

        const sa = r.a === 'slot' ? null : cardsRef.current[r.a];
        const sb = r.b === 'slot' ? null : cardsRef.current[r.b];
        const isHidden = Boolean((sa && sa.hidden) || (sb && sb.hidden));
        pathEl.style.opacity = isHidden ? '0' : '1';
        if (isHidden) return;

        const A = nodePos(r.a);
        const B = nodePos(r.b);
        A.y += r.off;
        B.y += r.off;

        const pts = r.pts;
        const dist = Math.hypot(B.x - A.x, B.y - A.y);
        const rest = (dist * r.slack) / ROPE_SEGMENTS;
        const isLive = Boolean(
          activeId &&
            (r.a === 'slot' || r.b === 'slot' || r.a === activeId || r.b === activeId),
        );

        const dx = (B.x - A.x) / (dist || 1);
        const dy = (B.y - A.y) / (dist || 1);
        const amp = (allowVibe && isLive ? level * 1.6 : 0) + (allowVibe ? r.pluck * 2.2 : 0);
        r.pluck *= 0.94;

        for (let j = 1; j < ROPE_SEGMENTS; j++) {
          const q = pts[j];
          const vx = (q.x - q.px) * 0.965;
          const vy = (q.y - q.py) * 0.965;
          q.px = q.x;
          q.py = q.y;
          q.x += vx;
          q.y += vy + 0.22;
          if (amp > 0.01) {
            const w =
              Math.sin((Math.PI * j) / ROPE_SEGMENTS) *
              Math.sin(timeSec * 9 + r.phase + j * 0.5) *
              amp;
            q.x += -dy * w;
            q.y += dx * w;
          }
        }

        pts[0].x = A.x;
        pts[0].y = A.y;
        pts[ROPE_SEGMENTS].x = B.x;
        pts[ROPE_SEGMENTS].y = B.y;

        for (let it = 0; it < 7; it++) {
          for (let j = 0; j < ROPE_SEGMENTS; j++) {
            const pa = pts[j];
            const pb = pts[j + 1];
            const ex = pb.x - pa.x;
            const ey = pb.y - pa.y;
            const d = Math.hypot(ex, ey) || 0.001;
            const diff = ((d - rest) / d) * 0.5;
            if (j !== 0) {
              pa.x += ex * diff;
              pa.y += ey * diff;
            }
            if (j + 1 !== ROPE_SEGMENTS) {
              pb.x -= ex * diff;
              pb.y -= ey * diff;
            }
          }
          pts[0].x = A.x;
          pts[0].y = A.y;
          pts[ROPE_SEGMENTS].x = B.x;
          pts[ROPE_SEGMENTS].y = B.y;
        }

        let dStr = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
        for (let j = 1; j < ROPE_SEGMENTS; j++) {
          const mx = (pts[j].x + pts[j + 1].x) * 0.5;
          const my = (pts[j].y + pts[j + 1].y) * 0.5;
          dStr += ` Q${pts[j].x.toFixed(1)},${pts[j].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
        }
        dStr += ` L${pts[ROPE_SEGMENTS].x.toFixed(1)},${pts[ROPE_SEGMENTS].y.toFixed(1)}`;

        pathEl.setAttribute('d', dStr);
        pathEl.style.stroke = `rgba(${rgb}, ${isLive ? 0.9 : 0.5})`;
        pathEl.style.strokeWidth = isLive ? '1.6' : '1.1';
      });
    },
    [nodePos],
  );

  const runFrame = useCallback(
    (timeMs: number) => {
      const dt = Math.min(0.033, (timeMs - lastTimeRef.current) / 1000 || 0.016);
      lastTimeRef.current = timeMs;

      const engine = audioEngineRef.current;
      const level = engine ? engine.level() : 0;
      const bins = engine ? engine.bins() : [0, 0, 0, 0];
      const bounceAllowed = !reducedMotionRef.current;

      for (const m of memoriesList) {
        const st = cardsRef.current[m.id];
        if (!st || !st.el) continue;

        if (!st.dragging) {
          [st.x, st.vx] = stepSpring(st.x, st.vx, st.tx, 170, 22, dt);
          [st.y, st.vy] = stepSpring(st.y, st.vy, st.ty, 170, 22, dt);
        }
        [st.w, st.vw] = stepSpring(st.w, st.vw, st.tw, 200, 24, dt);
        [st.h, st.vh] = stepSpring(st.h, st.vh, st.th, 200, 24, dt);
        [st.rot, st.vr] = stepSpring(st.rot, st.vr, st.trot, 160, 16, dt);

        const targetScale = st.ts * (st.inSlot && bounceAllowed ? 1 + level * 0.025 : 1);
        [st.s, st.vs] = stepSpring(st.s, st.vs, targetScale, 260, 20, dt);

        st.el.style.width = `${st.w}px`;
        st.el.style.height = `${st.h}px`;
        st.el.style.transform = `translate(${st.x - st.w / 2}px, ${st.y - st.h / 2}px) rotate(${st.rot}deg) scale(${st.s})`;

        if (st.inSlot) {
          for (let b = 0; b < 4; b++) {
            const bar = st.eqBars[b];
            if (bar) {
              bar.style.height = `${25 + bins[b] * 75}%`;
            }
          }
        }
      }

      stepRopes(level, timeMs / 1000);
      rafRef.current = window.requestAnimationFrame(runFrame);
    },
    [audioEngineRef, stepRopes],
  );

  const getFolderOrigin = useCallback(() => {
    const btn = folderBtnRef.current;
    if (btn && typeof window !== 'undefined') {
      const r = btn.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          fx: Math.max(40, Math.min(window.innerWidth - 40, r.left + r.width / 2)),
          fy: Math.max(40, Math.min(window.innerHeight - 40, r.top + r.height * 0.4)),
        };
      }
    }
    return {
      fx: typeof window !== 'undefined' ? window.innerWidth * 0.16 : 220,
      fy: typeof window !== 'undefined' ? window.innerHeight * 0.35 : 300,
    };
  }, [folderBtnRef]);

  const performClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    clearScheduledTimers();
    ejectSlot(true);

    const { fx, fy } = getFolderOrigin();
    memoriesList.forEach((m, i) => {
      const st = cardsRef.current[m.id];
      if (!st) return;
      st.tx = fx;
      st.ty = fy;
      st.tw = 40;
      st.th = 50;
      st.trot = 0;
      st.ts = 0.65;
      const tid = window.setTimeout(() => {
        if (st.el) st.el.style.opacity = '0';
      }, 60 + i * 20);
      timersRef.current.push(tid);
    });

    const fadeTid = window.setTimeout(() => {
      setVisibleClass(false);
      document.body.style.overflow = '';
      lenisRef.current?.start();
    }, 240);

    const finishTid = window.setTimeout(() => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      isClosingRef.current = false;
      onRequestClose();
      folderBtnRef.current?.focus({ preventScroll: true });
    }, 760);

    timersRef.current.push(fadeTid, finishTid);
  }, [clearScheduledTimers, ejectSlot, folderBtnRef, getFolderOrigin, lenisRef, onRequestClose]);

  // Open / close orchestration
  useEffect(() => {
    if (!mounted) return;
    if (!open) return;

    isClosingRef.current = false;
    clearScheduledTimers();
    reducedMotionRef.current = Boolean(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    lenisRef.current?.stop();
    document.body.style.overflow = 'hidden';

    updateLayout();
    const { fx, fy } = getFolderOrigin();

    memoriesList.forEach((m, i) => {
      const st = cardsRef.current[m.id];
      if (!st) return;
      st.hidden = false;
      st.inSlot = false;
      st.dragging = false;
      st.x = fx;
      st.y = fy;
      st.w = 40;
      st.h = 50;
      st.rot = (i % 2 ? 1 : -1) * 20;
      st.s = 0.6;
      st.vx = 0;
      st.vy = 0;
      st.vw = 0;
      st.vh = 0;
      st.vr = 0;
      st.vs = 0;
      st.tx = fx;
      st.ty = fy;
      st.tw = 40;
      st.th = 50;
      st.trot = m.layout.rot;
      st.ts = 1;

      if (st.el) {
        st.el.classList.remove('in-slot', 'dragging');
        st.el.style.opacity = '0';
        st.el.style.pointerEvents = 'auto';
      }
      st.ghost?.classList.remove('on');

      const delay = reducedMotionRef.current ? 20 : 120 + i * 45;
      const tid = window.setTimeout(() => {
        if (!st.hidden && st.el) {
          st.el.style.opacity = '1';
        }
        setHomeTargets(st);
      }, delay);
      timersRef.current.push(tid);
    });

    slotCardIdRef.current = null;
    setNowPlayingSong(null);
    if (slotPromptRef.current) {
      slotPromptRef.current.style.opacity = '1';
    }

    buildRopes();
    window.requestAnimationFrame(() => {
      setVisibleClass(true);
    });

    window.cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = performance.now();
    rafRef.current = window.requestAnimationFrame(runFrame);

    const focusTid = window.setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    }, 60);
    timersRef.current.push(focusTid);

    return () => {
      clearScheduledTimers();
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      document.body.style.overflow = '';
      lenisRef.current?.start();
    };
  }, [
    mounted,
    open,
    buildRopes,
    clearScheduledTimers,
    getFolderOrigin,
    lenisRef,
    runFrame,
    setHomeTargets,
    updateLayout,
  ]);

  // Keyboard (Escape + Focus Trap), Resize, and Tab Visibility listeners while open
  useEffect(() => {
    if (!open) return;

    let rzTimer = 0;
    const onResize = () => {
      updateLayout();
      window.clearTimeout(rzTimer);
      rzTimer = window.setTimeout(updateLayout, 150);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const active = document.activeElement;
        if (active instanceof HTMLElement && active.isContentEditable) {
          active.blur();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        performClose();
        return;
      }

      if (e.key === 'Tab' && boardRef.current) {
        const focusables = Array.from(
          boardRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
          ),
        ).filter((el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden');

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        ejectSlot(true);
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(rzTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [open, ejectSlot, performClose, updateLayout]);

  // Pointer drag state per card
  const dragMetaRef = useRef<{
    id: string | null;
    ox: number;
    oy: number;
    sx: number;
    sy: number;
    lastX: number;
    lastT: number;
    moved: boolean;
  }>({
    id: null,
    ox: 0,
    oy: 0,
    sx: 0,
    sy: 0,
    lastX: 0,
    lastT: 0,
    moved: false,
  });

  const handleCardPointerDown = (m: MemoryItem, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const st = cardsRef.current[m.id];
    if (!st || !st.el || st.hidden || isClosingRef.current) return;
    if (st.cap?.isContentEditable) return;

    st.el.setPointerCapture(e.pointerId);
    st.dragging = true;
    st.el.classList.add('dragging');
    if (!st.inSlot) st.ghost?.classList.add('on');
    st.ts = 1.06;

    dragMetaRef.current = {
      id: m.id,
      ox: e.clientX - st.x,
      oy: e.clientY - st.y,
      sx: e.clientX,
      sy: e.clientY,
      lastX: e.clientX,
      lastT: performance.now(),
      moved: false,
    };
  };

  const handleCardPointerMove = (m: MemoryItem, e: React.PointerEvent<HTMLDivElement>) => {
    const dm = dragMetaRef.current;
    if (dm.id !== m.id) return;
    const st = cardsRef.current[m.id];
    if (!st || !st.dragging) return;

    if (Math.hypot(e.clientX - dm.sx, e.clientY - dm.sy) > 5) {
      dm.moved = true;
    }

    const nx = e.clientX - dm.ox;
    const ny = e.clientY - dm.oy;
    const now = performance.now();
    const dt = Math.max(1, now - dm.lastT);
    const vel = (e.clientX - dm.lastX) / dt;
    dm.lastX = e.clientX;
    dm.lastT = now;

    st.x = nx;
    st.tx = nx;
    st.y = ny;
    st.ty = ny;
    st.vx = 0;
    st.vy = 0;
    st.trot = Math.max(-14, Math.min(14, vel * 9));

    const sc = slotCenter();
    const near = Math.hypot(nx - sc.x, ny - sc.y) < dimsRef.current.slot * 0.75;
    slotRef.current?.classList.toggle('near', near);
  };

  const handleCardPointerEnd = (m: MemoryItem) => {
    const dm = dragMetaRef.current;
    if (dm.id !== m.id) return;
    const st = cardsRef.current[m.id];
    dm.id = null;
    if (!st || !st.dragging) return;

    st.dragging = false;
    st.el?.classList.remove('dragging');
    st.ghost?.classList.remove('on');
    slotRef.current?.classList.remove('near');

    const sc = slotCenter();
    const near = Math.hypot(st.x - sc.x, st.y - sc.y) < dimsRef.current.slot * 0.75;

    if (!dm.moved) {
      if (st.inSlot) {
        audioEngineRef.current?.toggle();
      } else {
        putInSlot(st);
      }
      return;
    }

    if (near) {
      putInSlot(st);
    } else if (st.inSlot) {
      ejectSlot(false);
    } else {
      setHomeTargets(st);
    }
  };

  const handleStartEditCaption = (m: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const st = cardsRef.current[m.id];
    const capEl = st?.cap;
    if (!capEl) return;
    capEl.contentEditable = 'true';
    capEl.focus();
    const sel = window.getSelection();
    if (sel) {
      sel.selectAllChildren(capEl);
    }
  };

  const handleFinishEditCaption = (m: MemoryItem) => {
    const st = cardsRef.current[m.id];
    const capEl = st?.cap;
    if (!capEl) return;
    capEl.contentEditable = 'false';
    const nextText = (capEl.textContent || '').trim() || pick(m.caption, lang);
    capEl.textContent = nextText;
    if (st.ovTitle) st.ovTitle.textContent = nextText;

    const key = `${m.id}:${lang}`;
    setCustomCaps((prev) => {
      const updated = { ...prev, [key]: nextText };
      saveCustomCaptions(updated);
      return updated;
    });
  };

  const handleHideCard = (m: MemoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const st = cardsRef.current[m.id];
    if (!st) return;
    if (st.inSlot) ejectSlot(false);
    st.hidden = true;
    if (st.el) {
      st.el.style.opacity = '0';
      st.el.style.pointerEvents = 'none';
    }
    st.ghost?.classList.remove('on');
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={boardRef}
      role="dialog"
      aria-modal="true"
      aria-label={pick(memoriesI18n.boardTitle, lang)}
      className={`mem-board ${isDark ? 'is-dark' : ''} ${visibleClass ? 'open' : ''}`}
    >
      {/* Top-Left Header */}
      <div className="mem-board-head">
        <h2>{pick(memoriesI18n.boardTitle, lang)}</h2>
        <p>{pick(memoriesI18n.boardSub, lang)}</p>
      </div>

      {/* Top-Right Close Button */}
      <button
        ref={closeBtnRef}
        type="button"
        data-cq-btn="true"
        onClick={performClose}
        aria-label={pick(memoriesI18n.closeAria, lang)}
        className="mem-board-close"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2} />
      </button>

      {/* Physical Verlet Strings Layer */}
      <svg className="mem-strings" aria-hidden="true">
        {edgeMeta.map((_, idx) => (
          <path
            key={`rope-${idx}`}
            ref={(el) => {
              ropePathsRef.current[idx] = el;
            }}
          />
        ))}
      </svg>

      {/* Center Audio Drop Slot */}
      <div ref={slotRef} className="mem-slot">
        <div ref={slotPromptRef} style={{ transition: 'opacity 0.25s ease' }}>
          {pick(memoriesI18n.slotLine1, lang)}
          <br />
          {pick(memoriesI18n.slotLine2, lang)}
        </div>
      </div>

      {/* Memory Ghosts & Polaroid Cards */}
      {memoriesList.map((m) => {
        const imgSrc = withBase(m.image.replace(/^\//, ''));
        const capText = getCaptionFor(m);

        return (
          <React.Fragment key={m.id}>
            <div
              ref={(el) => {
                if (cardsRef.current[m.id]) cardsRef.current[m.id].ghost = el;
              }}
              className="mem-ghost"
              aria-hidden="true"
            >
              <div className="mem-frame">
                <img src={imgSrc} alt="" loading="lazy" draggable={false} />
              </div>
            </div>

            <div
              ref={(el) => {
                if (cardsRef.current[m.id]) cardsRef.current[m.id].el = el;
              }}
              style={{ opacity: 0 }}
              className="mem-card"
              onPointerDown={(e) => handleCardPointerDown(m, e)}
              onPointerMove={(e) => handleCardPointerMove(m, e)}
              onPointerUp={() => handleCardPointerEnd(m)}
              onPointerCancel={() => handleCardPointerEnd(m)}
            >
              <div className="mem-frame">
                <img src={imgSrc} alt={capText} loading="lazy" draggable={false} />
              </div>

              <div
                ref={(el) => {
                  if (cardsRef.current[m.id]) cardsRef.current[m.id].cap = el;
                }}
                className="mem-cap"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                  e.stopPropagation();
                }}
                onBlur={() => handleFinishEditCaption(m)}
              >
                {capText}
              </div>

              {/* Hover / Touch Action Tools */}
              <div
                className="mem-tools"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  data-cq-btn="true"
                  className="music"
                  title={pick(memoriesI18n.playTitle, lang)}
                  aria-label={`${pick(memoriesI18n.playTitle, lang)}: ${capText}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const st = cardsRef.current[m.id];
                    if (st) putInSlot(st);
                  }}
                >
                  <Music className="w-[11px] h-[11px]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  data-cq-btn="true"
                  title={pick(memoriesI18n.editTitle, lang)}
                  aria-label={`${pick(memoriesI18n.editTitle, lang)}: ${capText}`}
                  onClick={(e) => handleStartEditCaption(m, e)}
                >
                  <Pencil className="w-[11px] h-[11px]" strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  data-cq-btn="true"
                  title={pick(memoriesI18n.hideTitle, lang)}
                  aria-label={`${pick(memoriesI18n.hideTitle, lang)}: ${capText}`}
                  onClick={(e) => handleHideCard(m, e)}
                >
                  <X className="w-[10px] h-[10px]" strokeWidth={2.4} />
                </button>
              </div>

              {/* In-Slot Playing Overlay */}
              <div
                className="mem-ov"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span
                  ref={(el) => {
                    if (cardsRef.current[m.id]) cardsRef.current[m.id].ovTitle = el;
                  }}
                  className="mem-ov-t"
                >
                  {capText}
                </span>
                <div className="mem-eq" aria-hidden="true">
                  {[0, 1, 2, 3].map((barIdx) => (
                    <i
                      key={barIdx}
                      ref={(el) => {
                        if (cardsRef.current[m.id]) {
                          cardsRef.current[m.id].eqBars[barIdx] = el;
                        }
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  data-cq-btn="true"
                  className="mem-ov-x"
                  title={pick(memoriesI18n.ejectTitle, lang)}
                  aria-label={pick(memoriesI18n.ejectTitle, lang)}
                  onClick={(e) => {
                    e.stopPropagation();
                    ejectSlot(false);
                  }}
                >
                  <X className="w-[9px] h-[9px]" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Bottom-Center Now Playing Pill */}
      <div className={`mem-now ${nowPlayingSong ? 'on' : ''}`} aria-live="polite">
        <span className="mem-dot" aria-hidden="true" />
        <span className="mem-now-text">
          {nowPlayingSong ? `♪ ${nowPlayingSong.title} — ${nowPlayingSong.artist}` : ''}
        </span>
      </div>
    </div>,
    document.body,
  );
}
