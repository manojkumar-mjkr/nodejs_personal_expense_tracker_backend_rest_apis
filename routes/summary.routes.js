const summaryController = require('../controllers/summary.controller');
const express = require('express');
const router = express.Router();

router.post('/monthly', summaryController.monthly);
router.post('/yearly', summaryController.yearly);

module.exports = router;