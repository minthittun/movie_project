import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";

const SearchPage = () => {
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const searchContent = async (query, page = 1, type = null, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = { ...currentFilters };
      if (currentFilters.genre) searchFilters.genre = currentFilters.genre;
      if (currentFilters.rating) searchFilters.rating = parseFloat(currentFilters.rating);
      if (currentFilters.year) searchFilters.year = parseInt(currentFilters.year);
      
      searchFilters.sortBy = currentFilters.sortBy;
      searchFilters.sortOrder = currentFilters.sortOrder;
      
      const result = await contentService.searchContent(query, page, 12, {
        type,
        ...searchFilters
      });
      
      setSearchResults(result.data || []);
      setTotalPages(result.totalPages || 1);
      setTotalResults(result.total || 0);
      setCurrentPage(result.currentPage || page);
      setSearchQuery(query);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const initialQuery = queryParams.get("q");
    const initialPage = parseInt(queryParams.get("page")) || 1;
    const initialType = queryParams.get("type") || 'all';
    
    setSearchType(initialType);
    
    if (initialQuery) {
      const type = initialType === 'all' ? null : initialType;
      searchContent(initialQuery, initialPage, type);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      const type = searchType === 'all' ? null : searchType;
      searchContent(query, 1, type);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(query)}${searchType !== 'all' ? `&type=${searchType}` : ''}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handlePageChange = (page) => {
    const type = searchType === 'all' ? null : searchType;
    searchContent(searchQuery, page, type);
    // Update URL without page reload
    const newUrl = `/search?q=${encodeURIComponent(searchQuery)}&page=${page}${searchType !== 'all' ? `&type=${searchType}` : ''}`;
    window.history.pushState({}, "", newUrl);
    // Scroll to top
    window.scrollTo(0, 0);
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    if (searchQuery) {
      const typeParam = type === 'all' ? null : type;
      searchContent(searchQuery, 1, typeParam);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(searchQuery)}${type !== 'all' ? `&type=${type}` : ''}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    if (searchQuery) {
      const type = searchType === 'all' ? null : searchType;
      searchContent(searchQuery, 1, type, newFilters);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      const type = searchType === 'all' ? null : searchType;
      searchContent(searchQuery, 1, type, filters);
    }
  };

  const hasSearched = searchQuery !== "";

  return (
    <div className="main-content">
      <div className="search-results">
        <div className="search-header">
          <h1 className="search-title">Search Content</h1>

          <div className="search-type-filters" style={{ marginBottom: "20px" }}>
            <button 
              className={`btn ${searchType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTypeChange('all')}
              style={{ marginRight: '10px' }}
            >
              All
            </button>
            <button 
              className={`btn ${searchType === 'movie' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTypeChange('movie')}
              style={{ marginRight: '10px' }}
            >
              Movies
            </button>
            <button 
              className={`btn ${searchType === 'series' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleTypeChange('series')}
            >
              Series
            </button>
          </div>

          <form onSubmit={handleSearch} className="search-form-container">
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                name="search"
                placeholder={`Search for ${searchType === 'all' ? 'movies and series' : searchType}s...`}
                defaultValue={searchQuery}
                className="search-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>

          {/* Search Filters */}
          {hasSearched && (
            <form onSubmit={handleFilterSubmit} className="content-filters" style={{ marginBottom: "20px", marginTop: "20px" }}>
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
          )}

          {hasSearched && (
            <p className="search-query">
              {searchResults.length > 0
                ? `Found ${totalResults} ${searchType === 'all' ? 'content' : searchType + (searchType === 'movie' ? 's' : 'es')} results for "${searchQuery}"`
                : `No ${searchType === 'all' ? 'content' : searchType} results found for "${searchQuery}"`}
            </p>
          )}
        </div>

        {loading && hasSearched && (
          <LoadingSpinner message="Searching content..." />
        )}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => searchQuery && searchContent(searchQuery, currentPage, searchType === 'all' ? null : searchType)}
          />
        )}

        {!loading && !error && hasSearched && searchResults.length > 0 && (
          <>
            <div className="movies-container">
              {searchResults.map((movie) => (
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
        )}

        {!loading && !error && hasSearched && searchResults.length === 0 && (
          <div className="no-results">
            <p className="no-results-text">
              Try searching with different keywords or browse our popular content.
            </p>
          </div>
        )}

        {!hasSearched && !loading && !error && (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h3
              style={{
                marginBottom: "20px",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Start searching for movies and series
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Use search bar above or search feature in the header to find your favorite content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
