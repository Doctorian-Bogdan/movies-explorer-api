require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const { CREATED_OK, OK } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

function login(req, res, next) {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
}

function createUser(req, res, next) {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(CREATED_OK).send({
        email,
        name,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует.'));
      } else {
        next(err);
      }
    });
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с указанным _id: ${req.params.userId} не найден.`));
        return;
      }
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      }
      next(err);
    });
}

function updateUser(req, res, next) {
  const {
    email,
    name,
  } = req.body;

  return User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email существует.'));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

module.exports = {
  login,
  createUser,
  getCurrentUser,
  updateUser,
};
