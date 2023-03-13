const { celebrate, Joi } = require('celebrate');
const { linkRegex, idRegex } = require('../utils/constants');

module.exports.validateCardCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
});

module.exports.validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(idRegex),
  }),
});
