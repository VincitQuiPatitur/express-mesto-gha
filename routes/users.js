const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
