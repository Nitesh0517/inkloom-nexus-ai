import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  Sparkles,
  X,
  Tag,
  Info,
} from 'lucide-react';
import { brandAPI } from '../services/api';
import { useBrand } from '../context/BrandContext';

export default function BrandsPage() {
  const { brands, selectedBrand, setSelectedBrand, fetchBrands } = useBrand();
  const [activeTab, setActiveTab] = useState('overview'); // overview | guidelines | terminology | facts
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [guidelineFile, setGuidelineFile] = useState(null);
  const [guidelineTitle, setGuidelineTitle] = useState('');

  // Form states for creating a new brand
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    industry: 'Healthcare & Life Sciences',
    mission: '',
    targetAudience: '',
    brandVoice: {
      tone: ['Professional', 'Authoritative', 'Trustworthy'],
      formality: 'Semi-Formal',
      dos: ['Use substantiated facts', 'Maintain calm authority'],
      donts: ['Never use unverified cures', 'Avoid sensational hype'],
    },
    preferredTerms: [{ term: '', replacementFor: '' }],
    restrictedTerms: [{ term: '', reason: '' }],
    approvedFacts: [{ fact: '', source: '' }],
    prohibitedClaims: [{ claim: '', reason: '' }],
  });

  const activeBrand = selectedBrand || brands[0];

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const cleanData = {
        ...formData,
        preferredTerms: formData.preferredTerms.filter((t) => t.term.trim()),
        restrictedTerms: formData.restrictedTerms.filter((t) => t.term.trim()),
        approvedFacts: formData.approvedFacts.filter((f) => f.fact.trim()),
        prohibitedClaims: formData.prohibitedClaims.filter((c) => c.claim.trim()),
      };

      const res = await brandAPI.create(cleanData);
      if (res.data?.success) {
        await fetchBrands();
        setSelectedBrand(res.data.data);
        setShowCreateModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create brand profile');
    }
  };

  const handleUploadGuideline = async (e) => {
    e.preventDefault();
    if (!guidelineFile || !activeBrand) return;

    setUploading(true);
    setUploadError('');
    try {
      const data = new FormData();
      data.append('file', guidelineFile);
      data.append('title', guidelineTitle || guidelineFile.name);

      await brandAPI.uploadGuideline(activeBrand._id, data);
      await fetchBrands();
      setGuidelineFile(null);
      setGuidelineTitle('');
      alert('Brand guideline uploaded and indexed successfully!');
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Brand Profile Management
            </h1>
            <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold border border-brand-100">
              {brands.length} Active Profiles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure tone of voice, approved product facts, vocabulary rules, and guideline documents.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Brand Profile</span>
        </button>
      </div>

      {/* Brand Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {brands.map((b) => (
          <button
            key={b._id}
            onClick={() => setSelectedBrand(b)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeBrand?._id === b._id
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{b.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeBrand?._id === b._id
                  ? 'bg-brand-800 text-brand-100'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {b.industry}
            </span>
          </button>
        ))}
      </div>

      {activeBrand ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Brand Identity Card & Sub-navigation */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-dark bg-teal-50 px-2 py-0.5 rounded">
                  {activeBrand.industry}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  {activeBrand.name}
                </h2>
                {activeBrand.tagline && (
                  <p className="text-xs text-brand-700 font-semibold italic mt-0.5">
                    "{activeBrand.tagline}"
                  </p>
                )}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeBrand.description}
                </p>
              </div>

              {activeBrand.mission && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-1">Mission:</span>
                  {activeBrand.mission}
                </div>
              )}

              {/* Quick stats list */}
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Tone Descriptors</span>
                  <span className="font-semibold text-slate-800">
                    {activeBrand.brandVoice?.tone?.join(', ') || 'Professional'}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Formality Level</span>
                  <span className="font-semibold text-slate-800">
                    {activeBrand.brandVoice?.formality || 'Semi-Formal'}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Preferred Terms</span>
                  <span className="font-bold text-brand-700">
                    {activeBrand.preferredTerms?.length || 0} registered
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Restricted Terms</span>
                  <span className="font-bold text-status-error">
                    {activeBrand.restrictedTerms?.length || 0} prohibited
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Approved Facts</span>
                  <span className="font-bold text-teal-dark">
                    {activeBrand.approvedFacts?.length || 0} verified
                  </span>
                </div>
              </div>
            </div>

            {/* Document Upload Widget */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Upload className="w-4 h-4 text-brand-700" />
                Upload New Guideline Document
              </div>
              <p className="text-xs text-slate-500">
                Supports PDF, DOCX, and TXT. Text is automatically parsed into reference guidelines.
              </p>

              {uploadError && (
                <div className="p-2.5 bg-red-50 text-status-error rounded text-xs">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleUploadGuideline} className="space-y-3">
                <input
                  type="text"
                  placeholder="Document Title (e.g., Editorial Guide 2025)"
                  value={guidelineTitle}
                  onChange={(e) => setGuidelineTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />

                <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl p-4 text-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    id="guideline-upload"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setGuidelineFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="guideline-upload" className="cursor-pointer">
                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-brand-700 block">
                      {guidelineFile ? guidelineFile.name : 'Choose file or drag & drop'}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, DOCX, or TXT up to 15MB</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !guidelineFile}
                  className="w-full py-2 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Extracting & Indexing...' : 'Upload & Index Guideline'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right 2 Columns: Detailed Tabs (Guidelines, Terminology, Facts, Voice Rules) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-subtle flex gap-2">
              {[
                { id: 'overview', label: 'Guidelines & Documents', icon: BookOpen },
                { id: 'terminology', label: 'Vocabulary & Restricted Words', icon: Tag },
                { id: 'facts', label: 'Approved Facts & Prohibited Claims', icon: ShieldAlert },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-brand-50 text-brand-700 border border-brand-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: GUIDELINES & DOCUMENTS */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Uploaded Guidelines & Standards ({activeBrand.guidelines?.length || 0})
                  </h3>

                  {activeBrand.guidelines && activeBrand.guidelines.length > 0 ? (
                    <div className="space-y-3">
                      {activeBrand.guidelines.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200/80 hover:border-brand-200 bg-slate-50/50 space-y-2 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="p-2 rounded-lg bg-indigo-50 text-brand-700">
                                <FileText className="w-4 h-4" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">{doc.title}</h4>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                  {doc.fileType?.toUpperCase()} document • Indexed{' '}
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              Active in AI Prompt
                            </span>
                          </div>

                          {doc.extractedText && (
                            <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100 font-mono text-[11px] leading-relaxed line-clamp-3">
                              "{doc.extractedText}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      No guidelines attached yet. Use the upload panel on the left to add a PDF or DOCX.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TERMINOLOGY & RESTRICTED WORDS */}
            {activeTab === 'terminology' && (
              <div className="space-y-6">
                {/* Restricted Terms */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-status-error" />
                        Restricted Words & Prohibited Nomenclature
                      </h3>
                      <p className="text-xs text-slate-500">
                        Content featuring these phrases is automatically flagged with Critical severity.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeBrand.restrictedTerms?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50/60 border border-red-200 rounded-xl space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-900 font-mono">
                            "{item.term}"
                          </span>
                          <span className="text-[10px] font-bold text-status-error uppercase">
                            {item.severity || 'Critical'}
                          </span>
                        </div>
                        <p className="text-[11px] text-red-700">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Terminology */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-dark" />
                      Approved Preferred Terminology
                    </h3>
                    <p className="text-xs text-slate-500">
                      Vocabulary recommendations for content creators and copywriters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeBrand.preferredTerms?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-teal-50/50 border border-teal-200 rounded-xl space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-950 font-mono">
                            Use: "{item.term}"
                          </span>
                          {item.replacementFor && (
                            <span className="text-[10px] text-slate-500">
                              instead of "{item.replacementFor}"
                            </span>
                          )}
                        </div>
                        {item.context && (
                          <p className="text-[11px] text-teal-800">{item.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: APPROVED FACTS & PROHIBITED CLAIMS */}
            {activeTab === 'facts' && (
              <div className="space-y-6">
                {/* Approved Facts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-brand-700" />
                      Approved Factual Claim Repository
                    </h3>
                    <p className="text-xs text-slate-500">
                      Verified metrics and regulatory certifications that AI can cite as supported facts.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {activeBrand.approvedFacts?.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"
                      >
                        <p className="text-xs font-medium text-slate-900">{f.fact}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="font-semibold text-brand-700">Source:</span> {f.source} •{' '}
                          <span>Category: {f.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prohibited Claims */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 text-status-error flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-status-error" />
                      Prohibited Warranty & Regulatory Claims
                    </h3>
                    <p className="text-xs text-slate-500">
                      Statements strictly forbidden by corporate legal and marketing governance.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {activeBrand.prohibitedClaims?.map((c, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1"
                      >
                        <p className="text-xs font-bold text-red-950 font-mono">"{c.claim}"</p>
                        <p className="text-[11px] text-red-800">{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No brand profiles found. Create your first profile.</p>
        </div>
      )}

      {/* CREATE BRAND MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create New Brand Profile</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., NovaFin Capital"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry *</label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., FinTech, SaaS, Healthcare"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g., Autonomous Financial Infrastructure"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brand Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive summary of what your brand does and its target market..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., Enterprise CFOs, Hospital Administrators, Developers"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Brand Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
