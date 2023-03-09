const { statusCode } = require('./errors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.FORBIDDEN_ERROR;
    //this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
