const router = require('express').Router();
const userController = require('../controllers/users');
const userValidation = require('../middlewares/userValidation');

router.get('/me', userController.getCurrentUser);
router.patch('/me', userValidation.validateUserUpdate, userController.updateUser);

module.exports = router;
