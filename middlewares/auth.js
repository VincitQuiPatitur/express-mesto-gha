require('dotenv').config();
const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('../errors/UnauthorizedError');

// const { JWT_SECRET } = process.env;

/* const handleAuthError = (res, next) => next(new UnauthorizedError('Authorisation required')); */

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // handleAuthError(res);
    return res.status(401).send({ message: 'Authorisation required' });
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, '0559695638d8f557660622e028f1de34abe93dbf036a8c8f6d150b46382d5bec');
  } catch (err) {
    // handleAuthError(res);
    return res.status(401).send({ message: 'Authorisation required' });
  }

  req.user = payload;
  return next();
};
