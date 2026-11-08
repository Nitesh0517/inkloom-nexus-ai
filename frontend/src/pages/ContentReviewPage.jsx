import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
  Upload,
  ArrowRight,
  RefreshCw,
  Send,
  Eye,
  Sliders,
  Scale,
  FileCheck2,
  Copy,
  Check,
  Filter,
} from 'lucide-react';
import ScoreGauge from '../components/common/ScoreGauge';
import FindingCard from '../components/common/FindingCard';
import { reviewAPI, aiAPI } from '../services/api';
import { useBrand } from '../context/BrandContext';
import { useAuth } from '../context/AuthContext';

const contentTypes = [
  'Marketing Emails',
  'Social Media Posts',
  'Advertisements',
  'Blog Content',
  'Product Descriptions',
  'Website Content',
  'Press Releases',
];

export default function ContentReviewPage() {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('Marketing Emails');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReview, setActiveReview] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedImproved, setCopiedImproved] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Sample prompt prefill helper
  const handleLoadSample = (sampleType) => {
    if (sampleType === 'violation') {
      setTitle('Q1 Clinical Launch Email Campaign');
      setContentType('Marketing Emails');
      setContent(
        `Hey folks! We are super pumped to unveil our brand new AI Doctor feature inside the AuraHealth app!!! Our AI Doctor has an incredible 100% cure rate for common illnesses and will completely replace boring doctor visits. Try our cheap new plan today to cheat the system and get instant medical fixes!`
      );
    } else {
      setTitle('Clinical Care Coordination Whitepaper Abstract');
      setContentType('Blog Content');
      setContent(
        `AuraHealth Systems operates with SOC2 Type II and HIPAA compliance certified by Schellman. The platform maintains a 99.99% uptime SLA across 42 hospitals nationwide, reducing patient discharge communication delays by an average of 34%. Clinical care teams coordinate verified diagnostic workflows with clinical-grade security.`
      );
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedBrand) {
      alert('Please select a brand profile and enter content to audit.');
      return;
    }

    setIsAnalyzing(true);
    setActiveReview(null);

    try {
      const res = await reviewAPI.create({
        brandId: selectedBrand._id,
        title: title || 'Untitled Content Audit',
        contentType,
        originalContent: content,
      });

      if (res.data?.success) {
        setActiveReview(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Analysis failed. Please check AI service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyFinding = async (finding) => {
    if (!activeReview) return;
    try {
      const res = await reviewAPI.updateFinding(activeReview._id, finding.id || finding._id, {
        isApplied: true,
        isIgnored: false,
      });
      if (res.data?.success) {
        setActiveReview(res.data.data);
      }
    } catch (err) {
      alert('Failed to update finding');
    }
  };

  const handleIgnoreFinding = async (finding) => {
    if (!activeReview) return;
    try {
      const res = await reviewAPI.updateFinding(activeReview._id, finding.id || finding._id, {
        isIgnored: true,
        isApplied: false,
      });
      if (res.data?.success) {
        setActiveReview(res.data.data);
      }
    } catch (err) {
      alert('Failed to dismiss finding');
    }
  };

  const handleEditFinding = async (findingId, customCorrection) => {
    if (!activeReview) return;
    try {
      const res = await reviewAPI.updateFinding(activeReview._id, findingId, {
        suggestedCorrection: customCorrection,
        isApplied: true,
      });
      if (res.data?.success) {
        setActiveReview(res.data.data);
      }
    } catch (err) {
      alert('Failed to save correction');
    }
  };

  const handleRegenerateSuggestion = async (finding) => {
    try {
      const res = await aiAPI.suggest({
        content: activeReview.originalContent,
        finding,
        brand_name: selectedBrand?.name,
        brand_voice: selectedBrand?.brandVoice?.tone?.join(', '),
      });
      if (res.data?.success && res.data.data?.improved_text) {
        alert(`New AI Suggestion: "${res.data.data.explanation}"`);
      }
    } catch (err) {
      alert('Regeneration not available offline.');
    }
  };

  const handleSubmitForApproval = async () => {
    if (!activeReview) return;
    try {
      await reviewAPI.update(activeReview._id, {
        status: 'Under Review',
        reviewerNotes: approvalNotes || 'Submitted by creator for compliance review.',
      });
      setActiveReview({
        ...activeReview,
        status: 'Under Review',
        reviewerNotes: approvalNotes,
      });
      setShowApprovalModal(false);
      alert('Content successfully routed to the Human Compliance Approval Queue!');
    } catch (err) {
      alert('Failed to update review status.');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedImproved(true);
      setTimeout(() => setCopiedImproved(false), 2000);
    }
  };

  // Filtered findings
  const findings = activeReview?.findings || [];
  const filteredFindings = findings.filter((f) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Critical') return f.severity === 'Critical';
    if (selectedFilter === 'Warning') return f.severity === 'Warning';
    if (selectedFilter === 'Suggestion') return f.severity === 'Suggestion';
    if (selectedFilter === 'Verification') return f.verificationStatus === 'Requires Human Verification';
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              AI Content Consistency Engine
            </h1>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold border border-brand-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Powered by Google Gemini
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit marketing drafts, social posts, or press copy for immediate brand guideline validation.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Quick Test Drafts:</span>
          <button
            onClick={() => handleLoadSample('violation')}
            className="px-2.5 py-1.5 text-xs font-medium text-status-error bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
          >
            Load Violations Draft
          </button>
          <button
            onClick={() => handleLoadSample('clean')}
            className="px-2.5 py-1.5 text-xs font-medium text-status-success bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            Load Compliant Draft
          </button>
        </div>
      </div>

      {/* Input Form & Brand Context */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-6">
        <form onSubmit={handleAnalyze} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Brand Profile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Brand Profile *
              </label>
              <select
                value={selectedBrand?._id || ''}
                onChange={(e) => {
                  const b = brands.find((x) => x._id === e.target.value);
                  if (b) setSelectedBrand(b);
                }}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.industry})
                  </option>
                ))}
              </select>
            </div>

            {/* Content Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Content Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q1 Product Launch Announcement"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Content Channel / Type *
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {contentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Brand Guidelines Strip */}
          {selectedBrand && (
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-900">Enforcing Brand:</span>
                <span className="font-semibold text-brand-700">{selectedBrand.name}</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                  Tone: {selectedBrand.brandVoice?.tone?.join(', ')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {selectedBrand.restrictedTerms?.length || 0} restricted words •{' '}
                {selectedBrand.approvedFacts?.length || 0} approved facts
              </div>
            </div>
          )}

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Content Draft for Governance Review *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {content.length} characters • {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste copy here or click 'Load Violations Draft' above to test the AI engine with known brand infractions..."
              className="w-full text-xs px-3.5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              Audits against 5 layers: Tone, Terminology, Factual Claims, Messaging, & Guidelines.
            </span>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Governance Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ANALYSIS REPORT SECTION */}
      {activeReview && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Report Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
            {/* Score Radial */}
            <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
              <ScoreGauge score={activeReview.consistencyScore} size={115} strokeWidth={10} />
            </div>

            {/* Assessment Summary */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audit Findings Summary
                </span>
                <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  {activeReview.metadata?.analyzedWithModel || 'Gemini 2.5 Flash'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {activeReview.summary}
              </h3>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-red-50 text-status-error border border-red-100">
                  {activeReview.findings.filter((f) => f.severity === 'Critical').length} Critical
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-status-warning border border-amber-100">
                  {activeReview.findings.filter((f) => f.severity === 'Warning').length} Warnings
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-brand-700 border border-indigo-100">
                  {activeReview.findings.filter((f) => f.severity === 'Suggestion').length} Suggestions
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-green-50 text-status-success border border-green-100">
                  {activeReview.passedChecks?.length || 0} Passed Checks
                </span>
              </div>
            </div>

            {/* Human Gate Action */}
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={() => setShowApprovalModal(true)}
                className="w-full py-2.5 px-4 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Human Review</span>
              </button>
              <div className="text-[11px] text-center text-slate-400">
                Status:{' '}
                <span className="font-bold text-slate-700">{activeReview.status}</span>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE CONTENT COMPARISON: Original vs Improved */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Side-by-Side Content Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Original content compared against AI-improved brand-compliant text
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Preserves Core Meaning & Voice
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Panel */}
              <div className="bg-red-50/40 border border-red-200/70 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                    Original Submitted Text
                  </span>
                  <button
                    onClick={() => copyToClipboard(activeReview.originalContent, 'original')}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {copiedOriginal ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                  {activeReview.originalContent}
                </p>
              </div>

              {/* Improved Panel */}
              <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI-Improved Compliant Text
                  </span>
                  <button
                    onClick={() => copyToClipboard(activeReview.improvedContent, 'improved')}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    {copiedImproved ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedImproved ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-emerald-950 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {activeReview.improvedContent || activeReview.originalContent}
                </p>
              </div>
            </div>
          </div>

          {/* DETAILED FINDINGS SECTION */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detected Compliance Findings ({findings.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Review explainable violations, guideline references, and one-click fixes.
                </p>
              </div>

              {/* Severity Filter Pills */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs font-medium">
                {['All', 'Critical', 'Warning', 'Suggestion', 'Verification'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      selectedFilter === cat
                        ? 'bg-brand-700 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Findings List */}
            {filteredFindings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredFindings.map((finding) => (
                  <FindingCard
                    key={finding.id || finding._id}
                    finding={finding}
                    onApply={handleApplyFinding}
                    onIgnore={handleIgnoreFinding}
                    onEdit={handleEditFinding}
                    onRegenerate={handleRegenerateSuggestion}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-status-success mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No issues matching this filter</h4>
                <p className="text-xs text-slate-500">
                  All checks in this category have satisfied active brand policies.
                </p>
              </div>
            )}
          </div>

          {/* PASSED CHECKS SUMMARY */}
          {activeReview.passedChecks && activeReview.passedChecks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success" />
                Verified Compliant Checks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeReview.passedChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-green-50/60 border border-green-200/60 text-xs space-y-0.5"
                  >
                    <span className="font-bold text-green-950 block">{check.rule}</span>
                    <span className="text-green-800 text-[11px]">{check.details}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HUMAN APPROVAL ROUTING MODAL */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-brand-700" />
                Route to Human Reviewer Queue
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with brand governance policy, AI findings are advisory. Submitting will flag this draft for certified sign-off by a compliance officer.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reviewer Instructions / Context Notes
              </label>
              <textarea
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="e.g., Applied terminology suggestions; requesting sign-off on Q1 clinical metrics."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="px-5 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
