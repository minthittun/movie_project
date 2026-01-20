import { Router } from 'express';
import movieController from '../controllers/movieController.js';

const router = Router();

// Movie endpoints
router.post('/movies', movieController.createMovie);
router.get('/movies', movieController.getAllMovies);
router.get('/movies/trending', movieController.getTrendingMovies);
router.get('/movies/search', movieController.searchMovies);
router.get('/movies/:id', movieController.getMovieById);
router.put('/movies/:id', movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);

// Series endpoints
router.get('/series', movieController.getSeries);
router.get('/series/trending', movieController.getTrendingSeries);
router.get('/series/search', movieController.searchSeries);

// Combined content endpoints
router.get('/content', movieController.getAllMovies);
router.get('/content/trending', movieController.getTrendingMovies);
router.get('/content/search', movieController.searchMovies);

export default router;