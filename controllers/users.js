const User = require('../models/user');
const {
    BAD_REQUEST_ERROR, //400
    NOT_FOUND_ERROR, //404
    INTERNAL_SERVER_ERROR //500
} = require('../errors/errors');

module.exports.getAllUsers = (req, res) => {
    User.find({})
        .then(users => res.send(users))
        .catch(err => res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"}));
};

module.exports.getUserById = (req, res) => {
    const {userId} = req.params;
    User.findById(userId)
        .orFail((err) => {
            res.status(NOT_FOUND_ERROR).send({message: `User with id ${userId} not found`});
        })
        .then(user => res.send({data: user}))
        .catch(err => res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"}));
};

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;

    User.create({name, about, avatar})
        .then(user => res.send({data: user}))
        .catch(err => {
            err === 'ValidationError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted during user creation'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

module.exports.updateUserInfo = (req, res) => {
    const {_id: userId} = req.user;
    const {name, about} = req.body;

    User.findByIdAndUpdate(userId, {name, about}, {new: true})
        .then(user => {
            user
                ? res.send({data: user})
                : res.status(NOT_FOUND_ERROR).send({message: `User with id ${userId} not found`});
        })
        .catch(err => {
            err === 'CastError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data transmitted when updating user information'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};

module.exports.updateAvatar = (req, res) => {
    const {_id: userId} = req.user;
    const {avatar} = req.body;

    User.findByIdAndUpdate(userId, avatar, {new: true})
        .then(user => {
            user
                ? res.send({data: user})
                : res.status(NOT_FOUND_ERROR).send({message: `User with id ${userId} not found`});
        })
        .catch(err => {
            err === 'ValidationError'
                ? res.status(BAD_REQUEST_ERROR).send({message: 'Incorrect data is transmitted when the avatar is updated'})
                : res.status(INTERNAL_SERVER_ERROR).send({message: "Error has occurred on the server"});
        });
};