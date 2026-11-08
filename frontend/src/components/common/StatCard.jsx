import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, subtitle, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-700 border-brand-100',
    violet: 'bg-purple-50 text-violet-primary border-purple-100',
    teal: 'bg-teal-50 text-teal-dark border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-status-error border-red-100',
    green: 'bg-green-50 text-status-success border-green-100',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-status-success">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 truncate">{subtitle}</p>
      )}
    </div>
  );
}
