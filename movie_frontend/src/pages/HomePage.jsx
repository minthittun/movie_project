import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useContentStore from "../store/movieStore";
import MovieRow from "../components/MovieRow";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const HomePage = () => {
  const {
    content,
    trendingContent,
    loading,
    error,
    fetchContent,
    fetchTrendingContent,
  } = useContentStore();

  useEffect(() => {
    fetchContent();
    fetchTrendingContent();
  }, [fetchContent, fetchTrendingContent]);

  const featuredContent =
    (trendingContent && trendingContent.length > 0 ? trendingContent[0] : null) ||
    (content && content.length > 0 ? content[0] : null);

  if (error) {
    return (
      <div className="main-content">
        <ErrorMessage
          message={error}
          onRetry={() => {
            fetchContent();
            fetchTrendingContent();
          }}
        />
      </div>
    );
  }

  const getFeaturedLink = (content) => {
    if (content.type === 'series') {
      return `/series/${content.id}`;
    }
    return `/movie/${content.id}`;
  };

  return (
    <div className="main-content" style={{ marginTop: 0 }}>
      {featuredContent && (
        <section className="hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${featuredContent.backdropUrl})`,
            }}
          />
          <div className="hero-content">
            <h1 className="hero-title">{featuredContent.title}</h1>
            <p className="hero-description">
              {featuredContent.description ||
                "Discover amazing movies and TV shows in our vast collection."}
            </p>
            <div className="hero-buttons">
              <Link
                to={getFeaturedLink(featuredContent)}
                className="btn btn-primary"
              >
                <span>▶</span>
                <span>Watch Now</span>
              </Link>
              <Link to="/movies" className="btn btn-secondary">
                <span>ℹ</span>
                <span>Browse Content</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <MovieRow
        title="Trending Now"
        movies={trendingContent}
        loading={loading}
        scrollable={true}
      />

      <MovieRow
        title="Browse Content"
        movies={content}
        loading={loading}
        scrollable={true}
      />
    </div>
  );
};

export default HomePage;
