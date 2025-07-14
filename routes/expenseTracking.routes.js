const expenseController = require('../controllers/expenseTracking.controller');
const express = require('express');
const router = express.Router();

// Define routes for transaction operations
router.get('/test', expenseController.expenseTracking); // Test route to check if the API is working

router.post('/create', expenseController.create);
router.post('/list', expenseController.list);
router.get('/info/:id', expenseController.info);
router.patch('/update/:id', expenseController.update);
router.delete('/delete/:id', expenseController.delete);

module.exports = router;    