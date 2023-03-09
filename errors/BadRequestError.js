const { statusCode } = require('./errors');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.BAD_REQUEST_ERROR;
    //this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
