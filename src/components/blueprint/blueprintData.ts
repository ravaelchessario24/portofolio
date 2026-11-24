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
  tech: string[];
  metrics?: { label: { id: string; en: string }; value: string }[];
  photos: { src: string; caption: { id: string; en: string } }[];
}

export const blueprintExperiences: BlueprintExperience[] = [
  {
    id: 'kkn-digimapan',
    title: 'KKN Digimapan — ITB Ahmad Dahlan Jakarta',
    role: {
      id: 'Divisi Acara (Events Division)',
      en: 'Events Division · Community Service',
    },
    dates: { id: '2025', en: '2025' },
    location: {
      id: 'Desa Lebak Wangi, Kab. Tangerang',
      en: 'Lebak Wangi Village, Tangerang Regency',
    },
    src: 'images/itb-ad-logo.webp',
    type: { id: 'Lapangan', en: 'On-site' },
    imageFit: 'contain',
    points: {
      id: [
        'Koordinasi Acara: Menyusun rundown kegiatan dan mengoordinasikan jalannya acara pengabdian masyarakat KKN Digimapan ITB Ahmad Dahlan di Desa Lebak Wangi.',
        'Inisiasi Literasi Digital SD: Mengusulkan dan memandu program pengenalan komputer tingkat Sekolah Dasar menggunakan Typingcore untuk latihan mengetik dasar serta Microsoft Paint untuk melatih koordinasi kursor.',
        'Pendampingan Praktik: Mendampingi siswa secara bergiliran dalam kelompok kecil agar setiap anak dapat mempraktikkan pengoperasian laptop secara langsung.',
      ],
      en: [
        'Event Coordination: Prepared activity rundowns and coordinated community service events for ITB Ahmad Dahlan Digimapan KKN in Lebak Wangi Village.',
        'Elementary Digital Literacy: Initiated and mentored elementary computer literacy sessions using Typingcore for basic typing and Microsoft Paint for mouse cursor coordination.',
        'Hands-on Mentorship: Guided students in rotating small groups so every child gained direct hands-on experience operating a laptop.',
      ],
    },
    tech: ['Digital Literacy', 'Typingcore', 'Microsoft Paint', 'Event Planning', 'Team Collaboration'],
    metrics: [
      { label: { id: 'Sasaran', en: 'Target Audience' }, value: 'Siswa SD' },
      { label: { id: 'Lokasi', en: 'Location' }, value: 'Lebak Wangi' },
      { label: { id: 'Program', en: 'Program' }, value: 'Digimapan' },
      { label: { id: 'Tahun', en: 'Year' }, value: '2025' },
    ],
    photos: [
      {
        src: 'images/gallery/kkn-1.webp',
        caption: {
          id: 'Foto bersama tim KKN Digimapan ITB Ahmad Dahlan di Desa Lebak Wangi',
          en: 'ITB Ahmad Dahlan Digimapan KKN team in Lebak Wangi Village',
        },
      },
      {
        src: 'images/gallery/kkn-2.webp',
        caption: {
          id: 'Pendampingan siswa SD belajar mengetik dan menggunakan kursor laptop',
          en: 'Mentoring elementary students on typing and laptop cursor control',
        },
      },
      {
        src: 'images/gallery/kkn-3.webp',
        caption: {
          id: 'Sesi praktik komputer dasar secara berkelompok bersama siswa SD',
          en: 'Small-group basic computer practice session with elementary students',
        },
      },
      {
        src: 'images/gallery/kkn-4.webp',
        caption: {
          id: 'Antusiasme siswa SD saat mengikuti kelas literasi digital KKN Digimapan',
          en: 'High student engagement during the KKN Digimapan digital literacy class',
        },
      },
      {
        src: 'images/gallery/kkn-5.webp',
        caption: {
          id: 'Dokumentasi kegiatan edukasi dan kebersamaan tim KKN bersama siswa',
          en: 'Documentation of educational activities with students and KKN team',
        },
      },
      {
        src: 'images/gallery/kkn-6.webp',
        caption: {
          id: 'Penutupan rangkaian kegiatan KKN Digimapan ITB Ahmad Dahlan',
          en: 'Closing ceremony of ITB Ahmad Dahlan Digimapan KKN program',
        },
      },
    ],
  },
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
    type: { id: 'On-site', en: 'On-site' },
    imageFit: 'cover',
    points: {
      id: [
        'Pengembangan Website & CMS: Merancang dan membangun website landing page serta Content Management System untuk informasi sekolah, mencakup manajemen konten dinamis, data guru, dan kurikulum mata pelajaran.',
        'Efisiensi Administrasi +50%: Meningkatkan efisiensi administrasi sekolah hingga 50% melalui digitalisasi pendataan profil guru dan silabus kegiatan ke dalam database MySQL terstruktur.',
        'Desain Responsif: Mengembangkan tampilan website yang responsif di perangkat mobile dan desktop untuk mempermudah calon orang tua murid mengakses informasi sekolah.',
      ],
      en: [
        'Website & CMS Development: Designed and built a landing page website and Content Management System for school information, covering dynamic content, teacher records, and class curriculum.',
        '+50% Administrative Efficiency: Increased school administrative efficiency by up to 50% by digitizing teacher profiles and activity syllabi into a structured MySQL database.',
        'Responsive Interface: Developed a responsive interface across mobile and desktop devices so prospective parents can easily access school information.',
      ],
    },
    tech: ['MySQL', 'SQL', 'Web CMS', 'HTML/CSS', 'Responsive UI', 'Data Structuring'],
    metrics: [
      { label: { id: 'Efisiensi Waktu', en: 'Admin Time Cut' }, value: '50%' },
      { label: { id: 'Basis Data', en: 'Database' }, value: 'MySQL' },
      { label: { id: 'Modul CMS', en: 'CMS Modules' }, value: '5 Halaman' },
      { label: { id: 'Periode', en: 'Term' }, value: 'Mar–Mei 2025' },
    ],
    photos: [
      {
        src: 'images/experience/paud-1.webp',
        caption: {
          id: 'Beranda Website PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Website Hero Page',
        },
      },
      {
        src: 'images/experience/paud-2.webp',
        caption: {
          id: 'Statistik Sekolah, Profil, Visi & Misi PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Statistics, Profile, Vision & Mission',
        },
      },
      {
        src: 'images/experience/paud-3.webp',
        caption: {
          id: 'Direktori Guru Terstruktur PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Structured Teacher Directory',
        },
      },
      {
        src: 'images/experience/paud-4.webp',
        caption: {
          id: 'Jadwal Harian & Kurikulum Kelas PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Daily Class Schedule & Curriculum',
        },
      },
      {
        src: 'images/experience/paud-5.webp',
        caption: {
          id: 'Testimoni Orang Tua & Integrasi Peta Lokasi PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Parent Testimonials & Location Map',
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
  status: 'live' | 'building' | 'research';
  hasPin: boolean;
  metrics?: { label: { id: string; en: string }; value: string }[];
}

export const blueprintProjects: BlueprintProject[] = [
  {
    slug: 'mobile-jkn',
    title: {
      id: 'Analisis Sentimen & Dashboard Mobile JKN',
      en: 'Mobile JKN Sentiment Analysis & Dashboard',
    },
    imageTitle: 'Mobile JKN Streamlit Dashboard',
    src: 'images/projects/mobile-jkn-dashboard.webp',
    gallery: [
      {
        src: 'images/projects/mobile-jkn-dashboard.webp',
        caption: {
          id: 'Ringkasan Eksekutif — Dashboard Analisis Sentimen Mobile JKN (59.980 Ulasan Berlabel & Akurasi 94,38%)',
          en: 'Executive Summary — Mobile JKN Sentiment Analysis Dashboard (59,980 Labeled Reviews & 94.38% Accuracy)',
        },
      },
      {
        src: 'images/projects/mobile-jkn-2.webp',
        caption: {
          id: 'Statistik Dataset — Distribusi Sentimen (52,5% Positif vs 47,5% Negatif) & Distribusi Rating 1–5 Bintang',
          en: 'Dataset Statistics — Sentiment Distribution (52.5% Positive vs 47.5% Negative) & 1–5 Star Ratings',
        },
      },
      {
        src: 'images/projects/mobile-jkn-3.webp',
        caption: {
          id: 'Pembobotan Kata TF-IDF — 20 Bigram Teratas & Word Cloud Sentimen Positif/Negatif',
          en: 'TF-IDF Word Weighting — Top 20 Bigrams & Positive/Negative Sentiment Word Clouds',
        },
      },
      {
        src: 'images/projects/mobile-jkn-4.webp',
        caption: {
          id: 'Evaluasi & Model — Confusion Matrix Data Training/Testing, Kurva ROC (AUC = 0,965) & Log-Probability',
          en: 'Model Evaluation — Training/Testing Confusion Matrix, ROC Curve (AUC = 0.965) & Log-Probability',
        },
      },
      {
        src: 'images/projects/mobile-jkn-5.webp',
        caption: {
          id: 'Prediksi & Pelabelan Otomatis — Fitur Unggah File Excel (.xlsx) untuk Klasifikasi Sentimen Baru',
          en: 'Automated Prediction & Labeling — Excel (.xlsx) Upload for Batch Sentiment Classification',
        },
      },
    ],
    description: {
      id: 'Pipeline klasifikasi sentimen end-to-end berbasis Python terhadap 63.766 ulasan Google Play Store aplikasi Mobile JKN (Jan 2025 – Jan 2026) dengan Hybrid Labeling (InSet Lexicon), 15.000 fitur TF-IDF bigram, dan Multinomial Naive Bayes (akurasi 94,38%, F1-score 94,86%, AUC 0,965).',
      en: 'End-to-end Python sentiment classification pipeline on 63,766 Mobile JKN Google Play Store reviews (Jan 2025 – Jan 2026) combining Hybrid Labeling (InSet Lexicon), 15,000 TF-IDF bigram features, and Multinomial Naive Bayes (94.38% accuracy, 94.86% F1-score, 0.965 AUC).',
    },
    longDescription: {
      id: [
        'Mengumpulkan 63.766 ulasan pengguna aplikasi Mobile JKN dari Google Play Store (periode Januari 2025 – Januari 2026) menggunakan kerangka kerja Knowledge Discovery in Database (KDD), lalu melakukan text preprocessing, normalisasi kata tidak baku, stopword removal, dan stemming selektif Sastrawi hingga menghasilkan 62.878 teks bersih.',
        'Menerapkan metode Hybrid Labeling (menggabungkan rating bintang dan kamus InSet Lexicon) pada 59.980 ulasan berlabel seimbang (31.470 positif : 28.510 negatif), yang mengungkap bahwa 89% ulasan bintang 3 berisi keluhan nyata dan mengoreksi label negatif pada 41% ulasan bintang 4.',
        'Mengekstraksi 15.000 fitur TF-IDF bigram dan melatih model Multinomial Naive Bayes (pembagian 80:20) hingga mencapai akurasi uji 94,38%, presisi 91,15%, recall 98,89%, F1-score 94,86%, dan ROC AUC 0,965, serta menyajikannya ke dalam dashboard interaktif Streamlit.',
      ],
      en: [
        'Collected 63,766 Mobile JKN user reviews from Google Play Store (January 2025 – January 2026) following the Knowledge Discovery in Database (KDD) framework, performing text cleaning, slang normalization, stopword removal, and selective Sastrawi stemming across 62,878 cleaned texts.',
        'Applied Hybrid Labeling (combining star ratings with the InSet Lexicon dictionary) to produce 59,980 balanced reviews (31,470 positive : 28,510 negative), revealing that 89% of 3-star reviews contain real complaints and correcting 41% of 4-star reviews to negative.',
        'Extracted 15,000 TF-IDF bigram features and trained a Multinomial Naive Bayes classifier (80:20 split) achieving 94.38% test accuracy, 91.15% precision, 98.89% recall, 94.86% F1-score, and 0.965 ROC AUC, deployed in an interactive Streamlit dashboard.',
      ],
    },
    tech: ['python', 'sklearn', 'pandas', 'numpy', 'streamlit', 'matplotlib', 'seaborn', 'nlp'],
    live: 'https://ravaelchessario24.github.io/mobile-jkn-landing-page/',
    status: 'live',
    hasPin: true,
    metrics: [
      { label: { id: 'Ulasan Diolah', en: 'Reviews Processed' }, value: '63.766' },
      { label: { id: 'Akurasi Uji', en: 'Test Accuracy' }, value: '94,38%' },
      { label: { id: 'F1-Score', en: 'F1-Score' }, value: '94,86%' },
      { label: { id: 'ROC AUC', en: 'ROC AUC' }, value: '0,965' },
    ],
  },
  {
    slug: 'paud-flamboyan',
    title: {
      id: 'Website & CMS Sekolah — PAUD KB Flamboyan',
      en: 'School Website & CMS — PAUD KB Flamboyan',
    },
    imageTitle: 'PAUD KB Flamboyan CMS',
    src: 'images/experience/paud-1.webp',
    gallery: [
      {
        src: 'images/experience/paud-1.webp',
        caption: {
          id: 'Halaman Utama (Hero) Website PAUD KB Flamboyan',
          en: 'PAUD KB Flamboyan Landing Page Hero',
        },
      },
      {
        src: 'images/experience/paud-2.webp',
        caption: {
          id: 'Statistik Sekolah, Profil, Visi & Misi PAUD KB Flamboyan',
          en: 'School Statistics, Profile, Vision & Mission Section',
        },
      },
      {
        src: 'images/experience/paud-3.webp',
        caption: {
          id: 'Direktori & Pendataan Profil Guru Terstruktur',
          en: 'Structured Teacher Profile Directory',
        },
      },
      {
        src: 'images/experience/paud-4.webp',
        caption: {
          id: 'Jadwal Harian & Silabus Kurikulum Interaktif per Kelas (Play Group, Kelas A, Kelas B)',
          en: 'Interactive Daily Schedule & Class Curriculum (Play Group, Class A, Class B)',
        },
      },
      {
        src: 'images/experience/paud-5.webp',
        caption: {
          id: 'Testimoni Orang Tua Murid & Integrasi Peta Lokasi Sekolah',
          en: 'Parent Testimonials & School Location Map Integration',
        },
      },
    ],
    description: {
      id: 'Website landing page dan Content Management System (CMS) berbasis MySQL untuk PAUD KB Flamboyan yang memusatkan informasi sekolah, direktori guru, dan jadwal kurikulum, meningkatkan efisiensi administrasi hingga 50%.',
      en: 'MySQL-backed landing page and Content Management System (CMS) for PAUD KB Flamboyan centralizing school information, teacher directory, and class schedules, cutting administrative time by up to 50%.',
    },
    longDescription: {
      id: [
        'Merancang dan membangun sistem informasi web serta Content Management System (CMS) untuk PAUD KB Flamboyan guna menggantikan pencatatan profil guru, jadwal kelas, dan pengumuman yang sebelumnya tersebar secara manual.',
        'Menstrukturkan basis data relasional MySQL untuk manajemen konten dinamis (profil sekolah, daftar pengajar, jadwal harian Play Group / Kelas A / Kelas B, serta informasi pendaftaran), sehingga meningkatkan efisiensi waktu administrasi sekolah hingga 50%.',
      ],
      en: [
        'Designed and built a web information system and Content Management System (CMS) for PAUD KB Flamboyan to replace manual, scattered teacher profile records, class schedules, and school announcements.',
        'Structured a relational MySQL database for dynamic content management (school profile, teacher directory, daily schedules for Play Group / Class A / Class B, and enrollment info), improving administrative efficiency by up to 50%.',
      ],
    },
    tech: ['mysql', 'sql', 'cms'],
    status: 'live',
    hasPin: true,
    metrics: [
      { label: { id: 'Efisiensi Waktu', en: 'Admin Time Saved' }, value: '50%' },
      { label: { id: 'Basis Data', en: 'Database' }, value: 'MySQL' },
      { label: { id: 'Kelas Terdata', en: 'Classes Managed' }, value: '3 Kelas' },
      { label: { id: 'Tahun', en: 'Year' }, value: '2025' },
    ],
  },
];

export const blueprintSkillGroups = [
  {
    group: { id: 'Data & Analitik', en: 'Data & Analytics' },
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
    group: { id: 'Visualisasi, Dashboard & Metode', en: 'Visualization, Dashboard & Methods' },
    skills: [
      { name: 'Streamlit', icon: SiStreamlit },
      { name: 'Matplotlib', icon: BarChart3 },
      { name: 'Seaborn', icon: LineChart },
      { name: 'Data Cleaning & EDA', icon: Table2 },
      { name: 'Machine Learning & NLP', icon: BrainCircuit },
    ],
  },
  {
    group: { id: 'Lingkungan & Alat Kerja', en: 'Tools & Environment' },
    skills: [
      { name: 'Jupyter Notebook', icon: SiJupyter },
      { name: 'Google Colab', icon: SiGooglecolab },
    ],
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
      id: 'Sertifikat Kelulusan Data Analyst Bootcamp DSAREA — Predikat A (Grade A · Skor 85–100)',
      en: 'DSAREA Data Analyst Bootcamp Certificate of Completion — Grade A (Score 85–100)',
    },
    badge: 'DSAREA · Grade A',
    image: 'images/certs/cert-dsarea.webp',
    imageFit: 'contain',
    cardWidth: 340,
  },
  {
    id: 'cert-google-coursera',
    title: {
      id: 'Google IT Support Professional Certificate — Coursera (5 Kursus Spesialisasi Google)',
      en: 'Google IT Support Professional Certificate — Coursera (5-Course Google Specialization)',
    },
    badge: 'Coursera · Google',
    image: 'images/certs/cert-coursera.webp',
    imageFit: 'contain',
    cardWidth: 340,
  },
];

// Anime & Music data helpers
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
  { id: 'watching', title: { id: 'Sedang Ditonton', en: 'Watching now' } },
  { id: 'favorites', title: { id: 'Favorit Sepanjang Masa', en: 'All-time favorites' } },
  { id: 'recent', title: { id: 'Baru Saja Ditonton', en: 'Recently watched' } },
  { id: 'classics', title: { id: 'Klasik', en: 'Classics' } },
  { id: 'movies', title: { id: 'Film Anime', en: 'Movies' } },
  { id: 'more', title: { id: 'Lainnya yang Sudah Ditonton', en: 'Also watched' } },
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

export const animeStats = {
  total: animeList.length,
  episodes: animeList.reduce((sum, a) => sum + (a.episodes ?? 0), 0),
};

export const musicScenes = rawMusic.scenes as { scene: string; artists: string[] }[];
export const allArtists = musicScenes.flatMap((s) => s.artists);
export const featuredArtists = musicScenes.flatMap((s) => s.artists.slice(0, 3));
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

export type { Lang };
export function pickText(val: { id: string; en: string } | string, lang: Lang): string {
  if (typeof val === 'string') return val;
  return val[lang] || val.id;
}
export const pick = pickText;
