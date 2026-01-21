import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";
import useDocumentTitle from "../hooks/useDocumentTitle";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  const fetchMovies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const result = await contentService.getMovies(page, 10);

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
    fetchMovies(currentPage);
  }, [currentPage]);

  useDocumentTitle("Movies");

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <ErrorMessage
          message={error}
          onRetry={() => fetchMovies(currentPage)}
        />
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
              <p className="no-results-text">No movies found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
