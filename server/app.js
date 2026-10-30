require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const { csrfGuard } = require('./middleware/auth');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for secure cookies

// 1. Security headers (CSP, HSTS, nosniff, frameguard ...)
app.use(helmet());

// 2. CORS: only the exact frontend origin(s), never "*"
const allowed = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map((s) => s.trim());
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 3. NoSQL injection defence: strips keys starting with $ or containing .
app.use(mongoSanitize());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 4. CSRF defence for state-changing requests
app.use('/api', csrfGuard);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/feedback', require('./routes/feedback'));

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.message === 'Origin not allowed by CORS') return res.status(403).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
