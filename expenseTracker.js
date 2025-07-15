const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database connection
const { testConnection } = require('./config/db');

//middlewares
const validateStaticToken = require('./middlewares/staticToken.middleware');
const validateUserJWT = require('./middlewares/jwt.middleware');

//controller based routes
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/expenseTracking.routes');
const summaryRoutes = require('./routes/summary.routes');



// Initialize Express app
const app = express();
app.use(express.json());
app.use(express.json({ limit: '10kb' })); // Avoid large payloads / Prevent NoSQL/SQL injection, JSON flooding


app.use(cors({
  origin: 'http://localhost:3000', // your frontend domain URL only can access this API
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers
  preflightContinue: false, // don't pass the preflight request to the next handler
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // credentials: true // if you want to allow cookies to be sent with requests
  // If you want to allow cookies, you can uncomment the line below
  // but make sure your frontend is also configured to send credentials
  // and your server is set up to handle them properly.
  credentials: true
}));


//Implmenting rate limiting middleware globaly
// This will limit the number of requests from a single IP address to 100 requests per hour
const rateLimiter = require('./middlewares/rateLimit.middleware');
app.use(rateLimiter);

// Routes
app.use('/api/auth', validateStaticToken, authRoutes);
app.use('/api/expenseTracking', validateUserJWT, transactionRoutes);
app.use('/api/summary', validateUserJWT, summaryRoutes);

// Health check service
app.get('/', (req, res) => res.send('Expense Tracker API Running'));

//Db Health Check
app.get('/dbHealthCheck', async (req, res) => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    return res.status(200).json({ status: 'OK', db: 'Connected' });
  } else {
    return res.status(500).json({ status: 'Fail', db: 'Not Connected' });
  }
});

process.nextTick(() => {
  console.log('Server is starting...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
