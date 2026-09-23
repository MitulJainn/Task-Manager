import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Flame, 
  CalendarDays,
  History,
  AlertTriangle
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

export default function TaskDetailsModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!task) return null;

  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy · h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date specified';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const isOverdue = d < startOfToday && !isCompleted;
      
      return (
        <div className="flex items-center gap-2">
          <span>{format(d, 'EEEE, MMMM d, yyyy')}</span>
          {isOverdue && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>
      );
    } catch {
      return 'Invalid date';
    }
  };

  const priorityConfig = {
    high: { label: 'High Priority', color: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-400' },
    medium: { label: 'Medium Priority', color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
    low: { label: 'Low Priority', color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  };

  const pConfig = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 ${pConfig.text}`}>
                <span className={`w-2 h-2 rounded-full ${pConfig.color}`} />
                {pConfig.label}
              </span>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span className="capitalize">{task.status}</span>
              </span>
            </div>

            <h2 className={`text-xl font-bold text-slate-900 dark:text-white leading-tight ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Description
            </h4>
            <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              {task.description ? task.description : <span className="italic text-slate-400">No description provided for this task.</span>}
            </div>
          </div>

          {/* Timeline & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>Target Due Date</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDueDate(task.dueDate)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>Created Date</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(task.createdAt)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Updated</span>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(task.updatedAt)}
              </div>
            </div>

            {isCompleted && task.completedAt && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed At</span>
                </div>
                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  {formatDate(task.completedAt)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Status Toggle Button */}
          <button
            onClick={() => {
              onToggleStatus(task);
              onClose();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isCompleted
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark as Pending' : 'Mark as Completed'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onDelete(task);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
