import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useMovieStore from "../store/movieStore";

const SearchPage = () => {
  const { searchResults, searchQuery, loading, error, searchMovies } =
    useMovieStore();

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) {
      searchMovies(initialQuery);
    }
  }, [searchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      searchMovies(query);
      // Update URL without page reload
      const newUrl = `/search?q=${encodeURIComponent(query)}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const hasSearched = searchQuery !== "";

  return (
    <div className="main-content">
      <div className="search-results">
        <div className="search-header">
          <h1 className="search-title">Search Movies</h1>

          <form onSubmit={handleSearch} className="search-form-container">
            <div style={{ display: "flex", gap: "16px" }}>
              <input
                type="text"
                name="search"
                placeholder="Search for movies..."
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
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
          )}
        </div>

        {loading && hasSearched && (
          <LoadingSpinner message="Searching movies..." />
        )}

        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => searchQuery && searchMovies(searchQuery)}
          />
        )}

        {!loading && !error && hasSearched && searchResults.length > 0 && (
          <div className="movies-container">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && !error && hasSearched && searchResults.length === 0 && (
          <div className="no-results">
            <p className="no-results-text">
              Try searching with different keywords or browse our popular
              movies.
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
