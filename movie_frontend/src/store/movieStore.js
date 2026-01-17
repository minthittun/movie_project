import { create } from 'zustand';
import movieService from '../services/movieService';

const useMovieStore = create((set, get) => ({
  movies: [],
  trendingMovies: [],
  searchResults: [],
  selectedMovie: null,
  loading: false,
  error: null,
  searchQuery: '',
  searchCurrentPage: 1,
  searchTotalPages: 1,
  searchTotalResults: 0,
  currentPage: 1,
  totalPages: 1,
  totalMovies: 0,

  fetchMovies: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await movieService.getMovies(page);
      set({ 
        movies: response.data, 
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalMovies: response.total,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrendingMovies: async () => {
    set({ loading: true, error: null });
    try {
      const response = await movieService.getTrendingMovies();
      set({ trendingMovies: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  searchMovies: async (query, page = 1) => {
    if (!query.trim()) {
      set({ searchResults: [], searchQuery: '' });
      return;
    }
    
    set({ loading: true, error: null, searchQuery: query, searchCurrentPage: page });
    try {
      const response = await movieService.searchMovies(query, page);
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

  fetchMovieById: async (id) => {
    set({ loading: true, error: null });
    try {
      const movie = await movieService.getMovieById(id);
      set({ selectedMovie: movie, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

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

  clearSelectedMovie: () => {
    set({ selectedMovie: null });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

export default useMovieStore;