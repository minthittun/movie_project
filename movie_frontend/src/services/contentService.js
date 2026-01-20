import axios from "axios";
import apiConfig from "../utils/api";

const contentService = {
  // Movies
  getMovies: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies?page=${page}&limit=${limit}&type=movie`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch movies");
    }
  },

  // Series
  getSeries: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/series?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch series");
    }
  },

  // All content
  getContent: async (page = 1, limit = 10, type = null) => {
    try {
      const url = `${apiConfig.baseURL}/content?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch content");
    }
  },

  // Trending
  getTrendingMovies: async () => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies/trending?limit=10&type=movie`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch trending movies");
    }
  },

  getTrendingSeries: async () => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/series/trending?limit=10`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch trending series");
    }
  },

  getTrendingContent: async (type = null) => {
    try {
      const url = `${apiConfig.baseURL}/content/trending?limit=10${type ? `&type=${type}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch trending content");
    }
  },

  // Search
  searchMovies: async (query, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/movies/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to search movies");
    }
  },

  searchSeries: async (query, page = 1, limit = 10) => {
    try {
      const response = await axios.get(
        `${apiConfig.baseURL}/series/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to search series");
    }
  },

  searchContent: async (query, page = 1, limit = 10, type = null) => {
    try {
      const url = `${apiConfig.baseURL}/content/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to search content");
    }
  },

  // Get by ID
  getContentById: async (id) => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/movies/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch content details");
    }
  },
};

export default contentService;