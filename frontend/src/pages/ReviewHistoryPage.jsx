import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { reviewAPI } from '../services/api';
import { useBrand } from '../context/BrandContext';
import ScoreGauge from '../components/common/ScoreGauge';

export default function ReviewHistoryPage() {
  const { brands } = useBrand();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getAll({
        search: search || undefined,
        brandId: selectedBrandFilter !== 'all' ? selectedBrandFilter : undefined,
        status: selectedStatusFilter !== 'all' ? selectedStatusFilter : undefined,
      });
      if (res.data?.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.warn('Error fetching review history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedBrandFilter, selectedStatusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recorded review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(reviews.filter((r) => r._id !== id));
      if (selectedReview?._id === id) setSelectedReview(null);
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Governance Review History & Audit Log
            </h1>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold border border-brand-100">
              {reviews.length} Recorded Audits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, compare revisions, and inspect forensic findings across all evaluated content.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or text snippet..."
              className="w-full text-xs px-3.5 py-2 pl-9 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </div>

          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Brand Profiles</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Approval States</option>
            <option value="Approved">Approved</option>
            <option value="Changes Requested">Changes Requested</option>
            <option value="Under Review">Under Review</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Content Title</th>
                <th className="py-3 px-4">Brand Profile</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Findings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Audit Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-slate-900 max-w-xs truncate">
                      {rev.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {rev.brandId?.name || 'AuraHealth Systems'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{rev.contentType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${
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
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {rev.findings?.length || 0} issues
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
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
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReview(rev)}
                          className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="p-1 text-slate-400 hover:text-status-error transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No recorded content reviews match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED INSPECTION DRAWER / MODAL */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Review Audit Record
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedReview.title}
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Brand: <strong className="text-slate-800">{selectedReview.brandId?.name}</strong> •{' '}
                  Status: <strong className="text-slate-800">{selectedReview.status}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-6">
              <ScoreGauge score={selectedReview.consistencyScore} size={75} strokeWidth={8} />
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800">Governance Summary</span>
                <p className="text-xs text-slate-600">{selectedReview.summary}</p>
                {selectedReview.reviewerNotes && (
                  <p className="text-xs text-brand-700 italic pt-1">
                    Reviewer Notes: "{selectedReview.reviewerNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Text Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Original Submitted Content:
                </span>
                <p className="text-xs text-slate-800 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                  {selectedReview.originalContent}
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Improved Content:
                </span>
                <p className="text-xs text-emerald-950 whitespace-pre-wrap text-xs leading-relaxed">
                  {selectedReview.improvedContent || selectedReview.originalContent}
                </p>
              </div>
            </div>

            {/* Findings list */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Recorded Findings ({selectedReview.findings?.length || 0}):
              </span>
              <div className="space-y-2">
                {selectedReview.findings?.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{f.issue}</span>
                      <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {f.category} • {f.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{f.explanation}</p>
                    {f.suggestedCorrection && (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50/50 p-2 rounded">
                        <strong>Correction:</strong> "{f.suggestedCorrection}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
