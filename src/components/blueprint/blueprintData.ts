import type { ComponentType } from 'react';
import {
  Database,
  FileSpreadsheet,
  BarChart3,
  LineChart,
  Sparkles,
  BrainCircuit,
  Table2,
  Globe,
} from 'lucide-react';
import {
  SiPython,
  SiMysql,
  SiGooglesheets,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiStreamlit,
  SiJupyter,
  SiGooglecolab,
} from 'react-icons/si';
import type { Lang } from '../../lib/content';
import rawAnime from '../../content/anime.json';
import rawMusic from '../../content/music.json';
import rawMemories from '../../content/memories.json';

export type TechIcon = ComponentType<{ className?: string }>;

export type TechKey =
  | 'python'
  | 'sql'
  | 'mysql'
  | 'excel'
  | 'sheets'
  | 'pandas'
  | 'numpy'
  | 'sklearn'
  | 'matplotlib'
  | 'seaborn'
  | 'streamlit'
  | 'jupyter'
  | 'colab'
  | 'nlp'
  | 'cms';

export const iconMap: Record<TechKey, TechIcon> = {
  python: SiPython,
  sql: Database,
  mysql: SiMysql,
  excel: FileSpreadsheet,
  sheets: SiGooglesheets,
  pandas: SiPandas,
  numpy: SiNumpy,
  sklearn: SiScikitlearn,
  matplotlib: BarChart3,
  seaborn: LineChart,
  streamlit: SiStreamlit,
  jupyter: SiJupyter,
  colab: SiGooglecolab,
  nlp: Sparkles,
  cms: Globe,
};

export const techNames: Record<TechKey, string> = {
  python: 'Python',
  sql: 'SQL',
  mysql: 'MySQL',
  excel: 'Microsoft Excel',
  sheets: 'Google Sheets',
  pandas: 'Pandas',
  numpy: 'NumPy',
  sklearn: 'Scikit-Learn',
  matplotlib: 'Matplotlib',
  seaborn: 'Seaborn',
  streamlit: 'Streamlit',
  jupyter: 'Jupyter Notebook',
  colab: 'Google Colab',
  nlp: 'TF-IDF & InSet Lexicon',
  cms: 'Web CMS',
};

export interface BlueprintExperience {
  id: string;
  title: string;
  role: { id: string; en: string };
  dates: { id: string; en: string };
  location: { id: string; en: string };
  src: string;
  type: { id: string; en: string };
  imageFit?: 'contain' | 'cover';
  points: { id: string[]; en: string[] };
  tech: ({ id: string; en: string } | string)[];
  metrics?: { label: { id: string; en: string }; value: string }[];
  photos: { src: string; caption: { id: string; en: string } }[];
}

export const blueprintExperiences: BlueprintExperience[] = [
  {
    id: 'magang-paud',
    title: 'PAUD KB Flamboyan',
    role: {
      id: 'Junior Web Developer Intern',
      en: 'Junior Web Developer Intern',
    },
    dates: { id: 'Mar 2025 – Mei 2025', en: 'Mar 2025 – May 2025' },
    location: { id: 'Tangerang, Indonesia', en: 'Tangerang, Indonesia' },
    src: 'images/experience/paud-1.webp',
    type: { id: 'Magang · On-site', en: 'Internship · On-site' },
    imageFit: 'cover',
    points: {
      id: [
        'Website & CMS Terpusat: Saya merancang dan membangun website profil resmi PAUD beserta CMS-nya, sehingga informasi akademik, direktori pengajar, dan silabus kurikulum dapat dikelola secara dinamis dari satu tempat.',
        'Basis Data Pengganti Catatan Manual: Saya menyusun skema database relasional MySQL untuk menggantikan pencatatan manual yang tersebar, dan waktu kerja administrasi sekolah berkurang hingga 50%.',
        'Nyaman di Semua Layar: Saya membangun antarmuka yang mudah dibuka dari ponsel maupun desktop, supaya orang tua murid bisa melihat jadwal kelas, profil guru, dan informasi pendaftaran tanpa repot.',
      ],
      en: [
        "One Central Website & CMS: I designed and built the school's official website together with its CMS, so academic updates, the teacher directory, and class curricula can be managed dynamically from one place.",
        'A Database Replacing Scattered Notes: I structured a relational MySQL schema to replace fragmented manual records, cutting administrative processing time by up to 50%.',
        'Comfortable on Every Screen: I built an interface that opens smoothly on phones and desktops, so parents can check class schedules, teacher profiles, and enrollment details without hassle.',
      ],
    },
    tech: ['MySQL', 'SQL', 'Web CMS', 'Relational Schema', 'HTML/CSS', 'Responsive UI'],
    metrics: [
      { label: { id: 'Efisiensi Admin', en: 'Admin Efficiency' }, value: '+50%' },
      { label: { id: 'Basis Data', en: 'Database' }, value: 'MySQL' },
      { label: { id: 'Modul Sistem', en: 'CMS Modules' }, value: '5 Modul' },
      { label: { id: 'Periode', en: 'Duration' }, value: 'Mar–Mei 2025' },
    ],
    photos: [
      {
        src: 'images/experience/paud-1.webp',
        caption: {
          id: 'Beranda Utama Website Resmi PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Official Website Hero Section',
        },
      },
      {
        src: 'images/experience/paud-2.webp',
        caption: {
          id: 'Ringkasan Statistik Sekolah, Profil, Visi & Misi PAUD KB Flamboyan',
          en: 'School Key Statistics, Institutional Profile, Vision & Mission',
        },
      },
      {
        src: 'images/experience/paud-3.webp',
        caption: {
          id: 'Direktori Profil Tenaga Pendidik Terintegrasi Database MySQL',
          en: 'Structured Educator Directory Backed by MySQL Database',
        },
      },
      {
        src: 'images/experience/paud-4.webp',
        caption: {
          id: 'Manajemen Jadwal Harian & Kurikulum Kelas (Play Group, Kelas A, Kelas B)',
          en: 'Daily Class Schedule & Curriculum Module (Play Group, Class A, Class B)',
        },
      },
      {
        src: 'images/experience/paud-5.webp',
        caption: {
          id: 'Ulasan Orang Tua Murid & Integrasi Peta Lokasi Sekolah',
          en: 'Parent Testimonials & Interactive Location Map Integration',
        },
      },
    ],
  },
  {
    id: 'kkn-digimapan',
    title: 'KKN Digimapan — ITB Ahmad Dahlan Jakarta',
    role: {
      id: 'Divisi Acara · Pengabdian Masyarakat',
      en: 'Events Division · Community Engagement',
    },
    dates: { id: '2025', en: '2025' },
    location: {
      id: 'Desa Lebak Wangi, Kab. Tangerang',
      en: 'Lebak Wangi Village, Tangerang Regency',
    },
    src: 'images/digimapan-logo.webp',
    type: { id: 'Lapangan', en: 'Field Program' },
    imageFit: 'contain',
    points: {
      id: [
        'Literasi Digital untuk Siswa SD: Saya menggagas dan memfasilitasi pengenalan komputer dasar bagi siswa Sekolah Dasar, memakai Typingcore untuk melatih ketepatan mengetik dan Microsoft Paint untuk melatih koordinasi kursor.',
        'Acara yang Berjalan Rapi: Saya menyusun rundown dan jadwal lintas divisi, serta berkoordinasi dengan pemangku kepentingan desa agar seluruh program KKN Digimapan tepat sasaran.',
        'Praktik yang Merata: Dengan belajar kelompok kecil secara bergiliran, 100% siswa peserta mendapat pengalaman langsung mengoperasikan laptop.',
      ],
      en: [
        'Digital Literacy for Elementary Students: I initiated and facilitated foundational computer workshops for elementary students, using Typingcore to build typing accuracy and Microsoft Paint to build cursor coordination.',
        'Events That Run Smoothly: I drafted the rundown and cross-division schedule and coordinated with village stakeholders so every KKN Digimapan program landed as planned.',
        'Practice for Everyone: With rotating small-group sessions, 100% of participating students got hands-on time operating a laptop.',
      ],
    },
    tech: [
      'Digital Literacy',
      'Typingcore',
      'Microsoft Paint',
      'Program Coordination',
      { id: 'Pemecahan Masalah', en: 'Problem Solving' },
    ],
    metrics: [
      { label: { id: 'Sasaran Utama', en: 'Target Group' }, value: 'Siswa SD' },
      { label: { id: 'Lokasi', en: 'Location' }, value: 'Lebak Wangi' },
      { label: { id: 'Program', en: 'Initiative' }, value: 'Digimapan' },
      { label: { id: 'Tahun', en: 'Year' }, value: '2025' },
    ],
    photos: [
      {
        src: 'images/gallery/kkn-1.webp',
        caption: {
          id: 'Tim Pelaksana KKN Digimapan ITB Ahmad Dahlan di Desa Lebak Wangi',
          en: 'ITB Ahmad Dahlan Digimapan KKN Team in Lebak Wangi Village',
        },
      },
      {
        src: 'images/gallery/kkn-2.webp',
        caption: {
          id: 'Pendampingan Langsung Siswa SD Berlatih Mengetik & Mengarahkan Kursor',
          en: 'Hands-on Mentoring for Elementary Students on Typing & Cursor Control',
        },
      },
      {
        src: 'images/gallery/kkn-3.webp',
        caption: {
          id: 'Sesi Praktik Komputer Dasar Berkelompok Menggunakan Typingcore & Paint',
          en: 'Small-Group Computer Lab Session Using Typingcore & Microsoft Paint',
        },
      },
      {
        src: 'images/gallery/kkn-4.webp',
        caption: {
          id: 'Antusiasme Siswa Sekolah Dasar dalam Kelas Literasi Digital',
          en: 'Student Participation During the Elementary Digital Literacy Workshop',
        },
      },
      {
        src: 'images/gallery/kkn-5.webp',
        caption: {
          id: 'Dokumentasi Kolaborasi Edukasi Tim KKN Bersama Siswa Desa Lebak Wangi',
          en: 'Educational Collaboration Between KKN Facilitators and Local Students',
        },
      },
      {
        src: 'images/gallery/kkn-6.webp',
        caption: {
          id: 'Penutupan Rangkaian Program Pengabdian KKN Digimapan 2025',
          en: 'Closing Ceremony of the 2025 KKN Digimapan Community Program',
        },
      },
    ],
  },
];

export interface BlueprintProject {
  slug: string;
  title: { id: string; en: string };
  imageTitle: string;
  src: string;
  gallery: { src: string; caption: { id: string; en: string } }[];
  description: { id: string; en: string };
  longDescription: { id: string[]; en: string[] };
  tech: TechKey[];
  live?: string;
  downloads?: { file: string; label: { id: string; en: string } }[];
  status: 'live' | 'building' | 'research' | 'coming-soon';
  hasPin: boolean;
  isComingSoon?: boolean;
  metrics?: { label: { id: string; en: string }; value: string }[];
}

export const blueprintProjects: BlueprintProject[] = [
  {
    slug: 'mobile-jkn',
    title: {
      id: 'Analisis Sentimen & Dashboard Interaktif Mobile JKN',
      en: 'Mobile JKN Sentiment Analysis & Interactive Dashboard',
    },
    imageTitle: 'Mobile JKN Streamlit Dashboard',
    src: 'images/projects/mobile-jkn-dashboard.webp',
    gallery: [
      {
        src: 'images/projects/mobile-jkn-dashboard.webp',
        caption: {
          id: 'Ringkasan Eksekutif — Dashboard Analisis Sentimen Mobile JKN (59.980 Ulasan Berlabel · Akurasi Uji 94,38%)',
          en: 'Executive Summary — Mobile JKN Sentiment Dashboard (59,980 Labeled Reviews · 94.38% Test Accuracy)',
        },
      },
      {
        src: 'images/projects/mobile-jkn-2.webp',
        caption: {
          id: 'Eksplorasi Dataset — Proporsi Sentimen Seimbang (31.470 Positif : 28.510 Negatif) & Distribusi Rating 1–5',
          en: 'Dataset Exploration — Balanced Sentiment Split (31,470 Positive : 28,510 Negative) & 1–5 Star Distribution',
        },
      },
      {
        src: 'images/projects/mobile-jkn-3.webp',
        caption: {
          id: 'Ekstraksi Fitur TF-IDF — 20 Bigram Dominan Pemeta Kendala Login/Verifikasi & Word Cloud Sentimen',
          en: 'TF-IDF Feature Extraction — Top 20 Bigrams Highlighting Login/Verification Pain Points & Word Clouds',
        },
      },
      {
        src: 'images/projects/mobile-jkn-4.webp',
        caption: {
          id: 'Evaluasi Model — Confusion Matrix (80:20), Presisi 91,15%, Recall 98,89%, F1 94,86% & ROC AUC 0,965',
          en: 'Model Evaluation — Confusion Matrix (80:20), 91.15% Precision, 98.89% Recall, 94.86% F1 & 0.965 ROC AUC',
        },
      },
      {
        src: 'images/projects/mobile-jkn-5.webp',
        caption: {
          id: 'Inferensi Batch Otomatis — Modul Unggah File Excel (.xlsx) untuk Klasifikasi Sentimen Ulasan Baru',
          en: 'Automated Batch Inference — Excel (.xlsx) Upload Module for Real-Time Sentiment Classification',
        },
      },
    ],
    description: {
      id: 'Apa kata 63.766 ulasan tentang Mobile JKN? Saya membangun pipeline NLP end-to-end untuk menjawabnya: ulasan Google Play Store (Jan 2025 – Jan 2026) dilabeli dengan Hybrid Labeling (InSet Lexicon), diubah menjadi 15.000 fitur TF-IDF bigram, lalu diklasifikasi dengan Multinomial Naive Bayes (akurasi 94,38%, F1-Score 94,86%, ROC AUC 0,965).',
      en: 'What do 63,766 Mobile JKN reviews really say? I built an end-to-end NLP pipeline to find out: Google Play Store reviews (Jan 2025 – Jan 2026) were labeled with Hybrid Labeling (InSet Lexicon), turned into 15,000 TF-IDF bigram features, and classified with Multinomial Naive Bayes (94.38% accuracy, 94.86% F1-Score, 0.965 ROC AUC).',
    },
    longDescription: {
      id: [
        'Data Besar, Dibersihkan Sampai Siap Pakai: Saya mengumpulkan 63.766 ulasan mentah pengguna Mobile JKN dari Google Play Store (Januari 2025 – Januari 2026) dan mengolahnya dengan kerangka Knowledge Discovery in Databases (KDD). Lewat case folding, normalisasi kata tidak baku, penghapusan stopword, dan stemming selektif Sastrawi, tersisa 62.878 teks bersih yang siap dianalisis.',
        'Pelabelan Hibrida, karena Bintang Saja Tidak Cukup: Saya menggabungkan skor rating bintang dengan kamus sentimen bahasa Indonesia InSet Lexicon, menghasilkan 59.980 data berlabel yang seimbang (31.470 positif : 28.510 negatif). Pendekatan ini membuka dua temuan penting: 89% ulasan bintang 3 ternyata berisi keluhan fungsional yang nyata, dan 41% ulasan bintang 4 justru bernada negatif.',
        'Model yang Akurat, Temuan yang Bisa Ditindaklanjuti: Dari 15.000 fitur TF-IDF bigram, saya melatih Multinomial Naive Bayes dengan pembagian data 80:20 dan memperoleh akurasi uji 94,38%, presisi 91,15%, recall 98,89%, F1-Score 94,86%, serta ROC AUC 0,965. Hasilnya saya sajikan lewat dashboard Streamlit interaktif yang memetakan prioritas perbaikan aplikasi: kendala login, OTP, dan verifikasi akun.',
      ],
      en: [
        'Big Data, Cleaned Until It Is Ready: I collected 63,766 raw Mobile JKN user reviews from the Google Play Store (January 2025 – January 2026) and processed them within the Knowledge Discovery in Databases (KDD) framework. Through case folding, slang normalization, stopword removal, and selective Sastrawi stemming, 62,878 clean texts were left ready for analysis.',
        'Hybrid Labeling, Because Stars Alone Are Not Enough: I combined star ratings with the Indonesian InSet Lexicon sentiment dictionary to build a balanced set of 59,980 labeled reviews (31,470 positive : 28,510 negative). This surfaced two key findings: 89% of 3-star reviews actually contain real functional complaints, and 41% of 4-star reviews are in fact negative in tone.',
        "An Accurate Model, Findings You Can Act On: From 15,000 TF-IDF bigram features, I trained a Multinomial Naive Bayes classifier with an 80:20 split and reached 94.38% test accuracy, 91.15% precision, 98.89% recall, 94.86% F1-Score, and 0.965 ROC AUC. I presented the results in an interactive Streamlit dashboard that maps the app's fix priorities: login, OTP, and account verification issues.",
      ],
    },
    tech: ['python', 'sklearn', 'pandas', 'numpy', 'streamlit', 'matplotlib', 'seaborn', 'nlp'],
    live: 'https://ravaelchessario24.github.io/mobile-jkn-landing-page/',
    // Taruh file-nya di public/files/ (nama file boleh diganti, sesuaikan di sini).
    downloads: [
      {
        file: 'files/mobile-jkn-hybrid-labeling.xlsx',
        label: {
          id: 'Unduh Hasil Hybrid Labeling (.xlsx)',
          en: 'Download Hybrid Labeling Data (.xlsx)',
        },
      },
    ],
    status: 'live',
    hasPin: true,
    metrics: [
      { label: { id: 'Ulasan Diolah', en: 'Reviews Analyzed' }, value: '63.766' },
      { label: { id: 'Akurasi Uji', en: 'Test Accuracy' }, value: '94,38%' },
      { label: { id: 'F1-Score', en: 'F1-Score' }, value: '94,86%' },
      { label: { id: 'ROC AUC', en: 'ROC AUC' }, value: '0,965' },
    ],
  },
  {
    slug: 'coming-soon',
    title: {
      id: 'Coming Soon — Proyek Data Analyst & Dashboard Interaktif (Microsoft Excel)',
      en: 'Coming Soon — Data Analyst & Interactive Dashboard Project (Microsoft Excel)',
    },
    imageTitle: 'Coming Soon — Excel Data Analyst Project',
    src: 'banner-dark.jpg',
    gallery: [],
    description: {
      id: 'Studi kasus analisis data bisnis, pembersihan data (Data Cleaning), fungsi lanjutan, Pivot Table, dan visualisasi dashboard interaktif menggunakan Microsoft Excel.',
      en: 'Business data analysis case study featuring data cleaning, advanced formulas, Pivot Tables, and an interactive dashboard built with Microsoft Excel.',
    },
    longDescription: {
      id: [
        'Proyek Data Analyst menggunakan Microsoft Excel (meliputi Data Cleaning, Pivot Table, fungsi lanjutan, serta Dashboard Interaktif) sedang dalam tahap penyusunan studi kasus. Nantikan pembaruannya segera.',
      ],
      en: [
        'An upcoming Data Analyst project built with Microsoft Excel (covering Data Cleaning, Pivot Tables, advanced formulas, and an Interactive Dashboard) is currently in preparation. Stay tuned.',
      ],
    },
    tech: ['excel', 'sheets'],
    status: 'coming-soon',
    hasPin: false,
    isComingSoon: true,
  },
];

export const blueprintCoursework: { id: string; en: string }[] = [
  { id: 'Basis Data', en: 'Database Systems' },
  { id: 'Data Mining dan Kecerdasan Bisnis', en: 'Data Mining & Business Intelligence' },
  { id: 'Big Data dan Analitik', en: 'Big Data & Analytics' },
  { id: 'Algoritma dan Struktur Data', en: 'Algorithms & Data Structures' },
  { id: 'Konsep Teknologi', en: 'Technology Concepts' },
  { id: 'Manajemen Proyek TI', en: 'IT Project Management' },
  { id: 'Organisasi dan Manajemen Perusahaan', en: 'Corporate Organization & Management' },
  { id: 'Organisasi dan Arsitektur Komputer', en: 'Computer Organization & Architecture' },
  { id: 'Etika Profesi TI dan Komunikasi', en: 'IT Professional Ethics & Communication' },
];

export const blueprintSkillGroups = [
  {
    group: { id: 'Data, Query & Pemrograman', en: 'Data, Querying & Programming' },
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'SQL', icon: Database },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Microsoft Excel', icon: FileSpreadsheet },
      { name: 'Google Sheets', icon: SiGooglesheets },
      { name: 'Pandas', icon: SiPandas },
      { name: 'NumPy', icon: SiNumpy },
      { name: 'Scikit-Learn', icon: SiScikitlearn },
    ],
  },
  {
    group: { id: 'Analitik, Machine Learning & Visualisasi', en: 'Analytics, ML & Visualization' },
    skills: [
      { name: 'Data Cleaning & EDA', icon: Table2 },
      { name: 'Machine Learning & NLP', icon: BrainCircuit },
      { name: 'Streamlit', icon: SiStreamlit },
      { name: 'Matplotlib', icon: BarChart3 },
      { name: 'Seaborn', icon: LineChart },
    ],
  },
  {
    group: { id: 'Lingkungan & Ekosistem Kerja', en: 'Tools & Environment' },
    skills: [
      { name: 'Jupyter Notebook', icon: SiJupyter },
      { name: 'Google Colab', icon: SiGooglecolab },
    ],
  },
];

export interface BlueprintCertification {
  id: string;
  title: string;
  issuer: string;
  period: { id: string; en: string };
  detail: { id: string; en: string };
  credentialId?: string;
  badge: string;
  image: string;
}

// Strictly the 2 completed professional training certifications
export const blueprintCertifications: BlueprintCertification[] = [
  {
    id: 'cert-dsarea-grade-a',
    title: 'Data Analyst Bootcamp — DSAREA',
    issuer: 'DSAREA',
    period: { id: 'Okt – Nov 2025', en: 'Oct – Nov 2025' },
    detail: {
      id: 'Predikat A (Grade A · Skor 85–100)',
      en: 'Grade A Distinction (Score 85–100)',
    },
    credentialId: '043/DSAREA/XI/2025',
    badge: 'DSAREA · Grade A',
    image: 'images/certs/cert-dsarea.webp',
  },
  {
    id: 'cert-google-coursera',
    title: 'Google IT Support Professional Certificate',
    issuer: 'Coursera · Google',
    period: { id: 'Jan – Mar 2025', en: 'Jan – Mar 2025' },
    detail: {
      id: '5 Kursus Spesialisasi Google',
      en: '5-Course Google Career Specialization',
    },
    badge: 'Coursera · Google',
    image: 'images/certs/cert-coursera.webp',
  },
];

export interface BlueprintHighlight {
  id: string;
  title: { id: string; en: string };
  badge: string;
  image: string;
  imageFit: 'cover' | 'contain';
  cardWidth?: number;
}

export const blueprintHighlights: BlueprintHighlight[] = [
  {
    id: 'cert-dsarea-grade-a',
    title: {
      id: 'Data Analyst Bootcamp — DSAREA (Okt–Nov 2025 · Predikat A / Grade A · Skor 85–100 · ID: 043/DSAREA/XI/2025)',
      en: 'Data Analyst Bootcamp — DSAREA (Oct–Nov 2025 · Grade A · Score 85–100 · ID: 043/DSAREA/XI/2025)',
    },
    badge: 'DSAREA · Grade A',
    image: 'images/certs/cert-dsarea.webp',
    imageFit: 'contain',
    cardWidth: 340,
  },
  {
    id: 'cert-google-coursera',
    title: {
      id: 'Google IT Support Professional Certificate — Coursera (Jan–Mar 2025 · 5 Kursus Spesialisasi Google)',
      en: 'Google IT Support Professional Certificate — Coursera (Jan–Mar 2025 · 5-Course Google Specialization)',
    },
    badge: 'Coursera · Google',
    image: 'images/certs/cert-coursera.webp',
    imageFit: 'contain',
    cardWidth: 340,
  },
];

// Movies & Music data helpers
export type AnimeStatus = 'Watching' | 'Completed' | 'On hold' | 'Dropped';
export type AnimeSectionId = 'watching' | 'favorites' | 'recent' | 'classics' | 'movies' | 'more';

export interface AnimeItem {
  title: string;
  section?: AnimeSectionId;
  status: AnimeStatus;
  episodes: number | null;
  year: number | null;
  note?: string;
  cover?: string;
  url?: string;
  synopsis?: string;
  genres?: string[];
  score?: number;
  studio?: string;
  runtime?: number;
}

export const animeSectionDefs: { id: AnimeSectionId; title: { id: string; en: string } }[] = [
  { id: 'favorites', title: { id: 'Sinema & Serial Favorit', en: 'Favorite Films & Series' } },
  { id: 'movies', title: { id: 'Animasi Pilihan', en: 'Animated Favorites' } },
  { id: 'classics', title: { id: 'Aksi, Drama & Klasik Hangat', en: 'Action, Heartfelt & Classics' } },
  { id: 'watching', title: { id: 'Sedang Ditonton', en: 'Currently Watching' } },
  { id: 'recent', title: { id: 'Baru Ditonton', en: 'Recently Watched' } },
  { id: 'more', title: { id: 'Tontonan Lainnya', en: 'More Watchlist' } },
];

const allAnime = rawAnime as AnimeItem[];
const knownSectionIds = new Set(animeSectionDefs.map((s) => s.id));
const getSectionOf = (a: AnimeItem): AnimeSectionId =>
  a.section && knownSectionIds.has(a.section) ? a.section : 'more';

export const animeSections = animeSectionDefs
  .map((def) => ({
    ...def,
    items: allAnime.filter((a) => getSectionOf(a) === def.id),
  }))
  .filter((s) => s.items.length > 0);

export const animeList = animeSections.flatMap((s) => s.items);
export const animeWithCovers = animeList.filter((a) => a.cover);

const totalRuntimeMinutes = animeList.reduce((sum, a) => sum + (a.runtime ?? 0), 0);

export const animeStats = {
  total: animeList.length,
  minutes: totalRuntimeMinutes,
  hours: Math.max(1, Math.round(totalRuntimeMinutes / 60)),
};

export const musicScenes = rawMusic.scenes as { scene: string; artists: string[] }[];
export const allArtists = musicScenes.flatMap((s) => s.artists);
export const featuredArtists = musicScenes.flatMap((s) => s.artists.slice(0, 4));
export const nowPlaying = rawMusic.nowPlaying as {
  trackId: string;
  title: string;
  artist: string;
};
export const albums = (
  rawMusic.albums as {
    id: string;
    artist: string;
    year: number;
    scene: string;
    title: string;
    cover: string;
  }[]
).filter((a) => a.cover);

export const blueprintProfileMeta = {
  shortName: 'Ravael',
  openFields: {
    id: 'Data Analyst, Data Science, IT Helpdesk',
    en: 'Data Analyst, Data Science, IT Helpdesk',
  },
  openTypes: {
    id: 'Full-Time, Internship',
    en: 'Full-Time, Internship',
  },
  openSentence: {
    id: 'Saat ini saya terbuka untuk peluang Full-Time maupun Internship di bidang Data Analyst, Data Science, atau IT Helpdesk.',
    en: 'I am currently open to full-time and internship opportunities in Data Analyst, Data Science, or IT Helpdesk roles.',
  },
};

export const closingQueryI18n = {
  id: {
    eyebrow: 'Query terakhir',
    heading: 'Satu query sebelum Anda pergi.',
    subtext: 'Hasilnya hanya satu baris. Mungkin justru yang Anda cari.',
    fileName: 'kontak.sql',
    engine: 'MySQL',
    statusIdle: 'siap dijalankan',
    statusRunning: 'menjalankan…',
    statusDone: '1 baris · 0,01 dtk',
    btnIdle: 'Jalankan query',
    btnRunning: 'Menjalankan…',
    btnDone: 'Jalankan ulang',
  },
  en: {
    eyebrow: 'Final query',
    heading: 'One last query before you go.',
    subtext: "Just one row. Maybe exactly what you're looking for.",
    fileName: 'kontak.sql',
    engine: 'MySQL',
    statusIdle: 'ready to run',
    statusRunning: 'running…',
    statusDone: '1 row · 0.01 s',
    btnIdle: 'Run query',
    btnRunning: 'Running…',
    btnDone: 'Run again',
  },
} as const;

export interface MemoryLayout {
  fx: number;
  fy: number;
  w: number;
  hw: number;
  rot: number;
}

export interface MemoryMood {
  bpm: number;
  prog: number[][];
}

export interface MemoryItem {
  id: string;
  caption: { id: string; en: string };
  image: string;
  audio: string;
  synthOnly?: boolean;
  song: { title: string; artist: string };
  layout: MemoryLayout;
  mood: MemoryMood;
}

export const memoriesList = rawMemories.memories as MemoryItem[];
export const memoryEdges = rawMemories.edges as [string, string][];

export const memoriesI18n = {
  folderAria: { id: 'Buka papan kenangan', en: 'Open memories board' },
  tooltip: { id: 'klik untuk lihat kenangan', en: 'click to view memories' },
  boardTitle: { id: 'papan kenangan', en: 'the board' },
  boardSub: { id: 'kenangan, di seutas benang', en: 'memories, on a string' },
  closeAria: { id: 'Tutup papan kenangan', en: 'Close memories board' },
  slotLine1: { id: 'taruh kenangan di sini', en: 'drop a memory here' },
  slotLine2: { id: 'dengarkan bunyinya', en: 'see what it sounds like' },
  playTitle: { id: 'putar lagunya', en: 'play song' },
  editTitle: { id: 'ubah keterangan', en: 'edit caption' },
  hideTitle: { id: 'sembunyikan dari papan', en: 'hide from board' },
  ejectTitle: { id: 'keluarkan dari pemutar', en: 'eject memory' },
} as const;

export type { Lang };
export function pickText(val: { id: string; en: string } | string, lang: Lang): string {
  if (typeof val === 'string') return val;
  return val[lang] || val.id;
}
export const pick = pickText;
