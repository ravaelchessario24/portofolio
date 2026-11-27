import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type Lenis from 'lenis';
import { triggerHapticAndSound } from '../../lib/feedback';
import {
  type Lang,
  memoriesList,
  memoriesI18n,
  pick,
} from './blueprintData';
import { MemoriesAudioEngine } from './memoriesAudio';
import { MemoriesBoard } from './MemoriesBoard';

interface MemoriesFolderProps {
  lang: Lang;
  isDark: boolean;
  withBase: (p: string) => string;
  lenisRef: React.RefObject<Lenis | null>;
}

export function MemoriesFolder({
  lang,
  isDark,
  withBase,
  lenisRef,
}: MemoriesFolderProps) {
  const [isHot, setIsHot] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const folderBtnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const audioEngineRef = useRef<MemoriesAudioEngine | null>(null);

  const tipPosRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const tipRafRef = useRef<number>(0);

  const previewPapers = memoriesList.slice(0, 3);

  useEffect(() => {
    setMounted(true);
    return () => {
      window.cancelAnimationFrame(tipRafRef.current);
      audioEngineRef.current?.destroy();
      audioEngineRef.current = null;
    };
  }, []);

  // Cursor-follow lerp loop (runs only while tooltip is active)
  useEffect(() => {
    if (!showTip || boardOpen) {
      window.cancelAnimationFrame(tipRafRef.current);
      return;
    }

    const loop = () => {
      const p = tipPosRef.current;
      p.x += (p.tx - p.x) * 0.25;
      p.y += (p.ty - p.y) * 0.25;
      if (tipRef.current) {
        tipRef.current.style.transform = `translate(${p.x + 14}px, ${p.y + 18}px)`;
      }
      tipRafRef.current = window.requestAnimationFrame(loop);
    };

    tipRafRef.current = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(tipRafRef.current);
    };
  }, [showTip, boardOpen]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsHot(true);
    if (e.pointerType === 'mouse' && !boardOpen) {
      tipPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        tx: e.clientX,
        ty: e.clientY,
      };
      if (tipRef.current) {
        tipRef.current.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 18}px)`;
      }
      setShowTip(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    tipPosRef.current.tx = e.clientX;
    tipPosRef.current.ty = e.clientY;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const btn = folderBtnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;
    const r = btn.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${nx * 14}deg) rotateX(${-ny * 10}deg)`;
  };

  const handlePointerLeave = () => {
    setIsHot(false);
    setShowTip(false);
    if (innerRef.current) {
      innerRef.current.style.transform = '';
    }
  };

  const handleOpenBoard = useCallback(() => {
    if (boardOpen) return;
    setShowTip(false);
    setIsHot(false);
    if (innerRef.current) {
      innerRef.current.style.transform = '';
    }
    triggerHapticAndSound('tap');

    if (!audioEngineRef.current) {
      audioEngineRef.current = new MemoriesAudioEngine(withBase);
    }
    audioEngineRef.current.init();
    setBoardOpen(true);
  }, [boardOpen, withBase]);

  const handleBoardClosed = useCallback(() => {
    setBoardOpen(false);
  }, []);

  return (
    <>
      <div className="mem-folder-anchor">
        <button
          ref={folderBtnRef}
          type="button"
          data-cq-btn="true"
          aria-haspopup="dialog"
          aria-expanded={boardOpen}
          aria-label={pick(memoriesI18n.folderAria, lang)}
          className={`mem-folder ${isHot ? 'hot' : ''}`}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onFocus={() => setIsHot(true)}
          onBlur={() => setIsHot(false)}
          onClick={handleOpenBoard}
        >
          <div ref={innerRef} className="mem-f-inner">
            <div className="mem-f-back" />
            {previewPapers[2] && (
              <div className="mem-f-paper p3">
                <img
                  src={withBase(previewPapers[2].image.replace(/^\//, ''))}
                  alt=""
                  loading="eager"
                  draggable={false}
                />
              </div>
            )}
            {previewPapers[1] && (
              <div className="mem-f-paper p2">
                <img
                  src={withBase(previewPapers[1].image.replace(/^\//, ''))}
                  alt=""
                  loading="eager"
                  draggable={false}
                />
              </div>
            )}
            {previewPapers[0] && (
              <div className="mem-f-paper p1">
                <img
                  src={withBase(previewPapers[0].image.replace(/^\//, ''))}
                  alt=""
                  loading="eager"
                  draggable={false}
                />
              </div>
            )}
            <div className="mem-f-front" />
          </div>
        </button>
        <div className="mem-folder-label">memories.zip</div>
      </div>

      {mounted &&
        createPortal(
          <div
            ref={tipRef}
            aria-hidden="true"
            className={`mem-tip ${showTip && !boardOpen ? 'show' : ''}`}
          >
            {pick(memoriesI18n.tooltip, lang)}
          </div>,
          document.body,
        )}

      <MemoriesBoard
        open={boardOpen}
        onRequestClose={handleBoardClosed}
        lang={lang}
        isDark={isDark}
        withBase={withBase}
        folderBtnRef={folderBtnRef}
        lenisRef={lenisRef}
        audioEngineRef={audioEngineRef}
      />
    </>
  );
}
