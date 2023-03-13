const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateLogin, validateUserCreation } = require('../middlewares/userValidation');
const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUserCreation, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
