import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MovieListingPage from "./components/MovieListingPage";
import ReviewSection from "./components/ReviewSection";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies" element={<MovieListingPage />} />
        <Route path="/movie/:id" element={<ReviewSection />} />
        <Route path="/" element={<Navigate to="/movies" />} />
      </Routes>
    </Router>
  );
};

export default App;
