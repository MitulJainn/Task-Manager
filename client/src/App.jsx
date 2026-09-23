import React, { useState, useEffect, useCallback, useMemo } from 'react';
import taskApi from './services/api';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskDetailsModal from './components/TaskDetailsModal';
import TaskFormModal from './components/TaskFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import SettingsModal from './components/SettingsModal';
import { Loader2, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('taskflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('taskflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('taskflow_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Layout & Navigation State
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('all'); // 'all', 'today', 'pending', 'completed'

  // Filter & Search State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    timeFilter: 'all',
    sort: 'newest',
  });

  // Data States
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    dueTodayCount: 0,
  });

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // Sync activeNav with filters
  const handleNavChange = (navId) => {
    setActiveNav(navId);
    setFilters((prev) => {
      const next = { ...prev };
      if (navId === 'all') {
        next.status = 'all';
        next.timeFilter = 'all';
      } else if (navId === 'today') {
        next.timeFilter = 'today';
        next.status = 'all';
      } else if (navId === 'pending') {
        next.status = 'pending';
        next.timeFilter = 'all';
      } else if (navId === 'completed') {
        next.status = 'completed';
        next.timeFilter = 'all';
      }
      return next;
    });
  };

  // Fetch Dashboard Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await taskApi.getStats();
      if (res.success) {
        // Also fetch today count for sidebar
        const todayRes = await taskApi.getTasks({ timeFilter: 'today' });
        setStats({
          ...res.data,
          dueTodayCount: todayRes?.count || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Fetch Tasks with current active filters
  const loadTasks = useCallback(async (currentFilters) => {
    try {
      setIsLoading(true);
      setApiError(null);
      const res = await taskApi.getTasks(currentFilters);
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setApiError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks(filters);
    }, 200);
    return () => clearTimeout(timer);
  }, [filters, loadTasks]);

  // Initial stats load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setActiveNav('all');
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      timeFilter: 'all',
      sort: 'newest',
    });
  };

  // Quick stat card click filter
  const handleSelectStatFilter = (filterType, value) => {
    if (filterType === 'status') {
      setActiveNav(value === 'all' ? 'all' : value);
      setFilters((prev) => ({ ...prev, status: value }));
    } else if (filterType === 'priority') {
      setFilters((prev) => ({ ...prev, priority: value }));
    }
  };

  // Toggle Task Status (Checkbox)
  const handleToggleStatus = async (task) => {
    const originalStatus = task.status;
    const newStatus = originalStatus === 'pending' ? 'completed' : 'pending';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
            }
          : t
      )
    );

    // If modal is open for this task, update it too
    if (selectedTaskDetails?._id === task._id) {
      setSelectedTaskDetails((prev) => ({
        ...prev,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
      }));
    }

    try {
      const res = await taskApi.updateStatus(task._id, newStatus);
      if (res.success) {
        showToast(`Task marked as ${newStatus}`);
        loadStats();
        // If current filter excludes the new status, refresh list
        if (filters.status !== 'all' && filters.status !== newStatus) {
          loadTasks(filters);
        }
      }
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: originalStatus } : t))
      );
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Form submit handler (Create or Update)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask?._id) {
        // Update task
        const res = await taskApi.updateTask(editingTask._id, formData);
        if (res.success) {
          showToast('Task updated successfully');
          setIsFormOpen(false);
          setEditingTask(null);
          if (selectedTaskDetails?._id === editingTask._id) {
            setSelectedTaskDetails(res.data);
          }
          loadTasks(filters);
          loadStats();
        }
      } else {
        // Create new task
        const res = await taskApi.createTask(formData);
        if (res.success) {
          showToast('Task created successfully');
          setIsFormOpen(false);
          loadTasks(filters);
          loadStats();
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to save task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
  };

  // Confirm Delete
  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      const res = await taskApi.deleteTask(taskId);
      if (res.success) {
        showToast('Task deleted successfully');
        setDeletingTask(null);
        if (selectedTaskDetails?._id === taskId) {
          setSelectedTaskDetails(null);
        }
        loadTasks(filters);
        loadStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.timeFilter !== 'all' ||
    Boolean(filters.search);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleNavChange}
        stats={stats}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNewTask={handleOpenCreateModal}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Sticky Header */}
        <Header
          searchQuery={filters.search}
          setSearchQuery={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          onOpenNewTask={handleOpenCreateModal}
          setIsMobileOpen={setIsMobileOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Top Metric Cards */}
          <StatsCards stats={stats} onSelectFilter={handleSelectStatFilter} />

          {/* Filter, Sort & Search Toolbar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            totalResults={tasks.length}
          />

          {/* API Connection Error Notice */}
          {apiError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="text-sm font-medium">{apiError}</div>
              </div>
              <button
                onClick={() => {
                  loadTasks(filters);
                  loadStats();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Task List / Content View */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-400" />
              <p className="text-sm font-medium">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              onOpenNewTask={handleOpenCreateModal}
              activeNav={activeNav}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={handleOpenDeleteModal}
                  onViewDetails={(t) => setSelectedTaskDetails(t)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        isSubmitting={isSubmitting}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTaskDetails}
        onClose={() => setSelectedTaskDetails(null)}
        onEdit={(task) => {
          setSelectedTaskDetails(null);
          handleOpenEditModal(task);
        }}
        onDelete={(task) => {
          setSelectedTaskDetails(null);
          handleOpenDeleteModal(task);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
