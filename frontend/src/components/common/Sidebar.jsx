import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  History,
  BarChart3,
  Settings,
  LogOut,
  FolderLock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBrand } from '../../context/BrandContext';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Brand Profiles', path: '/dashboard/brands', icon: Layers },
  { name: 'Content Review', path: '/dashboard/review', icon: Sparkles, highlight: true },
  { name: 'Approvals', path: '/dashboard/approvals', icon: CheckCircle2 },
  { name: 'Review History', path: '/dashboard/history', icon: History },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const { selectedBrand } = useBrand();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-violet-primary flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-text">
              INKLOOM<span className="text-brand-700">.AI</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal-dark">
              Governance Engine
            </span>
          </div>
        </div>

        {/* Active Brand Badge */}
        {selectedBrand && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-brand-50 border border-brand-100">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-700 mb-1 flex items-center gap-1.5">
              <FolderLock className="w-3 h-3" /> Active Brand
            </div>
            <div className="text-xs font-semibold text-slate-800 truncate">
              {selectedBrand.name}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {selectedBrand.industry}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-sm'
                      : item.highlight
                      ? 'text-brand-700 bg-brand-50 hover:bg-brand-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] bg-brand-200 text-brand-900 px-1.5 py-0.5 rounded-full font-bold">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200/60 mb-2">
          <div className="w-9 h-9 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
            {user?.name ? user.name.slice(0, 2) : 'SG'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {user?.name || 'Compliance Officer'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide truncate">
              {user?.role?.replace('_', ' ') || 'Brand Governor'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-status-error hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
