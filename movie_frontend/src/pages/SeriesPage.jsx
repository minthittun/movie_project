import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import contentService from "../services/contentService";
import useDocumentTitle from "../hooks/useDocumentTitle";

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSeries, setTotalSeries] = useState(0);

  const fetchSeries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const result = await contentService.getSeries(page, 10);

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
    fetchSeries(currentPage);
  }, [currentPage]);

  useDocumentTitle("TV Series");

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <ErrorMessage
          message={error}
          onRetry={() => fetchSeries(currentPage)}
        />
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
              <p className="no-results-text">No TV series found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SeriesPage;
