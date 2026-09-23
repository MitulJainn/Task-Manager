import React from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Search, 
  Clock, 
  CheckCircle2, 
  Flame,
  Calendar
} from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters,
  totalResults,
}) {
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.timeFilter !== 'all' ||
    filters.sort !== 'newest' ||
    Boolean(filters.search);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-card transition-colors">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => handleFilterChange('status', 'all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => handleFilterChange('status', 'pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('status', 'completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filters.status === 'completed'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 pl-3 pr-8 rounded-xl border-none outline-none cursor-pointer transition-colors"
            >
              <option value="all">Priority: All</option>
              <option value="high">Priority: High 🔴</option>
              <option value="medium">Priority: Medium 🟡</option>
              <option value="low">Priority: Low 🟢</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Time Filter Dropdown */}
          <div className="relative">
            <select
              value={filters.timeFilter}
              onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 pl-3 pr-8 rounded-xl border-none outline-none cursor-pointer transition-colors"
            >
              <option value="all">Timeline: All</option>
              <option value="today">Due Today 📅</option>
              <option value="upcoming">Upcoming ⏳</option>
              <option value="overdue">Overdue ⚠️</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium py-2 pl-3 pr-8 rounded-xl border-none outline-none cursor-pointer transition-colors"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority (High to Low)</option>
              <option value="alphabetical">Sort: Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium self-end lg:self-center shrink-0">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{totalResults}</span> {totalResults === 1 ? 'task' : 'tasks'}
        </div>
      </div>
    </div>
  );
}
