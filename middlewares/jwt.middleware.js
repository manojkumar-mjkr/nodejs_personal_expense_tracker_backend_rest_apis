// middlewares/jwt.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../config/db').pool;

const validateUserJWT = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    const [rows] = await db.query('SELECT id as userId, name, email FROM users WHERE id = ?', [decoded.userId]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found or deleted' });
    }

    req.user = rows[0]; // attach user from DB (not just from token)

    console.log('User validated:', req.user);

    next();
  } catch (err) {
    console.error('JWT validation failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = validateUserJWT;
