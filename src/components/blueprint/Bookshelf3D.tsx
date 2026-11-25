import React, { useState } from 'react';
import type { Lang } from './blueprintData';
import { triggerHapticAndSound } from '../../lib/feedback';

export interface Book3DItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  height: number;
  spineWidth: number;
  spineBg: string;
  spineText: string;
  spineBorder?: string;
  renderSpine: () => React.ReactNode;
}

export const BOOKSHELF_ITEMS: Book3DItem[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'books/atomic-habits.webp',
    height: 222,
    spineWidth: 40,
    spineBg: '#F6F5F0',
    spineText: '#3A352F',
    spineBorder: 'rgba(0,0,0,0.08)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center tracking-tight"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[16px] font-normal text-[#3d372e]">Atomic Habits</span>
        </div>
        <div
          className="pt-1 flex items-center justify-center leading-none"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[10px] font-semibold text-[#6b5b3e]">
            James
            <br />
            Clear
          </span>
        </div>
      </div>
    ),
  },
  {
    id: '48-laws-of-power',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    cover: 'books/48-laws-of-power.webp',
    height: 262,
    spineWidth: 58,
    spineBg: '#162B6F',
    spineText: '#D9532F',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-2.5 select-none">
        <span className="text-[7px] font-mono tracking-[0.2em] text-[#e0633c] uppercase">
          THE
        </span>
        <span
          className="text-[22px] font-bold leading-none text-[#e0633c]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          48
        </span>
        <div className="flex flex-col items-center leading-[1.08] text-[9.5px] font-serif font-bold text-[#e0633c] tracking-wider">
          <span>L</span>
          <span>A</span>
          <span>W</span>
          <span>S</span>
          <span className="text-[6.5px] my-0.5 tracking-widest">OF</span>
          <span>P</span>
          <span>O</span>
          <span>W</span>
          <span>E</span>
          <span>R</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[6px] font-mono tracking-[0.12em] text-[#e0633c] uppercase">
            ROBERT GREENE
          </span>
          <span className="w-2.5 h-3.5 rounded-full bg-[#e0633c]/90 inline-block" />
        </div>
      </div>
    ),
  },
  {
    id: 'shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    cover: 'books/shoe-dog.webp',
    height: 238,
    spineWidth: 42,
    spineBg: '#161616',
    spineText: '#AE843A',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center gap-2"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[14px] font-black tracking-[0.08em] text-[#B8893A] uppercase">
            SHOE DOG
          </span>
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-[#8E6A2C] uppercase">
            PHIL KNIGHT
          </span>
        </div>
        <svg viewBox="0 0 24 10" className="w-6 h-2.5 fill-[#E11D24] shrink-0">
          <path d="M5.2 8.9C2.7 8.9 1 7.6 1 5.6c0-1.5 1-3.3 2.5-4.8-.5 1.3-.5 2.5.1 3.3.7.9 2.1 1.1 4.1.6L23 1.2 6.8 8.5c-.5.2-1.1.4-1.6.4z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: 'books/deep-work.webp',
    height: 246,
    spineWidth: 42,
    spineBg: '#EAB308',
    spineText: '#141414',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[16px] font-black tracking-[0.08em] text-[#171717] uppercase">
            DEEP WORK
          </span>
        </div>
        <div
          className="pt-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[9px] font-bold tracking-[0.14em] text-[#171717] uppercase">
            CAL NEWPORT
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'steve-jobs',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    cover: 'books/steve-jobs.webp',
    height: 272,
    spineWidth: 48,
    spineBg: '#FFFFFF',
    spineText: '#141414',
    spineBorder: 'rgba(0,0,0,0.12)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-4 select-none">
        <div
          className="flex items-center justify-center pt-1"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[16px] font-semibold tracking-tight text-[#171717]">
            Steve Jobs
          </span>
        </div>
        <div
          className="flex items-center justify-center pb-2"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[9.5px] font-normal text-[#737373]">Walter Isaacson</span>
        </div>
      </div>
    ),
  },
  {
    id: 'subtle-art',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    cover: 'books/subtle-art.webp',
    height: 232,
    spineWidth: 38,
    spineBg: '#F15B1B',
    spineText: '#121212',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-2.5 select-none">
        <div
          className="flex-1 flex items-center justify-center leading-[1.05]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[11px] font-black tracking-tight text-[#141414] uppercase">
            THE SUBTLE ART OF
            <br />
            NOT GIVING A F*CK
          </span>
        </div>
        <div
          className="pt-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[7.5px] font-bold tracking-wider text-white uppercase">
            MARK MANSON
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'books/psychology-of-money.webp',
    height: 228,
    spineWidth: 38,
    spineBg: '#FBFBF9',
    spineText: '#141414',
    spineBorder: 'rgba(0,0,0,0.12)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-2.5 select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D9A126] inline-block shrink-0" />
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[10px] font-bold tracking-tight text-[#1a1a1a] uppercase">
            THE PSYCHOLOGY OF MONEY
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[7px] font-semibold tracking-wider text-[#525252] uppercase">
            MORGAN HOUSEL
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'thinking-fast-and-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: 'books/thinking-fast-and-slow.webp',
    height: 254,
    spineWidth: 44,
    spineBg: '#FAF8F2',
    spineText: '#1A1A1A',
    spineBorder: 'rgba(0,0,0,0.12)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center leading-tight"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[11px] font-semibold tracking-[0.06em] text-[#1A1A1A] uppercase">
            THINKING, FAST AND SLOW
          </span>
        </div>
        <div className="w-5 h-1 rounded-full bg-[#E5A922] my-1 shrink-0" />
        <div
          className="flex items-center justify-center"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[8px] font-medium tracking-[0.12em] text-[#404040] uppercase">
            DANIEL KAHNEMAN
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'almanack-naval',
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    cover: 'books/almanack-naval.webp',
    height: 240,
    spineWidth: 40,
    spineBg: '#FFFFFF',
    spineText: '#141414',
    spineBorder: 'rgba(0,0,0,0.12)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div className="w-full h-1.5 bg-[#171717] shrink-0" />
        <div
          className="flex-1 flex items-center justify-center gap-1"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[8.5px] font-semibold tracking-[0.12em] text-[#737373] uppercase">
            THE ALMANACK OF{' '}
            <strong className="text-[11px] font-black text-[#171717]">NAVAL RAVIKANT</strong>
          </span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[7px] font-bold tracking-[0.14em] text-[#404040] uppercase">
            ERIC JORGENSON
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'habit-of-winning',
    title: 'The Habit of Winning',
    author: 'Prakash Iyer',
    cover: 'books/habit-of-winning.webp',
    height: 224,
    spineWidth: 38,
    spineBg: '#FFFFFF',
    spineText: '#D97706',
    spineBorder: 'rgba(0,0,0,0.12)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-2.5 select-none">
        <div
          className="flex-1 flex items-center justify-center gap-1"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[8px] font-bold tracking-wider text-[#B45309] uppercase">
            PRAKASH IYER{' '}
            <strong className="text-[#D97706] font-black">THE HABIT OF WINNING</strong>
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block" />
          <span className="w-2 h-2.5 rounded-full bg-[#171717] inline-block" />
        </div>
      </div>
    ),
  },
];

function Book3DButton({
  book,
  isOpen,
  onToggle,
  withBase,
}: {
  book: Book3DItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  withBase: (p: string) => string;
}) {
  const coverWidth = Math.round(book.height * 0.67);
  const openSlotWidth = coverWidth + 18;

  return (
    <button
      type="button"
      onClick={() => onToggle(book.id)}
      aria-expanded={isOpen}
      aria-label={`${book.title} — ${book.author}`}
      style={{
        width: isOpen ? `${openSlotWidth}px` : `${book.spineWidth}px`,
        height: `${book.height}px`,
        perspective: '1100px',
        transition:
          'width 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`group/book relative shrink-0 cursor-pointer bg-transparent border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-500 ${
        isOpen ? 'z-20' : 'z-10 hover:-translate-y-2.5'
      }`}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: isOpen
            ? 'translateX(12px) rotateY(-76deg)'
            : 'translateX(0px) rotateY(0deg)',
          transformOrigin: 'left center',
        }}
      >
        {/* 1. SPINE FACE */}
        <div
          style={{
            width: `${book.spineWidth}px`,
            height: `${book.height}px`,
            backgroundColor: book.spineBg,
            color: book.spineText,
            border: book.spineBorder ? `1px solid ${book.spineBorder}` : undefined,
            backfaceVisibility: 'hidden',
          }}
          className="relative rounded-t-[2px] overflow-hidden shadow-md"
        >
          {book.renderSpine()}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 18%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.24) 100%)',
            }}
          />
        </div>

        {/* 2. FRONT COVER FACE */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: `${book.spineWidth - 1}px`,
            width: `${coverWidth}px`,
            height: `${book.height}px`,
            transformOrigin: 'left center',
            transform: 'rotateY(92deg)',
            backfaceVisibility: 'hidden',
          }}
          className="rounded-r-[3px] overflow-hidden shadow-2xl bg-neutral-900 border border-black/10 dark:border-white/10"
        >
          <img
            src={withBase(book.cover)}
            alt={book.title}
            className="w-full h-full object-cover block select-none"
            draggable={false}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(255,255,255,0.22) 3.5%, rgba(0,0,0,0.12) 6.5%, rgba(255,255,255,0.06) 9%, transparent 18%)',
            }}
          />
        </div>
      </div>
    </button>
  );
}

export function Bookshelf3D({
  lang,
  withBase,
}: {
  lang: Lang;
  withBase: (p: string) => string;
}) {
  const [openBookId, setOpenBookId] = useState<string | null>(null);

  const activeBook = BOOKSHELF_ITEMS.find((b) => b.id === openBookId) || null;

  const handleToggle = (id: string) => {
    triggerHapticAndSound('tap');
    setOpenBookId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {lang === 'id'
            ? 'Bacaan & Buku Favorit (Rak Interaktif 3D)'
            : 'Favorite Books & Reading List (Interactive 3D Shelf)'}
        </p>
        <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          {activeBook
            ? `${activeBook.title} — ${activeBook.author}`
            : lang === 'id'
              ? 'Klik punggung buku untuk membuka sampul 3D'
              : 'Click any book spine to open 3D cover'}
        </span>
      </div>

      {/* Shelf Container */}
      <div className="relative rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30 pt-6 pb-5 px-3 sm:px-6">
        {/* Scrollable Shelf Row on small screens, centered unified shelf on desktop */}
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div className="min-w-max mx-auto flex items-end justify-center gap-2 sm:gap-2.5 min-h-[282px] px-2 pt-3">
            {BOOKSHELF_ITEMS.map((book) => (
              <Book3DButton
                key={book.id}
                book={book}
                isOpen={openBookId === book.id}
                onToggle={handleToggle}
                withBase={withBase}
              />
            ))}
          </div>
        </div>

        {/* Minimal Architectural Shelf Ledge */}
        <div className="relative mx-auto max-w-[660px] h-[9px] rounded-full bg-gradient-to-b from-neutral-200 to-neutral-300/90 dark:from-neutral-800 dark:to-neutral-950 shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.55)] border-t border-white/60 dark:border-white/10" />
      </div>
    </div>
  );
}
