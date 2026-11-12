import React from 'react';
import { projects, t, type Lang } from '../lib/content';
import { triggerHapticAndSound } from '../lib/feedback';

interface CaseStudyViewProps {
  slug: string;
  lang: Lang;
  baseUrl: string;
  onNavigate: (hash: string) => void;
}

const LABELS = {
  id: {
    backToProjects: 'Kembali ke bagian Proyek',
    templateSwitcher: 'Pilih Template Studi Kasus',
    templateML: 'Template A: Machine Learning / Data Science',
    templateDA: 'Template B: Data Analyst / Efisiensi Data',
    honestLabel: 'Klasifikasi Proyek',
    liveDemo: 'Buka Dashboard / Demo Langsung',
    metricsTitle: 'Metrik Evaluasi Model & Skala Dataset',
    daMetricsTitle: 'Angka Kunci: Skala Data, Cakupan & Efisiensi',
    pipelineEyebrow: 'ALUR PENGOLAHAN DATA BERTAHAP',
    pipelineTitle: 'Tahapan End-to-End & Tools yang Digunakan',
    toolsUsed: 'Tools:',
    outputLabel: 'Output Tahap:',
    findingsEyebrow: 'INSIGHT UTAMA DARI DATA',
    findingsTitle: 'Temuan Kunci & Visualisasi Bukti',
    recBadge: 'Rekomendasi Langsung:',
    actionsEyebrow: 'TINDAK LANJUT & KEPUTUSAN',
    actionsTitle: 'Action Items yang Disarankan Berdasarkan Insight',
    targetCol: 'Sasaran Sistem / Area',
    actionCol: 'Tindakan yang Disarankan',
    impactCol: 'Dampak Terukur',
    contextEyebrow: 'KONTEKS & METODOLOGI',
    nextCaseStudy: 'Lihat Template Studi Kasus Lainnya',
    openStudy: 'Buka Studi Kasus',
  },
  en: {
    backToProjects: 'Back to Projects section',
    templateSwitcher: 'Switch Case Study Template',
    templateML: 'Template A: Machine Learning / Data Science',
    templateDA: 'Template B: Data Analyst / Data Efficiency',
    honestLabel: 'Project Classification',
    liveDemo: 'Open Live Dashboard / Demo',
    metricsTitle: 'Model Evaluation Metrics & Dataset Scale',
    daMetricsTitle: 'Key Figures: Data Scale, Coverage & Efficiency',
    pipelineEyebrow: 'STEP-BY-STEP DATA PROCESSING PIPELINE',
    pipelineTitle: 'End-to-End Stages & Tools Used',
    toolsUsed: 'Tools:',
    outputLabel: 'Stage Output:',
    findingsEyebrow: 'KEY INSIGHTS FROM THE DATA',
    findingsTitle: 'Core Findings & Visual Evidence',
    recBadge: 'Direct Recommendation:',
    actionsEyebrow: 'DECISIONS & NEXT STEPS',
    actionsTitle: 'Recommended Action Items Based on Insights',
    targetCol: 'Target System / Area',
    actionCol: 'Recommended Action',
    impactCol: 'Expected Impact',
    contextEyebrow: 'CONTEXT & METHODOLOGY',
    nextCaseStudy: 'Explore the Other Case Study Template',
    openStudy: 'Open Case Study',
  },
};

function FindingChart({ type, lang }: { type: string; lang: Lang }) {
  if (type === 'bar-comparison') {
    return (
      <div className="finding-chart" aria-label="Hybrid Labeling Correction Chart">
        <div className="fc-row">
          <div className="fc-head">
            <span>{lang === 'id' ? 'Rating Bintang 3 (Netral Semu)' : '3-Star Rating (Pseudo-Neutral)'}</span>
            <strong className="fc-val amber">89% {lang === 'id' ? 'berisi keluhan' : 'contain complaints'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill amber" style={{ width: '89%' }} />
          </div>
        </div>
        <div className="fc-row">
          <div className="fc-head">
            <span>{lang === 'id' ? 'Rating Bintang 4 (Koreksi Negatif)' : '4-Star Rating (Corrected to Negative)'}</span>
            <strong className="fc-val cobalt">41% {lang === 'id' ? 'dikoreksi negatif' : 'corrected negative'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill cobalt" style={{ width: '41%' }} />
          </div>
        </div>
        <div className="fc-row">
          <div className="fc-head">
            <span>{lang === 'id' ? 'Rating Bintang 5 (Koreksi Negatif)' : '5-Star Rating (Corrected to Negative)'}</span>
            <strong className="fc-val emerald">8% {lang === 'id' ? 'dikoreksi negatif' : 'corrected negative'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill emerald" style={{ width: '8%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'complaint-clusters') {
    return (
      <div className="finding-chart" aria-label="Top Complaint Bigram Clusters">
        <div className="fc-row">
          <div className="fc-head">
            <span>1. {lang === 'id' ? 'Kegagalan Kode OTP (Login & Akun)' : 'OTP Code Failures (Login & Account)'}</span>
            <strong className="fc-val cobalt">{lang === 'id' ? 'Prioritas #1' : 'Priority #1'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill cobalt" style={{ width: '92%' }} />
          </div>
        </div>
        <div className="fc-row">
          <div className="fc-head">
            <span>2. {lang === 'id' ? 'Verifikasi Wajah / Biometrik' : 'Face / Biometric Verification'}</span>
            <strong className="fc-val amber">{lang === 'id' ? 'Prioritas #2' : 'Priority #2'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill amber" style={{ width: '74%' }} />
          </div>
        </div>
        <div className="fc-row">
          <div className="fc-head">
            <span>3. {lang === 'id' ? 'Verifikasi Nomor Ponsel' : 'Phone Number Verification'}</span>
            <strong className="fc-val emerald">{lang === 'id' ? 'Prioritas #3' : 'Priority #3'}</strong>
          </div>
          <div className="fc-track">
            <div className="fc-fill emerald" style={{ width: '61%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finding-chart" aria-label="Administrative Efficiency Comparison">
      <div className="fc-row">
        <div className="fc-head">
          <span>{lang === 'id' ? 'Sebelum (Dokumen Terpisah Manual)' : 'Before (Scattered Manual Files)'}</span>
          <strong className="fc-val">100% {lang === 'id' ? 'beban waktu' : 'time baseline'}</strong>
        </div>
        <div className="fc-track">
          <div className="fc-fill muted" style={{ width: '100%' }} />
        </div>
      </div>
      <div className="fc-row">
        <div className="fc-head">
          <span>{lang === 'id' ? 'Sesudah (Database CMS Terstruktur)' : 'After (Structured CMS Database)'}</span>
          <strong className="fc-val emerald">-50% {lang === 'id' ? 'waktu administrasi' : 'admin time'}</strong>
        </div>
        <div className="fc-track">
          <div className="fc-fill emerald" style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  );
}

export default function CaseStudyView({ slug, lang, baseUrl, onNavigate }: CaseStudyViewProps) {
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = idx >= 0 ? projects[idx] : projects[0];
  const otherProject =
    projects.length > 1 ? projects[(idx >= 0 ? idx + 1 : 1) % projects.length] : null;
  const u = LABELS[lang];
  const cs = project.cs;

  return (
    <article className="cs-page">
      <div className="section-inner">
        {/* Top bar: Back button + Project switcher (if multiple projects exist) */}
        <div className="cs-topbar">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              triggerHapticAndSound('tap');
              onNavigate('#proyek');
            }}
          >
            ← {u.backToProjects}
          </button>

          {projects.length > 1 && (
            <div className="cs-template-switcher" role="group" aria-label={u.templateSwitcher}>
              {projects.map((p) => {
                const active = p.slug === project.slug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    className={`cs-switch-btn ${active ? 'is-active' : ''}`}
                    aria-pressed={active}
                    onClick={() => {
                      triggerHapticAndSound('tap');
                      onNavigate(`#/proyek/${p.slug}`);
                    }}
                  >
                    {t(p.title, lang)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Header */}
        <header className="cs-header">
          <div className="cs-badges">
            <span className="badge-pill badge-accent">{t(project.categoryBadge, lang)}</span>
            <span className="badge-pill badge-honest">
              {u.honestLabel}: {t(project.projectTypeLabel, lang)}
            </span>
          </div>
          <p className="eyebrow">{t(cs.eyebrow, lang)}</p>
          <h1 className="cs-title">{t(cs.headline, lang)}</h1>
          <p className="cs-subtitle">{t(cs.subheadline, lang)}</p>

          <div className="chip-row">
            {project.tags.map((tag) => (
              <span key={tag} className="tech-chip">
                {tag}
              </span>
            ))}
          </div>

          {project.demo && (
            <div style={{ marginTop: 12 }}>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {u.liveDemo} ↗
              </a>
            </div>
          )}
        </header>

        {/* Visual Cover */}
        <div className="cs-cover-frame">
          <img
            src={baseUrl + project.cover}
            alt={t(project.title, lang)}
            className="cs-cover-img"
          />
        </div>

        {/* Key Metrics Grid */}
        <section className="cs-block-section" aria-label={u.metricsTitle}>
          <div className="eyebrow">
            {project.template === 'ml' ? u.metricsTitle : u.daMetricsTitle}
          </div>
          <div className={`cs-metrics-grid ${project.template === 'ml' ? 'cols-3' : 'cols-3'}`}>
            {cs.metrics.map((m) => (
              <div key={m.v + t(m.l, lang)} className="cs-metric-card">
                <strong className="cs-metric-val">{m.v}</strong>
                <span className="cs-metric-label">{t(m.l, lang)}</span>
                {m.note && <small className="cs-metric-note">{t(m.note, lang)}</small>}
              </div>
            ))}
          </div>
        </section>

        {/* Context & Methodology Summary */}
        <section className="cs-block-section">
          <div className="eyebrow">{u.contextEyebrow}</div>
          <div className="cs-two-col">
            {cs.blocks.map((b) => (
              <div key={t(b.title, lang)} className="surface-card">
                <h2 className="card-h3">{t(b.title, lang)}</h2>
                <p className="body-text">{t(b.text, lang)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Data Processing Pipeline + Tools Used */}
        <section className="cs-block-section">
          <div className="eyebrow">{u.pipelineEyebrow}</div>
          <h2 className="section-h2" style={{ marginTop: 6, marginBottom: 24 }}>
            {u.pipelineTitle}
          </h2>
          <div className="cs-pipeline-list">
            {cs.pipeline.map((step) => (
              <div key={step.step} className="surface-card cs-pipeline-card">
                <div className="cs-step-num">{step.step}</div>
                <div className="cs-step-body">
                  <div className="cs-step-top">
                    <h3 className="card-h3">{t(step.title, lang)}</h3>
                    <div className="cs-step-tools">
                      <span className="cs-tools-label">{u.toolsUsed}</span>
                      {step.tools.map((tool) => (
                        <span key={tool} className="tech-chip chip-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="body-text">{t(step.description, lang)}</p>
                  <div className="cs-step-output">
                    <span>{u.outputLabel}</span>
                    <strong>{t(step.outputMetric, lang)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Findings Cards (Number, Sentence, Visual Chart, Direct Recommendation) */}
        <section className="cs-block-section">
          <div className="eyebrow">{u.findingsEyebrow}</div>
          <h2 className="section-h2" style={{ marginTop: 6, marginBottom: 24 }}>
            {u.findingsTitle}
          </h2>
          <div className="cs-findings-grid">
            {cs.findings.map((f) => (
              <div key={f.metric + t(f.title, lang)} className="surface-card cs-finding-card">
                <div className="cs-finding-head">
                  <span className="cs-finding-num">{f.metric}</span>
                  <h3 className="card-h3">{t(f.title, lang)}</h3>
                </div>
                <p className="body-text">{t(f.sentence, lang)}</p>
                <FindingChart type={f.chartType} lang={lang} />
                <div className="cs-finding-rec">
                  <strong>{u.recBadge}</strong> <span>{t(f.recommendation, lang)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Items / Recommendations Table-Cards */}
        <section className="cs-block-section">
          <div className="eyebrow">{u.actionsEyebrow}</div>
          <h2 className="section-h2" style={{ marginTop: 6, marginBottom: 24 }}>
            {u.actionsTitle}
          </h2>
          <div className="cs-actions-grid">
            {cs.actionItems.map((item) => (
              <div key={item.priority + t(item.target, lang)} className="surface-card cs-action-card">
                <span className="badge-pill badge-accent">{item.priority}</span>
                <h3 className="card-h3" style={{ marginTop: 10 }}>
                  {t(item.target, lang)}
                </h3>
                <p className="body-text" style={{ marginTop: 8 }}>
                  {t(item.action, lang)}
                </p>
                <div className="cs-action-impact">
                  <small>{u.impactCol}:</small>
                  <strong>{t(item.expectedImpact, lang)}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Navigation to Other Template */}
        {otherProject && (
          <div className="cs-next-banner surface-card">
            <div>
              <span className="eyebrow">{u.nextCaseStudy}</span>
              <h3 className="card-h3" style={{ marginTop: 6 }}>
                {t(otherProject.title, lang)}
              </h3>
              <p className="muted-text" style={{ marginTop: 4 }}>
                {t(otherProject.categoryBadge, lang)} · {t(otherProject.projectTypeLabel, lang)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                triggerHapticAndSound('tap');
                onNavigate(`#/proyek/${otherProject.slug}`);
              }}
            >
              {u.openStudy} →
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
