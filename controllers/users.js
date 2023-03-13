// require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../errors/errors');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictError('User with this email is already registered'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data transmitted during user creation'));
        return;
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Invalid user id'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('User with specified id not found'));
        return;
      }
      next(err);
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { _id: userId } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('User with specified id not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data transmitted when updating user information');
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { _id: userId } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User with specified id not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Incorrect data is transmitted when the avatar is updated');
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ _id: token });
      /* res.cookie('jwt', token, {
        httpOnly: true,
      }).end(); */
    })
    .catch(() => {
      next(new UnauthorizedError('User is not authorized'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail(new Error('NotFoundError'))
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('User is not authorized');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};
