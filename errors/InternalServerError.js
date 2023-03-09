const { statusCode } = require('./errors');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.INTERNAL_SERVER_ERROR;
    //this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
