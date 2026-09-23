const Task = require('../models/Task');

/**
 * Helper to get the start and end of the current local/UTC day
 */
const getDayBounds = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { startOfDay, endOfDay };
};

/**
 * @desc    Get all tasks with filtering, search, and sorting
 * @route   GET /api/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, timeFilter, sort } = req.query;
    const query = {};

    // 1. Text Search on title or description (case-insensitive)
    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitized, 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // 2. Status Filter
    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    // 3. Priority Filter
    if (priority && priority !== 'all') {
      query.priority = priority.toLowerCase();
    }

    // 4. Time Filter (today, upcoming, overdue)
    const { startOfDay, endOfDay } = getDayBounds();
    if (timeFilter) {
      if (timeFilter === 'today') {
        query.dueDate = { $gte: startOfDay, $lte: endOfDay };
      } else if (timeFilter === 'upcoming') {
        query.dueDate = { $gt: endOfDay };
      } else if (timeFilter === 'overdue') {
        // Requirement: Do NOT mark completed tasks as overdue! Overdue applies to pending tasks only.
        query.dueDate = { $lt: startOfDay };
        query.status = 'pending';
      }
    }

    // Execute query with sorting
    let tasksQuery = Task.find(query);

    // 5. Sorting
    switch (sort) {
      case 'oldest':
        tasksQuery = tasksQuery.sort({ createdAt: 1 });
        break;
      case 'dueDate':
        // Sort nulls last: MongoDB sorts null first in ascending, so we handle nulls cleanly
        tasksQuery = tasksQuery.sort({ dueDate: 1, createdAt: -1 });
        break;
      case 'priority':
        // Custom sorting for priority: high -> medium -> low
        // We can fetch and sort in memory or use collation/aggregation.
        // Doing in-memory sort or sort projection:
        break;
      case 'alphabetical':
        tasksQuery = tasksQuery.sort({ title: 1 });
        break;
      case 'newest':
      default:
        tasksQuery = tasksQuery.sort({ createdAt: -1 });
        break;
    }

    let tasks = await tasksQuery.exec();

    // Priority sort if requested
    if (sort === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => {
        const weightA = priorityWeights[a.priority] || 0;
        const weightB = priorityWeights[b.priority] || 0;
        if (weightB !== weightA) return weightB - weightA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    // Due date sort with nulls placed at the bottom
    if (sort === 'dueDate') {
      tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return new Date(b.createdAt) - new Date(a.createdAt);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics dynamically from database
 * @route   GET /api/tasks/stats
 */
const getTaskStats = async (req, res, next) => {
  try {
    const { startOfDay } = getDayBounds();

    const [totalTasks, completedTasks, pendingTasks, highPriorityTasks, overdueTasks] =
      await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'completed' }),
        Task.countDocuments({ status: 'pending' }),
        Task.countDocuments({ priority: 'high' }),
        Task.countDocuments({
          status: 'pending',
          dueDate: { $ne: null, $lt: startOfDay },
        }),
      ]);

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks,
        overdueTasks,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority ? priority.toLowerCase() : 'medium',
      status: status ? status.toLowerCase() : 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      completedAt: status === 'completed' ? new Date() : null,
    };

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, priority, dueDate, status } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority.toLowerCase();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    if (status !== undefined) {
      const newStatus = status.toLowerCase();
      if (newStatus !== task.status) {
        task.status = newStatus;
        task.completedAt = newStatus === 'completed' ? new Date() : null;
      }
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task status (pending <-> completed)
 * @route   PATCH /api/tasks/:id/status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const newStatus = req.body.status
      ? req.body.status.toLowerCase()
      : task.status === 'pending'
      ? 'completed'
      : 'pending';

    task.status = newStatus;
    task.completedAt = newStatus === 'completed' ? new Date() : null;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${newStatus}`,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
