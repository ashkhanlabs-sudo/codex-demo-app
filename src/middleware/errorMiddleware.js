const env = require('../config/env');

function notFound(_req, res) {
  return res.status(404).json({ message: 'Route not found.' });
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;

  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  return res.status(status).json({
    message: status === 500 ? 'Internal server error.' : err.message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
