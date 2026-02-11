const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const required = ['JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const nodeEnv = process.env.NODE_ENV || 'development';
if (!['development', 'test', 'production'].includes(nodeEnv)) {
  throw new Error('NODE_ENV must be one of: development, test, production.');
}

const port = Number(process.env.PORT) || 3000;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid integer between 1 and 65535.');
}

const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
if (!Number.isInteger(bcryptSaltRounds) || bcryptSaltRounds < 10 || bcryptSaltRounds > 15) {
  throw new Error('BCRYPT_SALT_ROUNDS must be an integer between 10 and 15.');
}

const corsOrigin = process.env.CORS_ORIGIN || '*';
if (nodeEnv === 'production' && corsOrigin === '*') {
  throw new Error('CORS_ORIGIN must be set to an explicit origin in production.');
}

module.exports = {
  nodeEnv,
  port,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptSaltRounds,
  corsOrigin,
  requestBodyLimit: process.env.REQUEST_BODY_LIMIT || '10kb',
};
