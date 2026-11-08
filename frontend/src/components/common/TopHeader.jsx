import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Bell, ChevronDown, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

export default function TopHeader({ onMenuClick }) {
  const { user } = useAuth();
  const { brands, selectedBrand, setSelectedBrand } = useBrand();

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Building2 className="w-4 h-4 text-slate-400" /> Organization:
          </div>
          <div className="relative">
            <select
              value={selectedBrand?._id || ''}
              onChange={(e) => {
                const found = brands.find((b) => b._id === e.target.value);
                if (found) setSelectedBrand(found);
              }}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.industry})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Create New Review CTA */}
        <Link
          to="/dashboard/review"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Content Review</span>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-status-error"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
