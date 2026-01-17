import axios from "axios";
import apiConfig from "../utils/api";

const movieService = {
  getMovies: async (page = 1, limit = 12) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch movies");
    }
  },

  getTrendingMovies: async () => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies/trending?limit=12`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch trending movies");
    }
  },

  searchMovies: async (query) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies/search?q=${encodeURIComponent(query)}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to search movies");
    }
  },

  getMovieById: async (id) => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/movies/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch movie details");
    }
  },
};

export default movieService;
