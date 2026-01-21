import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const fetchMovies = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {};
      if (currentFilters.genre) filterParams.genre = currentFilters.genre;
      if (currentFilters.rating) filterParams.rating = parseFloat(currentFilters.rating);
      if (currentFilters.year) filterParams.year = parseInt(currentFilters.year);
      
      filterParams.sortBy = currentFilters.sortBy;
      filterParams.sortOrder = currentFilters.sortOrder;
      
      const result = await contentService.getMovies(page, 12, filterParams);
      
      setMovies(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalMovies(result.total || 0);
      setCurrentPage(result.currentPage || page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage, filters);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchMovies(1, filters);
  };

  if (loading && movies.length === 0) {
    return (
      <div className="main-content">
        <LoadingSpinner message="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage message={error} onRetry={() => fetchMovies(currentPage, filters)} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="movie-category">
        <div className="movies-header">
          <h1 className="category-title">Movies</h1>
          <div className="movies-count">
            Showing {movies.length} of {totalMovies} movies
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleFilterSubmit} className="content-filters" style={{ marginBottom: "20px" }}>
          <div className="filter-row">
            <select 
              value={filters.genre} 
              onChange={(e) => handleFilterChange({...filters, genre: e.target.value})}
              className="filter-select"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
            </select>

            <input
              type="number"
              placeholder="Min Rating"
              min="0"
              max="10"
              step="0.1"
              value={filters.rating}
              onChange={(e) => handleFilterChange({...filters, rating: e.target.value})}
              className="filter-input"
            />

            <input
              type="number"
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
              value={filters.year}
              onChange={(e) => handleFilterChange({...filters, year: e.target.value})}
              className="filter-input"
            />

            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange({...filters, sortBy: e.target.value})}
              className="filter-select"
            >
              <option value="rating">Sort by Rating</option>
              <option value="releaseYear">Sort by Year</option>
              <option value="title">Sort by Title</option>
              <option value="createdAt">Sort by Date Added</option>
            </select>

            <select 
              value={filters.sortOrder} 
              onChange={(e) => handleFilterChange({...filters, sortOrder: e.target.value})}
              className="filter-select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </form>

        {/* Loading state for subsequent loads */}
        {loading && movies.length > 0 && (
          <LoadingSpinner message="Loading movies..." />
        )}

        {/* Movies Grid */}
        {movies.length > 0 ? (
          <>
            <div className="movies-container">
              {movies.map((movie) => (
                <MovieCard key={movie.id || movie._id} movie={movie} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        ) : (
          !loading && (
            <div className="no-results">
              <p className="no-results-text">No movies found matching your criteria.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
