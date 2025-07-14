const bcrypt = require('bcryptjs');
const db = require('../config/db').pool;
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { success, error } = require('../utils/responseFormatter.js');
const jwt = require('jsonwebtoken');

const ExpenseTracking = require('../models/expenseTracking.js');

exports.expenseTracking = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Transaction api is working' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.create = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const {
      cash_flow_id,
      income_category_id,
      expense_category_id,
      amount,
      transaction_date,
      description
    } = req.body;
    console.log("user_id = ", user_id);

    // ✅ Basic validation
    if (!cash_flow_id || !amount || !transaction_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse date
    console.log("transaction_date = ",transaction_date);
    const dateObj = new Date(transaction_date);
    console.log("dateObj = ",dateObj);
    console.log("isNaN(dateObj) = ",isNaN(dateObj));
    if (isNaN(dateObj)) {
      return res.status(400).json({ message: 'Invalid transaction_date format' });
    }

    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Month is 0-based
    const year = dateObj.getFullYear();

    // Validation: one of the categories must be provided
    if (!income_category_id && !expense_category_id) {
      return res.status(400).json({ message: 'Provide at least one category (income or expense)' });
    }

    const transactionId = await ExpenseTracking.create({
      user_id,
      cash_flow_id,
      income_category_id,
      expense_category_id,
      amount,
      transaction_date,
      day,
      month,
      year,
      description
    });

    return res.status(201).json({ message: 'Transaction added', transactionId });

  } catch (err) {
    console.error('Error creating transaction:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const transactions = await ExpenseTracking.list({});
    const result = transactions.map(t => ({
      ...t,
      amount: parseFloat(t.amount),
      transaction_date: new Date(t.transaction_date),
    }));
    return res.status(201).json(success(1,'transactions fetched successfully', { transactionData: result }));
  } catch (error) {
    return res.status(500).json(error('Failed to fetch transactions', 500, error.message));
  }
};//need to work for date time filter, pagination, sorting

exports.info = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await ExpenseTracking.detail(id);

    if (!transaction) {
      return res.status(404).json(error('Transaction not found', 404));
    }

    return res.status(200).json(success(1,'Transaction fetched successfully', transaction));
  } catch (error) {
    return res.status(500).json(error('Internal server error', 500, error.message));
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Get existing record
    const existing = await ExpenseTracking.findById(id);
    if (!existing) {
      return res.status(404).json(response.error('Transaction not found', 404));
    }

    // Step 2: Merge existing with incoming body
    const input = req.body;

    // Ensure correct date parsing and breakdown
    const transaction_date = input.transaction_date || existing.transaction_date;
    const dateObj = new Date(transaction_date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    // Step 3: Construct final update data
    const finalData = {
      cash_flow_id: input.cash_flow_id ?? existing.cash_flow_id,
      income_category_id: input.income_category_id ?? existing.income_category_id,
      expense_category_id: input.expense_category_id ?? existing.expense_category_id,
      amount: input.amount ?? existing.amount,
      transaction_date,
      day,
      month,
      year,
      description: input.description ?? existing.description,
    };

    // Step 4: Update DB
    const updateCount = await ExpenseTracking.update(id, finalData);

    return res.status(200).json(success(1,'Transaction updated successfully'));
  } catch (err) {
    return res.status(500).json(error('Failed to update transaction', 500, err.message));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCount = await ExpenseTracking.remove(id);

    if (deleteCount === 0) {
      return res.status(404).json(error('Transaction not found', 404));
    }

    return res.status(200).json(success('Transaction deleted successfully'));
  } catch (error) {
    return res.status(500).json(error('Failed to delete transaction', 500, error.message));
  }
};
