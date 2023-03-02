const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { NOT_FOUND_ERROR } = require('./errors/errors');

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
app.use((req, res, next) => {
  req.user = {
    _id: '63fe6b6902d75098440c83fd',
  };
  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Page not exist' });
});

app.listen(PORT);
