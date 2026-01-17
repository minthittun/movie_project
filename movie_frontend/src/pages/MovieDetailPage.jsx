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
    }
  }, [id, fetchMovieById]);

  // const getPosterUrl = (posterPath) => {
  //   if (!posterPath) return 'https://via.placeholder.com/300x450?text=No+Poster';
  //   // Check if it's already a full URL or just a path
  //   if (posterPath.startsWith('http')) return posterPath;
  //   return `https://image.tmdb.org/t/p/w500${posterPath}`;
  // };

  // const getBackdropUrl = (backdropPath) => {
  //   if (!backdropPath)
  //     return "https://via.placeholder.com/1920x1080?text=No+Backdrop";
  //   // Check if it's already a full URL or just a path
  //   if (backdropPath.startsWith("http")) return backdropPath;
  //   return `https://image.tmdb.org/t/p/original${backdropPath}`;
  // };

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
        className="hero-bg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${selectedMovie.backdropUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.2)",
          zIndex: -1,
        }}
      />

      <div className="movie-detail">
        <div className="movie-detail-header">
          <img
            src={selectedMovie.posterUrl}
            alt={selectedMovie.title}
            className="movie-detail-poster"
            // onError={(e) => {
            //   e.target.src =
            //     "https://via.placeholder.com/300x450?text=No+Poster";
            // }}
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

              {getGenres(selectedMovie.genre) && (
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

            <div className="hero-buttons">
              {/* <button className="btn btn-primary">
                <span>▶</span>
                <span>Watch Now</span>
              </button>
              <button className="btn btn-secondary">
                <span>➕</span>
                <span>Add to List</span>
              </button> */}
              <Link to="/movies" className="btn btn-secondary">
                <span>←</span>
                <span>Back to Movies</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
