const bcrypt = require('bcrypt');
const userStore = require('../services/userStore');
const generateToken = require('../utils/generateToken');
const env = require('../config/env');

const DUMMY_PASSWORD_HASH = '$2b$12$wce9xD3L4fSgjNQlyum9We4jiA8jzv0VfaA6FO7OQdW6W5j4g/N6K';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = new Set(['user', 'admin']);

function validateRegistrationPayload({ email, password, name, role }) {
  if (!email || !password || !name) {
    return 'Email, password, and name are required.';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'A valid email address is required.';
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return 'Name must be between 2 and 100 characters.';
  }

  if (role && !ALLOWED_ROLES.has(role)) {
    return "Role must be either 'user' or 'admin'.";
  }

  if (typeof password !== 'string' || password.length < 12) {
    return 'Password must be at least 12 characters long.';
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasDigit || !hasSymbol) {
    return 'Password must include uppercase, lowercase, number, and symbol characters.';
  }

  return null;
}

async function register(req, res, next) {
  try {
    const { email, password, name, role } = req.body;

    const validationError = validateRegistrationPayload({ email, password, name, role });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = userStore.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
    const user = userStore.createUser({ email, passwordHash, name, role: role || 'user' });

    if (!user) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = userStore.findByEmail(email);
    const hashToCompare = user ? user.passwordHash : DUMMY_PASSWORD_HASH;
    const isValidPassword = await bcrypt.compare(password, hashToCompare);

    if (!user || !isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.status(200).json({
    user: req.user,
  });
}

function adminOnlyExample(req, res) {
  return res.status(200).json({
    message: `Hello ${req.user.name}, you have admin access.`,
    user: req.user,
  });
}

module.exports = {
  register,
  login,
  me,
  adminOnlyExample,
};
