import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import useContentStore from "../store/movieStore";

const MoviesPage = () => {
  const [contentType, setContentType] = useState('movie');
  
  const {
    movies,
    series,
    content,
    loading,
    error,
    fetchMovies,
    fetchSeries,
    fetchContent,
    currentPage,
    totalPages,
    totalContent,
    setCurrentPage,
  } = useContentStore();

  useEffect(() => {
    if (contentType === 'movie') {
      fetchMovies(currentPage);
    } else if (contentType === 'series') {
      fetchSeries(currentPage);
    } else {
      fetchContent(currentPage);
    }
  }, [currentPage, contentType, fetchMovies, fetchSeries, fetchContent]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDisplayContent = () => {
    switch (contentType) {
      case 'movie': return movies;
      case 'series': return series;
      default: return content;
    }
  };

  const getTitle = () => {
    switch (contentType) {
      case 'movie': return 'Movies';
      case 'series': return 'TV Series';
      default: return 'All Content';
    }
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
        <ErrorMessage message={error} onRetry={fetchMovies} />
      </div>
    );
  }

const displayContent = getDisplayContent();

  return (
    <div className="main-content">
      <div className="movie-category">
        <div className="movies-header">
          <h1 className="category-title" style={{ marginBottom: 0 }}>
            {getTitle()}
          </h1>
          
          <div className="content-type-filters" style={{ marginBottom: "20px" }}>
            <button 
              className={`btn ${contentType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setContentType('all')}
              style={{ marginRight: '10px' }}
            >
              All Content
            </button>
            <button 
              className={`btn ${contentType === 'movie' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setContentType('movie')}
              style={{ marginRight: '10px' }}
            >
              Movies
            </button>
            <button 
              className={`btn ${contentType === 'series' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setContentType('series')}
            >
              Series
            </button>
          </div>
          
          <div className="movies-count">
            Showing {displayContent.length} of {totalContent} {contentType === 'all' ? 'items' : contentType + (contentType === 'movie' ? 's' : '')}
          </div>
        </div>

        {loading && displayContent.length === 0 ? (
          <LoadingSpinner message={`Loading ${contentType === 'all' ? 'content' : getTitle().toLowerCase()}...`} />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => {
              if (contentType === 'movie') {
                fetchMovies(currentPage);
              } else if (contentType === 'series') {
                fetchSeries(currentPage);
              } else {
                fetchContent(currentPage);
              }
            }}
          />
        ) : (
          <>
            {displayContent.length > 0 ? (
              <>
                <div className="movies-container">
                  {displayContent.map((content) => (
                    <MovieCard key={content.id} movie={content} />
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
                <p className="no-results-text">No {contentType === 'all' ? 'content' : getTitle().toLowerCase()} found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
