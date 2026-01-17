import React from "react";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, movies, loading, scrollable = false }) => {
  if (loading) {
    return (
      <div className="movie-category">
        <h2 className="category-title">{title}</h2>
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  // const containerClass = scrollable ? "movies-scroll" : "movies-container";

  return (
    <div className="movie-category">
      <h2 className="category-title">{title}</h2>
      <div className={"movies-container"}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size={"medium"} />
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
