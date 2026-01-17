import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useMovieStore from "../store/movieStore";

const MovieDetailPage = () => {
  const { id } = useParams();
  const { selectedMovie, loading, error, fetchMovieById } = useMovieStore();

  useEffect(() => {
    if (id) {
      fetchMovieById(id);
      window.scrollTo(0, 0); // Scroll to top when loading new movie
    }
  }, [id, fetchMovieById]);

  const getYear = (releaseYear) => {
    if (!releaseYear) return "N/A";
    return releaseYear;
  };

  const getRuntime = (duration) => {
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const getGenres = (genre) => {
    if (!genre || !Array.isArray(genre)) return [];
    return genre.join(", ");
  };

  if (loading) {
    return (
      <div className="main-content">
        <LoadingSpinner message="Loading movie details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage message={error} onRetry={() => fetchMovieById(id)} />
      </div>
    );
  }

  if (!selectedMovie) {
    return (
      <div className="main-content">
        <div className="error">
          <p className="error-message">Movie not found</p>
          <Link to="/movies" className="btn btn-primary">
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div
        className="movie-detail-backdrop"
        style={{
          backgroundImage: `url(${selectedMovie.backdropUrl})`,
        }}
      />

      <div className="movie-detail">
        <div className="hero-buttons top-buttons">
          <Link to="/movies" className="btn btn-secondary">
            <span>←</span>
            <span>Back to Movies</span>
          </Link>
        </div>
        {/* Desktop Layout - Side by Side */}
        <div className="movie-detail-header">
          <img
            src={selectedMovie.posterUrl}
            alt={selectedMovie.title}
            className="movie-detail-poster"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
            }}
          />

          <div className="movie-detail-info">
            <h1 className="movie-detail-title">{selectedMovie.title}</h1>

            <div className="movie-detail-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>{getYear(selectedMovie.releaseYear)}</span>
              </div>

              <div className="meta-item">
                <span>⏱️</span>
                <span>{getRuntime(selectedMovie.duration)}</span>
              </div>

              <div className="meta-item">
                <span>⭐</span>
                <span>{selectedMovie.rating?.toFixed(1) || "N/A"}</span>
              </div>

              {selectedMovie.genre && getGenres(selectedMovie.genre) && (
                <div className="meta-item">
                  <span>🎭</span>
                  <span>{getGenres(selectedMovie.genre)}</span>
                </div>
              )}

              {selectedMovie.director && (
                <div className="meta-item">
                  <span>🎬</span>
                  <span>{selectedMovie.director}</span>
                </div>
              )}
            </div>

            <p className="movie-detail-description">
              {selectedMovie.description || "No description available."}
            </p>

            {selectedMovie.trailerUrl && (
              <div className="movie-trailer-section">
                <h3>Trailer</h3>
                <div className="trailer-container">
                  <iframe
                    src={selectedMovie.trailerUrl.replace('watch?v=', 'embed/')}
                    title={`${selectedMovie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="trailer-iframe"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout - Compact with Poster on the Left */}
        <div className="movie-detail-mobile-layout">
          <div className="movie-detail-mobile-header">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="movie-detail-mobile-poster"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
              }}
            />

            <div className="movie-detail-mobile-info">
              <h1 className="movie-detail-title">{selectedMovie.title}</h1>

              <div className="movie-detail-meta">
                <div className="meta-item">
                  <span>📅</span>
                  <span>{getYear(selectedMovie.releaseYear)}</span>
                </div>

                <div className="meta-item">
                  <span>⏱️</span>
                  <span>{getRuntime(selectedMovie.duration)}</span>
                </div>

                <div className="meta-item">
                  <span>⭐</span>
                  <span>{selectedMovie.rating?.toFixed(1) || "N/A"}</span>
                </div>

                {selectedMovie.genre && getGenres(selectedMovie.genre) && (
                  <div className="meta-item">
                    <span>🎭</span>
                    <span>{getGenres(selectedMovie.genre)}</span>
                  </div>
                )}

                {selectedMovie.director && (
                  <div className="meta-item">
                    <span>🎬</span>
                    <span>{selectedMovie.director}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="movie-detail-description">
            {selectedMovie.description || "No description available."}
          </p>

          {selectedMovie.trailerUrl && (
            <div className="movie-trailer-section">
              <h3>Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={selectedMovie.trailerUrl.replace('watch?v=', 'embed/')}
                  title={`${selectedMovie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="trailer-iframe"
                />
              </div>
            </div>
          )}

          {/* Optional: Horizontal scroll posters section */}
          {selectedMovie.images && selectedMovie.images.length > 1 && (
            <div className="movie-detail-poster-container">
              {selectedMovie.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${selectedMovie.title} ${index + 1}`}
                  className="movie-detail-poster-mobile"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x180?text=No+Image";
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
