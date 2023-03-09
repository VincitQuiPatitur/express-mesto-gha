const { statusCode } = require('./errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.UNAUTHORIZED_ERROR;
    //this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
