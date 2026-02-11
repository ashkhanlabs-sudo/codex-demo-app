const env = require('../config/env');

function notFound(_req, res) {
  return res.status(404).json({ message: 'Route not found.' });
}

function errorHandler(err, _req, res, _next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Malformed JSON payload.' });
  }

  const status = err.status || 500;

  if (env.nodeEnv !== 'test') {
    const logPayload = env.nodeEnv === 'production' ? err.message : err;
    console.error(logPayload);
  }

  return res.status(status).json({
    message: status === 500 ? 'Internal server error.' : err.message,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
