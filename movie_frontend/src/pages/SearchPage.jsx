import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import useContentStore from "../store/movieStore";

const SearchPage = () => {
  const [searchType, setSearchType] = useState('all');
  
const { 
    searchResults, 
    searchQuery, 
    loading, 
    error, 
    searchContent,
    searchCurrentPage,
    searchTotalPages,
    searchTotalResults,
    setSearchCurrentPage,
  } = useContentStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const initialQuery = queryParams.get("q");
    const initialPage = parseInt(queryParams.get("page")) || 1;
    const initialType = queryParams.get("type") || 'all';
    
    setSearchType(initialType);
    
    if (initialQuery) {
      const type = initialType === 'all' ? null : initialType;
      searchContent(initialQuery, initialPage, 10, type);
    }
  }, [searchContent, setSearchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      const type = searchType === 'all' ? null : searchType;
      searchContent(query, 1, 10, type);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(query)}${searchType !== 'all' ? `&type=${searchType}` : ''}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handlePageChange = (page) => {
    setSearchCurrentPage(page);
    const type = searchType === 'all' ? null : searchType;
    searchContent(searchQuery, page, 10, type);
    // Update URL without page reload
    const newUrl = `/search?q=${encodeURIComponent(searchQuery)}&page=${page}${searchType !== 'all' ? `&type=${searchType}` : ''}`;
    window.history.pushState({}, "", newUrl);
    // Scroll to top
    window.scrollTo(0, 0);
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
              onClick={() => setSearchType('all')}
              style={{ marginRight: '10px' }}
            >
              All
            </button>
            <button 
              className={`btn ${searchType === 'movie' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSearchType('movie')}
              style={{ marginRight: '10px' }}
            >
              Movies
            </button>
            <button 
              className={`btn ${searchType === 'series' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSearchType('series')}
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

          {hasSearched && (
            <p className="search-query">
              {searchResults.length > 0
                ? `Found ${searchTotalResults} ${searchType === 'all' ? 'content' : searchType + (searchType === 'movie' ? 's' : 'es')} results for "${searchQuery}"`
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
            onRetry={() => searchQuery && searchMovies(searchQuery)}
          />
        )}

        {!loading && !error && hasSearched && searchResults.length > 0 && (
          <>
            <div className="movies-container">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {searchTotalPages > 1 && (
              <Pagination
                currentPage={searchCurrentPage}
                totalPages={searchTotalPages}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}

{!loading && !error && hasSearched && searchResults.length === 0 && (
          <div className="no-results">
            <p className="no-results-text">
              Try searching with different keywords or browse our popular
              content.
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
              Use search bar above or search feature in the header to
              find your favorite content.
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
              Start searching for movies
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Use the search bar above or the search feature in the header to
              find your favorite movies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
