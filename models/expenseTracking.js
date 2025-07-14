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

