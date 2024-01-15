const Movie = require('../models/movie');
const { OK, CREATED_OK } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

function getAllMovies(req, res, next) {
  return Movie.find({})
    .then((movies) => res.status(OK).send(movies))
    .catch((err) => {
      next(err);
    });
}

function createMovie(req, res, next) {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    // eslint-disable-next-line max-len
    country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, owner,
  })
    .then((movie) => res.status(CREATED_OK).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки. '));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  return Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Данный фильм не найден'));
        return;
      }
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Можно удалять только свои карточки'));
        return;
      }
      Movie.deleteOne(movie)
        .then(() => res.status(200).send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные. '));
      } else if (err.message === 'NotValidId') {
        next(new NotFoundError(`Пользователь с указанным ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
