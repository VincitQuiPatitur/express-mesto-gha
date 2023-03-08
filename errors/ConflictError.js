const { statusCode } = require('./errors');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.CONFLICT_ERROR;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
