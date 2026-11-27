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
      <div className="w-full h-full flex flex-col items-center justify-between py-2.5 px-1 select-none text-center">
        <span className="text-[6.5px] font-serif tracking-[0.14em] text-[#e0633c] uppercase leading-tight">
          THE 48 LAWS OF
        </span>
        <div className="flex flex-col items-center justify-center gap-1 my-1 font-serif font-bold text-[19px] leading-none text-[#e0633c]">
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
    height: 244,
    spineWidth: 40,
    spineBg: '#121212',
    spineText: '#FFFFFF',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col justify-between overflow-hidden select-none">
        <div
          className="flex-1 flex items-center justify-center pt-3"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[15px] font-black tracking-[0.08em] text-white uppercase">
            SHOE DOG
          </span>
        </div>
        <div
          className="h-[74px] w-full bg-[#E11931] flex items-center justify-center py-2"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[9px] font-extrabold tracking-[0.1em] text-white uppercase">
            PHIL KNIGHT
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'book-of-elon',
    title: 'The Book of Elon',
    author: 'Eric Jorgenson',
    cover: 'books/book-of-elon.webp',
    height: 252,
    spineWidth: 40,
    spineBg: '#D81B3A',
    spineText: '#FFFFFF',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[12.5px] font-bold tracking-[0.14em] text-white uppercase">
            THEBOOKOFELON
          </span>
        </div>
        <div
          className="pt-2 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[7.5px] font-bold tracking-[0.12em] text-white/90 uppercase">
            ERIC JORGENSON
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
    height: 274,
    spineWidth: 50,
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
    height: 244,
    spineWidth: 38,
    spineBg: '#F9F9F7',
    spineText: '#171717',
    spineBorder: 'rgba(0,0,0,0.1)',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[12px] text-[#171717]">
            The <strong className="font-bold">Psychology</strong>{' '}
            <em className="italic">of</em> <strong className="font-bold">Money</strong>
          </span>
        </div>
        <div
          className="pt-1.5 flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[6.5px] font-bold tracking-[0.14em] text-[#404040] uppercase">
            MORGAN HOUSEL
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    cover: 'books/meditations.webp',
    height: 246,
    spineWidth: 40,
    spineBg: '#161616',
    spineText: '#F5F5F4',
    renderSpine: () => (
      <div className="relative w-full h-full flex flex-col items-center justify-between py-3 select-none">
        <div className="absolute top-0 bottom-0 left-[5px] w-[1.5px] bg-[#E85D25]" />
        <div
          className="flex-1 flex items-center justify-center pl-1"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[11.5px] tracking-[0.15em] text-white uppercase">
            MEDITATIONS
          </span>
        </div>
        <div
          className="pt-1 flex items-center justify-center pl-1"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          <span className="text-[8.5px] italic text-[#E85D25]">Marcus Aurelius</span>
        </div>
      </div>
    ),
  },
  {
    id: 'if-anyone-builds-it',
    title: 'If Anyone Builds It, Everyone Dies',
    author: 'Eliezer Yudkowsky & Nate Soares',
    cover: 'books/if-anyone-builds-it.webp',
    height: 246,
    spineWidth: 38,
    spineBg: '#141414',
    spineText: '#FFFFFF',
    renderSpine: () => (
      <div className="w-full h-full flex flex-col items-center justify-center py-3 select-none">
        <div
          className="flex items-center justify-center"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <span className="text-[9.5px] font-black tracking-[0.06em] text-white uppercase">
            IF ANYONE BUILDS IT, EVERYONE DIES
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
    height: 246,
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

export function Bookshelf3D({
  lang,
  withBase,
}: {
  lang: Lang;
  withBase: (p: string) => string;
}) {
  const [activeBookId, setActiveBookId] = useState<string | null>(null);

  const activeBook = BOOKSHELF_ITEMS.find((b) => b.id === activeBookId) || null;

  const handleBookClick = (id: string) => {
    triggerHapticAndSound('flip');
    setActiveBookId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          {lang === 'id' ? 'Buku yang akan saya baca berulang kali' : 'Books I would happily reread'}
        </h3>
        {activeBook && (
          <span className="text-[11px] font-mono text-neutral-400">
            {`${activeBook.title} — ${activeBook.author}`}
          </span>
        )}
      </div>

      {/* 3D Bookshelf Stage */}
      <div className="relative rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 pt-8 pb-5 px-2 sm:px-4 overflow-x-auto">
        <div className="min-w-[540px] flex flex-col items-center">
          {/* Books Row */}
          <div className="flex items-end justify-center gap-[5px] sm:gap-[6px] px-2">
            {BOOKSHELF_ITEMS.map((book) => {
              const isOpen = activeBookId === book.id;
              const coverWidth = Math.round(book.height * 0.67);
              const openSlotWidth = coverWidth + 18;

              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleBookClick(book.id)}
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
                  {/* 3D Preserve-3D Book Object */}
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
                    {/* 1. SPINE FACE (Front at 0deg) */}
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

                      {/* Realistic Cylindrical Spine Lighting Overlay */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(90deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 18%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.24) 100%)',
                        }}
                      />
                    </div>

                    {/* 2. FRONT COVER FACE (Attached to right edge of spine at 90deg) */}
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

                      {/* Realistic Book Hinge Crease & Lighting */}
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
            })}
          </div>

          {/* Minimalist Shelf Ledge (Matches Video Bottom Bar) */}
          <div className="w-full max-w-[650px] h-[11px] rounded-full bg-[#e4e4e7] dark:bg-[#27272a] shadow-inner" />
        </div>
      </div>
    </div>
  );
}
