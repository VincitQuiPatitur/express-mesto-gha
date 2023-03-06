const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {
  BAD_REQUEST_ERROR, // 400
  NOT_FOUND_ERROR, // 404
  INTERNAL_SERVER_ERROR, // 500
} = require('../errors/errors');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Invalid user id' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'User with specified id not found' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted during user creation' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { _id: userId } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(BAD_REQUEST_ERROR).send({ message: 'User with specified id not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted when updating user information' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { _id: userId } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'User with specified id not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data is transmitted when the avatar is updated' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};
