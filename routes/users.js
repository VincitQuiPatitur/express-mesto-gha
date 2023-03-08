const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
