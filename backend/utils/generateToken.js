const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  return jwt.sign(
    { id, role },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

module.exports = generateToken;
