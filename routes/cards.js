const router = require('express').Router();
const { validateCardCreation, validateCardById } = require('../middlewares/cardValidation');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', validateCardCreation, createCard);
router.delete('/:cardId', validateCardById, deleteCard);
router.put('/:cardId/likes', validateCardById, likeCard);
router.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = router;
