import React from 'react';
import { ClipboardList, Plus, RotateCcw, SearchX } from 'lucide-react';

export default function EmptyState({
  hasFilters,
  onResetFilters,
  onOpenNewTask,
  activeNav,
}) {
  if (hasFilters) {
    let specificMessage = 'No tasks matched your current search or filter combination.';
    if (activeNav === 'completed') {
      specificMessage = 'No completed tasks found.';
    } else if (activeNav === 'today') {
      specificMessage = 'No tasks due today found matching your criteria.';
    } else if (activeNav === 'pending') {
      specificMessage = 'No pending tasks found matching your criteria.';
    }

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-card animate-fade-in my-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
          No matching tasks found
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {specificMessage}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-card animate-fade-in my-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
        No tasks yet
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Create your first task to get started and streamline your workflow.
      </p>
      <div className="mt-6">
        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
