const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { SECRET_KEY_DEV } = require("../errors/errors");

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

  bcrypt.hash(password, 10)
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
      if (err.code === 11000) {
        next(new ConflictError('User with this email is already registered'));
        return;
      }
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
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { _id: userId } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User with specified id not found'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(BadRequestError('Incorrect data transmitted when updating user information'));
        return;
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
        next(new NotFoundError('User with specified id not found'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Incorrect data is transmitted when the avatar is updated'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV,
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
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('User is not authorized'));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};
