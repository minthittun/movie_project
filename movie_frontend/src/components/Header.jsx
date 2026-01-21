import React, { useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useContentStore from "../store/movieStore";

const Header = () => {
  const { searchQuery, searchContent, clearSearch } = useContentStore();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [localQuery, setLocalQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
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
          searchContent(query);
          if (location.pathname !== "/search") {
            navigate(`/search?q=${encodeURIComponent(query)}`);
          }
        } else {
          clearSearch();
          if (location.pathname === "/search") {
            navigate("/");
          }
        }
      }, 300);
    },
    [searchContent, clearSearch, navigate, location.pathname],
  );

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      searchContent(localQuery);
      if (location.pathname !== "/search") {
        navigate(`/search?q=${encodeURIComponent(localQuery)}`);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`header ${isScrolled ? "scrolled" : ""} ${isSearchFocused ? "search-focused" : ""}`}
      >
        <div className="header-content">
          <Link to="/" className="logo">
            CineHub
          </Link>

          <nav className="desktop-nav">
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
                  to="/series"
                  className={location.pathname === "/series" ? "active" : ""}
                >
                  Series
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
                placeholder="Search ..."
                value={localQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleKeyDown}
                aria-label="Search ..."
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

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={closeMobileMenu}
      >
        <div
          className="mobile-menu-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-header">
            <div className="mobile-menu-title">Menu</div>
            <button
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <div className="mobile-nav-items">
            <ul>
              <li>
                <Link
                  to="/"
                  className={location.pathname === "/" ? "active" : ""}
                  onClick={closeMobileMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className={location.pathname === "/movies" ? "active" : ""}
                  onClick={closeMobileMenu}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/series"
                  className={location.pathname === "/series" ? "active" : ""}
                  onClick={closeMobileMenu}
                >
                  Series
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className={location.pathname === "/search" ? "active" : ""}
                  onClick={closeMobileMenu}
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
