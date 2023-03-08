require('dotenv').config();
const jwt = require('jsonwebtoken');

function handleAuthError(res) {
  return res.status(401).send({ message: 'Необходима авторизация' });
}

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;
  next();
};