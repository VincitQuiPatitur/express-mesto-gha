// require('dotenv').config();
const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('../errors/UnauthorizedError');

// const { JWT_SECRET } = process.env;

const { JWT_SECRET } = require('../errors/errors');

/* const handleAuthError = (res, next) => next(new UnauthorizedError('Authorisation required')); */

// const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // handleAuthError(res);
    return res.status(401).send({ message: 'Authorisation required' });
  }
  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);

  } catch (err) {
    // handleAuthError(res);
    return res.status(401).send({ message: 'Authorisation required' });
  }

  req.user = payload;
  return next();
};
