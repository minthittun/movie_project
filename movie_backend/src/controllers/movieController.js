import movieService from "../services/movieService.js";

class MovieController {
  async createMovie(req, res) {
    try {
      const movie = await movieService.createMovie(req.body);
      res.status(201).json({
        success: true,
        message: "Movie created successfully",
        data: movie,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllMovies(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const genre = req.query.genre || null;

      const result = await movieService.getAllMovies(page, limit, genre);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMovieById(req, res) {
    try {
      const movie = await movieService.getMovieById(req.params.id);

      res.status(200).json({
        success: true,
        message: "Movie retrieved successfully",
        data: movie,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateMovie(req, res) {
    try {
      const movie = await movieService.updateMovie(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: movie,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteMovie(req, res) {
    try {
      const movie = await movieService.deleteMovie(req.params.id);

      res.status(200).json({
        success: true,
        message: "Movie deleted successfully",
        data: movie,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getTrendingMovies(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const result = await movieService.getTrendingMovies(limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchMovies(req, res) {
    try {
      const query = req.query.q;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const result = await movieService.searchMovies(query, page, limit);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MovieController();
