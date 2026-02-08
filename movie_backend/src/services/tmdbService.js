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
          append_to_response: "credits,videos",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching movie details: ${error.message}`);
    }
  }

  async getMovieVideos(movieId) {
    try {
      const response = await this.client.get(`/movie/${movieId}/videos`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching movie videos: ${error.message}`);
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

  // TV Series methods
  async getPopularSeries(page = 1) {
    try {
      const response = await this.client.get("/tv/popular", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching popular series: ${error.message}`);
    }
  }

  async getTopRatedSeries(page = 1) {
    try {
      const response = await this.client.get("/tv/top_rated", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching top rated series: ${error.message}`);
    }
  }

  async getOnTheAirSeries(page = 1) {
    try {
      const response = await this.client.get("/tv/on_the_air", {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching on the air series: ${error.message}`);
    }
  }

  async getSeriesDetails(seriesId) {
    try {
      const response = await this.client.get(`/tv/${seriesId}`, {
        params: {
          append_to_response: "credits,videos,external_ids",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching series details: ${error.message}`);
    }
  }

  async getSeriesVideos(seriesId) {
    try {
      const response = await this.client.get(`/tv/${seriesId}/videos`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching series videos: ${error.message}`);
    }
  }

  async searchSeries(query, page = 1) {
    try {
      const response = await this.client.get("/search/tv", {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error searching series: ${error.message}`);
    }
  }

  async searchAll(query, page = 1) {
    try {
      const response = await this.client.get("/search/multi", {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error searching content: ${error.message}`);
    }
  }

  getImageUrl(path, size = "w500") {
    return ImageHelper.getPosterUrl(path, size);
  }

  transformMovieData(tmdbMovie) {
    const director =
      tmdbMovie.credits?.crew?.find((person) => person.job === "Director")
        ?.name || "Unknown";

    const trailerUrl = this.getMainTrailerUrl(tmdbMovie.videos?.results || []);
    const cast = tmdbMovie.credits?.cast?.slice(0, 10).map(person => person.name) || [];

    return {
      title: tmdbMovie.title,
      description: tmdbMovie.overview || "No description available",
      releaseYear: tmdbMovie.release_date
        ? new Date(tmdbMovie.release_date).getFullYear()
        : new Date().getFullYear(),
      genre: tmdbMovie.genres ? tmdbMovie.genres.map((g) => g.name) : [],
      director: director,
      cast: cast,
      rating: tmdbMovie.vote_average
        ? parseFloat(tmdbMovie.vote_average.toFixed(1))
        : 0,
      duration: tmdbMovie.runtime || 120,
      type: "movie",
      status: "Released",
      tmdbId: tmdbMovie.id,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      trailerUrl: trailerUrl,
      streamingUrl: null,
    };
  }

  transformSeriesData(tmdbSeries) {
    const creator =
      tmdbSeries.created_by && tmdbSeries.created_by.length > 0
        ? tmdbSeries.created_by.map(c => c.name).join(", ")
        : "Unknown";

    const trailerUrl = this.getMainTrailerUrl(tmdbSeries.videos?.results || []);
    const cast = tmdbSeries.credits?.cast?.slice(0, 10).map(person => person.name) || [];

    return {
      title: tmdbSeries.name,
      description: tmdbSeries.overview || "No description available",
      releaseYear: tmdbSeries.first_air_date
        ? new Date(tmdbSeries.first_air_date).getFullYear()
        : new Date().getFullYear(),
      endYear: tmdbSeries.last_air_date
        ? new Date(tmdbSeries.last_air_date).getFullYear()
        : undefined,
      genre: tmdbSeries.genres ? tmdbSeries.genres.map((g) => g.name) : [],
      creator: creator,
      cast: cast,
      rating: tmdbSeries.vote_average
        ? parseFloat(tmdbSeries.vote_average.toFixed(1))
        : 0,
      seasons: tmdbSeries.number_of_seasons || 1,
      episodes: tmdbSeries.number_of_episodes || 1,
      type: "series",
      status: tmdbSeries.status || "Released",
      tmdbId: tmdbSeries.id,
      posterPath: tmdbSeries.poster_path,
      backdropPath: tmdbSeries.backdrop_path,
      trailerUrl: trailerUrl,
      streamingUrls: [],
    };
  }

  getMainTrailerUrl(videos) {
    if (!videos || videos.length === 0) return null;

    const trailers = videos
      .filter(video => 
        video.type === "Trailer" && 
        video.site === "YouTube" && 
        video.key
      )
      .sort((a, b) => {
        if (a.official !== b.official) return b.official - a.official;
        return new Date(b.published_at) - new Date(a.published_at);
      });

    if (trailers.length === 0) return null;
    
    return `https://www.youtube.com/watch?v=${trailers[0].key}`;
  }
}

export default new TMDBService();
