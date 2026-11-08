import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-violet-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-text">
              INKLOOM<span className="text-brand-700">.AI</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal-dark">
              Brand Governance
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-brand-700 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-brand-700 transition-colors">How It Works</a>
          <a href="#problem-solution" className="hover:text-brand-700 transition-colors">Problem & Solution</a>
          <a href="#benefits" className="hover:text-brand-700 transition-colors">Benefits</a>
          <Link to="/dashboard" className="hover:text-brand-700 transition-colors flex items-center gap-1.5 text-violet-primary font-semibold">
            <Sparkles className="w-4 h-4" /> Live Demo
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 group"
              >
                Launch Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
