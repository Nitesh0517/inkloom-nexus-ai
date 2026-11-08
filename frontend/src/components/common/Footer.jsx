import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                INKLOOM<span className="text-teal-primary">.AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Intelligent Brand Governance Platform ensuring organizations create confidently, stay consistent, and protect brand trust.
            </p>
            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} Inkloom AI. Built for modern enterprise compliance.
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Governance Solutions
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/dashboard/review" className="hover:text-white transition-colors">AI Content Consistency Engine</Link></li>
              <li><Link to="/dashboard/brands" className="hover:text-white transition-colors">Brand Guideline Repository</Link></li>
              <li><Link to="/dashboard/approvals" className="hover:text-white transition-colors">Human Approval Workflows</Link></li>
              <li><Link to="/dashboard/analytics" className="hover:text-white transition-colors">Compliance & Violation Analytics</Link></li>
            </ul>
          </div>

          {/* Product & Tech */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Technology Architecture
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Google Gemini API 2.5 Flash</li>
              <li>FastAPI Python Microservice</li>
              <li>Node.js / Express REST API</li>
              <li>MongoDB & Mongoose Store</li>
              <li>Firebase Authentication SDK</li>
            </ul>
          </div>

          {/* Value Prop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Core Value Proposition
            </h4>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-teal-primary font-medium text-xs">
                <Sparkles className="w-4 h-4" /> Uncompromising Quality
              </div>
              <p className="text-xs text-slate-300 italic">
                "Create confidently. Stay consistent. Protect your brand."
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold"
                >
                  Explore Dashboard <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
