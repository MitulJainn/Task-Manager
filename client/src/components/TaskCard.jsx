import React from 'react';
import { 
  Check, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';

export default function TaskCard({
  task,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onViewDetails,
}) {
  const isCompleted = task.status === 'completed';

  // Compute due date context
  const getDueDateInfo = (dueDateStr) => {
    if (!dueDateStr) return null;
    const date = new Date(dueDateStr);
    
    // Check if overdue: past date AND pending
    const now = new Date();
    // Compare date midnight bounds to avoid false positive for today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const isDueToday = isToday(date);
    const isDueTomorrow = isTomorrow(date);
    const isOverdue = date < startOfToday && !isCompleted;

    if (isCompleted) {
      return {
        label: format(date, 'MMM d, yyyy'),
        badgeClass: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        icon: Calendar,
      };
    }

    if (isOverdue) {
      const daysAgo = Math.max(1, differenceInDays(startOfToday, date));
      return {
        label: `Overdue (${daysAgo}d ago)`,
        badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60 font-semibold',
        icon: AlertCircle,
        isOverdue: true,
      };
    }

    if (isDueToday) {
      return {
        label: 'Due Today',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 font-semibold',
        icon: Clock,
      };
    }

    if (isDueTomorrow) {
      return {
        label: 'Due Tomorrow',
        badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
        icon: Calendar,
      };
    }

    const diffDays = differenceInDays(date, startOfToday);
    return {
      label: `Due in ${diffDays} days (${format(date, 'MMM d')})`,
      badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Calendar,
    };
  };

  const dueInfo = getDueDateInfo(task.dueDate);

  // Priority indicator styles
  const priorityConfig = {
    high: {
      label: 'High Priority',
      color: 'bg-rose-500',
      pill: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60',
    },
    medium: {
      label: 'Medium Priority',
      color: 'bg-amber-500',
      pill: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60',
    },
    low: {
      label: 'Low Priority',
      color: 'bg-emerald-500',
      pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60',
    },
  };

  const priorityStyle = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-200 ${
        dueInfo?.isOverdue && !isCompleted
          ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/20 dark:bg-rose-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      } ${isCompleted ? 'opacity-70 dark:opacity-60 bg-slate-50/50 dark:bg-slate-900/50' : ''}`}
    >
      <div className="flex items-start gap-3.5">
        {/* Interactive Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(task);
          }}
          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-150 ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
              : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-slate-800'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Content */}
        <div 
          onClick={() => onViewDetails(task)}
          className="flex-1 min-w-0 cursor-pointer"
        >
          {/* Header Row: Title & Action buttons */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Quick Actions (Edit / Delete) */}
            <div 
              className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onEditTask(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteTask(task)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description Snippet */}
          {task.description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Badges and Metadata footer */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            {/* Priority Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${priorityStyle.pill}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.color}`} />
              <span className="capitalize">{task.priority}</span>
            </span>

            {/* Status Badge */}
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Pending</span>
              </span>
            )}

            {/* Due Date Indicator */}
            {dueInfo && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] ${dueInfo.badgeClass}`}
              >
                <dueInfo.icon className="w-3 h-3" />
                <span>{dueInfo.label}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
