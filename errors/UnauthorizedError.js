const { UNAUTHORIZED_ERROR } = require('./errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
