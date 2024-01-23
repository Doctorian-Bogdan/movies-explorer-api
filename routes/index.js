const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const userValidation = require('../middlewares/userValidation');
const { createUser, login } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', userValidation.validateUserInfo, createUser);
router.post('/signin', userValidation.validateUserAuthentication, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
