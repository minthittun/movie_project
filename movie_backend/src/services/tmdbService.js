import axios from "axios";
import ImageHelper from "../utils/imageHelper.js";

class TMDBService {
  constructor() {
    this.apiKey = "df2ca1588353179721216ae592a1cae8";
    this.baseURL = "https://api.themoviedb.org/3";
    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language: "en-US",
      },
    });
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await this.client.get("/movie/popular", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching popular movies: ${error.message}`);
    }
  }

  async getTopRatedMovies(page = 1) {
    try {
      const response = await this.client.get("/movie/top_rated", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching top rated movies: ${error.message}`);
    }
  }

  async getNowPlayingMovies(page = 1) {
    try {
      const response = await this.client.get("/movie/now_playing", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching now playing movies: ${error.message}`);
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await this.client.get(`/movie/${movieId}`, {
        params: {
          append_to_response: "credits",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching movie details: ${error.message}`);
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await this.client.get("/search/movie", {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error searching movies: ${error.message}`);
    }
  }

  getImageUrl(path, size = "w500") {
    return ImageHelper.getPosterUrl(path, size);
  }

  transformMovieData(tmdbMovie) {
    const director =
      tmdbMovie.credits?.crew?.find((person) => person.job === "Director")
        ?.name || "Unknown";

    return {
      title: tmdbMovie.title,
      description: tmdbMovie.overview || "No description available",
      releaseYear: tmdbMovie.release_date
        ? new Date(tmdbMovie.release_date).getFullYear()
        : new Date().getFullYear(),
      genre: tmdbMovie.genres ? tmdbMovie.genres.map((g) => g.name) : [],
      director: director,
      rating: tmdbMovie.vote_average
        ? parseFloat(tmdbMovie.vote_average.toFixed(1))
        : 0,
      duration: tmdbMovie.runtime || 120,
      tmdbId: tmdbMovie.id,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
    };
  }
}

export default new TMDBService();
