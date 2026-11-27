import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import {
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import { triggerHapticAndSound } from '../lib/feedback';
import {
  dashedX,
  dashedY,
  BannerParticles,
  CurrentTime,
  FooterBackground,
  SoftPillButton,
  FlipCoverButton,
  BlueprintLoader,
  PointText,
} from './blueprint/BlueprintHelpers';
import {
  type Lang,
  blueprintExperiences,
  blueprintProjects,
  blueprintSkillGroups,
  blueprintCertifications,
  blueprintCoursework,
  blueprintHighlights,
  blueprintProfileMeta,
  animeWithCovers,
  musicScenes,
  featuredArtists,
  allArtists,
  nowPlaying,
  techNames,
  iconMap,
  pick,
} from './blueprint/blueprintData';
import { ClosingQuery } from './blueprint/ClosingQuery';
import { Bookshelf3D } from './blueprint/Bookshelf3D';
import {
  type BlueprintView,
  ProjectDetailView,
  AllProjectsView,
  ExperienceTimelineView,
  AllHighlightsView,
  AllAnimeMusicView,
  ContactPageView,
  CommandMenuModal,
} from './blueprint/BlueprintSubViews';

interface PortfolioAppProps {
  baseUrl?: string;
}

const NAV_ITEMS = [
  { label: { id: 'Pengalaman', en: 'Experience' }, href: 'experience' },
  { label: { id: 'Proyek', en: 'Projects' }, href: 'projects' },
  { label: { id: 'Keahlian', en: 'Skills' }, href: 'skills' },
  { label: { id: 'Pendidikan', en: 'Education' }, href: 'education' },
  { label: { id: 'Highlights', en: 'Highlights' }, href: 'highlights' },
  { label: { id: 'Tentang Diriku', en: 'Beyond the Data' }, href: 'movies' },
];

export default function PortfolioApp({ baseUrl = '/' }: PortfolioAppProps) {
  const [lang, setLang] = useState<Lang>('id');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [view, setView] = useState<BlueprintView>('home');
  const [activeProjectSlug, setActiveProjectSlug] = useState<string>('mobile-jkn');
  const [openExpIndex, setOpenExpIndex] = useState<number | null>(0);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showAllMusicArtists, setShowAllMusicArtists] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('experience');
  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
    caption?: string;
  } | null>(null);

  const scrollLockUntilRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scrolling (respecting prefers-reduced-motion)
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const withBase = useCallback(
    (p: string) => {
      if (!p) return normalizedBase;
      if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) {
        return p;
      }
      const clean = p.replace(/^\//, '');
      return `${normalizedBase}${clean}`;
    },
    [normalizedBase],
  );

  // Sync initial theme & language
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = savedTheme ? savedTheme === 'dark' : prefersDark;
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';

      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'en' || savedLang === 'id') {
        setLang(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {}
  }, []);

  // Smooth Scroll-Spy for RightNavbar INDEX (works seamlessly scrolling down & up)
  useEffect(() => {
    if (view !== 'home') return;
    const ids = NAV_ITEMS.map((item) => item.href);
    let rafId = 0;

    const computeActive = () => {
      if (Date.now() < scrollLockUntilRef.current) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY < 80) {
        setActiveSection(ids[0]);
        return;
      }

      if (vh + scrollY >= docHeight - 100) {
        const lastEl = document.getElementById(ids[ids.length - 1]);
        if (lastEl && lastEl.getBoundingClientRect().top < vh * 0.8) {
          setActiveSection(ids[ids.length - 1]);
          return;
        }
      }

      const threshold = Math.max(160, vh * 0.34);
      let current: string = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeActive);
    };

    computeActive();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [view]);

  // Global default interactive sound effects on every button / href / interactive element
  useEffect(() => {
    let lastHoveredEl: Element | null = null;

    const findInteractive = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof HTMLElement)) return null;
      return target.closest(
        'button, a[href], [role="button"], .cursor-pointer, .cursor-zoom-in',
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      const el = findInteractive(e.target);
      if (el && !el.hasAttribute('data-cq-btn')) {
        triggerHapticAndSound('tap');
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = findInteractive(e.target);
      if (el && el !== lastHoveredEl) {
        lastHoveredEl = el;
        triggerHapticAndSound('hover');
      } else if (!el) {
        lastHoveredEl = null;
      }
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K & Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      const nextTheme = next ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.dataset.theme = nextTheme;
      try {
        localStorage.setItem('theme', nextTheme);
      } catch {}
      return next;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'id' ? 'en' : 'id';
      document.documentElement.lang = next;
      try {
        localStorage.setItem('lang', next);
      } catch {}
      return next;
    });
  }, []);

  const navigateToView = useCallback((nextView: BlueprintView) => {
    setView(nextView);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const openProjectDetail = useCallback((slug: string) => {
    setActiveProjectSlug(slug);
    setView('project-detail');
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    scrollLockUntilRef.current = Date.now() + 1100;
    setView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el, { offset: -16, duration: 1.1 });
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 40);
  }, []);

  const openLightbox = useCallback((src: string, title: string, caption?: string) => {
    setLightbox({ src, title, caption });
  }, []);

  const activeProject =
    blueprintProjects.find((p) => p.slug === activeProjectSlug) || blueprintProjects[0];

  const displayedMovies = showAllMovies ? animeWithCovers : animeWithCovers.slice(0, 8);
  const visibleArtists = showAllMusicArtists ? allArtists : featuredArtists;
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${nowPlaying.trackId}?utm_source=generator`;

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[var(--background)] text-[var(--foreground)]">
      {/* Architectural Blueprint Loading Overlay */}
      <BlueprintLoader />

      {/* Right Fixed Blueprint INDEX Navbar */}
      {view === 'home' && (
        <div className="fixed inset-0 z-40 pointer-events-none hidden lg:block">
          <nav
            data-bp="index"
            aria-label="Blueprint Section Index"
            className="absolute top-[22vh] left-[calc(82%+24px)] xl:left-[calc(74%+32px)] pointer-events-auto flex flex-col gap-3.5 mt-3"
          >
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 dark:text-zinc-500 uppercase mb-1">
              INDEX
            </h3>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  data-bp="navitem"
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => scrollToSection(item.href)}
                  className={`group text-[12px] tracking-[0.04em] transition-colors duration-300 ease-out flex items-center text-left cursor-pointer bg-transparent border-0 p-0 ${
                    isActive
                      ? 'text-zinc-950 dark:text-zinc-50 font-semibold'
                      : 'text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`inline-block h-[1.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'w-4 mr-2.5 bg-zinc-900 dark:bg-zinc-100 opacity-100'
                        : 'w-0 mr-0 bg-zinc-400 dark:bg-zinc-500 opacity-0 group-hover:w-2 group-hover:mr-2 group-hover:opacity-60'
                    }`}
                  />
                  <span className="transition-transform duration-300 ease-out">
                    {pick(item.label, lang)}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Architectural Micro-Dotted Vertical Lines */}
      <div
        className="absolute top-0 bottom-0 left-2.5 sm:left-4 md:left-[15%] lg:left-[18%] xl:left-[26%] w-[1px]"
        style={dashedY}
      />
      <div
        className="absolute top-0 bottom-0 right-2.5 sm:right-4 md:right-[15%] lg:right-[18%] xl:right-[26%] w-[1px]"
        style={dashedY}
      />

      {/* Center Architectural Column */}
      <div data-bp="column" className="mx-2.5 sm:mx-4 md:mx-[15%] lg:mx-[18%] xl:mx-[26%]">
        {/* Top Banner with Particles & Dot-Matrix Clock */}
        <div
          onClick={() => navigateToView('home')}
          data-bp="banner"
          className="relative h-[18vh] sm:h-[22vh] w-full overflow-hidden cursor-pointer"
        >
          <img
            src={withBase('banner-light.jpg')}
            alt="Architectural Banner Light"
            className="w-full h-full object-cover object-center scale-105 blur-[1px] block dark:hidden"
          />
          <img
            src={withBase('banner-dark.jpg')}
            alt="Architectural Banner Dark"
            className="w-full h-full object-cover object-center scale-105 blur-[1px] hidden dark:block"
          />
          <BannerParticles />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/15 to-black/35" />
          <CurrentTime />
        </div>

        {/* In-Flow Full-Bleed Horizontal Blueprint Line 1 (Below Banner) */}
        <div className="relative w-full h-[1px] z-20">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[1px]"
            style={dashedX}
          />
          <div className="hidden md:block absolute left-0 top-0 w-[3px] h-[3px] -translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
          <div className="hidden md:block absolute right-0 top-0 w-[3px] h-[3px] translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
        </div>

        {/* Profile Bar — Dynamic height on mobile so it NEVER overlaps content below, 112px on sm+ */}
        <div data-bp="profile" className="relative min-h-[96px] sm:h-[112px] flex items-stretch">
          {/* Avatar Box — Full Color */}
          <div className="relative w-[88px] sm:w-[112px] shrink-0 p-[3px] flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                openLightbox(
                  withBase('images/ravael-profile.webp'),
                  'Muhammad Ravael Chessario Ramdoni',
                  lang === 'id'
                    ? 'S1 Teknologi Informasi — ITB Ahmad Dahlan Jakarta (IPK 3,77 / 4,00 · Cumlaude)'
                    : 'B.Sc. in Information Technology — ITB Ahmad Dahlan Jakarta (GPA 3.77 / 4.00 · Cumlaude)',
                )
              }
              data-bp="avatar"
              className="relative w-full aspect-square sm:h-full rounded-[10px] overflow-hidden block cursor-zoom-in border border-neutral-300 dark:border-neutral-700 bg-white"
            >
              <img
                src={withBase('images/ravael-profile.webp')}
                alt="Muhammad Ravael Chessario Ramdoni"
                className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
              />
            </button>
            <div
              className="absolute top-0 bottom-0 right-0 w-[1px] pointer-events-none"
              style={dashedY}
            />
          </div>

          {/* Right Header Controls + In-Flow Divider + Name & Location */}
          <div className="relative flex-1 flex flex-col justify-between min-w-0">
            {/* Top Action Row: Tagline + ID|EN + ⌘K + Theme Toggle */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-2 gap-y-1">
              <button
                type="button"
                onClick={() => navigateToView('home')}
                data-bp="tagline"
                className="order-2 sm:order-1 w-full sm:w-auto text-[10.5px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 leading-snug cursor-pointer text-left min-w-0 sm:flex-1"
              >
                {lang === 'id'
                  ? 'Seorang Data dan Tech Enthusiast yang suka vibe coding'
                  : 'A Data and Tech Enthusiast who loves vibe coding'}
              </button>

              <div data-bp="controls" className="order-1 sm:order-2 ml-auto sm:ml-0 flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* ID | EN Switcher */}
                <button
                  type="button"
                  onClick={toggleLang}
                  aria-label="Switch Language ID / EN"
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-500 transition cursor-pointer"
                >
                  <span
                    className={
                      lang === 'id' ? 'font-bold text-neutral-950 dark:text-white' : 'opacity-50'
                    }
                  >
                    ID
                  </span>
                  <span className="opacity-40">/</span>
                  <span
                    className={
                      lang === 'en' ? 'font-bold text-neutral-950 dark:text-white' : 'opacity-50'
                    }
                  >
                    EN
                  </span>
                </button>

                {/* ⌘K Command Menu Trigger */}
                <button
                  type="button"
                  onClick={() => setCmdOpen(true)}
                  aria-label="Open Command Menu"
                  className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-500 transition cursor-pointer"
                >
                  <span>⌘K</span>
                </button>

                {/* Dark / Light Theme Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="p-1 sm:p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-500 transition cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* In-Flow Horizontal Dashed Divider between Tagline and Name */}
            <div className="w-full h-[1px]" style={dashedX} />

            {/* Bottom Name + Location Row */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-x-2 gap-y-0.5 min-w-0">
              <h1
                onClick={() => navigateToView('home')}
                data-bp="title"
                className="text-[13.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-bold tracking-tight leading-snug cursor-pointer sm:whitespace-nowrap"
                style={{
                  textShadow:
                    '-0.4px 0 rgba(255,0,80,0.22), 0.4px 0 rgba(0,200,255,0.22)',
                }}
              >
                Muhammad Ravael Chessario Ramdoni
              </h1>

              <span data-bp="loc" className="text-[10.5px] sm:text-xs text-neutral-500 font-medium tracking-wide shrink-0">
                Tangerang, Indonesia
              </span>
            </div>
          </div>
        </div>

        {/* In-Flow Full-Bleed Horizontal Blueprint Line 2 (Below Profile Bar — Never Overlaps!) */}
        <div className="relative w-full h-[1px] z-20">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[1px]"
            style={dashedX}
          />
          <div className="hidden md:block absolute left-0 top-0 w-[3px] h-[3px] -translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
          <div className="hidden md:block absolute right-0 top-0 w-[3px] h-[3px] translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
        </div>

        {/* ====================================================================
           SUB-VIEWS OR MAIN HOME VIEW
           ==================================================================== */}
        {view === 'project-detail' && (
          <ProjectDetailView
            project={activeProject}
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
            onOpenLightbox={openLightbox}
          />
        )}

        {view === 'projects' && (
          <AllProjectsView
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
            onSelectProject={openProjectDetail}
          />
        )}

        {view === 'experience' && (
          <ExperienceTimelineView
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
            onOpenLightbox={openLightbox}
          />
        )}

        {view === 'highlights' && (
          <AllHighlightsView
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
            onOpenLightbox={openLightbox}
          />
        )}

        {view === 'anime' && (
          <AllAnimeMusicView
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
          />
        )}

        {view === 'contact' && (
          <ContactPageView
            lang={lang}
            withBase={withBase}
            onBack={() => navigateToView('home')}
          />
        )}

        {view === 'home' && (
          <>
            {/* INTRO BIO & SOCIAL PILLS */}
            <div className="pt-5 px-4 pb-6 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
              <p data-bp="bio">
                {lang === 'id' ? (
                  <>
                    Halo, saya{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">Ravael</strong>
                    , lulusan{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      S1 Teknologi Informasi ITB Ahmad Dahlan Jakarta
                    </strong>{' '}
                    (IPK{' '}
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      3,77 / 4,00
                    </span>{' '}
                    · <strong className="text-neutral-900 dark:text-neutral-100">Cumlaude</strong>
                    ). Saya senang menjembatani data mentah yang berantakan dengan keputusan yang harus diambil, berbekal{' '}
                    <span className="underline decoration-dotted">
                      Data Analytics, SQL, Python, Machine Learning, dan Dukungan Sistem TI
                    </span>
                    . Ringkasnya: data dirapikan, temuan dibuat jelas, keputusan jadi lebih yakin.
                  </>
                ) : (
                  <>
                    Hi, I'm{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">Ravael</strong>
                    , a{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      B.Sc. in Information Technology graduate from ITB Ahmad Dahlan Jakarta
                    </strong>{' '}
                    (GPA{' '}
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      3.77 / 4.00
                    </span>{' '}
                    · <strong className="text-neutral-900 dark:text-neutral-100">Cumlaude</strong>
                    ). I like bridging messy raw data and the decisions that depend on it, armed with{' '}
                    <span className="underline decoration-dotted">
                      Data Analytics, SQL, Python, Machine Learning, and IT Systems Support
                    </span>
                    . In short: clean the data, make the findings obvious, and make the decision easier to trust.
                  </>
                )}
              </p>

              <ul className="space-y-1.5 pl-4 list-disc">
                <li data-bp="bullet">
                  {lang === 'id' ? (
                    <>
                      Membedah{' '}
                      <button
                        type="button"
                        onClick={() => openProjectDetail('mobile-jkn')}
                        className="underline decoration-dotted font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                      >
                        63.766 ulasan aplikasi Mobile JKN
                      </button>{' '}
                      dari hulu ke hilir: pipeline NLP, model klasifikasi, sampai dashboard Streamlit interaktif. Dari 59.980 data berlabel seimbang, modelnya meraih akurasi uji{' '}
                      <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        94,38%
                      </span>{' '}
                      (F1-Score <span className="font-mono">94,86%</span>, ROC AUC{' '}
                      <span className="font-mono">0,965</span>) dan menunjukkan prioritas perbaikan yang jelas: login, OTP, dan verifikasi akun.
                    </>
                  ) : (
                    <>
                      Dissected{' '}
                      <button
                        type="button"
                        onClick={() => openProjectDetail('mobile-jkn')}
                        className="underline decoration-dotted font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                      >
                        63,766 Mobile JKN app reviews
                      </button>{' '}
                      end to end: an NLP pipeline, a classifier, and an interactive Streamlit dashboard. From 59,980 balanced labeled rows, the model reached{' '}
                      <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        94.38%
                      </span>{' '}
                      test accuracy (<span className="font-mono">94.86%</span> F1-Score,{' '}
                      <span className="font-mono">0.965</span> ROC AUC) and pointed to a clear fix list: login, OTP, and account verification.
                    </>
                  )}
                </li>
                <li data-bp="bullet">
                  {lang === 'id'
                    ? 'Mengasah fondasi lewat Data Analyst Bootcamp DSAREA (Predikat A, skor 85–100) dan Google IT Support Professional Certificate di Coursera (5 kursus spesialisasi), supaya paham datanya sekaligus sistem tempat data itu hidup.'
                    : 'Sharpened the fundamentals through the DSAREA Data Analyst Bootcamp (Grade A, score 85–100) and the 5-course Google IT Support Professional Certificate on Coursera, so I understand the data and the systems it lives in.'}
                </li>
                <li data-bp="bullet">
                  {lang === 'id'
                    ? 'Membangun website profil dan CMS berbasis MySQL untuk PAUD KB Flamboyan saat magang (administrasi sekolah hingga 50% lebih efisien), lalu menginisiasi program literasi digital untuk siswa SD pada KKN Digimapan.'
                    : 'Built a MySQL-backed website and CMS for PAUD KB Flamboyan during my internship (up to 50% more efficient school administration), then started a digital literacy program for elementary students during KKN Digimapan.'}
                </li>
              </ul>

              <p data-bp="open">{pick(blueprintProfileMeta.openSentence, lang)}</p>

              {/* CTA Buttons: FlipCoverButton + SoftPillButton */}
              <div data-bp="cta" className="pt-2 flex flex-wrap items-center gap-3">
                <FlipCoverButton
                  label={
                    lang === 'id'
                      ? 'Lihat Studi Kasus Mobile JKN'
                      : 'Explore Mobile JKN Case Study'
                  }
                  coverLabel={
                    lang === 'id'
                      ? '5 Layar Dashboard + Metrik ↗'
                      : '5 Dashboard Slides + Metrics ↗'
                  }
                  onClick={() => openProjectDetail('mobile-jkn')}
                />
                <SoftPillButton onClick={() => navigateToView('contact')}>
                  {lang === 'id' ? 'Hubungi Saya' : 'Get in Touch'}
                </SoftPillButton>
              </div>

              {/* Social & CV Pills */}
              <div className="pt-4">
                <p className="mb-2 text-xs text-neutral-500">
                  {lang === 'id'
                    ? 'Cari saya di sini, atau langsung ambil CV-nya:'
                    : 'Find me here, or grab my résumé:'}
                </p>

                <div data-bp="pills" className="flex flex-wrap gap-2">
                  <a
                    href="https://www.linkedin.com/in/muhammad-ravael-chessario-ramdoni-47b37728b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 transition"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>

                  <a
                    href="mailto:ravaelchessario@gmail.com"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    ravaelchessario@gmail.com
                  </a>

                  <a
                    href="https://maps.google.com/?q=Tangerang,Indonesia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 transition"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Tangerang, ID
                  </a>

                  <a
                    href={withBase('files/CV_Muhammad_Ravael_Chessario_Ramdoni.pdf')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {lang === 'id' ? 'Unduh CV (PDF)' : 'Résumé (PDF)'}
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               1. EXPERIENCES SECTION
               ================================================================ */}
            <section id="experience" className="w-full py-2 scroll-mt-16">
              <div className="px-4">
                <h2 data-bp="section" className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Pengalaman' : 'Experience'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Dua pengalaman, dua dunia berbeda: merancang sistem basis data di balik layar, lalu memfasilitasi literasi digital langsung di desa.'
                    : 'Two experiences, two different worlds: designing a database-backed system behind the screen, then facilitating digital literacy right in the village.'}
                </p>

                <div className="mt-4 space-y-4">
                  {blueprintExperiences.map((exp, index) => {
                    const isOpen = openExpIndex === index;
                    return (
                      <div
                        key={exp.id}
                        data-bp={index === 0 ? 'card' : undefined}
                        onClick={() => setOpenExpIndex(isOpen ? null : index)}
                        className="p-3.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 transition hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex gap-3">
                            <img
                              src={withBase(exp.src)}
                              alt={exp.title}
                              className={`w-11 h-11 rounded-md border border-neutral-300 dark:border-neutral-700 shrink-0 ${
                                exp.imageFit === 'contain'
                                  ? 'object-contain p-1 bg-neutral-100 dark:bg-neutral-900'
                                  : 'object-cover bg-white'
                              }`}
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                  {exp.title}
                                </h3>
                                <span className="text-[11px] font-mono px-2 py-[2px] rounded border border-dashed border-neutral-400/40 text-neutral-600 dark:text-neutral-400">
                                  {pick(exp.type, lang)}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {pick(exp.role, lang)}
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-xs text-neutral-500">
                            <div className="flex items-center gap-1 font-mono">
                              <span>{pick(exp.dates, lang)}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                            <p className="text-[11px]">{pick(exp.location, lang)}</p>
                          </div>
                        </div>

                        {/* Expandable Details + Photo Thumbnails */}
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? 'grid-rows-[1fr] opacity-100 mt-3'
                              : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pl-4 list-disc">
                              {exp.points[lang].map((point, i) => (
                                <li key={i} className="leading-relaxed">
                                  <PointText text={point} />
                                </li>
                              ))}
                            </ul>

                            {exp.photos && exp.photos.length > 0 && (
                              <div
                                className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {exp.photos.slice(0, 4).map((photo) => (
                                  <button
                                    key={photo.src}
                                    type="button"
                                    onClick={() =>
                                      openLightbox(
                                        withBase(photo.src),
                                        `${exp.title} — ${pick(exp.role, lang)}`,
                                        pick(photo.caption, lang),
                                      )
                                    }
                                    className="group relative aspect-[16/10] rounded-md overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-zoom-in"
                                  >
                                    <img
                                      src={withBase(photo.src)}
                                      alt={pick(photo.caption, lang)}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {exp.tech.map((t, idx) => {
                                const label = pick(t, lang);
                                return (
                                  <span
                                    key={`${label}-${idx}`}
                                    className="text-[11px] font-mono px-2 py-[2px] rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  <SoftPillButton onClick={() => navigateToView('experience')}>
                    {lang === 'id' ? 'Lihat Dokumentasi Lengkap' : 'View Full Timeline'}
                  </SoftPillButton>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               2. PROJECTS SECTION (2-column blueprint cards)
               ================================================================ */}
            <section id="projects" className="w-full py-2 scroll-mt-16">
              <div className="px-4 pb-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Proyek Pilihan' : 'Featured Projects'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Proyek yang saya kerjakan dari data mentah sampai dashboard, lengkap dengan tangkapan layar, metrik evaluasi, dan cerita di balik implementasinya.'
                    : 'Projects I take from raw data all the way to a dashboard, with screenshots, evaluation metrics, and the story behind the implementation.'}
                </p>
              </div>

              <div className="relative">
                <div className="w-full h-[1px]" style={dashedX} />
                <div
                  className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none z-10"
                  style={dashedY}
                />

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {blueprintProjects.map((project, index) => {
                    const isComingSoon = Boolean(project.isComingSoon);
                    return (
                      <div
                        key={project.slug}
                        onClick={() => {
                          if (!isComingSoon) openProjectDetail(project.slug);
                        }}
                        className={`group p-4 transition-colors duration-300 hover:bg-neutral-100/40 dark:hover:bg-neutral-900/30 relative ${
                          isComingSoon ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        {/* Framed Preview Container */}
                        <div className="relative aspect-[15/10] w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 p-1.5 bg-neutral-100/60 dark:bg-neutral-900/40">
                          {isComingSoon ? (
                            <div
                              className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center p-4 text-center"
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(-45deg, rgba(120,120,120,0.12) 0px, rgba(120,120,120,0.12) 1px, transparent 1px, transparent 8px)',
                              }}
                            >
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold">
                                Coming Soon
                              </span>
                              <p className="mt-2.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                                {lang === 'id'
                                  ? 'Sedang dalam tahap riset & eksplorasi data'
                                  : 'In research & dataset exploration phase'}
                              </p>
                            </div>
                          ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950">
                              <img
                                src={withBase(
                                  index % 2 === 0 ? 'banner-dark.jpg' : 'banner-light.jpg',
                                )}
                                alt=""
                                className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              />
                              <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 group-hover:bg-black/25 transition-colors duration-300" />

                              {/* Slide Count Pill */}
                              <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/75 text-white backdrop-blur-sm">
                                {project.gallery.length}{' '}
                                {lang === 'id' ? 'Tangkapan Layar' : 'Screenshots'}
                              </span>

                              {/* Floating Bottom Screenshot Card */}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[84%] h-[80%] rounded-t-xl overflow-hidden shadow-2xl border border-white/15 transition-all duration-500 group-hover:scale-[1.03]">
                                <img
                                  src={withBase(project.src)}
                                  alt={pick(project.title, lang)}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Title + Action Icons */}
                        <div className="mt-3 px-1 flex items-start justify-between gap-2">
                          <h3
                            className={`text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug ${
                              isComingSoon ? '' : 'group-hover:underline'
                            }`}
                          >
                            {pick(project.title, lang)}
                          </h3>

                          {!isComingSoon && (
                            <div
                              className="flex items-center gap-2 text-neutral-500 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.live && (
                                <a
                                  href={project.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={lang === 'id' ? 'Buka Live Demo' : 'Open Live Demo'}
                                  className="hover:text-neutral-900 dark:hover:text-white transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                          )}
                        </div>

                        {/* Short Description */}
                        <p className="mt-1 px-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {pick(project.description, lang)}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="mt-2.5 px-1 flex flex-wrap gap-1">
                          {project.tech.slice(0, 4).map((t) => {
                            const Icon = iconMap[t];
                            return (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800/90 text-neutral-600 dark:text-neutral-300 border border-neutral-300/60 dark:border-neutral-700"
                              >
                                {Icon && <Icon className="w-3 h-3" />}
                                {techNames[t] || t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full h-[1px]" style={dashedX} />
              </div>

              <div className="mt-6 flex justify-center">
                <SoftPillButton onClick={() => navigateToView('projects')}>
                  {lang === 'id' ? 'Lihat Semua Proyek' : 'View All Projects'}
                </SoftPillButton>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               3. SKILLS & TECHNOLOGIES SECTION
               ================================================================ */}
            <section id="skills" className="w-full py-2 scroll-mt-16">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Keahlian & Teknologi' : 'Skills & Technologies'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Perangkat yang saya pakai untuk membersihkan, menganalisis, dan memodelkan data di proyek-proyek di atas.'
                    : 'The tools I use to clean, analyze, and model data across the projects above.'}
                </p>

                <div className="mt-4 space-y-4">
                  {blueprintSkillGroups.map((grp, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        {pick(grp.group, lang)}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {grp.skills.map((skill) => {
                          const IconComp = skill.icon;
                          return (
                            <div
                              key={skill.name}
                              className="flex items-center gap-2 px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition"
                            >
                              <IconComp className="w-3.5 h-3.5 shrink-0 text-neutral-700 dark:text-neutral-300" />
                              <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                                {skill.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               4. EDUCATION & CERTIFICATIONS SECTION (Text Credentials — Images in Highlights)
               ================================================================ */}
            <section id="education" className="w-full py-2 scroll-mt-16">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Pendidikan & Sertifikasi' : 'Education & Certifications'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Fondasi akademik S1 Teknologi Informasi, ditambah sertifikasi pelatihan yang saya selesaikan di luar kelas.'
                    : 'My academic foundation in Information Technology, plus the training certifications I completed outside the classroom.'}
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Card: Education */}
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {lang === 'id' ? 'Pendidikan Tinggi' : 'Higher Education'}
                        </h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          Cumlaude
                        </span>
                      </div>

                      <div className="mt-3 flex items-start gap-3">
                        <img
                          src={withBase('images/itb-ad-logo.webp')}
                          alt="ITB Ahmad Dahlan Jakarta"
                          className="w-10 h-10 rounded-md object-contain border border-neutral-300 dark:border-neutral-700 p-1 bg-white shrink-0"
                        />
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                            Institut Teknologi dan Bisnis Ahmad Dahlan Jakarta
                          </p>
                          <p>
                            {lang === 'id'
                              ? 'Sarjana Komputer (S.Kom) — S1 Teknologi Informasi'
                              : 'Bachelor of Information Technology (B.Sc. IT)'}
                          </p>
                          <p className="text-neutral-500 font-mono">2022 – 2026</p>
                          <p className="text-neutral-500">
                            {lang === 'id' ? 'IPK:' : 'GPA:'}{' '}
                            <span className="text-neutral-900 dark:text-neutral-100 font-mono font-bold">
                              {lang === 'id' ? '3,77 / 4,00' : '3.77 / 4.00'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        {lang === 'id' ? 'Mata Kuliah Relevan' : 'Relevant Coursework'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {blueprintCoursework.map((course) => {
                          const label = pick(course, lang);
                          return (
                            <span
                              key={label}
                              className="px-2 py-1 text-[11px] rounded-md bg-neutral-100 dark:bg-neutral-800/80 border border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Card: Strictly 2 Professional Certifications (Text Only — No Duplicate Cert Image) */}
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {lang === 'id' ? 'Sertifikasi Pelatihan' : 'Training Certifications'}
                    </h3>

                    <div className="mt-3 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                      {blueprintCertifications.map((cert, idx) => (
                        <div
                          key={cert.id}
                          className={
                            idx === 0
                              ? 'pb-3 border-b border-dashed border-neutral-200 dark:border-neutral-800'
                              : ''
                          }
                        >
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                            {cert.title}
                          </p>
                          <p className="text-neutral-500 mt-0.5">
                            {pick(cert.period, lang)} · {pick(cert.detail, lang)}
                          </p>
                          {cert.credentialId && (
                            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                              ID: {cert.credentialId}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               5. HIGHLIGHTS SECTION (Strictly 2 Training Certifications)
               ================================================================ */}
            <section id="highlights" className="w-full py-2 scroll-mt-16">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Highlights</h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Dua sertifikasi pelatihan yang sudah saya tuntaskan, lengkap dengan sertifikat aslinya.'
                    : 'Two training certifications I have completed, shown with the original certificates.'}
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {blueprintHighlights.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        openLightbox(withBase(item.image), pick(item.title, lang), item.badge)
                      }
                      className="group relative aspect-[16/11] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 cursor-zoom-in bg-neutral-100 dark:bg-neutral-900"
                    >
                      <img
                        src={withBase(item.image)}
                        alt={pick(item.title, lang)}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-black/75 text-white backdrop-blur-sm">
                        {item.badge}
                      </span>
                      <div className="absolute bottom-3 left-3.5 right-3.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                          {pick(item.title, lang)}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               6. TENTANG DIRIKU SECTION (#movies — Films + Interactive 3D Bookshelf + Music)
               ================================================================ */}
            <section id="movies" className="w-full py-2 scroll-mt-16">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Tentang Diriku' : 'Beyond the Data'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Di luar spreadsheet, inilah yang menemani saya: film yang rela saya tonton ulang, buku yang saya baca berkali-kali, dan lagu yang mengiringi sesi vibe coding.'
                    : 'Outside the spreadsheets, this is what keeps me company: films I will happily rewatch, books I keep rereading, and songs behind my vibe-coding sessions.'}
                </p>

                {/* 1. Movies Poster Grid (Top) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {lang === 'id' ? 'Film & Serial Favorit' : 'Favorite Films & Series'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAllMovies((prev) => !prev)}
                      className="text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline decoration-dotted cursor-pointer"
                    >
                      {showAllMovies
                        ? lang === 'id'
                          ? 'Ringkas (8 Film)'
                          : 'Show 8'
                        : lang === 'id'
                          ? `Tampilkan Semua (${animeWithCovers.length})`
                          : `Show All (${animeWithCovers.length})`}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {displayedMovies.map((movie) => (
                      <div
                        key={movie.title}
                        onClick={() => navigateToView('anime')}
                        className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 cursor-pointer bg-neutral-900"
                      >
                        <img
                          src={withBase((movie.cover || '').replace(/^\//, ''))}
                          alt={movie.title}
                          className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        {movie.year && (
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/90 backdrop-blur-sm">
                            {movie.year}
                          </span>
                        )}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5">
                          <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                            {movie.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive 3D Bookshelf (Middle — Between Movies and Music) */}
                <Bookshelf3D lang={lang} withBase={withBase} />

                {/* 3. Music Rotation + Playable Spotify Embed (Bottom) */}
                <div className="mt-7">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {lang === 'id' ? 'Musik & Rotasi Spotify' : 'Music & Spotify Rotation'}
                    </h3>
                    <span className="text-[11px] text-neutral-400">
                      {nowPlaying.title} — {nowPlaying.artist}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {musicScenes.map((s) => (
                        <span
                          key={s.scene}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded border border-dashed border-neutral-400/50 text-neutral-600 dark:text-neutral-300"
                        >
                          {s.scene}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 items-center">
                      {visibleArtists.map((artist) => (
                        <span
                          key={artist}
                          className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                        >
                          {artist}
                        </span>
                      ))}
                      {allArtists.length > featuredArtists.length && (
                        <button
                          type="button"
                          onClick={() => setShowAllMusicArtists((prev) => !prev)}
                          className="text-xs px-2.5 py-1 rounded-md border border-dashed border-neutral-400/60 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
                        >
                          {showAllMusicArtists
                            ? lang === 'id'
                              ? 'Sembunyikan'
                              : 'Show less'
                            : `+${allArtists.length - featuredArtists.length} ${
                                lang === 'id' ? 'artis lainnya' : 'more artists'
                              }`}
                        </button>
                      )}
                    </div>

                    <div className="pt-1">
                      <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800">
                        <iframe
                          src={spotifyEmbedUrl}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={`${nowPlaying.title} — ${nowPlaying.artist}`}
                          className="block border-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <SoftPillButton onClick={() => navigateToView('anime')}>
                    {lang === 'id'
                      ? 'Lihat Detail Film, Buku & Album'
                      : 'Explore Films, Books & Albums'}
                  </SoftPillButton>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               7. CLOSING QUERY SECTION (Replaces W. Edwards Deming Quote)
               ================================================================ */}
            <ClosingQuery lang={lang} />
          </>
        )}

        <div className="w-full h-[1px] mt-4" style={dashedX} />

        {/* Interactive Dot-Matrix Footer */}
        <FooterBackground>
          <footer className="w-full py-10 px-4 text-xs text-neutral-500">
            <div className="flex flex-col items-center text-center space-y-2.5">
              <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                {lang === 'id'
                  ? 'Dirancang & dikembangkan oleh Muhammad Ravael Chessario Ramdoni'
                  : 'Designed & built by Muhammad Ravael Chessario Ramdoni'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => navigateToView('home')}
                  className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  {lang === 'id' ? 'Beranda' : 'Home'}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => navigateToView('projects')}
                  className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  {lang === 'id' ? 'Proyek' : 'Projects'}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => navigateToView('highlights')}
                  className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Highlights
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => navigateToView('anime')}
                  className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  {lang === 'id' ? 'Tentang Diriku' : 'Beyond the Data'}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => navigateToView('contact')}
                  className="hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  {lang === 'id' ? 'Kontak' : 'Contact'}
                </button>
              </div>

              <p className="text-[11px] text-neutral-400">
                © {new Date().getFullYear()} Muhammad Ravael Chessario Ramdoni. All rights reserved.
              </p>
            </div>
          </footer>
        </FooterBackground>
      </div>

      {/* Command Menu Modal (⌘K) */}
      <CommandMenuModal
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        lang={lang}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
        onNavigateView={navigateToView}
        onScrollToSection={scrollToSection}
        onSelectProject={openProjectDetail}
        withBase={withBase}
      />

      {/* Lightbox Modal for Certificates, Project Dashboards & Photos */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="max-w-4xl w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {lightbox.title}
                </h3>
                {lightbox.caption && (
                  <p className="text-xs text-neutral-500 truncate">{lightbox.caption}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center max-h-[78vh] overflow-auto">
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-w-full max-h-[72vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
