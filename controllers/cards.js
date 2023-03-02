const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR, // 400
  NOT_FOUND_ERROR, // 404
  INTERNAL_SERVER_ERROR, // 500
} = require('../errors/errors');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      if (!cards) {
        res.status(NOT_FOUND_ERROR).send({ message: 'The cards do not exist' });
        return;
      }
      res.send(cards);
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted during card creation' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card with specified id not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted during card deletion' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.likeCard = (req, res) => {
  const { _id: userId } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card with specified id not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted in order to like the card' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id: userId } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Card with specified id not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data transmitted in order to dislike the card' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error has occurred on the server' });
    });
};
