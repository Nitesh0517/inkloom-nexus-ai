import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  FileCheck2,
  Check,
  X,
  Edit3,
  RefreshCw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

export default function FindingCard({
  finding,
  onApply,
  onIgnore,
  onEdit,
  onRegenerate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(finding.suggestedCorrection || '');

  // Severity styling
  const severityStyles = {
    Critical: {
      badge: 'bg-red-50 text-status-error border-red-200',
      icon: AlertCircle,
      border: 'border-l-4 border-l-status-error',
    },
    Warning: {
      badge: 'bg-amber-50 text-status-warning border-amber-200',
      icon: AlertTriangle,
      border: 'border-l-4 border-l-status-warning',
    },
    Suggestion: {
      badge: 'bg-indigo-50 text-brand-700 border-indigo-200',
      icon: Lightbulb,
      border: 'border-l-4 border-l-brand-600',
    },
    Passed: {
      badge: 'bg-green-50 text-status-success border-green-200',
      icon: CheckCircle2,
      border: 'border-l-4 border-l-status-success',
    },
  };

  const style = severityStyles[finding.severity] || severityStyles.Suggestion;
  const Icon = style.icon;

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(finding.id || finding._id, customText);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-subtle p-5 transition-all ${
        style.border
      } ${finding.isApplied ? 'bg-slate-50/70 opacity-90' : ''}`}
    >
      {/* Finding Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.badge}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {finding.severity}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {finding.category}
          </span>
          {finding.verificationStatus && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                finding.verificationStatus === 'Requires Human Verification'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : finding.verificationStatus === 'Verified Fact'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {finding.verificationStatus}
            </span>
          )}
        </div>

        {/* Applied / Ignored state pills */}
        {finding.isApplied && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-success bg-green-50 px-2.5 py-1 rounded-lg">
            <Check className="w-3.5 h-3.5" /> Correction Applied
          </span>
        )}
        {finding.isIgnored && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            <X className="w-3.5 h-3.5" /> Dismissed
          </span>
        )}
      </div>

      {/* Issue Title */}
      <h4 className="text-sm font-bold text-slate-900 mb-2">{finding.issue}</h4>

      {/* Original Snippet */}
      {finding.originalText && (
        <div className="mb-3 bg-red-50/60 border border-red-100 rounded-lg p-2.5">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-red-700 mb-0.5">
            Flagged Original Text:
          </span>
          <p className="text-xs text-red-950 font-mono bg-white/70 p-1.5 rounded border border-red-200/60">
            "{finding.originalText}"
          </p>
        </div>
      )}

      {/* Explanation */}
      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        {finding.explanation}
      </p>

      {/* Guideline Citation Box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mb-3">
        <div className="flex items-center gap-1.5 truncate">
          <BookOpen className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span className="font-semibold text-slate-700">Guideline:</span>
          <span className="truncate">{finding.guidelineReference || 'Brand Policy'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <FileCheck2 className="w-3.5 h-3.5 text-teal-dark flex-shrink-0" />
          <span className="font-semibold text-slate-700">Source:</span>
          <span className="truncate">{finding.sourceReference || 'Guidelines Library'}</span>
        </div>
      </div>

      {/* Suggested Correction Section */}
      {finding.suggestedCorrection && (
        <div className="mb-4 bg-emerald-50/70 border border-emerald-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Suggested Correction:
            </span>
            {!isEditing && !finding.isApplied && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                rows={2}
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded"
                >
                  Save Correction
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-950 font-medium bg-white/80 p-2 rounded border border-emerald-200">
              "{finding.suggestedCorrection}"
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => onApply && onApply(finding)}
          disabled={finding.isApplied}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
            finding.isApplied
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-700 hover:bg-brand-800 text-white shadow-xs'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          {finding.isApplied ? 'Applied' : 'Apply Suggestion'}
        </button>

        <button
          onClick={() => onIgnore && onIgnore(finding)}
          disabled={finding.isIgnored}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
            finding.isIgnored
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          Dismiss
        </button>

        {onRegenerate && (
          <button
            onClick={() => onRegenerate(finding)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg flex items-center gap-1 transition-colors ml-auto"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        )}
      </div>
    </div>
  );
}
