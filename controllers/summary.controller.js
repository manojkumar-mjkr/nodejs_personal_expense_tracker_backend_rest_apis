const bcrypt = require('bcryptjs');
const db = require('../config/db').pool;
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { success, error } = require('../utils/responseFormatter.js');
const jwt = require('jsonwebtoken');

const ExpenseTracking = require('../models/expenseTracking.js');

exports.monthly = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { month, year } = req.body;

    // Validate month and year
    if (!month || !year || month < 1 || month > 12 || year < 2000) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    const summary = await ExpenseTracking.getMonthlySummary(user_id, month, year);
    
    return res.status(200).json(success('Monthly summary retrieved successfully', summary));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error('Internal server error', err.message));
  }
}