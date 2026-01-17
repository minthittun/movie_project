import { Router } from 'express';
import movieController from '../controllers/movieController.js';

const router = Router();

router.post('/movies', movieController.createMovie);

router.get('/movies', movieController.getAllMovies);

router.get('/movies/trending', movieController.getTrendingMovies);

router.get('/movies/search', movieController.searchMovies);

router.get('/movies/:id', movieController.getMovieById);

router.put('/movies/:id', movieController.updateMovie);

router.delete('/movies/:id', movieController.deleteMovie);

export default router;