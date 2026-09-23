import React from 'react';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Globe2,
  Cpu,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { JDSnapshot } from '../types';

interface SnapshotBarProps {
  snapshot: JDSnapshot | null;
  loading: boolean;
  onJumpToLine: (lineNum: number) => void;
}

export const SnapshotBar: React.FC<SnapshotBarProps> = ({
  snapshot,
  loading,
  onJumpToLine,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping"></span>
            <span className="font-bold text-black dark:text-white">Grounding Engine:</span>
            <span>Parsing attributes &amp; generating exact line citations...</span>
          </div>
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white"></span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">Custom Job Mode</span>
            <span className="hidden sm:inline opacity-60">·</span>
            <span className="hidden sm:inline">Paste or load any job description to extract verified attributes and start grounded Q&amp;A.</span>
          </div>
        </div>
      </div>
    );
  }

  const items = [
    {
      label: 'Seniority',
      icon: Briefcase,
      field: snapshot.seniority,
    },
    {
      label: 'Work Mode',
      icon: MapPin,
      field: snapshot.workMode,
    },
    {
      label: 'Compensation',
      icon: DollarSign,
      field: snapshot.compensation,
    },
    {
      label: 'Visa Policy',
      icon: Globe2,
      field: snapshot.visaSponsorship,
    },
    {
      label: 'Core Stack',
      icon: Cpu,
      field: snapshot.techStack,
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-2.5 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Role Header */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black shadow-2xs shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="truncate flex items-baseline gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-black dark:text-white truncate">
                {snapshot.roleTitle.value !== 'Not stated in this posting'
                  ? snapshot.roleTitle.value
                  : 'Role Overview'}
              </span>
              {snapshot.company.value !== 'Not stated in this posting' && (
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold truncate">
                  @ {snapshot.company.value}
                </span>
              )}
            </div>
            {snapshot.roleTitle.line_number && (
              <button
                type="button"
                onClick={() => onJumpToLine(snapshot.roleTitle.line_number!)}
                className="text-[11px] font-bold text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title={`Jump to quote in JD: "${snapshot.roleTitle.quote || ''}"`}
              >
                <span>L{snapshot.roleTitle.line_number}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Key Attribute Ribbon in sleek monochrome */}
          <div className="flex flex-wrap items-center gap-2">
            {items.map((item, idx) => {
              const isStated = item.field.status === 'stated';
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                    isStated
                      ? 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100'
                      : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isStated ? 'text-neutral-700 dark:text-neutral-300' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    {item.label}:
                  </span>
                  <span
                    className={`truncate max-w-[130px] sm:max-w-[170px] font-semibold ${
                      isStated ? 'text-black dark:text-white' : 'text-amber-700 dark:text-amber-300 italic'
                    }`}
                    title={item.field.value}
                  >
                    {item.field.value}
                  </span>

                  {isStated && item.field.line_number ? (
                    <button
                      type="button"
                      onClick={() => onJumpToLine(item.field.line_number!)}
                      className="cursor-pointer text-[10px] text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold px-1.5 py-0.5 rounded ml-0.5 inline-flex items-center gap-0.5 transition-colors shadow-2xs"
                      title={`Jump to quote in JD: "${item.field.quote || ''}"`}
                    >
                      <span>L{item.field.line_number}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  ) : !isStated ? (
                    <span
                      className="text-[10px] text-amber-600 dark:text-amber-400 ml-0.5 flex items-center"
                      title="Explicitly verified: not stated in job posting"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
