import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie, size = "medium" }) => {
  // const getPosterUrl = (posterPath) => {
  //   if (!posterPath)
  //     return "https://via.placeholder.com/300x450?text=No+Poster";
  //   // Check if it's already a full URL or just a path
  //   if (posterPath.startsWith("http")) return posterPath;
  //   return `https://image.tmdb.org/t/p/w500${posterPath}`;
  // };

  const getYear = (releaseYear) => {
    if (!releaseYear) return "N/A";
    return releaseYear;
  };

  const getRating = (rating) => {
    if (!rating) return null;
    return (
      <div className="movie-rating">
        <span className="star">★</span>
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  const cardStyle = size === "small" ? "small-card" : "movie-card";
  const posterHeight = size === "small" ? "150px" : "300px";

  return (
    <Link to={`/movie/${movie.id}`} className={cardStyle}>
      <div className="movie-poster-container">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
          style={{ height: posterHeight }}
          // onError={(e) => {
          //   e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
          // }}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <p className="movie-year">{getYear(movie.releaseYear)}</p>
        {getRating(movie.rating)}
      </div>
    </Link>
  );
};

export default MovieCard;
