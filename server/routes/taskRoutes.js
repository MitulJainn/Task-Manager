const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { validateTask } = require('../middleware/validator');

// Stats route (must be before /:id to avoid ID conflict)
router.get('/stats', getTaskStats);

// Main tasks collection routes
router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

// Task individual routes
router.route('/:id')
  .get(getTaskById)
  .put(validateTask, updateTask)
  .delete(deleteTask);

// Quick status toggle route
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
