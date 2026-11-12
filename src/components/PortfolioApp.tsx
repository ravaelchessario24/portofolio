import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  profile,
  about,
  gallery,
  education,
  experience,
  projects,
  skills,
  certificates,
  contact,
  t,
  type Lang,
} from '../lib/content';
import { feedbackState, triggerHapticAndSound } from '../lib/feedback';
import TypingRole from './TypingRole';
import CaseStudyView from './CaseStudyView';

const LazyLanyard = lazy(() => import('./Lanyard'));

type ThemeMode = 'light' | 'dark';

const SECTION_META: Array<{
  id: string;
  nav: { id: string; en: string };
  title: { id: string; en: string };
}> = [
  {
    id: 'tentang',
    nav: { id: 'Tentang', en: 'About' },
    title: {
      id: 'Lulusan Teknologi Informasi yang berfokus pada analisis data dan machine learning.',
      en: 'Information Technology graduate focused on data analysis and machine learning.',
    },
  },
  {
    id: 'galeri',
    nav: { id: 'Galeri', en: 'Gallery' },
    title: {
      id: 'Dokumentasi kegiatan dan kontribusi lapangan.',
      en: 'Activity documentation and field contributions.',
    },
  },
  {
    id: 'pendidikan',
    nav: { id: 'Pendidikan', en: 'Education' },
    title: {
      id: 'Latar belakang akademik dan capaian studi.',
      en: 'Academic background and study achievements.',
    },
  },
  {
    id: 'pengalaman',
    nav: { id: 'Pengalaman', en: 'Experience' },
    title: {
      id: 'Pengalaman organisasi masyarakat dan magang industri.',
      en: 'Community engagement and industry internship experience.',
    },
  },
  {
    id: 'proyek',
    nav: { id: 'Proyek', en: 'Projects' },
    title: {
      id: 'Karya terpilih dan studi kasus pengolahan data.',
      en: 'Selected work and data processing case studies.',
    },
  },
  {
    id: 'keterampilan',
    nav: { id: 'Keterampilan', en: 'Skills' },
    title: {
      id: 'Alat kerja dan pustaka yang digunakan.',
      en: 'Tools and libraries I work with.',
    },
  },
  {
    id: 'sertifikasi',
    nav: { id: 'Sertifikasi', en: 'Certifications' },
    title: {
      id: 'Bukti pelatihan dan sertifikasi kompetensi.',
      en: 'Proof of training and competency certifications.',
    },
  },
  {
    id: 'kontak',
    nav: { id: 'Kontak', en: 'Contact' },
    title: {
      id: 'Terbuka untuk berdiskusi dan berkolaborasi.',
      en: 'Open for discussion and collaboration.',
    },
  },
];

const UI_COPY: Record<Lang, Record<string, string>> = {
  id: {
    viewProjects: 'Lihat proyek',
    downloadCv: 'Unduh CV',
    menu: 'Menu',
    close: 'Tutup',
    mainNav: 'Navigasi utama',
    langSwitch: 'Pilih bahasa',
    themeSwitch: 'Pilih tema warna',
    soundSwitch: 'Pengaturan bunyi',
    lightMode: 'Mode terang',
    darkMode: 'Mode gelap',
    soundOn: 'Bunyi nyala',
    soundOff: 'Bunyi mati',
    lanyardHint: 'Tarik atau ketuk kartu untuk membalik',
    lanyardFlipBack: 'Ketuk lagi untuk kembali ke sisi depan',
    profileHeading: 'Profil',
    techHeading: 'Teknologi yang saya pakai',
    photoAlt: 'Foto potret Muhammad Ravael Chessario Ramdoni',
    filterLabel: 'Filter kategori dokumentasi',
    allCategories: 'Semua',
    seeAll: 'Lihat semua',
    showLess: 'Tampilkan ringkas',
    prevPhoto: 'Sebelumnya',
    nextPhoto: 'Berikutnya',
    gpaLabel: 'IPK Kumulatif',
    outOf: 'dari',
    gpaDesc: 'Skala 4,00 · Program Studi S1 Teknologi Informasi',
    favCourses: 'Mata kuliah favorit',
    periodLabel: 'Periode',
    locationLabel: 'Lokasi',
    participantsLabel: 'Peserta / Sasaran',
    impactLabel: 'Dampak',
    dataRelevance: 'Kaitan dengan Data',
    seeDetails: 'Lihat detail',
    tasksDone: 'Tugas & Tanggung Jawab',
    resultAchieved: 'Hasil & Dampak',
    docPhotos: 'Dokumentasi Kegiatan & Hasil',
    readCaseStudy: 'Baca case study',
    viewDemo: 'Lihat demo',
    comingSoonSlot: 'Proyek analitik berikutnya — segera hadir',
    templatePreviewSlot: 'Template Studi Kasus ke-2 (Data Analyst / Efisiensi Data)',
    openTemplateB: 'Baca case study (Template Data Analyst)',
    usedIn: 'dipakai di',
    zoomCert: 'Perbesar gambar sertifikat',
    availableFrom: 'Tersedia mulai',
    copyBtn: 'Salin',
    copiedBtn: 'Tersalin',
    openBtn: 'Buka',
    approxArea: 'Area perkiraan (level kota)',
    openMaps: 'Buka di Maps',
    backToTop: 'Kembali ke atas',
    groupData: 'Data & Analitik',
    groupMethods: 'Metode',
    groupViz: 'Visualisasi & Dashboard',
    groupTools: 'Alat Kerja',
    groupSoft: 'Kemampuan Personal',
  },
  en: {
    viewProjects: 'View projects',
    downloadCv: 'Download CV',
    menu: 'Menu',
    close: 'Close',
    mainNav: 'Main navigation',
    langSwitch: 'Select language',
    themeSwitch: 'Select color theme',
    soundSwitch: 'Sound settings',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    lanyardHint: 'Drag or tap the card to flip',
    lanyardFlipBack: 'Tap again to flip back to front',
    profileHeading: 'Profile',
    techHeading: 'Technologies I use',
    photoAlt: 'Portrait of Muhammad Ravael Chessario Ramdoni',
    filterLabel: 'Filter documentation categories',
    allCategories: 'All',
    seeAll: 'See all',
    showLess: 'Show less',
    prevPhoto: 'Previous',
    nextPhoto: 'Next',
    gpaLabel: 'Cumulative GPA',
    outOf: 'of',
    gpaDesc: '4.00 Scale · B.Sc. in Information Technology',
    favCourses: 'Favorite courses',
    periodLabel: 'Period',
    locationLabel: 'Location',
    participantsLabel: 'Participants / Target',
    impactLabel: 'Impact',
    dataRelevance: 'Connection to Data',
    seeDetails: 'See details',
    tasksDone: 'Tasks & Responsibilities',
    resultAchieved: 'Results & Impact',
    docPhotos: 'Activity & Result Documentation',
    readCaseStudy: 'Read case study',
    viewDemo: 'View demo',
    comingSoonSlot: 'Next analytics project — coming soon',
    templatePreviewSlot: '2nd Case Study Template (Data Analyst / Data Efficiency)',
    openTemplateB: 'Read case study (Data Analyst Template)',
    usedIn: 'used in',
    zoomCert: 'Enlarge certificate image',
    availableFrom: 'Available from',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    openBtn: 'Open',
    approxArea: 'Approximate area (city level)',
    openMaps: 'Open in Maps',
    backToTop: 'Back to top',
    groupData: 'Data & Analytics',
    groupMethods: 'Methods',
    groupViz: 'Visualization & Dashboards',
    groupTools: 'Work Tools',
    groupSoft: 'Soft Skills',
  },
};

const GROUP_KEY_MAP: Record<string, string> = {
  'Data & Analitik': 'groupData',
  Metode: 'groupMethods',
  'Visualisasi & Dashboard': 'groupViz',
  'Alat Kerja': 'groupTools',
  'Kemampuan Personal': 'groupSoft',
};

function readStorage(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, val);
  } catch {}
}

function SectionHeading({
  id,
  eyebrow,
  title,
  alternate = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  alternate?: boolean;
  children: React.ReactNode;
}) {
  const words = title.split(' ');
  return (
    <section id={id} className={`portfolio-section ${alternate ? 'is-alt' : ''}`}>
      <div className="section-inner">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="section-h2" aria-label={title}>
          {words.map((word, idx) => (
            <React.Fragment key={idx}>
              <span className="word-mask" aria-hidden="true">
                <span className="word-inner" style={{ ['--word-idx' as string]: idx }}>
                  {word}
                </span>
              </span>{' '}
            </React.Fragment>
          ))}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function PortfolioApp({ baseUrl = '/' }: { baseUrl?: string }) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const [lang, setLang] = useState<Lang>('id');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('tentang');
  const [currentHash, setCurrentHash] = useState<string>('');
  const [showFloatingCv, setShowFloatingCv] = useState<boolean>(false);

  // Gallery state
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [showAllGallery, setShowAllGallery] = useState<boolean>(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(-1);

  // Education GPA counter state
  const eduRef = useRef<HTMLDivElement>(null);
  const [gpaAnimated, setGpaAnimated] = useState<number>(education.gpa);

  // Experience detail modal state
  const [expModalIdx, setExpModalIdx] = useState<number>(-1);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Certificate zoom modal state
  const [certModalIdx, setCertModalIdx] = useState<number>(-1);

  // Contact email copy state
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  // Hydrate persisted preferences on mount
  useEffect(() => {
    const savedLang = readStorage('lang');
    if (savedLang === 'en' || savedLang === 'id') setLang(savedLang);

    const savedTheme =
      (document.documentElement.dataset.theme as ThemeMode) ||
      (readStorage('theme') as ThemeMode) ||
      'light';
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');

    const savedSound = readStorage('sound');
    const isSoundEnabled = savedSound !== 'off';
    setSoundOn(isSoundEnabled);
    feedbackState.enabled = isSoundEnabled;

    setCurrentHash(window.location.hash);
    const onHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    writeStorage('lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage('theme', theme);
  }, [theme]);

  useEffect(() => {
    feedbackState.enabled = soundOn;
    writeStorage('sound', soundOn ? 'on' : 'off');
  }, [soundOn]);

  const caseStudySlug = currentHash.startsWith('#/proyek/')
    ? currentHash.slice('#/proyek/'.length)
    : '';

  // Scroll progress bar, navbar avatar morph, and timeline draw progress
  useEffect(() => {
    let rafId = 0;
    const updateScrollMetrics = () => {
      rafId = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      setScrolled(scrollTop > 56);

      // Update timeline draw line progress
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const viewH = window.innerHeight;
        const tlProg = Math.min(1, Math.max(0.12, (viewH * 0.72 - rect.top) / Math.max(1, rect.height)));
        timelineRef.current.style.setProperty('--tl-progress', tlProg.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(updateScrollMetrics);
    };
    updateScrollMetrics();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [caseStudySlug]);

  // Active section observer + Floating CV visibility observer (appears after Hero, hides at Contact)
  useEffect(() => {
    if (caseStudySlug) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setShowFloatingCv(false);
      return;
    }

    const sectionIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    SECTION_META.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) sectionIo.observe(el);
    });

    const heroEl = document.querySelector('.hero-section');
    const contactEl = document.getElementById('kontak');
    let heroVisible = true;
    let contactVisible = false;

    const syncFloatingCv = () => {
      setShowFloatingCv(!heroVisible && !contactVisible);
    };

    const heroIo = new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
      syncFloatingCv();
    });
    const contactIo = new IntersectionObserver(([e]) => {
      contactVisible = e.isIntersecting;
      syncFloatingCv();
    });

    if (heroEl) heroIo.observe(heroEl);
    if (contactEl) contactIo.observe(contactEl);

    return () => {
      sectionIo.disconnect();
      heroIo.disconnect();
      contactIo.disconnect();
    };
  }, [caseStudySlug]);

  // GPA Ring Count-Up Animation when Education section enters viewport
  useEffect(() => {
    if (caseStudySlug) return;
    const el = eduRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setGpaAnimated(education.gpa);
      return;
    }

    let animRaf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let startTime = 0;
        const duration = 1350;
        const animateGpa = (now: number) => {
          if (!startTime) startTime = now;
          const p = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setGpaAnimated(education.gpa * eased);
          if (p < 1) {
            animRaf = requestAnimationFrame(animateGpa);
          } else {
            setGpaAnimated(education.gpa);
          }
        };
        animRaf = requestAnimationFrame(animateGpa);
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(animRaf);
    };
  }, [caseStudySlug]);

  // Circular expanding View Transition on theme switch (with instant fallback, never slow property transitions)
  const handleThemeSwitch = (nextTheme: ThemeMode, e: React.MouseEvent<HTMLButtonElement>) => {
    if (nextTheme === theme) return;
    triggerHapticAndSound('tap');

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!docWithVT.startViewTransition || reduceMotion) {
      applyTheme();
      return;
    }

    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );
    const transition = docWithVT.startViewTransition(() => {
      applyTheme();
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${cx}px ${cy}px)`,
              `circle(${maxRadius}px at ${cx}px ${cy}px)`,
            ],
          },
          {
            duration: 620,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});
  };

  const navigateHash = (targetHash: string) => {
    window.location.hash = targetHash;
    setCurrentHash(targetHash);
    if (!targetHash.startsWith('#/proyek/')) {
      const id = targetHash.replace(/^#/, '');
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      });
    }
  };

  const u = UI_COPY[lang];
  const cvUrl = normalizedBase + profile.cv;

  // Gallery filtering logic: Filter buttons ONLY appear if there are photos from 2 or more categories
  const uniqueCatKeys = Array.from(new Set(gallery.map((g) => g.catKey)));
  const filteredGallery = gallery.filter(
    (g) => selectedCat === 'all' || g.catKey === selectedCat
  );
  const visibleGallery = showAllGallery ? filteredGallery : filteredGallery.slice(0, 6);
  const activeLightboxItem = lightboxIdx >= 0 ? filteredGallery[lightboxIdx] : null;

  // Lightbox keyboard Left/Right navigation
  useEffect(() => {
    if (lightboxIdx < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((i) => (i - 1 + filteredGallery.length) % filteredGallery.length);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx((i) => (i + 1) % filteredGallery.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, filteredGallery.length]);

  // GPA Ring SVG math (fixed size so it never shrinks or overflows on 360-430px screens)
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - gpaAnimated / education.gpaMax);
  const formattedGpa =
    lang === 'id' ? gpaAnimated.toFixed(2).replace('.', ',') : gpaAnimated.toFixed(2);
  const formattedGpaMax =
    lang === 'id' ? education.gpaMax.toFixed(2).replace('.', ',') : education.gpaMax.toFixed(2);

  // Skills groups for About card & Tool logos for Marquee
  const skillGroups = Array.from(new Set(skills.map((s) => s.group)));
  const toolLogos = skills.filter((s) => s.tool && s.logo);

  // Featured project + any additional projects
  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const secondaryProjects = projects.filter((p) => p.slug !== featuredProject.slug);

  const handleCopyEmail = () => {
    triggerHapticAndSound('copy');
    try {
      navigator.clipboard.writeText(profile.email);
    } catch {}
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1800);
  };

  return (
    <>
      {/* Thin Scroll Progress Bar */}
      <div className="scroll-progress-bar" aria-hidden="true" />

      {/* Top Sticky / Floating Pill Navbar */}
      <header className={`site-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Brand: "Ravael." on desktop; on mobile/tablet morphs smoothly into Ravael's circular photo avatar on scroll or menu open */}
          <a
            href="#top"
            className={`navbar-brand ${scrolled || mobileMenuOpen ? 'show-avatar-mobile' : ''}`}
            onClick={(e) => {
              if (caseStudySlug) {
                e.preventDefault();
                navigateHash('#top');
              }
            }}
            aria-label={profile.name}
          >
            <span className="brand-avatar-ring" aria-hidden="true">
              <img
                src={normalizedBase + profile.avatar}
                alt=""
                width={32}
                height={32}
                className="brand-avatar-img"
              />
            </span>
            <span className="brand-text">{profile.brand}</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links" aria-label={u.mainNav}>
            {SECTION_META.map((sec) => {
              const isCurrent = !caseStudySlug && activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => {
                    if (caseStudySlug) navigateHash(`#${sec.id}`);
                  }}
                >
                  {sec.nav[lang]}
                </a>
              );
            })}
          </nav>

          {/* 3 Navbar Switches: ID | EN, Light | Dark, Sound On | Off + Mobile Menu Trigger */}
          <div className="navbar-controls">
            {/* 1. Language Switch (ID | EN) */}
            <div className="seg-pill" role="group" aria-label={u.langSwitch}>
              <button
                type="button"
                aria-pressed={lang === 'id'}
                aria-label="Bahasa Indonesia"
                onClick={() => {
                  if (lang !== 'id') {
                    triggerHapticAndSound('tap');
                    setLang('id');
                  }
                }}
              >
                ID
              </button>
              <button
                type="button"
                aria-pressed={lang === 'en'}
                aria-label="English"
                onClick={() => {
                  if (lang !== 'en') {
                    triggerHapticAndSound('tap');
                    setLang('en');
                  }
                }}
              >
                EN
              </button>
            </div>

            {/* 2. Theme Switch (Light | Dark) */}
            <div className="seg-pill" role="group" aria-label={u.themeSwitch}>
              <button
                type="button"
                aria-pressed={theme === 'light'}
                aria-label={u.lightMode}
                title={u.lightMode}
                onClick={(e) => handleThemeSwitch('light', e)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </button>
              <button
                type="button"
                aria-pressed={theme === 'dark'}
                aria-label={u.darkMode}
                title={u.darkMode}
                onClick={(e) => handleThemeSwitch('dark', e)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>
            </div>

            {/* 3. Sound / Haptic Switch (On | Off) */}
            <div className="seg-pill seg-sound-desktop" role="group" aria-label={u.soundSwitch}>
              <button
                type="button"
                aria-pressed={soundOn}
                aria-label={u.soundOn}
                title={u.soundOn}
                onClick={() => {
                  feedbackState.enabled = true;
                  setSoundOn(true);
                  triggerHapticAndSound('tap');
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </button>
              <button
                type="button"
                aria-pressed={!soundOn}
                aria-label={u.soundOff}
                title={u.soundOff}
                onClick={() => {
                  feedbackState.enabled = false;
                  setSoundOn(false);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              </button>
            </div>

            {/* Accessible Mobile Sheet Menu Trigger (44px min tap target) */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="mobile-menu-trigger"
                  aria-label={mobileMenuOpen ? u.close : u.menu}
                  onClick={() => triggerHapticAndSound('tap')}
                >
                  <span className="menu-trigger-label">{mobileMenuOpen ? u.close : u.menu}</span>
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="radix-overlay" />
                <Dialog.Content className="radix-mobile-sheet" aria-describedby={undefined}>
                  <div className="mobile-sheet-head">
                    <div className="mobile-sheet-identity">
                      <img
                        src={normalizedBase + profile.avatar}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="sheet-avatar"
                      />
                      <div>
                        <Dialog.Title className="sheet-title">{profile.brand}</Dialog.Title>
                        <p className="sheet-sub">{t(profile.badgeRole, lang)}</p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button type="button" className="btn btn-outline btn-sm">
                        {u.close}
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav className="mobile-sheet-nav" aria-label={u.mainNav}>
                    {SECTION_META.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className={`mobile-sheet-link ${activeSection === sec.id ? 'is-active' : ''}`}
                        onClick={() => {
                          triggerHapticAndSound('tap');
                          setMobileMenuOpen(false);
                          if (caseStudySlug) navigateHash(`#${sec.id}`);
                        }}
                      >
                        <span>{sec.nav[lang]}</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    ))}
                  </nav>

                  <div className="mobile-sheet-switches">
                    <span className="eyebrow">{u.soundSwitch}</span>
                    <div className="seg-pill" role="group" aria-label={u.soundSwitch}>
                      <button
                        type="button"
                        aria-pressed={soundOn}
                        onClick={() => {
                          feedbackState.enabled = true;
                          setSoundOn(true);
                          triggerHapticAndSound('tap');
                        }}
                      >
                        {u.soundOn}
                      </button>
                      <button
                        type="button"
                        aria-pressed={!soundOn}
                        onClick={() => {
                          feedbackState.enabled = false;
                          setSoundOn(false);
                        }}
                      >
                        {u.soundOff}
                      </button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      {/* Main Content: Either Case Study View or Single-Page Scroll */}
      {caseStudySlug ? (
        <main id="top">
          <CaseStudyView
            slug={caseStudySlug}
            lang={lang}
            baseUrl={normalizedBase}
            onNavigate={navigateHash}
          />
        </main>
      ) : (
        <main id="top">
          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="section-inner hero-grid">
              <div className="hero-copy">
                <p className="hero-greeting">{t(profile.greeting, lang)}</p>
                <h1 className="hero-name">{profile.name}</h1>
                <p className="hero-typing">
                  <TypingRole text={t(profile.roles[0], lang)} />
                </p>
                <blockquote className="hero-quote">“{t(profile.quote, lang)}”</blockquote>
                <div className="hero-actions">
                  <a
                    href="#proyek"
                    className="btn btn-primary"
                    onClick={() => triggerHapticAndSound('tap')}
                  >
                    {u.viewProjects}
                  </a>
                  <a
                    href={cvUrl}
                    download="CV_Muhammad_Ravael_Chessario_Ramdoni.pdf"
                    className="btn btn-outline"
                    onClick={() => triggerHapticAndSound('tap')}
                  >
                    {u.downloadCv}
                  </a>
                </div>
              </div>

              {/* Lazy-loaded Interactive Lanyard so Hero text paints first */}
              <div className="hero-lanyard-col">
                <Suspense
                  fallback={
                    <div className="lanyard-placeholder" aria-hidden="true">
                      <div className="lanyard-placeholder-card" />
                    </div>
                  }
                >
                  <LazyLanyard
                    name={profile.name}
                    badgeRole={t(profile.badgeRole, lang)}
                    photo={normalizedBase + profile.squarePhoto}
                    summaryRole={t(profile.roles[0], lang)}
                    email={profile.email}
                    location={profile.location}
                    hint={u.lanyardHint}
                    flipBackLabel={u.lanyardFlipBack}
                  />
                </Suspense>
              </div>
            </div>
          </section>

          {/* 1. TENTANG (Profile + Technologies I Use on Left, 1 Portrait Photo on Right; no "Sekilas" or "Fokus") */}
          <SectionHeading
            id="tentang"
            eyebrow={SECTION_META[0].nav[lang]}
            title={SECTION_META[0].title[lang]}
          >
            <div className="about-grid">
              <div className="about-left-col">
                <article className="surface-card">
                  <div className="eyebrow" style={{ marginBottom: 10 }}>
                    {u.profileHeading}
                  </div>
                  <p className="body-text">{t(about.profile, lang)}</p>
                </article>

                <article className="surface-card">
                  {/* Title without icon as required by Section 2 */}
                  <div className="tech-card-header">
                    <h3 className="card-h3">{u.techHeading}</h3>
                  </div>
                  <div className="tech-groups-stack">
                    {skillGroups.map((groupName) => {
                      const groupLabelKey = GROUP_KEY_MAP[groupName];
                      const translatedGroup = groupLabelKey ? u[groupLabelKey] : groupName;
                      const groupItems = skills.filter((s) => s.group === groupName);
                      return (
                        <div key={groupName} className="tech-group-block">
                          <div className="eyebrow" style={{ marginBottom: 8 }}>
                            {translatedGroup}
                          </div>
                          <div className="chip-row">
                            {groupItems.map((item) => (
                              <span key={t(item.name, 'id')} className="tech-chip">
                                {t(item.name, lang)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>

              <div className="about-right-col">
                <figure className="about-photo-frame">
                  <img
                    src={normalizedBase + about.photo}
                    alt={u.photoAlt}
                    className="about-photo-img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </SectionHeading>

          {/* 2. GALERI (Max 6 bento photos initially, category/date/caption, lightbox with Prev/Next, "See all", filter only if >=2 categories) */}
          <SectionHeading
            id="galeri"
            eyebrow={SECTION_META[1].nav[lang]}
            title={SECTION_META[1].title[lang]}
            alternate
          >
            {uniqueCatKeys.length >= 2 && (
              <div className="gallery-filters" role="group" aria-label={u.filterLabel}>
                <button
                  type="button"
                  className={`filter-chip ${selectedCat === 'all' ? 'is-active' : ''}`}
                  aria-pressed={selectedCat === 'all'}
                  onClick={() => {
                    triggerHapticAndSound('tap');
                    setSelectedCat('all');
                    setShowAllGallery(false);
                  }}
                >
                  {u.allCategories}
                </button>
                {uniqueCatKeys.map((catKey) => {
                  const sample = gallery.find((g) => g.catKey === catKey)!;
                  const active = selectedCat === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      className={`filter-chip ${active ? 'is-active' : ''}`}
                      aria-pressed={active}
                      onClick={() => {
                        triggerHapticAndSound('tap');
                        setSelectedCat(catKey);
                        setShowAllGallery(false);
                      }}
                    >
                      {t(sample.cat, lang)}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="bento-gallery-grid">
              {visibleGallery.map((item, idx) => {
                const spanClass =
                  idx === 0 ? 'bento-featured' : idx === 3 || idx === 4 ? 'bento-wide' : '';
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`bento-tile ${spanClass}`}
                    onClick={() => {
                      triggerHapticAndSound('tap');
                      setLightboxIdx(idx);
                    }}
                    aria-label={`${t(item.cat, lang)} (${item.date}): ${t(item.caption, lang)}`}
                  >
                    <img
                      src={normalizedBase + item.src}
                      alt={t(item.caption, lang)}
                      className="bento-tile-img"
                      decoding="async"
                    />
                    <span className="bento-tile-overlay">
                      <small className="bento-meta">
                        {t(item.cat, lang)} · {item.date}
                      </small>
                      <span className="bento-caption">{t(item.caption, lang)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredGallery.length > 6 && (
              <div className="gallery-more-row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    triggerHapticAndSound('tap');
                    setShowAllGallery((v) => !v);
                  }}
                >
                  {showAllGallery
                    ? u.showLess
                    : `${u.seeAll} (${filteredGallery.length})`}
                </button>
              </div>
            )}

            {/* Gallery Lightbox Modal (Radix Dialog) */}
            <Dialog.Root
              open={lightboxIdx >= 0}
              onOpenChange={(open) => {
                if (!open) setLightboxIdx(-1);
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="radix-overlay" />
                <Dialog.Content className="radix-dialog-content" aria-describedby={undefined}>
                  {activeLightboxItem && (
                    <div className="lightbox-inner">
                      <div className="dialog-header">
                        <div>
                          <span className="eyebrow">
                            {t(activeLightboxItem.cat, lang)} · {activeLightboxItem.date}
                          </span>
                          <Dialog.Title className="card-h3" style={{ marginTop: 4 }}>
                            {t(activeLightboxItem.caption, lang)}
                          </Dialog.Title>
                          {activeLightboxItem.privacyNote && (
                            <p className="muted-text" style={{ marginTop: 4, fontSize: 13 }}>
                              {t(activeLightboxItem.privacyNote, lang)}
                            </p>
                          )}
                        </div>
                        <Dialog.Close asChild>
                          <button type="button" className="btn btn-outline btn-sm">
                            {u.close}
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="lightbox-img-stage">
                        <img
                          src={normalizedBase + activeLightboxItem.src}
                          alt={t(activeLightboxItem.caption, lang)}
                          className="lightbox-img"
                        />
                      </div>

                      <div className="lightbox-nav-row">
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            triggerHapticAndSound('tap');
                            setLightboxIdx(
                              (lightboxIdx - 1 + filteredGallery.length) % filteredGallery.length
                            );
                          }}
                        >
                          ← {u.prevPhoto}
                        </button>
                        <span className="lightbox-counter">
                          {lightboxIdx + 1} / {filteredGallery.length}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            triggerHapticAndSound('tap');
                            setLightboxIdx((lightboxIdx + 1) % filteredGallery.length);
                          }}
                        >
                          {u.nextPhoto} →
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SectionHeading>

          {/* 3. PENDIDIKAN (Campus logo, large GPA in filling ring, contrast ribbon "IPK tertinggi peringkat 4 dari 21 lulusan", favorite courses without reasons, no thesis title) */}
          <SectionHeading
            id="pendidikan"
            eyebrow={SECTION_META[2].nav[lang]}
            title={SECTION_META[2].title[lang]}
          >
            <div ref={eduRef} className="surface-card edu-card">
              <div className="edu-header">
                <div className="edu-school-block">
                  <img
                    src={
                      normalizedBase +
                      (theme === 'dark' && education.logoDark
                        ? education.logoDark
                        : education.logo)
                    }
                    alt={education.school}
                    width={88}
                    height={88}
                    className="edu-logo"
                  />
                  <div className="edu-school-text">
                    <h3 className="edu-school-name">{education.school}</h3>
                    <p className="edu-degree-line">
                      {t(education.degree, lang)} · <span className="mono-num">{education.period}</span>
                    </p>
                  </div>
                </div>

                {/* Fixed-dimension GPA Ring so it never shrinks or overflows on 360px-430px mobile screens */}
                <div className="edu-gpa-box">
                  <div className="gpa-ring-wrap" aria-label={`${u.gpaLabel}: ${formattedGpa} ${u.outOf} ${formattedGpaMax}`}>
                    <svg className="gpa-ring-svg" viewBox="0 0 124 124" aria-hidden="true">
                      <circle
                        cx="62"
                        cy="62"
                        r={ringRadius}
                        fill="none"
                        className="gpa-ring-track"
                        strokeWidth="8"
                      />
                      <circle
                        cx="62"
                        cy="62"
                        r={ringRadius}
                        fill="none"
                        className="gpa-ring-progress"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <div className="gpa-ring-center">
                      <strong className="gpa-ring-value">{formattedGpa}</strong>
                      <span className="gpa-ring-max">
                        {u.outOf} {formattedGpaMax}
                      </span>
                    </div>
                  </div>
                  <div className="edu-gpa-meta">
                    <span className="eyebrow">{u.gpaLabel}</span>
                    <p className="muted-text">{u.gpaDesc}</p>
                  </div>
                </div>
              </div>

              {/* Contrast Ribbon for Rank 4 out of 21 Graduates */}
              <div className="edu-contrast-ribbon">
                <span className="ribbon-medal" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </span>
                <div className="ribbon-copy">
                  <strong className="ribbon-title">{t(education.nomination, lang)}</strong>
                  <span className="ribbon-sub">{t(education.nominationNote, lang)}</span>
                </div>
              </div>

              {/* Favorite Courses (Chips only, without reasons, without thesis title) */}
              <div className="edu-courses-block">
                <div className="eyebrow" style={{ marginBottom: 10 }}>
                  {u.favCourses}
                </div>
                <div className="chip-row">
                  {education.favorites.map((course, idx) => (
                    <span key={idx} className="tech-chip">
                      {t(course, lang)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionHeading>

          {/* 4. PENGALAMAN (Vertical timeline; KKN first, then Internship; "Lihat detail" modal with tasks, results, documentation photos) */}
          <SectionHeading
            id="pengalaman"
            eyebrow={SECTION_META[3].nav[lang]}
            title={SECTION_META[3].title[lang]}
            alternate
          >
            <div ref={timelineRef} className="experience-timeline">
              {experience.map((item, idx) => (
                <article key={item.id} className="timeline-item">
                  <span className="timeline-node" aria-hidden="true" />
                  <div className="surface-card timeline-card">
                    <div className="timeline-card-head">
                      <div>
                        <h3 className="card-h3">
                          {t(item.title, lang)}
                          {item.org ? ` · ${item.org}` : ''}
                        </h3>
                        <p className="muted-text" style={{ marginTop: 4 }}>
                          {t(item.location, lang)}
                        </p>
                      </div>
                      <span className="badge-pill">{t(item.period, lang)}</span>
                    </div>

                    {/* Structured KKN / Experience metadata columns (period, location, participants, impact) */}
                    <div className="exp-meta-grid">
                      <div className="exp-meta-cell">
                        <small>{u.periodLabel}</small>
                        <strong>{t(item.period, lang)}</strong>
                      </div>
                      <div className="exp-meta-cell">
                        <small>{u.locationLabel}</small>
                        <strong>{t(item.location, lang)}</strong>
                      </div>
                      {item.participants && (
                        <div className="exp-meta-cell">
                          <small>{u.participantsLabel}</small>
                          <strong>{t(item.participants, lang)}</strong>
                        </div>
                      )}
                      {item.impact && (
                        <div className="exp-meta-cell">
                          <small>{u.impactLabel}</small>
                          <strong>{t(item.impact, lang)}</strong>
                        </div>
                      )}
                    </div>

                    <div className="timeline-lines">
                      {item.lines.map((line, lIdx) => (
                        <p key={lIdx} className="body-text">
                          {t(line, lang)}
                        </p>
                      ))}
                    </div>

                    <div className="exp-relevance-box">
                      <strong>{u.dataRelevance}:</strong>{' '}
                      <span>{t(item.relevance, lang)}</span>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          triggerHapticAndSound('tap');
                          setExpModalIdx(idx);
                        }}
                      >
                        {u.seeDetails}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Experience Detail Modal (Radix Dialog) */}
            <Dialog.Root
              open={expModalIdx >= 0}
              onOpenChange={(open) => {
                if (!open) setExpModalIdx(-1);
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="radix-overlay" />
                <Dialog.Content className="radix-dialog-content" aria-describedby={undefined}>
                  {expModalIdx >= 0 && experience[expModalIdx] && (
                    <div className="exp-modal-inner">
                      <div className="dialog-header">
                        <div>
                          <span className="eyebrow">
                            {experience[expModalIdx].org} · {t(experience[expModalIdx].period, lang)}
                          </span>
                          <Dialog.Title className="card-h3" style={{ marginTop: 4 }}>
                            {t(experience[expModalIdx].title, lang)}
                          </Dialog.Title>
                          <p className="muted-text" style={{ marginTop: 2 }}>
                            {t(experience[expModalIdx].location, lang)}
                          </p>
                        </div>
                        <Dialog.Close asChild>
                          <button type="button" className="btn btn-outline btn-sm">
                            {u.close}
                          </button>
                        </Dialog.Close>
                      </div>

                      <div>
                        <div className="eyebrow" style={{ marginBottom: 8 }}>
                          {u.tasksDone}
                        </div>
                        <ul className="modal-list">
                          {experience[expModalIdx].detail.tasks.map((task, tIdx) => (
                            <li key={tIdx}>{t(task, lang)}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="eyebrow" style={{ marginBottom: 8 }}>
                          {u.resultAchieved}
                        </div>
                        <p className="body-text">
                          {t(experience[expModalIdx].detail.result, lang)}
                        </p>
                      </div>

                      {experience[expModalIdx].detail.photos.length > 0 && (
                        <div>
                          <div className="eyebrow" style={{ marginBottom: 10 }}>
                            {u.docPhotos}
                          </div>
                          <div className="exp-modal-photos">
                            {experience[expModalIdx].detail.photos.map((photoPath) => (
                              <img
                                key={photoPath}
                                src={normalizedBase + photoPath}
                                alt={t(experience[expModalIdx].title, lang)}
                                className="exp-modal-img"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SectionHeading>

          {/* 5. PROYEK (1 large featured card + slots on right; working "Baca case study" buttons; honest project type labels) */}
          <SectionHeading
            id="proyek"
            eyebrow={SECTION_META[4].nav[lang]}
            title={SECTION_META[4].title[lang]}
          >
            <div className="projects-bento">
              {/* Primary Large Featured Project Card */}
              <article className="surface-card project-featured-card">
                <div className="project-cover-wrap">
                  <img
                    src={normalizedBase + featuredProject.cover}
                    alt={t(featuredProject.title, lang)}
                    className="project-cover-img"
                  />
                  <div className="project-cover-badges">
                    <span className="badge-pill badge-honest">
                      {t(featuredProject.projectTypeLabel, lang)}
                    </span>
                  </div>
                </div>

                <div className="project-featured-body">
                  <div className="project-meta-row">
                    <span className="eyebrow">{t(featuredProject.categoryBadge, lang)}</span>
                    <span className="mono-num muted-text">{t(featuredProject.period, lang)}</span>
                  </div>

                  <h3 className="project-title">{t(featuredProject.title, lang)}</h3>
                  <p className="body-text">{t(featuredProject.summary, lang)}</p>

                  <div className="chip-row">
                    {featuredProject.tags.map((tag) => (
                      <span key={tag} className="tech-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a
                      href={featuredProject.caseStudy}
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        triggerHapticAndSound('tap');
                        navigateHash(featuredProject.caseStudy);
                      }}
                    >
                      {u.readCaseStudy}
                    </a>
                    {featuredProject.demo && (
                      <a
                        href={featuredProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        {u.viewDemo} ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>

              {/* Right Column: Any Secondary Projects + Coming Soon Slots */}
              <div className="projects-side-stack">
                {secondaryProjects.map((secProj) => (
                  <article key={secProj.slug} className="surface-card project-side-card">
                    <div className="cs-badges">
                      <span className="badge-pill badge-accent">
                        {t(secProj.categoryBadge, lang)}
                      </span>
                      <span className="badge-pill">
                        {t(secProj.projectTypeLabel, lang)}
                      </span>
                    </div>
                    <h3 className="card-h3" style={{ marginTop: 8 }}>
                      {t(secProj.title, lang)}
                    </h3>
                    <p className="muted-text" style={{ marginTop: 6, fontSize: 14 }}>
                      {t(secProj.summary, lang)}
                    </p>
                    <div className="chip-row" style={{ marginTop: 10 }}>
                      {secProj.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="tech-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <a
                        href={secProj.caseStudy}
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerHapticAndSound('tap');
                          navigateHash(secProj.caseStudy);
                        }}
                      >
                        {u.readCaseStudy} →
                      </a>
                    </div>
                  </article>
                ))}

                {secondaryProjects.length === 0 && (
                  <div className="project-coming-slot">
                    <span className="slot-dot" aria-hidden="true" />
                    <p>{u.comingSoonSlot}</p>
                  </div>
                )}

                <div className="project-coming-slot">
                  <span className="slot-dot" aria-hidden="true" />
                  <p>{u.comingSoonSlot}</p>
                </div>
              </div>
            </div>
          </SectionHeading>

          {/* 6. KETERAMPILAN (Image-only tool logos marquee, no level labels, pauses on hover/focus, tooltip "dipakai di: [proyek]") */}
          <SectionHeading
            id="keterampilan"
            eyebrow={SECTION_META[5].nav[lang]}
            title={SECTION_META[5].title[lang]}
            alternate
          >
            <div className="skills-marquee-viewport">
              <div className="skills-marquee-track">
                {[0, 1, 2].map((copyIdx) => (
                  <div
                    key={copyIdx}
                    className="skills-marquee-group"
                    aria-hidden={copyIdx > 0 ? 'true' : undefined}
                  >
                    {toolLogos.map((tool) => {
                      const toolName = t(tool.name, lang);
                      const usedInText = tool.usedIn ? t(tool.usedIn, lang) : '';
                      const tooltipLabel = usedInText
                        ? `${toolName} — ${u.usedIn}: ${usedInText}`
                        : toolName;
                      return (
                        <div
                          key={`${copyIdx}-${toolName}`}
                          className="skill-logo-tile"
                          tabIndex={copyIdx === 0 ? 0 : -1}
                          aria-label={tooltipLabel}
                        >
                          <img
                            src={normalizedBase + tool.logo!}
                            alt={toolName}
                            width={48}
                            height={48}
                            className="skill-logo-img"
                          />
                          <span className="skill-tooltip" role="tooltip">
                            <strong>{toolName}</strong>
                            {usedInText && (
                              <span>
                                {' '}
                                · {u.usedIn}: {usedInText}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </SectionHeading>

          {/* 7. SERTIFIKASI (Certificate thumbnails displayed directly, click to enlarge, NO "Lihat sertifikat" text) */}
          <SectionHeading
            id="sertifikasi"
            eyebrow={SECTION_META[6].nav[lang]}
            title={SECTION_META[6].title[lang]}
          >
            <div className="certs-grid">
              {certificates.map((cert, idx) => {
                const certTitle = t(cert.title, lang);
                const certDate = t(cert.date, lang);
                return (
                  <div key={certTitle} className="cert-card">
                    <button
                      type="button"
                      className="cert-thumb-btn"
                      aria-label={`${u.zoomCert}: ${certTitle}`}
                      onClick={() => {
                        triggerHapticAndSound('tap');
                        setCertModalIdx(idx);
                      }}
                    >
                      <img
                        src={normalizedBase + cert.image}
                        alt={certTitle}
                        className="cert-thumb-img"
                      />
                    </button>
                    <div className="cert-meta">
                      <h3 className="cert-title">{certTitle}</h3>
                      <p className="muted-text">
                        {cert.issuer} · {certDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certificate Lightbox Modal (Radix Dialog) */}
            <Dialog.Root
              open={certModalIdx >= 0}
              onOpenChange={(open) => {
                if (!open) setCertModalIdx(-1);
              }}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="radix-overlay" />
                <Dialog.Content className="radix-dialog-content" aria-describedby={undefined}>
                  {certModalIdx >= 0 && certificates[certModalIdx] && (
                    <div className="lightbox-inner">
                      <div className="dialog-header">
                        <div>
                          <span className="eyebrow">
                            {certificates[certModalIdx].issuer} ·{' '}
                            {t(certificates[certModalIdx].date, lang)}
                          </span>
                          <Dialog.Title className="card-h3" style={{ marginTop: 4 }}>
                            {t(certificates[certModalIdx].title, lang)}
                          </Dialog.Title>
                          {certificates[certModalIdx].summary && (
                            <p className="muted-text" style={{ marginTop: 4 }}>
                              {t(certificates[certModalIdx].summary, lang)}
                            </p>
                          )}
                        </div>
                        <Dialog.Close asChild>
                          <button type="button" className="btn btn-outline btn-sm">
                            {u.close}
                          </button>
                        </Dialog.Close>
                      </div>

                      <div className="lightbox-img-stage">
                        <img
                          src={normalizedBase + certificates[certModalIdx].image}
                          alt={t(certificates[certModalIdx].title, lang)}
                          className="lightbox-img"
                        />
                      </div>
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SectionHeading>

          {/* 8. KONTAK (High-contrast dark block inverted in dark mode, Email + Copy -> Copied, LinkedIn row, City-level map + Open in Maps, Back to top; NO GitHub, NO Download CV here, NO phone number) */}
          <section id="kontak" className="portfolio-section">
            <div className="section-inner">
              <div className="contact-contrast-block">
                <div className="contact-copy-col">
                  <span className="availability-pill">
                    <span className="avail-dot" aria-hidden="true" />
                    {u.availableFrom}: {t(contact.availableFrom, lang)}
                  </span>
                  <h2 className="contact-headline">{t(contact.headline, lang)}</h2>
                  <p className="contact-sub">{t(contact.sub, lang)}</p>
                </div>

                <div className="contact-rows-col">
                  {/* Email Row */}
                  <div className="contact-action-row">
                    <span className="contact-row-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="3" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>
                    <div className="contact-row-text">
                      <small>Email</small>
                      <strong>{profile.email}</strong>
                    </div>
                    <button
                      type="button"
                      className="contact-row-btn"
                      aria-live="polite"
                      onClick={handleCopyEmail}
                    >
                      {emailCopied ? u.copiedBtn : u.copyBtn}
                    </button>
                  </div>

                  {/* LinkedIn Row */}
                  <div className="contact-action-row">
                    <span className="contact-row-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </span>
                    <div className="contact-row-text">
                      <small>LinkedIn</small>
                      <strong>linkedin.com/in/ravaelchessario</strong>
                    </div>
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-row-btn"
                      onClick={() => triggerHapticAndSound('tap')}
                    >
                      {u.openBtn} ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Approximate City-Level Map Block */}
              <div className="city-map-card">
                <svg
                  className="city-map-svg"
                  viewBox="0 0 1200 320"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <g className="map-grid-lines">
                    <path d="M0 70H1200M0 150H1200M0 230H1200M180 0V320M420 0V320M680 0V320M920 0V320" strokeWidth="1.5" />
                    <path d="M0 215C220 180 390 250 620 205S940 130 1200 175" strokeWidth="14" />
                    <path d="M320 0C350 110 400 190 380 320" strokeWidth="10" />
                    <path d="M760 0C745 95 810 175 790 320" strokeWidth="10" />
                  </g>
                  <circle cx="785" cy="162" r="88" className="map-radius-circle" />
                  <circle cx="785" cy="162" r="8" className="map-center-pin" />
                </svg>

                <div className="city-map-overlay">
                  <span className="eyebrow">{u.locationLabel}</span>
                  <h3 className="card-h3">{contact.location}</h3>
                  <p className="muted-text" style={{ fontSize: 13 }}>
                    {u.approxArea}
                  </p>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => triggerHapticAndSound('tap')}
                  >
                    {u.openMaps} ↗
                  </a>
                </div>
              </div>

              {/* Footer with Back to Top */}
              <footer className="site-footer">
                <span className="muted-text">© 2026 {profile.name}</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    triggerHapticAndSound('tap');
                    window.scrollTo({
                      top: 0,
                      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'auto'
                        : 'smooth',
                    });
                  }}
                >
                  ↑ {u.backToTop}
                </button>
              </footer>
            </div>
          </section>
        </main>
      )}

      {/* Floating Download CV Button (Appears after Hero, hides at Contact; thin bottom bar on mobile) */}
      {!caseStudySlug && (
        <div className={`floating-cv-wrap ${showFloatingCv ? 'is-visible' : ''}`}>
          <a
            href={cvUrl}
            download="CV_Muhammad_Ravael_Chessario_Ramdoni.pdf"
            className="floating-cv-btn"
            tabIndex={showFloatingCv ? 0 : -1}
            aria-hidden={!showFloatingCv}
            onClick={() => triggerHapticAndSound('tap')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{u.downloadCv}</span>
          </a>
        </div>
      )}
    </>
  );
}
