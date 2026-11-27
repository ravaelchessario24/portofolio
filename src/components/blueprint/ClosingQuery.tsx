import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  type Lang,
  blueprintProfileMeta,
  closingQueryI18n,
  pick,
} from './blueprintData';
import { isSoundEnabled, triggerHapticAndSound } from '../../lib/feedback';

type QueryState = 'idle' | 'running' | 'done';

interface ClosingQueryProps {
  lang: Lang;
}

export function ClosingQuery({ lang }: ClosingQueryProps) {
  const [state, setState] = useState<QueryState>('idle');
  const [renderResult, setRenderResult] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const runTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const t = closingQueryI18n[lang];
  const namaVal = blueprintProfileMeta.shortName;
  const bidangVal = pick(blueprintProfileMeta.openFields, lang);
  const tipeVal = pick(blueprintProfileMeta.openTypes, lang);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
    return () => {
      if (runTimerRef.current) window.clearTimeout(runTimerRef.current);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track whether ClosingQuery is visible in the viewport for Ctrl/⌘+Enter shortcut
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ensureCardBottomVisible = useCallback((prefersReducedMotion: boolean) => {
    const cardEl = cardRef.current;
    if (!cardEl || typeof window === 'undefined') return;
    const rect = cardEl.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      cardEl.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, []);

  const executeQuery = useCallback(() => {
    if (state === 'running' || isClosing) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Subtle tap sound + 10ms vibration on press (respecting sound switch)
    if (isSoundEnabled()) {
      triggerHapticAndSound('tap');
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate(10);
        }
      } catch {}
    }

    if (runTimerRef.current) window.clearTimeout(runTimerRef.current);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);

    const startRunning = () => {
      setIsClosing(false);
      setIsExpanded(false);
      setRenderResult(false);
      setState('running');

      runTimerRef.current = window.setTimeout(() => {
        setState('done');
        setRenderResult(true);

        if (isSoundEnabled()) {
          triggerHapticAndSound('hover');
        }

        if (prefersReducedMotion) {
          setIsExpanded(true);
          scrollTimerRef.current = window.setTimeout(() => {
            ensureCardBottomVisible(true);
          }, 20);
        } else {
          rafRef.current = window.requestAnimationFrame(() => {
            rafRef.current = window.requestAnimationFrame(() => {
              setIsExpanded(true);
              scrollTimerRef.current = window.setTimeout(() => {
                ensureCardBottomVisible(false);
              }, 360);
            });
          });
        }
      }, 450);
    };

    if (state === 'done') {
      if (prefersReducedMotion) {
        startRunning();
      } else {
        // Collapse result block over 250ms first, then enter running -> done
        setIsClosing(true);
        setIsExpanded(false);
        closeTimerRef.current = window.setTimeout(() => {
          startRunning();
        }, 250);
      }
    } else {
      startRunning();
    }
  }, [state, isClosing, ensureCardBottomVisible]);

  // Keyboard shortcut: Ctrl+Enter or ⌘+Enter while section is visible in viewport
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isInView) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeQuery();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isInView, executeQuery]);

  const isDone = state === 'done' && !isClosing;
  const isRunning = state === 'running' || isClosing;
  const statusText =
    state === 'idle'
      ? t.statusIdle
      : isRunning
        ? t.statusRunning
        : t.statusDone;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="closing-query-heading"
      className="w-full pt-[56px] pb-12 px-4 text-center"
    >
      {/* Heading H2 */}
      <h2
        id="closing-query-heading"
        className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-tight text-neutral-900 dark:text-neutral-100"
      >
        {t.heading}
      </h2>

      {/* Monochrome SQL Card */}
      <div
        ref={cardRef}
        className="mt-8 max-w-[720px] w-full mx-auto rounded-[16px] bg-[#0a0a0a] text-[#fafafa] overflow-hidden text-left border border-transparent dark:border-white/[0.12]"
      >
        {/* 1. Card Header: only "kontak.sql" on the left */}
        <div className="flex items-center px-[24px] py-[14px] font-mono text-[12px] text-[#a3a3a3] border-b border-[#262626]">
          <span>{t.fileName}</span>
        </div>

        {/* 2. Static SQL Code */}
        <pre className="m-0 p-[24px] font-mono text-[13px] sm:text-[14px] leading-[1.9] text-[#d4d4d4] overflow-x-auto">
          <code>
            <span className="text-white font-medium">SELECT</span> nama, bidang, tipe{'\n'}
            <span className="text-white font-medium">FROM</span>
            {'   '}ravael{'\n'}
            <span className="text-white font-medium">WHERE</span>
            {'  '}status = &apos;terbuka&apos;;
          </code>
        </pre>

        {/* 3. Result Block (aria-live="polite" container always present; content only rendered after run) */}
        <div aria-live="polite" aria-busy={isRunning}>
          <div
            className="cq-result-grid"
            data-expanded={isExpanded ? 'true' : 'false'}
            data-closing={isClosing ? 'true' : 'false'}
          >
            <div className="overflow-hidden">
              {renderResult && (
                <div className="font-mono text-[13px] border-t border-[#262626]">
                  {/* Desktop / Tablet Result Table (>= 640px) */}
                  <div className="hidden sm:block">
                    <div className="cq-result-header grid grid-cols-[0.8fr_2.2fr_1.2fr] gap-[12px] px-[24px] py-[12px] text-[#a3a3a3] border-b border-[#262626]">
                      <span>nama</span>
                      <span>bidang</span>
                      <span>tipe</span>
                    </div>
                    <div className="cq-result-data grid grid-cols-[0.8fr_2.2fr_1.2fr] gap-[12px] px-[24px] py-[14px] text-[#fafafa]">
                      <span>{namaVal}</span>
                      <span>{bidangVal}</span>
                      <span>{tipeVal}</span>
                    </div>
                  </div>

                  {/* Mobile Stacked Label-Above-Value (< 640px) */}
                  <div className="block sm:hidden cq-result-data px-[24px] py-[14px] space-y-3.5">
                    <div>
                      <div className="cq-result-header text-[#a3a3a3] text-[12px] mb-0.5">nama</div>
                      <div className="text-[#fafafa]">{namaVal}</div>
                    </div>
                    <div>
                      <div className="cq-result-header text-[#a3a3a3] text-[12px] mb-0.5">
                        bidang
                      </div>
                      <div className="text-[#fafafa]">{bidangVal}</div>
                    </div>
                    <div>
                      <div className="cq-result-header text-[#a3a3a3] text-[12px] mb-0.5">tipe</div>
                      <div className="text-[#fafafa]">{tipeVal}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Card Footer */}
        <div className="border-t border-[#262626] px-[24px] py-[16px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-mono text-[12px] text-[#a3a3a3]">{statusText}</span>

          {isDone ? (
            <button
              type="button"
              data-cq-btn="true"
              onClick={executeQuery}
              className="w-full sm:w-auto h-[48px] sm:h-[44px] px-5 rounded-full border border-[#404040] bg-transparent text-[#fafafa] text-[14px] font-medium inline-flex items-center justify-center gap-2 transition-transform duration-150 hover:-translate-y-[1px] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              <RotateCcw className="w-[14px] h-[14px] shrink-0" />
              <span>{t.btnDone}</span>
            </button>
          ) : (
            <button
              type="button"
              data-cq-btn="true"
              disabled={isRunning}
              aria-busy={isRunning}
              onClick={executeQuery}
              className={`w-full sm:w-auto h-[48px] px-5 rounded-full bg-[#ffffff] text-[#0a0a0a] text-[14px] font-semibold inline-flex items-center justify-center gap-2.5 transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isRunning
                  ? 'opacity-90 cursor-wait'
                  : 'cq-pulse-btn hover:-translate-y-[1px] active:scale-[0.97] cursor-pointer'
              }`}
            >
              {isRunning ? (
                <svg
                  className="w-[14px] h-[14px] animate-spin text-[#0a0a0a] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[11px] h-[11px] text-[#0a0a0a] shrink-0"
                  viewBox="0 0 12 14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M1.5 1.25L10.75 7L1.5 12.75V1.25Z" />
                </svg>
              )}

              <span>{isRunning ? t.btnRunning : t.btnIdle}</span>

              {!isRunning && (
                <kbd className="hidden sm:inline-flex [@media(hover:none)]:hidden items-center px-1.5 py-0.5 rounded-[6px] bg-[#e5e5e5] text-[#404040] font-mono text-[11px] font-normal leading-none">
                  {isMac ? '⌘ ↵' : 'Ctrl ↵'}
                </kbd>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
