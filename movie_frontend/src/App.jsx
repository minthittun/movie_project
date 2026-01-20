import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import SearchPage from "./pages/SearchPage";
import ContentDetailPage from "./pages/ContentDetailPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import "./styles/index.css";
import "./styles/movieDetail.css";
import "./styles/content.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/content/:id" element={<ContentDetailPage />} />
        <Route path="/series/:id" element={<ContentDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
