import React from 'react';
import { 
  CheckSquare, 
  Layers, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Settings, 
  Sun, 
  Moon, 
  X,
  Sparkles,
  Flame
} from 'lucide-react';

export default function Sidebar({ 
  activeNav, 
  setActiveNav, 
  stats, 
  isDarkMode, 
  toggleDarkMode, 
  isMobileOpen, 
  setIsMobileOpen,
  onOpenSettings,
  onOpenNewTask
}) {
  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Layers, count: stats?.totalTasks ?? 0 },
    { id: 'today', label: 'Due Today', icon: CalendarDays, count: stats?.dueTodayCount ?? 0 },
    { id: 'pending', label: 'Pending', icon: Clock, count: stats?.pendingTasks ?? 0 },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats?.completedTasks ?? 0 },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  TaskFlow
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500">Smart Task Manager</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Task action button */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenNewTask();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-150"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Workspaces
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Settings & Dark Mode Toggle */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Settings button */}
          <button
            onClick={() => {
              onOpenSettings();
              if (setIsMobileOpen) setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Settings & Info</span>
          </button>

          {/* Theme switcher */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
            <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </span>

            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isDarkMode ? 'bg-brand-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle dark/light mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Subtle footer */}
          <div className="px-3.5 pt-1 text-[11px] text-slate-400 dark:text-slate-600 text-center">
            TaskFlow v1.0 • Full-Stack MERN
          </div>
        </div>
      </aside>
    </>
  );
}
