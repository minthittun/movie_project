import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import useContentStore from "../store/movieStore";

const SeriesPage = () => {
  const {
    series,
    loading,
    error,
    fetchSeries,
    currentPage,
    totalPages,
    totalContent,
    setCurrentPage,
  } = useContentStore();

  useEffect(() => {
    fetchSeries(currentPage);
  }, [currentPage, fetchSeries]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && series.length === 0) {
    return (
      <div className="main-content">
        <LoadingSpinner message="Loading series..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage message={error} onRetry={fetchSeries} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="movie-category">
        <div className="movies-header">
          <h1 className="category-title" style={{ marginBottom: 0 }}>
            TV Series
          </h1>
          <div className="movies-count">
            Showing {series.length} of {totalContent} series
          </div>
        </div>

        {loading && series.length === 0 ? (
          <LoadingSpinner message="Loading series..." />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => fetchSeries(currentPage)}
          />
        ) : (
          <>
            {series.length > 0 ? (
              <>
                <div className="movies-container">
                  {series.map((show) => (
                    <MovieCard key={show.id} movie={show} />
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
              <div className="no-results">
                <p className="no-results-text">No series found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;