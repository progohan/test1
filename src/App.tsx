import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import PortfolioSnapshot from './components/PortfolioSnapshot';
import Experience from './components/Experience';
import CoreCompetencies from './components/CoreCompetencies';
import KeyProjects from './components/KeyProjects';
import Education from './components/Education';
import Contact from './components/Contact';
import { ResumeData, ResumeDataSchema } from './types';

export default function App({ initialData }: { initialData?: ResumeData }) {
  const [data, setData] = useState<ResumeData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (initialData) return;
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch('./data.json', { signal: controller.signal });
        if (!response.ok) throw new Error(`Portfolio request failed: ${response.status}`);
        setData(ResumeDataSchema.parse(await response.json()));
      } catch (cause) {
        if (cause instanceof Error && cause.name === 'AbortError') return;
        console.error('Portfolio could not be loaded.', cause);
        setError(true);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    void load();
    return () => controller.abort();
  }, [initialData]);
  if (loading) return <div role="status" className="min-h-screen flex items-center justify-center">Loading portfolio...</div>;
  if (error || !data) return <main className="min-h-screen flex flex-col gap-4 items-center justify-center p-6" role="alert"><h1>Error Loading Data</h1><p>The portfolio could not be loaded. Please reload the page.</p><button onClick={() => window.location.reload()} className="px-6 py-3 rounded bg-primary text-primary-foreground">Retry</button></main>;
  const content = data.site_content;
  return <div className="min-h-screen bg-background text-foreground">
    <Header name={data.personal_info.full_name} links={content.navigation} />
    <main id="main-content" tabIndex={-1}>
      <Hero data={data.personal_info} />
      <PortfolioSnapshot data={data} />
      <About data={data.personal_info} achievements={data.key_achievements} heading={content.about_heading} image={`${import.meta.env.BASE_URL}${data.personal_info.profile_image}`} />
      <Experience experiences={data.work_experience} intro={content.experience_intro} />
      <CoreCompetencies content={content} technicalExpertise={data.technical_expertise} leadershipSkills={data.leadership_skills} />
      <KeyProjects projects={data.key_projects} intro={content.projects_intro} />
      <Education education={data.education} programs={data.postgraduate_programs} certifications={data.professional_certifications} intro={content.education_intro} badges={content.credential_badges} />
      <Contact data={data.personal_info} intro={content.contact_intro} />
    </main>
  </div>;
}
