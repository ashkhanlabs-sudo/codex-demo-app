const jwt = require('jsonwebtoken');
const env = require('../config/env');

function generateToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      issuer: 'codex-demo-app',
      audience: 'codex-demo-app-users',
    }
  );
}

module.exports = generateToken;
