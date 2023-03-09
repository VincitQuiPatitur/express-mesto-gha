const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
 const NotFoundError = require('./errors/NotFoundError'); // 404
const { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require('./errors/errors');
const { validateLogin, validateUserCreation } = require('./middlewares/userValidation');

// mongodb://127.0.0.1:27017/mestodb
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL); // не пугаться подчеркивания, это WebStorm, всё работает корректно

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}); // за 15мин мах 100 запросов, потом выведется сообщение о превышении лимита

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.post('/signup', validateUserCreation, createUser);
app.post('/signin', validateLogin, login);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('The page or resource you\'re looking for can\'t be found'));
  // res.status(NOT_FOUND_ERROR).send({ message:  });
});

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
  }
  next();
});

app.listen(PORT);
