import React, { useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useMovieStore from "../store/movieStore";

const Header = () => {
  const { searchQuery, searchMovies, clearSearch } = useMovieStore();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [localQuery, setLocalQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setLocalQuery("");
    }
  }, [location.pathname]);

  const debouncedSearch = useCallback(
    (query) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (query.trim()) {
          searchMovies(query);
          if (location.pathname !== "/search") {
            navigate("/search");
          }
        } else {
          clearSearch();
          if (location.pathname === "/search") {
            navigate("/");
          }
        }
      }, 300);
    },
    [searchMovies, clearSearch, navigate, location.pathname],
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      searchMovies(localQuery);
      if (location.pathname !== "/search") {
        navigate("/search");
      }
    }
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    clearSearch();
    if (location.pathname === "/search") {
      navigate("/");
    }
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""} ${isSearchFocused ? "search-focused" : ""}`}
    >
      <div className="header-content">
        <Link to="/" className="logo">
          MovieFlix
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/movies"
                className={location.pathname === "/movies" ? "active" : ""}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className={location.pathname === "/search" ? "active" : ""}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>

        <form className="search-container" onSubmit={handleSearchSubmit}>
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={localQuery}
              onChange={handleInputChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKeyDown}
              aria-label="Search movies"
            />
            {localQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-icon"
            aria-label="Search"
            title="Search"
          >
            🔍
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
