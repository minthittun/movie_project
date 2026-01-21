import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSeries, setTotalSeries] = useState(0);
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    status: '',
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const fetchSeries = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {};
      if (currentFilters.genre) filterParams.genre = currentFilters.genre;
      if (currentFilters.rating) filterParams.rating = parseFloat(currentFilters.rating);
      if (currentFilters.year) filterParams.year = parseInt(currentFilters.year);
      if (currentFilters.status) filterParams.status = currentFilters.status;
      
      filterParams.sortBy = currentFilters.sortBy;
      filterParams.sortOrder = currentFilters.sortOrder;
      
      const result = await contentService.getSeries(page, 12, filterParams);
      
      setSeries(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalSeries(result.total || 0);
      setCurrentPage(result.currentPage || page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries(currentPage, filters);
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
    fetchSeries(1, filters);
  };

  if (loading && series.length === 0) {
    return (
      <div className="main-content">
        <LoadingSpinner message="Loading TV series..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage message={error} onRetry={() => fetchSeries(currentPage, filters)} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="movie-category">
        <div className="movies-header">
          <h1 className="category-title">TV Series</h1>
          <div className="movies-count">
            Showing {series.length} of {totalSeries} series
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
              <option value="Mystery">Mystery</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
            </select>

            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange({...filters, status: e.target.value})}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Returning Series">Returning Series</option>
              <option value="Ended">Ended</option>
              <option value="Released">Released</option>
              <option value="In Production">In Production</option>
              <option value="Planned">Planned</option>
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
        {loading && series.length > 0 && (
          <LoadingSpinner message="Loading series..." />
        )}

        {/* Series Grid */}
        {series.length > 0 ? (
          <>
            <div className="movies-container">
              {series.map((show) => (
                <MovieCard key={show.id || show._id} movie={show} />
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
              <p className="no-results-text">No TV series found matching your criteria.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SeriesPage;