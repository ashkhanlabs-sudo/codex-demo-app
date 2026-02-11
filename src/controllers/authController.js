const bcrypt = require('bcrypt');
const userStore = require('../services/userStore');
const generateToken = require('../utils/generateToken');
const env = require('../config/env');

function validateRegistrationPayload({ email, password, name }) {
  if (!email || !password || !name) {
    return 'Email, password, and name are required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return null;
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const validationError = validateRegistrationPayload({ email, password, name });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = userStore.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
    const user = userStore.createUser({ email, passwordHash, name });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
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
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
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

module.exports = {
  register,
  login,
  me,
};
