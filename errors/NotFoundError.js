const { statusCode } = require('./errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.NOT_FOUND_ERROR;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
