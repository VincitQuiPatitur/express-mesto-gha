const { INTERNAL_SERVER_ERROR } = require('./errors');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
    this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
