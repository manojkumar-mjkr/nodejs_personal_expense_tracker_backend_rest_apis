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
    const userInfo = req.user;

    // Validate month and year
    if (!month || !year || month < 1 || month > 12 || year < 2000) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    const summary = await ExpenseTracking.getMonthlySummary(user_id, month, year);
    
    const token = generateToken({ userId: userInfo.userId, email: userInfo.email });
    const refreshToken = generateRefreshToken({ userId: userInfo.userId, email: userInfo.email });

    return res.status(200).json(success(1, 'Monthly summary retrieved successfully', {summary,token, refreshToken}));
  } catch (err) {
    console.error(err);
    return res.status(500).json(error('Internal server error', err.message));
  }
}

exports.yearly = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { year } = req.body;
    const userInfo = req.user;

    if (!year) {
      return res.status(400).json(error('Missing year in request body', 400));
    }

    const summary = await ExpenseTracking.getYearlySummary(userId, parseInt(year));

    const token = generateToken({ userId: userInfo.userId, email: userInfo.email });
    const refreshToken = generateRefreshToken({ userId: userInfo.userId, email: userInfo.email });

    return res.status(200).json(success(1,'Yearly summary fetched', {summary, token, refreshToken}));
  } catch (err) {
    return res.status(500).json(error('Failed to fetch yearly summary', 500, err.message));
  }
};
