import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { buildPortfolioMetrics } from '../lib/portfolioMetrics';
import { formatProjectValue } from '../lib/format';
const chartColors = ['#0057a8', '#168aad', '#6a994e', '#f59e0b', '#7c3aed', '#64748b'];
export default function PortfolioCharts({ metrics }: { metrics: ReturnType<typeof buildPortfolioMetrics> }) {
  return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-background border border-border rounded-lg p-5 shadow-sm lg:col-span-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Projects by Contract</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.contractChart}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {metrics.contractChart.map((entry, index) => (
                        <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {metrics.contractChart.map((item, index) => (
                  <div key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span>{item.name}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-5 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-1">Portfolio Value by Category</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Illustrative USD-equivalent full project values; total portfolio is shown separately for context.
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.sectorChart} margin={{ top: 8, right: 12, left: 0, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatProjectValue(Number(value))} />
                    <Tooltip formatter={(value) => [formatProjectValue(Number(value)), 'USD-equivalent value']} />
                    <Bar dataKey="valueMillions" radius={[6, 6, 0, 0]}>
                      {metrics.sectorChart.map((entry, index) => (
                        <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
  );
}
