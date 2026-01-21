import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie, size = "medium" }) => {
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

  const getType = (type) => {
    if (!type) return null;
    return (
      <div className="content-type-badge">
        <span>{type === "series" ? "📺" : "🎬"}</span>
      </div>
    );
  };

  const getInfo = (content) => {
    if (content.type === "series") {
      return {
        year: content.releaseYear,
        detail: `${getYear(content.releaseYear)} - ${content.seasons || 1} Season${(content.seasons || 1) > 1 ? "s" : ""}`,
        link: `/series/${content.id}`,
      };
    }
    return {
      year: content.releaseYear,
      detail: `${getYear(content.releaseYear)}`,
      link: `/movie/${content.id}`,
    };
  };

  const contentInfo = getInfo(movie);
  const cardStyle = size === "small" ? "small-card" : "movie-card";
  const posterHeight = size === "small" ? "150px" : "300px";

  return (
    <Link to={contentInfo.link} className={cardStyle}>
      <div className="movie-poster-container">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
          style={{ height: posterHeight }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
          }}
        />
        {getType(movie.type)}
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <p className="movie-year">{contentInfo.detail}</p>
        {getRating(movie.rating)}
      </div>
    </Link>
  );
};

export default MovieCard;
