import movieService from "../services/movieService.js";

class MovieController {
  async createMovie(req, res) {
    try {
      const movie = await movieService.createMovie(req.body);
      res.status(201).json({
        success: true,
        message: "Content created successfully",
        data: movie,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getContent(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        type: req.query.type || null,
        genre: req.query.genre || null,
        rating: req.query.rating ? parseFloat(req.query.rating) : null,
        year: req.query.year ? parseInt(req.query.year) : null,
        status: req.query.status || null,
        sortBy: req.query.sortBy || "rating",
        sortOrder: req.query.sortOrder || "desc",
        trending: req.query.trending === "true",
      };

      const result = await movieService.getContent(filters);

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
        message: "Content retrieved successfully",
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
        message: "Content updated successfully",
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
        message: "Content deleted successfully",
        data: movie,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async searchContent(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const filters = {
        query,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        type: req.query.type || null,
        genre: req.query.genre || null,
        rating: req.query.rating ? parseFloat(req.query.rating) : null,
        year: req.query.year ? parseInt(req.query.year) : null,
        sortBy: req.query.sortBy || "rating",
        sortOrder: req.query.sortOrder || "desc",
      };

      const result = await movieService.searchContent(filters);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStreamingUrl(req, res) {
    try {
      const movie = await movieService.updateStreamingUrl(
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Streaming URLs updated successfully",
        data: movie,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getStreamingInfo(req, res) {
    try {
      const streamingInfo = await movieService.getStreamingInfo(req.params.id);

      res.status(200).json({
        success: true,
        message: "Streaming info retrieved successfully",
        data: streamingInfo,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async generateSignedStreamUrl(req, res) {
    const { key, filename } = req.params;

    try {
      const rewrittenM3U8 = await movieService.rewriteM3U8(key, filename);

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(rewrittenM3U8);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new MovieController();
