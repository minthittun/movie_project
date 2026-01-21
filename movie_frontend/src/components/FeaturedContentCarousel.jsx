import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedContentCarousel.css';

const FeaturedContentCarousel = ({ featuredMovie, featuredSeries }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [];

  if (featuredMovie) {
    slides.push({ ...featuredMovie, slideType: 'movie' });
  }
  if (featuredSeries) {
    slides.push({ ...featuredSeries, slideType: 'series' });
  }

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) return null;

  const currentContent = slides[currentSlide];
  const getFeaturedLink = (content) => {
    if (content.slideType === "series" || content.type === "series") {
      return `/series/${content.id}`;
    }
    return `/movie/${content.id}`;
  };

  const getContentType = (content) => {
    if (content.slideType === "series" || content.type === "series") {
      return "Series";
    }
    return "Movie";
  };

  return (
    <section className="featured-carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.backdropUrl})`,
            }}
          >
            <div className="carousel-slide-overlay" />
          </div>
        ))}
        
        <div className="carousel-content">
          <div className="carousel-text">
            <span className="featured-badge">
              {getContentType(currentContent)} • Featured
            </span>
            <h1 className="carousel-title">{currentContent.title}</h1>
            <p className="carousel-description">
              {currentContent.description ||
                "Discover amazing movies and TV shows in our vast collection."}
            </p>
            {currentContent.rating && (
              <div className="carousel-meta">
                <span className="rating">⭐ {currentContent.rating.toFixed(1)}</span>
                {currentContent.releaseYear && (
                  <span className="year">{currentContent.releaseYear}</span>
                )}
                {currentContent.genre && currentContent.genre.length > 0 && (
                  <span className="genre">{currentContent.genre[0]}</span>
                )}
              </div>
            )}
            <div className="carousel-buttons">
              <Link
                to={getFeaturedLink(currentContent)}
                className="btn btn-primary"
              >
                <span>▶</span>
                <span>Watch Now</span>
              </Link>
              <Link to={getFeaturedLink(currentContent)} className="btn btn-secondary">
                <span>ℹ</span>
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedContentCarousel;