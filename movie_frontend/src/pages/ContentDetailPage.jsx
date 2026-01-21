import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useContentStore from "../store/movieStore";
import useDocumentTitle from "../hooks/useDocumentTitle";

const ContentDetailPage = () => {
  const { id } = useParams();
  const { selectedContent, loading, error, fetchContentById } = useContentStore();

  useEffect(() => {
    if (id) {
      fetchContentById(id);
      window.scrollTo(0, 0);
    }
  }, [id, fetchContentById]);

  const getYear = (releaseYear) => {
    if (!releaseYear) return "N/A";
    return releaseYear;
  };

  const getRuntime = (duration, seasons, episodes, type) => {
    if (type === 'series') {
      if (!seasons) return "N/A";
      return `${seasons} Season${seasons > 1 ? 's' : ''}${episodes ? ` • ${episodes} Episode${episodes > 1 ? 's' : ''}` : ''}`;
    }
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const getGenres = (genre) => {
    if (!genre || !Array.isArray(genre)) return [];
    return genre.join(", ");
  };

  const getCreator = (creator, director, type) => {
    if (type === 'series') {
      return creator || "Unknown";
    }
    return director || "Unknown";
  };

  const getBackLink = (type) => {
    if (type === 'series') {
      return "/series";
    }
    return "/movies";
  };

  if (loading) {
    return (
      <div className="main-content">
        <LoadingSpinner message="Loading content details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage message={error} onRetry={() => fetchContentById(id)} />
      </div>
    );
  }

  if (!selectedContent) {
    useDocumentTitle("Content Not Found");
    return (
      <div className="main-content">
        <div className="error">
          <p className="error-message">Content not found</p>
          <Link to="/movies" className="btn btn-primary">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const contentType = selectedContent.type || 'movie';
  const isSeries = contentType === 'series';

  // Set dynamic title with content title and type
  useDocumentTitle(`${selectedContent.title} (${isSeries ? 'Series' : 'Movie'})`);

  return (
    <div className="main-content">
      <div
        className="movie-detail-backdrop"
        style={{
          backgroundImage: `url(${selectedContent.backdropUrl})`,
        }}
      />

      <div className="movie-detail">
        <div className="hero-buttons top-buttons">
          <Link to={getBackLink(contentType)} className="btn btn-secondary">
            <span>←</span>
            <span>Back to {isSeries ? 'Series' : 'Movies'}</span>
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="movie-detail-header">
          <img
            src={selectedContent.posterUrl}
            alt={selectedContent.title}
            className="movie-detail-poster"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
            }}
          />

          <div className="movie-detail-info">
            <h1 className="movie-detail-title">{selectedContent.title}</h1>

            <div className="movie-detail-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>{getYear(selectedContent.releaseYear)}</span>
              </div>

              {selectedContent.endYear && isSeries && (
                <div className="meta-item">
                  <span>🏁</span>
                  <span>{getYear(selectedContent.endYear)}</span>
                </div>
              )}

              <div className="meta-item">
                <span>{isSeries ? '📺' : '⏱️'}</span>
                <span>{getRuntime(selectedContent.duration, selectedContent.seasons, selectedContent.episodes, contentType)}</span>
              </div>

              <div className="meta-item">
                <span>⭐</span>
                <span>{selectedContent.rating?.toFixed(1) || "N/A"}</span>
              </div>

              {selectedContent.genre && getGenres(selectedContent.genre) && (
                <div className="meta-item">
                  <span>🎭</span>
                  <span>{getGenres(selectedContent.genre)}</span>
                </div>
              )}

              <div className="meta-item">
                <span>🏷️</span>
                <span className="content-type-badge">{isSeries ? 'TV Series' : 'Movie'}</span>
              </div>

              {getCreator(selectedContent.creator, selectedContent.director, contentType) && (
                <div className="meta-item">
                  <span>{isSeries ? '👨‍💼' : '🎬'}</span>
                  <span>{getCreator(selectedContent.creator, selectedContent.director, contentType)}</span>
                </div>
              )}

              {selectedContent.cast && selectedContent.cast.length > 0 && (
                <div className="meta-item">
                  <span>🎭</span>
                  <span>{selectedContent.cast.slice(0, 3).join(", ")}{selectedContent.cast.length > 3 ? '...' : ''}</span>
                </div>
              )}

              {selectedContent.status && (
                <div className="meta-item">
                  <span>📊</span>
                  <span>{selectedContent.status}</span>
                </div>
              )}
            </div>

            <p className="movie-detail-description">
              {selectedContent.description || "No description available."}
            </p>

            {selectedContent.trailerUrl && (
              <div className="movie-trailer-section">
                <h3>Trailer</h3>
                <div className="trailer-container">
                  <iframe
                    src={selectedContent.trailerUrl.replace('watch?v=', 'embed/')}
                    title={`${selectedContent.title} Trailer`}
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

        {/* Mobile Layout */}
        <div className="movie-detail-mobile-layout">
          <div className="movie-detail-mobile-header">
            <img
              src={selectedContent.posterUrl}
              alt={selectedContent.title}
              className="movie-detail-mobile-poster"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
              }}
            />

            <div className="movie-detail-mobile-info">
              <h1 className="movie-detail-title">{selectedContent.title}</h1>

              <div className="movie-detail-meta">
                <div className="meta-item">
                  <span>📅</span>
                  <span>{getYear(selectedContent.releaseYear)}</span>
                </div>

                <div className="meta-item">
                  <span>{isSeries ? '📺' : '⏱️'}</span>
                  <span>{getRuntime(selectedContent.duration, selectedContent.seasons, selectedContent.episodes, contentType)}</span>
                </div>

                <div className="meta-item">
                  <span>⭐</span>
                  <span>{selectedContent.rating?.toFixed(1) || "N/A"}</span>
                </div>

                <div className="meta-item">
                  <span>🏷️</span>
                  <span className="content-type-badge">{isSeries ? 'TV Series' : 'Movie'}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="movie-detail-description">
            {selectedContent.description || "No description available."}
          </p>

          {selectedContent.trailerUrl && (
            <div className="movie-trailer-section">
              <h3>Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={selectedContent.trailerUrl.replace('watch?v=', 'embed/')}
                  title={`${selectedContent.title} Trailer`}
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
    </div>
  );
};

export default ContentDetailPage;