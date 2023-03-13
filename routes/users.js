const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserInfoUpdates,
  validateUserAvatarUpdates,
  validateUserById,
} = require('../middlewares/userValidation');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.patch('/me', validateUserInfoUpdates, updateUserInfo);
router.patch('/me/avatar', validateUserAvatarUpdates, updateAvatar);
router.get('/:userId', validateUserById, getUserById);

module.exports = router;
