import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";
import useMovieStore from "../store/movieStore";

const SearchPage = () => {
  const storeSearchResults = useMovieStore(state => state.searchResults);
  const storeSearchQuery = useMovieStore(state => state.searchQuery);
  const storeLoading = useMovieStore(state => state.loading);
  const storeError = useMovieStore(state => state.error);
  const storeSearchContent = useMovieStore(state => state.searchContent);
  const storeSearchTotalPages = useMovieStore(state => state.searchTotalPages);
  const storeSearchTotalResults = useMovieStore(state => state.searchTotalResults);
  const storeSetSearchCurrentPage = useMovieStore(state => state.setSearchCurrentPage);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchContent = async (query, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await contentService.searchContent(query, page, 12);
      
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
    
    if (initialQuery) {
      // If store has matching results, use them; otherwise fetch new ones
      if (storeSearchQuery === initialQuery && storeSearchResults.length > 0) {
        setSearchResults(storeSearchResults);
        setSearchQuery(storeSearchQuery);
        setCurrentPage(initialPage);
        setTotalPages(storeSearchTotalPages);
        setTotalResults(storeSearchTotalResults);
        setLoading(storeLoading);
        setError(storeError);
        storeSetSearchCurrentPage(initialPage);
      } else {
        searchContent(initialQuery, initialPage);
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      searchContent(query, 1);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(query)}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handlePageChange = (page) => {
    searchContent(searchQuery, page);
    // Update URL without page reload
    const newUrl = `/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
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

          <form onSubmit={handleSearch} className="search-form-container">
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                name="search"
                placeholder="Search for movies and series..."
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
                ? `Found ${totalResults} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
          )}
        </div>

        {loading && hasSearched && (
          <LoadingSpinner message="Searching content..." />
        )}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => searchQuery && searchContent(searchQuery, currentPage)}
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
              Use the search bar above to find your favorite content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
