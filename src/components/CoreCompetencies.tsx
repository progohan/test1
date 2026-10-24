import React, { useState } from 'react';

import { FiTarget } from "react-icons/fi";
import { GoProject } from "react-icons/go";
import { RiTeamFill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaRegHandshake, FaRegLightbulb } from "react-icons/fa";
import { LiaFileContractSolid } from "react-icons/lia";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa6";
import { FaCloud, FaSuitcase } from "react-icons/fa";
import { MdOutlineEngineering } from "react-icons/md";
import { GiTeamIdea } from "react-icons/gi";

import { ResumeData } from '../types';

interface CoreCompetenciesProps {
  content: ResumeData['site_content'];
  technicalExpertise: ResumeData['technical_expertise'];
  leadershipSkills: string[];
}
type PillarKey = ResumeData['site_content']['competency_pillars'][number]['key'];
const CARD_ICONS: Record<string, React.ReactNode> = {
  FiTarget: <FiTarget />,
  RiTeamFill: <RiTeamFill />,
  FaRegHandshake: <FaRegHandshake />,
  LiaFileContractSolid: <LiaFileContractSolid />,
  FaSuitcase: <FaSuitcase />,
  GiTeamIdea: <GiTeamIdea />,
  GoProject: <GoProject />,
  RiMoneyDollarCircleLine: <RiMoneyDollarCircleLine />,
  AiOutlineThunderbolt: <AiOutlineThunderbolt />,
  MdOutlineEngineering: <MdOutlineEngineering />,
  FaDatabase: <FaDatabase />,
  FaCloud: <FaCloud />,
  FaRegLightbulb: <FaRegLightbulb />,
};

const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({
  technicalExpertise, content, leadershipSkills,
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('leadership');

  const visibleCards = content.competency_cards.filter(c => c.pillar === activePillar);
  const activePillarDef = content.competency_pillars.find(p => p.key === activePillar)!;

  const allTechnicalSkills = [
    ...technicalExpertise.technical_skills,
    ...technicalExpertise.technology_skills,
  ];

  return (
    <section id="competencies" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Core Competencies & Expertise
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              {content.competencies_intro}
            </p>
          </div>

          {/* Pillar Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {content.competency_pillars.map((pillar) => (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActivePillar(pillar.key)}
                aria-pressed={activePillar === pillar.key}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full border transition-colors ${
                  activePillar === pillar.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {pillar.label}
              </button>
            ))}
          </div>

          {/* Active Pillar Description */}
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-2xl mx-auto">
            {activePillarDef.description}
          </p>

          {/* Competency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {visibleCards.map((card) => (
              <div
                key={card.label}
                className="p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-start mb-3">
                  <span className="text-2xl text-primary mr-3 mt-0.5 shrink-0">{CARD_ICONS[card.icon] ?? <FiTarget />}</span>
                  <h4 className="text-foreground font-semibold leading-tight">{card.label}</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-10"><h3 className="text-lg font-semibold mb-3">Leadership Skills</h3><ul className="flex flex-wrap gap-2">{leadershipSkills.map(skill => <li key={skill} className="text-sm px-3 py-1 bg-muted rounded-full">{skill}</li>)}</ul></div>
          {/* Bottom Row: Delivery Models | Project Types | Technical Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Delivery Models — pill badges */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Models</h3>
              <div className="flex flex-wrap gap-2">
                {technicalExpertise.delivery_models.map((model) => (
                  <span
                    key={model}
                    className="px-4 py-2 bg-primary/10 border border-primary/25 rounded-full text-primary text-sm font-semibold"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Types */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Types</h3>
              <ul className="space-y-2">
                {technicalExpertise.project_types.map((type) => (
                  <li key={type} className="flex items-center text-foreground/90 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 shrink-0"></div>
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical + Technology Skills merged */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Technical Skills</h3>
              <ul className="space-y-2">
                {allTechnicalSkills.map((skill) => (
                  <li key={skill} className="flex items-center text-foreground/90 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 shrink-0"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreCompetencies;
