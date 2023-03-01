const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const {NOT_FOUND_ERROR} = require('./errors/errors');

//mongodb://127.0.0.1:27017/mestodb
const {PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb'} = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL) //не пугаться подчеркивания, это WebStorm, всё работает корректно
    .then(() => {
        console.log('Database is successfully connected');
    })
    .catch((err) => {
        console.log('Error on database connection');
        console.error(err);
    });


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    req.user = {
        _id: '63fe6b6902d75098440c83fd'
    };
    next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
    res.status(NOT_FOUND_ERROR).send({message: 'Page not exist'})
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
