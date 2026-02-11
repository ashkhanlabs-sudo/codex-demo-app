const crypto = require("crypto");
const users = new Map();

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function createUser({ email, passwordHash, name }) {
  const normalizedEmail = normalizeEmail(email);

  if (users.has(normalizedEmail)) {
    return null;
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);
  return user;
}

function findByEmail(email) {
  return users.get(normalizeEmail(email));
}

module.exports = {
  createUser,
  findByEmail,
};
