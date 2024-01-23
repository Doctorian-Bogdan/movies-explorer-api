const router = require('express').Router();
const movieController = require('../controllers/movies');
const movieValidation = require('../middlewares/movieValidation');

router.get('/', movieController.getMovies);
router.post('/', movieValidation.validateMovie, movieController.createMovie);
router.delete('/:movieId', movieValidation.validateMovieId, movieController.deleteMovie);

module.exports = router;
