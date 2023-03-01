/*
const router = require('express').Router();
const { cards } = require('./controllers/cards');

router.get('/users/:id', (req, res) => {
    if (!users[req.params.id]) {
        res.send(`Такого пользователя не существует`);
        return;
    }

    const { name, age } = users[req.params.id];

    res.send(`Пользователь ${name}, ${age} лет`);
});

module.exports = router; // экспортировали роутер
*/

const router = require('express').Router();

const {
    getAllCards,
    createCard,
    deleteCard,
    likeCard,
    dislikeCard
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:carId/likes', dislikeCard);


module.exports = router;