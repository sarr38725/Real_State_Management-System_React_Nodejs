const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getAllSchedules,
  getUserSchedules,
  createSchedule,
  updateScheduleStatus,
  deleteSchedule
} = require('../controllers/scheduleController');

router.get('/all', authenticate, getAllSchedules);
router.get('/user', authenticate, getUserSchedules);
router.post('/', authenticate, createSchedule);
router.patch('/:id/status', authenticate, updateScheduleStatus);
router.delete('/:id', authenticate, deleteSchedule);

module.exports = router;
