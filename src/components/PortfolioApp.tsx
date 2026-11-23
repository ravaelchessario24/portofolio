import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'motion/react';
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
  code: string;
  nav: { id: string; en: string };
  title: { id: string; en: string };
}> = [
  {
    id: 'tentang',
    code: '01',
    nav: { id: 'Tentang', en: 'About' },
    title: {
      id: 'Lulusan Teknologi Informasi dengan fokus analisis data dan machine learning.',
      en: 'Information Technology graduate focused on data analysis and machine learning.',
    },
  },
  {
    id: 'galeri',
    code: '02',
    nav: { id: 'Galeri', en: 'Gallery' },
    title: {
      id: 'Dokumentasi kegiatan lapangan.',
      en: 'Field activity documentation.',
    },
  },
  {
    id: 'pendidikan',
    code: '03',
    nav: { id: 'Pendidikan', en: 'Education' },
    title: {
      id: 'Latar belakang pendidikan dan capaian akademik.',
      en: 'Educational background and academic achievements.',
    },
  },
  {
    id: 'pengalaman',
    code: '04',
    nav: { id: 'Pengalaman', en: 'Experience' },
    title: {
      id: 'Pengalaman kegiatan masyarakat dan magang.',
      en: 'Community service and internship experience.',
    },
  },
  {
    id: 'proyek',
    code: '05',
    nav: { id: 'Proyek', en: 'Projects' },
    title: {
      id: 'Proyek analisis data dan machine learning.',
      en: 'Data analysis and machine learning projects.',
    },
  },
  {
    id: 'keterampilan',
    code: '06',
    nav: { id: 'Keterampilan', en: 'Skills' },
    title: {
      id: 'Tools dan teknologi yang digunakan.',
      en: 'Tools and technologies I use.',
    },
  },
  {
    id: 'sertifikasi',
    code: '07',
    nav: { id: 'Sertifikasi', en: 'Certifications' },
    title: {
      id: 'Sertifikasi dan pelatihan kompetensi.',
      en: 'Certifications and competency training.',
    },
  },
  {
    id: 'kontak',
    code: '08',
    nav: { id: 'Kontak', en: 'Contact' },
    title: {
      id: 'Mari terhubung untuk peluang kerja dan diskusi.',
      en: 'Let’s connect for opportunities and discussions.',
    },
  },
];

const UI_COPY: Record<Lang, Record<string, string>> = {
  id: {
    heroStatus: 'Tersedia untuk Peran Data Analyst & Data Science',
    statGpaLabel: 'IPK · Peringkat 4 / 21',
    statReviewsLabel: 'Ulasan Data Diolah',
    statAccLabel: 'Akurasi Model ML',
    statBootcampVal: 'Predikat A',
    statBootcampLabel: 'Bootcamp DSAREA',
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
    photoAlt: 'Foto Muhammad Ravael Chessario Ramdoni',
    photoBadgeTitle: 'S.Kom. · Teknologi Informasi',
    photoBadgeSub: 'ITB Ahmad Dahlan Jakarta · IPK 3,77 / 4,00',
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
    locationLabel: 'Lokasi',
    seeDetails: 'Lihat detail',
    tasksDone: 'Tugas & Tanggung Jawab',
    resultAchieved: 'Hasil & Dampak',
    docPhotos: 'Dokumentasi Kegiatan',
    readCaseStudy: 'Baca case study',
    viewDemo: 'Lihat demo',
    pipelineCardEyebrow: 'RINGKASAN PIPELINE KDD · MOBILE JKN',
    pipelineCardTitle: 'Alur Pengolahan 63.766 Data Ulasan ke Model 94,38%',
    pipelineStep1: 'Ulasan Mentah Google Play (Jan 2025 – Jan 2026)',
    pipelineStep2: 'Text Preprocessing & Stemming Sastrawi',
    pipelineStep3: 'Hybrid Labeling (Rating + InSet Lexicon)',
    pipelineStep4: 'Multinomial Naive Bayes (15.000 TF-IDF Bigram)',
    comingSoonEyebrow: 'DALAM EKSPLORASI',
    comingSoonSlot: 'Proyek berikutnya — segera hadir',
    comingSoonSub: 'Eksplorasi dashboard analitik & pemodelan dataset berikutnya.',
    usedIn: 'dipakai di',
    zoomCert: 'Perbesar gambar sertifikat',
    verifiedCert: 'SERTIFIKAT TERVERIFIKASI',
    availableFrom: 'Tersedia mulai',
    copyBtn: 'Salin',
    copiedBtn: 'Tersalin',
    openBtn: 'Buka',
    openMaps: 'Buka di Maps',
    backToTop: 'Kembali ke atas',
    groupData: 'Data & Analitik',
    groupMethods: 'Metode',
    groupViz: 'Visualisasi & Dashboard',
    groupTools: 'Alat Kerja',
    groupSoft: 'Kemampuan Personal',
  },
  en: {
    heroStatus: 'Available for Data Analyst & Data Science Roles',
    statGpaLabel: 'GPA · Ranked 4th / 21',
    statReviewsLabel: 'User Reviews Processed',
    statAccLabel: 'ML Model Accuracy',
    statBootcampVal: 'Grade A',
    statBootcampLabel: 'DSAREA Bootcamp',
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
    photoBadgeTitle: 'B.Sc. in Information Technology',
    photoBadgeSub: 'ITB Ahmad Dahlan Jakarta · GPA 3.77 / 4.00',
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
    locationLabel: 'Location',
    seeDetails: 'See details',
    tasksDone: 'Tasks & Responsibilities',
    resultAchieved: 'Results & Impact',
    docPhotos: 'Activity Documentation',
    readCaseStudy: 'Read case study',
    viewDemo: 'View demo',
    pipelineCardEyebrow: 'KDD PIPELINE SUMMARY · MOBILE JKN',
    pipelineCardTitle: 'Processing 63,766 Reviews into a 94.38% Model',
    pipelineStep1: 'Raw Google Play Reviews (Jan 2025 – Jan 2026)',
    pipelineStep2: 'Text Preprocessing & Sastrawi Stemming',
    pipelineStep3: 'Hybrid Labeling (Star Rating + InSet Lexicon)',
    pipelineStep4: 'Multinomial Naive Bayes (15,000 TF-IDF Bigrams)',
    comingSoonEyebrow: 'IN EXPLORATION',
    comingSoonSlot: 'Next project — coming soon',
    comingSoonSub: 'Upcoming analytics dashboard and dataset modeling exploration.',
    usedIn: 'used in',
    zoomCert: 'Enlarge certificate image',
    verifiedCert: 'VERIFIED CREDENTIAL',
    availableFrom: 'Available from',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    openBtn: 'Open',
    openMaps: 'Open in Maps',
    backToTop: 'Back to top',
    groupData: 'Data & Analytics',
    groupMethods: 'Methods',
    groupViz: 'Visualization & Dashboards',
    groupTools: 'Work Tools',
    groupSoft: 'Personal Skills',
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
  code,
  eyebrow,
  title,
  alternate = false,
  children,
}: {
  id: string;
  code: string;
  eyebrow: string;
  title: string;
  alternate?: boolean;
  children: React.ReactNode;
}) {
  const words = title.split(' ');
  return (
    <section id={id} className={`portfolio-section ${alternate ? 'is-alt' : ''}`}>
      <div className="section-inner">
        <div className="section-eyebrow-row">
          <span className="section-index-badge">{code}</span>
          <span className="eyebrow">{eyebrow}</span>
          <span className="section-eyebrow-rule" aria-hidden="true" />
        </div>
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
  const [expZoomPhoto, setExpZoomPhoto] = useState<string>('');
  const timelineRef = useRef<HTMLDivElement>(null);

  // Certificate zoom modal state
  const [certModalIdx, setCertModalIdx] = useState<number>(-1);

  // Contact email copy state
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  // Lenis smooth scroll instance & main container ref for GSAP ScrollTrigger
  const lenisRef = useRef<Lenis | null>(null);
  const mainRef = useRef<HTMLElement>(null);

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

  // Cursor-tracking spotlight effect across surface cards
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.('.surface-card') as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mouse-x', `${(e.clientX - rect.left).toFixed(0)}px`);
      target.style.setProperty('--mouse-y', `${(e.clientY - rect.top).toFixed(0)}px`);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
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

  // Initialize Lenis Smooth Scroll + GSAP Ticker & ScrollTrigger sync
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.15,
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis when any Radix modal is open
  useEffect(() => {
    const anyDialogOpen = mobileMenuOpen || lightboxIdx >= 0 || expModalIdx >= 0 || certModalIdx >= 0;
    if (anyDialogOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [mobileMenuOpen, lightboxIdx, expModalIdx, certModalIdx]);

  // GSAP + ScrollTrigger narrative animations for section headings, cards, and timeline
  useEffect(() => {
    if (caseStudySlug) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const headings = gsap.utils.toArray<HTMLElement>('.section-h2');
      headings.forEach((h2) => {
        const words = h2.querySelectorAll('.word-inner');
        if (!words.length) return;
        gsap.fromTo(
          words,
          { yPercent: 45, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.36,
            stagger: 0.016,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: h2,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      const sections = gsap.utils.toArray<HTMLElement>('.portfolio-section');
      sections.forEach((sec) => {
        const items = sec.querySelectorAll(
          '.surface-card, .about-photo-frame, .bento-tile, .cert-card, .project-coming-slot, .contact-contrast-block, .city-map-card'
        );
        if (!items.length) return;
        gsap.from(items, {
          y: 16,
          duration: 0.48,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
          immediateRender: false,
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current,
          { '--tl-progress': 0.14 },
          {
            '--tl-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 78%',
              end: 'bottom 58%',
              scrub: 0.35,
            },
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, [caseStudySlug, lang]);

  // Top scroll progress bar & navbar avatar morph
  useEffect(() => {
    let rafId = 0;
    const updateScrollMetrics = () => {
      rafId = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      setScrolled(scrollTop > 56);
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

  // Active section observer + Floating CV visibility observer
  useEffect(() => {
    if (caseStudySlug) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
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

  // GPA Ring Count-Up Animation via GSAP
  useEffect(() => {
    if (caseStudySlug) return;
    const el = eduRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setGpaAnimated(education.gpa);
      return;
    }

    const counter = { val: 0 };
    let tween: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        tween = gsap.to(counter, {
          val: education.gpa,
          duration: 1.35,
          ease: 'power3.out',
          onUpdate: () => setGpaAnimated(counter.val),
        });
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [caseStudySlug]);

  // Circular expanding View Transition on theme switch
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

  const scrollToTarget = (selectorOrTop: string | number) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lenisRef.current && !reduceMotion) {
      lenisRef.current.scrollTo(selectorOrTop, { offset: typeof selectorOrTop === 'string' ? -76 : 0 });
    } else if (typeof selectorOrTop === 'number') {
      window.scrollTo({ top: selectorOrTop, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      const el = document.querySelector(selectorOrTop);
      el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  const navigateHash = (targetHash: string) => {
    window.location.hash = targetHash;
    setCurrentHash(targetHash);
    if (!targetHash.startsWith('#/proyek/')) {
      const id = targetHash.replace(/^#/, '');
      requestAnimationFrame(() => {
        scrollToTarget(`#${id}`);
      });
    }
  };

  const u = UI_COPY[lang];
  const cvUrl = normalizedBase + profile.cv;

  // Gallery filtering logic
  const uniqueCatKeys = Array.from(new Set(gallery.map((g) => g.catKey)));
  const filteredGallery = gallery.filter(
    (g) => selectedCat === 'all' || g.catKey === selectedCat
  );
  const visibleGallery = showAllGallery ? filteredGallery : filteredGallery.slice(0, 6);
  const activeLightboxItem = lightboxIdx >= 0 ? filteredGallery[lightboxIdx] : null;

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

  // GPA Ring SVG math
  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - gpaAnimated / education.gpaMax);
  const formattedGpa =
    lang === 'id' ? gpaAnimated.toFixed(2).replace('.', ',') : gpaAnimated.toFixed(2);
  const formattedGpaMax =
    lang === 'id' ? education.gpaMax.toFixed(2).replace('.', ',') : education.gpaMax.toFixed(2);

  const skillGroups = Array.from(new Set(skills.map((s) => s.group)));
  const toolLogos = skills.filter((s) => s.tool && s.logo);

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

  const brandMorphed = scrolled || mobileMenuOpen;

  return (
    <>
      {/* Thin Top Scroll Progress Line */}
      <div className="scroll-progress-bar" aria-hidden="true" />

      {/* Sticky Desktop Navbar / Mobile Floating Pill Navbar */}
      <header className={`site-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="navbar-inner">
          <a
            href="#top"
            className={`navbar-brand ${brandMorphed ? 'is-morphed' : ''}`}
            aria-label={profile.name}
            onClick={(e) => {
              if (caseStudySlug) {
                e.preventDefault();
                navigateHash('#top');
              } else {
                e.preventDefault();
                scrollToTarget(0);
              }
            }}
          >
            <span className="brand-text">{profile.brand}</span>
            <span className="brand-avatar-ring">
              <img
                src={normalizedBase + profile.avatar}
                alt={profile.name}
                width={34}
                height={34}
                className="brand-avatar-img"
              />
            </span>
          </a>

          {/* Desktop Section Links */}
          <nav className="navbar-links" aria-label={u.mainNav}>
            {SECTION_META.map((sec) => {
              const isActive = !caseStudySlug && activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`nav-link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateHash(`#${sec.id}`);
                  }}
                >
                  {sec.nav[lang]}
                </a>
              );
            })}
          </nav>

          {/* 3 Switches: Language (ID | EN), Theme (Light | Dark), Sound (On | Off) */}
          <div className="navbar-controls">
            <div className="segmented-pill" role="group" aria-label={u.langSwitch}>
              <button
                type="button"
                className={`pill-option ${lang === 'id' ? 'is-active' : ''}`}
                aria-pressed={lang === 'id'}
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
                className={`pill-option ${lang === 'en' ? 'is-active' : ''}`}
                aria-pressed={lang === 'en'}
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

            <div className="segmented-pill" role="group" aria-label={u.themeSwitch}>
              <button
                type="button"
                className={`pill-option ${theme === 'light' ? 'is-active' : ''}`}
                aria-label={u.lightMode}
                aria-pressed={theme === 'light'}
                onClick={(e) => handleThemeSwitch('light', e)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.55 1.55M17.52 17.52l1.55 1.55M2 12h2.2M19.8 12H22M4.93 19.07l1.55-1.55M17.52 6.48l1.55-1.55" />
                </svg>
              </button>
              <button
                type="button"
                className={`pill-option ${theme === 'dark' ? 'is-active' : ''}`}
                aria-label={u.darkMode}
                aria-pressed={theme === 'dark'}
                onClick={(e) => handleThemeSwitch('dark', e)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
              </button>
            </div>

            <div className="segmented-pill sound-pill-desktop" role="group" aria-label={u.soundSwitch}>
              <button
                type="button"
                className={`pill-option ${soundOn ? 'is-active' : ''}`}
                aria-label={u.soundOn}
                aria-pressed={soundOn}
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
                className={`pill-option ${!soundOn ? 'is-active' : ''}`}
                aria-label={u.soundOff}
                aria-pressed={!soundOn}
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

            {/* Mobile/Tablet Menu Drawer Trigger */}
            <Dialog.Root
              open={mobileMenuOpen}
              onOpenChange={(open) => {
                triggerHapticAndSound('tap');
                setMobileMenuOpen(open);
              }}
            >
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="mobile-menu-trigger"
                  aria-label={mobileMenuOpen ? u.close : u.menu}
                >
                  <span>{mobileMenuOpen ? u.close : u.menu}</span>
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
                        <Dialog.Title className="sheet-name">{profile.name}</Dialog.Title>
                        <p className="sheet-role">{t(profile.badgeRole, lang)}</p>
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
                        className={`sheet-nav-item ${activeSection === sec.id ? 'is-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          navigateHash(`#${sec.id}`);
                        }}
                      >
                        <span>{sec.nav[lang]}</span>
                      </a>
                    ))}
                  </nav>

                  <div className="mobile-sheet-footer">
                    <span className="sheet-footer-label">{u.soundSwitch}</span>
                    <div className="segmented-pill" role="group" aria-label={u.soundSwitch}>
                      <button
                        type="button"
                        className={`pill-option ${soundOn ? 'is-active' : ''}`}
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
                        className={`pill-option ${!soundOn ? 'is-active' : ''}`}
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
        <main id="top" ref={mainRef}>
          <CaseStudyView
            slug={caseStudySlug}
            lang={lang}
            baseUrl={normalizedBase}
            onNavigate={navigateHash}
          />
        </main>
      ) : (
        <main id="top" ref={mainRef}>
          {/* HERO SECTION WITH ARCHITECTURAL BLUEPRINT CANVAS & IMPACT METRICS */}
          <section className="hero-section">
            <div className="hero-grid-backdrop" aria-hidden="true" />
            <div className="section-inner hero-grid">
              <motion.div
                className="hero-copy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="hero-top-row">
                  <span className="hero-status-pill">
                    <span className="hero-status-dot" aria-hidden="true" />
                    <span>{u.heroStatus}</span>
                  </span>
                </div>

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
                    onClick={(e) => {
                      e.preventDefault();
                      triggerHapticAndSound('tap');
                      navigateHash('#proyek');
                    }}
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

                {/* Live Key Impact Metrics Bar in Hero */}
                <div className="hero-metrics-strip">
                  <div className="hero-metric-item">
                    <strong className="hero-metric-val">{lang === 'id' ? '3,77' : '3.77'}</strong>
                    <span className="hero-metric-label">{u.statGpaLabel}</span>
                  </div>
                  <div className="hero-metric-item">
                    <strong className="hero-metric-val">{lang === 'id' ? '63.766' : '63,766'}</strong>
                    <span className="hero-metric-label">{u.statReviewsLabel}</span>
                  </div>
                  <div className="hero-metric-item">
                    <strong className="hero-metric-val">{lang === 'id' ? '94,38%' : '94.38%'}</strong>
                    <span className="hero-metric-label">{u.statAccLabel}</span>
                  </div>
                  <div className="hero-metric-item">
                    <strong className="hero-metric-val">{u.statBootcampVal}</strong>
                    <span className="hero-metric-label">{u.statBootcampLabel}</span>
                  </div>
                </div>
              </motion.div>

              {/* Lazy-loaded Interactive Lanyard */}
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

          {/* 1. TENTANG */}
          <SectionHeading
            id="tentang"
            code={SECTION_META[0].code}
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
                  <div className="tech-card-header">
                    <h3 className="card-h3">{u.techHeading}</h3>
                  </div>
                  <div className="tech-groups-stack">
                    {skillGroups.map((groupName) => {
                      const groupLabelKey = GROUP_KEY_MAP[groupName];
                      const translatedGroup = groupLabelKey ? u[groupLabelKey] : groupName;
                      const groupItems = skills.filter((s) => s.group === groupName);
                      const isCompactCol =
                        groupName === 'Metode' ||
                        groupName === 'Visualisasi & Dashboard' ||
                        groupName === 'Alat Kerja';
                      return (
                        <div
                          key={groupName}
                          className={`tech-group-block ${isCompactCol ? 'is-compact-col' : 'is-full-col'}`}
                        >
                          <div className="eyebrow" style={{ marginBottom: 6 }}>
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
                  <figcaption className="about-photo-caption">
                    <span className="about-caption-dot" aria-hidden="true" />
                    <div>
                      <strong>{u.photoBadgeTitle}</strong>
                      <span>{u.photoBadgeSub}</span>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </div>
          </SectionHeading>

          {/* 2. GALERI */}
          <SectionHeading
            id="galeri"
            code={SECTION_META[1].code}
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

            <motion.div layout className="bento-gallery-grid">
              {visibleGallery.map((item, idx) => {
                const spanClass =
                  idx === 0 ? 'bento-featured' : idx === 3 || idx === 4 ? 'bento-wide' : '';
                return (
                  <motion.button
                    layout
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
                    <span className="bento-top-pill">
                      {t(item.cat, lang)} · {item.date}
                    </span>
                    <span className="bento-tile-overlay">
                      <span className="bento-caption">{t(item.caption, lang)}</span>
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>

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

            {/* Gallery Lightbox Modal */}
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
                          {u.prevPhoto}
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
                          {u.nextPhoto}
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SectionHeading>

          {/* 3. PENDIDIKAN */}
          <SectionHeading
            id="pendidikan"
            code={SECTION_META[2].code}
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

                {/* Fixed-dimension GPA Ring */}
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

              {/* Favorite Courses */}
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

          {/* 4. PENGALAMAN (Vertical timeline with inline documentation preview thumbnails & impact badges) */}
          <SectionHeading
            id="pengalaman"
            code={SECTION_META[3].code}
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
                      <div className="timeline-badges-row">
                        {item.impact && (
                          <span className="badge-pill badge-honest">{t(item.impact, lang)}</span>
                        )}
                        <span className="badge-pill">{t(item.period, lang)}</span>
                      </div>
                    </div>

                    <ul className="timeline-bullet-list">
                      {item.lines.map((line, lIdx) => (
                        <li key={lIdx} className="body-text">
                          {t(line, lang)}
                        </li>
                      ))}
                    </ul>

                    {/* Inline Thumbnail Preview Strip of Documentation Photos */}
                    {item.detail.photos.length > 0 && (
                      <div className="timeline-photo-strip">
                        {item.detail.photos.slice(0, 4).map((photoPath, pIdx) => (
                          <button
                            key={photoPath}
                            type="button"
                            className="timeline-thumb-btn"
                            onClick={() => {
                              triggerHapticAndSound('tap');
                              setExpModalIdx(idx);
                              setExpZoomPhoto(photoPath);
                            }}
                            aria-label={`${u.docPhotos} ${pIdx + 1}`}
                          >
                            <img
                              src={normalizedBase + photoPath}
                              alt={`${t(item.title, lang)} ${pIdx + 1}`}
                              className="timeline-thumb-img"
                              loading="lazy"
                            />
                            {pIdx === 3 && item.detail.photos.length > 4 && (
                              <span className="timeline-thumb-more">
                                +{item.detail.photos.length - 4}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          triggerHapticAndSound('tap');
                          setExpZoomPhoto('');
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

            {/* Experience Detail Modal */}
            <Dialog.Root
              open={expModalIdx >= 0}
              onOpenChange={(open) => {
                if (!open) {
                  setExpModalIdx(-1);
                  setExpZoomPhoto('');
                }
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

                      {expZoomPhoto ? (
                        <div className="lightbox-inner">
                          <div className="lightbox-img-stage">
                            <img
                              src={normalizedBase + expZoomPhoto}
                              alt={t(experience[expModalIdx].title, lang)}
                              className="lightbox-img"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                triggerHapticAndSound('tap');
                                setExpZoomPhoto('');
                              }}
                            >
                              {u.seeDetails}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
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
                                  <button
                                    key={photoPath}
                                    type="button"
                                    className="exp-modal-photo-btn"
                                    onClick={() => {
                                      triggerHapticAndSound('tap');
                                      setExpZoomPhoto(photoPath);
                                    }}
                                  >
                                    <img
                                      src={normalizedBase + photoPath}
                                      alt={t(experience[expModalIdx].title, lang)}
                                      className="exp-modal-img"
                                      loading="lazy"
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SectionHeading>

          {/* 5. PROYEK (Browser Window Mockup Frame + Interactive KDD Pipeline Funnel Card + Coming Soon Slot) */}
          <SectionHeading
            id="proyek"
            code={SECTION_META[4].code}
            eyebrow={SECTION_META[4].nav[lang]}
            title={SECTION_META[4].title[lang]}
          >
            <div className="projects-bento">
              {/* Primary Large Featured Project Card */}
              <article className="surface-card project-featured-card">
                <div className="project-cover-wrap">
                  <div className="browser-mockup-window">
                    <div className="browser-mockup-bar" aria-hidden="true">
                      <div className="browser-dots">
                        <span className="b-dot red" />
                        <span className="b-dot yellow" />
                        <span className="b-dot green" />
                      </div>
                      <div className="browser-url-pill">
                        ravaelchessario24.github.io/mobile-jkn-landing-page
                      </div>
                    </div>
                    <img
                      src={normalizedBase + featuredProject.cover}
                      alt={t(featuredProject.title, lang)}
                      className="project-cover-img"
                    />
                  </div>
                </div>

                <div className="project-featured-body">
                  <div className="project-meta-row">
                    <div className="cs-badges">
                      <span className="badge-pill badge-accent">
                        {t(featuredProject.categoryBadge, lang)}
                      </span>
                      <span className="badge-pill badge-honest">
                        {t(featuredProject.projectTypeLabel, lang)}
                      </span>
                    </div>
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
                        {u.viewDemo}
                      </a>
                    )}
                  </div>
                </div>
              </article>

              {/* Right Column: Interactive KDD Data Pipeline Funnel Card + Coming Soon Blueprint Slot */}
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
                        {u.readCaseStudy}
                      </a>
                    </div>
                  </article>
                ))}

                {secondaryProjects.length === 0 && (
                  <article className="surface-card project-pipeline-card">
                    <span className="eyebrow">{u.pipelineCardEyebrow}</span>
                    <h3 className="card-h3" style={{ marginTop: 6 }}>
                      {u.pipelineCardTitle}
                    </h3>

                    <div className="kdd-funnel-list">
                      <div className="kdd-funnel-row">
                        <div className="kdd-funnel-head">
                          <span>01 · {u.pipelineStep1}</span>
                          <strong className="mono-num">63.766</strong>
                        </div>
                        <div className="kdd-funnel-bar">
                          <span style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="kdd-funnel-row">
                        <div className="kdd-funnel-head">
                          <span>02 · {u.pipelineStep2}</span>
                          <strong className="mono-num">62.878</strong>
                        </div>
                        <div className="kdd-funnel-bar">
                          <span style={{ width: '98%' }} />
                        </div>
                      </div>

                      <div className="kdd-funnel-row">
                        <div className="kdd-funnel-head">
                          <span>03 · {u.pipelineStep3}</span>
                          <strong className="mono-num">59.980</strong>
                        </div>
                        <div className="kdd-funnel-bar">
                          <span style={{ width: '94%' }} />
                        </div>
                      </div>

                      <div className="kdd-funnel-row">
                        <div className="kdd-funnel-head">
                          <span>04 · {u.pipelineStep4}</span>
                          <strong className="mono-num accent-text">94,38%</strong>
                        </div>
                        <div className="kdd-funnel-bar is-emerald">
                          <span style={{ width: '94.38%' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                      <a
                        href={featuredProject.caseStudy}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%' }}
                        onClick={(e) => {
                          e.preventDefault();
                          triggerHapticAndSound('tap');
                          navigateHash(featuredProject.caseStudy);
                        }}
                      >
                        {u.readCaseStudy}
                      </a>
                    </div>
                  </article>
                )}

                <div className="project-coming-slot">
                  <span className="eyebrow">{u.comingSoonEyebrow}</span>
                  <strong className="coming-slot-title">{u.comingSoonSlot}</strong>
                  <p className="muted-text" style={{ fontSize: 13.5 }}>
                    {u.comingSoonSub}
                  </p>
                </div>
              </div>
            </div>
          </SectionHeading>

          {/* 6. KETERAMPILAN */}
          <SectionHeading
            id="keterampilan"
            code={SECTION_META[5].code}
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

          {/* 7. SERTIFIKASI */}
          <SectionHeading
            id="sertifikasi"
            code={SECTION_META[6].code}
            eyebrow={SECTION_META[6].nav[lang]}
            title={SECTION_META[6].title[lang]}
          >
            <div className="certs-grid">
              {certificates.map((cert, idx) => {
                const certTitle = t(cert.title, lang);
                const certDate = t(cert.date, lang);
                const certSummary = cert.summary ? t(cert.summary, lang) : '';
                return (
                  <div key={certTitle} className="surface-card cert-card">
                    <div className="cert-card-topbar">
                      <span className="cert-verified-pill">
                        <span className="cert-verified-dot" aria-hidden="true" />
                        {u.verifiedCert}
                      </span>
                      <span className="badge-pill">{cert.issuer}</span>
                    </div>

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
                      <div className="cert-meta-top">
                        <h3 className="cert-title">{certTitle}</h3>
                        <span className="mono-num muted-text" style={{ fontSize: 13 }}>
                          {certDate}
                        </span>
                      </div>
                      {certSummary && (
                        <p className="muted-text" style={{ marginTop: 6 }}>
                          {certSummary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Certificate Lightbox Modal */}
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

          {/* 8. KONTAK */}
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
                      {u.openBtn}
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
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => triggerHapticAndSound('tap')}
                  >
                    {u.openMaps}
                  </a>
                </div>
              </div>

              <footer className="site-footer">
                <span className="muted-text">© 2026 {profile.name}</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    triggerHapticAndSound('tap');
                    scrollToTarget(0);
                  }}
                >
                  {u.backToTop}
                </button>
              </footer>
            </div>
          </section>
        </main>
      )}

      {/* Floating Download CV Button */}
      <AnimatePresence>
        {!caseStudySlug && showFloatingCv && (
          <motion.div
            className="floating-cv-wrap is-visible"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href={cvUrl}
              download="CV_Muhammad_Ravael_Chessario_Ramdoni.pdf"
              className="floating-cv-btn"
              onClick={() => triggerHapticAndSound('tap')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{u.downloadCv}</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
