import Movie from "../models/Movie.js";

class MovieService {
  async createMovie(movieData) {
    try {
      const movie = new Movie(movieData);
      await movie.save();
      return movie;
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  async getAllMovies(page = 1, limit = 10, genre = null, type = null) {
    try {
      const query = {};
      
      if (genre) {
        query.genre = genre;
      }
      
      if (type) {
        query.type = type;
      }

      const movies = await Movie.find(query)
        .sort({ rating: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Movie.countDocuments(query);

      return {
        data: movies,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  async getMovieById(id) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) {
        throw new Error("Movie not found");
      }
      return movie;
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }

  async updateMovie(id, movieData) {
    try {
      const movie = await Movie.findByIdAndUpdate(id, movieData, {
        new: true,
        runValidators: true,
      });

      if (!movie) {
        throw new Error("Movie not found");
      }

      return movie;
    } catch (error) {
      throw new Error(`Error updating movie: ${error.message}`);
    }
  }

  async deleteMovie(id) {
    try {
      const movie = await Movie.findByIdAndDelete(id);

      if (!movie) {
        throw new Error("Movie not found");
      }

      return movie;
    } catch (error) {
      throw new Error(`Error deleting movie: ${error.message}`);
    }
  }

  async getTrendingMovies(limit = 10, type = null) {
    try {
      const query = { rating: { $gte: 7.0 } };
      
      if (type) {
        query.type = type;
      }

      const movies = await Movie.find(query)
        .sort({ rating: -1, releaseYear: -1 })
        .limit(limit);

      return {
        data: movies,
        totalPages: 1,
        currentPage: 1,
        total: movies.length,
      };
    } catch (error) {
      throw new Error(`Error fetching trending movies: ${error.message}`);
    }
  }

  async searchMovies(query, page = 1, limit = 10, type = null) {
    try {
      const isNumber = !isNaN(Number(query));

      const searchConditions = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ];

      // Add type-specific search fields
      if (!type || type === 'movie') {
        searchConditions.push({ director: { $regex: query, $options: "i" } });
      }
      
      if (!type || type === 'series') {
        searchConditions.push({ creator: { $regex: query, $options: "i" } });
        searchConditions.push({ cast: { $regex: query, $options: "i" } });
      }

      if (isNumber) {
        searchConditions.push({ releaseYear: Number(query) });
      }

      const filter = { $or: searchConditions };
      
      if (type) {
        filter.type = type;
      }

      const movies = await Movie.find(filter)
        .sort({ rating: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Movie.countDocuments(filter);

      return {
        data: movies,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      };
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }
}

export default new MovieService();
