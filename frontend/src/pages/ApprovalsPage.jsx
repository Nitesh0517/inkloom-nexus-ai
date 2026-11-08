import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Send,
  UserCheck,
  FileText,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';
import { reviewAPI, approvalAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ScoreGauge from '../components/common/ScoreGauge';

export default function ApprovalsPage() {
  const { user, isComplianceOfficer } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getAll({ limit: 50 });
      if (res.data?.success) {
        setReviews(res.data.data);
        if (res.data.data.length > 0 && !selectedReview) {
          setSelectedReview(res.data.data[0]);
        }
      }
    } catch (err) {
      console.warn('Approvals fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDecision = async (decision) => {
    if (!selectedReview) return;
    if (!comments.trim()) {
      alert('Please enter compliance comments / feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await approvalAPI.create({
        reviewId: selectedReview._id,
        decision,
        comments,
        versionReviewed: 'AI-Improved',
      });

      alert(`Decision successfully recorded: Content is now marked as ${decision}.`);
      setComments('');
      await fetchReviews();

      // Update selected review
      const updated = reviews.find((r) => r._id === selectedReview._id);
      if (updated) {
        setSelectedReview({ ...updated, status: decision });
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Approval action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Human Review & Approval Workflow
            </h1>
            <span className="text-xs bg-teal-50 text-teal-dark px-2.5 py-0.5 rounded-full font-semibold border border-teal-100 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Human-in-the-Loop Gate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified decision portal: Only authorized human reviewers may sign off on content before public distribution.
          </p>
        </div>

        {/* Role indicator */}
        <div className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-status-success animate-pulse"></div>
          <span className="text-slate-500">Acting As:</span>
          <span className="font-bold text-slate-800">
            {user?.name || 'Sarah Chen'} ({user?.role?.replace('_', ' ') || 'Compliance Officer'})
          </span>
        </div>
      </div>

      {/* Filter status tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Under Review', 'Changes Requested', 'Approved', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === st
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Reviewer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Review Submissions List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
            Submissions Queue ({filteredReviews.length})
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => {
                const isSelected = selectedReview?._id === rev._id;
                return (
                  <div
                    key={rev._id}
                    onClick={() => setSelectedReview(rev)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-brand-500 shadow-md ring-1 ring-brand-500'
                        : 'bg-white/80 hover:bg-white border-slate-200/90 shadow-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {rev.contentType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate">{rev.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {rev.originalContent}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>Score: <strong className="text-slate-700">{rev.consistencyScore}%</strong></span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-xs text-slate-400">
                No reviews found under status "{filterStatus}".
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Reviewer Audit Workspace */}
        {selectedReview ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Review Item #{selectedReview._id.slice(-6)}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    {selectedReview.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Brand: <strong className="text-slate-800">{selectedReview.brandId?.name || 'AuraHealth'}</strong> • Channel:{' '}
                    <strong className="text-slate-800">{selectedReview.contentType}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ScoreGauge score={selectedReview.consistencyScore} size={70} strokeWidth={7} />
                </div>
              </div>

              {/* Version Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Original Creator Text:
                  </span>
                  <p className="text-xs text-slate-800 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                    {selectedReview.originalContent}
                  </p>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Compliant Target Text:
                  </span>
                  <p className="text-xs text-emerald-950 font-sans whitespace-pre-wrap leading-relaxed">
                    {selectedReview.improvedContent || selectedReview.originalContent}
                  </p>
                </div>
              </div>

              {/* Finding Breakdown Pills */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  AI Governance Diagnoses ({selectedReview.findings?.length || 0}):
                </span>
                <div className="space-y-2">
                  {selectedReview.findings?.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{f.issue}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            f.severity === 'Critical'
                              ? 'bg-red-100 text-status-error'
                              : f.severity === 'Warning'
                              ? 'bg-amber-100 text-status-warning'
                              : 'bg-indigo-100 text-brand-700'
                          }`}
                        >
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{f.explanation}</p>
                      <div className="text-[10px] text-slate-400">
                        Rule Reference: {f.guidelineReference}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Sign-off Action Form */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MessageSquare className="w-4 h-4 text-brand-700" />
                  Compliance Officer Decision & Audit Comments *
                </div>

                <textarea
                  required
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Record formal compliance justification (e.g., 'Approved with statutory disclaimer added; terminology verified against 2025 guidelines.')..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDecision('Approved')}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 bg-status-success hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve for Publication</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Changes Requested')}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 bg-status-warning hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Request Revisions</span>
                  </button>

                  <button
                    onClick={() => handleDecision('Rejected')}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 bg-status-error hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Content</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-12 text-center rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">Select a review from the queue to start auditing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
