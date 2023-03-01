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
    .orFail(() => {
      res.status(NOT_FOUND_ERROR).send({ message: `User with id ${userId} not found` });
    })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted during user creation' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { _id: userId } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: `User with id ${userId} not found` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted when updating user information' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { _id: userId } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, avatar, { new: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: `User with id ${userId} not found` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data is transmitted when the avatar is updated' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
      }
    });
};
