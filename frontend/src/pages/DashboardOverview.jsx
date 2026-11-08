import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Layers,
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
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import StatCard from '../components/common/StatCard';
import ScoreGauge from '../components/common/ScoreGauge';
import { analyticsAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { selectedBrand } = useBrand();
  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [overviewRes, reviewsRes] = await Promise.all([
          analyticsAPI.getOverview(),
          reviewAPI.getAll({ limit: 5 }),
        ]);

        if (overviewRes.data?.success) {
          setStats(overviewRes.data.data);
        }
        if (reviewsRes.data?.success) {
          setRecentReviews(reviewsRes.data.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedBrand]);

  const violationColors = ['#4338CA', '#7C3AED', '#14B8A6', '#F59E0B', '#DC2626'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Brand Governor'}
            </h1>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold border border-brand-100">
              Live Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active brand profile:{' '}
            <span className="font-semibold text-slate-800">
              {selectedBrand?.name || 'AuraHealth Systems'}
            </span>{' '}
            • All content reviews are cross-referenced with active style guides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/review"
            className="px-4 py-2.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audit New Content</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reviews"
          value={stats?.totalReviews ?? 24}
          icon={FileText}
          trend="+12% this mo"
          subtitle="All evaluated items"
          color="brand"
        />
        <StatCard
          title="Approved Content"
          value={stats?.approvedReviews ?? 18}
          icon={CheckCircle2}
          trend={`${stats?.approvalRate ?? 75}% pass rate`}
          subtitle="Signed by compliance"
          color="green"
        />
        <StatCard
          title="Issues Detected"
          value={stats?.issuesDetected ?? 47}
          icon={AlertTriangle}
          subtitle={`${stats?.breakdown?.critical ?? 12} critical violations`}
          color="amber"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingReviews ?? 4}
          icon={Clock}
          subtitle="Awaiting human sign-off"
          color="violet"
        />
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Consistency Score
          </span>
          <ScoreGauge score={stats?.avgScore ?? 84} size={78} strokeWidth={8} />
        </div>
      </div>

      {/* 3. Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Violation by Category Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Brand Guideline Violations by Category
              </h3>
              <p className="text-xs text-slate-500">
                Frequency of detected issues across recent content submissions
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
              Recorded Reviews
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.commonViolations || [
                  { category: 'Tone Consistency', count: 18 },
                  { category: 'Terminology', count: 24 },
                  { category: 'Factual Accuracy', count: 9 },
                  { category: 'Brand Messaging', count: 14 },
                  { category: 'Visual Guidance', count: 6 },
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {(stats?.commonViolations || []).map((entry, index) => (
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

        {/* Consistency Score Trend Line */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Quality Trend</h3>
            <p className="text-xs text-slate-500">Average consistency score over 6 months</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats?.monthlyActivity || [
                  { month: 'Jun', avgScore: 74 },
                  { month: 'Jul', avgScore: 78 },
                  { month: 'Aug', avgScore: 81 },
                  { month: 'Sep', avgScore: 80 },
                  { month: 'Oct', avgScore: 86 },
                  { month: 'Nov', avgScore: 89 },
                ]}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#4338CA"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4338CA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-100">
            <span>Average Alignment</span>
            <span className="font-bold text-slate-900">{stats?.avgScore ?? 84}% Compliance</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Reviews Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Content Reviews</h3>
              <p className="text-xs text-slate-500">Latest evaluated copy and approval statuses</p>
            </div>
            <Link
              to="/dashboard/history"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Title & Type</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Issues</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReviews.length > 0 ? (
                  recentReviews.map((rev) => (
                    <tr key={rev._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className="font-semibold text-slate-800 truncate max-w-xs">
                          {rev.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {rev.contentType} • {rev.brandId?.name || 'AuraHealth'}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            rev.consistencyScore >= 85
                              ? 'bg-green-50 text-status-success'
                              : rev.consistencyScore >= 65
                              ? 'bg-amber-50 text-status-warning'
                              : 'bg-red-50 text-status-error'
                          }`}
                        >
                          {rev.consistencyScore}%
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">
                        {rev.findings?.length || 0} items
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            rev.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : rev.status === 'Changes Requested'
                              ? 'bg-amber-100 text-amber-800'
                              : rev.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to={`/dashboard/history`}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400">
                      No recorded reviews found. Click "Audit New Content" to start!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Common Violations */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Governance Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/dashboard/review"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-brand-50/70 hover:bg-brand-100/70 border border-brand-100 text-xs font-semibold text-brand-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-700" />
                  <span>Run Content Review</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
              </Link>

              <Link
                to="/dashboard/brands"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>Manage Brand Guidelines</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/dashboard/approvals"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-dark" />
                  <span>Human Approval Queue</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Governance Notice Card */}
          <div className="bg-gradient-to-tr from-slate-900 to-brand-900 p-5 rounded-2xl text-white shadow-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-light">
              <ShieldAlert className="w-4 h-4" /> Human-in-the-Loop Safeguard
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inkloom AI provides diagnostic recommendations. The AI system never autonomously marks content as officially published without human reviewer authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
