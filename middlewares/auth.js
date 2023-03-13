// require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// const { JWT_SECRET } = process.env;

const { JWT_SECRET } = require('../errors/errors');

const handleAuthError = (res, next) => next(new UnauthorizedError('Authorisation required'));

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }
  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;
  return next();
};
