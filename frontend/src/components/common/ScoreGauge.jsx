import React from 'react';

export default function ScoreGauge({ score = 0, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#16A34A'; // success
  let label = 'Strong Alignment';
  let bgColor = 'text-green-50 bg-green-500/10 text-status-success';

  if (clampedScore < 50) {
    color = '#DC2626'; // error
    label = 'Critical Violations';
    bgColor = 'text-status-error bg-red-500/10';
  } else if (clampedScore < 75) {
    color = '#F59E0B'; // warning
    label = 'Requires Revision';
    bgColor = 'text-status-warning bg-amber-500/10';
  } else if (clampedScore < 88) {
    color = '#14B8A6'; // teal
    label = 'Good Alignment';
    bgColor = 'text-teal-primary bg-teal-500/10';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-800">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <div className={`mt-2.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${bgColor}`}>
        {label}
      </div>
    </div>
  );
}
