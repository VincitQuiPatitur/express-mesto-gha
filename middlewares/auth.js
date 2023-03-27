const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SECRET_KEY_DEV } = require("../errors/errors");

const handleAuthError = (res, next) => next(new UnauthorizedError('Authorisation required'));

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }
  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV);
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;
  return next();
};
