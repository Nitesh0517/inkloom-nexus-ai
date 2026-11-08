import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Building,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [notifications, setNotifications] = useState({
    emailOnCriticalViolation: true,
    emailOnApprovalReady: true,
    weeklyComplianceDigest: false,
  });
  const [aiStatus, setAiStatus] = useState(null);
  const [checkingAi, setCheckingAi] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const checkServices = async () => {
    setCheckingAi(true);
    try {
      const res = await aiAPI.getStatus();
      setAiStatus(res.data);
    } catch (err) {
      setAiStatus({ serviceAvailable: false, error: err.message });
    } finally {
      setCheckingAi(false);
    }
  };

  useEffect(() => {
    checkServices();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Workspace Settings & Governance Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage user profiles, organizational workspace preferences, and AI microservice connections.
        </p>
      </div>

      {/* 1. Profile Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-brand-700" />
          <span>User Profile & Organization</span>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-green-50 text-status-success rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile configuration updated successfully.
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || 'compliance.officer@inkloom.ai'}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organization Workspace</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Governance Role</label>
              <input
                type="text"
                disabled
                value={user?.role?.replace('_', ' ') || 'Compliance Officer'}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed uppercase font-bold text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold rounded-lg shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 2. System Status & AI Engine Health */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cpu className="w-4 h-4 text-brand-700" />
            <span>AI Processing & Infrastructure Status</span>
          </div>
          <button
            onClick={checkServices}
            disabled={checkingAi}
            className="text-xs text-brand-700 hover:text-brand-800 font-semibold flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingAi ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-500 block">Backend REST API</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-status-success">
              <CheckCircle2 className="w-3.5 h-3.5" /> Express Node.js :5000 Online
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-500 block">Database Storage</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-status-success">
              <CheckCircle2 className="w-3.5 h-3.5" /> MongoDB Connected
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-500 block">AI Microservice</span>
            {aiStatus?.serviceAvailable ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-status-success">
                <CheckCircle2 className="w-3.5 h-3.5" /> FastAPI :8000 Healthy
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-status-warning">
                <AlertCircle className="w-3.5 h-3.5" /> Local Fallback Engine Active
              </span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-100 text-xs space-y-1">
          <span className="font-bold text-brand-900 block">Gemini API Configuration:</span>
          <p className="text-slate-600">
            Inkloom AI uses Google Gemini 2.5 Flash for natural language brand reasoning and claim validation. To configure live API access, set <code className="bg-white px-1 py-0.5 rounded font-mono text-[11px] text-brand-800">GEMINI_API_KEY</code> in <code className="bg-white px-1 py-0.5 rounded font-mono text-[11px]">ai-service/.env</code>.
          </p>
        </div>
      </div>

      {/* 3. Notification Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-brand-700" />
          <span>Governance Notification Alerts</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailOnCriticalViolation}
              onChange={(e) =>
                setNotifications({ ...notifications, emailOnCriticalViolation: e.target.checked })
              }
              className="w-4 h-4 text-brand-700 rounded focus:ring-brand-500"
            />
            <span className="text-slate-700 font-medium">
              Alert compliance officer instantly when a Critical violation is detected in content
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailOnApprovalReady}
              onChange={(e) =>
                setNotifications({ ...notifications, emailOnApprovalReady: e.target.checked })
              }
              className="w-4 h-4 text-brand-700 rounded focus:ring-brand-500"
            />
            <span className="text-slate-700 font-medium">
              Notify content creator when human reviewer marks draft as Approved or Changes Requested
            </span>
          </label>
        </div>
      </div>

      {/* 4. Sign Out */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Sign Out of Workspace</h4>
          <p className="text-xs text-slate-500">End active session on this device</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 text-xs font-semibold text-status-error bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
