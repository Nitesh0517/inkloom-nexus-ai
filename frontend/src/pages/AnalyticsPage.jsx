import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Info,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { analyticsAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import ScoreGauge from '../components/common/ScoreGauge';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await analyticsAPI.getOverview();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.warn('Analytics fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const pieData = data
    ? [
        { name: 'Approved', value: data.approvedReviews, color: '#16A34A' },
        { name: 'Changes Requested', value: data.changesRequested, color: '#F59E0B' },
        { name: 'Rejected', value: data.rejectedReviews, color: '#DC2626' },
        { name: 'Pending Review', value: data.pendingReviews, color: '#4338CA' },
      ].filter((d) => d.value > 0)
    : [];

  const violationColors = ['#4338CA', '#7C3AED', '#14B8A6', '#F59E0B', '#DC2626'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Brand Governance Analytics
            </h1>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold border border-brand-100">
              Forensic Quality Trends
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate compliance performance, guideline violation frequencies, and organizational improvement curves.
          </p>
        </div>
      </div>

      {/* Top Stat KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Content Reviews"
          value={data?.totalReviews ?? 24}
          icon={BarChart3}
          trend="+15% MoM"
          subtitle="Processed by engine"
          color="brand"
        />
        <StatCard
          title="Human Approval Rate"
          value={`${data?.approvalRate ?? 75}%`}
          icon={CheckCircle2}
          trend="Certified Publications"
          subtitle="Meets all guidelines"
          color="green"
        />
        <StatCard
          title="Total Issues Identified"
          value={data?.issuesDetected ?? 47}
          icon={AlertTriangle}
          subtitle={`${data?.breakdown?.critical ?? 12} Critical Infractions`}
          color="amber"
        />
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg Consistency Score
          </span>
          <ScoreGauge score={data?.avgScore ?? 84} size={75} strokeWidth={8} />
        </div>
      </div>

      {/* Primary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Violation Distribution by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Common Brand Violations by Category
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated distribution of flagged governance issues
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.commonViolations || [
                  { category: 'Tone', count: 18 },
                  { category: 'Terminology', count: 24 },
                  { category: 'Facts', count: 9 },
                  { category: 'Messaging', count: 14 },
                  { category: 'Visual', count: 6 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(data?.commonViolations || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={violationColors[index % violationColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approval State Distribution Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Human Review Decisions Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Distribution of reviewer determinations across all submissions
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No review data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard: Most Frequently Violated Guidelines */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-brand-700" />
            Most Frequently Violated Guidelines & Standards
          </h3>
          <p className="text-xs text-slate-500">
            Policies requiring additional organizational training and clarity
          </p>
        </div>

        <div className="space-y-3">
          {(data?.topViolatedGuidelines || [
            { guideline: 'Approved Claims Protocol & Regulatory Fact Sheet', count: 16 },
            { guideline: 'Brand Nomenclature & Restricted Terminology Guide', count: 14 },
            { guideline: 'Tone of Voice Guide (Accessible Healthcare Professional)', count: 9 },
            { guideline: 'Enterprise Positioning & Value Statement Guide', count: 7 },
            { guideline: 'Banking & Financial Product Disclosures v2', count: 4 },
          ]).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-800">{item.guideline}</span>
              </div>
              <span className="text-xs font-bold text-status-error bg-red-50 px-2.5 py-1 rounded-md">
                {item.count} infractions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Governance Explanatory Disclaimer */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 block">Governance Scope Disclaimer:</span>
          <p className="leading-relaxed">
            {data?.disclaimer ||
              'Governance metrics and consistency scores are derived strictly from evaluated submissions and serve as compliance guidance rather than certified legal validation. Final publication liability remains with designated organizational reviewers.'}
          </p>
        </div>
      </div>
    </div>
  );
}
