// middlewares/staticToken.middleware.js
require('dotenv').config();

const validateStaticToken = (req, res, next) => {

  //console.log('Validating static token for path:', req.path);
  const skipPaths = ['/refreshToken']; // ✅ List of paths to skip
  if (skipPaths.includes(req.path)) {
    return next(); // ✅ Skip token check
  }

  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== process.env.CORE_STATIC_TOKEN) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  console.log('Static token validated successfully');

  next();
};

module.exports = validateStaticToken;
