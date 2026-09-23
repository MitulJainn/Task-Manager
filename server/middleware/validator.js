/**
 * Request validation middleware for Tasks
 */

const validateTask = (req, res, next) => {
  const { title, description, priority, dueDate, status } = req.body;
  const errors = [];

  // Title validation
  if (req.method === 'POST' || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Task title is required' });
    } else if (title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Title must be at least 3 characters long' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
    }
  }

  // Description validation
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be text' });
    } else if (description.trim().length > 500) {
      errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
    }
  }

  // Priority validation
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(String(priority).toLowerCase())) {
      errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
    }
  }

  // Status validation
  if (status !== undefined) {
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(String(status).toLowerCase())) {
      errors.push({ field: 'status', message: 'Status must be either pending or completed' });
    }
  }

  // DueDate validation
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  if (!status || !['pending', 'completed'].includes(String(status).toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Status must be either "pending" or "completed".',
      errors: [{ field: 'status', message: 'Status must be pending or completed' }],
    });
  }
  next();
};

module.exports = {
  validateTask,
  validateStatusUpdate,
};
