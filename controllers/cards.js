const Card = require('../models/card');
const {
    BAD_REQUEST_ERROR, //400
    NOT_FOUND_ERROR, //404
    INTERNAL_SERVER_ERROR //500
} = require('../errors/errors');

module.exports.getAllCards = (req, res) => {
    Card.find({})
        .populate('owner')
        .then(cards => {
            cards
                ? res.send(cards)
                : res.status(NOT_FOUND_ERROR).send({message: "The cards don't exist"});
        })
        .catch(err => res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"}));
};

module.exports.createCard = (req, res) => {
    const owner = req.user._id;
    const {name, link} = req.body;

    Card.create({name, link, owner})
        .then(card => res.send({data: card}))
        .catch(err => {
            err.name === 'ValidationError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted during card creation'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

module.exports.deleteCard = (req, res) => {
    const {cardId} = req.params;

    Card.findByIdAndRemove(cardId)
        .then(card => {
            card
                ? res.send(card)
                : res.status(NOT_FOUND_ERROR).send({message: `Card with id ${cardId} not found`});
        })
        .catch(err => {
            err === 'CastError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted during card deletion'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

module.exports.likeCard = (req, res) => {
    const {_id: userId} = req.user;
    const {cardId} = req.params;

    Card.findByIdAndUpdate(cardId, {$addToSet: {likes: userId}}, {new: true})
        .then(card => {
            card
                ? res.send(card)
                : res.status(NOT_FOUND_ERROR).send({message: `Card with id ${cardId} not found`});
        })
        .catch(err => {
            err === 'ValidationError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted in order to like the card'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

module.exports.dislikeCard = (req, res) => {
    const {_id: userId} = req.user;
    const {cardId} = req.params;

    Card.findByIdAndUpdate(cardId, {$pull: {likes: userId}}, {new: true})
        .then(card => {
            card
                ? res.send(card)
                : res.status(NOT_FOUND_ERROR).send({message: `Card with id ${cardId} not found`});
        })
        .catch(err => {
            err === 'ValidationError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted in order to dislike the card'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

