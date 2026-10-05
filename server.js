require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./src/routes/auth');
const requestRoutes = require('./src/routes/requests');
const imageRoutes = require('./src/routes/images');
const messageRoutes = require('./src/routes/messages');

const app = express();

// Security headers, incl. forcing HTTPS via HSTS once deployed behind TLS.
app.use(helmet());
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// Only the real frontend origin may call this API.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Baseline protection against abuse on every route; stricter limits are
// applied again on the login and submit endpoints specifically.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/messages', messageRoutes);

// Centralized error handler — never leak stack traces to clients.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TattMe API running on port ${PORT}`));
