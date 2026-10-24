import React, { Suspense, lazy, useMemo } from 'react';
import DeferredContent from './DeferredContent';
import { formatProjectValue } from '../lib/format';
const PortfolioCharts = lazy(() => import('./PortfolioCharts'));

import { BriefcaseBusiness, DollarSign, GitBranch, MapPinned, Route, TrainFront } from 'lucide-react';
import { ResumeData } from '../types';
import { buildPortfolioMetrics, formatYears } from '../lib/portfolioMetrics';
import { useRenderDate } from '../lib/clock';

interface PortfolioSnapshotProps {
  data: ResumeData;
}



const PortfolioSnapshot: React.FC<PortfolioSnapshotProps> = ({ data }) => {
  const currentDate = useRenderDate();
  const at = currentDate.toISOString();
  const metrics = useMemo(() => buildPortfolioMetrics(data, new Date(at)), [data, at]);

  const headlineStats = [
    {
      label: 'Career Experience',
      value: `${formatYears(metrics.careerYears)} yrs`,
      detail: 'Infrastructure leadership',
      icon: BriefcaseBusiness,
    },
    {
      label: 'Key Projects',
      value: metrics.totalProjects.toString(),
      detail: 'Major programs represented',
      icon: Route,
    },
    {
      label: 'Rail Portfolio',
      value: metrics.railProjects.toString(),
      detail: `${metrics.railYears} estimated calendar years`,
      icon: TrainFront,
    },
    {
      label: 'Highway & Bridges',
      value: metrics.highwayProjects.toString(),
      detail: `${metrics.highwayYears} estimated calendar years`,
      icon: GitBranch,
    },
    {
      label: 'Largest Project',
      value: formatProjectValue(metrics.largestProject?.parsedValueMillions),
      detail: metrics.largestProject?.name ?? 'Project value unavailable',
      icon: DollarSign,
    },
    {
      label: 'Regions',
      value: metrics.regions.length.toString(),
      detail: 'U.S., Canada, Europe, South America',
      icon: MapPinned,
    },
  ];

  return (
    <section id="snapshot" className="py-16 sm:py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Portfolio Snapshot
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              {data.site_content.snapshot_intro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {headlineStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-background border border-border rounded-lg p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{stat.detail}</p>
                </div>
              );
            })}
          </div>

          <DeferredContent fallback={<p className="text-muted-foreground text-center">Interactive charts load as this section approaches the screen.</p>}>
            <Suspense fallback={<p role="status">Loading charts...</p>}><PortfolioCharts metrics={metrics} /></Suspense>
          </DeferredContent>
          <details className="mt-8 border border-border rounded-lg p-4">
            <summary className="cursor-pointer font-semibold">View chart data and calculation notes</summary>
            <table className="w-full text-sm mt-4"><caption className="sr-only">Illustrative full project values in USD millions</caption><thead><tr><th scope="col" className="text-left">Category</th><th scope="col" className="text-right">USD millions</th></tr></thead><tbody>{metrics.sectorChart.map(row => <tr key={row.key}><th scope="row" className="text-left font-normal py-1">{row.name}</th><td className="text-right">{row.valueMillions.toLocaleString('en-US')}</td></tr>)}</tbody></table>
            <p className="mt-4 text-sm text-muted-foreground">{data.metrics_assumptions.value_scope}</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.metrics_assumptions.basis}</p>
            <p className="mt-2 text-sm text-muted-foreground">Fixed conversion factors: CAD to USD {data.metrics_assumptions.conversion_rates.CAD}; EUR to USD {data.metrics_assumptions.conversion_rates.EUR}. Reference date: {data.metrics_assumptions.reference_date ?? 'not recorded'}.</p>
            <p className="mt-2 text-sm text-muted-foreground">{data.metrics_assumptions.project_years_basis}</p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSnapshot;
