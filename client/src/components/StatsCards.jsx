import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  AlertTriangle, 
  TrendingUp,
  Flame
} from 'lucide-react';

export default function StatsCards({ stats, onSelectFilter }) {
  const {
    totalTasks = 0,
    completedTasks = 0,
    pendingTasks = 0,
    highPriorityTasks = 0,
    completionRate = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      {/* 1. Total Tasks */}
      <div 
        onClick={() => onSelectFilter?.('status', 'all')}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-brand-200 dark:hover:border-brand-900/50 transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 text-brand-500" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {totalTasks}
          </span>
          <span className="text-xs text-slate-400">tasks logged</span>
        </div>
      </div>

      {/* 2. Completed Tasks */}
      <div 
        onClick={() => onSelectFilter?.('status', 'completed')}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Completed
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedTasks}
          </span>
          <span className="text-xs text-slate-400">done</span>
        </div>
      </div>

      {/* 3. Pending Tasks */}
      <div 
        onClick={() => onSelectFilter?.('status', 'pending')}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-amber-200 dark:hover:border-amber-900/50 transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Pending
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
            {pendingTasks}
          </span>
          <span className="text-xs text-slate-400">in queue</span>
        </div>
      </div>

      {/* 4. High Priority */}
      <div 
        onClick={() => onSelectFilter?.('priority', 'high')}
        className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-rose-200 dark:hover:border-rose-900/50 transition-all group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            High Priority
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
            {highPriorityTasks}
          </span>
          <span className="text-xs text-slate-400">urgent</span>
        </div>
      </div>

      {/* 5. Completion Rate & Progress Bar */}
      <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Completion Rate
          </span>
          <TrendingUp className="w-4 h-4 text-brand-500" />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs font-medium text-slate-400">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
