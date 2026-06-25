const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.post('/', taskController.creatTask);
router.put('/', taskController.updateTaskStatus);
router.delete('/', taskController.deleteTask);

module.express = router;
