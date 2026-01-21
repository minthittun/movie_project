import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useContentStore from "../store/movieStore";
import MovieRow from "../components/MovieRow";
import FeaturedContentCarousel from "../components/FeaturedContentCarousel";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import useDocumentTitle from "../hooks/useDocumentTitle";

const HomePage = () => {
  const {
    trendingMovies,
    trendingSeries,
    loading,
    error,
    fetchTrendingMovies,
    fetchTrendingSeries,
  } = useContentStore();

  useEffect(() => {
    fetchTrendingMovies();
    fetchTrendingSeries();
  }, [fetchTrendingMovies, fetchTrendingSeries]);

  useDocumentTitle("Home");

  const featuredMovie = trendingMovies && trendingMovies.length > 0 ? trendingMovies[0] : null;
  const featuredSeries = trendingSeries && trendingSeries.length > 0 ? trendingSeries[0] : null;

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage
          message={error}
          onRetry={() => {
            fetchTrendingMovies();
            fetchTrendingSeries();
          }}
        />
      </div>
    );
  }

  return (
    <div className="main-content" style={{ marginTop: 0 }}>
      {(featuredMovie || featuredSeries) && (
        <FeaturedContentCarousel
          featuredMovie={featuredMovie}
          featuredSeries={featuredSeries}
        />
      )}

      <MovieRow
        title="Trending Movies"
        movies={trendingMovies}
        loading={loading}
        scrollable={true}
      />

      <MovieRow
        title="Trending Series"
        movies={trendingSeries}
        loading={loading}
        scrollable={true}
      />
    </div>
  );
};

export default HomePage;
