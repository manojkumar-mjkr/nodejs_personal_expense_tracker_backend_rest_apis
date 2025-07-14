const bcrypt = require('bcryptjs');
const db = require('../config/db').pool;
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');