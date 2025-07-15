//const db = require('../config/db');
const db = require('../config/db').pool;

// Create new transaction
exports.create = async ({
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
}) => {
  const [result] = await db.query(
    `INSERT INTO expense_tracking 
     (user_id, cash_flow_id, income_category_id, expense_category_id, amount, transaction_date, day, month, year, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      cash_flow_id,
      income_category_id || null,
      expense_category_id || null,
      amount,
      transaction_date,
      day,
      month,
      year,
      description || null
    ]
  );

  return result.insertId;
};

exports.list = async () => {
  const [rows] = await db.query(`
    SELECT 
      et.id,
      et.user_id,
      et.cash_flow_id,
      cf.name AS cash_flow_type,
      et.expense_category_id,
      ec.name AS expense_category_name,
      et.income_category_id,
      ic.name AS income_category_name,
      et.amount,
      et.transaction_date,
      et.day,
      et.month,
      et.year,
      et.description,
      et.created_date_time,
      et.updated_date_time
    FROM expense_tracking et
    LEFT JOIN cash_flow cf ON et.cash_flow_id = cf.id
    LEFT JOIN expense_category ec ON et.expense_category_id = ec.id
    LEFT JOIN income_category ic ON et.income_category_id = ic.id
    ORDER BY et.transaction_date DESC
  `);

  return rows;
};

exports.detail = async (transactionId) => {
  const [rows] = await db.query(`
    SELECT 
      et.id,
      et.user_id,
      et.cash_flow_id,
      cf.name AS cash_flow_type,
      et.expense_category_id,
      ec.name AS expense_category_name,
      et.income_category_id,
      ic.name AS income_category_name,
      et.amount,
      et.transaction_date,
      et.day,
      et.month,
      et.year,
      et.description,
      et.created_date_time,
      et.updated_date_time
    FROM expense_tracking et
    LEFT JOIN cash_flow cf ON et.cash_flow_id = cf.id
    LEFT JOIN expense_category ec ON et.expense_category_id = ec.id
    LEFT JOIN income_category ic ON et.income_category_id = ic.id
    WHERE et.id = ?
  `, [transactionId]);

  return rows[0]; // return single record
};

// models/expenseTrackingModel.js
exports.findById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM expense_tracking WHERE id = ?`, [id]);
  return rows[0]; // return single record
};

exports.update = async (id, data) => {
  const [result] = await db.query(`
    UPDATE expense_tracking SET 
      cash_flow_id = ?, 
      income_category_id = ?, 
      expense_category_id = ?, 
      amount = ?, 
      transaction_date = ?, 
      day = ?, 
      month = ?, 
      year = ?, 
      description = ?, 
      updated_date_time = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    data.cash_flow_id,
    data.income_category_id,
    data.expense_category_id,
    data.amount,
    data.transaction_date,
    data.day,
    data.month,
    data.year,
    data.description,
    id
  ]);

  return result.affectedRows;
};

exports.remove = async (transactionId) => {
  const [result] = await db.query(
    `DELETE FROM expense_tracking WHERE id = ?`,
    [transactionId]
  );
  return result.affectedRows;
};

exports.getMonthlySummary = async (userId, month, year) => {
  const [rows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN cash_flow_id = 1 THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN cash_flow_id = 2 THEN amount ELSE 0 END) AS total_expense
    FROM expense_tracking
    WHERE user_id = ?
      AND month = ?
      AND year = ?
    `,
    [userId, month, year]
  );

  const result = rows[0] || {};
  const totalIncome = parseFloat(result.total_income || 0);
  const totalExpense = parseFloat(result.total_expense || 0);
  const balance = totalIncome - totalExpense;

  return { totalIncome, totalExpense, balance };
};

exports.getYearlySummary = async (userId, year) => {
  const [rows] = await db.query(
    `
    SELECT
      SUM(CASE WHEN cash_flow_id = 1 THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN cash_flow_id = 2 THEN amount ELSE 0 END) AS total_expense
    FROM expense_tracking
    WHERE user_id = ?
      AND year = ?
    `,
    [userId, year]
  );

  const result = rows[0] || {};
  const totalIncome = parseFloat(result.total_income || 0);
  const totalExpense = parseFloat(result.total_expense || 0);
  const balance = totalIncome - totalExpense;

  return { totalIncome, totalExpense, balance };
};




