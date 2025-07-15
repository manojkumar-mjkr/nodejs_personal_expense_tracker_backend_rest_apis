const summaryController = require('../controllers/summary.controller');
const express = require('express');
const router = express.Router();

router.post('/monthly', summaryController.monthly);

module.exports = router;