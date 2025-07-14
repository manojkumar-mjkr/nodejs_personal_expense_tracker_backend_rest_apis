const bcrypt = require('bcryptjs');
const db = require('../config/db').pool;
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const [insertResult] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = insertResult.insertId;
    const token = generateToken({ userId, email });
    const refreshToken = generateRefreshToken({ userId: userId, email: email });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: { id: userId, name, email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    //console.log('Login attempt for email:', rows);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Token is valid → issue a new access token
    const newAccessToken = generateToken({
      userId: decoded.userId,
      email: decoded.email
    });

    return res.status(200).json({ token: newAccessToken });

  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
