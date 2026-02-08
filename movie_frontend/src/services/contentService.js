import axios from "axios";
import apiConfig from "../utils/api";

const contentService = {
  // Build query string from parameters
  buildQueryString: (params) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return query.toString();
  },

  // Unified content endpoint with filters
  getContent: async (filters = {}) => {
    try {
      const defaultFilters = {
        page: 1,
        limit: 10,
        ...filters
      };
      
      const queryString = contentService.buildQueryString(defaultFilters);
      const url = `${apiConfig.baseURL}/content${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch content");
    }
  },

  // Movies specific
  getMovies: async (page = 1, limit = 10, filters = {}) => {
    return contentService.getContent({
      type: 'movie',
      page,
      limit,
      ...filters
    });
  },

  // Series specific
  getSeries: async (page = 1, limit = 10, filters = {}) => {
    return contentService.getContent({
      type: 'series',
      page,
      limit,
      ...filters
    });
  },

  // Trending content
  getTrendingContent: async (type = null, limit = 10) => {
    return contentService.getContent({
      trending: true,
      limit,
      ...(type && { type })
    });
  },

  getTrendingMovies: async (limit = 10) => {
    return contentService.getTrendingContent('movie', limit);
  },

  getTrendingSeries: async (limit = 10) => {
    return contentService.getTrendingContent('series', limit);
  },

  // Unified search
  searchContent: async (query, page = 1, limit = 10, filters = {}) => {
    try {
      const searchFilters = {
        query,
        page,
        limit,
        ...filters
      };
      
      const queryString = contentService.buildQueryString(searchFilters);
      const url = `${apiConfig.baseURL}/content/search${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error("Failed to search content");
    }
  },

  // Search specific types
  searchMovies: async (query, page = 1, limit = 10, filters = {}) => {
    return contentService.searchContent(query, page, limit, {
      type: 'movie',
      ...filters
    });
  },

  searchSeries: async (query, page = 1, limit = 10, filters = {}) => {
    return contentService.searchContent(query, page, limit, {
      type: 'series',
      ...filters
    });
  },

  // Get by ID
  getContentById: async (id) => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/content/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch content details");
    }
  },

  // Streaming endpoints
  getStreamingInfo: async (id) => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/content/${id}/streaming`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch streaming info");
    }
  },

  updateStreamingUrl: async (id, streamingData) => {
    try {
      const response = await axios.put(`${apiConfig.baseURL}/content/${id}/streaming`, streamingData);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update streaming URL");
    }
  },
};

export default contentService;