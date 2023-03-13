const { INTERNAL_SERVER_ERROR } = require('../errors/errors');

module.exports.errorHandler = ((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
  }
  next();
});
