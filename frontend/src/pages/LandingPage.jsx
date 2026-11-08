import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Scale,
  Brain,
  Eye,
  Sliders,
  UserCheck,
  TrendingUp,
  ChevronRight,
  Activity,
  FileCheck,
} from 'lucide-react';
import ScoreGauge from '../components/common/ScoreGauge';

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Value Prop Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          The Intelligent Brand Governance Platform
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Your Brand Deserves <span className="text-brand-700">Consistency.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          An intelligent brand governance platform that ensures every piece of content stays strictly aligned with your approved tone, verified facts, and brand guidelines before publication.
        </p>

        {/* Hero Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-premium hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>Start Free with Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-all"
          >
            Explore Features
          </a>
        </div>

        {/* Hero Dashboard Preview Card Mockup */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-3 sm:p-4 bg-slate-900/5 ring-1 ring-slate-900/10 shadow-2xl">
          <div className="rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-md text-left">
            {/* Mock Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  inkloom.ai/review/analysis-report
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-teal-light font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Gemini 2.5 Flash Verified
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50">
              {/* Score summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Brand Consistency Score
                </span>
                <ScoreGauge score={88} size={110} />
                <p className="mt-3 text-xs text-slate-600">
                  AuraHealth Systems • Q1 Campaign
                </p>
              </div>

              {/* Finding Snapshot */}
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-subtle space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-status-warning" />
                    Detected Issue: Inconsistent Brand Nomenclature
                  </span>
                  <span className="text-[11px] font-semibold text-status-error bg-red-50 px-2 py-0.5 rounded">
                    Critical Severity
                  </span>
                </div>
                <div className="text-xs bg-red-50/60 p-2.5 rounded border border-red-100 font-mono text-slate-800">
                  <span className="text-red-600 font-bold">Flagged:</span> "Our AI Doctor guarantees 100% cure rate..."
                </div>
                <div className="text-xs bg-emerald-50/70 p-2.5 rounded border border-emerald-100 text-emerald-950">
                  <span className="text-emerald-700 font-bold">Suggested:</span> "Our Clinical Decision Support module assists practitioners with verified diagnostic fidelity..."
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Source: Clinical Editorial Standards 2025
                  </span>
                  <span className="text-xs font-semibold text-brand-700">
                    One-Click Apply Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section id="problem-solution" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-status-error uppercase tracking-wider">
            The Governance Challenge
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Why Modern Brand Communication Breaks Down
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            As organizations publish content through dozens of employees, decentralized agencies, marketing teams, and autonomous AI tools, inconsistencies multiply exponentially.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-red-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-status-error flex items-center justify-center font-bold mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Unapproved Claims & Fact Drift
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teams accidentally publish outdated statistics, unverified cure rates, or speculative warranties that expose the organization to regulatory fines and public backlash.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-amber-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-status-warning flex items-center justify-center font-bold mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Inconsistent Tone & Voice
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              One department sounds institutional and authoritative while an agency posts meme-heavy colloquialisms that erode brand trust and confuse enterprise buyers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-subtle hover:border-brand-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Manual Review Bottlenecks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compliance officers and brand governors drown in endless Slack pings and email threads, leading to either delayed launches or unchecked rogue publishing.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="bg-gradient-to-b from-brand-50/50 to-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                The Inkloom AI Solution
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Automated Governance with Explainable Human Oversight
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                Inkloom AI connects directly to your verified brand guidelines, approved factual library, and prohibited claims list. Before publishing, content is scanned by Google Gemini AI with clinical precision.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-teal-50 text-teal-dark mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Zero Hallucination Fact Checking</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Claims must cite an approved fact source. Unsupported claims are flagged as "Requires Human Verification."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-teal-50 text-teal-dark mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Explainable AI Recommendations</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Every finding explains exactly which brand guideline was triggered and provides ready-to-apply corrected text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-teal-50 text-teal-dark mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Human-In-The-Loop Approval Gates</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      AI never independently publishes. Authorized compliance officers maintain final decision authority.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-5 h-5 text-brand-700" />
                  Audit Engine Status
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Real-time Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs">
                  <span className="font-medium text-slate-700">Tone of Voice Calibration</span>
                  <span className="font-bold text-brand-700">Authoritative & Rigorous</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs">
                  <span className="font-medium text-slate-700">Vocabulary Verification</span>
                  <span className="font-bold text-emerald-700">100% Preferred Terms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-xs">
                  <span className="font-medium text-slate-700">Statutory Disclosure Check</span>
                  <span className="font-bold text-emerald-700">Passed</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-700" /> Value Proposition
                </div>
                <p className="italic">"Create confidently. Stay consistent. Protect your brand."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-violet-primary uppercase tracking-wider">
            Enterprise Capabilities
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Complete Toolkit for Modern Brand Guardians
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base">
            Everything your team needs to enforce brand consistency across marketing, PR, and digital touchpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-brand-700 flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">AI Brand Consistency Checker</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated multi-layer analysis evaluating tone, vocabulary, claims, and formatting in seconds.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-dark flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Brand Guideline Repository</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload PDF, DOCX, and TXT guidelines. Text is automatically extracted and indexed for AI verification.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-violet-primary flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Tone of Voice Analysis</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diagnoses whether content matches designated formality, empathy levels, and target audience expectations.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Fact & Claim Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-references claims against verified facts, flagging unsupported assumptions for human review.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Visual Brand Review</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assesses uploaded image assets against visual brand guidelines and approved logo usage standards.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-status-success flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">AI-Powered Suggestions</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-click contextual corrections that preserve the original marketing meaning while fixing violations.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Human Approval Workflow</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audit trails, feedback notes, and formal approval states (Approved, Changes Requested, Rejected).
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Governance Analytics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track consistency trends over time and identify which brand guidelines are most frequently violated.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-primary uppercase tracking-wider">
              Step-by-Step Workflow
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              From Content Creation to Certified Publication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Create Brand Profile', desc: 'Define voice, target audience, and preferred terms.' },
              { step: '02', title: 'Upload Guidelines', desc: 'Attach PDF, DOCX style guides and approved facts.' },
              { step: '03', title: 'Submit Content', desc: 'Paste copy or upload drafts across any channel.' },
              { step: '04', title: 'AI Analyses Content', desc: 'Gemini evaluates tone, claims, and vocabulary.' },
              { step: '05', title: 'Review Recommendations', desc: 'Apply explainable corrections with one click.' },
              { step: '06', title: 'Approve Content', desc: 'Human reviewer signs off with timestamped audit.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 relative">
                <span className="text-2xl font-black text-brand-400 opacity-60 mb-2 block">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-100 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS SECTION */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="pt-6 lg:pt-0">
              <span className="text-4xl font-extrabold text-brand-700">78%</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">Faster Content Review Cycles</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Eliminate manual editorial ping-pong with instant automated guideline auditing.
              </p>
            </div>

            <div className="pt-6 lg:pt-0 lg:px-6">
              <span className="text-4xl font-extrabold text-teal-dark">0%</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">Unsubstantiated Claims Published</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Strict factual repository enforcement flags all unsupported statements before release.
              </p>
            </div>

            <div className="pt-6 lg:pt-0 lg:px-6">
              <span className="text-4xl font-extrabold text-violet-primary">100%</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">Human Accountability</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Every final publication decision requires an authorized human approval signature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gradient-to-tr from-brand-700 to-violet-primary rounded-3xl p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Protect Your Brand Trust at Enterprise Scale.
          </h2>
          <p className="mt-4 text-brand-100 max-w-xl mx-auto text-sm sm:text-base">
            Start governing your content today. Join marketing and compliance teams ensuring every word represents their approved brand identity.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 text-sm font-semibold text-brand-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Launch Demo Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
