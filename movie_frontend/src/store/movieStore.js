import { create } from 'zustand';
import contentService from '../services/contentService';

const useContentStore = create((set, get) => ({
  // Movies
  movies: [],
  trendingMovies: [],
  
  // Series
  series: [],
  trendingSeries: [],
  
  // All content
  content: [],
  trendingContent: [],
  
  // Search results
  searchResults: [],
  selectedContent: null,
  streamingInfo: null,
  
  // UI state
  loading: false,
  error: null,
  searchQuery: '',
  searchCurrentPage: 1,
  searchTotalPages: 1,
  searchTotalResults: 0,
  currentPage: 1,
  totalPages: 1,
  totalContent: 0,

  // Movies methods
  fetchMovies: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getMovies(page);
      set({ 
        movies: response.data, 
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalContent: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrendingMovies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getTrendingMovies();
      set({ trendingMovies: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Series methods
  fetchSeries: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getSeries(page);
      set({ 
        series: response.data, 
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalContent: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrendingSeries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getTrendingSeries();
      set({ trendingSeries: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // All content methods
  fetchContent: async (page = 1, type = null) => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getContent(page, 10, type);
      set({ 
        content: response.data, 
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalContent: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrendingContent: async (type = null) => {
    set({ loading: true, error: null });
    try {
      const response = await contentService.getTrendingContent(type);
      set({ trendingContent: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Search methods
  searchMovies: async (query, page = 1) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: '' });
      return;
    }
    
    set({ loading: true, error: null, searchQuery: query, searchCurrentPage: page });
    try {
      const response = await contentService.searchMovies(query, page);
      set({ 
        searchResults: response.data, 
        searchCurrentPage: response.currentPage,
        searchTotalPages: response.totalPages,
        searchTotalResults: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchSeries: async (query, page = 1) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: '' });
      return;
    }
    
    set({ loading: true, error: null, searchQuery: query, searchCurrentPage: page });
    try {
      const response = await contentService.searchSeries(query, page);
      set({ 
        searchResults: response.data, 
        searchCurrentPage: response.currentPage,
        searchTotalPages: response.totalPages,
        searchTotalResults: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchContent: async (query, page = 1, type = null) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: '' });
      return;
    }
    
    set({ loading: true, error: null, searchQuery: query, searchCurrentPage: page });
    try {
      const response = await contentService.searchContent(query, page, 10, type);
      set({ 
        searchResults: response.data, 
        searchCurrentPage: response.currentPage,
        searchTotalPages: response.totalPages,
        searchTotalResults: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchContentById: async (id) => {
    set({ loading: true, error: null });
    try {
      const content = await contentService.getContentById(id);
      set({ selectedContent: content, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchStreamingInfo: async (id) => {
    set({ loading: true, error: null });
    try {
      const streamingInfo = await contentService.getStreamingInfo(id);
      set({ streamingInfo, loading: false });
      return streamingInfo;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateStreamingUrl: async (id, streamingData) => {
    set({ loading: true, error: null });
    try {
      const updatedContent = await contentService.updateStreamingUrl(id, streamingData);
      // Update selected content if it's the same one
      const { selectedContent } = get();
      if (selectedContent && selectedContent._id === id) {
        set({ selectedContent: updatedContent });
      }
      set({ loading: false });
      return updatedContent;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Utility methods
  clearSearch: () => {
    set({ 
      searchResults: [], 
      searchQuery: '', 
      searchCurrentPage: 1,
      searchTotalPages: 1,
      searchTotalResults: 0,
      error: null 
    });
  },

  setSearchCurrentPage: (page) => {
    set({ searchCurrentPage: page });
  },

  clearSelectedContent: () => {
    set({ selectedContent: null });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

export default useContentStore;