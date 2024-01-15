const { celebrate, Joi } = require('celebrate');
const { regExp } = require('../utils/constants');

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(1000).required(),
    image: Joi.string().pattern(regExp).required(),
    trailerLink: Joi.string().pattern(regExp).required(),
    thumbnail: Joi.string().pattern(regExp).required(),
    nameRU: Joi.string().min(2).max(50).required(),
    nameEN: Joi.string().min(2).max(50).required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateMovie,
  validateMovieId,
};
