import { z } from 'zod';
import {
  ProfileSchema,
  AboutSchema,
  GalleryItemSchema,
  EducationSchema,
  ExperienceItemSchema,
  ProjectSchema,
  SkillItemSchema,
  CertificateItemSchema,
  ContactSchema,
  type Bilingual,
} from './schema';

import rawProfile from '../content/profile.json';
import rawAbout from '../content/about.json';
import rawGallery from '../content/gallery.json';
import rawEducation from '../content/education.json';
import rawExperience from '../content/experience.json';
import rawProjects from '../content/projects.json';
import rawSkills from '../content/skills.json';
import rawCertificates from '../content/certificates.json';
import rawContact from '../content/contact.json';

export const profile = ProfileSchema.parse(rawProfile);
export const about = AboutSchema.parse(rawAbout);
export const gallery = z.array(GalleryItemSchema).parse(rawGallery);
export const education = EducationSchema.parse(rawEducation);
export const experience = z.array(ExperienceItemSchema).parse(rawExperience);
export const projects = z.array(ProjectSchema).parse(rawProjects);
export const skills = z.array(SkillItemSchema).parse(rawSkills);
export const certificates = z.array(CertificateItemSchema).parse(rawCertificates);
export const contact = ContactSchema.parse(rawContact);

export type Lang = 'id' | 'en';

export function t(val: Bilingual | undefined | null, lang: Lang): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val.id;
}
