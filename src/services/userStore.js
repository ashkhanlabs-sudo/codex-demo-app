const crypto = require('crypto');

const users = new Map();

function normalizeEmail(email) {
  if (typeof email !== 'string') {
    return '';
  }

  return email.trim().toLowerCase();
}

function createUser({ email, passwordHash, name, role = 'user' }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || users.has(normalizedEmail)) {
    return null;
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    name: typeof name === 'string' ? name.trim() : '',
    role,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return user;
}

function findByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  return users.get(normalizedEmail) || null;
}

module.exports = {
  createUser,
  findByEmail,
};
