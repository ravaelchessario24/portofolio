import { z } from 'zod';

export const BilingualText = z.union([
  z.string(),
  z.object({
    id: z.string(),
    en: z.string(),
  }),
]);

export type Bilingual = z.infer<typeof BilingualText>;

export const ProfileSchema = z.object({
  name: z.string(),
  brand: z.string(),
  greeting: BilingualText,
  roles: z.array(BilingualText),
  badgeRole: BilingualText,
  quote: BilingualText,
  photo: z.string(),
  avatar: z.string(),
  squarePhoto: z.string(),
  cv: z.string(),
  email: z.string().email(),
  location: z.string(),
  languages: z.array(BilingualText),
});

export const AboutSchema = z.object({
  profile: BilingualText,
  photo: z.string(),
});

export const GalleryItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  cat: BilingualText,
  catKey: z.string(),
  date: z.string(),
  caption: BilingualText,
  privacyNote: BilingualText.optional(),
});

export const EducationSchema = z.object({
  logo: z.string(),
  logoDark: z.string().optional(),
  school: z.string(),
  degree: BilingualText,
  period: z.string(),
  gpa: z.number(),
  gpaMax: z.number(),
  nomination: BilingualText,
  nominationNote: BilingualText,
  favorites: z.array(BilingualText),
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  title: BilingualText,
  org: z.string(),
  period: BilingualText,
  location: BilingualText,
  participants: BilingualText.optional(),
  impact: BilingualText.optional(),
  lines: z.array(BilingualText),
  relevance: BilingualText,
  detail: z.object({
    tasks: z.array(BilingualText),
    result: BilingualText,
    photos: z.array(z.string()),
  }),
});

export const PipelineStepSchema = z.object({
  step: z.string(),
  title: BilingualText,
  tools: z.array(z.string()),
  description: BilingualText,
  outputMetric: BilingualText,
});

export const FindingCardSchema = z.object({
  metric: z.string(),
  title: BilingualText,
  sentence: BilingualText,
  chartType: z.enum(['bar-comparison', 'complaint-clusters', 'efficiency-before-after', 'sentiment-split']),
  recommendation: BilingualText,
});

export const ActionItemSchema = z.object({
  priority: z.string(),
  target: BilingualText,
  action: BilingualText,
  expectedImpact: BilingualText,
});

export const ProjectSchema = z.object({
  slug: z.string(),
  template: z.enum(['ml', 'da']),
  title: BilingualText,
  projectTypeLabel: BilingualText,
  categoryBadge: BilingualText,
  period: BilingualText,
  summary: BilingualText,
  cover: z.string(),
  tags: z.array(z.string()),
  demo: z.string().optional(),
  caseStudy: z.string(),
  featured: z.boolean(),
  cs: z.object({
    eyebrow: BilingualText,
    headline: BilingualText,
    subheadline: BilingualText,
    metrics: z.array(
      z.object({
        v: z.string(),
        l: BilingualText,
        note: BilingualText.optional(),
      })
    ),
    pipeline: z.array(PipelineStepSchema),
    findings: z.array(FindingCardSchema),
    actionItems: z.array(ActionItemSchema),
    blocks: z.array(
      z.object({
        title: BilingualText,
        text: BilingualText,
      })
    ),
  }),
});

export const SkillItemSchema = z.object({
  name: BilingualText,
  group: z.string(),
  tool: z.boolean(),
  usedIn: BilingualText.optional(),
  logo: z.string().optional(),
});

export const CertificateItemSchema = z.object({
  title: BilingualText,
  issuer: z.string(),
  date: BilingualText,
  summary: BilingualText.optional(),
  image: z.string(),
});

export const ContactSchema = z.object({
  headline: BilingualText,
  sub: BilingualText,
  linkedin: z.string().url(),
  location: z.string(),
  mapsUrl: z.string().url(),
  availableFrom: BilingualText,
});
