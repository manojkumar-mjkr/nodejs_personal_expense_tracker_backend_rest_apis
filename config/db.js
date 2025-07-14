const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    let a = await connection.ping(); // MySQL ping
    connection.release();
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);
    return false;
  }
};

module.exports = { pool, testConnection };
