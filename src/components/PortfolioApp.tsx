import React, { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Lenis from 'lenis';
import {
  profile,
  education,
  experience as experiences,
  skills,
  certificates,
  contact,
  t,
  type Lang,
} from '../lib/content';
import { triggerHapticAndSound } from '../lib/feedback';
import CaseStudyView from './CaseStudyView';
import { RavaelSignature, SayHelloSignature, FloralMeadowFooter } from './FloralFooter';

interface PortfolioAppProps {
  baseUrl?: string;
}

export interface ShowcaseSlide {
  kind: 'image' | 'visual-card';
  src?: string;
  alt: { id: string; en: string };
  cardType?: 'coming-soon-da' | 'coming-soon-ds';
}

export interface ShowcaseItem {
  id: string;
  title: { id: string; en: string };
  category: { id: string; en: string };
  year: string;
  bgTone: string;
  aspect: 'wide' | 'portrait' | 'square';
  isComingSoon?: boolean;
  p1: { id: string; en: string };
  p2: { id: string; en: string };
  demoUrl?: string;
  caseStudySlug?: string;
  slides: ShowcaseSlide[];
}

// "Things I do" / "Proyek yang saya buat" — 1 cover image per project on the main page,
// with full slide thumbnails inside the Split-Screen Detail View.
const PROJECT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'mobile-jkn',
    title: {
      id: 'Analisis Sentimen & Dashboard Mobile JKN',
      en: 'Mobile JKN Sentiment Analysis & Dashboard',
    },
    category: {
      id: 'Machine Learning, NLP & Dashboard Streamlit',
      en: 'Machine Learning, NLP & Streamlit Dashboard',
    },
    year: '2026',
    bgTone: 'tone-sky',
    aspect: 'wide',
    p1: {
      id: 'Sistem klasifikasi sentimen end-to-end berbasis Python terhadap 63.766 ulasan pengguna aplikasi Mobile JKN di Google Play Store (Januari 2025 – Januari 2026) menggunakan kerangka kerja Knowledge Discovery in Database (KDD).',
      en: 'End-to-end Python sentiment classification pipeline analyzing 63,766 Mobile JKN user reviews from Google Play Store (January 2025 – January 2026) using the Knowledge Discovery in Database (KDD) framework.',
    },
    p2: {
      id: 'Menggabungkan Hybrid Labeling (rating bintang + InSet Lexicon) pada 59.980 ulasan berlabel seimbang, 15.000 fitur TF-IDF bigram, dan Multinomial Naive Bayes dengan akurasi 94,38% serta F1-score 94,86% ke dalam dashboard Streamlit interaktif.',
      en: 'Combined Hybrid Labeling (star rating + InSet Lexicon) across 59,980 balanced reviews, 15,000 TF-IDF bigram features, and Multinomial Naive Bayes achieving 94.38% accuracy and 94.86% F1-score in an interactive Streamlit dashboard.',
    },
    demoUrl: 'https://ravaelchessario24.github.io/mobile-jkn-landing-page/',
    caseStudySlug: 'mobile-jkn',
    slides: [
      {
        kind: 'image',
        src: 'images/projects/mobile-jkn-dashboard.webp',
        alt: {
          id: 'Ringkasan Eksekutif — Dashboard Analisis Sentimen Mobile JKN',
          en: 'Executive Summary — Mobile JKN Sentiment Analysis Dashboard',
        },
      },
      {
        kind: 'image',
        src: 'images/projects/mobile-jkn-2.webp',
        alt: {
          id: 'Statistik Dataset — Distribusi Sentimen (52,5% vs 47,5%) & Rating 1–5 Bintang',
          en: 'Dataset Statistics — Sentiment Distribution (52.5% vs 47.5%) & 1–5 Star Ratings',
        },
      },
      {
        kind: 'image',
        src: 'images/projects/mobile-jkn-3.webp',
        alt: {
          id: 'Pembobotan Kata TF-IDF — 20 Bigram Teratas & Word Cloud Sentimen Positif/Negatif',
          en: 'TF-IDF Word Weighting — Top 20 Bigrams & Positive/Negative Sentiment Word Clouds',
        },
      },
      {
        kind: 'image',
        src: 'images/projects/mobile-jkn-4.webp',
        alt: {
          id: 'Evaluasi & Model — Confusion Matrix, Kurva ROC (AUC = 0,965) & Log-Probability',
          en: 'Model Evaluation — Confusion Matrix, ROC Curve (AUC = 0.965) & Log-Probability',
        },
      },
      {
        kind: 'image',
        src: 'images/projects/mobile-jkn-5.webp',
        alt: {
          id: 'Prediksi & Pelabelan Otomatis — Unggah Dataset Excel (.xlsx)',
          en: 'Automated Prediction & Labeling — Excel (.xlsx) Dataset Upload',
        },
      },
    ],
  },
  {
    id: 'paud-flamboyan',
    title: {
      id: 'Website & CMS Sekolah — PAUD KB Flamboyan',
      en: 'School Website & CMS — PAUD KB Flamboyan',
    },
    category: {
      id: 'Web Development & Sistem Basis Data MySQL',
      en: 'Web Development & MySQL Database System',
    },
    year: '2025',
    bgTone: 'tone-lavender',
    aspect: 'wide',
    p1: {
      id: 'Merancang dan membangun website landing page serta Content Management System (CMS) untuk PAUD KB Flamboyan yang memusatkan informasi sekolah, manajemen konten dinamis, direktori guru, dan jadwal kurikulum.',
      en: 'Designed and built a responsive landing page and Content Management System (CMS) for PAUD KB Flamboyan centralizing school information, dynamic content, teacher directory, and class schedules.',
    },
    p2: {
      id: 'Meningkatkan efisiensi administrasi sekolah hingga 50% melalui digitalisasi pendataan profil guru dan silabus kegiatan ke dalam basis data MySQL yang terstruktur.',
      en: 'Improved school administrative efficiency by up to 50% by digitizing teacher profiles and activity syllabi into a structured MySQL relational database.',
    },
    // No caseStudySlug on PAUD internship project as requested by Ravael
    slides: [
      {
        kind: 'image',
        src: 'images/experience/paud-1.webp',
        alt: {
          id: 'Beranda Website PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Website Hero Page',
        },
      },
      {
        kind: 'image',
        src: 'images/experience/paud-2.webp',
        alt: {
          id: 'Statistik Sekolah, Profil, Visi & Misi PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Statistics, Profile, Vision & Mission',
        },
      },
      {
        kind: 'image',
        src: 'images/experience/paud-3.webp',
        alt: {
          id: 'Direktori Guru PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Teacher Directory',
        },
      },
      {
        kind: 'image',
        src: 'images/experience/paud-4.webp',
        alt: {
          id: 'Jadwal Harian & Kurikulum Kelas PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Daily Class Schedule & Curriculum',
        },
      },
      {
        kind: 'image',
        src: 'images/experience/paud-5.webp',
        alt: {
          id: 'Testimoni Wali Murid & Peta Lokasi PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Parent Testimonials & Location Map',
        },
      },
    ],
  },
  {
    id: 'coming-soon-da',
    title: {
      id: 'Proyek Data Analytics & BI Dashboard Berikutnya',
      en: 'Next Data Analytics & BI Dashboard Project',
    },
    category: {
      id: 'Segera Hadir · SQL, Python & Interactive Dashboard',
      en: 'Coming Soon · SQL, Python & Interactive Dashboard',
    },
    year: '2026',
    bgTone: 'tone-mint',
    aspect: 'wide',
    isComingSoon: true,
    p1: {
      id: 'Slot proyek portofolio berikutnya yang sedang disiapkan untuk studi kasus eksplorasi data (EDA), analisis metrik bisnis dengan SQL & Excel, serta visualisasi dashboard interaktif.',
      en: 'Upcoming portfolio project slot reserved for an exploratory data analysis (EDA), business KPI querying with SQL & Excel, and interactive dashboard visualization case study.',
    },
    p2: {
      id: 'Akan dilengkapi dengan dokumentasi tahapan pengolahan data, temuan utama (key insights), serta rekomendasi bisnis yang terukur.',
      en: 'Will feature step-by-step data cleaning documentation, key visual findings, and measurable business recommendations.',
    },
    slides: [
      {
        kind: 'visual-card',
        cardType: 'coming-soon-da',
        alt: {
          id: 'Proyek Data Analytics Berikutnya — Segera Hadir',
          en: 'Next Data Analytics Project — Coming Soon',
        },
      },
    ],
  },
  {
    id: 'coming-soon-ds',
    title: {
      id: 'Proyek Machine Learning & Data Science Berikutnya',
      en: 'Next Machine Learning & Data Science Project',
    },
    category: {
      id: 'Segera Hadir · Python, Scikit-Learn & Predictive Modeling',
      en: 'Coming Soon · Python, Scikit-Learn & Predictive Modeling',
    },
    year: '2026',
    bgTone: 'tone-slate',
    aspect: 'wide',
    isComingSoon: true,
    p1: {
      id: 'Slot proyek portofolio berikutnya untuk eksperimen pemodelan prediktif, feature engineering, dan evaluasi model Machine Learning berbasis Python.',
      en: 'Upcoming portfolio project slot dedicated to predictive modeling experiments, feature engineering, and Python-based Machine Learning model evaluation.',
    },
    p2: {
      id: 'Segera hadir setelah tahap pengolahan dataset dan validasi metrik evaluasi model selesai.',
      en: 'Coming soon once dataset preparation and model evaluation metric validation are completed.',
    },
    slides: [
      {
        kind: 'visual-card',
        cardType: 'coming-soon-ds',
        alt: {
          id: 'Proyek Data Science Berikutnya — Segera Hadir',
          en: 'Next Data Science Project — Coming Soon',
        },
      },
    ],
  },
];

const UI_TEXT = {
  id: {
    openToWork: 'Terbuka untuk kerja',
    letsTalk: 'Mari diskusi',
    navOverview: 'Ringkasan',
    navThings: 'Proyek',
    navExperience: 'Pengalaman',
    navEducation: 'Pendidikan',
    navContact: 'Kontak',
    overviewHeadline: 'Mengubah data mentah menjadi insight yang terukur',
    overviewBio:
      'Hai! Saya Muhammad Ravael Chessario Ramdoni — Fresh Graduate S1 Teknologi Informasi (IPK 3,77/4,00) yang berfokus pada Data Analysis dan Machine Learning. Berpengalaman membangun pipeline analisis sentimen end-to-end pada 63.766 ulasan Mobile JKN dengan akurasi 94,38% menggunakan Python, SQL, Excel, dan Streamlit.',
    thingsHeading: 'Proyek yang saya buat',
    seeAll: 'Lihat semua',
    allProjects: 'Semua proyek',
    yearLabel: 'Tahun',
    prevProject: 'Proyek sebelumnya',
    nextProject: 'Proyek berikutnya',
    viewDemo: 'Lihat demo',
    readCaseStudy: 'Baca case study',
    expHeading: 'Pengalaman',
    eduHeading: 'Pendidikan & Sertifikasi',
    contactTitle: 'Ingin berdiskusi lebih lanjut?',
    contactSub:
      'Terbuka untuk peluang Full-Time maupun Internship di bidang Data Analyst dan Data Science. Mari berdiskusi.',
    resumeLabel: 'Unduh CV',
    copiedToast: 'Email tersalin!',
    copyEmailTitle: 'Salin email',
    closeLabel: 'Tutup',
    ofLabel: 'dari',
    favCoursesLabel: 'Mata Kuliah Fokus Data',
  },
  en: {
    openToWork: 'Open to work',
    letsTalk: "Let's talk",
    navOverview: 'Overview',
    navThings: 'Things I do',
    navExperience: 'Experience',
    navEducation: 'Education',
    navContact: 'Contact',
    overviewHeadline: 'Turning raw data into measurable decisions',
    overviewBio:
      "Hey! I'm Muhammad Ravael Chessario Ramdoni — an Information Technology graduate (GPA 3.77/4.00) focused on Data Analysis and Machine Learning. Experienced in building an end-to-end sentiment analysis pipeline on 63,766 Mobile JKN reviews with 94.38% accuracy using Python, SQL, Excel, and Streamlit.",
    thingsHeading: 'Things I do',
    seeAll: 'See all',
    allProjects: 'All projects',
    yearLabel: 'Year',
    prevProject: 'Previous project',
    nextProject: 'Next project',
    viewDemo: 'View live demo',
    readCaseStudy: 'Read full case study',
    expHeading: 'Experience',
    eduHeading: 'Education & Certifications',
    contactTitle: 'What shall we create next?',
    contactSub:
      "Have an opportunity in Data Analysis or Data Science? Let's make it happen together.",
    resumeLabel: 'Resume',
    copiedToast: 'Email copied!',
    copyEmailTitle: 'Copy email',
    closeLabel: 'Close',
    ofLabel: 'of',
    favCoursesLabel: 'Core Data Coursework',
  },
} as const;

function SlideVisualCard({
  cardType,
  lang,
  compact = false,
}: {
  cardType: NonNullable<ShowcaseSlide['cardType']>;
  lang: Lang;
  compact?: boolean;
}) {
  if (cardType === 'coming-soon-da') {
    return (
      <div className={`b-visual-slide-card is-coming-soon ${compact ? 'is-compact' : ''}`}>
        <span className="b-vsc-tag">
          {lang === 'id' ? 'PROYEK BERIKUTNYA · SEGERA HADIR' : 'UPCOMING PROJECT · COMING SOON'}
        </span>
        <strong className="b-vsc-big">Data Analytics & BI</strong>
        <p className="b-vsc-title">
          {lang === 'id'
            ? 'Eksplorasi Data (EDA), SQL Querying & Interactive Dashboard'
            : 'Exploratory Data Analysis (EDA), SQL Querying & Interactive Dashboard'}
        </p>
      </div>
    );
  }

  return (
    <div className={`b-visual-slide-card is-coming-soon ${compact ? 'is-compact' : ''}`}>
      <span className="b-vsc-tag">
        {lang === 'id' ? 'PROYEK BERIKUTNYA · SEGERA HADIR' : 'UPCOMING PROJECT · COMING SOON'}
      </span>
      <strong className="b-vsc-big">Machine Learning</strong>
      <p className="b-vsc-title">
        {lang === 'id'
          ? 'Feature Engineering, Pemodelan Prediktif & Evaluasi Model'
          : 'Feature Engineering, Predictive Modeling & Model Evaluation'}
      </p>
    </div>
  );
}

export default function PortfolioApp({ baseUrl = '/' }: PortfolioAppProps) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const [lang, setLang] = useState<Lang>('id');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeNav, setActiveNav] = useState<string>('overview');

  const [viewMode, setViewMode] = useState<'stream' | 'all-projects' | 'project-detail'>('stream');
  const [activeItemIdx, setActiveItemIdx] = useState<number>(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  const [caseStudySlug, setCaseStudySlug] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const currentAttr = document.documentElement.dataset.theme as 'light' | 'dark' | undefined;
      const initialTheme = savedTheme || currentAttr || 'light';
      setTheme(initialTheme);
      document.documentElement.dataset.theme = initialTheme;

      const savedLang = localStorage.getItem('lang') as Lang | null;
      if (savedLang === 'id' || savedLang === 'en') {
        setLang(savedLang);
        document.documentElement.lang = savedLang;
      }
    } catch {}

    const syncHash = () => {
      const h = window.location.hash || '';
      if (h.startsWith('#/proyek/')) {
        setCaseStudySlug(h.replace('#/proyek/', '').trim());
      } else {
        setCaseStudySlug(null);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.95,
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

  useEffect(() => {
    if (viewMode !== 'stream' || caseStudySlug) return;
    const sectionIds = ['overview', 'things', 'experience', 'education', 'contact'];
    const onScroll = () => {
      const triggerY = window.innerHeight * 0.36;
      let current = 'overview';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            current = id;
          }
        }
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        current = 'contact';
      }
      setActiveNav(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [viewMode, caseStudySlug]);

  const scrollToSection = (id: string) => {
    triggerHapticAndSound('tap');
    if (caseStudySlug) {
      window.location.hash = '';
      setCaseStudySlug(null);
    }
    if (viewMode !== 'stream') {
      setViewMode('stream');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -64 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleThemeWithCircle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    triggerHapticAndSound('switch');

    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      setTheme(nextTheme);
      try {
        localStorage.setItem('theme', nextTheme);
      } catch {}
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const docAny = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (!docAny.startViewTransition || reduceMotion) {
      applyTheme();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const transition = docAny.startViewTransition(() => {
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
            duration: 560,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});
  };

  const selectLanguage = (next: Lang) => {
    if (next === lang) return;
    triggerHapticAndSound('switch');
    setLang(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem('lang', next);
    } catch {}
  };

  const handleCopyEmail = () => {
    triggerHapticAndSound('copy');
    try {
      navigator.clipboard.writeText(profile.email);
    } catch {}
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 1800);
  };

  const openProjectDetail = (projectIdx: number, slideIdx = 0) => {
    triggerHapticAndSound('expand');
    setActiveItemIdx(projectIdx);
    setActiveSlideIdx(slideIdx);
    setViewMode('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (key: string) => {
    const willOpen = !openAccordions[key];
    triggerHapticAndSound(willOpen ? 'expand' : 'collapse');
    setOpenAccordions((prev) => ({ ...prev, [key]: willOpen }));
  };

  const u = UI_TEXT[lang];
  const cvUrl = normalizedBase + profile.cv;
  const activeItem = PROJECT_SHOWCASE_ITEMS[activeItemIdx] || PROJECT_SHOWCASE_ITEMS[0];
  const activeSlide = activeItem.slides[activeSlideIdx] || activeItem.slides[0];

  const coreTools = skills.filter(
    (s) => s.group === 'Data & Analitik' || s.group === 'Visualisasi & Dashboard'
  );

  // Built projects vs upcoming projects (strictly 1 cover image per project!)
  const row1Projects = [PROJECT_SHOWCASE_ITEMS[0], PROJECT_SHOWCASE_ITEMS[1]];
  const row2Projects = [PROJECT_SHOWCASE_ITEMS[2], PROJECT_SHOWCASE_ITEMS[3]];

  return (
    <div className="b-root">
      {/* Fixed Left Sidebar Index (Desktop) with Smooth Falling Dot Animation */}
      {viewMode === 'stream' && !caseStudySlug && (
        <nav className="b-side-nav" aria-label="Section navigation">
          <LayoutGroup id="side-nav-dots">
            <ul>
              {[
                { id: 'overview', label: u.navOverview },
                { id: 'things', label: u.navThings },
                { id: 'experience', label: u.navExperience },
                { id: 'education', label: u.navEducation },
                { id: 'contact', label: u.navContact },
              ].map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`b-side-link ${isActive ? 'is-active' : ''}`}
                      onMouseEnter={() => triggerHapticAndSound('hover')}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="b-falling-nav-dot"
                          className="b-side-dot"
                          aria-hidden="true"
                          transition={{
                            type: 'spring',
                            stiffness: 170,
                            damping: 18,
                            mass: 0.95,
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>
      )}

      {/* Full Case Study Route View (only for Mobile JKN) */}
      {caseStudySlug ? (
        <main>
          <CaseStudyView
            slug={caseStudySlug}
            lang={lang}
            baseUrl={normalizedBase}
            onNavigate={(hash) => {
              if (hash.startsWith('#/proyek/')) {
                window.location.hash = hash;
                setCaseStudySlug(hash.replace('#/proyek/', ''));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.hash = '';
                setCaseStudySlug(null);
              }
            }}
          />
        </main>
      ) : (
        <AnimatePresence mode="wait">
          {/* VIEW 1: MAIN SINGLE-COLUMN STREAM */}
          {viewMode === 'stream' && (
            <motion.main
              key="stream-view"
              className="b-stream"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top Header: Handwritten Signature on Left + Morphing "Open to work / Let's talk" Pill on Right */}
              <header className="b-top-header">
                <a
                  href="#overview"
                  className="b-brand-link"
                  aria-label={profile.name}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('overview');
                  }}
                >
                  <RavaelSignature />
                </a>

                <div className="b-top-right">
                  <button
                    type="button"
                    className="b-work-pill"
                    onMouseEnter={() => triggerHapticAndSound('hover')}
                    onClick={() => scrollToSection('contact')}
                  >
                    <span className="b-work-default">{u.openToWork}</span>
                    <span className="b-work-hover">
                      {u.letsTalk} <span aria-hidden="true">↗</span>
                    </span>
                  </button>
                </div>
              </header>

              {/* 1. OVERVIEW */}
              <section id="overview" className="b-section b-overview-section">
                <h1 className="b-overview-title">{u.overviewHeadline}</h1>
                <p className="b-overview-bio">{u.overviewBio}</p>

                <div className="b-overview-chips" aria-label="Core technologies">
                  {coreTools.map((tool) => (
                    <span key={t(tool.name, 'id')} className="b-mini-chip">
                      {t(tool.name, lang)}
                    </span>
                  ))}
                </div>
              </section>

              {/* 2. THINGS I DO — Strictly 1 Cover Image per Project */}
              <section id="things" className="b-section">
                <div className="b-section-head">
                  <h2 className="b-section-title">{u.thingsHeading}</h2>
                  <button
                    type="button"
                    className="b-text-action"
                    onMouseEnter={() => triggerHapticAndSound('hover')}
                    onClick={() => {
                      triggerHapticAndSound('expand');
                      setViewMode('all-projects');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {u.seeAll}
                  </button>
                </div>

                <div className="b-carousel-rows">
                  {/* Row 1 — 1 Cover Image per Built Project */}
                  <div className="b-marquee-viewport">
                    <div className="b-marquee-track">
                      {[0, 1].map((dup) => (
                        <div
                          key={`r1-${dup}`}
                          className="b-marquee-group"
                          aria-hidden={dup > 0 ? 'true' : undefined}
                        >
                          {row1Projects.map((proj) => {
                            const projIdx = PROJECT_SHOWCASE_ITEMS.findIndex(
                              (x) => x.id === proj.id
                            );
                            const coverSlide = proj.slides[0];
                            return (
                              <button
                                key={`${dup}-${proj.id}`}
                                type="button"
                                tabIndex={dup === 0 ? 0 : -1}
                                className={`b-showcase-card ${proj.bgTone} is-${proj.aspect}`}
                                onMouseEnter={() => triggerHapticAndSound('hover')}
                                onClick={() => openProjectDetail(projIdx, 0)}
                              >
                                <div className="b-card-inner-frame">
                                  {coverSlide.kind === 'image' && coverSlide.src ? (
                                    <img
                                      src={normalizedBase + coverSlide.src}
                                      alt={t(proj.title, lang)}
                                      className="b-card-img"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <SlideVisualCard
                                      cardType={coverSlide.cardType!}
                                      lang={lang}
                                      compact
                                    />
                                  )}
                                </div>
                                <span className="b-card-count-pill">
                                  1 {u.ofLabel} {proj.slides.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2 — 1 Cover Image per Upcoming Project Slot */}
                  <div className="b-marquee-viewport">
                    <div className="b-marquee-track is-reverse">
                      {[0, 1].map((dup) => (
                        <div
                          key={`r2-${dup}`}
                          className="b-marquee-group"
                          aria-hidden={dup > 0 ? 'true' : undefined}
                        >
                          {row2Projects.map((proj) => {
                            const projIdx = PROJECT_SHOWCASE_ITEMS.findIndex(
                              (x) => x.id === proj.id
                            );
                            const coverSlide = proj.slides[0];
                            return (
                              <button
                                key={`${dup}-${proj.id}`}
                                type="button"
                                tabIndex={dup === 0 ? 0 : -1}
                                className={`b-showcase-card ${proj.bgTone} is-${proj.aspect}`}
                                onMouseEnter={() => triggerHapticAndSound('hover')}
                                onClick={() => openProjectDetail(projIdx, 0)}
                              >
                                <div className="b-card-inner-frame">
                                  {coverSlide.kind === 'image' && coverSlide.src ? (
                                    <img
                                      src={normalizedBase + coverSlide.src}
                                      alt={t(proj.title, lang)}
                                      className="b-card-img"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <SlideVisualCard
                                      cardType={coverSlide.cardType!}
                                      lang={lang}
                                      compact
                                    />
                                  )}
                                </div>
                                <span className="b-card-count-pill">
                                  1 {u.ofLabel} {proj.slides.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. EXPERIENCE (Interactive Click-to-Expand Accordion Rows with Logos, No Underline) */}
              <section id="experience" className="b-section">
                <div className="b-section-head">
                  <h2 className="b-section-title">{u.expHeading}</h2>
                </div>

                <div className="b-accordion-list">
                  {experiences.map((exp, idx) => {
                    const accKey = `exp-${idx}`;
                    const isOpen = !!openAccordions[accKey];
                    const isKKN = exp.org.toLowerCase().includes('itb');
                    const tasks = exp.detail.tasks.map((item) => t(item, lang));
                    const resultLine = t(exp.detail.result, lang);
                    const photos = exp.detail.photos || [];
                    const expTitle = t(exp.title, lang);

                    return (
                      <div key={accKey} className={`b-acc-item ${isOpen ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="b-acc-trigger"
                          aria-expanded={isOpen}
                          onMouseEnter={() => triggerHapticAndSound('hover')}
                          onClick={() => toggleAccordion(accKey)}
                        >
                          <div className="b-acc-left">
                            {isKKN ? (
                              <img
                                src={
                                  normalizedBase +
                                  (theme === 'dark' && education.logoDark
                                    ? education.logoDark
                                    : education.logo)
                                }
                                alt={exp.org}
                                className="b-acc-logo-img"
                              />
                            ) : (
                              <span className="b-acc-logo tone-lavender-badge" aria-hidden="true">
                                KB
                              </span>
                            )}
                            <div className="b-acc-titles">
                              <strong className="b-acc-role">{expTitle}</strong>
                              <span className="b-acc-org">{exp.org}</span>
                            </div>
                          </div>
                          <span className="b-acc-period">{t(exp.period, lang)}</span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="b-acc-panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className="b-acc-panel-inner">
                                {[...tasks, resultLine].map((line, li) => (
                                  <p key={li} className="b-acc-p">
                                    {line}
                                  </p>
                                ))}
                                {photos.length > 0 && (
                                  <div className="b-acc-thumbs">
                                    {photos.map((phSrc, pi) => (
                                      <button
                                        key={pi}
                                        type="button"
                                        className="b-acc-thumb-btn"
                                        onClick={() => {
                                          triggerHapticAndSound('tap');
                                          setZoomImage({
                                            src: normalizedBase + phSrc,
                                            title: `${expTitle} — ${exp.org} (${pi + 1})`,
                                          });
                                        }}
                                      >
                                        <img
                                          src={normalizedBase + phSrc}
                                          alt={`${expTitle} (${pi + 1})`}
                                          loading="lazy"
                                        />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 4. EDUCATION & CERTIFICATIONS */}
              <section id="education" className="b-section">
                <div className="b-section-head">
                  <h2 className="b-section-title">{u.eduHeading}</h2>
                </div>

                <div className="b-accordion-list">
                  {/* ITB Ahmad Dahlan Jakarta Education Row */}
                  {(() => {
                    const accKey = 'edu-itbad';
                    const isOpen = !!openAccordions[accKey];
                    return (
                      <div className={`b-acc-item ${isOpen ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="b-acc-trigger"
                          aria-expanded={isOpen}
                          onMouseEnter={() => triggerHapticAndSound('hover')}
                          onClick={() => toggleAccordion(accKey)}
                        >
                          <div className="b-acc-left">
                            <img
                              src={
                                normalizedBase +
                                (theme === 'dark' && education.logoDark
                                  ? education.logoDark
                                  : education.logo)
                              }
                              alt={education.school}
                              className="b-acc-logo-img"
                            />
                            <div className="b-acc-titles">
                              <strong className="b-acc-role">{education.school}</strong>
                              <span className="b-acc-org">
                                {t(education.degree, lang)} ·{' '}
                                {lang === 'id' ? 'IPK 3,77 / 4,00' : 'GPA 3.77 / 4.00'}
                              </span>
                            </div>
                          </div>
                          <span className="b-acc-period">{education.period}</span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="b-acc-panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className="b-acc-panel-inner">
                                <p className="b-acc-p">{t(education.nomination, lang)}</p>
                                <div className="b-acc-sublabel">{u.favCoursesLabel}:</div>
                                <div className="b-overview-chips">
                                  {education.favorites.map((c, ci) => (
                                    <span key={ci} className="b-mini-chip">
                                      {t(c, lang)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  {/* Certificates Rows (DSAREA & Coursera Google IT Support) */}
                  {certificates.map((cert, idx) => {
                    const accKey = `cert-${idx}`;
                    const isOpen = !!openAccordions[accKey];
                    const isDsarea = cert.issuer.toLowerCase().includes('dsarea');
                    const certTitle = t(cert.title, lang);

                    return (
                      <div key={accKey} className={`b-acc-item ${isOpen ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="b-acc-trigger"
                          aria-expanded={isOpen}
                          onMouseEnter={() => triggerHapticAndSound('hover')}
                          onClick={() => toggleAccordion(accKey)}
                        >
                          <div className="b-acc-left">
                            <span
                              className={`b-acc-logo ${
                                isDsarea ? 'tone-mint-badge' : 'tone-slate-badge'
                              }`}
                              aria-hidden="true"
                            >
                              {isDsarea ? 'DA' : 'G'}
                            </span>
                            <div className="b-acc-titles">
                              <strong className="b-acc-role">{certTitle}</strong>
                              <span className="b-acc-org">{cert.issuer}</span>
                            </div>
                          </div>
                          <span className="b-acc-period">{t(cert.date, lang)}</span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="b-acc-panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div className="b-acc-panel-inner">
                                {cert.summary && (
                                  <p className="b-acc-p">{t(cert.summary, lang)}</p>
                                )}
                                <button
                                  type="button"
                                  className="b-cert-preview-btn"
                                  onClick={() => {
                                    triggerHapticAndSound('tap');
                                    setZoomImage({
                                      src: normalizedBase + cert.image,
                                      title: `${certTitle} — ${cert.issuer}`,
                                    });
                                  }}
                                >
                                  <img
                                    src={normalizedBase + cert.image}
                                    alt={certTitle}
                                    loading="lazy"
                                  />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 5. CONTACT ("What shall we create next?" + Handwritten "say hello!") */}
              <section id="contact" className="b-section b-contact-section">
                <h2 className="b-contact-title">{u.contactTitle}</h2>
                <p className="b-contact-sub">{u.contactSub}</p>

                <div className="b-sayhello-row">
                  <button
                    type="button"
                    className="b-sayhello-btn"
                    onMouseEnter={() => triggerHapticAndSound('hover')}
                    onClick={handleCopyEmail}
                    title={`${u.copyEmailTitle}: ${profile.email}`}
                  >
                    <SayHelloSignature />
                  </button>
                  {emailCopied && <span className="b-copied-badge">{u.copiedToast}</span>}
                </div>
              </section>
            </motion.main>
          )}

          {/* VIEW 2: "SEE ALL" ALL PROJECTS GRID (1 Cover Image per Project) */}
          {viewMode === 'all-projects' && (
            <motion.main
              key="all-projects-view"
              className="b-all-projects"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="b-all-header">
                <h1 className="b-all-title">{u.allProjects}</h1>
                <button
                  type="button"
                  className="b-icon-close"
                  aria-label={u.closeLabel}
                  onClick={() => {
                    triggerHapticAndSound('collapse');
                    setViewMode('stream');
                  }}
                >
                  ×
                </button>
              </div>

              <div className="b-all-grid">
                {PROJECT_SHOWCASE_ITEMS.map((item, idx) => {
                  const cover = item.slides[0];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="b-all-card"
                      onMouseEnter={() => triggerHapticAndSound('hover')}
                      onClick={() => openProjectDetail(idx, 0)}
                    >
                      <div className={`b-all-thumb ${item.bgTone}`}>
                        <div className="b-card-inner-frame">
                          {cover.kind === 'image' && cover.src ? (
                            <img
                              src={normalizedBase + cover.src}
                              alt={t(item.title, lang)}
                              className="b-card-img"
                              loading="lazy"
                            />
                          ) : (
                            <SlideVisualCard cardType={cover.cardType!} lang={lang} compact />
                          )}
                        </div>
                      </div>
                      <span className="b-all-card-label">{t(item.title, lang)}</span>
                      <span className="b-all-card-sub">{t(item.category, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.main>
          )}

          {/* VIEW 3: SPLIT-SCREEN PROJECT DETAIL VIEW */}
          {viewMode === 'project-detail' && (
            <motion.main
              key={`detail-${activeItem.id}`}
              className="b-detail-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="b-detail-layout">
                {/* Left Meta Column */}
                <aside className="b-detail-meta">
                  <h1 className="b-detail-title">{t(activeItem.title, lang)}</h1>
                  <p className="b-detail-p">{t(activeItem.p1, lang)}</p>
                  <p className="b-detail-p">{t(activeItem.p2, lang)}</p>

                  <div className="b-detail-year">
                    <span>{u.yearLabel}</span>
                    <strong>{activeItem.year}</strong>
                  </div>

                  {(activeItem.demoUrl || activeItem.caseStudySlug) && (
                    <div className="b-detail-links">
                      {activeItem.demoUrl && (
                        <a
                          href={activeItem.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="b-inline-btn is-primary"
                          onClick={() => triggerHapticAndSound('tap')}
                        >
                          {u.viewDemo} ↗
                        </a>
                      )}
                      {activeItem.caseStudySlug && (
                        <button
                          type="button"
                          className="b-inline-btn"
                          onClick={() => {
                            triggerHapticAndSound('expand');
                            window.location.hash = `#/proyek/${activeItem.caseStudySlug}`;
                            setCaseStudySlug(activeItem.caseStudySlug!);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {u.readCaseStudy}
                        </button>
                      )}
                    </div>
                  )}
                </aside>

                {/* Right Showcase Stage + Thumbnail Switcher + Prev/Next */}
                <section className="b-detail-stage-col">
                  <div className="b-detail-topbar">
                    <button
                      type="button"
                      className="b-icon-close"
                      aria-label="Back"
                      onClick={() => {
                        triggerHapticAndSound('collapse');
                        setViewMode('stream');
                      }}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="b-icon-close"
                      aria-label={u.closeLabel}
                      onClick={() => {
                        triggerHapticAndSound('collapse');
                        setViewMode('stream');
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Main Preview Card */}
                  <div className={`b-detail-hero-card ${activeItem.bgTone}`}>
                    <div className="b-detail-hero-inner">
                      {activeSlide.kind === 'image' && activeSlide.src ? (
                        <img
                          src={normalizedBase + activeSlide.src}
                          alt={t(activeSlide.alt, lang)}
                          className="b-detail-main-img"
                          onClick={() => {
                            triggerHapticAndSound('tap');
                            setZoomImage({
                              src: normalizedBase + activeSlide.src!,
                              title: t(activeSlide.alt, lang),
                            });
                          }}
                        />
                      ) : (
                        <SlideVisualCard cardType={activeSlide.cardType!} lang={lang} />
                      )}
                    </div>
                  </div>

                  {/* Bottom Thumbnail Strip Switcher */}
                  {activeItem.slides.length > 1 && (
                    <div className="b-detail-thumbs" role="tablist">
                      {activeItem.slides.map((sl, sIdx) => {
                        const isSelected = sIdx === activeSlideIdx;
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            className={`b-detail-thumb-item ${isSelected ? 'is-active' : ''}`}
                            onMouseEnter={() => triggerHapticAndSound('hover')}
                            onClick={() => {
                              triggerHapticAndSound('tap');
                              setActiveSlideIdx(sIdx);
                            }}
                          >
                            {sl.kind === 'image' && sl.src ? (
                              <img
                                src={normalizedBase + sl.src}
                                alt={t(sl.alt, lang)}
                                loading="lazy"
                              />
                            ) : (
                              <span className="b-thumb-card-num">0{sIdx + 1}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Previous project / Next project navigation */}
                  <div className="b-detail-prevnext">
                    <button
                      type="button"
                      className="b-text-action"
                      onMouseEnter={() => triggerHapticAndSound('hover')}
                      onClick={() => {
                        triggerHapticAndSound('tap');
                        const prevIdx =
                          (activeItemIdx - 1 + PROJECT_SHOWCASE_ITEMS.length) %
                          PROJECT_SHOWCASE_ITEMS.length;
                        setActiveItemIdx(prevIdx);
                        setActiveSlideIdx(0);
                      }}
                    >
                      {u.prevProject}
                    </button>
                    <button
                      type="button"
                      className="b-text-action"
                      onMouseEnter={() => triggerHapticAndSound('hover')}
                      onClick={() => {
                        triggerHapticAndSound('tap');
                        const nextIdx = (activeItemIdx + 1) % PROJECT_SHOWCASE_ITEMS.length;
                        setActiveItemIdx(nextIdx);
                        setActiveSlideIdx(0);
                      }}
                    >
                      {u.nextProject}
                    </button>
                  </div>
                </section>
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      )}

      {/* Interactive Physics Grass Meadow Footer across bottom edge */}
      {viewMode === 'stream' && !caseStudySlug && <FloralMeadowFooter />}

      {/* Floating Bottom Pill Dock (Sound toggle removed — sound is active by default) */}
      <div className="b-bottom-dock" role="toolbar" aria-label="Quick actions and settings">
        <a
          href={cvUrl}
          download="CV_Muhammad_Ravael_Chessario_Ramdoni.pdf"
          className="b-dock-resume"
          onMouseEnter={() => triggerHapticAndSound('hover')}
          onClick={() => triggerHapticAndSound('tap')}
        >
          {u.resumeLabel}
        </a>

        <span className="b-dock-divider" aria-hidden="true" />

        {/* Email Copy Button */}
        <button
          type="button"
          className="b-dock-icon"
          aria-label={u.copyEmailTitle}
          title={`${u.copyEmailTitle}: ${profile.email}`}
          onMouseEnter={() => triggerHapticAndSound('hover')}
          onClick={handleCopyEmail}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </button>

        {/* LinkedIn Button */}
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="b-dock-icon"
          aria-label="LinkedIn"
          title="LinkedIn"
          onMouseEnter={() => triggerHapticAndSound('hover')}
          onClick={() => triggerHapticAndSound('tap')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>

        {/* Location Maps (Tangerang) */}
        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="b-dock-icon"
          aria-label={contact.location}
          title={contact.location}
          onMouseEnter={() => triggerHapticAndSound('hover')}
          onClick={() => triggerHapticAndSound('tap')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </a>

        <span className="b-dock-divider" aria-hidden="true" />

        {/* Explicit Segmented ID | EN Switch */}
        <div className="b-dock-lang-seg" role="group" aria-label="Language switch">
          <button
            type="button"
            className={`b-lang-opt ${lang === 'id' ? 'is-active' : ''}`}
            aria-pressed={lang === 'id'}
            onClick={() => selectLanguage('id')}
          >
            ID
          </button>
          <button
            type="button"
            className={`b-lang-opt ${lang === 'en' ? 'is-active' : ''}`}
            aria-pressed={lang === 'en'}
            onClick={() => selectLanguage('en')}
          >
            EN
          </button>
        </div>

        {/* Dark / Light Theme Toggle */}
        <button
          type="button"
          className="b-dock-icon"
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          onMouseEnter={() => triggerHapticAndSound('hover')}
          onClick={toggleThemeWithCircle}
        >
          {theme === 'light' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2m-7.07-14.93 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </button>
      </div>

      {/* Lightbox Modal for Enlarged Certificates & Photos */}
      <Dialog.Root
        open={!!zoomImage}
        onOpenChange={(open) => {
          if (!open) setZoomImage(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="radix-overlay" />
          <Dialog.Content className="radix-dialog-content" aria-describedby={undefined}>
            {zoomImage && (
              <div className="lightbox-inner">
                <div className="dialog-header">
                  <Dialog.Title className="card-h3">{zoomImage.title}</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="b-inline-btn"
                      onClick={() => triggerHapticAndSound('collapse')}
                    >
                      {u.closeLabel}
                    </button>
                  </Dialog.Close>
                </div>
                <div className="lightbox-img-stage">
                  <img src={zoomImage.src} alt={zoomImage.title} className="lightbox-img" />
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
