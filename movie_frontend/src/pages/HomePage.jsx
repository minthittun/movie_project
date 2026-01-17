import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useMovieStore from "../store/movieStore";
import MovieRow from "../components/MovieRow";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = () => {
  const {
    movies,
    trendingMovies,
    loading,
    error,
    fetchMovies,
    fetchTrendingMovies,
  } = useMovieStore();

  useEffect(() => {
    fetchMovies();
    fetchTrendingMovies();
  }, [fetchMovies, fetchTrendingMovies]);

  const featuredMovie = (trendingMovies && trendingMovies.length > 0 ? trendingMovies[0] : null) || 
                     (movies && movies.length > 0 ? movies[0] : null);

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage
          message={error}
          onRetry={() => {
            fetchMovies();
            fetchTrendingMovies();
          }}
        />
      </div>
    );
  }

  return (
    <div className="main-content">
      {featuredMovie && (
        <section className="hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${featuredMovie.backdropUrl})`,
            }}
          />
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">
              {featuredMovie.description ||
                "Discover amazing movies and TV shows in our vast collection."}
            </p>
            <div className="hero-buttons">
              <Link
                to={`/movie/${featuredMovie.id}`}
                className="btn btn-primary"
              >
                <span>▶</span>
                <span>Watch Now</span>
              </Link>
              <Link to="/movies" className="btn btn-secondary">
                <span>ℹ</span>
                <span>More Movies</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <MovieRow
        title="Trending Now"
        movies={trendingMovies}
        loading={loading}
        scrollable={true}
      />

      <MovieRow
        title="Movies"
        movies={movies}
        loading={loading}
        scrollable={true}
      />
    </div>
  );
};

export default HomePage;
