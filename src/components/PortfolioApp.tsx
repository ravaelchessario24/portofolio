import React, { useState, useEffect, useCallback } from 'react';
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
  ZoomIn,
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import {
  dashedX,
  dashedY,
  BannerParticles,
  CurrentTime,
  FooterBackground,
  SoftPillButton,
  FlipCoverButton,
} from './blueprint/BlueprintHelpers';
import {
  type Lang,
  blueprintExperiences,
  blueprintProjects,
  blueprintSkillGroups,
  blueprintHighlights,
  animeWithCovers,
  musicScenes,
  featuredArtists,
  allArtists,
  nowPlaying,
  techNames,
  iconMap,
  pick,
} from './blueprint/blueprintData';
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
  { label: { id: 'Anime & Musik', en: 'Anime & Music' }, href: 'anime' },
];

export default function PortfolioApp({ baseUrl = '/' }: PortfolioAppProps) {
  const [lang, setLang] = useState<Lang>('id');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [view, setView] = useState<BlueprintView>('home');
  const [activeProjectSlug, setActiveProjectSlug] = useState<string>('mobile-jkn');
  const [openExpIndex, setOpenExpIndex] = useState<number | null>(0);
  const [showAllMusicArtists, setShowAllMusicArtists] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{
    src: string;
    title: string;
    caption?: string;
  } | null>(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openProjectDetail = useCallback((slug: string) => {
    setActiveProjectSlug(slug);
    setView('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  }, []);

  const openLightbox = useCallback((src: string, title: string, caption?: string) => {
    setLightbox({ src, title, caption });
  }, []);

  const activeProject =
    blueprintProjects.find((p) => p.slug === activeProjectSlug) || blueprintProjects[0];

  const featuredAnime = animeWithCovers.slice(0, 8);
  const visibleArtists = showAllMusicArtists ? allArtists : featuredArtists;
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${nowPlaying.trackId}?utm_source=generator&theme=0`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Right Fixed Blueprint Index Navbar */}
      <nav
        aria-label="Blueprint Section Index"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
      >
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.href}
            type="button"
            onClick={() => scrollToSection(item.href)}
            className="flex items-center gap-2.5 group py-1 cursor-pointer bg-transparent border-0"
            onMouseEnter={() => setHoveredNav(i)}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <span
              className={`text-xs font-mono transition-all duration-200 ${
                hoveredNav === i
                  ? 'opacity-100 translate-x-0 text-neutral-800 dark:text-neutral-200'
                  : 'opacity-0 translate-x-2 pointer-events-none text-neutral-500'
              }`}
            >
              {pick(item.label, lang)}
            </span>
            <span
              className={`block rounded-full transition-all duration-200 ${
                hoveredNav === i
                  ? 'w-5 h-[2px] bg-neutral-800 dark:bg-neutral-200'
                  : 'w-3 h-[1.5px] bg-neutral-400/70 dark:bg-neutral-500/70'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Architectural Micro-Dotted Vertical Lines */}
      <div
        className="absolute top-0 bottom-0 left-3 md:left-[18%] xl:left-[26%] w-[1px]"
        style={dashedY}
      />
      <div
        className="absolute top-0 bottom-0 right-3 md:right-[18%] xl:right-[26%] w-[1px]"
        style={dashedY}
      />

      {/* Horizontal Blueprint Lines */}
      <div className="absolute left-0 right-0 top-[22vh] h-[1px] z-20" style={dashedX} />
      <div
        className="absolute left-0 right-0 top-[calc(22vh+112px)] h-[1px] z-20"
        style={dashedX}
      />

      {/* Intersection Nodes (3px × 3px) */}
      <div className="hidden md:block absolute left-[18%] xl:left-[26%] top-[22vh] w-[3px] h-[3px] -translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
      <div className="hidden md:block absolute right-[18%] xl:right-[26%] top-[22vh] w-[3px] h-[3px] translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
      <div className="hidden md:block absolute left-[18%] xl:left-[26%] top-[calc(22vh+112px)] w-[3px] h-[3px] -translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />
      <div className="hidden md:block absolute right-[18%] xl:right-[26%] top-[calc(22vh+112px)] w-[3px] h-[3px] translate-x-[1px] -translate-y-[1px] bg-neutral-500/50 z-30" />

      {/* Center Architectural Column */}
      <div className="mx-3 md:mx-[18%] xl:mx-[26%]">
        {/* 22vh Top Banner with Particles & Dot-Matrix Clock */}
        <div
          onClick={() => navigateToView('home')}
          className="relative h-[22vh] w-full overflow-hidden cursor-pointer"
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

        {/* 112px Profile Bar */}
        <div className="relative h-[112px] flex">
          {/* Avatar Box */}
          <div className="relative h-full aspect-square shrink-0 p-[3px]">
            <button
              type="button"
              onClick={() =>
                openLightbox(
                  withBase('images/ravael-hero.webp'),
                  'Muhammad Ravael Chessario Ramdoni',
                  lang === 'id'
                    ? 'S1 Teknologi Informasi — ITB Ahmad Dahlan Jakarta (IPK 3,77 / 4,00)'
                    : 'B.Sc. in Information Technology — ITB Ahmad Dahlan Jakarta (GPA 3.77 / 4.00)',
                )
              }
              className="relative w-full h-full rounded-[10px] overflow-hidden block cursor-zoom-in border border-neutral-300 dark:border-neutral-700"
            >
              <img
                src={withBase('images/ravael-square.webp')}
                alt="Muhammad Ravael Chessario Ramdoni"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500 ease-in-out"
              />
            </button>
            <div
              className="absolute top-0 bottom-0 right-0 w-[1px] pointer-events-none"
              style={dashedY}
            />
          </div>

          {/* Right Header Controls + Name & Location */}
          <div className="relative flex-1 flex flex-col justify-between px-3 sm:px-4 py-2 min-w-0">
            <div className="absolute left-0 right-0 top-[42%] h-[1px]" style={dashedX} />

            {/* Top Action Row: ID|EN + ⌘K + Theme Toggle */}
            <div className="flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => navigateToView('home')}
                className="text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 truncate cursor-pointer"
              >
                ravaelchessario24.github.io
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* ID | EN Switcher */}
                <button
                  type="button"
                  onClick={toggleLang}
                  aria-label="Switch Language ID / EN"
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-500 transition cursor-pointer"
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
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-500 transition cursor-pointer"
                >
                  <span>⌘K</span>
                </button>

                {/* Dark / Light Theme Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-500 transition cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bottom Name + Location Row */}
            <div className="pt-1 flex flex-wrap justify-between items-end gap-x-3 gap-y-0.5 min-w-0">
              <h1
                onClick={() => navigateToView('home')}
                className="text-base sm:text-xl md:text-2xl font-bold tracking-tight leading-tight truncate cursor-pointer"
                style={{
                  textShadow:
                    '-0.4px 0 rgba(255,0,80,0.22), 0.4px 0 rgba(0,200,255,0.22)',
                }}
              >
                Muhammad Ravael Chessario Ramdoni
              </h1>

              <span className="text-[11px] sm:text-xs text-neutral-500 font-medium tracking-wide shrink-0">
                Tangerang, Indonesia
              </span>
            </div>
          </div>
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
              <p>
                {lang === 'id' ? (
                  <>
                    Lulusan baru{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      S1 Teknologi Informasi ITB Ahmad Dahlan Jakarta
                    </strong>{' '}
                    (IPK{' '}
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      3,77 / 4,00
                    </span>{' '}
                    — Peringkat 4 dari 21 lulusan) dengan fokus pada{' '}
                    <span className="underline decoration-dotted">
                      Data Analytics, Data Cleaning, SQL, Python, dan Machine Learning
                    </span>
                    . Terbiasa mengolah dataset skala puluhan ribu baris menjadi visualisasi dan wawasan bisnis yang mudah dipahami.
                  </>
                ) : (
                  <>
                    Fresh graduate in{' '}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      Information Technology from ITB Ahmad Dahlan Jakarta
                    </strong>{' '}
                    (GPA{' '}
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      3.77 / 4.00
                    </span>{' '}
                    — Ranked 4th out of 21 graduates) specializing in{' '}
                    <span className="underline decoration-dotted">
                      Data Analytics, Data Cleaning, SQL, Python, and Machine Learning
                    </span>
                    . Experienced in transforming tens of thousands of raw records into actionable dashboards.
                  </>
                )}
              </p>

              <ul className="space-y-1 pl-4 list-disc">
                <li>
                  {lang === 'id' ? (
                    <>
                      Membangun pipeline NLP & dashboard interaktif untuk{' '}
                      <button
                        type="button"
                        onClick={() => openProjectDetail('mobile-jkn')}
                        className="underline decoration-dotted font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                      >
                        63.766 ulasan aplikasi Mobile JKN
                      </button>{' '}
                      (59.980 data berlabel, Akurasi <span className="font-mono">94,38%</span>, F1-Score{' '}
                      <span className="font-mono">94,86%</span>, ROC AUC{' '}
                      <span className="font-mono">0,965</span>).
                    </>
                  ) : (
                    <>
                      Built an end-to-end NLP pipeline & interactive dashboard for{' '}
                      <button
                        type="button"
                        onClick={() => openProjectDetail('mobile-jkn')}
                        className="underline decoration-dotted font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                      >
                        63,766 Mobile JKN app reviews
                      </button>{' '}
                      (59,980 labeled rows, <span className="font-mono">94.38%</span> Accuracy,{' '}
                      <span className="font-mono">94.86%</span> F1-Score,{' '}
                      <span className="font-mono">0.965</span> ROC AUC).
                    </>
                  )}
                </li>
                <li>
                  {lang === 'id'
                    ? 'Meraih Predikat A (Grade A) pada Data Analyst Bootcamp DSAREA serta menyelesaikan Google IT Support Professional Certificate (Coursera).'
                    : 'Achieved Grade A at DSAREA Data Analyst Bootcamp and completed the Google IT Support Professional Certificate (Coursera).'}
                </li>
                <li>
                  {lang === 'id'
                    ? 'Mengembangkan Website & CMS PAUD KB Flamboyan (+50% efisiensi administrasi) serta menginisiasi program literasi digital pada KKN Digimapan.'
                    : 'Engineered PAUD KB Flamboyan school website & CMS (+50% admin efficiency) and led youth digital literacy sessions during KKN Digimapan.'}
                </li>
              </ul>

              <p>
                {lang === 'id'
                  ? 'Saat ini terbuka untuk posisi Full-Time maupun Internship di bidang Data Analyst, Business Intelligence, atau Data Science.'
                  : 'Currently open to Full-Time and Internship opportunities in Data Analytics, Business Intelligence, or Data Science.'}
              </p>

              {/* CTA Buttons: FlipCoverButton + SoftPillButton */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
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
                    ? 'Tautan langsung profil profesional & dokumen CV:'
                    : 'Direct professional links & Curriculum Vitae:'}
                </p>

                <div className="flex flex-wrap gap-2">
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
                    href="mailto:ravaelramdoni@gmail.com"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/60 transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    ravaelramdoni@gmail.com
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
                    href={withBase('CV_Muhammad_Ravael_Chessario_Ramdoni.pdf')}
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
               1. EXPERIENCES SECTION (ExperienceList.tsx)
               ================================================================ */}
            <section id="experience" className="w-full py-2">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Pengalaman' : 'Experiences'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Pengalaman magang pengembangan sistem dan pengabdian masyarakat.'
                    : 'Web systems development internship and community digital literacy leadership.'}
                </p>

                <div className="mt-4 space-y-4">
                  {blueprintExperiences.map((exp, index) => {
                    const isOpen = openExpIndex === index;
                    return (
                      <div
                        key={exp.id}
                        onClick={() => setOpenExpIndex(isOpen ? null : index)}
                        className="p-3.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 transition hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex gap-3">
                            <img
                              src={withBase(exp.src)}
                              alt={exp.title}
                              className="w-11 h-11 rounded-md object-cover border border-neutral-300 dark:border-neutral-700 shrink-0 bg-white"
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
                                  {point}
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
                              {exp.tech.map((t) => (
                                <span
                                  key={t}
                                  className="text-[11px] font-mono px-2 py-[2px] rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  <SoftPillButton onClick={() => navigateToView('experience')}>
                    {lang === 'id' ? 'Lihat Semua Pengalaman' : 'View All'}
                  </SoftPillButton>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               2. PROJECTS SECTION (ProjectsGrid.tsx exact 2-column blueprint cards)
               ================================================================ */}
            <section id="projects" className="w-full py-2">
              <div className="px-4 pb-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Proyek Pilihan' : 'Projects'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Klik kartu proyek untuk melihat 5 tangkapan layar dashboard, metrik model, dan studi kasus lengkap.'
                    : 'Click any project card to view all 5 dashboard screenshots, model metrics, and full case study.'}
                </p>
              </div>

              <div className="relative">
                <div className="w-full h-[1px]" style={dashedX} />
                <div
                  className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none z-10"
                  style={dashedY}
                />

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {blueprintProjects.map((project, index) => (
                    <div
                      key={project.slug}
                      onClick={() => openProjectDetail(project.slug)}
                      className="group p-4 transition-colors duration-300 hover:bg-neutral-100/40 dark:hover:bg-neutral-900/30 cursor-pointer relative"
                    >
                      {/* Framed Preview Container with Floating Bottom Screenshot */}
                      <div className="relative aspect-[15/10] w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 p-1.5 bg-neutral-100/60 dark:bg-neutral-900/40">
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
                      </div>

                      {/* Title + Action Icons */}
                      <div className="mt-3 px-1 flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:underline">
                          {pick(project.title, lang)}
                        </h3>

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
                  ))}
                </div>

                <div className="w-full h-[1px]" style={dashedX} />
              </div>

              <div className="mt-6 flex justify-center">
                <SoftPillButton onClick={() => navigateToView('projects')}>
                  {lang === 'id' ? 'Lihat Semua Proyek' : 'View All'}
                </SoftPillButton>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               3. SKILLS & TECHNOLOGIES SECTION
               ================================================================ */}
            <section id="skills" className="w-full py-2">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Keahlian & Teknologi' : 'Skills & Technologies'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Instrumen analitik, bahasa pemrograman, dan perangkat lunak yang saya gunakan.'
                    : 'Analytical instruments, programming languages, and tools I work with.'}
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
               4. EDUCATION & CERTIFICATIONS SECTION (Education.tsx)
               ================================================================ */}
            <section id="education" className="w-full py-2">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Pendidikan & Sertifikasi' : 'Education & Certifications'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Latar belakang akademik dan sertifikasi kompetensi profesional.'
                    : 'Academic background and verified professional certifications.'}
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Card: Education */}
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {lang === 'id' ? 'Pendidikan Tinggi' : 'Education'}
                        </h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          {lang === 'id' ? 'Peringkat 4 / 21' : 'Rank 4 / 21'}
                        </span>
                      </div>

                      <div className="mt-3 flex items-start gap-3">
                        <img
                          src={withBase('images/itb-ad-logo.svg')}
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
                              3.77 / 4.00
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 leading-relaxed">
                      {lang === 'id'
                        ? 'Fokus riset tugas akhir: Klasifikasi Sentimen Ulasan Aplikasi Mobile JKN Menggunakan TF-IDF & Multinomial Naive Bayes (63.766 ulasan).'
                        : 'Undergraduate thesis focus: Sentiment Classification of Mobile JKN App Reviews using TF-IDF & Multinomial Naive Bayes (63,766 reviews).'}
                    </p>
                  </div>

                  {/* Right Card: Certifications */}
                  <div className="p-4 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {lang === 'id' ? 'Sertifikasi Kompetensi' : 'Certifications'}
                    </h3>

                    <div className="mt-3 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                      {/* Cert 1: DSAREA */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-dashed border-neutral-200 dark:border-neutral-800">
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            Data Analyst Bootcamp — DSAREA
                          </p>
                          <p className="text-neutral-500 mt-0.5">
                            {lang === 'id'
                              ? 'Oktober – November 2025 · Predikat A (Grade A)'
                              : 'October – November 2025 · Grade A'}
                          </p>
                          <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            ID: 043/DSAREA/XI/2025
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openLightbox(
                              withBase('images/certs/cert-dsarea.webp'),
                              'Data Analyst Bootcamp — DSAREA (Grade A)',
                              'Certificate ID: 043/DSAREA/XI/2025 · Issued November 2025',
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 text-[11px] font-mono shrink-0 cursor-pointer"
                        >
                          <ZoomIn className="w-3 h-3" />
                          {lang === 'id' ? 'Sertifikat' : 'Verify'}
                        </button>
                      </div>

                      {/* Cert 2: Google IT Support Coursera */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            Google IT Support Professional Certificate
                          </p>
                          <p className="text-neutral-500 mt-0.5">
                            Coursera · {lang === 'id' ? 'Januari – Maret 2025' : 'Jan – Mar 2025'}
                          </p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            5-Course Google Career Certificate
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openLightbox(
                              withBase('images/certs/cert-coursera.webp'),
                              'Google IT Support Professional Certificate — Coursera',
                              'Issued March 2025 · Google Career Certificates',
                            )
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 text-[11px] font-mono shrink-0 cursor-pointer"
                        >
                          <ZoomIn className="w-3 h-3" />
                          {lang === 'id' ? 'Sertifikat' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               5. HIGHLIGHTS SECTION (Highlights.tsx auto-scrolling marquee)
               ================================================================ */}
            <section id="highlights" className="w-full py-2">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Highlights</h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Sorotan bukti visual: sertifikat kompetensi, metrik riset Mobile JKN, dan dokumentasi lapangan KKN Digimapan.'
                    : 'Visual proof highlights: certificates, Mobile JKN research evaluations, and KKN Digimapan field documentation.'}
                </p>

                <div className="mt-5 relative overflow-hidden">
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

                  <div className="flex gap-4 w-max highlights-track">
                    {[...blueprintHighlights, ...blueprintHighlights].map((item, i) => (
                      <div
                        key={`${item.id}-${i}`}
                        onClick={() =>
                          openLightbox(withBase(item.image), pick(item.title, lang), item.badge)
                        }
                        className="group relative w-[240px] h-[270px] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shrink-0 cursor-zoom-in"
                      >
                        <img
                          src={withBase(item.image)}
                          alt={pick(item.title, lang)}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-black/70 text-white backdrop-blur-sm">
                          {item.badge}
                        </span>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-xs font-semibold text-white leading-snug">
                            {pick(item.title, lang)}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <SoftPillButton onClick={() => navigateToView('highlights')}>
                    {lang === 'id' ? 'Lihat Semua Highlights' : 'View All'}
                  </SoftPillButton>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               6. ANIME & MUSIC SECTION (AnimeMusic.tsx)
               ================================================================ */}
            <section id="anime" className="w-full py-2">
              <div className="px-4">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {lang === 'id' ? 'Anime & Musik' : 'Anime & Music'}
                </h2>
                <p className="mt-1 text-xs md:text-sm text-neutral-500">
                  {lang === 'id'
                    ? 'Tontonan dan musik yang menemani sesi ngoding dan eksplorasi data.'
                    : 'Stories I watch and music on rotation during coding and data sessions.'}
                </p>

                {/* Anime Grid (8 featured items) */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {lang === 'id' ? 'Daftar Tontonan Anime' : 'Anime Watchlist'}
                    </h3>
                    <span className="text-[11px] text-neutral-400">
                      {lang === 'id' ? 'Beberapa favorit' : 'A few favorites'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {featuredAnime.map((anime) => (
                      <div
                        key={anime.title}
                        onClick={() => navigateToView('anime')}
                        className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 cursor-pointer"
                      >
                        <img
                          src={withBase((anime.cover || '').replace(/^\//, ''))}
                          alt={anime.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <p className="text-xs font-semibold text-white truncate">
                            {anime.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Music Rotation + Spotify Embed */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                      {lang === 'id' ? 'Musik' : 'Music'}
                    </h3>
                    <span className="text-[11px] text-neutral-400">
                      {lang === 'id' ? 'Playlist pengantar fokus' : 'Mostly on loop'}
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
                              lang === 'id' ? 'lainnya' : 'more'
                            }`}
                      </button>
                    </div>

                    <div className="pt-1">
                      <div className="rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800">
                        <iframe
                          src={spotifyEmbedUrl}
                          width="100%"
                          height="152"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title="Spotify Embed"
                          className="block border-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <SoftPillButton onClick={() => navigateToView('anime')}>
                    {lang === 'id' ? 'Lihat Semua Anime & Musik' : 'View All'}
                  </SoftPillButton>
                </div>
              </div>
            </section>

            <div className="w-full h-[1px] my-4" style={dashedX} />

            {/* ================================================================
               7. MINIMAL QUOTE & DOT-MATRIX INTERACTIVE FOOTER
               ================================================================ */}
            <section className="w-full py-6 px-4">
              <div className="relative p-5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                <p className="text-xs md:text-sm italic text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {lang === 'id'
                    ? '“Tanpa data, Anda hanyalah orang lain yang memiliki opini.”'
                    : '“Without data, you’re just another person with an opinion.”'}
                </p>
                <p className="mt-2 text-xs text-neutral-500 text-right font-mono">
                  — W. Edwards Deming
                </p>
              </div>
            </section>
          </>
        )}

        <div className="w-full h-[1px] mt-4" style={dashedX} />

        {/* Interactive Dot-Matrix Footer (FooterBackground.tsx) */}
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

      {/* Lightbox Modal for Certificates, Project Dashboards & KKN Photos */}
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
