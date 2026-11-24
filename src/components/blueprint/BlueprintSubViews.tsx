import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  Moon,
  Sun,
  Globe,
  FileText,
  Mail,
  Sparkles,
  Check,
  Copy,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Send,
  FolderGit2,
  Briefcase,
  Award,
  Tv,
} from 'lucide-react';
import {
  type Lang,
  type BlueprintProject,
  type AnimeItem,
  blueprintProjects,
  blueprintExperiences,
  blueprintHighlights,
  animeSections,
  animeStats,
  musicScenes,
  nowPlaying,
  albums,
  techNames,
  iconMap,
  pick,
} from './blueprintData';
import { dashedX, dashedY } from './BlueprintHelpers';

export type BlueprintView =
  | 'home'
  | 'projects'
  | 'project-detail'
  | 'experience'
  | 'highlights'
  | 'anime'
  | 'contact';

/* ============================================================================
   1. PROJECT DETAIL VIEW (with 5 Mobile JKN / 5 PAUD interactive slides)
   ============================================================================ */
export function ProjectDetailView({
  project,
  lang,
  withBase,
  onBack,
  onOpenLightbox,
}: {
  project: BlueprintProject;
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = project.gallery;
  const currentSlide = slides[activeSlide] || slides[0];

  useEffect(() => {
    setActiveSlide(0);
  }, [project.slug]);

  return (
    <div className="w-full pb-20">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {project.status === 'live'
                  ? lang === 'id'
                    ? 'Selesai & Aktif'
                    : 'Live & Verified'
                  : project.status}
              </span>
              <span className="text-xs font-mono text-neutral-500">
                {slides.length} {lang === 'id' ? 'Tangkapan Layar' : 'Screenshots'}
              </span>
            </div>
            <h1 className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {pick(project.title, lang)}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              {pick(project.description, lang)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition"
              >
                <span>{lang === 'id' ? 'Buka Live Demo' : 'Open Live Demo'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] my-2" style={dashedX} />

      {/* Interactive 5-Slide Screenshot Viewer */}
      <div className="px-4 md:px-6 py-4">
        <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/70 dark:bg-neutral-900/60 p-3 md:p-4">
          <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 group">
            <img
              src={withBase(currentSlide.src)}
              alt={pick(currentSlide.caption, lang)}
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() =>
                onOpenLightbox(
                  withBase(currentSlide.src),
                  pick(project.title, lang),
                  pick(currentSlide.caption, lang),
                )
              }
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900/80 text-white text-xs font-mono backdrop-blur-sm opacity-90 hover:opacity-100 transition cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              {lang === 'id' ? 'Perbesar' : 'Zoom'}
            </button>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
                  }
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/75 text-white flex items-center justify-center hover:bg-neutral-900 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-900/75 text-white flex items-center justify-center hover:bg-neutral-900 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-white">
                [{activeSlide + 1}/{slides.length}]
              </span>{' '}
              {pick(currentSlide.caption, lang)}
            </p>
          </div>

          {/* Thumbnail Strip */}
          <div className="mt-3 grid grid-cols-5 gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`relative aspect-[16/10] rounded-md overflow-hidden border transition cursor-pointer ${
                  idx === activeSlide
                    ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900/20 dark:ring-white/20'
                    : 'border-neutral-300 dark:border-neutral-700 opacity-65 hover:opacity-100'
                }`}
              >
                <img
                  src={withBase(slide.src)}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <>
          <div className="w-full h-[1px] my-2" style={dashedX} />
          <div className="px-4 md:px-6 py-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
              {lang === 'id' ? 'Metrik & Hasil Utama' : 'Key Metrics & Outcomes'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/70 dark:bg-neutral-900/40"
                >
                  <div className="text-lg md:text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {m.value}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {pick(m.label, lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="w-full h-[1px] my-2" style={dashedX} />

      {/* Case Study Breakdown */}
      <div className="px-4 md:px-6 py-4 space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500">
          {lang === 'id' ? 'Ringkasan Studi Kasus & Implementasi' : 'Case Study & Implementation'}
        </h2>
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          {project.longDescription[lang].map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="w-full h-[1px] my-2" style={dashedX} />

      {/* Tech Stack */}
      <div className="px-4 md:px-6 py-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
          {lang === 'id' ? 'Teknologi yang Digunakan' : 'Technologies & Stack'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((techKey) => {
            const Icon = iconMap[techKey];
            return (
              <span
                key={techKey}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-neutral-700"
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {techNames[techKey] || techKey}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. ALL PROJECTS VIEW (/projects)
   ============================================================================ */
export function AllProjectsView({
  lang,
  withBase,
  onBack,
  onSelectProject,
}: {
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}) {
  return (
    <div className="w-full pb-20">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>
        <h1 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
          {lang === 'id' ? 'Semua Proyek & Studi Kasus' : 'All Projects & Case Studies'}
        </h1>
        <p className="mt-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          {lang === 'id'
            ? 'Klik kartu proyek untuk melihat 5 tangkapan layar lengkap, metrik evaluasi, dan detail implementasi.'
            : 'Click any project card to inspect all 5 screenshots, evaluation metrics, and implementation details.'}
        </p>
      </div>

      <div className="w-full h-[1px]" style={dashedX} />

      <div className="grid grid-cols-1 md:grid-cols-2 relative">
        <div
          className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] pointer-events-none"
          style={dashedY}
        />
        {blueprintProjects.map((project) => {
          const isComingSoon = Boolean(project.isComingSoon);
          return (
            <div
              key={project.slug}
              onClick={() => {
                if (!isComingSoon) onSelectProject(project.slug);
              }}
              className={`group p-5 transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 border-b border-dashed border-neutral-300 dark:border-neutral-800 ${
                isComingSoon ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 mb-4">
                {isComingSoon ? (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(-45deg, rgba(120,120,120,0.12) 0px, rgba(120,120,120,0.12) 1px, transparent 1px, transparent 8px)',
                    }}
                  >
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold">
                      Coming Soon
                    </span>
                    <p className="mt-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      {lang === 'id'
                        ? 'Sedang dalam tahap riset & eksplorasi data'
                        : 'In research & dataset exploration phase'}
                    </p>
                  </div>
                ) : (
                  <img
                    src={withBase(project.src)}
                    alt={pick(project.title, lang)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-mono ${
                    isComingSoon
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isComingSoon
                    ? 'Coming Soon'
                    : project.status === 'live'
                      ? lang === 'id'
                        ? 'Selesai & Aktif'
                        : 'Live & Verified'
                      : project.status}
                </span>
                {!isComingSoon && (
                  <span className="text-[11px] font-mono text-neutral-400">
                    {project.gallery.length} {lang === 'id' ? 'Layar' : 'Slides'}
                  </span>
                )}
              </div>
              <h2
                className={`mt-1 text-base font-semibold text-neutral-900 dark:text-neutral-100 ${
                  isComingSoon ? '' : 'group-hover:underline'
                }`}
              >
                {pick(project.title, lang)}
              </h2>
              <p className="mt-1.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {pick(project.description, lang)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                  >
                    {techNames[t] || t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   3. EXPERIENCE TIMELINE VIEW (/experience)
   ============================================================================ */
export function ExperienceTimelineView({
  lang,
  withBase,
  onBack,
  onOpenLightbox,
}: {
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}) {
  return (
    <div className="w-full pb-20">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>
        <h1 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
          {lang === 'id' ? 'Riwayat Pengalaman & Dokumentasi' : 'Experience Timeline & Documentation'}
        </h1>
        <p className="mt-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          {lang === 'id'
            ? 'Detail kontribusi lapangan, magang pengembangan web, serta dokumentasi kegiatan.'
            : 'Field contributions, web development internship, and activity documentation.'}
        </p>
      </div>

      <div className="w-full h-[1px]" style={dashedX} />

      <div className="px-4 md:px-6 py-6 space-y-6">
        {blueprintExperiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4 md:p-5 bg-neutral-50/40 dark:bg-neutral-900/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={withBase(exp.src)}
                  alt={exp.title}
                  className="w-11 h-11 rounded-lg object-cover border border-neutral-300 dark:border-neutral-700 bg-white"
                />
                <div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {exp.title}
                  </h2>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {pick(exp.role, lang)} ·{' '}
                    <span className="font-mono text-neutral-500">{pick(exp.type, lang)}</span>
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right font-mono text-xs text-neutral-500">
                <div>{pick(exp.dates, lang)}</div>
                <div>{pick(exp.location, lang)}</div>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 list-disc pl-5">
              {exp.points[lang].map((pt, i) => (
                <li key={i} className="leading-relaxed">
                  {pt}
                </li>
              ))}
            </ul>

            {exp.photos && exp.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  {lang === 'id' ? 'Dokumentasi Foto (Klik untuk perbesar)' : 'Photo Documentation (Click to zoom)'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {exp.photos.map((photo) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() =>
                        onOpenLightbox(
                          withBase(photo.src),
                          `${exp.title} — ${pick(exp.role, lang)}`,
                          pick(photo.caption, lang),
                        )
                      }
                      className="group relative aspect-[16/10] rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 cursor-zoom-in"
                    >
                      <img
                        src={withBase(photo.src)}
                        alt={pick(photo.caption, lang)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 text-[11px] font-mono rounded bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   4. ALL HIGHLIGHTS VIEW (/highlights — 2 Verified Training Certifications)
   ============================================================================ */
export function AllHighlightsView({
  lang,
  withBase,
  onBack,
  onOpenLightbox,
}: {
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
  onOpenLightbox: (src: string, title: string, caption?: string) => void;
}) {
  return (
    <div className="w-full pb-20">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>
        <h1 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
          {lang === 'id'
            ? 'Highlights — Sertifikasi Pelatihan Profesional'
            : 'Highlights — Professional Training Certifications'}
        </h1>
        <p className="mt-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          {lang === 'id'
            ? 'Dua sertifikasi pelatihan kompetensi utama yang telah diselesaikan (klik kartu untuk memperbesar sertifikat).'
            : 'Two completed professional training certifications (click any card to zoom certificate).'}
        </p>
      </div>

      <div className="w-full h-[1px]" style={dashedX} />

      <div className="px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {blueprintHighlights.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              onOpenLightbox(withBase(item.image), pick(item.title, lang), item.badge)
            }
            className="group rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-500 transition cursor-zoom-in"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
              <img
                src={withBase(item.image)}
                alt={pick(item.title, lang)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded bg-black/75 text-white backdrop-blur-sm">
                {item.badge}
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                {pick(item.title, lang)}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   5. ALL MOVIES & MUSIC VIEW (/anime)
   ============================================================================ */
export function AllAnimeMusicView({
  lang,
  withBase,
  onBack,
}: {
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
}) {
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${nowPlaying.trackId}?utm_source=generator`;

  return (
    <div className="w-full pb-20">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>
        <h1 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
          {lang === 'id' ? 'Film & Musik Favorit' : 'Favorite Movies & Music'}
        </h1>
        <p className="mt-1 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          {lang === 'id'
            ? 'Daftar film pilihan dan rotasi lagu yang menemani sesi eksplorasi data, vibe coding, maupun waktu santai.'
            : 'Curated films and music rotation accompanying data exploration, vibe coding sessions, and downtime.'}
        </p>
      </div>

      <div className="w-full h-[1px]" style={dashedX} />

      {/* Watchlist Stats */}
      <div className="px-4 md:px-6 py-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="text-xs font-mono text-neutral-500">
            {lang === 'id' ? 'Total Film & Serial Favorit' : 'Favorite Films & Series'}
          </div>
          <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
            {animeStats.total} {lang === 'id' ? 'Judul' : 'Titles'}
          </div>
        </div>
        <div className="p-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="text-xs font-mono text-neutral-500">
            {lang === 'id' ? 'Total Durasi Tontonan' : 'Total Watch Runtime'}
          </div>
          <div className="text-base font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
            ~{animeStats.hours} {lang === 'id' ? 'Jam' : 'Hrs'} ({animeStats.minutes.toLocaleString()}{' '}
            {lang === 'id' ? 'mnt' : 'min'})
          </div>
        </div>
      </div>

      {/* Movie Sections */}
      {animeSections.map((sec) => (
        <div key={sec.id} className="px-4 md:px-6 py-4">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {pick(sec.title, lang)}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sec.items
              .filter((a) => a.cover)
              .map((movie) => (
                <button
                  key={movie.title}
                  type="button"
                  onClick={() => setSelectedAnime(movie)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 text-left cursor-pointer bg-neutral-900"
                >
                  <img
                    src={withBase((movie.cover || '').replace(/^\//, ''))}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    {movie.studio && (
                      <p className="text-[10px] text-white/70 truncate mt-0.5">{movie.studio}</p>
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <div className="w-full h-[1px] my-4" style={dashedX} />

      {/* Music Rotation & Spotify Embed */}
      <div className="px-4 md:px-6 py-4 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              {lang === 'id' ? 'Rotasi Musik & Lagu Favorit' : 'Music Rotation & Top Track'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {nowPlaying.title} — {nowPlaying.artist}
            </p>
          </div>
          <a
            href={`https://open.spotify.com/track/${nowPlaying.trackId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-500 transition"
          >
            Spotify <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {musicScenes.map((s) => (
            <span
              key={s.scene}
              className="px-2.5 py-1 text-[11px] font-mono rounded-full border border-dashed border-neutral-400/60 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300"
            >
              {s.scene}
            </span>
          ))}
        </div>

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

        {/* Albums Grid */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
            {lang === 'id' ? 'Album & Rilisan dalam Rotasi' : 'Albums & Releases on Rotation'}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {albums.map((alb) => (
              <a
                key={alb.id}
                href={`https://open.spotify.com/album/${alb.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={withBase(alb.cover.replace(/^\//, ''))}
                    alt={alb.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:underline">
                  {alb.title}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">{alb.artist}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedAnime && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedAnime(null)}
        >
          <div
            className="max-w-lg w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 p-4">
              {selectedAnime.cover && (
                <img
                  src={withBase(selectedAnime.cover.replace(/^\//, ''))}
                  alt={selectedAnime.title}
                  className="w-28 h-40 object-cover rounded-lg border border-neutral-300 dark:border-neutral-700 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {selectedAnime.title}
                    </h3>
                    {selectedAnime.studio && (
                      <p className="text-xs text-neutral-500">{selectedAnime.studio}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAnime(null)}
                    className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-neutral-500">
                  {selectedAnime.year && <span>{selectedAnime.year}</span>}
                  {selectedAnime.episodes && selectedAnime.episodes > 1 ? (
                    <span>· {selectedAnime.episodes} eps</span>
                  ) : selectedAnime.runtime ? (
                    <span>· {selectedAnime.runtime} min</span>
                  ) : null}
                  {selectedAnime.score && <span>· ★ {(selectedAnime.score / 10).toFixed(1)}</span>}
                  {selectedAnime.note && <span>· {selectedAnime.note}</span>}
                </div>

                {selectedAnime.genres && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedAnime.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {selectedAnime.synopsis && (
                  <p className="mt-2.5 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-4 leading-relaxed">
                    {selectedAnime.synopsis}
                  </p>
                )}

                {selectedAnime.url && (
                  <a
                    href={selectedAnime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-neutral-900 dark:text-white hover:underline"
                  >
                    {lang === 'id' ? 'Referensi Film' : 'Film Reference'}{' '}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   6. CONTACT VIEW (/contact)
   ============================================================================ */
export function ContactPageView({
  lang,
  withBase,
  onBack,
}: {
  lang: Lang;
  withBase: (p: string) => string;
  onBack: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[Portfolio Inquiry] ${name || 'Recruiter / Collaborator'}`,
    );
    const body = encodeURIComponent(
      `Halo Ravael,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
    );
    window.location.href = `mailto:ravaelchessario@gmail.com?subject=${subject}&body=${body}`;
  };

  const copyDirectEmail = () => {
    navigator.clipboard?.writeText('ravaelchessario@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="w-full pb-16">
      <div className="px-4 md:px-6 pt-6 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </button>

        <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {lang === 'id' ? 'Hubungi Saya' : 'Get in Touch'}
        </h1>
        <p className="mt-1.5 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
          {lang === 'id'
            ? 'Saat ini terbuka untuk posisi Full-Time maupun Internship di bidang Data Analyst, Data Science, atau IT Helpdesk.'
            : 'Currently open to Full-Time and Internship opportunities in Data Analyst, Data Science, or IT Helpdesk roles.'}
        </p>
      </div>

      <div className="w-full h-[1px]" style={dashedX} />

      <div className="px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
              {lang === 'id' ? 'Nama Lengkap / Perusahaan' : 'Full Name / Organization'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'id' ? 'Nama Anda / Tim Rekrutmen' : 'Your Name / Hiring Team'}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
              {lang === 'id' ? 'Alamat Email' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
              {lang === 'id' ? 'Pesan' : 'Message'}
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                lang === 'id'
                  ? 'Sampaikan posisi, kebutuhan tim, atau proyek yang ingin didiskusikan...'
                  : 'Share details about the role, team needs, or collaboration opportunity...'
              }
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200 resize-y"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {lang === 'id' ? 'Kirim Pesan via Email' : 'Send Message'}
          </button>
        </form>

        {/* Direct Contact Channels */}
        <div className="md:col-span-2 space-y-3">
          <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="text-xs font-mono text-neutral-500">Email</div>
            <div className="mt-1 text-sm font-medium break-all">ravaelchessario@gmail.com</div>
            <button
              type="button"
              onClick={copyDirectEmail}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  {lang === 'id' ? 'Tersalin!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {lang === 'id' ? 'Salin Email' : 'Copy Email'}
                </>
              )}
            </button>
          </div>

          <a
            href="https://wa.me/6287744415565"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 transition"
          >
            <div className="text-xs font-mono text-neutral-500">WhatsApp</div>
            <div className="mt-1 text-sm font-medium flex items-center justify-between">
              <span>+62 877-4441-5565</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/muhammad-ravael-chessario-ramdoni-47b37728b"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 transition"
          >
            <div className="text-xs font-mono text-neutral-500">LinkedIn</div>
            <div className="mt-1 text-sm font-medium flex items-center justify-between">
              <span>Muhammad Ravael Chessario Ramdoni</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </div>
          </a>

          <a
            href={withBase('files/CV_Muhammad_Ravael_Chessario_Ramdoni.pdf')}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 transition"
          >
            <div className="text-xs font-mono text-neutral-500">Curriculum Vitae</div>
            <div className="mt-1 text-sm font-medium flex items-center justify-between">
              <span>{lang === 'id' ? 'Unduh CV (PDF)' : 'Download Résumé (PDF)'}</span>
              <FileText className="w-4 h-4 shrink-0" />
            </div>
          </a>
        </div>
      </div>

      <div className="w-full h-[1px] my-4" style={dashedX} />

      <div className="px-4 md:px-6 pt-4 text-center select-none overflow-hidden">
        <div className="text-6xl sm:text-8xl font-black tracking-tighter text-neutral-200/80 dark:text-neutral-800/80 font-mono">
          RAVAEL
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   7. COMMAND MENU MODAL (⌘K / Ctrl+K)
   ============================================================================ */
export function CommandMenuModal({
  open,
  onClose,
  lang,
  isDark,
  onToggleTheme,
  onToggleLang,
  onNavigateView,
  onScrollToSection,
  onSelectProject,
  withBase,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onNavigateView: (v: BlueprintView) => void;
  onScrollToSection: (id: string) => void;
  onSelectProject: (slug: string) => void;
  withBase: (p: string) => string;
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const items = [
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Beranda (Overview)' : 'Home (Overview)',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        onNavigateView('home');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Pengalaman (Experience)' : 'Experience Section',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => {
        onScrollToSection('experience');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Proyek (Projects)' : 'Projects Section',
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => {
        onScrollToSection('projects');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Keahlian & Teknologi (Skills)' : 'Skills & Technologies',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        onScrollToSection('skills');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Pendidikan & Sertifikasi' : 'Education & Certifications',
      icon: <Award className="w-4 h-4" />,
      action: () => {
        onScrollToSection('education');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Highlights (2 Sertifikasi Pelatihan)' : 'Highlights (2 Certifications)',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => {
        onScrollToSection('highlights');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Film & Musik Favorit' : 'Movies & Music',
      icon: <Tv className="w-4 h-4" />,
      action: () => {
        onScrollToSection('movies');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Navigasi Halaman' : 'Navigation',
      label: lang === 'id' ? 'Kontak (Hubungi Saya)' : 'Contact Form',
      icon: <Mail className="w-4 h-4" />,
      action: () => {
        onNavigateView('contact');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Studi Kasus Proyek' : 'Project Case Studies',
      label: 'Mobile JKN — Sentiment Analysis & Dashboard (5 Slides)',
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => {
        onSelectProject('mobile-jkn');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Kontak Langsung' : 'Direct Contact',
      label: 'WhatsApp (+62 877-4441-5565)',
      icon: <Send className="w-4 h-4" />,
      action: () => {
        window.open('https://wa.me/6287744415565', '_blank');
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Preferensi & Dokumen' : 'Preferences & Links',
      label: isDark
        ? lang === 'id'
          ? 'Ganti ke Light Mode'
          : 'Switch to Light Mode'
        : lang === 'id'
          ? 'Ganti ke Dark Mode'
          : 'Switch to Dark Mode',
      icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Preferensi & Dokumen' : 'Preferences & Links',
      label:
        lang === 'id'
          ? 'Ganti Bahasa ke English (EN)'
          : 'Switch Language to Bahasa Indonesia (ID)',
      icon: <Globe className="w-4 h-4" />,
      action: () => {
        onToggleLang();
        onClose();
      },
    },
    {
      group: lang === 'id' ? 'Preferensi & Dokumen' : 'Preferences & Links',
      label: lang === 'id' ? 'Unduh CV / Résumé (PDF)' : 'Download CV / Résumé (PDF)',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        window.open(withBase('files/CV_Muhammad_Ravael_Chessario_Ramdoni.pdf'), '_blank');
        onClose();
      },
    },
  ];

  const filtered = items.filter((it) =>
    it.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'id'
                ? 'Ketik perintah atau cari bagian portofolio...'
                : 'Type a command or search portfolio sections...'
            }
            className="w-full text-sm bg-transparent focus:outline-none text-neutral-900 dark:text-neutral-100"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-neutral-800 dark:text-neutral-200 font-medium">
                {item.icon}
                {item.label}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">{item.group}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-neutral-500">
              {lang === 'id' ? 'Tidak ada hasil ditemukan.' : 'No matching commands found.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
