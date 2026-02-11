const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'same-site' },
  })
);
app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin,
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: env.requestBodyLimit }));
app.use(apiRateLimiter);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
