import { z } from 'zod';

const text = z.string().min(1);
const monthDate = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const projectDate = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/);
const contract = z.enum(['P3', 'PDB', 'DB', 'DBB', 'CMAR', 'Alliance', 'Other']);
const sector = z.enum(['rail', 'highway', 'other']);
const region = z.enum(['usa', 'canada', 'europe', 'south-america', 'other']);
const pillar = z.enum(['leadership', 'engineering', 'digital']);

export type ContractType = z.infer<typeof contract>;
export type ProjectSector = z.infer<typeof sector>;
export type ProjectRegion = z.infer<typeof region>;

export const ResumeDataSchema = z.object({
  personal_info: z.object({
    full_name: text, credentials: z.array(text), current_title: text, location: text,
    cv_url: text.optional(), profile_image: text, cv_summary: text,
    contact: z.object({
      email: z.email(),
      linkedin: z.url().refine(value => {
        const url = new URL(value);
        return url.protocol === 'https:' && /(^|\.)linkedin\.com$/.test(url.hostname);
      }, 'Use a valid HTTPS LinkedIn profile URL.'),
    }),
    summary: text, about_description: text,
  }),
  core_competencies: z.array(text),
  work_experience: z.array(z.object({
    position: text, company: text, location: text, duration: text,
    start_date: monthDate, end_date: monthDate.nullable(),
    responsibilities: z.array(text).min(1),
  }).refine(job => job.end_date === null || job.end_date >= job.start_date, 'Job dates must be chronological.')).min(1),
  education: z.array(z.object({ degree: text, institution: text, year: z.string().regex(/^\d{4}$/), status: text.optional() })),
  postgraduate_programs: z.array(z.object({ program: text, institution: text, year: z.string().regex(/^\d{4}$/) })),
  professional_certifications: z.array(z.object({
    certification: text, jurisdictions: z.array(text).optional(), jurisdiction: text.optional(),
    country: text.optional(), issuing_organization: text.optional(), organization: text.optional(),
  })),
  key_projects: z.array(z.object({
    name: text, value: text, value_millions: z.number().positive(), currency: z.enum(['USD', 'CAD', 'EUR']),
    role: text, company: text, location: text.optional(), client: text.optional(),
    contribution: text.optional(), achievement: text.optional(), scope: text.optional(), timeframe: text,
    start_date: projectDate, end_date: projectDate.nullable(),
    contract_type: contract, sector, region,
    map: z.object({
      latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180),
      label: text, accuracy: z.literal('approximate'),
    }),
  })),
  key_achievements: z.array(text),
  technical_expertise: z.object({
    delivery_models: z.array(text), project_types: z.array(text),
    technical_skills: z.array(text), technology_skills: z.array(text),
  }),
  leadership_skills: z.array(text),
  site_content: z.object({
    navigation: z.array(z.object({ id: text.regex(/^[a-z][a-z0-9-]*$/), label: text })),
    about_heading: text, experience_intro: text, education_intro: text,
    competencies_intro: text, projects_intro: text, snapshot_intro: text, contact_intro: text,
    competency_cards: z.array(z.object({ label: text, description: text, icon: text, pillar })),
    competency_pillars: z.array(z.object({ key: pillar, label: text, description: text })),
    credential_badges: z.array(z.object({ abbr: text, label: text })),
  }),
  metrics_assumptions: z.object({
    conversion_rates: z.object({ USD: z.literal(1), CAD: z.number().positive(), EUR: z.number().positive() }),
    reference_date: z.string().nullable(), basis: text, value_scope: text, project_years_basis: text,
  }),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
