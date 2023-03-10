const { NOT_FOUND_ERROR } = require('./errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
